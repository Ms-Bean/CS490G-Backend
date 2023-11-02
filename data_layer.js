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
function check_if_username_exists_data_layer(username) {
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

function check_if_coach_data_layer(user_id) {
    return new Promise((resolve, reject) => {
      con.query('SELECT role FROM users WHERE user_id = ?', [user_id], (error, results) => {
        if (error) {
          reject(error);
        } else {
          if (results.length > 0) {
            if (results[0].role === 'coach') {
              resolve(true);  // The user is a coach
            } else {
              resolve(false);  // The user is not a coach
            }
          } else {
            reject(new Error("User not found"));  // User not found with the specified user_id
          }
        }
      });
    });
  }
  module.exports = { check_if_coach_data_layer };
  
  function check_if_client_data_layer(user_id) {
    return new Promise((resolve, reject) => {
      con.query('SELECT role FROM users WHERE user_id = ?', [user_id], (error, results) => {
        if (error) {
          reject(error);
        } else {
          if (results.length > 0) {
            if (results[0].role === 'client') {
              resolve(true);  // The user is a client
            } else {
              resolve(false);  // The user is not a client
            }
          } else {
            reject(new Error("User not found"));  // User not found with the specified user_id
          }
        }
      });
    });
  }

module.exports = { check_if_client_data_layer };

async function insert_user_data_layer(first_name, last_name, username, email, password_hash, password_salt, role)
{        
    var sql = "INSERT INTO Users (first_name, last_name, username, email, password_hash, password_salt, role) VALUES ('" + first_name + "', '" + last_name + "', '" + username + "', '" + email + "', '" + password_hash + "', '" + password_salt + "', '" + role + "')";
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
                        user_id = result[0].user_id;
                        if(role == 'coach')
                            sql = "INSERT INTO Coaches (user_id , accepting_new_clients, availability, hourly_rate, experience) VALUES (" + user_id +  ", 0, 'This coach has not indicated their availability', 0, 'This coach has not indicated their experience')"; 
                        else
                            sql = "INSERT INTO Clients (user_id) VALUES (" + user_id +  ")";
                        con.query(sql, function(err, result){
                           if(err)
                           {
                            console.log(err); //This should never happen. Ever.
                            reject(err);
                           } 
                        });
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
                    reject("Something went wrong in our database.");
                }
                resolve("Information updated.");
            });
        }
    });
}
async function accept_coach_survey_data_layer(user_id, cost_per_session, availability, experience)
{
    return new Promise((resolve, reject) => {
        sql = "UPDATE Coaches SET cost_per_session = " + cost_per_session + ", availability = '" + availability + "', experience = '" +  experience + "' WHERE user_id = " + user_id;
        con.query(sql, function(err, result) {
            if(err)
            {
                console.log(err);
                reject("Something went wrong in our database.");
            }
            resolve("Information updated.");
        });
    });
}

async function request_coach_data_layer(coach_id, client_id, comment)
{
    return new Promise((resolve, reject) => {
        sql = "INSERT INTO Coach_Requests (coach_id, client_id, comment) VALUES (" + coach_id + ", " + client_id + ", '" + comment + "')";
        con.query(sql, function(err, result){
            if(err)
            {
                console.log(err);
                reject("Something went wrong in our database");
            }
            resolve("The request has been sent.");
        });
    });
}

async function accept_client_data_layer(coach_id, client_id)
{    
    return new Promise((resolve, reject) => {
        sql = "SELECT request_id FROM Coach_Requests WHERE coach_id = " + coach_id + " AND client_id = " + client_id;
        con.query(sql, function(err, result){
            if(err)
            {
                console.log(err);
                reject("Something went wrong in our database");
            }
            if(result.length == 0)
                reject("The client has not requested you to be their coach.");
            request_id = result[0].request_id;
            sql = "SELECT coach_id FROM Clients WHERE user_id = " + client_id;
            con.query(sql, function(err, result){
                if(err)
                {
                    console.log(err);
                    reject("Something went wrong in our database.");
                }
                if(typeof(results[0].coach_id) == "number")
                {
                    reject("This client already has a coach.");
                }
                sql = "UPDATE Clients SET coach_id = " + coach_id + " WHERE client_id = " + client_id;
                con.query(sql, function(err, result){
                    if(err)
                    {
                        console.log(err);
                        reject("Something went wrong in our database.");
                    }
                    sql = "DELETE FROM Coach_Requests WHERE request_id = " + request_id;
                    con.query(sql, function(err, result){
                        if(err)
                        {
                            console.log(err);
                            reject("Something went wrong in our database.");
                        }
                        resolve("You now have a new client");
                    });
                });
            });
        });
    });
}
module.exports.accept_client_data_layer = accept_client_data_layer;
module.exports.request_coach_data_layer = request_coach_data_layer;
module.exports.insert_user_data_layer = insert_user_data_layer;
module.exports.login_data_layer = login_data_layer;
module.exports.accept_client_survey_data_layer = accept_client_survey_data_layer;
module.exports.accept_coach_survey_data_layer = accept_coach_survey_data_layer;
module.exports.check_if_username_exists_data_layer = check_if_username_exists_data_layer;
