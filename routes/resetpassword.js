const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../config/database'); // Ensure you have your database connection setup
const router = express.Router();

router.post('/reset-password', async (req, res) => {
  const { 'old-password': oldPassword, 'new-password': newPassword, 'confirm-password': confirmPassword } = req.body;

  // Assuming the session or token contains the logged-in user's username
  const username = req.session.username || req.body.username; // Adjust this depending on how you're getting the username

  try {
    // Fetch the user's current password from the database
    const [user] = await db.promise().query('SELECT password FROM tblLogin WHERE username = ?', [username]);

    if (!user.length) {
      return res.status(404).send('User not found');
    }

    const hashedOldPassword = user[0].password;

    // Compare the old password with the hashed password in the database
    const isMatch = await bcrypt.compare(oldPassword, hashedOldPassword);

    if (!isMatch) {
      return res.status(400).send('Old password is incorrect');
    }

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res.status(400).send('New password and confirm password do not match');
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    await db.promise().query('UPDATE tblLogin SET password = ? WHERE username = ?', [hashedNewPassword, username]);

    // Redirect to the login page after successful password reset
    res.redirect('/login');
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
