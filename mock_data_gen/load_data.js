/*
These are the functions we wrote and used to generate mock data.
It is not advised to run them again as it is likely to ruin the data
by adding redundant entries, or to fail due to duplicate primary key. 
Instead, build the sql file cs490_database.sql.

This will stay here as a reference for when we need to use functionality
similar to what was implemented in order to generate mock data, and also
to elucidate our process of generating mock data.
*/




const exp = require("constants");
const business_layer = require("../business_layer");
const data_layer = require("../data_layer/data_layer");
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
const fs = require("fs");
async function load_users(users_filename, coaches_filename)
{
    fs.readFile(users_filename, 'utf8', function(err, users_data){
        fs.readFile(coaches_filename, 'utf8', function(err, coaches_data){ 
            let lines = users_data.split("\n");
            let lines_coaches = coaches_data.split("\n");
            for(let i = 1; i < lines.length; i++)
            {
                let line = lines[i].split(",");
                let line_coach = lines_coaches[i].split("\t");
                let role;
                if(Math.random() > 0.5)
                    role = "coach";
                else
                    role = "client";
                business_layer.insert_user_business_layer(line[1], line[2], line[4], line[3], "password", role).then((response) =>{
                    business_layer.alter_account_info_business_layer(i.toString(), undefined, undefined, undefined, undefined, undefined, line[5], undefined, undefined, undefined, undefined).then((response_2) =>{
                        if(role == "coach")
                        {
                            let sql = "UPDATE Coaches SET availability=?, hourly_rate=?, coaching_history=?, accepting_new_clients=?, experience_level=? WHERE user_id=?";
                            let hourly_rate = Math.floor(Math.random() * 10000 + 10000) / 100;
                            let accepting_new_clients = 0;
                            if(Math.random() > 0.5)
                            {
                                accepting_new_clients = 1;
                            }
                            let experience_level = Math.floor(Math.random() * 20);
                            con.query(sql, [line_coach[1], hourly_rate, line_coach[2], accepting_new_clients, experience_level, i], function(err, result){
                                if(err)
                                {
                                    console.log(err);
                                }
                            });
                        }
                    }).catch((err_2) =>{
                        console.log(err_2);
                    });
                }).catch((err) =>{
                    console.log(i);
                    console.log(line);
                    console.log(err);
                })
            }
        }) 

    })
}

async function load_user_profiles(filename)
{
    fs.readFile(filename, 'utf8', function(err, data){
        let lines = data.split("\n");
        for(let i = 1; i < lines.length; i++)
        {
            let line = lines[i].split("\t");
            let about_me = line[1];
            let medical_conditions = line[2];
            let goals = line[3];
            let age = Math.floor(Math.random() * 90 + 10).toString();
            let height = Math.random() * 100 + 10;
            let weight = Math.random() * 100 + 10;
            let target_weight = Math.random() * 100 + 10;
            let experience_level;
            let rand = Math.random();
            if(rand < 1/3)
            {
                experience_level = "Beginner";
            }
            else if(rand < 2/3)
            {
                experience_level = "Intermediate";
            }
            else
            {
                experience_level = "Advanced";
            }
            let budget = Math.floor(Math.random() * 3);
            let sql = "UPDATE User_Profile SET about_me=?, experience_level=?, age=?, height=?, weight=?, medical_conditions=?, budget=?, goals=?, target_weight=? WHERE user_id=?"
            con.query(sql, [about_me, experience_level, age, height, weight, medical_conditions, budget, goals, target_weight, i], function(err, result){
                if(err)
                {
                    console.log(err);
                }
            });
        }
    })
}
async function load_coach_goals()
{
    let goals_list = ['gain weight', 'lose weight', 'gain muscle', 'gain strength'];
    let get_coach_ids_sql = "SELECT user_id FROM Coaches";
    con.query(get_coach_ids_sql, function(err, result){
        if(err)
        {
            console.log(err);
        }
        for(let i = 0; i < result.length; i++)
        {
            let goals = [];
            let num_goals = 1;
            if(Math.random() < 0.5)
                num_goals = 2;
            for(let j = 0; j < num_goals; j++)
            {
                let goal_index = Math.floor(Math.random()*goals_list.length);
                if(goals.length > 0 && goals_list[goal_index] == goals[0])
                    goal_index = (goal_index + 1) % goals_list.length;
                goals.push(goals_list[goal_index]);
                let insert_goal_sql = "INSERT INTO Coaches_Goals (coach_id, goal) VALUES (?, ?)";
                con.query(insert_goal_sql, [result[i].user_id, goals[goals.length-1]], function(err, result){
                    if(err)
                    {
                        console.log(err);
                    }
                });
            }
        }
    });
}
async function load_locations(filename)
{
    let states = [ 'AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA',
    'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME',
    'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM',
    'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX',
    'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY'];
    let data = fs.readFileSync(filename, 'utf8');
    let lines = data.split("\n");
    let cities = [];
    let addresses = [];
    for(let i = 1; i < lines.length; i++)
    {
        let line = lines[i].split("\t");
        let city = line[0];
        let address = line[1];
        cities.push(city);
        addresses.push(address);
    }
    for(let i = 1; i <= 1000; i++)
    {
        let state = states[Math.floor(Math.random() * states.length)];
        let city = cities[Math.floor(Math.random() * cities.length)]
        let address = addresses[Math.floor(Math.random() * addresses.length)];
        let zip = "";
        for(let i = 0; i < 5; i++)
        {
            zip = zip + (Math.floor(Math.random() * 10)).toString();
        }
        if(state !== undefined && city !== undefined && address !== undefined && zip !== undefined)
        {
            business_layer.set_user_address_business_layer(i, address, city, state, zip).then((response) =>{

            }).catch((err) => {
                console.log(err);
            });
        }
    }

}
async function load_exercise_bank(filename)
{
    let data = fs.readFileSync(filename, 'utf8');
    let lines = data.split("\n");
    for(let i = 1; i < lines.length; i++)
    {
        let line = lines[i].split("\t");
        let exercise_name = line[0];
        let exercise_description = line[1];
        let user_who_created_it = Math.floor(Math.random() * 800);
        let sql = "INSERT INTO Exercise_Bank (name, description, user_who_created_it) VALUES (?, ?, ?)";
        con.query(sql, [exercise_name, exercise_description, user_who_created_it], function(err, result){
            if(err)
            {
                console.log(err);
            }
        });
    }
}

