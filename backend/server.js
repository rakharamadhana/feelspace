const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const dotenv = require('dotenv');
const axios = require('axios');

// Define a new base route for the API
const apiRouter = express.Router();

// Load environment variables from .env file
dotenv.config();

// Log the environment and database details for debugging
const env = process.env.NODE_ENV || 'development';
console.log(`Environment: ${env}`);
console.log(`Database Host: ${process.env.DATABASE_HOST}`);
console.log(`Database User: ${process.env.DATABASE_USER}`);
console.log(`Database Name: ${process.env.DATABASE_NAME}`);
console.log(`CORS Origin: ${process.env.CORS_ORIGIN}`);

const app = express();
const port = process.env.PORT;

// Configure CORS based on environment variable
const corsOptions = {
    origin: process.env.CORS_ORIGIN, // Use the CORS_ORIGIN environment variable
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
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
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).send('Unauthorized: No token provided');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).send('Unauthorized: Invalid token');
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send('Unauthorized: Invalid token');
        }

        req.user = decoded;  // assuming the token contains user data
        next();
    });
};

// Define the getGeoLocation function to get location based on IP
// The getGeoLocation function
function getGeoLocation(ip, callback) {
    const url = `https://ipinfo.io/${ip}/geo`;

    axios.get(url)
        .then(response => {
            const info = response.data;
            callback(`${info.city}, ${info.country}`);
        })
        .catch(error => {
            console.error('Error fetching geolocation:', error);
            callback("Unknown");
        });
}

apiRouter.post('/login', (req, res) => {
    console.log('Login request received:', req.body);
    const { email, password } = req.body;
    const device_type = req.headers['user-agent']; // Capture the device type from the User-Agent header
    const last_login_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; // Capture the IP address

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
                const token = jwt.sign({ id: user.id, role: user.role_name }, process.env.JWT_SECRET, { expiresIn: '1h' });

                // Fetch the user's geolocation based on IP address
                getGeoLocation(last_login_ip, (last_login_location) => {
                    // Update user's last login information
                    const updateQuery = `
                        UPDATE users
                        SET last_login_at = CURRENT_TIMESTAMP, last_login_ip = ?, last_login_location = ?, device_type = ?
                        WHERE id = ?
                    `;
                    db.query(updateQuery, [last_login_ip, last_login_location, device_type, user.id], (updateErr) => {
                        if (updateErr) {
                            console.error('Error updating last login info:', updateErr);
                        }
                    });

                    res.json({ token, role: user.role_name, name: user.name, email: user.email });
                });
            } else {
                res.status(401).send('Invalid password');
            }
        } else {
            res.status(404).send('User not found');
        }
    });
});

apiRouter.post('/register', (req, res) => {
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

apiRouter.put('/users/:id', verifyToken, (req, res) => {
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

apiRouter.post('/change-password', verifyToken, (req, res) => {
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

apiRouter.post('/change-profile', verifyToken, (req, res) => {
    const { newName, newEmail } = req.body;

    db.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [newName, newEmail, req.user.id], (err, results) => {
        if (err) {
            return res.status(500).send('Error updating profile');
        }
        res.status(200).send('Profile updated successfully');
    });
});

apiRouter.get('/users', verifyToken, (req, res) => {
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

apiRouter.get('/roles', verifyToken, (req, res) => {
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

apiRouter.get('/cases', verifyToken,(req, res) => {
    const query = 'SELECT id, title, borderColor, textColor FROM cases';
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching case studies:', error);
            return res.status(500).send('Server error');
        }
        res.json(results);
    });
});

apiRouter.get('/cases/:id', verifyToken,(req, res) => {
    const caseId = req.params.id;  // Get the case ID from the URL
    const query = 'SELECT id, title, story, borderColor, textColor FROM cases WHERE id = ?';

    db.query(query, [caseId], (error, results) => {
        if (error) {
            console.error('Error fetching case study:', error);
            return res.status(500).send('Server error');
        }
        if (results.length === 0) {
            return res.status(404).send('Case not found');
        }
        res.json(results[0]);  // Return the first (and only) result
    });
});

// Endpoint to get characters for a specific case
apiRouter.get('/cases/:id/characters', verifyToken, (req, res) => {
    const caseId = req.params.id;

    const query = `
        SELECT id, character_name
        FROM case_characters
        WHERE case_id = ?
    `;

    db.query(query, [caseId], (error, results) => {
        if (error) {
            console.error('Error fetching characters:', error);
            return res.status(500).send('Server error');
        }

        res.status(200).json(results);
    });
});

apiRouter.get('/cases/details/:id', verifyToken, (req, res) => {
    const { id } = req.params; // id is case_id
    const userId = req.user.id; // userId is from the token

    const query = `
        SELECT * FROM case_details
        WHERE case_id = ? AND created_by = ?
    `;

    db.query(query, [id, userId], (error, results) => {
        if (error) {
            console.error('Error fetching case details:', error);
            return res.status(500).send('Server error');
        }

        if (results.length > 0) {
            res.status(200).json(results[0]); // Send the first result back
        } else {
            res.status(200).json(null); // No previous answers found
        }
    });
});

apiRouter.get('/cases/details/:id/:character_id', verifyToken, (req, res) => {
    const { id, character_id } = req.params;
    const created_by = req.user.id;

    const query = `
        SELECT * FROM case_details
        WHERE case_id = ? AND character_id = ? AND created_by = ?
    `;

    db.query(query, [id, character_id, created_by], (error, results) => {
        if (error) {
            console.error('Error fetching case details:', error);
            return res.status(500).send('Server error');
        }

        if (results.length > 0) {
            res.status(200).json(results[0]);
        } else {
            res.status(200).json(null);  // Return null if no previous answers exist
        }
    });
});

apiRouter.post('/cases/details/:id/:character_id/save', verifyToken, (req, res) => {
    const { id, character_id } = req.params;
    const { emotion, observe, feeling, need, request, reasoning, conclusion } = req.body;
    const created_by = req.user.id;

    const checkQuery = `
        SELECT id FROM case_details WHERE case_id = ? AND character_id = ? AND created_by = ?
    `;

    db.query(checkQuery, [id, character_id, created_by], (error, results) => {
        if (error) {
            console.error('Error checking existing record:', error);
            return res.status(500).send('Server error');
        }

        if (results.length > 0) {
            // Update existing record
            const updateQuery = `
                UPDATE case_details
                SET emotion = ?, observe = ?, feeling = ?, need = ?, request = ?, reasoning = ?, conclusion = ?, modified_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `;
            db.query(updateQuery, [emotion, observe, feeling, need, request, reasoning, conclusion, results[0].id], (updateError) => {
                if (updateError) {
                    console.error('Error updating case details:', updateError);
                    return res.status(500).send('Server error');
                }
                res.status(200).send('Case details updated successfully');
            });
        } else {
            // Insert new record with created_at and modified_at handled by default CURRENT_TIMESTAMP
            const insertQuery = `
                INSERT INTO case_details (case_id, character_id, emotion, observe, feeling, need, request, reasoning, conclusion, created_by, created_at, modified_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            `;
            db.query(insertQuery, [id, character_id, emotion, observe, feeling, need, request, reasoning, conclusion, created_by], (insertError) => {
                if (insertError) {
                    console.error('Error inserting case details:', insertError);
                    return res.status(500).send('Server error');
                }
                res.status(201).send('Case details saved successfully');
            });
        }
    });
});

// Use the /api base route for the API
app.use('/api', apiRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
