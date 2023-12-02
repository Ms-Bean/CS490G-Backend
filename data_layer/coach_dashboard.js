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