async function load_workout_plans(filename)
{
    let data = fs.readFileSync(filename, 'utf8');
    let lines = data.split("\n");
    for(let i = 1; i < lines.length; i++)
    {
        let line = lines[i].split("\t");
        let workout_plan_name = line[0];
        let user_who_created_it = Math.floor(Math.random() * 800);
        let sql = "INSERT INTO Workout_Plans (name, user_who_created_it) VALUES (?, ?)";
        con.query(sql, [workout_plan_name, user_who_created_it], function(err, result){
            if(err)
            {
                console.log(err);
            }
        });
    }
}
function shuffle(array)
{
    for(let i = 0; i < array.length; i++)
    {
        let random_index = Math.floor(Math.random() * array.length);
        let temp = array[i];
        array[i] = array[random_index];
        array[random_index] = temp;
    }
}
    
async function load_workout_plan_exercises()
{
    let weekdays = ['sunday', 'monday', 'tuesday', 'wednesay', 'thursday', 'friday', 'saturday'];
    let times = ["12:30:00", "18:30:00", "10:00:00", "15:30:00", "22:00:00", "08:00:00", "06:30:00", "07:30:00", "05:30:00", "04:30:00"];

    for(let i = 1; i <= 19; i++)
    {
        shuffle(weekdays);
        shuffle(times);
        for(let j = 0; j < 5; j++)
        {
            let exercise_id = Math.floor(Math.random() * 47) + 1;
            let sql = "INSERT INTO Workout_Plan_Exercises (workout_plan_id, exercise_id, weekday, time) VALUES (?, ?, ?, ?)";
            con.query(sql, [i, exercise_id, weekdays[j], times[j]], function(err, result){
                if(err)
                {
                    console.log(err);
                }
            });
        }
    }
}
async function load_client_coach()
{
    let get_coaches_sql = "SELECT user_id FROM Coaches";
    con.query(get_coaches_sql, function(err, result){
        let coach_ids = [];
        for(let i = 0; i < result.length; i++)
        {
            coach_ids.push(result[i].user_id)
        }
        for(let i = 0; i < 1000; i += 2)
        {
            let sql = "INSERT INTO Client_Coach (client_id, coach_id) VALUES (?, ?)";
            let client_id = i + 1;
            let coach_id = coach_ids[Math.floor(Math.random() * coach_ids.length)];
            if(client_id == coach_id)
                continue;
            con.query(sql, [client_id, coach_id], function(err, result){
                if(err)
                {
                    console.log(err);
                }
            });
        }
        
    });
}
async function load_messages(filename)
{
    let data = fs.readFileSync(filename, 'utf8');
    let lines = data.split("\n");
    let get_coach_client_sql = "SELECT client_id, coach_id FROM Client_Coach";
    con.query(get_coach_client_sql, function(err, result){
        let ids = [];
        for(let i = 0; i < result.length; i++)
        {
            ids.push([result[i].client_id, result[i].coach_id]);
        }
        for(let i = 0; i < ids.length; i++)
        {
            for(let j  = 0; j < 10; j++)
            {
                let sql = "INSERT INTO Messages (sender_id, receiver_id, created, modified, content) VALUES (?, ?, ADDTIME(CURRENT_TIMESTAMP(), ?), ADDTIME(CURRENT_TIMESTAMP(), ?), ?)";
                let sender_id = ids[i][0];
                let receiver_id = ids[i][1];
                let message = (lines[Math.floor(lines.length * Math.random())].split("\t"))[0]
                con.query(sql, [sender_id, receiver_id, j, j, message], function(err, result){
                    if(err)
                    {
                        console.log(err);
                    }
                });
                let temp = ids[i][0]
                ids[i][0] = ids[i][1];
                ids[i][1] = temp;
            }
        }
        
    });
}
async function load_user_workout_plan()
{
    for(let i = 1; i <= 1000; i++)
    {
        let workout_plan_id = Math.floor(Math.random() * 19) + 1;
        let sql = "INSERT INTO User_Workout_Plan (user_id, workout_plan_id) VALUES (?, ?)";
        con.query(sql, [i, workout_plan_id], function(err, result){
            if(err)
            {
                console.log(err);
            }
        });
    
    }
}

