require('dotenv').config();
const express = require('express');
const cors = require('cors');

const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/post');

// Initialize server
const app = express();
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors(
    {
        credentials: true,
        origin: '*',
    }
));
app.use(express.json())
app.use(userRoute);
app.use(authRoute);
app.use(postRoute);

// Error handling middleware
app.use((err, req, res, next) => {
    if (err) {
        // Set status code error
        err.statusCode = err.statusCode ?? 500;

        // Set error dari err.errors
        let errors = (typeof val === 'string') ? JSON.parse(err.errors) : err.errors;

        res.status(err.statusCode).json({
            code: err.statusCode,
            message: err.message,
            errors
        });
    }
});

// Response 404 middleware
app.use((req, res) => {
    res.status(404).json({
        code: 404,
        message: "Not Found"
    });
});


app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});