const express = require('express');
const router = express.Router();
const getDb = require('../config/database'); // Adjust the path as necessary

router.get('/dashboard', async (req, res) => {
    const totalParticleQuery = 'SELECT SUM(COALESCE(team_particle_count, 0)) AS totalParticle FROM user;';

    try {
        const db = await getDb(); // Get the database connection
        const [rows] = await db.query(totalParticleQuery); // Execute the query

        // Check if totalParticle is fetched correctly
        const totalParticle = (rows.length > 0 && rows[0].totalParticle !== null) 
                            ? rows[0].totalParticle 
                            : 0;

        console.log('Total Particle:', totalParticle); // Log the value to ensure it's correct

        // Pass totalParticle to the view (important)
        res.render('dashboard', { totalParticle });
    } catch (err) {
        console.error('Error fetching total particles:', err);
        return res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
