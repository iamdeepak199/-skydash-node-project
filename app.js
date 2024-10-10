const express = require('express');       //Express makes it easy to handle different HTTP requests (GET, POST, PUT, DELETE)
const mysql = require('mysql2/promise');  // MySQL connection using promises
const routes = require('./routes/routes'); // Import your routes
const cookieParser = require('cookie-parser'); //Cookies are small pieces of data stored on the client side, and they are often used for purposes like session management, user authentication, and tracking.
const path = require('path');     //path module is essential for working with file and directory paths.
const chalk = require('chalk');   //hieght-light import informations 
const session = require('express-session'); // manage user sessions
const resetPasswordRoute = require('./routes/resetpassword'); // Adjust path as needed
const app = express();

// Set the static folder
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse incoming request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');  // view engine 
app.use(cookieParser());   // Use cookie-parser middleware

// Configure the session middleware
app.use(session({
  secret: 'buralareskidenhepdutluktu', // Replace with your own secret
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

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
    console.log(chalk.blue.italic.inverse('Connected to the MySQL database........'));
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


// All Routes
app.use('/', routes); // Rotes index page or main page
app.use('/', resetPasswordRoute); // Register the route

app.get('/allot_particle',(req,res)=>{
res.render('allot_particle');
});
app.get('/transaction_details',(req,res)=>{
  res.render('transaction_details');
  });
app.get('/total_business_show',(req,res)=>{
  res.render('total_business_show');
  });  
app.get('/Service_tax',(req,res)=>{
  res.render('Service_tax');
  });     
app.get('/Purchase_setup',(req,res)=>{
  res.render('Purchase_setup');
  });  
app.get('/Level_Details',(req,res)=>{
  res.render('Level_Details');
  });  
app.get('/consultation_income',(req,res)=>{
 res.render('consultation_income');
  });
app.get('/Ticket_request',(req,res)=>{
  res.render('Ticket_request');
   });
app.get('/Ticket_reply',(req,res)=>{
  res.render('Ticket_reply');
  });
app.get('/Real_Active',(req,res)=>{
  res.render('Real_Active');
  });
app.get('/Fake_Active',(req,res)=>{
 res.render('Fake_Active');
  });
app.get('/Royalty_details',(req,res)=>{
  res.render('Royalty_details');
  });
app.get('/Royalty_Achievers',(req,res)=>{
  res.render('Royalty_Achievers');
  });
app.get('/Rewards_check',(req,res)=>{
  res.render('Rewards_check');
  });
app.get('/Rewards_Report',(req,res)=>{
  res.render('Rewards_Report');
  });  
app.get('/Add_popup',(req,res)=>{
  res.render('Add_popup');
  });                  
app.get('/Withdrawal_Request',(req,res)=>{
  res.render('Withdrawal_Request');
  });
app.get('/New_Export',(req,res)=>{
  res.render('New_Export');
  });
app.get('/New_list',(req,res)=>{
  res.render('New_list');
  });
app.get('/Bulk_Approval',(req,res)=>{
  res.render('Bulk_Approval');
  });
app.get('/Bulk_Approval',(req,res)=>{
  res.render('Bulk_Approval');
  });  
app.get('/Withdrawal_Report',(req,res)=>{
  res.render('Withdrawal_Report');
  });
app.get('/Bulk_withdarwal_list',(req,res)=>{
  res.render('Bulk_withdarwal_list');
  });                                                          
// GET route for handling errors (404 page)
app.get('*', (req, res) => {
  res.status(404).render('error', { message: 'Page not found' });
});



/*------------------------------------------------------------------------------------------------------------------------
app.post('/update-date', (req, res) => {
  const { id, updated_date } = req.body;

  // SQL query to update the date for the given ID
  const sql = 'UPDATE consultation_log SET updated_date = ? WHERE Unique_ID = ?';
  
  db.query(sql, [updated_date, id], (err, result) => {
    if (err) {
      console.error('Error updating date:', err);
      return res.json({ success: false });
    }
    return res.json({ success: true });
  });
});
------------------------------------------------------------------------------------------------------------------------*/

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(chalk.green.bold.inverse(`Server is running at http://localhost:${PORT}`));
});
