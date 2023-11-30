/*
These are the functions we wrote and used to generate mock data.
It is not advised to run them again as it is likely to ruin the data
by adding redundant entries, or to fail due to duplicate primary key. 
Instead, build the sql file cs490_database.sql.

This will stay here as a reference for when we need to use functionality
similar to what was implemented in order to generate mock data, and also
to elucidate our process of generating mock data.
*/




const exp = require("constants");
mysql = require("mysql");

let database_name = "cs490_database" //Replace with your database name
var con = mysql.createConnection({ 
    host: "localhost",
    user: "root", //Replace with your user
    password: "cactusgreen", //Replace with your password
    database: database_name
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
const fs = require("fs");
async function load_client_coach()
{
    let get_coaches_sql = "SELECT user_id FROM Coaches";
    con.query(get_coaches_sql, function(err, result){
        let coach_ids = [];
        for(let i = 0; i < result.length; i++)
        {
            coach_ids.push(result[i].user_id)
        }
        for(let i = 0; i < 1000; i += 2)
        {
            let sql = "INSERT INTO Client_Coach (client_id, coach_id, requested) VALUES (?, ?, ?)";
            let client_id = i + 1;
            let coach_id = coach_ids[Math.floor(200 + Math.random() * (coach_ids.length - 200))];
            if(client_id == coach_id)
                continue;
            con.query(sql, [client_id, coach_id, Math.random() > 0.5 ? 1 : 0], function(err, result){
                if(err)
                {
                    console.log(err);
                }
            });
        }
        
    });
}
load_client_coach();