async function load_user_workout_progress()
{
    for(let week = 0; week < 10; week++) //We will generate 10 weeks of activity logs for each user
    {
        for(let i = 1; i <= 1000; i++)
        {
            let sql = "SELECT Workout_Plan_Exercises.id, Workout_Plan_Exercises.weekday FROM Workout_Plan_Exercises INNER JOIN User_Workout_Plan ON Workout_Plan_Exercises.workout_plan_id = User_Workout_Plan.workout_plan_id WHERE User_Workout_Plan.user_id = ?";
            con.query(sql, [i], function(err, result){
                if(err)
                {
                    console.log(err);
                }
                for(let row = 0; row < result.length; row++)
                {
                    let workout_exercise_id = result[row].id;
                    let weekday = result[row].weekday;
                    let added_days = 0; //In order to set the workout progress log to the correct date.
                    switch(weekday)
                    {
                        case "monday":
                            added_days = 0;
                            break;
                        case "tuesday":
                            added_days = 1;
                            break;
                        case "wednesday":
                            added_days = 2;
                            break;
                        case "thursday":
                            added_days = 3;
                            break;
                        case "friday":
                            added_days = 4;
                            break;
                        case "saturday":
                            added_days = 5;
                            break;
                        case "sunday":
                            added_days = 6;
                            break;
                    }
                    added_days += 7 * week;
                    let weight = Math.floor(Math.random() * 100 + 10);
                    let reps = Math.floor(Math.random() * 5 + 2);
                    for(let set_number = 1; set_number <= 3; set_number++)
                    {
                        //HERE GOES!!!
                        let sql = "INSERT INTO Workout_Progress (user_id, workout_exercise_id, set_number, weight, reps, date) VALUES (?, ?, ?, ?, ?, DATE_ADD(\"2023-8-28\", INTERVAL ? DAY))";
                        con.query(sql, [i, workout_exercise_id, set_number, weight, reps, added_days], function(err, result){
                            if(err)
                            {
                                console.log(err);
                            }
                        });
                    }
                }
            });
        }
    }
}


