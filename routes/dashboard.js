const express = require('express');
const router = express.Router();
const getDb = require('../config/database'); // Import the database connection function

// Route to fetch total particles sold
router.get('/dashboard', (req, res) => {
    const db = getDb();  // Get the database connection directly

    if (!db) {
        console.error('Database connection not available');
        return res.status(500).send('Database connection error');
    }

    // Query to calculate the sum of the 'particle' column in users_activate table
    const particleSumQuery = `SELECT SUM(COALESCE(particle, 0)) AS totalParticle FROM users_activate;`;

    db.query(particleSumQuery, (err, rows) => {
        if (err) {
            console.error('Error fetching data from the database:', err);
            return res.status(500).send('Internal Server Error');
        }

        console.log('Query Result:', rows); // Log for debugging
        const totalParticle = (rows[0]?.totalParticle || 0);  // Optional chaining

        // Render the dashboard and pass the total particle sum to the view
        res.render('dashboard', { totalParticle });
    });
});

module.exports = router;
