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

function get_role_data_layer(user_id) {
    return new Promise((resolve, reject) => {
      con.query('SELECT role FROM Users WHERE user_id = ?', [user_id], (error, results) => {
        if (error) {
          reject(error);
        } else {
          if (results.length > 0) {
            resolve(results[0].role);
          } else {
            reject(new Error("User not found"));  // User not found with the specified user_id
          }
        }
      });
  });
}
module.exports = { check_if_username_exists_data_layer };

/**
 * 
 * @param {number} coach_id 
 * @returns {Promise<number>}
 */
function get_clients_of_coach(coach_id) {
    const sql = "SELECT user_id FROM CLIENTS WHERE coach_id = ?";
    return new Promise((resolve, reject) => {
        con.query(sql, [coach_id], (err, results) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(results.map(r => r.user_id));
            }
        });
    });
}

// TODO Either create a Message class / Type or find a way to export this definition for other functions to use
/**
 * @typedef {Object} Message
 * @property {number} message_id 
 * @property {number} client_id 
 * @property {number} coach_id 
 * @property {number} content
 * @property {Date} timestamp 
 */
/**
 * 
 * @param {Object} messages 
 * @returns {Message}
 */
function _convert_to_message(message) {
    return {
        message_id: message.message_id,
        client_id: message.client_id,
        coach_id: message.coach_id,
        content: message.content,
        timestamp: message.timestamp
    };
}

/**
 * 
 * @param {number} client_id 
 * @param {number} coach_id 
 * @param {number} page_size 
 * @param {number} page_num 
 * @returns {Promise<Message[]>}
 */
function get_client_coach_message_page_data_layer(client_id, coach_id, page_size, page_num) {
    // order by clause is descending to ensure that latest messages appear first
    const sql = "SELECT message_id, coach_id, client_id, content, timestamp FROM messages WHERE coach_id = ? AND client_id = ? ORDER BY timestamp DESC LIMIT ? OFFSET ?";
    const next_entry = (page_num - 1) * page_size;
    return new Promise((resolve, reject) => {
        con.query(sql, [coach_id, client_id, page_size, next_entry], (err, results) => {
            if (err) {
                console.log(err);
                return reject(err);
            } else {
                resolve(results.map(m => _convert_to_message(m)));
            }
        });
    });
}


/**
 * 
 * @param {number} client_id 
 * @param {number} coach_id 
 * @returns {Promise<number>}
 */
function count_client_coach_messages(client_id, coach_id) {
    const sql = "SELECT COUNT(message_id) AS message_count FROM messages WHERE coach_id = ? AND client_id = ?";
    return new Promise((resolve, reject) => {
        con.query(sql, [coach_id, client_id], (err, results) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(results[0].message_count);
            }
        });
    });
}

/**
 * 
 * @param {number} coach_id 
 * @param {number} client_id 
 * @param {string} content 
 * @returns {Promise<string>}
 */
function insert_message_data_layer(coach_id, client_id, content) {
    const sql = "INSERT INTO messages (coach_id, client_id, content) VALUES (?, ?, ?)";
    return new Promise((resolve, reject) => {
        con.query(sql, [coach_id, client_id, content], (err, results) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                const success_message = "Message successfully added to database";
                console.log(success_message);
                resolve(success_message);
            }
        });
    });
}

