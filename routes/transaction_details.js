const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const getDb = require('../config/database'); // Adjust the path if necessary

// GET request for /transaction_details (Paginated Data)
router.get('/transaction_details', async (req, res) => {
    try {
        let page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        const db = getDb(); // Call the function to get the db connection

        if (!db) {
            console.error('Database connection is not defined.');
            return res.status(500).send('Database connection is not available.');
        }

        // Fetch paginated transaction data
        const [results] = await db.query(`SELECT * FROM transactions LIMIT ? OFFSET ?`, [limit, offset]);

        // Fetch total number of items for pagination
        const [countResult] = await db.query('SELECT COUNT(*) AS count FROM transactions');
        const totalItems = countResult[0].count;
        const totalPages = Math.ceil(totalItems / limit);

        // Render transaction details page with pagination info
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

    try {
        const db = getDb(); // Get the database connection
        const [results] = await db.query('SELECT * FROM transactions WHERE id = ?', [id]);

        if (results.length === 0) {
            return res.status(404).send('No data found');
        }

        // Create a new PDF document
        const doc = new PDFDocument();
        const outputDir = path.join(__dirname, 'output');
        const filePath = path.join(outputDir, `${id}.pdf`);

        // Ensure the output directory exists
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Create the write stream to save the file
    const writeStream = fs.createWriteStream(filePath);
    
    // Pipe the PDF content to the write stream
    doc.pipe(writeStream);

    doc.fontSize(25).fillColor('blue').text('Transaction Details', { align: 'center' });

    doc.moveDown(); // Add some space
    
    doc.fontSize(12).fillColor('black').text('Transaction Summary:', { underline: true });
    doc.moveDown(0.5);
    doc.text(`Transaction ID: ${results[0].id}`, { indent: 20 });
    doc.text(`User ID: ${results[0].user_id}`, { indent: 20 });
    doc.text(`Customer Name: ${results[0].customer_name}`, { indent: 20 });
    doc.text(`Customer email: ${results[0].customer_email}`, { indent: 20 });
    doc.text(`Product ID: ${results[0].item_number}`, { indent: 20 });
    doc.text(`Product Amount: ${results[0].item_price}`, { indent: 20 });
    doc.text(`Paid Amount: ${results[0].paid_amount}`, { indent: 20 });
    doc.text(`Booked Space: ${results[0].item_number}`, { indent: 20 });
    doc.text(`Transaction ID/Cheque Number: ${results[0].txn_id}`, { indent: 20 });
    doc.text(`Method: ${results[0].stripe_checkout_session_id}`, { indent: 20 });
    doc.text(`Created Date: ${results[0].created}`, { indent: 20 });
    
    doc.moveDown(2);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke(); // Horizontal line to separate
    
    doc.end();

        // Handle the event after the PDF has been written
        writeStream.on('finish', () => {
            // Send the PDF as a response after generation
            res.download(filePath, (err) => {
                if (err) {
                    console.error('Error downloading the file:', err);
                }
                // Optionally delete the file after sending it
                fs.unlink(filePath, (err) => {
                    if (err) console.error('Error deleting the file:', err);
                });
            });
        });

        writeStream.on('error', (err) => {
            console.error('Error writing the file:', err);
            res.status(500).send('Error generating PDF');
        });
    } catch (err) {
        console.error('Error querying the database:', err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
