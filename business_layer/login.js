const login = require("../data_layer/login");
const registration = require("../data_layer/registration");
const user_info = require("../data_layer/user_info");
const coach_search = require("../data_layer/coach_search");
const daily_survey = require("../data_layer/daily_survey");
const client_coach_interaction = require("../data_layer/client_coach_interaction");
const messaging = require("../data_layer/messaging")
const bcrypt = require('bcrypt');

// Function to handle user login
/**
 * @param {string} username - User's username.
 * @param {string} password - User's password.
 * @returns {Promise<Object>} - Resolves with success message and user_id if login is successful.
 * @throws {Promise<string>} - Rejects with an error message if login fails.
 */
async function login_business_layer(username, password) {
    return new Promise((resolve, reject) => {
        login.login_data_layer(username).then((data) => {
            const { password_hash, password_salt, user_id } = data;
            const salted_password = password + password_salt;
            bcrypt.compare(salted_password, password_hash, function(err, result) {
                if(err) 
                {
                    console.log(err);
                    reject(err);
                }
                if(result) 
                {
                    resolve({
                        message: "Login successful",
                        user_id: user_id
                    });
                }
                else
                {
                    reject("Invalid credentials");
                }
            });
        }).catch((error) => {
            console.log(error);
            reject(error);
        });
    });
}
module.exports.login_business_layer = login_business_layer;