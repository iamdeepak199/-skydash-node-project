const express = require('express');
const router = express.Router();
const getDb = require('../config/database');

/*<--------------------------------------------------->Get Function For Fetching Row Data from DB<----------------------------------------------->*/

router.get('/userdata', async (req, res) => {
    try {
        let page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = 10;
        const offset = (page - 1) * limit;
        const db = getDb();

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

/*<------------------------------------------------------->Post Function For Update Row<--------------------------------------------------------->*/

router.post('/update-row', async (req, res) => {
    const updatedData = req.body;
    const db = getDb();

    if (!db) {
        console.error('Database connection is not defined.');
        return res.status(500).send('Database connection is not available.');
    }

    // Update Query 
    const sql = `
        UPDATE consultation_log 
        SET user_id = ?, get_income_from_id = ?, income = ?, package = ?, level = ?, status = ?, updated_date = NOW()
        WHERE id = ?
    `;

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

/*<------------------------------------------------------>Delete Function For Delete Row<--------------------------------------------------------->*/

router.get('/delete-user', (req, res) => {
    const userId = req.query.id;
    const db = getDb();

    if (!userId) {
        return res.status(400).send('User ID is required');
    }
    const deleteQuery = 'DELETE FROM consultation_log WHERE id = ?';  //table name IN DB -> consultation_log 

    db.query(deleteQuery, [userId], (err, result) => {
        if (err) {
            console.error('Error deleting user:', err);
            return res.status(500).send('Failed to delete user');
        }
        res.redirect('/userdata');
    });
});

module.exports = router; 