async function load_ratings(filename)
{
    let data = fs.readFileSync(filename, 'utf8');
    let lines = data.split("\n");
    let get_coach_client_sql = "SELECT client_id, coach_id FROM Client_Coach";
    con.query(get_coach_client_sql, function(err, result){
        let ids = [];
        for(let i = 0; i < result.length; i++)
        {
            ids.push([result[i].client_id, result[i].coach_id]);
        }
        for(let i = 0; i < ids.length; i++)
        {
            let sql = "INSERT INTO Ratings (coach_id, client_id, comment, rating) VALUES (?, ?, ?, ?)";
            let sender_id = ids[i][0];
            let receiver_id = ids[i][1];
            let rating = Math.floor(Math.random() * 5 + 1);
            let message = (lines[Math.floor(lines.length * Math.random())].split("\t"))[0]
            con.query(sql, [receiver_id, sender_id, message, rating], function(err, result){
                if(err)
                {
                    console.log(err);
                }
            });
        }
    });
}
async function load_daily_survey()
{
    for(let i = 1; i <= 1000; i++)
    {
        for(let day = 0; day < 3*7; day++)
        {
            let calories_consumed = Math.floor(Math.random()*2000 + 2000);
            let calories_burned = Math.floor(Math.random()*2000 + 2000);
            let weight = Math.floor(Math.random() * 200 + 90);
            let sql = "INSERT INTO User_Daily_Survey (user_id, date, calories_burned, calories_consumed, weight) VALUES (?, DATE_ADD(\"2023-10-23\", INTERVAL ? DAY), ?, ?, ?)";
            con.query(sql, [i, day, calories_burned, calories_consumed, weight], function(err, result){
                if(err)
                {
                    console.log(err);
                }
            });

        }
    }
}
async function load_appointments(filename)
{
    let data = fs.readFileSync(filename, 'utf8');
    let lines = data.split("\n");
    let get_coach_client_sql = "SELECT client_id, coach_id FROM Client_Coach";
    con.query(get_coach_client_sql, function(err, result){
        let ids = [];
        for(let i = 0; i < result.length; i += 3) //Every third client/coach pair will have an appointment
        {
            ids.push([result[i].client_id, result[i].coach_id]);
        }
        for(let i = 0; i < ids.length; i++)
        {
            let sql = "INSERT INTO Appointments (description, client_id, coach_id, begin_time) VALUES (?, ?, ?, ADDTIME(CURRENT_TIMESTAMP(), \"? 0:00:00\"))";
            let coach_id = ids[i][0];
            let client_id = ids[i][1];
            let begin_offset = Math.floor(Math.random() * 10);
            let description = (lines[Math.floor(lines.length * Math.random())].split("\t"))[0]
            con.query(sql, [description, client_id, coach_id, begin_offset], function(err, result){
                if(err)
                {
                    console.log(err);
                }
            });
        }
    });
}

async function load_coach_requests(filename)
{
    let data = fs.readFileSync(filename, 'utf8');
    let lines = data.split("\n");
    let get_coach_client_sql = "SELECT client_id, coach_id FROM Client_Coach";
    con.query(get_coach_client_sql, function(err, result){
        let ids = [];
        for(let i = 0; i < result.length; i += 10) //Every tenth coach/client pair 
        {
            ids.push([result[i].client_id, result[i].coach_id]);
        }
        for(let i = 0; i < ids.length; i++)
        {
            let sql = "INSERT INTO Appointments (description, client_id, coach_id, begin_time) VALUES (?, ?, ?, ADDTIME(CURRENT_TIMESTAMP(), \"? 0:00:00\"))";
            let coach_id = ids[i][0];
            let client_id = ids[i][1];
            let begin_offset = Math.floor(Math.random() * 10);
            let description = (lines[Math.floor(lines.length * Math.random())].split("\t"))[0]
            con.query(sql, [description, client_id, coach_id, begin_offset], function(err, result){
                if(err)
                {
                    console.log(err);
                }
            });
        }
    });
}
async function load_coach_requests(filename)
{    
    let data = fs.readFileSync(filename, 'utf8');
    let lines = data.split("\n");
    let get_coach_client_sql = "SELECT client_id, coach_id FROM Client_Coach";
    con.query(get_coach_client_sql, function(err, result){
        let ids = [];
        for(let i = 0; i < result.length; i += 10) //Every tenth coach/client pair will become a client requesting a coach.
        {
            ids.push([result[i].client_id, result[i].coach_id]);
        }
        for(let i = 0; i < ids.length; i++)
        {
            data_layer.remove_coach_data_layer(ids[i][0], ids[i][1]).then((response) =>{
                let comment = (lines[Math.floor(lines.length * Math.random())].split("\t"))[0]
                let sql = "INSERT INTO Coach_Requests (coach_id, client_id, comment) VALUES (?, ?, ?)";
                con.query(sql, [ids[i][1],  ids[i][0], comment], function(err, result){
                    if(err)
                    {
                        console.log(err);
                    }
                });
            }).catch((err) =>{
                console.log(err);
            })

        }
    });
}
load_locations("locations.txt");