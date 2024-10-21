const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const jspdf = require('jspdf');
const getDb = require('../config/database'); // Adjust the path if necessary

// GET request for /transaction_details (Paginated Data)
router.get('/transaction_details', async (req, res) => {
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
        const [results] = await db.query(`SELECT * FROM transactions LIMIT ? OFFSET ?`, [limit, offset]);

        // Query to get the total count of records
        const [countResult] = await db.query('SELECT COUNT(*) AS count FROM transactions');
        const totalItems = countResult[0].count;
        const totalPages = Math.ceil(totalItems / limit);  // Calculating total pages

        // Render the EJS view and pass the data
        res.render('transaction_details', {
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

// GET request to generate PDF for a specific transaction
router.get('/generate-pdf/:id', async (req, res) => {
    const { id } = req.params;

    // Query the database to get the data for the specific row
    const db = getDb(); // Call your function to get the database connection
    const [results] = await db.query('SELECT * FROM transactions WHERE id = ?', [id]); // Adjust your query accordingly

    if (results.length === 0) {
        return res.status(404).send('No data found');
    }

    const doc = new PDFDocument();
    const outputDir = path.join(__dirname, 'output'); // Define output directory
    const filePath = path.join(outputDir, `${id}.pdf`); // Output path for PDF

    // Ensure the output directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true }); // Create directory if it doesn't exist
    }

    doc.pipe(fs.createWriteStream(filePath));

    // Add content to the PDF
    doc.fontSize(25).text('Your PDF Title', { align: 'center' });
    doc.text(`ID: ${results[0].id}`);
    doc.text(`Name: ${results[0].customer_name}`);
    // Add more fields as necessary

    doc.end();

    // Once PDF is created, send it to the client
    doc.on('finish', () => {
        res.download(filePath, (err) => {
            if (err) {
                console.error('Error downloading the file:', err);
            }
            // Optionally, delete the file after sending it
            fs.unlink(filePath, (err) => {
                if (err) console.error('Error deleting the file:', err);
            });
        });
    });
});

// Export the router
module.exports = router;
