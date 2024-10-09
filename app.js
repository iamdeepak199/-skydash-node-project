const express = require('express');
const mysql = require('mysql2/promise'); // MySQL connection using promises
const routes = require('./routes/routes'); // Import your routes
const cookieParser = require('cookie-parser');
const path = require('path');
const session = require('express-session'); // Make sure to include this line
const app = express();




// Set the static folder
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse incoming request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(cookieParser()); // Use cookie-parser middleware



// Configure the session middleware
app.use(session({
  secret: 'buralareskidenhepdutluktu', // Replace with your own secret
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));


// Routes
app.use('/', routes); // Mount your routes

// Create a MySQL connection using async/await
let db;

async function connectToDatabase() {
  try {
    db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '12345',
      database: 'admin3',
    });
    console.log('Connected to the MySQL database.');
  } catch (err) {
    console.error('Error connecting to the database:', err);
  }
}

connectToDatabase(); // Initialize database connection

app.get('/userdata', async (req, res) => {
  try {
      let page = req.query.page ? parseInt(req.query.page) : 1;
      const limit = 10;
      const offset = (page - 1) * limit;

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
          totalPages,  // Pass totalPages to the view
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
      });
  } catch (err) {
      console.error('Error querying the database:', err);
      res.status(500).send('Server Error');
  }
});


app.post('/update-row', (req, res) => {
  const updatedData = req.body;

  // Example query, customize it based on your table structure
  const sql = `
      UPDATE consultation_log 
      SET user_id = ?, get_income_from_id = ?, income = ?, package = ?, level = ?, status = ?, updated_date = NOW()
      WHERE id = ?
  `;

  // Example: Using MySQL connection, make sure to order the values correctly
  db.query(sql, [
      updatedData.user_id,
      updatedData.get_income_from_id,
      updatedData.income,
      updatedData.package,
      updatedData.level,
      updatedData.status,
      updatedData.id
  ], (err, result) => {
      if (err) {
          console.error('Failed to update the row:', err);
          return res.json({ success: false, message: 'Failed to update the row' });
      }
      res.json({ success: true, message: 'Row updated successfully' });
  });
});




/*-----------------------------------------------------------------------------------------------
app.post('/your-endpoint', (req, res) => {
  const { id, updated_date } = req.body;

  // Assuming you have a MySQL connection set up
  const sql = 'UPDATE consultation_log SET updated_date = ? WHERE id = ?';
  db.query(sql, [updated_date, id], (err, result) => {
    if (err) {
      console.error('Error updating date:', err);
      return res.status(500).send('Database error');
    }
    console.log('Date updated successfully');
    res.redirect('/your-redirect-path'); // Redirect back to your page after updating
  });
});
---------------------------------------------------------------------------------------------------*/

// Inside app.js or server.js
const resetPasswordRoute = require('./routes/resetpassword'); // Adjust path as needed
app.use('/', resetPasswordRoute); // Register the route





// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
