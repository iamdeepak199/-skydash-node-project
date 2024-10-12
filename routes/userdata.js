const express = require('express');
const router = express.Router();
const getDb = require('../config/database'); // Adjust the path if necessary

// GET request for /userdata
router.get('/userdata', async (req, res) => {
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
        res.render('userdata', {
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

// POST request for updating a row
router.post('/update-row', async (req, res) => {
    const updatedData = req.body;

    // Call the function to get the db connection
    const db = getDb();

    // Check if db is defined
    if (!db) {
        console.error('Database connection is not defined.');
        return res.status(500).send('Database connection is not available.');
    }

    // Example query, customize it based on your table structure
    const sql = `
        UPDATE consultation_log 
        SET user_id = ?, get_income_from_id = ?, income = ?, package = ?, level = ?, status = ?, updated_date = NOW()
        WHERE id = ?
    `;

    // Example: Using MySQL connection, make sure to order the values correctly
    try {
        const [result] = await db.query(sql, [
            updatedData.user_id,
            updatedData.get_income_from_id,
            updatedData.income,
            updatedData.package,
            updatedData.level,
            updatedData.status,
            updatedData.id
        ]);

        if (result.affectedRows > 0) {
            res.json({ success: true, message: 'Row updated successfully' });
        } else {
            res.json({ success: false, message: 'No rows updated, check the ID' });
        }
    } catch (err) {
        console.error('Failed to update the row:', err);
        res.json({ success: false, message: 'Failed to update the row' });
    }
});

module.exports = router; // Don't forget to export the router
