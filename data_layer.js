mysql = require("mysql");

let database_name = "cs490_database" //Replace with your database name
var con = mysql.createConnection({ 
    host: "localhost",
    user: "root", //Replace with your user
    password: "Bigben70!?@@@", //Replace with your password
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

async function get_role_data_layer(user_id) {
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
async function check_state_exists(iso_code) {
    return new Promise((resolve, reject) => {
      con.query('SELECT * FROM States WHERE name = ?', [iso_code], (error, results) => {
        if (error) {
          reject(error);
        } else {
          if (results.length > 0) {
            resolve("State found.");
          } else {
            reject("State not found.");  // User not found with the specified user_id
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
    /*Gets the state id, rejects if the state does not exist*/
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
                    reject("State does not exist");
                }
            }
        });
    });
}
async function get_city_id_data_layer(city, state)
{
    /*Inserts the city and state if the pair does not exist, then gets the city id.*/
    return new Promise((resolve, reject) =>{
        get_state_id_data_layer(state).then((state_id) =>{
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
        }).catch((err) =>{
            reject(err);
        })
        
    });
}
async function get_address_id_data_layer(address, city, state, zip_code)
{
    return new Promise((resolve, reject) =>{
        get_city_id_data_layer(city, state).then((city_id) =>{
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
        }).catch((err) => {
            reject(err);
        });
    });
}

async function remove_unused_locations_data_layer()
{
    return new Promise((resolve, reject) =>{
        let remove_from_address_city = "DELETE FROM Address_City WHERE address_id IN (SELECT address_id FROM (SELECT SUM(CASE WHEN User_Location.user_id IS NOT NULL THEN 1 ELSE 0 END) AS user_count, Addresses.address_id FROM Addresses LEFT JOIN User_Location ON Addresses.address_id = User_Location.address_id GROUP BY Addresses.address_id) T1 WHERE T1.user_count = 0)";
        con.query(remove_from_address_city, function(err, results){
            if(err)
            {
                console.log(err);
                reject("sql failure");
            }
            let remove_from_addresses = "DELETE FROM Addresses WHERE address_id IN (SELECT address_id FROM (SELECT SUM(CASE WHEN User_Location.user_id IS NOT NULL THEN 1 ELSE 0 END) AS user_count, Addresses.address_id FROM Addresses LEFT JOIN User_Location ON Addresses.address_id = User_Location.address_id GROUP BY Addresses.address_id) T1 WHERE T1.user_count = 0)";
            con.query(remove_from_addresses, function(err, results){
                if(err)
                {
                    console.log(err);
                    reject("sql failure");
                }
                let remove_from_city_state = "DELETE FROM City_State WHERE city_id IN (SELECT city_id FROM (SELECT SUM(CASE WHEN Address_City.city_id IS NOT NULL THEN 1 ELSE 0 END) AS address_count, Cities.city_id FROM Cities LEFT JOIN Address_City ON Cities.city_id = Address_City.city_id GROUP BY Cities.city_id) T1 WHERE address_count = 0)";
                con.query(remove_from_city_state, function(err, results){
                    if(err)
                    {
                        console.log(err);
                        reject("sql failure");
                    }
                    let remove_from_cities = "DELETE FROM Cities WHERE city_id IN (SELECT city_id FROM (SELECT SUM(CASE WHEN Address_City.city_id IS NOT NULL THEN 1 ELSE 0 END) AS address_count, Cities.city_id FROM Cities LEFT JOIN Address_City ON Cities.city_id = Address_City.city_id GROUP BY Cities.city_id) T1 WHERE address_count = 0)";
                    con.query(remove_from_cities, function(err, results){
                        if(err)
                        {
                            console.log(err);
                            reject("sql failure");
                        }
                        console.log("remove_unused_locations_data_layer: resolved");
                        resolve("Unused locations removed");
                    });
                });
            });
        });
    })
}

async function unset_user_address_data_layer(user_id)
{
    console.log("unset_user_address_data_layer");
    let sql = "DELETE FROM User_Location WHERE user_id = ?";
    return new Promise((resolve, reject) =>{
        con.query(sql, [user_id], function(err, result){
            if(err)
            {
                reject("sql failure");
            }
            remove_unused_locations_data_layer().then((response) =>{ //This will remove the address/city if nobody else is using them.
                console.log("unset_user_address_data_layer: resolving");
                resolve("Address removed.");
            }).catch((err) => {
                console.log("remove_unused_locations failure");
                console.log(err);
                reject(err);
            });
        });
    })
}
async function set_user_address_data_layer(user_id, address, city, state, zip_code)
{
    return new Promise((resolve, reject) => {
        get_address_id_data_layer(address, city, state, zip_code).then((address_id) =>{ //This will create the new address/city if they dont already exist and return their id.
            let sql = "INSERT INTO User_Location (user_id, address_id) VALUES (?, ?)";
            console.log("setting user address");
            console.log(user_id);
            console.log(address_id);
            con.query(sql, [user_id, address_id], function(err, result){
                if(err)
                {
                    console.log("failure");
                    reject("sql failure");
                }
                else
                {
                    console.log("set_user_address_data_layer: resolved");
                    resolve("Address updated.");
                }
            });
        }).catch((err) => {
            
            reject(err);
        });
    })
}
async function alter_account_info_data_layer(user_id, first_name, last_name, username, email, password_hash, password_salt, phone_number)
{
    return new Promise((resolve, reject) =>{
        if(first_name === undefined && last_name === undefined && username === undefined && email === undefined && (password_hash === undefined || password_salt == undefined) && phone_number === undefined)
        {
            console.log("Resolved");
            resolve("Information updated.");
        }
        let params = [];
        let sql = "UPDATE Users SET "
        if(first_name !== undefined)
        {
            params.push(first_name);
            sql += "first_name=?, ";
        }
        if(last_name !== undefined)
        {
            params.push(last_name);
            sql += "last_name=?, ";
        }        
        if(username !== undefined)
        {
            params.push(username);
            sql += "username=?, ";
        }
        if(email !== undefined)
        {
            params.push(email);
            sql += "email=?, ";
        }
        if(password_hash !== undefined && password_salt !== undefined)
        {
            params.push(password_hash);
            sql += "password_hash=?, ";
            params.push(password_salt);
            sql += "password_salt=?, ";
        }
        if(phone_number !== undefined)
        {
            params.push(phone_number);
            sql += "phone_number=?, ";
        }
        sql = sql.substring(0, sql.length - 2); 
        sql += " WHERE user_id = ?"
        params.push(user_id);
        console.log(sql);
        console.log(params);
        con.query(sql, params, function(err, result){
            if(err)
            {
                console.log(err);
                reject(err);
            }
            console.log("alter_account_info_data_layer: resolving");
            resolve("Information updated.");
        });
    })
}
async function insert_user_data_layer(first_name, last_name, username, email, password_hash, password_salt, role)
{
    let sql = "INSERT INTO Users (username, email, password_hash, password_salt, role, first_name, last_name) VALUES (?, ?, ?, ?, ?, ?, ?)";
    return new Promise((resolve, reject) => {
        con.query(sql, [username, email, password_hash, password_salt, role, first_name, last_name], function (err, result){
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
                        sql = "INSERT INTO User_Profile (user_id) VALUES (?)";
                        con.query(sql, [user_id], function(err, result){
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


/**
 * 
 * @param {number} coach_id 
 * @param {number} client_id 
 * @returns {Promise<boolean>}
 */
function check_if_client_coach_request_exists(coach_id, client_id) {
    const sql = "SELECT coach_id FROM Coach_Requests WHERE coach_id = ? AND client_id = ?";
    return new Promise((resolve, reject) => {
        con.query(sql, [coach_id, client_id], (err, results) => {
            if (err) {
                reject(err);
                return;
            };

            resolve(results.length > 0);
        });
    });
}

// TODO: Change schema to reflect one-to-many relationship between client and coach
/**
 * 
 * @param {number} coach_id 
 * @param {number} client_id 
 * @returns {Promise<boolean>}
 */
function check_if_client_has_hired_coach(coach_id, client_id) {
    const sql = "SELECT * FROM Client_Coach WHERE coach_id = ? AND client_id = ?";
    return new Promise((resolve, reject) => {
        con.query(sql, [coach_id, client_id], (err, results) => {
            if (err) {
                reject(err);
                return;
            };

            resolve(results.length > 0);
        });
    });
}

function accept_client_data_layer(coach_id, client_id) {
    const insert_sql = "INSERT INTO Client_Coach (coach_id, client_id) VALUES (?, ?)";
    const delete_sql = "DELETE FROM Coach_Requests WHERE client_id = ? AND coach_id = ?";

    return new Promise((resolve, reject) => {
        con.beginTransaction(err => {
            if (err) {
                reject(err);
                return;
            }
            con.query(insert_sql, [coach_id, client_id], (err, results) => {
                if (err) {
                    return con.rollback(() => {
                        reject(err);
                    });
                }
                console.log("Inserted Client and Coach into Client_Coach table");
            });

            con.query(delete_sql, [client_id, coach_id], (err, results) => {
                if (err) {
                    return con.rollback(() => {
                        reject(err);
                    });
                }
                console.log("Deleted Client's request for Coach");
                con.commit((err) => {
                    if (err) {
                        return con.rollback(() => {
                            reject(err);
                        });
                    }
                    console.log("Commited changes to DB");
                });
            });

            resolve("Coach has accepted Client's request");
        });
    });
}

async function get_user_account_info_data_layer(user_id)
{
    let return_data = {
        street_address: "",
        city: "",
        state: "",
        username: "",
        email: "",
        phone_number: "",
        first_name: "",
        last_name: "",
        zip_code: ""
    };
    let get_address_city_state_zip_sql = "SELECT T5.user_id, T5.zip_code, T5.address, T5.city_name, States.name AS state_name FROM (SELECT T4.user_id, T4.address_id, T4.address, T4.city_id, T4.zip_code, T4.name AS city_name, City_State.state_id FROM (SELECT T3.user_id, T3.address_id, T3.address, T3.city_id, T3.zip_code, Cities.name FROM (SELECT T2.user_id, T2.address_id, T2.address, T2.zip_code, Address_City.city_id FROM (SELECT T1.user_id, Addresses.address_id, Addresses.address, Addresses.zip_code FROM (SELECT Users.user_id, User_Location.address_id FROM Users INNER JOIN User_Location ON Users.user_id = User_Location.user_id) T1 INNER JOIN Addresses ON T1.address_id = Addresses.address_id) T2 INNER JOIN Address_City ON T2.address_id = Address_City.address_id) T3 INNER JOIN Cities ON T3.city_id = Cities.city_id) T4 INNER JOIN City_State ON T4.city_id = City_State.city_id) T5 INNER JOIN States ON T5.state_id = States.state_id WHERE user_id = ?"
    return new Promise((resolve, reject) =>{
        con.query(get_address_city_state_zip_sql, [user_id], function(err, results){
            if(err)
            {
                console.log(err);
                reject("sql failure");
            }
            if(results.length > 0) //The user may not have given an address
            {
                return_data.street_address = results[0].address;
                return_data.city = results[0].city_name;
                return_data.state = results[0].state_name;
                return_data.zip_code = results[0].zip_code;
            }
            let get_other_account_info_sql = "SELECT email, username, phone_number, first_name, last_name FROM Users WHERE user_id = ?";
            con.query(get_other_account_info_sql, [user_id], function(err, results){
                if(err)
                {
                    console.log(err);
                    reject("sql failure");
                }
                return_data.phone_number = results[0].phone_number; //There must be at least 1 entry here in order for the user to be logged in.
                return_data.email = results[0].email;
                return_data.username = results[0].username;
                return_data.first_name = results[0].first_name;
                return_data.last_name = results[0].last_name;
                resolve(return_data);
            })
        });
    })
}

module.exports.accept_client_data_layer = accept_client_data_layer;
module.exports.check_if_client_coach_request_exists = check_if_client_coach_request_exists;
module.exports.check_if_client_has_hired_coach = check_if_client_has_hired_coach;

module.exports.request_coach_data_layer = request_coach_data_layer;
module.exports.login_data_layer = login_data_layer;
module.exports.insert_message_data_layer = insert_message_data_layer;
module.exports.get_clients_of_coach = get_clients_of_coach;
module.exports.get_role_data_layer = get_role_data_layer;
module.exports.get_client_coach_message_page_data_layer = get_client_coach_message_page_data_layer;
module.exports.count_client_coach_messages = count_client_coach_messages;

module.exports.login_data_layer = login_data_layer;
module.exports.insert_user_data_layer = insert_user_data_layer;
module.exports.accept_client_survey_data_layer = accept_client_survey_data_layer;
module.exports.accept_coach_survey_data_layer = accept_coach_survey_data_layer;
module.exports.get_city_id_data_layer = get_city_id_data_layer;
module.exports.get_state_id_data_layer = get_state_id_data_layer;
module.exports.get_address_id_data_layer = get_address_id_data_layer;
module.exports.set_user_address_data_layer = set_user_address_data_layer;
module.exports.get_user_account_info_data_layer = get_user_account_info_data_layer;
module.exports.check_state_exists = check_state_exists;
module.exports.remove_unused_locations_data_layer = remove_unused_locations_data_layer;
module.exports.unset_user_address_data_layer = unset_user_address_data_layer;
module.exports.alter_account_info_data_layer = alter_account_info_data_layer;