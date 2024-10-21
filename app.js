const express = require('express');       //Express makes it easy to handle different HTTP requests (GET, POST, PUT, DELETE)
const mysql = require('mysql2/promise');  // MySQL connection using promises
const routes = require('./routes/routes'); // Import your routes
const cookieParser = require('cookie-parser'); //Cookies are small pieces of data stored on the client side, and they are often used for purposes like session management, user authentication, and tracking.
const path = require('path');     //path module is essential for working with file and directory paths.
const chalk = require('chalk');   //hieght-light import informations 
const session = require('express-session'); // manage user sessions
const resetPasswordRoute = require('./routes/resetpassword'); // Adjust path as needed
const userdata = require('./routes/userdata');
const fake_activate = require('./routes/fake_activate');
const users_activate = require('./routes/users_activate');
const rank_payout = require('./routes/rank_payout');
const reward_claim = require('./routes/reward_claim');
const transaction_details = require('./routes/transaction_details');
const total_business_show = require('./routes/total_business_show');
const Purchase_setup = require('./routes/Purchase_setup');
const Service_tax = require('./routes/Service_tax');
const popup_news = require('./routes/popup_news'); // Adjust the path accordingly
const Level_Details = require('./routes/Level_Details');
const Rewards_check = require('./routes/Rewards_Check');
const consultation_income = require('./routes/consultation_income');
const Withdrawal_Request = require('./routes/Withdrawal_Request');
const Bulk_Approval = require('./routes/Bulk_Approval');
const Withdrawal_Report = require('./routes/Withdrawal_Report');
//const dashboardRoutes = require('./routes/dashboard');
const Rental_Manager = require('./routes/Rental_Manager');
const Resume_Rent = require('./routes/Resume_Rent');

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

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// All Routes
app.use('/', routes); // Rotes index page or main page
app.use('/', resetPasswordRoute); // Register the route
app.use('/',userdata);
app.use('/',fake_activate);
app.use('/',users_activate);
app.use('/',rank_payout);
app.use('/',reward_claim);
app.use('/',transaction_details);
app.use('/', popup_news);
app.use('/',Service_tax);
app.use('/',Purchase_setup);
app.use('/',Level_Details);
app.use('/',Rewards_check);
app.use('/',total_business_show);
app.use('/',consultation_income);
app.use('/',Withdrawal_Request);
app.use('/',Bulk_Approval);
app.use('/',Withdrawal_Report);
//app.use(dashboardRoutes);
app.use('/',Rental_Manager);
app.use('/',Resume_Rent);


app.get('/allot_particle',(req,res)=>{
res.render('allot_particle');
});
app.get('/popup_news',(req,res)=>{
  res.render('popup_news');
  });
app.get('/Ticket_request',(req,res)=>{
  res.render('Ticket_request');
   });
app.get('/Ticket_reply',(req,res)=>{
  res.render('Ticket_reply');
  });
app.get('/Royalty_Achievers',(req,res)=>{
  res.render('Royalty_Achievers');
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
app.get('/Bulk_withdarwal_list',(req,res)=>{
  res.render('Bulk_withdarwal_list');
  });      
  
    app.get('/Rent_Report',(req,res)=>{
      res.render('Rent_Report');
      }); 
    
    app.get('/Rent_Bulk',(req,res)=>{
      res.render('Rent_Bulk');
      }); 
      app.get('/New_Rent_Export',(req,res)=>{
        res.render('New_Rent_Export');
        }); 
        app.get('/Rent_Bulk_Together',(req,res)=>{
          res.render('Rent_Bulk_Together');
          }); 
          app.get('/Approve_Rental',(req,res)=>{
            res.render('Approve_Rental');
            }); 
            app.get('/Block_Rent',(req,res)=>{
              res.render('Block_Rent');
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
