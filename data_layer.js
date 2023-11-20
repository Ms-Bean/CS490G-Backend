const mysql = require("mysql");

let database_name = "cs490_database" //Replace with your database name
const con = mysql.createConnection({ 
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
async function set_user_address_data_layer(user_id, address, city, state, zip_code)
{
    return new Promise((resolve, reject) =>{
        con.query("INSERT INTO Addresses (user_id, address, city, state, zip_code) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE address=?, city=?, state=?, zip_code = ?", 
        [user_id, address, city, state, zip_code, address, city, state, zip_code], (error, results) =>{
            if(error){
                reject(error);
            }
            else{
                resolve("Address updated.");
            }
        });
    });
}
//function to get the role of the user i.e coach or client

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
    const sql = "SELECT password_hash, password_salt, user_id FROM Users WHERE username = ?";
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
    let get_address_city_state_zip_sql = "SELECT address, city, state, zip_code FROM Addresses WHERE user_id = ?"
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
                return_data.city = results[0].city;
                return_data.state = results[0].state;
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



async function remove_coach_data_layer(client_id, coach_id)
{
    let sql = "DELETE FROM Client_Coach WHERE coach_id = ? AND client_id = ?";
    console.log(coach_id);
    console.log(client_id);
    console.log("");
    return new Promise((resolve, reject) =>{
        con.query(sql, [coach_id, client_id], function(err, results){
            if(err)
            {
                console.log(err);
                reject("sql failure");
            }
            let sql = "DELETE FROM Messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)";
            con.query(sql, [coach_id, client_id, client_id, coach_id], function(err, results){
                if(err)
                {
                    console.log(err);
                    reject("sql failure");
                }
                let sql = "DELETE FROM Appointments WHERE (client_id = ? AND coach_id = ?)";
                con.query(sql, [client_id, coach_id], function(err, results){
                    if(err)
                    {
                        console.log(err);
                        reject("sql failure");
                    }
                    resolve("Removed");
                });
            });
    
        });
    });
}
/**
 * 
 * @param {Object} filter_options
 * @param {string} [filter_options.name] 
 * @param {Object} [filter_options.rating] 
 * @param {number} filter_options.rating.min 
 * @param {number} filter_options.rating.max 
 * @param {Object} [filter_options.hourly_rate] 
 * @param {number} filter_options.hourly_rate.min 
 * @param {number} filter_options.hourly_rate.max 
 * @param {Object} [filter_options.experience_level] 
 * @param {number} filter_options.experience_level.min 
 * @param {number} filter_options.experience_level.max 
 * @param {Object} [filter_options.location] 
 * @param {string} [filter_options.location.city] 
 * @param {string} [filter_options.location.state] 
 */
function _build_search_coach_filter_clauses({name, rating, hourly_rate, experience_level, location}) {
    const name_cond = name ? `CONCAT(Users.first_name, ' ', Users.last_name) LIKE ?` : "";
    const rating_cond = rating ? "average_rating BETWEEN ? AND ?" : "";
    const hourly_rate_cond = hourly_rate ? "Coaches.hourly_rate BETWEEN ? AND ?" : "";
    const experience_level_cond = experience_level ? "Coaches.experience_level BETWEEN ? AND ?" : "";
    const cities_cond = location?.city ? "Cities.name LIKE ?" : "";
    const states_cond = location?.state ? "States.name LIKE ?" : "";
    const where_conds = [name_cond, hourly_rate_cond, experience_level_cond, cities_cond, states_cond].filter(s => s).join(" AND ");

    const sql_args = [];
    if (name_cond) sql_args.push(`${name}%`);
    if (hourly_rate_cond) sql_args.push(...[hourly_rate.min, hourly_rate.max]);
    if (experience_level_cond) sql_args.push(...[experience_level.min, experience_level.max]);
    if (cities_cond) sql_args.push(`${location.city}%`);
    if (states_cond) sql_args.push(`${location.state}%`);
    if (rating_cond) sql_args.push(...[rating.min, rating.max]);

    return {
        where: where_conds ? "WHERE " + where_conds : "",
        having: rating_cond ? "HAVING " + rating_cond : "",
        args: sql_args
    };
}

/**
 * 
 * @param {Object} sort_options 
 * @param {"name"|"rating"|"hourly_rate"|"experience_level"} sort_options.key 
 * @param {boolean} sort_options.is_descending 
 */
function _build_search_coach_sort_options({key, is_descending}) {
    const order = is_descending ? "DESC" : "ASC";
    const key_to_sql_map = new Map([
        ["name", `Users.first_name ${order}, Users.last_name ${order}`],
        ["rating", `Average_Rating ${order}`],
        ["hourly_rate", `Coaches.hourly_rate ${order}`],
        ["experience_level", `Coaches.experience_level ${order}`]
    ]);

    return `ORDER BY ${key_to_sql_map.get(key)}`;
}

/**
 * 
 * @param {Object} search_options
 * @param {Object} search_options.filter_options
 * @param {string} search_options.filter_options.name 
 * @param {Object} search_options.filter_options.rating 
 * @param {number} search_options.filter_options.rating.min 
 * @param {number} search_options.filter_options.rating.max 
 * @param {Object} search_options.filter_options.hourly_rate 
 * @param {number} search_options.filter_options.hourly_rate.min 
 * @param {number} search_options.filter_options.hourly_rate.max 
 * @param {Object} search_options.filter_options.location 
 * @param {string} search_options.filter_options.location.city 
 * @param {string} search_options.filter_options.location.state
 * 
 * @param {Object} [search_options.sort_options] 
 * @param {"name"|"rating"|"hourly_rate"|"experience_level"} search_options.sort_options.key 
 * @param {boolean} search_options.sort_options.is_descending 
 * 
 * @param {Object} search_options.page_info 
 * @param {number} search_options.page_info.page_size 
 * @param {number} search_options.page_info.page_num 
 * @returns {Promise<Object>} 
 */
function search_coaches_data_layer({filter_options, sort_options, page_info}) {
    const {where, having, args} = _build_search_coach_filter_clauses(filter_options);
    const order_by = sort_options ? _build_search_coach_sort_options(sort_options) : "";
    const next_entry = (page_info.page_num - 1) * page_info.page_size;
    args.push(...[page_info.page_size, next_entry]);
    const sql = `SELECT Coaches.user_id, Coaches.hourly_rate, Coaches.coaching_history, Coaches.accepting_new_clients, Coaches.experience_level,
                    Users.first_name, Users.last_name, User_Profile.about_me, User_Profile.profile_picture, GROUP_CONCAT(Coaches_Goals.goal_id SEPARATOR ',') AS goals, Addresses.address, Cities.name AS city, States.name AS state,
                    AVG(Ratings.rating) AS average_rating
                FROM Coaches
                    INNER JOIN Users ON Coaches.user_id = Users.user_id
                    INNER JOIN User_Profile ON Coaches.user_id = User_Profile.user_id
                    LEFT JOIN Coaches_Goals ON Coaches.user_id = Coaches_Goals.coach_id
                    LEFT JOIN Ratings ON Coaches.user_id = Ratings.coach_id
                    LEFT JOIN User_Location ON Coaches.user_id = User_Location.user_id
                    LEFT JOIN Addresses ON User_Location.address_id = Addresses.address_id
                    LEFT JOIN Address_City ON Addresses.address_id = Address_City.address_id
                    LEFT JOIN Cities ON Address_City.city_id = Cities.city_id
                    LEFT JOIN City_State ON Cities.city_id = City_State.city_id
                    LEFT JOIN States ON City_State.state_id = States.state_id
                ${where}
                GROUP BY Coaches.user_id
                ${having}
                ${order_by}
                LIMIT ? OFFSET ?`;

    return new Promise((resolve, reject) => {
        con.query(sql, args, (err, results) => {
            if (err) {
                reject(err);
                return;
            }

            const mapped_results = results.map(r => {
                return {
                    coach_id: r.user_id,
                    personal_info: {
                        first_name: r.first_name,
                        last_name: r.last_name,
                        about_me: r.about_me,
                        profile_picture: r.profile_picture
                    },
                    professional_info: {
                        hourly_rate: r.hourly_rate,
                        coaching_history: r.coaching_history,
                        accepting_new_clients: r.accepting_new_clients,
                        experience_level: r.experience_level,
                        goals: r.goals?.split(','),
                        rating: r.average_rating
                    },
                    location: {
                        address: r.address,
                        city: r.city,
                        state: r.state
                    }
                };
            });
            resolve(mapped_results);
        });
    });
}

/**
 * 
 * @param {Object} search_options
 * @param {Object} search_options.filter_options
 * @param {string} search_options.filter_options.name 
 * @param {Object} search_options.filter_options.rating 
 * @param {number} search_options.filter_options.rating.min 
 * @param {number} search_options.filter_options.rating.max 
 * @param {Object} search_options.filter_options.hourly_rate 
 * @param {number} search_options.filter_options.hourly_rate.min 
 * @param {number} search_options.filter_options.hourly_rate.max 
 * @param {Object} search_options.filter_options.location 
 * @param {string} search_options.filter_options.location.city 
 * @param {string} search_options.filter_options.location.state
 * @returns {Promise<number>} 
 */
function count_coach_search_results({filter_options}) {
    const {where, having, args} = _build_search_coach_filter_clauses(filter_options);
    const sql = `SELECT Coaches.user_id, AVG(Ratings.rating) AS average_rating
                FROM Coaches
                    INNER JOIN Users ON Coaches.user_id = Users.user_id
                    INNER JOIN User_Profile ON Coaches.user_id = User_Profile.user_id
                    LEFT JOIN Coaches_Goals ON Coaches.user_id = Coaches_Goals.coach_id
                    LEFT JOIN Ratings ON Coaches.user_id = Ratings.coach_id
                    LEFT JOIN User_Location ON Coaches.user_id = User_Location.user_id
                    LEFT JOIN Addresses ON User_Location.address_id = Addresses.address_id
                    LEFT JOIN Address_City ON Addresses.address_id = Address_City.address_id
                    LEFT JOIN Cities ON Address_City.city_id = Cities.city_id
                    LEFT JOIN City_State ON Cities.city_id = City_State.city_id
                    LEFT JOIN States ON City_State.state_id = States.state_id
                ${where}
                GROUP BY Coaches.user_id
                ${having}`;
                return new Promise((resolve, reject) => {
                    con.query(sql, args, (err, results) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(results.length);
                    });
                });
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
module.exports.get_user_account_info_data_layer = get_user_account_info_data_layer;
module.exports.alter_account_info_data_layer = alter_account_info_data_layer;
module.exports.search_coaches_data_layer = search_coaches_data_layer;
module.exports.count_coach_search_results = count_coach_search_results;
module.exports.remove_coach_data_layer = remove_coach_data_layer;

module.exports.set_user_address_data_layer = set_user_address_data_layer;