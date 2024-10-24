// routes/popup_routes.js
const express = require('express');
const multer = require('multer');
const getDb = require('../config/database'); // Adjust the path to your database.js
const router = express.Router();

const upload = multer({ dest: 'uploads/' }); // Specify the directory for uploaded files

// POST route to handle form submission
router.post('/popup_settings', upload.single('content'), async (req, res) => {
    const enabled = req.body.enabled ? 1 : 0; // Convert checkbox to binary
    const contentType = req.body.content_type;
    const content = contentType === 'image' ? req.file.path : req.body.content; // Handle file or text

    const query = 'INSERT INTO popup_settings (enabled, content_type, content) VALUES (?, ?, ?)';

    try {
        const db = getDb(); // Get the database connection
        await db.query(query, [enabled, contentType, content]); // Use await for the query
        res.redirect('/'); // Redirect after successful submission
    } catch (err) {
        console.error('Error inserting data:', err);
        return res.status(500).send('Error saving data');
    }
});

module.exports = router;
