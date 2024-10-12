// database.js
const mysql = require('mysql2/promise');
const chalk = require('chalk');

let db; // Declare db variable

async function connectToDatabase() {
    try {
        db = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '12345',
            database: 'users',
        });
        console.log(chalk.blue.italic.inverse('Connected to the MySQL database........'));
    } catch (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1); // Exit the process if the connection fails
    }
}

// Initialize database connection
connectToDatabase();

// Export a function to get the db connection
module.exports = function getDb() {
    return db; // Return the db connection
};
