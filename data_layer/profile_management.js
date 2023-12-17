let connection = require("./conn");
let con = connection.con;


async function get_client_profile_info(user_id)
{
    let return_data = {
        about_me: "",
        experience_level: "",
        height: "",
        weight: "",
        medical_conditions: "",
        budget: "",
        goals: "",
        target_weight: "",
        pfp_link: "",
        birthday: ""
    };
    let get_client_profile_sql = "SELECT pfp_link, about_me, experience_level, height, weight, medical_conditions, budget, goals, target_weight, birthday FROM User_Profile WHERE user_id = ?"
    return new Promise((resolve, reject) =>{
        con.query(get_client_profile_sql, [user_id], function(err, results){
            if(err)
            {
                console.log(err);
                reject("sql failure");
            }
            if(results.length > 0) //The user may not have given an address
            {
                return_data.about_me = results[0].about_me;
                return_data.experience_level = results[0].experience_level;
                return_data.height = results[0].height;
                return_data.weight = results[0].weight;
                return_data.medical_conditions = results[0].medical_conditions;
                return_data.budget = results[0].budget;
                return_data.goals = results[0].goals;
                return_data.target_weight = results[0].target_weight;
                return_data.pfp_link = results[0].pfp_link;
                return_data.birthday = results[0].birthday;
            }
            resolve(return_data);
        });
    })
}
async function get_coach_profile_info(user_id)
{
    let return_data = {
        availability: "",
        hourly_rate: "",
        coaching_history: "",
        accepting_new_clients: "",
        experience_level: "",
        paypal_link: ""
    };
    let get_coach_profile_sql = "SELECT availability, hourly_rate, coaching_history, accepting_new_clients, experience_level, paypal_link FROM Coaches WHERE user_id = ?"
    return new Promise((resolve, reject) =>{
        con.query(get_coach_profile_sql, [user_id], function(err, results){
            if(err)
            {
                console.log(err);
                reject("sql failure");
            }
            if(results.length > 0) //The user may not have given an address
            {
                return_data.availability = results[0].availability;
                return_data.hourly_rate = results[0].hourly_rate;
                return_data.accepting_new_clients = results[0].accepting_new_clients;
                return_data.coaching_history = results[0].coaching_history;
                return_data.experience_level = results[0].experience_level;
                return_data.paypal_link = results[0].paypal_link;
            }
            resolve(return_data);
        });
    })
}

async function set_client_profile_info(user_id, about_me, experience_level, height, weight, medical_conditions, budget, goals, target_weight, birthday, pfp_link)
{
    console.log("Birthday:");
    console.log(birthday);
    let set_client_profile_sql = "UPDATE User_Profile SET pfp_link=?, about_me=?, experience_level=?, height=?, weight=?, medical_conditions=?, budget=?, goals=?, target_weight=?, birthday=? WHERE user_id=?"
    console.log(set_client_profile_sql);
    console.log([pfp_link, about_me, experience_level, height, weight, medical_conditions, budget, goals, target_weight, birthday, user_id]);
    return new Promise((resolve, reject) =>{
        con.query(set_client_profile_sql, [pfp_link, about_me, experience_level, height, weight, medical_conditions, budget, goals, target_weight, birthday, user_id], function(err, results){
            if(err)
            {
                console.log(err);
                reject("sql failure");
            }
            resolve("Client profile updated");
        });
    })
}
async function set_coach_profile_info(user_id, availability, hourly_rate, coaching_history, accepting_new_clients, experience_level, paypal_link)
{
    let set_coach_profile_sql = "UPDATE Coaches SET availability=?, hourly_rate=?, coaching_history=?, accepting_new_clients=?, experience_level=?, paypal_link = ? WHERE user_id=?";
    return new Promise((resolve, reject) =>{
        con.query(set_coach_profile_sql, [availability, hourly_rate, coaching_history, accepting_new_clients, experience_level, paypal_link, user_id], function(err, results){
            if(err)
            {
                console.log(err);
                reject("sql failure");
            }
            resolve("Coach profile updated");
        });
    })
}

module.exports.get_client_profile_info = get_client_profile_info;
module.exports.get_coach_profile_info = get_coach_profile_info;
module.exports.set_client_profile_info = set_client_profile_info;
module.exports.set_coach_profile_info = set_coach_profile_info;
