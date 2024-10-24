const express = require('express');
const router = express.Router();
const getDb = require('../config/database'); // Adjust the path if necessary

// GET request for /Bulk_Approval
router.get('/Withdrawal_Report', async (req, res) => {
    try {
        let page = req.query.page ? parseInt(req.query.page) : 1; // Get the page number from query params
        const limit = 10; // Set limit for items per page
        const offset = (page - 1) * limit; // Calculate offset

        const db = getDb(); // Get the db connection
        if (!db) {
            console.error('Database connection is not defined.');
            return res.status(500).send('Database connection is not available.');
        }

        // SQL query to fetch data with pagination
        const query = `SELECT
                            w.id as id,
                            w.user_id, 
                            u.user_name AS name,
                            u.email, 
                            u.mobile,
                            w.amount,
                            w.paid_amount,
                            w.bank_name,
                            w.account_number,
                            w.ifsc_code,
                            w.created_date
                            FROM users.withdraw w
                            JOIN users.user u ON w.user_id = u.user_id
                            LIMIT ${limit} OFFSET ${offset};
                        `;

        // Log the query execution
        //console.log('Executing query:', query); // Just log the query as it now includes limit and offset values

        // Execute the query without passing parameters for limit and offset
        const [results] = await db.query(query);

        // Log the results
        //console.log('Query Results:', JSON.stringify(results, null, 2)); // Log the results for debugging

        // Fetch total count of items for pagination
        const [countResult] = await db.query('SELECT COUNT(*) AS count FROM withdraw');
        const totalItems = countResult[0].count;
        const totalPages = Math.ceil(totalItems / limit); // Calculate total pages

        // Render the response with results and pagination info
        res.render('Withdrawal_Report', {
            withdraw: results,
            currentPage: page,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        });
    } catch (err) {
        // Log and send error message if there's an error querying the database
        console.error('Error querying the database:', JSON.stringify(err, null, 2));
        return res.status(500).send('Error: ' + err.message);
    }
});

module.exports = router; // Don't forget to export the router
