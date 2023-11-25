let connection = require("./con");
let con = connection.con;

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

module.exports.check_if_username_exists_data_layer = check_if_username_exists_data_layer;
module.exports.set_user_address_data_layer = set_user_address_data_layer;
module.exports.insert_user_data_layer = insert_user_data_layer;
module.exports.accept_client_survey_data_layer = accept_client_survey_data_layer;
module.exports.accept_coach_survey_data_layer = accept_coach_survey_data_layer;
module.exports.alter_account_info_data_layer = alter_account_info_data_layer;