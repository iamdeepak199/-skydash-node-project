const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const authenticateToken = require('../middleware/auth'); // Adjust the path as needed

// Create a connection pool to the MySQL database
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '12345',
  database: 'Admin3'
});

// Handle reset password form submission
router.post('/reset-password', authenticateToken, async (req, res) => {
  const { old_password, new_password, confirm_password } = req.body;

  try {
    // Check if all fields are filled
    if (!old_password || !new_password || !confirm_password) {
      return res.render('reset-password', { errorMessage: 'All fields are required.' });
    }

    // Fetch the current admin's data
    const [adminRows] = await db.execute('SELECT * FROM admins WHERE id = ?', [req.admin.id]);
    const admin = adminRows[0];

    // Validate old password
    const isOldPasswordValid = await bcrypt.compare(old_password, admin.password);
    if (!isOldPasswordValid) {
      return res.render('reset-password', { errorMessage: 'Old password is incorrect.' });
    }

    // Check if new password and confirm password match
    if (new_password !== confirm_password) {
      return res.render('reset-password', { errorMessage: 'New password and confirmation do not match.' });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(new_password, 10);

    // Update the password in the database
    await db.execute('UPDATE admins SET password = ? WHERE id = ?', [hashedNewPassword, req.admin.id]);

    console.log('Password reset successfully');
    res.redirect('/login'); // Redirect to login after successful reset

  } catch (error) {
    console.error('Error resetting password:', error);
    res.render('reset-password', { errorMessage: 'Server error' });
  }
});

module.exports = router;
