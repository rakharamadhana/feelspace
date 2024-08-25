const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const dotenv = require('dotenv');
const axios = require('axios');
const multer = require('multer');
const fs = require('fs');

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

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
    let token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        // If no token in the Authorization header, check the database for a stored token
        const userId = req.user && req.user.id;
        if (userId) {
            const query = 'SELECT token FROM users WHERE id = ? AND active = 1';
            db.query(query, [userId], (err, results) => {
                if (err || results.length === 0) {
                    return res.status(401).send('Unauthorized: No token provided');
                }
                token = results[0].token;
                verifyTokenWithJWT(token, req, res, next);
            });
        } else {
            return res.status(401).send('Unauthorized: No token provided');
        }
    } else {
        verifyTokenWithJWT(token, req, res, next);
    }
};

// Setup Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const userId = req.user.id.toString(); // Convert the user ID to a string
        const currentDate = new Date().toISOString().split('T')[0]; // Get the current date in YYYY-MM-DD format

        const uploadDir = path.join(__dirname, 'uploads', userId, currentDate); // Construct the path as user_id/date

        // Create the directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        cb(null, uploadDir); // Set the upload directory
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`); // Use a unique filename
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // Set a limit for file size (5 MB in this case)
    }
});

const verifyTokenWithJWT = (token, req, res, next) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send('Unauthorized: Invalid token');
        }
        req.user = decoded;
        next();
    });
};

// Function to fetch geolocation based on IP address
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

apiRouter.post('/verify-token', (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).send('Token is required');
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send('Invalid token');
        }

        // If token is valid, return success status
        res.status(200).json({
            id: decoded.id,
            role: decoded.role,
            name: decoded.name,
            email: decoded.email
        });
    });
});

// Login route
apiRouter.post('/login', (req, res) => {
    console.log('Login request received:', req.body);
    const { email, password } = req.body;
    const device_type = req.headers['user-agent']; // Capture the device type from the User-Agent header
    const last_login_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; // Capture the IP address
    const rememberMe = req.body.rememberMe; // Capture the "remember me" flag from the request

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
                // Set token expiration based on "Remember Me" flag
                const tokenExpiration = rememberMe ? '7d' : '1h'; // 7 days if "remember me" is checked, otherwise 1 hour
                const token = jwt.sign({ id: user.id, role: user.role_name }, process.env.JWT_SECRET, { expiresIn: tokenExpiration });

                // Fetch the user's geolocation based on IP address
                getGeoLocation(last_login_ip, (last_login_location) => {
                    // Update user's last login information and save the token
                    const updateQuery = `
                        UPDATE users
                        SET last_login_at = CURRENT_TIMESTAMP, last_login_ip = ?, last_login_location = ?, device_type = ?, token = ?
                        WHERE id = ?
                    `;
                    db.query(updateQuery, [last_login_ip, last_login_location, device_type, token, user.id], (updateErr) => {
                        if (updateErr) {
                            console.error('Error updating last login info:', updateErr);
                            return res.status(500).send('Error updating login information');
                        }
                        res.json({ token, role: user.role_name, name: user.name, email: user.email });
                    });
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

apiRouter.get('/users/options', verifyToken, (req, res) => {
    const query = `
        SELECT id, name
        FROM users
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching user options:', err);
            return res.status(500).send('Server error');
        }
        res.status(200).json(results);
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

apiRouter.post('/roles', verifyToken, (req, res) => {
    // Only allow admins to create roles
    if (req.user.role !== 'Admin') {
        return res.status(403).send('Access forbidden: admins only');
    }

    // Extract the role name from the request body
    const { role_name } = req.body;

    // Simple validation: Check if role_name is provided
    if (!role_name) {
        return res.status(400).send('Role name is required');
    }

    // SQL query to insert the new role
    const query = `
        INSERT INTO roles (role_name) 
        VALUES (?)
    `;

    // Execute the query
    db.query(query, [role_name], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(201).json({ message: 'Role created successfully', roleId: results.insertId });
    });
});

apiRouter.get('/cases', verifyToken,(req, res) => {
    const query = 'SELECT id, title, borderColor, textColor, story FROM cases';
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching case studies:', error);
            return res.status(500).send('Server error');
        }
        res.json(results);
    });
});

apiRouter.post('/cases', verifyToken, (req, res) => {
    const { title, borderColor, textColor, story } = req.body;

    if (req.user.role !== 'Admin') {
        return res.status(403).send('Access forbidden: admins only');
    }

    const query = `
        INSERT INTO cases (title, borderColor, textColor, story)
        VALUES (?, ?, ?, ?)
    `;

    db.query(query, [title, borderColor, textColor, story], (error, results) => {
        if (error) {
            console.error('Error inserting case:', error);
            return res.status(500).send('Server error');
        }
        res.status(201).json({ message: 'Case created successfully', caseId: results.insertId });
    });
});

