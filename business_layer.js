const data_layer = require("./data_layer");
const bcrypt = require('bcrypt');

async function insert_user_business_layer(first_name, last_name, username, email, password)
{
    const usernameExistsFlag = await data_layer.checkIfUsernameExists(username); //checking checkIfUsernameExists 

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
        data_layer.insert_user_data_layer(first_name, last_name, username, email, hashed_password, salt).then((data_layer_response) =>{
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
        });
    });
}


module.exports.login_business_layer = login_business_layer;
module.exports.insert_user_business_layer = insert_user_business_layer;
module.exports.assign_role_business_layer = assign_role_business_layer;