const express = require('express');
const path = require('path');

const app = express();

// Serve faculty.html
app.get('/faculty', (req, res) => {
    res.sendFile(path.join(__dirname, 'faculty.html'));
});

// Serve administrator.html
app.get('/administrator', (req, res) => {
    res.sendFile(path.join(__dirname, 'administrator.html'));
});

// Serve student.html
app.get('/student', (req, res) => {
    res.sendFile(path.join(__dirname, 'student.html'));
});

// Serve login.html when root URL is accessed
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});