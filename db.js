const mysql = require('mysql2');
require('dotenv').config();

// Create a direct connection to the MySQL database
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Connect to the MySQL database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    process.exit(1); // Exit if unable to connect
  }
  console.log('Connected to the database');
});

// Export the connection to use in routes.js
module.exports = connection;
