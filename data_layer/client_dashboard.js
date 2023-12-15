let connection = require("./conn");
let con = connection.con;
function mod(x, y)
{
    return ((x % y) + y) % y;
}
async function get_client_dashboard_info(user_id)
{
    return new Promise((resolve, reject) => {
        let workout_schedule = {
            workout_plan_name: undefined,
            "daily_surveys": [
                /*{
                    date,
                    calories_consumed,
                    weight,
                    calories_burned,
                    water_intake,
                    mood
                }*/
            ],
            "days": [
            /*  {
                    weekday: undefined,
                    exercises: [
                        {
                            workout_exericse_id: undefined,
                            exercise_name: undefined,
                            time: undefined,
                            expected_num_sets: undefined
                            expected_reps_per_set: undefined,
                            expected_weight: undefined
                    
                            logged_sets: [
                                {
                                    logged_reps: undefined,
                                    logged_weight: undefined
                                }
                                ... 
                            ]
                        } 
                        ...    
                    ]
                } 
                ...
                */
            ]
        }
        /*Now we will build this object*/

        const get_daily_survey_sql = "SELECT date, calories_consumed, weight, calories_burned, water_intake, mood FROM User_Daily_Survey WHERE user_id = ? ORDER BY date";
        con.query(get_daily_survey_sql, [user_id], function(err, daily_survey_result) {
            if(err)
            {
                console.log(err);
                reject("Something went wrong in our database.");
            }
            for(let i = 0; i < daily_survey_result.length; i++)
            {
                workout_schedule.daily_surveys.push({
                    date: daily_survey_result[i].date,
                    calories_consumed: daily_survey_result[i].calories_consumed,
                    weight: daily_survey_result[i].weight,
                    calories_burned: daily_survey_result[i].calories_burned,
                    water_intake: daily_survey_result[i].water_intake,
                    mood: daily_survey_result[i].mood
                })
            }
            const get_workout_plan_id = "SELECT User_Workout_Plan.workout_plan_id, Workout_Plans.name FROM User_Workout_Plan INNER JOIN Workout_Plans ON User_Workout_Plan.workout_plan_id = Workout_Plans.workout_plan_id WHERE user_id = ?";
            con.query(get_workout_plan_id, [user_id], function(err, workout_plan_id_result) {
                if(err)
                {
                    console.log(err);
                    reject("sql failure");
                }
                if(workout_plan_id_result.length == 0)
                {
                    console.log("ZERO!!!");
                    resolve(workout_schedule);
                    return;
                }
                console.log(workout_plan_id_result)
                let workout_plan_id = workout_plan_id_result[0].workout_plan_id;
                let workout_plan_name = workout_plan_id_result[0].name;
                workout_schedule.workout_plan_name = workout_plan_name;
                
                let weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

                let get_weekday_sql = "SELECT WEEKDAY(CURDATE()) AS weekday";
                con.query(get_weekday_sql, function(err, get_weekday_result){
                    let current_weekday = get_weekday_result[0].weekday;
                    for(let days_ago = 5; days_ago >= 0; days_ago--)
                    {
                        let weekday = weekdays[mod(current_weekday - days_ago, 7)];
                        workout_schedule["days"].push({
                            "weekday": weekday,
                            "exercises": []
                        });
                    }
                    let get_exercises_sql = "SELECT Workout_Plan_Exercises.exercise_id, Exercise_Bank.name, Workout_Plan_Exercises.weekday, Workout_Plan_Exercises.time, Workout_Plan_Exercises.reps_per_set, Workout_Plan_Exercises.num_sets, Workout_Plan_Exercises.weight, Workout_Plan_Exercises.id FROM Workout_Plan_Exercises INNER JOIN Exercise_Bank ON Workout_Plan_Exercises.exercise_id = Exercise_Bank.exercise_id WHERE Workout_Plan_Exercises.workout_plan_id = ? AND ( Workout_Plan_Exercises.weekday = ? OR Workout_Plan_Exercises.weekday = ? OR Workout_Plan_Exercises.weekday = ? OR Workout_Plan_Exercises.weekday = ? OR Workout_Plan_Exercises.weekday = ?)";
                    con.query(get_exercises_sql, 
                        [
                        workout_plan_id, 
                        weekdays[(current_weekday - 0) % 7], 
                        weekdays[(current_weekday - 1) % 7], 
                        weekdays[(current_weekday - 2) % 7], 
                        weekdays[(current_weekday - 3) % 7], 
                        weekdays[(current_weekday - 4) % 7],
                        weekdays[(current_weekday - 5) % 7]
                        ],
                        function(err, get_exercises_result){
                            if(err)
                            {
                                console.log(err);
                                reject("sql failure");
                            }
                            for(let i = 0; i < get_exercises_result.length; i++)
                            {
                                for(let j = 0; j < workout_schedule["days"].length; j++)
                                {
                                    if(workout_schedule["days"][j].weekday == get_exercises_result[i].weekday)
                                    {
                                        workout_schedule["days"][j].exercises.push({
                                            workout_exercise_id: get_exercises_result[i].id,
                                            exercise_name: get_exercises_result[i].name,
                                            time: get_exercises_result[i].time,
                                            expected_num_sets: get_exercises_result[i].num_sets,
                                            expected_reps_per_set: get_exercises_result[i].reps_per_set,
                                            expected_weight: get_exercises_result[i].weight,
        
                                            logged_sets: []
                                        })
                                    }
                                }
                            }
                            let get_activity_logs_sql = "SELECT Exercise_Bank.name, Workout_Plan_Exercises.weekday, Workout_Plan_Exercises.time, Workout_Progress.weight, Workout_Progress.reps, Workout_Progress.set_number, DATEDIFF(CURDATE(), Workout_Progress.date) AS days_ago, Workout_Plan_Exercises.id FROM Workout_Progress INNER JOIN Workout_Plan_Exercises ON Workout_Progress.workout_exercise_id = Workout_Plan_Exercises.id INNER JOIN Exercise_Bank ON Workout_Plan_Exercises.exercise_id = Exercise_Bank.exercise_id WHERE Workout_Progress.user_id=? AND Workout_Progress.date > DATE_ADD(CURDATE(), INTERVAL -6 DAY)";
                            con.query(get_activity_logs_sql, [user_id], function(err, get_activity_logs_result){
                                if(err)
                                {
                                    console.log(err);
                                    reject("sql_failure");
                                }
                                for(let i = 0; i < get_activity_logs_result.length; i++)
                                {
                                    for(let j = 0; j < workout_schedule["days"].length; j++)
                                    {
                                        if(workout_schedule["days"].weekday = get_activity_logs_result[i].weekday)
                                        {
                                            for(let k = 0; k < workout_schedule["days"][j].exercises.length; k++)
                                            {
                                                if(workout_schedule["days"][j].exercises[k].workout_exercise_id == get_activity_logs_result[i].id)
                                                {
                                                    // console.log("SHABANG!!!!");
                                                    workout_schedule["days"][j].exercises[k].logged_sets.push({
                                                        logged_reps: get_activity_logs_result[i].reps,
                                                        logged_weight: get_activity_logs_result[i].weight
                                                    });
                                                }
                                            }
                                        }
                                    }
                                }
                                resolve(workout_schedule);
                            })
                        })
                })
            });
        });
    });
}
async function check_is_coach(client_id, coach_id)
{
    return new Promise((resolve, reject) =>{
        let sql = "SELECT * FROM Client_Coach WHERE coach_id = ? AND client_id = ?";
        con.query(sql, [coach_id, client_id], function(err, result){
            if(result.length == 0)
                reject("Not found");
            else
                resolve("Found");
        });
    });
}

async function get_client_target_weight(client_id) {
    return new Promise((resolve, reject) => {
      let sql = "SELECT target_weight FROM User_Profile WHERE user_id = ?";
      con.query(sql, [client_id], function(err, result) {
        if (err) {
          console.log(err);
          reject("SQL error occurred");
        } else {
          if (result.length > 0) {
            resolve(result[0].target_weight);
          } else {
            reject("Client not found");
          }
        }
      });
    });
  }

module.exports.get_client_dashboard_info = get_client_dashboard_info;
module.exports.check_is_coach = check_is_coach;
module.exports.get_client_target_weight = get_client_target_weight;
  
  