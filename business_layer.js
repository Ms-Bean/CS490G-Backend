const data_layer = require("./data_layer");
const bcrypt = require('bcrypt');

// Function to handle user registration
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

// Function to handle user login
/**
 * @param {string} username - User's username.
 * @param {string} password - User's password.
 * @returns {Promise<Object>} - Resolves with success message and user_id if login is successful.
 * @throws {Promise<string>} - Rejects with an error message if login fails.
 */
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

// Function to handle client requesting a coach
/**
 * @param {number} coach_id - ID of the requested coach.
 * @param {number} client_id - ID of the requesting client.
 * @param {string} comment - Additional comment from the client.
 * @returns {Promise<Object>} - Resolves with success message if the request is successful.
 * @throws {Promise<string>} - Rejects with an error message if the request fails.
 */
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

// Function to handle accepting a client by a coach
/**
 * @param {number} current_user_id - ID of the coach receiving the request.
 * @param {number} client_id - ID of the client being accepted.
 * @returns {Promise<string>} - Resolves with a success message if acceptance is successful.
 * @throws {Promise<string>} - Rejects with an error message if acceptance fails.
 */
async function accept_client_business_layer(current_user_id, client_id) {
    if (current_user_id === undefined || current_user_id === null) {
        return Promise.reject(new Error("User is not logged in"));
    }

    if (!Number.isInteger(current_user_id)) {
        return Promise.reject(new Error("Invalid user id"));
    } else if (!Number.isInteger(client_id)) {
        return Promise.reject(new Error("Invalid client id"));
    }

    if (!await data_layer.check_if_client_coach_request_exists(current_user_id, client_id)) {
        return Promise.reject(new Error("Request from client to coach does not exist"));
    } else if (await data_layer.check_if_client_has_hired_coach(current_user_id, client_id)) {
        return Promise.reject(new Error("Coach cannot accept request from one of their current clients"));
    }

    await data_layer.accept_client_data_layer(current_user_id, client_id);
    return Promise.resolve("You have accepted the client");  // TODO: Return name of client
}

// Function to check if one user is the coach of another
/**
 * @param {number} user_id1 - ID of the first user.
 * @param {number} user_id2 - ID of the second user.
 * @returns {Promise<boolean>} - Resolves with true if user 1 is the coach of user 2; otherwise, resolves with false.
 */
async function _check_if_coach_of(user_id1, user_id2) {
    const role1 = await data_layer.get_role_data_layer(user_id1);
    if (role1 !== 'coach') {
        return false;
    }

    const user1_clients = await data_layer.get_clients_of_coach(user_id1) || [];
    return user1_clients.includes(user_id2);
}

// Function to insert a message between a client and a coach
/**
 * @param {number} current_user_id - ID of the user sending the message.
 * @param {number} recipient_id - ID of the user receiving the message.
 * @param {string} content - Content of the message.
 * @returns {Promise<string>} - Resolves with a success message if the message is sent successfully.
 * @throws {Promise<string>} - Rejects with an error message if message insertion fails.
 */
async function insert_message_business_layer(current_user_id, recipient_id, content) {
    if (!Number.isInteger(current_user_id)) {
        return Promise.reject(new Error("Invalid user id"));
    }
    if (!Number.isInteger(recipient_id)) {
        return Promise.reject(new Error("Invalid recipient id"));
    }
    if (!content) {
        return Promise.reject(new Error("Cannot send empty message"));
    }

    if (!(await _check_if_coach_of(current_user_id, recipient_id) || await _check_if_coach_of(other_user_id, recipient_id))) {
        return Promise.reject(new Error("Current user cannot message another user that's neither their coach nor client"));
    }
    return data_layer.insert_message_data_layer(current_user_id, recipient_id, content);
}
// TODO rename other_user_id to a more descriptive name

// Function to retrieve client-coach messages
/**
 * @param {number} current_user_id - ID of the user making the request.
 * @param {number} other_user_id - ID of the other user in the conversation.
 * @param {number} page_size - Number of messages per page.
 * @param {number} page_num - Page number.
 * @returns {Promise<Object>} - Resolves with an object containing page information and messages.
 * @throws {Promise<string>} - Rejects with an error message if message retrieval fails.
 */
