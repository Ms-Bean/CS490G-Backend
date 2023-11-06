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

async function get_state_id_data_layer(state)
{
    /*Inserts the state if it does not exist, then gets the state id.*/
    return new Promise((resolve, reject) =>{
        let get_state_id_sql = "SELECT state_id FROM States WHERE name = ?";
        con.query(get_state_id_sql, [state], function (err, result){
            if(err)
            {
                console.log(err);
                reject("sql failure");
            }
            else
            {
                if(result.length > 0)
                {
                    resolve(result[0].state_id);
                }
                else
                {
                    let insert_state_sql = "INSERT INTO States (name) VALUES (?)";
                    con.query(insert_state_sql, [state], function(err, result){
                        if(err)
                        {
                            console.log(err);
                            reject("sql failure");
                        }
                        let get_last_insert_id_sql = "SELECT LAST_INSERT_ID()";
                        con.query(get_last_insert_id_sql, function(err, result)
                        {
                            if(err)
                            {
                                console.log(err);
                                reject("sql failure");
                            }
                            resolve(result[0]["LAST_INSERT_ID()"]);
                        });
                    });
                }
            }
        });
    });
}
async function get_city_id_data_layer(city, state)
{
    /*Inserts the city and state if the pair does not exist, then gets the city id.*/
    let state_id = await get_state_id_data_layer(state);
    return new Promise((resolve, reject) =>{
        let get_city_id_sql = "SELECT Cities.city_id, City_State.state_id FROM Cities INNER JOIN City_State WHERE Cities.name = ? AND City_State.state_id = ?";
        con.query(get_city_id_sql, [city, state_id], function (err, result){
            if(err)
            {
                console.log(err);
                reject("sql failure");
            }
            else
            {
                if(result.length > 0)
                {
                    resolve(result[0]["city_id"]);
                }
                else
                {
                    let insert_city_sql = "INSERT INTO Cities (name) VALUES (?)";
                    con.query(insert_city_sql, [city], function(err, result){
                        if(err)
                        {
                            console.log(err);
                            reject("sql failure");
                        }
                        let get_last_insert_id_sql = "SELECT LAST_INSERT_ID()";
                        con.query(get_last_insert_id_sql, function(err, result)
                        {
                            if(err)
                            {
                                console.log(err);
                                reject("sql failure");
                            }
                            let city_id = result[0]["LAST_INSERT_ID()"];

                            let insert_city_state_relation_sql = "INSERT INTO City_State (city_id, state_id) VALUES (?, ?)";
                            con.query(insert_city_state_relation_sql, [city_id, state_id], function(err, result){
                                if(err)
                                {
                                    console.log(err);
                                    reject("sql failure");
                                }
                                else
                                {
                                    resolve(city_id);
                                }
                            })
                        });
                    });
                }
            }
        });
    });
}
async function get_address_id_data_layer(address, city, state, zip_code)
{
    let city_id = await get_city_id_data_layer(city, state);
    return new Promise((resolve, reject) =>{
        let get_address_id_sql = "SELECT Addresses.address_id, Address_City.city_id FROM Addresses INNER JOIN Address_City ON Addresses.address_id = Address_City.address_id WHERE Addresses.address = ? AND Addresses.zip_code = ? AND Address_City.city_id = ?";
        con.query(get_address_id_sql, [address, zip_code, city_id], function (err, result){
            if(err)
            {
                console.log(err);
                reject("sql failure");
            }
            else
            {
                if(result.length > 0)
                {
                    resolve(result[0]["address_id"]);
                }
                else
                {
                    let insert_address_sql = "INSERT INTO Addresses (address, zip_code) VALUES (?, ?)";
                    con.query(insert_address_sql, [address, zip_code], function(err, result){
                        if(err)
                        {
                            console.log(err);
                            reject("sql failure");
                        }
                        let get_last_insert_id_sql = "SELECT LAST_INSERT_ID()";
                        con.query(get_last_insert_id_sql, function(err, result)
                        {
                            if(err)
                            {
                                console.log(err);
                                reject("sql failure");
                            }
                            let address_id = result[0]["LAST_INSERT_ID()"];

                            let insert_address_city_relation_sql = "INSERT INTO Address_City (address_id, city_id) VALUES (?, ?)";
                            con.query(insert_address_city_relation_sql, [address_id, city_id], function(err, result){
                                if(err)
                                {
                                    console.log(err);
                                    reject("sql failure");
                                }
                                else
                                {
                                    resolve(address_id);
                                }
                            })
                        });
                    });
                }
            }
        });
    });
}
async function set_user_address_data_layer(user_id, address, city, state, zip_code)
{
    let address_id = await get_address_id_data_layer(address, city, state, zip_code);
    let sql = "INSERT INTO User_Location (user_id, address_id) VALUES (?, ?)";
    return new Promise((resolve, reject) => {
        con.query(sql, [user_id, address_id], function(err, result){
            if(err)
            {
                console.log(err);
                reject("sql failure");
            }
            else
            {
                resolve("Address updated.");
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
async function get_user_account_info(user_id)
{
    let return_data = {
        address: "",
        city: "",
        state: "",
        username: "",
        email: "",
        phone_number: ""
    };
    let get_address_city_state_sql = "SELECT T5.user_id, T5.address, T5.city_name, States.name AS state_name FROM (SELECT T4.user_id, T4.address_id, T4.address, T4.city_id, T4.name AS city_name, City_State.state_id FROM (SELECT T3.user_id, T3.address_id, T3.address, T3.city_id, Cities.name FROM (SELECT T2.user_id, T2.address_id, T2.address, Address_City.city_id FROM (SELECT T1.user_id, Addresses.address_id, Addresses.address FROM (SELECT Users.user_id, User_Location.address_id FROM Users INNER JOIN User_Location ON Users.user_id = User_Location.user_id) T1 INNER JOIN Addresses ON T1.address_id = Addresses.address_id) T2 INNER JOIN Address_City ON T2.address_id = Address_City.address_id) T3 INNER JOIN Cities ON T3.city_id = Cities.city_id) T4 INNER JOIN City_State ON T4.city_id = City_State.city_id) T5 INNER JOIN States ON T5.state_id = States.state_id WHERE user_id = ?"
    return new Promise((resolve, reject) =>{
        con.query(get_address_city_state_sql, [user_id], function(err, results){
            if(err)
            {
                console.log(err);
                reject("sql failure");
            }
            if(results.length > 0) //The user may not have given an address
            {
                return_data.address = results[0].address;
                return_data.city = results[0].city_name;
                return_data.state = results[0].state_name;
            }
            let get_other_account_info_sql = "SELECT email, username, phone_number FROM Users WHERE user_id = ?";
            con.query(get_other_account_info_sql, [user_id], function(err, results){
                if(err)
                {
                    console.log(err);
                    reject("sql failure");
                }
                return_data.phone_number = results[0].phone_number; //There must be at least 1 entry here in order for the user to be logged in.
                return_data.email = results[0].email;
                return_data.username = results[0].username;

                resolve(return_data);
            })
        });
    })
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

module.exports.get_city_id_data_layer = get_city_id_data_layer;
module.exports.get_state_id_data_layer = get_state_id_data_layer;
module.exports.get_address_id_data_layer = get_address_id_data_layer;
module.exports.set_user_address_data_layer = set_user_address_data_layer;

module.exports.get_user_account_info = get_user_account_info;