const { request } = require("express");
let connection = require("./conn");
let con = connection.con;

async function get_coach_dashboard_info(coach_id)
{
    return new Promise((resolve, reject) => {
        const sql = "SELECT Client_Coach.coach_id, Client_Coach.client_id, Workout_Plans.name, Users.username FROM Client_Coach INNER JOIN User_Workout_Plan ON Client_Coach.client_id = User_Workout_Plan.user_id INNER JOIN Workout_Plans ON User_Workout_Plan.workout_plan_id = Workout_Plans.workout_plan_id INNER JOIN Users ON Users.user_id = Client_Coach.client_id WHERE coach_id = ? AND Client_Coach.requested=0";
        con.query(sql, [coach_id], function(err, result) {
            if(err)
            {
                console.log(err);
                reject("Something went wrong in our database.");
            }
            resolve(result);
        });
    });
}

async function getAllCoachRequest() {
    const sql = `select Coaches.user_id, Users.first_name, Users.last_name, Users.phone_number, Users.email, Coaches.availability, Coaches.hourly_rate, Coaches.coaching_history, Coaches.experience_level, Coaches.created from Coaches
                inner join Users on Users.user_id = Coaches.user_id
                where accepted = 0;`

    try {
        const results = await new Promise((resolve, reject) => {
            con.query(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        });

        if (results.length === 0) {
            return null;
        }

        // Map the database results to WorkoutProgress instances
        const coachList = results.map((row) => {
            return {
                userId: row.user_id,
                firstName: row.first_name,
                lastName: row.last_name,
                phoneNumber: row.phone_number,
                email: row.email,
                availability: row.availability,
                hourlyRate: row.hourly_rate,
                coachingHistory: row.coaching_history,
                experienceLevel: row.experience_level,
                date : new Date(row.created)
            };
        });
        return coachList;
    } catch (error) {
        throw error;
    }
}

async function accept_coach(coach_id){
    const sql = `UPDATE Coaches
                SET accepted = 1
                WHERE user_id = ?`
    try {
        const results = await new Promise((resolve, reject) => {
            con.query(sql, [coach_id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        });

        return results;
    } catch (error) {
        throw error;
    }
}

async function reject_coach(coach_id) {
    try {
        // Delete the coach
        const deleteCoachQuery = `DELETE FROM Coaches WHERE user_id = ${coach_id}`;
        const deleteCoachResult = await new Promise((resolve, reject) => {
            con.query(deleteCoachQuery, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });

        // Update user role to "client"
        const updateUserQuery = `UPDATE Users SET role = "client" WHERE user_id = ${coach_id}`;
        const updateUserResult = await new Promise((resolve, reject) => {
            con.query(updateUserQuery, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });

        // Return some information about the operations if needed
        return {
            deleteCoachResult,
            updateUserResult,
        };
    } catch (error) {
        throw error;
    }
}

async function accept_reject_clients_data_layer(coach_id, client_id, accept_reject_response) {
    return new Promise((resolve, reject) => {
        let sql;
        
        if (accept_reject_response === "reject") {
            sql = `DELETE FROM client_coach
                    WHERE coach_id = ?
                    AND client_id = ?
                    AND request = 1;
                `;
        } else if (accept_reject_response === "accept") {
            sql = `UPDATE client_coach
                    SET request = 0
                    WHERE coach_id = ?
                    AND client_id = ?
                    AND request = 1;        
                `;
        } else {
            reject("Invalid accept_reject_response value");
            return;
        }

        con.query(sql, [coach_id, client_id], function(err, result) {
            if (err) {
                console.error(err);
                reject("Something went wrong in our database.");
            }

            resolve(result);
        });
    });
}





module.exports.accept_reject_clients_data_layer = accept_reject_clients_data_layer;
module.exports.get_coach_dashboard_info = get_coach_dashboard_info;
module.exports.getAllCoachRequest = getAllCoachRequest;
module.exports.accept_coach = accept_coach;
module.exports.reject_coach = reject_coach;