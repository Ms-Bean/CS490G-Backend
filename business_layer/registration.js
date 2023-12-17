const login = require("../data_layer/login");
const registration = require("../data_layer/registration");
const user_info = require("../data_layer/user_info");
const coach_search = require("../data_layer/coach_search");
const daily_survey = require("../data_layer/daily_survey");
const client_coach_interaction = require("../data_layer/client_coach_interaction");
const messaging = require("../data_layer/messaging")
const bcrypt = require('bcrypt');

async function insert_user_business_layer(first_name, last_name, username, email, password, role)
{
    const username_Exists_Flag = await registration.check_if_username_exists_data_layer(username); //checking check_if_username_exists 
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
        
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    let salt = '';
    for (let i = 0; i < 10; i++ )
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
        registration.insert_user_data_layer(first_name, last_name, username, email, hashed_password, salt, role).then((data_layer_response) =>{
        
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

// Function to set the user's address
/**
 * @param {number} user_id - ID of the user.
 * @param {string} address - User's address.
 * @param {string} city - User's city.
 * @param {string} state - User's state.
 * @param {string} zip_code - User's ZIP code.
 * @returns {Promise<string>} - Resolves with a success message if the address is set successfully.
 * @throws {Promise<string>} - Rejects with an error message if address setting fails.
 */
async function set_user_address_business_layer(user_id, address, city, state, zip_code)
{
    if(!/^[0-9]{5}$/.test(zip_code))
    {
        return Promise.reject("Invalid zip code");
    }
    return new Promise((resolve, reject) =>{    
        user_info.get_role(user_id).then((response) =>{ //Check that the user exists
            registration.set_user_address_data_layer(user_id, address, city, state, zip_code).then(response =>{
                resolve(response);
            }).catch((err) =>{
                console.log("ERROR");
                reject(err);
            });
        }).catch((err) =>{
            console.log("ERROR");
            reject(err);   
        });
    });
}

// Function to alter user account information
/**
 * @param {number} user_id - ID of the user.
 * @param {string} first_name - User's new first name.
 * @param {string} last_name - User's new last name.
 * @param {string} username - User's new username.
 * @param {string} email - User's new email address.
 * @param {string} password - User's new password.
 * @param {string} phone_number - User's new phone number.
 * @param {string} address - User's new address.
 * @param {string} city - User's new city.
 * @param {string} state - User's new state.
 * @param {string} zip_code - User's new ZIP code.
 * @returns {Promise<string>} - Resolves with a success message if account information is altered successfully.
 * @throws {Promise<string>} - Rejects with an error message if alteration fails.
 */
async function alter_account_info_business_layer(user_id, first_name, last_name, username, email, password, phone_number, address, city, state, zip_code)
{          
    let salt, salted_password, hashed_password;
    if(password !== undefined)
    {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
        salt = '';
        for (let i = 0; i < 10; i++ )
        salt += chars.charAt(Math.floor(Math.random() * chars.length));

        salted_password = password + salt;
        hashed_password = await new Promise((resolve, reject) => {
            bcrypt.hash(salted_password, 10, function(err, hash) {
                if(err) reject(err)
                resolve(hash)
            });
        })   
    }
    return new Promise((resolve, reject) => {
        console.log("Phone number:");
        console.log(phone_number);
  
        registration.alter_account_info_data_layer(user_id, first_name, last_name, username, email, hashed_password, salt, phone_number).then(response =>{
            console.log("Hooloo");
            if(address && city && state && zip_code)
            {
                console.log("Hello");
                registration.set_user_address_data_layer(user_id, address, city, state, zip_code).then(response =>{
                    resolve(response);
                }).catch((err) =>{
                    console.log(err);
                    reject(err);
                });
            }
            else
            {
                console.log(address);
                console.log(city);
                console.log(state);
                console.log(zip_code);
                resolve("User information updated");
            }
        }).catch((err) =>
        {
            console.log(err);
            reject(err);
        });
    });
}

// Function to handle accepting client survey responses
/**
 * @param {number} user_id - User's ID.
 * @param {number} weight - Client's weight.
 * @param {number} height - Client's height.
 * @param {string} experience_level - Client's fitness experience level.
 * @param {string} budget - Client's budget range.
 * @returns {Promise<Object>} - Resolves with success message if survey acceptance is successful.
 * @throws {Promise<string>} - Rejects with an error message if acceptance fails.
 */
async function accept_client_survey_business_layer(user_id, weight=undefined, height=undefined, experience_level=undefined, budget=undefined)
{
    const role = await user_info.get_role(user_id); //checking if user is a client
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
                budget = budget.length; //Convert it to an int 1 to 3
            }
            else
            {
                if(budget == "$")
                    budget = 1
                if(budget == "$$")
                    budget = 2
                if(budget == "$$$")
                    budget = 3;
                registration.accept_client_survey_data_layer(user_id, parseInt(weight), parseInt(height), experience_level, budget).then(response =>{
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

// Function to handle accepting coach survey responses
/**
 * @param {number} user_id - User's ID.
 * @param {number} cost_per_session - Coach's cost per session.
 * @param {string} availability - Coach's availability.
 * @param {string} experience - Coach's experience details.
 * @returns {Promise<Object>} - Resolves with success message if survey acceptance is successful.
 * @throws {Promise<string>} - Rejects with an error message if acceptance fails.
 */
async function accept_coach_survey_business_layer(user_id, cost_per_session, availability, experience)
{
    const role = await user_info.get_role(user_id); //checking if user is a coach
    
    if(role == "coach"){
        return new Promise((resolve, reject) =>{
            if(user_id == undefined)
            {
                reject("User is not logged in.");
            }
            if(!/^[0-9]+$/.test(user_id))
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
            registration.accept_coach_survey_data_layer(user_id, cost_per_session, availability, experience).then(response =>{
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

module.exports.insert_user_business_layer = insert_user_business_layer;
module.exports.set_user_address_business_layer = set_user_address_business_layer;
module.exports.alter_account_info_business_layer = alter_account_info_business_layer;
module.exports.accept_client_survey_business_layer = accept_client_survey_business_layer;
module.exports.accept_coach_survey_business_layer = accept_coach_survey_business_layer;