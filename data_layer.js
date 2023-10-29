mysql = require("mysql");

let database_name = "cs490_database" //Replace with your database name
var con = mysql.createConnection({ 
    host: "localhost",
    user: "root", //Replace with your user
    password: "cactusgreen" //Replace with your password
});
con.connect(function(err) {
    if (err)
        throw err;
    con.query("USE " + database_name, function (err, result, fields) {
        if (err)
            throw err;
    });
    console.log("connected to database");
});

async function insert_user_data_layer(first_name, last_name, username, email, password_hash, password_salt)
{        
    var sql = "INSERT INTO Users (first_name, last_name, username, email, password_hash, password_salt) VALUES ('" + first_name + "', '" + last_name + "', '" + username + "', '" + email + "', '" + password_hash + "', '" + password_salt + "')";
    return new Promise((resolve, reject) => {
        con.query(sql, function (err, result){
            if(err)
            {
                console.log(err);
                reject("sql failure");
            }
            else
            {
                console.log("Success");
                resolve(result);
            }
        });
    });
}
module.exports.insert_user_data_layer = insert_user_data_layer;