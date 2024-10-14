const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const db = require('../config/database');  // Import MySQL connection (create config/db.js for this)

// Set up file storage for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory for files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
    }
});

const upload = multer({ storage: storage });

// POST route to handle form submissions
router.post('/popup_settings', upload.single('imageFile'), (req, res) => {
    const { enablePopup, popup_settings, textContent } = req.body;
    const imageFile = req.file; // Contains the uploaded image file info if an image is uploaded

    let enablePopupValue = enablePopup ? true : false;
    let contentValue = popup_settings === 'text' ? textContent : null;
    let imageFileValue = imageFile ? imageFile.filename : null;

    // Insert data into the database
    const sql = `INSERT INTO popup_settings (enable_popup, content_type, content, image_file) 
                 VALUES (?, ?, ?, ?)`;

    db.query(sql, [enablePopupValue, popup_settings, contentValue, imageFileValue], (err, result) => {
        if (err) {
            console.error('Error saving popup settings:', err);
            res.status(500).send('Error saving data.');
        } else {
            console.log('Popup settings saved successfully');
            res.redirect('/success-page'); // Redirect to a success page or display success message
        }
    });
    res.render('Add_popup');
});

module.exports = router;
