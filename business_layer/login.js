const login = require("../data_layer/login");
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
                    reject("Invalid username, or password.");
                }
            });
        }).catch((error) => {
            console.log(error);
            reject(error);
        });
    });
}
module.exports.login_business_layer = login_business_layer;