const connection = require("./conn");
const con = connection.con;

/**
 * @param {number} user_id 
 * @returns {Promise<Array<{ user_id: number, about_me: string, experience_level: string, created: Date, modified: Date, height: number, weight: number, medical_conditions: string, budget: number, goals: string, target_weight: number, profile_picture: string, birthday: Date}>>}
 */
async function get_User_Profile_By_Id_Data_Layer(user_id) {
    let sql = "SELECT user_id, about_me, experience_level, created, modified, height, weight, medical_conditions, budget, goals, target_weight, pfp_link, birthday FROM user_profile WHERE user_id = ?";
    
    return new Promise((resolve, reject) => {
      con.query(sql, [user_id], function (err, [result]) {
        if (err) {
          console.log(err);
          reject("SQL failure");
        }
  
        if (!result) {
          reject("User profile not found");
        } else {
          // Extract relevant properties and format them as an array of objects
          const userProfile = [
            {
              user_id: result.user_id,
              about_me: result.about_me, // Replace 'about_me' with the actual property you want for 'client_name'
              experience_level: result.experience_level,
              created: result.created,
              modified: result.modified,
              height: result.height,
              weight: result.weight,
              medical_conditions: result.medical_conditions,
              budget: result.budget,
              goals: result.goals,
              target_weight: result.target_weight,
              profile_picture: result.pfp_link,
              birthday: result.birthday
            }
          ];
  
          resolve(userProfile);
        }
      });
    });
  }
  
/**
 * @param {number} coach_id
 * @returns {Promise<Array<{ id: number, name: string }>>}
 */
function get_requested_clients_of_coach_data_layer(coach_id) {
    const sql = `
    SELECT 
        cc.client_id, 
        CONCAT(u.first_name, ' ', u.last_name) AS client_name
    FROM 
        Client_Coach cc
    JOIN 
        Users u ON cc.client_id = u.user_id
    WHERE 
        cc.coach_id = ?
        AND cc.requested = 1;
    `;

    return new Promise((resolve, reject) => {
        con.query(sql, [coach_id], (err, results) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                const clientData = results.map(r => ({
                    id: r.client_id,
                    name: r.client_name,
                }));
                resolve(clientData);
            }
        });
    });
}

/**
 * 
 * @param {number} coach_id 
 * @returns {Promise<Array<{ client_id: number, client_name: string }>>}
 */
function get_clients_of_coach_data_layer(coach_id) {
    const sql = `
    SELECT 
        cc.client_id, 
        CONCAT(u.first_name, ' ', u.last_name) AS client_name,
        up.pfp_link,
        COALESCE(SUBSTRING(m.content, 1, 40), 'Send a new message') AS message,
        m.created
    FROM 
        Client_Coach cc
    JOIN 
        Users u ON cc.client_id = u.user_id
    JOIN 
        User_Profile up ON u.user_id = up.user_id
    LEFT JOIN 
        Messages m ON (m.sender_id = cc.client_id OR m.receiver_id = cc.client_id)
                AND m.created = (
                    SELECT MAX(created) 
                    FROM Messages 
                    WHERE (sender_id = cc.client_id and receiver_id = cc.coach_id) 
            OR (sender_id = cc.coach_id and receiver_id = cc.client_id)
                )
    WHERE 
        cc.coach_id = ?
        AND cc.requested = 0
    GROUP BY 
        cc.client_id, client_name, up.pfp_link, message, m.created;



    `;
    
    return new Promise((resolve, reject) => {
        con.query(sql, [coach_id], (err, results) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                const clientData = results.map(r => ({
                    id: r.client_id,
                    name: r.client_name,
                    profile_picture: r.pfp_link,
                    message_content: r.message,
                    message_created: r.created,
                }));
                resolve(clientData);
            }
        });
    });
}


/**
 * @param {number} client_id 
 * @returns {Promise<Array<{ coach_id: number, coach_name: string }>>}
 */
function get_coaches_of_client_data_layer(client_id) {
    const sql = `
    SELECT 
        c.coach_id, 
        CONCAT(u.first_name, ' ', u.last_name) AS coach_name,
        up.pfp_link,
        COALESCE(SUBSTRING(m.content, 1, 40), 'Send a new message') AS message,
        m.created
    FROM 
        Client_Coach c
    JOIN 
        Users u ON c.coach_id = u.user_id
    JOIN 
        User_Profile up ON u.user_id = up.user_id
    LEFT JOIN 
        Messages m ON (u.user_id = m.sender_id OR u.user_id = m.receiver_id)
                AND m.created = (
                    SELECT MAX(created) 
                    FROM Messages 
                    WHERE (sender_id = c.client_id and receiver_id = c.coach_id) 
            OR (sender_id = c.coach_id and receiver_id = c.client_id)
                )
    WHERE 
        c.client_id = ?
        AND c.requested = 0;

    `;
    
    return new Promise((resolve, reject) => {
        con.query(sql, [client_id], (err, results) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                const coachData = results.map(r => ({
                    id: r.coach_id,
                    name: r.coach_name,
                    profile_picture: r.pfp_link,
                    message_content: r.message,
                    message_created: r.created,
                }));
                resolve(coachData);
            }
        });
    });
}