async function insert_user_data_layer(first_name, last_name, username, email, password_hash, password_salt, role)
{
    let sql = "INSERT INTO Users (username, email, password_hash, password_salt, role) VALUES (?, ?, ?, ?, ?)";
    return new Promise((resolve, reject) => {
        con.query(sql, [username, email, password_hash, password_salt, role], function (err, result){
            if(err)
            {
                console.log(err);
                reject("sql failure");
            }
            else
            {
                sql = "SELECT user_id FROM Users WHERE username = ?";
                con.query(sql, [username], function(err, result){
                    if(err)
                    {
                        console.log(err);
                        reject("sql failure");
                    }
                    else
                    {
                        let user_id = result[0].user_id;
                        sql = "INSERT INTO User_Profile (user_id, first_name, last_name) VALUES (?, ?, ?)";
                        con.query(sql, [user_id, first_name, last_name], function(err, result){
                            if(err)
                            {
                                console.log(err);
                                reject(err);
                            }
                            if(role === 'coach')
                            {
                                sql = "INSERT INTO Coaches (user_id, accepting_new_clients, availability, hourly_rate, coaching_history, experience_level) VALUES (? , 0, 'This coach has not indicated their availability', 0, 'This coach has not indicated their experience', 0)"; 
                                con.query(sql, [user_id], function(err, result){
                                    if(err)
                                    {
                                        console.log(err); //This should never happen. Ever.
                                        reject(err);
                                    } 
                                    resolve(user_id);
                                });
                            }
                            else
                                resolve(user_id);
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
        if(weight !== undefined || height != undefined || experience_level !== undefined || budget !== undefined) //Dont do anything if there is no data to insert
        {
            // TODO Figure out to safely build dynamic SQL queries, to avoid SQL injection
            let sql = "UPDATE User_Profile SET " 
            let params = [];
            if(weight != undefined)
            {
                sql += "weight = ?, ";
                params.push(weight);
            }
            if(height != undefined)
            {
                sql += "height = ?, ";
                params.push(height);
            }
            if(experience_level != undefined)
            {
                sql += "experience_level = ?, ";
                params.push(experience_level);
            }
            if(budget != undefined)
            {
                sql += "budget = ?, ";
                params.push(budget);
            }
            sql = sql.substring(0, sql.length - 2); //Remove the last comma and space. We can assume there is at least one because of the check at the top of the function.
            sql += " WHERE user_id = ?";
            params.push(user_id);
            con.query(sql, params, function(err, result) {
                if(err)
                {
                    reject(err);
                }
                resolve("Information updated.");
            });
        }
    });
}
async function accept_coach_survey_data_layer(user_id, cost_per_session, availability, experience)
{
    return new Promise((resolve, reject) => {
        const sql = "UPDATE Coaches SET hourly_rate = ?, availability = ?, coaching_history = ? WHERE user_id = ?";
        con.query(sql, [cost_per_session, availability, experience, user_id], function(err, result) {
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
        const sql = "INSERT INTO Coach_Requests (coach_id, client_id, comment) VALUES (?, ?, ?)";
        con.query(sql, [coach_id, client_id, comment], function(err, result){
            if(err)
            {
                console.log(err);
                reject("Something went wrong in our database");
            }
            resolve("The request has been sent.");
        });
    });
}

// TODO split into smaller functions
// TODO function crashes if it's unable to find a request_id
async function accept_client_data_layer(coach_id, client_id)
{    
    return new Promise((resolve, reject) => {
        let sql = "SELECT request_id FROM Coach_Requests WHERE coach_id = ? AND client_id = ?";
        con.query(sql, [coach_id, client_id], function(err, results){
            if(err)
            {
                console.log(err);
                reject("Something went wrong in our database");
            }
            if(results.length == 0)
                reject("The client has not requested you to be their coach.");
            const request_id = results[0].request_id;
            sql = "SELECT coach_id FROM Clients WHERE user_id = ?";
            con.query(sql, [client_id], function(err, results){
                if(err)
                {
                    console.log(err);
                    reject("Something went wrong in our database.");
                }
                if(typeof(results[0].coach_id) == "number")
                {
                    reject("This client already has a coach.");
                }
                sql = "UPDATE Clients SET coach_id = ? WHERE user_id = ?";
                con.query(sql, [coach_id, client_id], function(err, results){
                    if(err)
                    {
                        console.log(err);
                        reject("Something went wrong in our database.");
                    }
                    sql = "DELETE FROM Coach_Requests WHERE request_id = ?";
                    con.query(sql, [request_id], function(err, results){
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
module.exports.insert_message_data_layer = insert_message_data_layer;
module.exports.get_clients_of_coach = get_clients_of_coach;
module.exports.get_role_data_layer = get_role_data_layer;
module.exports.get_client_coach_message_page_data_layer = get_client_coach_message_page_data_layer;
module.exports.count_client_coach_messages = count_client_coach_messages;