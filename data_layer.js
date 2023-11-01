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


function check_if_username_exists(username) {
  return new Promise((resolve, reject) => {
    con.query('SELECT * FROM Users WHERE username = ?', [username], (error, results) => {
      if (error) {
        reject(error);
      } else {
        if (results.length > 0) {
          resolve(true); 
        } else {
          resolve(false); 
        }
      }
    });
  });
}

module.exports = { check_if_username_exists };

async function insert_user_data_layer(first_name, last_name, username, email, password_hash, password_salt)
{        
    var sql = "INSERT INTO Users (first_name, last_name, username, email, password_hash, password_salt, role) VALUES ('" + first_name + "', '" + last_name + "', '" + username + "', '" + email + "', '" + password_hash + "', '" + password_salt + "', 'user')";
    return new Promise((resolve, reject) => {
        con.query(sql, function (err, result){
            if(err)
            {
                console.log(err);
                reject("sql failure");
            }
            else
            {
                sql = "SELECT user_id FROM Users WHERE username = '" + username + "'";
                con.query(sql, function(err, result){
                    if(err)
                    {
                        console.log(err);
                        reject("sql failure");
                    }
                    else
                    {
                        console.log("Success");
                        resolve(result[0].user_id);
                    }
                });
            }
        });
    });
}

async function login_data_layer(username) {
    var sql = "SELECT password_hash, password_salt, user_id FROM Users WHERE username = ?";
    return new Promise((resolve, reject) => {
        con.query(sql, [username], function(err, result) {
            if(err)
            {
                console.log(err);
                reject("Something went wrong in our database.");
            }
            if(result.length > 0) 
                resolve(result[0]);
            else
                reject("User not found");
        });
    });
}

async function assign_role_data_layer(user_id, is_coach){
    var sql;
    if(is_coach)
        sql = "INSERT INTO Coaches (user_id, accepting_new_clients) VALUES (" + user_id + ", 0)";
    else
        sql = "INSERT INTO Clients (user_id) VALUES (" + user_id + ")";

    return new Promise((resolve, reject) => {
        con.query(sql, function(err, result) {
            if(err)
            {
                console.log(err);
                reject("Something went wrong in our database.");
            }
            sql = "UPDATE Users SET role = " + (is_coach ? "'coach'" : "'client'") + "WHERE user_id = " + user_id;
            console.log(sql);
            con.query(sql, function(err, result) {
                if(err)
                {
                    console.log(err);
                    reject("Something went wrong in our database.");
                }
                resolve("You are now a " + (is_coach ? "coach." : "client."));
            });
        });
    });
}
async function accept_client_survey_data_layer(user_id, weight=undefined, height=undefined, experience_level=undefined, budget=undefined)
{
    return new Promise((resolve, reject) => {
        if(weight == undefined && height == undefined && experience_level == undefined && budget == undefined) //Dont do anything if there is no data to insert
            resolve("Information updated.");
        else   
        {
            sql = "UPDATE Clients SET " 
            + (weight != undefined ? "weight = " + weight + ", " : "") 
            + (height != undefined ? "height = " + height + ", " : "")  
            + (experience_level != undefined ? "experience_level = '" + experience_level + "'," : "")  
            + (budget != undefined ? "budget = " + budget + ", ": "");

            sql = sql.substring(0, sql.length - 2); //Remove the last comma and space. We can assume there is at least one because of the check at the top of the function.

            sql += " WHERE user_id = " + user_id;

            con.query(sql, function(err, result) {
                if(err)
                {
                    console.log(err);
                    reject("Something went wrong in out database.");
                }
                resolve("Information updated.");
            });
        }
    });
}
async function accept_client_survey_data_layer(user_id, weight=undefined, height=undefined, experience_level=undefined, budget=undefined)
{
    return new Promise((resolve, reject) => {
        if(weight == undefined && height == undefined && experience_level == undefined && budget == undefined) //Dont do anything if there is no data to insert
            resolve("Information updated.");
        else   
        {
            sql = "UPDATE Clients SET " 
            + (weight != undefined ? "weight = " + weight + ", " : "") 
            + (height != undefined ? "height = " + height + ", " : "")  
            + (experience_level != undefined ? "experience_level = '" + experience_level + "'," : "")  
            + (budget != undefined ? "budget = " + budget + ", ": "");

            sql = sql.substring(0, sql.length - 2); //Remove the last comma and space. We can assume there is at least one because of the check at the top of the function.

            sql += " WHERE user_id = " + user_id;

            con.query(sql, function(err, result) {
                if(err)
                {
                    console.log(err);
                    reject("Something went wrong in out database.");
                }
                resolve("Information updated.");
            });
        }
    });
}
async function accept_coach_survey_data_layer(user_id, cost_per_session, availability, experience)
{
    //TODO, allow 'availability' and 'experience' to contain quotes without resulting in SQL injection
    return new Promise((resolve, reject) => {
        sql = "UPDATE Coaches SET cost_per_session = " + cost_per_session + ", availability = '" + availability + "', experience = '" +  experience + "' WHERE user_id = " + user_id;
        con.query(sql, function(err, result) {
            if(err)
            {
                console.log(err);
                reject("Something went wrong in out database.");
            }
            resolve("Information updated.");
        });
    });
}
module.exports.insert_user_data_layer = insert_user_data_layer;
module.exports.login_data_layer = login_data_layer;
module.exports.assign_role_data_layer = assign_role_data_layer;
module.exports.accept_client_survey_data_layer = accept_client_survey_data_layer;
module.exports.accept_coach_survey_data_layer = accept_coach_survey_data_layer;