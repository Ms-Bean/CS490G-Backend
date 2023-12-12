const mysql = require("mysql");

// Use environment variables for database credentials
const con = mysql.createConnection({ 
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: database_name
});

module.exports.con = con;