apiRouter.get('/cases/options', verifyToken, (req, res) => {
    const query = `
        SELECT id, title AS name
        FROM cases
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching case options:', err);
            return res.status(500).send('Server error');
        }
        res.status(200).json(results);
    });
});


apiRouter.put('/cases/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    const { title, borderColor, textColor, story } = req.body;

    if (req.user.role !== 'Admin') {
        return res.status(403).send('Access forbidden: admins only');
    }

    const query = `
        UPDATE cases
        SET title = ?, borderColor = ?, textColor = ?, story = ?
        WHERE id = ?
    `;

    db.query(query, [title, borderColor, textColor, story, id], (error, results) => {
        if (error) {
            console.error('Error updating case:', error);
            return res.status(500).send('Server error');
        }
        res.status(200).json({ message: 'Case updated successfully' });
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

apiRouter.get('/cases/:caseId/characters/options', verifyToken, (req, res) => {
    const { caseId } = req.params;

    const query = `
        SELECT id, character_name as name
        FROM case_characters
        WHERE case_id = ?
    `;

    db.query(query, [caseId], (error, results) => {
        if (error) {
            console.error('Error fetching characters for case:', error);
            return res.status(500).send('Server error');
        }
        res.status(200).json(results);
    });
});

apiRouter.get('/cases/:caseId/characters/:characterId/users/options', verifyToken, (req, res) => {
    const { caseId, characterId } = req.params;

    const query = `
        SELECT DISTINCT u.id, u.name 
        FROM case_details cd
        JOIN users u ON cd.created_by = u.id
        WHERE cd.case_id = ? AND cd.character_id = ?
    `;

    db.query(query, [caseId, characterId], (error, results) => {
        if (error) {
            console.error('Error fetching users for case and character:', error);
            return res.status(500).send('Server error');
        }
        res.status(200).json(results);
    });
});

apiRouter.get('/cases/details/all', verifyToken, (req, res) => {
    // Only allow Admins and Teachers to access all responses
    if (req.user.role !== 'Admin' && req.user.role !== 'Teacher') {
        return res.status(403).send('Access forbidden: admins and teachers only');
    }

    const query = `
        SELECT
            case_details.*,
            users.name AS created_by_name,
            case_characters.character_name
        FROM
            case_details
                JOIN
            users ON case_details.created_by = users.id
                JOIN
            case_characters ON case_details.character_id = case_characters.id
    `;

    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching case details:', error);
            return res.status(500).send('Server error');
        }
        res.status(200).json(results);
    });
});

apiRouter.get('/cases/details/all/:id', verifyToken, (req, res) => {
    const { id } = req.params; // id is case_id
    const { role } = req.user;

    // Only Admins and Teachers can access this data
    if (role !== 'Admin' && role !== 'Teacher') {
        return res.status(403).send('Access forbidden: Admins and Teachers only');
    }

    const query = `
        SELECT cd.id, cd.case_id, cd.character_id, cd.emotion, cd.reasoning, cd.observe, 
               cd.feeling, cd.need, cd.request, cd.conclusion, cd.created_at, u.name as created_by
        FROM case_details cd
        JOIN users u ON cd.created_by = u.id
        WHERE cd.case_id = ?
    `;

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error fetching case details:', err);
            return res.status(500).send('Server error');
        }
        res.json(results);
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

// Create a new card
apiRouter.post('/cards/save', verifyToken, upload.single('image'), (req, res) => {

    const { title, description } = req.body;
    const userId = req.user.id;  // Retrieve the userId from the decoded token

    // Construct the relative path to store in the database
    const relativeImagePath = path.join(userId.toString(), new Date().toISOString().split('T')[0], req.file.filename);

    if (!title || !description || !userId) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const query = 'INSERT INTO cards (title, image, image_path, description, user_id) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [title, req.file.filename, relativeImagePath, description, userId], (err, result) => {
        if (err) {
            console.error('Error inserting card into database:', err);
            return res.status(500).json({ error: 'Database error.' });
        }
        res.status(201).json({ message: 'Card created successfully.', cardId: result.insertId });
    });
});


// Fetch cards created by the logged-in user
apiRouter.get('/cards/user', verifyToken, (req, res) => {
    const userId = req.user.id; // Extract the user ID from the decoded JWT token

    const query = `
        SELECT id, title, image_path, description, created_at 
        FROM cards 
        WHERE user_id = ?
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching user cards:', err);
            return res.status(500).json({ error: 'Database error.' });
        }

        // Return the cards as a response
        res.status(200).json(results);
    });
});

// Use the /api base route for the API
app.use('/api', apiRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