async function get_client_coach_messages_business_layer(current_user_id, other_user_id, page_size, page_num) {
    if (!Number.isInteger(current_user_id)) {
        return Promise.reject(new Error("Invalid user id"));
    }
    if (!Number.isInteger(other_user_id)) {
        return Promise.reject(new Error("Invalid other user id"));
    }
    if (!Number.isInteger(page_size) || page_size <= 0) {
        return Promise.reject(new Error("Invalid page size"));
    }
    if (!Number.isInteger(page_num) || page_num <= 0) {
        return Promise.reject(new Error("Invalid page number"));
    }

    if (!(await _check_if_coach_of(current_user_id, other_user_id) || await _check_if_coach_of(other_user_id, current_user_id))) {
        return Promise.reject(new Error("Current user cannot view messages from another user that's neither their coach nor client"));
    }

    const message_count = await data_layer.count_client_coach_messages(current_user_id, other_user_id);
    const page_count = Math.ceil(message_count / page_size);
    page_num = Math.min(page_num, page_count);
    
    const messages = await data_layer.get_client_coach_message_page_data_layer(current_user_id, other_user_id, page_size, page_num);
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

// Function to get the user's role
/**
 * @param {number} user_id - ID of the user.
 * @returns {Promise<string>} - Resolves with the user's role.
 * @throws {Promise<string>} - Rejects with an error message if role retrieval fails.
 */
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
        data_layer.get_role_data_layer(user_id).then((response) =>{ //Check that the user exists
            data_layer.set_user_address_data_layer(user_id, address, city, state, zip_code).then(response =>{
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
  
        data_layer.alter_account_info_data_layer(user_id, first_name, last_name, username, email, hashed_password, salt, phone_number).then(response =>{
            console.log("Hooloo");
            if(address && city && state && zip_code)
            {
                console.log("Hello");
                data_layer.set_user_address_data_layer(user_id, address, city, state, zip_code).then(response =>{
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

// Function to get user account information
/**
 * @param {number} user_id - ID of the user.
 * @returns {Promise<Object>} - Resolves with user account information.
 * @throws {Promise<string>} - Rejects with an error message if retrieval fails.
 */
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

async function insert_daily_survey_business_layer({user_id,calories_consumed,weight,calories_burned,created,modified,date,water_intake,mood,}) {
  
    return new Promise((resolve, reject) => {
        data_layer.insert_daily_survey_data_layer(user_id,calories_consumed,weight,calories_burned,created,modified,date,water_intake,mood)
        .then((data_layer_response) => {
          resolve(data_layer_response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }


function _get_filter_options_constants() {
    return {
        min_experience_level: 0,
        max_experience_level: 1000,
        min_hourly_rate: 0,
        max_hourly_rate: 1_000_000
    };
}

/**
 * 
 * @param {Array<number>} nums 
 * @returns {boolean}
 */
function _assert_is_sorted(nums) {
    for (let i = 0; i < nums.length - 1; i++) {
        if (nums[i] > nums[i + 1]) {
            return false;
        }
    }

    return true;
}

// TODO: Finish validation of filter options
function _validate_ranges_of_filter_options(normalized_filter_options) {
    const {experience_level, hourly_rate} = normalized_filter_options;
    const errors = [];
    const {min_experience_level, max_experience_level, min_hourly_rate, max_hourly_rate} = _get_filter_options_constants();
    if (!_assert_is_sorted([min_experience_level, experience_level.min, experience_level.max, max_experience_level])) {
        errors.push(`Invalid range for experience level. Should fit ${min_experience_level} <= min exp level <= max exp level <= ${max_experience_level}`);
    }
    if (!_assert_is_sorted([min_hourly_rate, hourly_rate.min, hourly_rate.max, max_hourly_rate])) {
        errors.push(`Invalid range for hourly rate. Should fit ${min_hourly_rate} <= min hourly rate <= max hourly rate <= ${max_hourly_rate}`);
    }

    return errors;
}


function _check_types_of_filter_options(normalized_filter_options) {
    const errors = [];
    if (typeof normalized_filter_options.name !== 'string') {
        errors.push(`Name filter must be of type 'string' not ${typeof normalized_filter_options.name}`);
    }
    if (typeof normalized_filter_options.location.city !== 'string') {
        errors.push(`City filter must be of type 'string' not ${typeof normalized_filter_options.location.city}`);
    }
    if (typeof normalized_filter_options.location.state !== 'string') {
        errors.push(`State filter must be of type 'string' not ${typeof normalized_filter_options.location.state}`);
    }
    if (!Number.isInteger(normalized_filter_options.experience_level.min)) {
        errors.push(`Min experience level must be an integer`);
    }
    if (!Number.isInteger(normalized_filter_options.experience_level.max)) {
        errors.push(`Max experience level must be an integer`);
    }
    if (!Number.isInteger(normalized_filter_options.hourly_rate.min)) {
        errors.push(`Min hourly rate must be an integer`);
    }
    if (!Number.isInteger(normalized_filter_options.hourly_rate.max)) {
        errors.push(`Max hourly rate must be an integer`);
    }

    return errors;
}


function _normalize_filter_options(filter_options) {
    const constants = _get_filter_options_constants();
    const normalized = {};

    normalized.name = filter_options.name ?? "";
    normalized.hourly_rate = {
        min: filter_options?.hourly_rate?.min ?? constants.min_hourly_rate,
        max: filter_options?.hourly_rate?.max ?? constants.max_hourly_rate
    };
    normalized.experience_level = {
        min: filter_options?.experience_level?.min ?? constants.min_experience_level,
        max: filter_options?.experience_level?.max ?? constants.max_experience_level
    };
    normalized.location = {
        city: filter_options?.location?.city ?? "",
        state: filter_options?.location?.state ?? ""
    };

    return normalized;
}






// Function to search for coaches based on various criteria
/**
 * 
 * @param {Object} search_options
 * @param {Object} [search_options.filter_options]
 * @param {string} [search_options.filter_options.name] 
 * @param {Object} [search_options.filter_options.hourly_rate] 
 * @param {number} [search_options.filter_options.hourly_rate.min] 
 * @param {number} [search_options.filter_options.hourly_rate.max] 
 * @param {Object} [search_options.filter_options.location] 
 * @param {string} [search_options.filter_options.location.city] 
 * @param {string} [search_options.filter_options.location.state] 
 * @param {Object} [search_options.filter_options.experience_level] 
 * @param {number} [search_options.filter_options.experience_level.min] 
 * @param {number} [search_options.filter_options.experience_level.max] 
 * 
 * @param {Object} [search_options.sort_options]
 * @param {"name"|"hourly_rate"|"experience_level"} search_options.sort_options.key 
 * @param {boolean} search_options.sort_options.is_descending 
 * 
 * @param {Object} search_options.page_info 
 * @param {number} search_options.page_info.page_size 
 * @param {number} search_options.page_info.page_num 
 * @returns {Promise<Object>} 
 */
async function search_coaches_business_layer({filter_options, sort_options, page_info}) {
    const norm_filter_options = _normalize_filter_options(filter_options);
    const type_errors = _check_types_of_filter_options(norm_filter_options);
    if (type_errors.length > 0) {
        return Promise.reject(new Error(type_errors.join(', ')));
    }
    const range_errors = _validate_ranges_of_filter_options(norm_filter_options);
    if (range_errors.length > 0) {
        return Promise.reject(new Error(range_errors.join(', ')));
    }

    const valid_sort_keys = ["name", "hourly_rate", "experience_level"];
    if (sort_options) {
        if (!valid_sort_keys.includes(sort_options.key)) {
            return Promise.reject(new Error(`'${sort_options.key}' is an invalid sort key`));
        } else if (!sort_options.is_descending) {
            return Promise.reject(new Error("sort_options property missing sort direction"));
        }
    }
    if (!page_info) {
        return Promise.reject(new Error("Search request missing `page_info` property"));
    } else if (!Number.isInteger(page_info.page_num) || !Number.isInteger(page_info.page_size) || page_info.page_size < 1 || page_info.page_num < 1) {
        return Promise.reject(new Error("Invalid page info"));
    }

    const formatted_search_options = {
        filter_options: norm_filter_options,
        sort_options: sort_options,
        page_info: page_info
    };

    const result_count = await data_layer.count_coach_search_results(formatted_search_options);
    const page_count = Math.ceil(result_count / page_info.page_size) || 1;
    page_info.page_num = Math.min(page_info.page_num, page_count);

    const coaches = await data_layer.search_coaches_data_layer(formatted_search_options);
    return {
        page_info: {
            page_num: page_info.page_num,
            page_size: page_info.page_size,
            page_count: page_count,
            has_next: page_info.page_num < page_count,
            has_prev: page_info.page_num > 1
        },
        coaches: coaches
    };
}

// Exporting the functions for use in other modules
module.exports.accept_client_business_layer = accept_client_business_layer;
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
module.exports.search_coaches_business_layer = search_coaches_business_layer;
module.exports.insert_daily_survey_business_layer = insert_daily_survey_business_layer;