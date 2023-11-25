let connection = require("./conn");
let con = connection.con;

/**
 * 
 * @param {number} coach_id 
 * @returns {Promise<number>}
 */
function get_clients_of_coach(coach_id) {
    const sql = "SELECT client_id FROM Client_Coach WHERE coach_id = ?";
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
module.exports.accept_client_data_layer = accept_client_data_layer;
module.exports.check_if_client_coach_request_exists = check_if_client_coach_request_exists;
module.exports.check_if_client_has_hired_coach = check_if_client_has_hired_coach;

module.exports.request_coach_data_layer = request_coach_data_layer;
module.exports.get_clients_of_coach = get_clients_of_coach;
module.exports.remove_coach_data_layer = remove_coach_data_layer;