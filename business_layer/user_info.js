const login = require("../data_layer/login");
const registration = require("../data_layer/registration");
const user_info = require("../data_layer/user_info");
const coach_search = require("../data_layer/coach_search");
const daily_survey = require("../data_layer/daily_survey");
const client_coach_interaction = require("../data_layer/client_coach_interaction");
const messaging = require("../data_layer/messaging")
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
      const response = await user_info.get_role(user_id);
      return response; 
    } catch (error) {
      throw error;
    }
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
        user_info.get_role(user_id).then(getrole_response =>{
            user_info.get_user_account_info_data_layer(user_id).then(response =>{
                resolve(response);
            }).catch((err) =>{
                reject(err);
            });
        }).catch((err) =>{
            reject("User is not logged in.");
        })
    });
}
module.exports.get_role_business_layer = get_role_business_layer;
module.exports.get_user_account_info_business_layer = get_user_account_info_business_layer;
