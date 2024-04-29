const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql');
const helmet = require('helmet');

const app = express();

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'none'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            fontSrc: ["'self'", "fonts.gstatic.com", "'data:'"], // Allow fonts from data URIs
            imgSrc: ["'self'"],
            scriptSrc: ["'self'"],
        },
    },
}));

// Parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Create a connection to your MySQL database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'new_user',
    password: 'password',
    port: 3306, // Specify the correct port here
    database: 'attendance_management',
    authPlugin: 'password' // Specify the authentication plugin
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});

// Serve login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Handle login POST request
app.post('/login', (req, res) => {
    const { username, password, role } = req.body;

    // Query to check if user exists in the database
    const query = `SELECT * FROM users WHERE username = ? AND role = ?`;

    // Execute the query
    connection.query(query, [username, role], (err, result) => {
        if (err) {
            console.error('Error executing query: ' + err.stack);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Check if user exists
        if (result.length > 0) {
            // User found, compare passwords
            const user = result[0];
            if (password === user.password) {
                // Passwords match, redirect to respective dashboard based on role
                switch (role) {
                    case 'student':
                        res.redirect('/student.html');
                        break;
                    case 'faculty':
                        res.redirect('/faculty.html');
                        break;
                    case 'admin':
                        res.redirect('/administrator.html');
                        break;
                    default:
                        res.status(400).send('Invalid role.');
                }
            } else {
                // Passwords do not match
                res.status(401).send('Invalid password.');
            }
        } else {
            // User not found
            res.status(401).send('Invalid username or role.');
        }
    });
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Handle requests to the root URL ("/")
app.get('/', (req, res) => {
    // Optionally, you can redirect or send a response here
    // Serve login page
    res.redirect('/login');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
