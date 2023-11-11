const exp = require("constants");
const business_layer = require("../business_layer");
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
load_coach_goals();