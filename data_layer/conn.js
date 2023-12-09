const mysql = require("mysql");

let database_name = "cs490_database" // Replace with your database name

// Use environment variables for database credentials
const con = mysql.createConnection({ 
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "Gokussb@10",
    database: database_name
});

// Uncomment the connect function if you need to establish the connection here
// con.connect(function(err) {
//     if (err)
//         throw err;
//     con.query("USE " + database_name, function (err, result, fields) {
//         if (err)
//             throw err;
//     });
//     console.log("connected to database");
// });

module.exports.con = con;