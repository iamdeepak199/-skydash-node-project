const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const getDb = require('../config/database');
const authenticateToken = require('../middleware/auth'); // Adjust the path as needed
const upload = require('../middleware/upload'); // Adjust the path as needed

// Create a connection pool to the MySQL database
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '12345',
  database: 'users'
});

// Display home page
router.get('/', (req, res) => {
  res.render('home'); // Assuming home.ejs is in your views folder
});

// Display registration form
router.get('/register', (req, res) => {
  res.render('register'); // Assuming register.ejs is in your views folder
});

// Handle registration form submission
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Validate required fields
  if (!username || !email || !password) {
    return res.render('register', { errorMessage: 'All fields are required' });
  }

  try {
    // Check if email already exists in the database
    const [existingAdmin] = await db.execute('SELECT * FROM admins WHERE email = ?', [email]);
    if (existingAdmin.length > 0) {
      return res.render('register', { errorMessage: 'Email already exists' });
    }

    // Validate the password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.render('register', { errorMessage: 'Password must be at least 6 characters long and contain at least one uppercase and one lowercase letter' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new admin into the database
    const query = 'INSERT INTO admins (username, email, password) VALUES (?, ?, ?)';
    await db.execute(query, [username, email, hashedPassword]);

    console.log('Admin registered successfully');
    res.redirect('/login');
  } catch (error) {
    console.error('Error registering admin:', error);
    res.render('register', { errorMessage: 'Server error' });
  }
});

// Display login form
router.get('/login', (req, res) => {
  res.render('login'); // Assuming login.ejs is in your views folder
});

// Handle login form submission
router.post('/login', async (req, res) => {
  const { username, password } = req.body; // Change email to username

  try {
    // Check if the admin exists in the database using username
    const [adminRows] = await db.execute('SELECT * FROM admins WHERE username = ?', [username]);
    const admin = adminRows[0];

    if (!admin) {
      return res.render('login', { errorMessage: 'Admin not found' });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.render('login', { errorMessage: 'Invalid password' });
    }

    // Issue JWT token
    const payload = {
      admin: {
        id: admin.id
      }
    };

    const jwtSecret = process.env.JWT_SECRET || "4715aed3c946f7b0a38e6b534a9583628d84e96d10fbc04700770d572af3dce43625dd";
    jwt.sign(payload, jwtSecret, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.cookie('token', token, { httpOnly: true }); // Set cookie with JWT token
      res.redirect('/dashboard');
    });

  } catch (error) {
    console.error('Error logging in admin:', error);
    res.render('login', { errorMessage: 'Server error' });
  }
});


// Route to display dashboard after login
router.get('/dashboard', authenticateToken, async (req, res) => {
  const db = getDb(); // Get the database connection
  try {
      // Fetch admin details
      const [adminRows] = await db.execute('SELECT id, username, email FROM admins WHERE id = ?', [req.admin.id]);
      const admin = adminRows[0];

      if (!admin) {
          return res.status(404).send('Admin not found');
      }


    // Fetch total paid amount for rank 'sales'
    const [salesAmountRows] = await db.execute('SELECT SUM(amount) AS totalPaidAmount FROM rank_payout WHERE `rank` = ?', ['sales']);
    const totalPaidAmount = Number(salesAmountRows[0]?.totalPaidAmount) || 0; // Convert to number

    // Fetch total paid amount for rank 'branch'
    const [branchAmountRows] = await db.execute('SELECT SUM(amount) AS totalPaidAmount FROM rank_payout WHERE `rank` = ?', ['branch']);
    const totalPaidAmountBranch = Number(branchAmountRows[0]?.totalPaidAmount) || 0; // Convert to number

    // Fetch total paid amount for rank 'zonal'
    const [zonalAmountRows] = await db.execute('SELECT SUM(amount) AS totalPaidAmount FROM rank_payout WHERE `rank` = ?', ['zonal']);
    const totalPaidAmountZonal = Number(zonalAmountRows[0]?.totalPaidAmount) || 0; // Convert to number


      // Fetch the total sum of particles from users_activate table
      const [particleRows] = await db.execute('SELECT SUM(particle) AS totalParticle FROM users_activate');
      const totalParticle = Number(particleRows[0]?.totalParticle) || 0; // Convert to number and default to 0 if no results 

      // Render the dashboard view with admin, totalPaidAmount, and totalParticle data
      res.render('dashboard', { admin, totalPaidAmount, totalParticle,totalPaidAmountBranch,totalPaidAmountZonal }); // Ensure totalParticle is passed here
  } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).send('Server error');
  }
});





// Display profile page
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const [adminRows] = await db.execute('SELECT id, username, email, bio, picture FROM admins WHERE id = ?', [req.admin.id]);
    const admin = adminRows[0];

    if (!admin) {
      return res.status(404).send('Admin not found');
    }

    res.render('profile', { admin });
  } catch (error) {
    console.error('Error fetching admin:', error);
    res.status(500).send('Server error');
  }
});

// POST route to handle profile updates
router.post('/profile', authenticateToken, upload.single('picture'), async (req, res) => {
  try {
    const { username, bio } = req.body;

    // Check if the username or bio is empty
    if (!username) {
      return res.render('profile', { errorMessage: 'Username is required' });
    }

    const picture = req.file ? '/images/' + req.file.filename : null;

    // Update query corrected to use username
    const query = 'UPDATE admins SET username = ?, bio = ?, picture = ? WHERE id = ?';
    await db.execute(query, [username, bio, picture, req.admin.id]);

    res.render('profile', { successMessage: 'Profile updated successfully', admin: { ...req.admin, username, bio, picture } });
  } catch (error) {
    console.error('Error updating admin profile:', error);
    res.render('profile', { errorMessage: 'Server error' });
  }
});

// Logout route
router.get('/logout', (req, res) => {
  res.clearCookie('token'); // Clear the token cookie
  res.redirect('/login'); // Redirect to login page after logout
});

module.exports = router;
