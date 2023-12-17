const user_info = require("../data_layer/user_info");
const client_coach_interaction = require("../data_layer/client_coach_interaction");
const messaging = require("../data_layer/messaging");
const workout_management_business_layer = require("./workout_management");


/**
 * @param {number} coach_id
 * @returns {Promise<Array>} - Resolves with an array of clients.
 */
async function get_requested_clients_of_coach_business_layer(coach_id){
    const role = await user_info.get_role(coach_id);
    if (role !== 'coach') {
        return Promise.reject(new Error("Only coach can check their client requests."));
    }
    return client_coach_interaction.get_requested_clients_of_coach_data_layer(coach_id);
}

/**
 * @param {number} user_id
 * @returns {Promise<Array>} 
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
        client_coach_interaction.get_clients_coach_or_request(client_id).then(requests_response =>{
            console.log(requests_response);
            if(requests_response.length > 0)
            {
                reject("Duplicate coach request");
            }
            else
            {
                client_coach_interaction.request_coach_data_layer(coach_id, client_id).then(response =>{
                    resolve(response);
                }).catch((error) =>{
                    reject(error);
                });
            }
        }).catch((error) =>{
            console.log(error);
            reject(error);
        })
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
    if (current_user_id == null) {
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


async function reject_client_business_layer(current_user_id, client_id) {
    const role = await user_info.get_role(current_user_id);
    if (role !== "coach") {
        const error = new Error(`User with ID ${current_user_id} unauthorized to accept and reject coach requests`);
        error.code = 403;
        throw error;
    } else if (!await client_coach_interaction.check_if_client_coach_request_exists(current_user_id, client_id)) {
        const error = new Error(`Request from client with ID ${client_id} to coach with ID ${current_user_id} does not exist`);
        error.code = 400;
        throw error;
    }

    await client_coach_interaction.delete_client_coach_row(client_id);
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
    const role2 = await user_info.get_role(user_id2);

    if (role2 !== 'coach') {
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


async function check_if_client_has_hired_coach(client_id, coach_id) {
    return client_coach_interaction.check_if_client_has_hired_coach(coach_id, client_id);
}


async function terminate_client_coach(user_id, terminatee_id) {
    let coach_id, client_id;
    if (await client_coach_interaction.check_if_client_has_hired_coach(user_id, terminatee_id)) {
        coach_id = user_id;
        client_id = terminatee_id;
    } else if (await client_coach_interaction.check_if_client_has_hired_coach(terminatee_id, user_id)) {
        coach_id = terminatee_id;
        client_id = user_id;
    } else {
        const error = new Error(`User with ID ${user_id} cannot terminate relationship with user with ID ${terminatee_id}`);
        error.code = 403;
        throw error;
    }

    try {
        await workout_management_business_layer.delete_user_workout_plan(coach_id, client_id);
    } catch (e) {
        if (e.status_code !== 403) {
            throw e;
        }
    }

    await messaging.delete_messages_between_users(user_id, terminatee_id);
    await client_coach_interaction.delete_client_coach_row(client_id);
}

async function get_coaches_of_client(client_id) {
    return new Promise((resolve, reject) =>{
        client_coach_interaction.get_coaches_of_client_data_layer(client_id).then((response) =>{
            resolve(response);
        }).catch((err) =>{
            reject(err);
        })
    });
}
module.exports.get_requested_clients_of_coach_business_layer = get_requested_clients_of_coach_business_layer
module.exports.get_User_Profile_By_Id_business_layer = get_User_Profile_By_Id_business_layer;
module.exports.request_coach_business_layer = request_coach_business_layer;
module.exports.accept_client_business_layer = accept_client_business_layer;
module.exports.check_if_client_has_hired_coach = check_if_client_has_hired_coach;
module.exports._check_if_coach_of = _check_if_coach_of;
module.exports._check_if_client_of = _check_if_client_of;
module.exports.get_clients_of_coach_business_layer = get_clients_of_coach_business_layer;
module.exports.terminate_client_coach = terminate_client_coach;
module.exports.reject_client_business_layer = reject_client_business_layer;
module.exports.get_coaches_of_client = get_coaches_of_client;