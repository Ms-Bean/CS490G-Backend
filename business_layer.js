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
                data_layer.accept_client_survey_data_layer(user_id, parseInt(weight), parseInt(height), experience_level, budget).then(response =>{
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
    // TODO, handle undefined comment
    return new Promise((resolve, reject) => {
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
    })
}

async function accept_client_business_layer2(user_id, client_id) {
    if (user_id === undefined || user_id === null) {
        return Promise.reject(new Error("User is not logged in"));
    }

    if (!Number.isInteger(user_id)) {
        return Promise.reject(new Error("Invalid user id"));
    } else if (!Number.isInteger(client_id)) {
        return Promise.reject(new Error("Invalid client id"));
    }

    if (!await data_layer.check_if_client_coach_request_exists(user_id, client_id)) {
        return Promise.reject(new Error("Request from client to coach does not exist"));
    } else if (await data_layer.check_if_client_has_hired_coach(user_id, client_id)) {
        return Promise.reject(new Error("Coach cannot accept request from one of their current clients"));
    }

    await data_layer.accept_client_data_layer(user_id, client_id);
    return Promise.resolve("You have accepted the client");  // TODO: Return name of client
}

async function accept_client_business_layer(coach_id, client_id)
{
    //TODO, check if coach_id and client_id belong to a coach and client, respectively
    return new Promise((resolve, reject) => {
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
    })
}

/**
 * 
 * @param {number} user_id1 
 * @param {number} user_id2 
 * @returns {Promise<boolean>} True if user 1 is coach of user 2; otherwise, False
 */
async function _check_if_coach_of(user_id1, user_id2) {
    const role1 = await data_layer.get_role_data_layer(user_id1);
    if (role1 !== 'coach') {
        return false;
    }

    const user1_clients = await data_layer.get_clients_of_coach(user_id1) || [];
    return user1_clients.includes(user_id2);
}

/**
 * 
 * @param {number} current_user_id 
 * @param {number} recipient_id 
 * @param {string} content 
 * @returns {Promise<string>} 
 */
async function insert_message_business_layer(current_user_id, recipient_id, content) {
    if (!Number.isInteger(current_user_id)) {
        return Promise.reject("Invalid user id");
    }
    if (!Number.isInteger(recipient_id)) {
        return Promise.reject("Invalid recipient id");
    }
    if (!content) {
        return Promise.reject("Cannot send empty message");
    }

    let coach_id, client_id;
    if (await _check_if_coach_of(current_user_id, recipient_id)) {
        coach_id = current_user_id;
        client_id = recipient_id;
    } else if (await _check_if_coach_of(recipient_id, current_user_id)) {
        coach_id = recipient_id;
        client_id = current_user_id;
    } else {
        return Promise.reject("User cannot send message to recipient that's not their coach or client");
    }
    return data_layer.insert_message_data_layer(coach_id, client_id, content);
}

// TODO rename other_user_id to a more descriptive name
async function get_client_coach_messages_business_layer(current_user_id, other_user_id, page_size, page_num) {
    if (!Number.isInteger(current_user_id)) {
        return Promise.reject("Invalid user id");
    }
    if (!Number.isInteger(other_user_id)) {
        return Promise.reject("Invalid other user id");
    }
    if (!Number.isInteger(page_size) || page_size <= 0) {
        return Promise.reject("Invalid page size");
    }
    if (!Number.isInteger(page_num) || page_num <= 0) {
        return Promise.reject("Invalid page number");
    }

    let coach_id, client_id;
    if (await _check_if_coach_of(current_user_id, other_user_id)) {
        coach_id = current_user_id;
        client_id = other_user_id;
    } else if (await _check_if_coach_of(other_user_id, current_user_id)) {
        coach_id = other_user_id;
        client_id = current_user_id;
    } else {
        return Promise.reject("User cannot view messages from user that's not their coach or client");
    }

    const message_count = await data_layer.count_client_coach_messages(client_id, coach_id);
    const page_count = Math.ceil(message_count / page_size);
    
    const messages = await data_layer.get_client_coach_message_page_data_layer(client_id, coach_id, page_size, page_num);
    const messages_dto = {
        page_info: {
            page_num: page_num,
            page_size: page_size,
            page_count: page_count,
            has_next: page_num < page_count,
            has_prev: page_num > 1
        },
        messages: messages
    }
    return messages_dto;
} 

async function get_role_business_layer(user_id) { // Remove reject calls, not valid in async function (use throw instead)
    if (!/^[0-9]+$/.test(user_id)) {
      throw new Error("Invalid user id");
    }
    try {
      const response = await data_layer.get_role_data_layer(user_id);
      return response; 
    } catch (error) {
      throw error;
    }
}

async function set_user_address_business_layer(user_id, address, city, state, zip_code)
{
    if(!/^[0-9]{5}$/.test(zip_code))
    {
        return Promise.reject("Invalid zip code");
    }
    return new Promise((resolve, reject) =>{    
        data_layer.get_role_data_layer(user_id).then((response) =>{ //Check that the user exists
            data_layer.check_state_exists(state).then((response) =>{
                data_layer.unset_user_address_data_layer(user_id).then((response) =>{ //This should have no effect if the user does not already have an address.
                    data_layer.set_user_address_data_layer(user_id, address, city, state, zip_code).then(response =>{
                        resolve(response);
                    }).catch((err) =>{
                        console.log("ERROR");
                        reject(err);
                    });
                }).catch((err) =>{
                    reject(err);
                })
            }).catch((err) =>{
                reject(err);
            });
        }).catch((err) =>{
            reject("User not found");
        }); 
    })
}
async function alter_account_info_business_layer(user_id, first_name, last_name, username, email, password, phone_number, address, city, state, zip_code)
{    
    console.log("Business layer");
    return new Promise((resolve, reject) => {
        console.log("Phone number:");
        console.log(phone_number);
        data_layer.alter_account_info_data_layer(user_id, first_name, last_name, username, email, password, phone_number).then(response =>{
            if(address && city && state && zip_code)
            {
                data_layer.unset_user_address_data_layer(user_id).then(response =>{
                    data_layer.set_user_address_data_layer(user_id, address, city, state, zip_code).then(response =>{
                        console.log(response);
                        resolve(response);
                    }).catch((err) =>{
                        console.log(err);
                        reject(err);
                    });
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
async function get_user_account_info_business_layer(user_id)
{
    return new Promise((resolve, reject) =>{
        data_layer.get_role_data_layer(user_id).then(getrole_response =>{
            data_layer.get_user_account_info_data_layer(user_id).then(response =>{
                resolve(response);
            }).catch((err) =>{
                reject(err);
            });
        }).catch((err) =>{
            reject("User is not logged in.");
        })
    });
}

module.exports.accept_client_business_layer = accept_client_business_layer2;
module.exports.login_business_layer = login_business_layer;
module.exports.insert_user_business_layer = insert_user_business_layer;
module.exports.accept_client_survey_business_layer = accept_client_survey_business_layer;
module.exports.accept_coach_survey_business_layer = accept_coach_survey_business_layer;
module.exports.request_coach_business_layer = request_coach_business_layer;
module.exports.get_role_business_layer = get_role_business_layer;
module.exports.insert_message_business_layer = insert_message_business_layer;
module.exports.get_client_coach_messages_business_layer = get_client_coach_messages_business_layer;
module.exports.set_user_address_business_layer = set_user_address_business_layer;
module.exports.get_user_account_info_business_layer = get_user_account_info_business_layer;
module.exports.alter_account_info_business_layer = alter_account_info_business_layer;