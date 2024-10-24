const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const getDb = require('../config/database'); // Import the getDb function
const authenticateToken = require('../middleware/auth');

// Handle reset password form submission
router.post('/reset-password', authenticateToken, async (req, res) => {
    const { old_password, new_password, confirm_password } = req.body;

    try {
        // Check if all fields are filled
        if (!old_password || !new_password || !confirm_password) {
            return res.render('profile', { errorMessage: 'All fields are required.' });
        }

        // Get the database connection
        const db = getDb();

        // Fetch the current admin's data
        const [adminRows] = await db.execute('SELECT * FROM admins WHERE id = ?', [req.admin.id]);
        const admin = adminRows[0];

        // Validate old password
        const isOldPasswordValid = await bcrypt.compare(old_password, admin.password);
        if (!isOldPasswordValid) {
            return res.render('profile', { errorMessage: 'Old password is incorrect.' });
        }

        // Check if new password and confirm password match
        if (new_password !== confirm_password) {
            return res.render('profile', { errorMessage: 'New password and confirmation do not match.' });
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(new_password, 10);

        // Update the password in the database
        await db.execute('UPDATE admins SET password = ? WHERE id = ?', [hashedNewPassword, req.admin.id]);

        console.log('Password reset successfully');
        res.redirect('/login'); // Redirect to login after successful reset

    } catch (error) {
        console.error('Error resetting password:', error);
        res.render('profile', { errorMessage: 'Server error' });
    }
});

module.exports = router;
