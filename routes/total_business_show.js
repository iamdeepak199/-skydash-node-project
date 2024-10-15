const express = require('express');
const router = express.Router();
const getDb = require('../config/database'); // Adjust the path if necessary

router.get('/total_business_show', async (req, res) => {
    try {
        // Pagination logic
        let page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = 10; // Number of items per page
        const offset = (page - 1) * limit;

        const db = getDb(); // Call the function to get the db connection

        if (!db) {
            console.error('Database connection is not defined.');
            return res.status(500).send('Database connection is not available.');
        }

        // Query to fetch paginated data with aggregation
        const query = `
           SELECT 
               t.user_id,
               t.customer_name,
               COALESCE(SUM(ua.particle), 0) AS total_particle
           FROM 
               transactions t
           LEFT JOIN 
               users_activate ua ON t.user_id = ua.user_id
           GROUP BY 
               t.user_id, t.customer_name
           LIMIT ? OFFSET ?;
        `;

        // Fetch the paginated results
        const [results] = await db.query(query, [limit, offset]);

        // Query to get the total count of records (for pagination)
        const [countResult] = await db.query(`
           SELECT COUNT(DISTINCT t.user_id) AS count
           FROM transactions t;
        `);

        const totalItems = countResult[0].count;
        const totalPages = Math.ceil(totalItems / limit);

        // Render the view with pagination and transactions data
        res.render('total_business_show', {
            transactions: results,
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

module.exports = router;
