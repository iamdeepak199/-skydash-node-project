const express = require('express');
const router = express.Router();
const db = require('../config/database'); // Your database connection

router.get('/dashboard', (req, res) => {
    // Query to get total paid amount
    const paidAmountQuery = 'SELECT SUM(paid_amount) AS totalPaidAmount FROM transactions';
    const particalSoldQuery = 'SELECT SUM(partical_sold) AS totalParticalSold FROM sales';  // Example query to get total partical sold
  
    // Execute both queries
    db.query(paidAmountQuery, (err1, paidAmountResult) => {
      if (err1) {
        console.error(err1);
        return res.status(500).send('Server error');
      }
  
      db.query(particalSoldQuery, (err2, particalSoldResult) => {
        if (err2) {
          console.error(err2);
          return res.status(500).send('Server error');
        }
  
        // Get values from results (or set defaults to 0)
        const totalPaidAmount = paidAmountResult[0].totalPaidAmount || 0;
        const totalParticalSold = particalSoldResult[0].totalParticalSold || 0;
  
        // Render the dashboard view and pass the dynamic data
        res.render('dashboard', { totalPaidAmount, totalParticalSold });
      });
    });
  });
  
  
  
  
  module.exports = router;


