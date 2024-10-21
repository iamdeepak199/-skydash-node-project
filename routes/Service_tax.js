const express = require('express');
const router = express.Router();
const getDb = require('../config/database'); // Adjust the path if necessary

// GET request for /Service_tax
router.get('/Service_tax', async (req, res) => {

    // Function to calculate taxes based on the state and amount
    function calculateTaxes(state, amount) {
        // Define the tax rates
        const GST_RATE = 0.18; // 18% GST
        const IGST_RATE = 0.18; // 18% IGST
        const CGST_RATE = 0.09; // 9% CGST (half of GST)

        let gst, igst, cgst;

        if (state.toLowerCase() === 'gujarat') {
            // If state is Gujarat, apply GST, IGST, and CGST
            gst = amount * GST_RATE;
            igst = amount * IGST_RATE;
            cgst = amount * CGST_RATE;
        } else {
            // For other states, only apply GST and CGST
            gst = amount * GST_RATE;
            cgst = amount * CGST_RATE;
            igst = 0; // No IGST for other states
        }

        return {
            gst: gst.toFixed(2),
            igst: igst.toFixed(2),
            cgst: cgst.toFixed(2),
        };
    }

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

        // Query to fetch transactions data with LEFT JOIN to users_activate
        const transactionsQuery = `
            SELECT 
                t.created,
                t.customer_name,
                u.particle,
                u.user_id,
                t.item_number,
                t.item_price,
                t.paid_amount,
                usr.pan_no,
                usr.address,
                usr.state
            FROM transactions t
            JOIN users_activate u ON t.user_id = u.user_id
            JOIN user usr ON u.user_id = usr.user_id
            LIMIT ? OFFSET ?;
        `;

        // Execute the query
        const [results] = await db.query(transactionsQuery, [limit, offset]);

        // Query to get the total count of records from transactions
        const [countResult] = await db.query('SELECT COUNT(*) AS count FROM transactions');
        const totalItems = countResult[0].count;
        const totalPages = Math.ceil(totalItems / limit);  // Calculating total pages

        // Query to sum all the particles from users_activate table
        const [particleSumResult] = await db.query('SELECT SUM(COALESCE(particle, 0)) AS totalParticle FROM users_activate');
        const totalParticle = particleSumResult[0]?.totalParticle || 0;

        // Calculate taxes for each transaction
        const transactionsWithTaxes = results.map(transaction => {
            const taxes = calculateTaxes(transaction.state, transaction.paid_amount);
            return {
                ...transaction,
                ...taxes // Merge tax data into the transaction object
            };
        });

        // Render the EJS view and pass the data
        res.render('Service_tax', {
            user: transactionsWithTaxes, // Data with taxes calculated
            totalParticle, // Total particle sum
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
