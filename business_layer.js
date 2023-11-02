const data_layer = require("./data_layer");
const bcrypt = require('bcrypt');

async function insert_user_business_layer(first_name, last_name, username, email, password, role)
{
    const username_Exists_Flag = await data_layer.check_if_username_exists_data_layer(username); //checking check_if_username_exists 
    if(username_Exists_Flag){
        return Promise.reject("That username is already taken.");
    } 
    else {
        if(!/^([a-zA-Z]|[0-9]|[_])+$/.test(username))
            return Promise.reject("Username containing characters other than letters, numbers, or underscores entered.");}
    if(!/^[a-zA-Z\-]+$/.test(first_name))
        return Promise.reject("First name must contain letters or hyphens only");
    if(first_name.length > 255)
        return Promise.reject("Excessively long first name entered.");
    if(!/^[a-zA-Z\-]+$/.test(last_name))
        return Promise.reject("Last name must contain letters or hyphens only");
    if(last_name.length > 255)
        return Promise.reject("Excessively long last name entered.");
    if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
        return Promise.reject("Invalid email entered.");
    if(email.length > 255)
        return Promise.reject("Excessively long email entered.")
    if(username.length > 255)
        return Promise.reject("Excessively long username entered.");
    if(username.length < 1)
        return Promise.reject("Empty username entered.");
    if(/^.*'.*$/.test(password) || /^.*".*$/.test(password))
        return Promise.reject("Password cannot contain quotes.");
    if(password.length < 1)
            return Promise.reject("Empty password entered.");
    if(role != "client" && role != "coach")
        return Promise.reject("Role must be client or coach");
        
    var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    var salt = '';
    for (var i = 0; i < 10; i++ )
       salt += chars.charAt(Math.floor(Math.random() * chars.length));

    const salted_password = password + salt;
    const hashed_password = await new Promise((resolve, reject) => {
        bcrypt.hash(salted_password, 10, function(err, hash) {
            if(err) reject(err)
            resolve(hash)
        });
    })   
    return new Promise((resolve, reject) => {

    console.log("Going to insert");
        data_layer.insert_user_data_layer(first_name, last_name, username, email, hashed_password, salt, role).then((data_layer_response) =>{
        
      console.log("INserted");
            resolve({
                user_id: data_layer_response,
                message: "Successfully added user"
            });
        }).catch((error) =>{
            console.log("data layer failed");
            reject(error);
        });
    });
}

async function login_business_layer(username, password) {
    return new Promise((resolve, reject) => {
        data_layer.login_data_layer(username).then((data) => {
            const { password_hash, password_salt, user_id } = data;
            const salted_password = password + password_salt;
            bcrypt.compare(salted_password, password_hash, function(err, result) {
                if(err) reject(err);
                if(result) resolve({
                    message: "Login successful",
                    user_id: user_id
                });
                else reject("Invalid credentials");
            });
        }).catch((error) => {
            reject(error);
        });
    });
}

async function accept_client_survey_business_layer(user_id, weight=undefined, height=undefined, experience_level=undefined, budget=undefined)
{
    const role = await data_layer.get_role_data_layer(user_id); //checking if user is a client
    if(role == 'client'){
        return new Promise((resolve, reject) =>{
            if(user_id === undefined)
            {
                reject("User is not logged in.");
            }
            else if(typeof(user_id) != "number")
            {
                reject("Invalid user id");
            }
            else if(!/^[0-9]+$/.test(weight))
            {
                console.log(weight);
                console.log(typeof(weight))
                reject("Invalid weight");
            }
            else if(!/^[0-9]+$/.test(height))
            {
                reject("Invalid height");
            }
            else if(experience_level !== undefined && experience_level != "Beginner" && experience_level != "Intermediate" && experience_level != "Advanced")
            {
                reject("Invalid experience level");
                console.log(experience_level);
            }
            else if(budget != "$" && budget != "$$" && budget != "$$$")
            {
                console.log(budget);
                reject("Invalid budget");
            }
            else
            {
                if(budget == "$")
                    budget = 1
                if(budget == "$$")
                    budget = 2
                if(budget == "$$$")
                    budget = 3;
                data_layer.accept_client_survey_data_layer(user_id, weight, height, experience_level, budget).then(response =>{
                    resolve(response);
                }).catch((error) =>{
                    reject(error);
                });
            }
        });
    }
    else{
        return Promise.reject("User is not a client.");
    }
}
async function accept_coach_survey_business_layer(user_id, cost_per_session, availability, experience)
{
    const role = await data_layer.get_role_data_layer(user_id); //checking if user is a coach
    
    if(role == "coach"){
        return new Promise((resolve, reject) =>{
            if(user_id == undefined)
            {
                reject("User is not logged in.");
            }
            if(typeof(user_id) != "number")
            {
                reject("Invalid user_id");
            }
            if(typeof(cost_per_session) != "number")
            {
                reject("Invalid cost per session");
            }
            if(typeof(availability) != "string")
            {
                reject("Invalid availability");
            }
            if(typeof(experience) != "string")
            {
                reject("Invalid experience");
            }
            if(/^.*'.*$/.test(availability))
            {
                reject("Availability cannot contain quotes"); //TODO: Allow quotes without sql injection
            }
            if(/^.*'.*$/.test(experience))
            {
                reject("Experience cannot contain quotes");
            }
            data_layer.accept_coach_survey_data_layer(user_id, cost_per_session, availability, experience).then(response =>{
                resolve(response);
            }).catch((error) =>{
                reject(error);
            });
        });
    }
    else{
        return Promise.reject("User is not a coach.");
    }
}
async function request_coach_business_layer(coach_id, client_id, comment)
{
    //TODO, Check if coach_id and client_id belong to a coach and a client, respectively
    //Reject with "You are not logged in as a client" if client_id does not belong to a client

    if(client_id == undefined)
    {
        reject("User is not logged in");
    }
    if(!/^[0-9]+$/.test(coach_id))
    {
        reject("Invalid coach id");
    }
    if(/^.*'.*$/.test(comment))
    {
        reject("Comment cannot contain quotes") //TODO allow comment to contain quotes without SQL injection
    }
    data_layer.request_coach_data_layer(coach_id, client_id, comment).then(response =>{
        resolve(response);
    }).catch((error) =>{
        reject(error);
    });
}

async function accept_client_business_layer(coach_id, client_id)
{
    //TODO, check if coach_id and client_id belong to a coach and client, respectively
    if(coach_id === undefined)
    {
        reject("User not logged in");
    }
    if(!/^[0-9]+$/.test(coach_id))
    {
        reject("Invalid coach id");
    }
    if(!/^[0-9]+$/.test(client_id))
    {
        reject("Invalid client id");
    }
    data_layer.accept_client_data_layer(coach_id, client_id).then(response =>{
        resolve(response);
    }).catch((error) =>{
        reject(error);
    });
}

async function get_role_business_layer(user_id)
{
    if(!/^[0-9]+$/.test(user_id))
    {
        reject("Invalid user id");
    }
    data_layer.get_role_data_layer(user_id).then(response =>{
        resolve(response)
    }).catch((error) =>{
        reject(error);
    });
}


module.exports.accept_client_business_layer = accept_client_business_layer;
module.exports.login_business_layer = login_business_layer;
module.exports.insert_user_business_layer = insert_user_business_layer;
module.exports.accept_client_survey_business_layer = accept_client_survey_business_layer;
module.exports.accept_coach_survey_business_layer = accept_coach_survey_business_layer;
module.exports.request_coach_business_layer = request_coach_business_layer;
module.exports.get_role_business_layer = get_role_business_layer;