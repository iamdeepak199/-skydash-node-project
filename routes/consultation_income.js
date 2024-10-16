const express = require('express');
const router = express.Router();
const getDb = require('../config/database'); // Adjust the path if necessary

// GET request for /userdata
router.get('/consultation_income', async (req, res) => {
    try {
        let page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        const db = getDb(); // Call the function to get the db connection

        // Check if db is defined
        if (!db) {
            console.error('Database connection is not defined.');
            return res.status(500).send('Database connection is not available.');
        }

        // Query to fetch paginated data
        const [results] = await db.query(`SELECT * FROM consultation_log LIMIT ? OFFSET ?`, [limit, offset]);

        // Query to get the total count of records
        const [countResult] = await db.query('SELECT COUNT(*) AS count FROM consultation_log');
        const totalItems = countResult[0].count;
        const totalPages = Math.ceil(totalItems / limit);  // Calculating total pages

        // Render the EJS view and pass the data
        res.render('consultation_income', {
            consultation_log: results,
            currentPage: page,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        });
    } catch (err) {
        console.error('Error querying the database:', err);
        res.status(500).send('Server Error');
    }
});

module.exports = router; // Don't forget to export the router
