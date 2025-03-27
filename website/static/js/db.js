const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',  
    database: 'auth_system'
});

connection.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

module.exports = connection;

connection.query("SHOW TABLES LIKE 'users'", (err, result) => {
    if (err) {
        console.error("Error checking table:", err);
    } else if (result.length === 0) {
        console.log("⚠️ Table 'users' does not exist!");
    } else {
        console.log("✅ Table 'users' exists.");
    }
});
