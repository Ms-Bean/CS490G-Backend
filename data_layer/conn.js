const mysql = require("mysql");

// Use environment variables for database credentials
const con = mysql.createConnection({ 
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
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