async function request_coach_data_layer(coach_id, client_id, comment) {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO Client_Coach (coach_id, client_id, requested) VALUES (?, ?, 1)";
        con.query(sql, [coach_id, client_id], (err) => {
            if (err) {
                console.log(`MySQL error: ${err.code}`);
                console.log(`MySQL error message: ${err.sqlMessage}`);
                console.log(`Relevant SQL query: ${err.sql}`);
                reject(new Error("Something went wrong on our side :("));
            }

            resolve();
        });
    })
}

/**
 * 
 * @param {number} coach_id 
 * @param {number} client_id 
 * @returns {Promise<boolean>}
 */
function check_if_client_coach_request_exists(coach_id, client_id) {
    const sql = "SELECT requested FROM Client_Coach WHERE coach_id = ? AND client_id = ?";
    return new Promise((resolve, reject) => {
        con.query(sql, [coach_id, client_id], (err, results) => {
            if (err) {
                reject(err);
                return;
            };

            let request_exists = !!results[0]?.requested;
            resolve(request_exists);
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
    const sql = "SELECT requested FROM Client_Coach WHERE coach_id = ? AND client_id = ?";
    return new Promise((resolve, reject) => {
        con.query(sql, [coach_id, client_id], (err, results) => {
            if (err) {
                reject(err);
                return;
            };

            let was_hired = results.length > 0 ? !results[0].requested : false;
            resolve(was_hired);
        });
    });
}

function accept_client_data_layer(coach_id, client_id) {
    // TODO: Have modified field be updated by a trigger
    const sql = "UPDATE Client_Coach SET requested = 0, modified = CURRENT_TIMESTAMP WHERE coach_id = ? AND client_id = ?";

    return new Promise((resolve, reject) => {
        con.query(sql, [coach_id, client_id], (err) => {
            if (err) {
                // TODO: Extract code into its own function
                console.log(`MySQL error: ${err.code}`);
                console.log(`MySQL error message: ${err.sqlMessage}`);
                console.log(`Relevant SQL query: ${err.sql}`);
                reject(new Error("Something went wrong on our side :("));
            }

            resolve();
        });
    });
}

async function remove_coach_data_layer(client_id, coach_id) {
    let sql = "DELETE FROM Client_Coach WHERE coach_id = ? AND client_id = ?";
    console.log(coach_id);
    console.log(client_id);
    console.log("");
    return new Promise((resolve, reject) => {
        con.query(sql, [coach_id, client_id], function (err, results) {
            if (err) {
                console.log(err);
                reject("sql failure");
            }
            let sql = "DELETE FROM Messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)";
            con.query(sql, [coach_id, client_id, client_id, coach_id], function (err, results) {
                if (err) {
                    console.log(err);
                    reject("sql failure");
                }
                let sql = "DELETE FROM Appointments WHERE (client_id = ? AND coach_id = ?)";
                con.query(sql, [client_id, coach_id], function (err, results) {
                    if (err) {
                        console.log(err);
                        reject("sql failure");
                    }
                    resolve("Removed");
                });
            });

        });
    });
}

/*Returns the id of the client's hired or requested coach*/
function get_clients_coach_or_request(client_id) {
    const sql = "SELECT coach_id FROM Client_Coach WHERE client_id = ?";
    return new Promise((resolve, reject) => {
        con.query(sql, [client_id], (err, results) => {
            if (err) {
                reject(err);
                return;
            };
            resolve(results);
        });
    });
}


async function delete_client_coach_row(client_id) {
    const sql = `DELETE FROM Client_Coach WHERE client_id = ?`;
    await new Promise((resolve, reject) => {
        con.query(sql, [client_id], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}


module.exports.get_requested_clients_of_coach_data_layer = get_requested_clients_of_coach_data_layer;
module.exports.get_coaches_of_client_data_layer = get_coaches_of_client_data_layer;
module.exports.accept_client_data_layer = accept_client_data_layer;
module.exports.check_if_client_coach_request_exists = check_if_client_coach_request_exists;
module.exports.check_if_client_has_hired_coach = check_if_client_has_hired_coach;
module.exports.get_User_Profile_By_Id_Data_Layer = get_User_Profile_By_Id_Data_Layer;
module.exports.request_coach_data_layer = request_coach_data_layer;
module.exports.get_clients_of_coach_data_layer = get_clients_of_coach_data_layer;
module.exports.remove_coach_data_layer = remove_coach_data_layer;
module.exports.get_clients_coach_or_request = get_clients_coach_or_request;
module.exports.delete_client_coach_row = delete_client_coach_row;