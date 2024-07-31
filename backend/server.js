const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sel-new'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database.');
});

// Middleware to verify token and extract user role
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'].split(' ')[1];
    if (!token) {
        return res.status(401).send('Unauthorized');
    }
    try {
        const decoded = jwt.verify(token, 'secretkey');
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).send('Unauthorized');
    }
};

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const query = `
        SELECT users.*, roles.role_name 
        FROM users 
        JOIN roles ON users.role_id = roles.id 
        WHERE email = ?
    `;

    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send(err);
        }
        if (results.length > 0) {
            const user = results[0];
            if (bcrypt.compareSync(password, user.password)) {
                const token = jwt.sign({ id: user.id, role: user.role_name }, 'secretkey', { expiresIn: '1h' });
                res.json({ token, role: user.role_name, name: user.name, email: user.email });
            } else {
                res.status(401).send('Invalid password');
            }
        } else {
            res.status(404).send('User not found');
        }
    });
});

app.post('/register', verifyToken, (req, res) => {
    const { email, password, role, name } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const roleQuery = 'SELECT id FROM roles WHERE role_name = ?';
    db.query(roleQuery, [role], (roleErr, roleResults) => {
        if (roleErr) {
            console.error('Error fetching role:', roleErr);
            return res.status(500).send(roleErr);
        }
        if (roleResults.length === 0) {
            return res.status(400).send('Invalid role');
        }
        const roleId = roleResults[0].id;

        const userQuery = 'INSERT INTO users (email, password, role_id, name) VALUES (?, ?, ?, ?)';
        db.query(userQuery, [email, hashedPassword, roleId, name], (userErr, userResults) => {
            if (userErr) {
                console.error('Error inserting user:', userErr);
                return res.status(500).send(userErr);
            }
            res.status(201).send('User registered successfully');
        });
    });
});

app.put('/users/:id', verifyToken, (req, res) => {
    if (req.user.role !== 'Admin') {
        return res.status(403).send('Access forbidden: admins only');
    }

    const { name, email, role, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const roleQuery = 'SELECT id FROM roles WHERE role_name = ?';
    db.query(roleQuery, [role], (roleErr, roleResults) => {
        if (roleErr) {
            console.error('Error fetching role:', roleErr);
            return res.status(500).send(roleErr);
        }
        if (roleResults.length === 0) {
            return res.status(400).send('Invalid role');
        }
        const roleId = roleResults[0].id;

        const userQuery = 'UPDATE users SET name = ?, email = ?, role_id = ?, password = ? WHERE id = ?';
        db.query(userQuery, [name, email, roleId, hashedPassword, req.params.id], (userErr, userResults) => {
            if (userErr) {
                console.error('Error updating user:', userErr);
                return res.status(500).send(userErr);
            }
            res.status(200).send('User updated successfully');
        });
    });
});

app.post('/change-password', verifyToken, (req, res) => {
    const { oldPassword, newPassword } = req.body;

    db.query('SELECT password FROM users WHERE id = ?', [req.user.id], (err, results) => {
        if (err) {
            return res.status(500).send('Error fetching user');
        }

        const user = results[0];
        if (!bcrypt.compareSync(oldPassword, user.password)) {
            return res.status(401).send('Old password is incorrect');
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 10);

        db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.user.id], (err, results) => {
            if (err) {
                return res.status(500).send('Error changing password');
            }
            res.status(200).send('Password changed successfully');
        });
    });
});

app.post('/change-profile', verifyToken, (req, res) => {
    const { newName, newEmail } = req.body;

    db.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [newName, newEmail, req.user.id], (err, results) => {
        if (err) {
            return res.status(500).send('Error updating profile');
        }
        res.status(200).send('Profile updated successfully');
    });
});

app.get('/users', verifyToken, (req, res) => {
    if (req.user.role !== 'Admin') {
        return res.status(403).send('Access forbidden: admins only');
    }

    const query = `
        SELECT users.id, users.name, users.email, roles.role_name
        FROM users
                 JOIN roles ON users.role_id = roles.id
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

app.get('/roles', verifyToken, (req, res) => {
    if (req.user.role !== 'Admin') {
        return res.status(403).send('Access forbidden: admins only');
    }

    const query = `
        SELECT * FROM roles
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
