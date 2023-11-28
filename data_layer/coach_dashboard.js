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

module.exports.get_coach_dashboard_info = get_coach_dashboard_info;