const login = require("../data_layer/login");
const registration = require("../data_layer/registration");
const user_info = require("../data_layer/user_info");
const coach_search = require("../data_layer/coach_search");
const daily_survey = require("../data_layer/daily_survey");
const client_coach_interaction = require("../data_layer/client_coach_interaction");
const messaging = require("../data_layer/messaging")



/**
 * @param {number} user_id
 * @returns {Promise<Array>} - Resolves with an array of clients.
 */
async function get_User_Profile_By_Id_business_layer(user_id) {
    return client_coach_interaction.get_User_Profile_By_Id_Data_Layer(user_id)
}

// Function to handle client requesting a coach
/**
 * @param {number} coach_id - ID of the requested coach.
 * @param {number} client_id - ID of the requesting client.
 * @param {string} comment - Additional comment from the client.
 * @returns {Promise<Object>} - Resolves with success message if the request is successful.
 * @throws {Promise<string>} - Rejects with an error message if the request fails.
 */
async function request_coach_business_layer(coach_id, client_id)
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
        client_coach_interaction.request_coach_data_layer(coach_id, client_id).then(response =>{
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

    if (!await client_coach_interaction.check_if_client_coach_request_exists(current_user_id, client_id)) {
        return Promise.reject(new Error("Request from client to coach does not exist"));
    } else if (await client_coach_interaction.check_if_client_has_hired_coach(current_user_id, client_id)) {
        return Promise.reject(new Error("Coach cannot accept request from one of their current clients"));
    }

    await client_coach_interaction.accept_client_data_layer(current_user_id, client_id);
    return Promise.resolve("You have accepted the client");  // TODO: Return name of client
}

// Function to check if one user is the coach of another
/**
 * @param {number} user_id1 - ID of the first user.
 * @param {number} user_id2 - ID of the second user.
 * @returns {Promise<boolean>} - Resolves with true if user 1 is the coach of user 2; otherwise, resolves with false.
 */
async function _check_if_coach_of(user_id1, user_id2) {
    const role1 = await user_info.get_role(user_id1);
    if (role1 !== 'coach') {
        return false;
    }

    const user1_clients = await client_coach_interaction.get_clients_of_coach(user_id1) || [];
    return user1_clients.includes(user_id2);
}
/**
 * @param {number} user_id1 - ID of the first user.
 * @param {number} user_id2 - ID of the second user.
 * @returns {Promise<boolean>} - Resolves with true if user 1 is a client of user 2 (coach); otherwise, resolves with false.
 */
async function _check_if_client_of(user_id1, user_id2) {
    const role1 = await user_info.get_role(user_id1);

    if (role1 !== 'client') {
        return false;
    }

    const user1_coaches = await client_coach_interaction.get_coaches_of_client(user_id1) || [];

    return user1_coaches.includes(user_id2);
}

/**
 * @param {number} coach_id 
 * @returns {Promise<Array>} - Resolves with an array of clients.
 */
async function get_clients_of_coach_business_layer(coach_id) {
    return client_coach_interaction.get_clients_of_coach_data_layer(coach_id);
}
module.exports.get_User_Profile_By_Id_business_layer = get_User_Profile_By_Id_business_layer;
module.exports.request_coach_business_layer = request_coach_business_layer;
module.exports.accept_client_business_layer = accept_client_business_layer;
module.exports._check_if_coach_of = _check_if_coach_of;
module.exports._check_if_client_of = _check_if_client_of;
module.exports.get_clients_of_coach_business_layer = get_clients_of_coach_business_layer;