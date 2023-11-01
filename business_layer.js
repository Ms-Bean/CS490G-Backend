const data_layer = require("./data_layer");
const bcrypt = require('bcrypt');

async function insert_user_business_layer(first_name, last_name, username, email, password, role)
{
    const usernameExistsFlag = await data_layer.check_if_username_exists(username); //checking check_if_username_exists 

    if(usernameExistsFlag){
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
        data_layer.insert_user_data_layer(first_name, last_name, username, email, hashed_password, salt, role).then((data_layer_response) =>{
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

async function assign_role_business_layer(user_id, is_coach)
{
    return new Promise((resolve, reject) =>{
        if(typeof user_id != "number")
        {
            reject("invalid user_id"); //This is probably a hacker sending custom packets
        }
        if(typeof is_coach != "boolean")
        {
            reject("invalid is_coach flag");
        }
        data_layer.assign_role_data_layer(user_id, is_coach).then(response =>{
            resolve(response)
        }).catch((error =>{
            reject(error);
        }));
    });
}
async function accept_client_survey_business_layer(user_id, weight=undefined, height=undefined, experience_level=undefined, budget=undefined)
{
    //TODO, check if user is a client
    return new Promise((resolve, reject) =>{
        if(user_id == undefined)
        {
            reject("User is not logged in.");
        }
        if(typeof(user_id) != "number")
        {
            reject("Invalid user id");
        }
        if(weight != undefined && typeof(weight) != number)
        {
            reject("Invalid weight");
        }
        if(height != undefined && typeof(height) != number)
        {
            reject("Invalid height");
        }
        if(experience_level != undefined && experience_level != "beginner" && experience_level != "intermediate" && experience_level != "advanced")
        {
            reject("Invalid experience level");
        }
        if(typeof(budget) != number)
        {
            reject("Invalid budget");
        }
        data_layer.accept_client_survey_data_layer(user_id, weight, height, experience_level, budget).then(response =>{
            resolve(response);
        }).catch((error) =>{
            reject(error);
        });
    });
}
async function accept_coach_survey_business_layer(user_id, cost_per_session, availability, experience)
{
    //TODO check if user is coach
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
    data_layer.accept_coach_survey_data_layer(user_id, cost_per_session, availability, experience).then(response =>{
        resolve(response);
    }).catch((error) =>{
        reject(error);
    });
}
module.exports.login_business_layer = login_business_layer;
module.exports.insert_user_business_layer = insert_user_business_layer;
module.exports.assign_role_business_layer = assign_role_business_layer;
module.exports.accept_client_survey_business_layer = accept_client_survey_business_layer;
module.exports.accept_coach_survey_business_layer = accept_coach_survey_business_layer;