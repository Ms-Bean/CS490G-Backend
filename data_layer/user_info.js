let connection = require("./con");
let con = connection.con;

  //function to get the role of the user i.e coach or client
  
  async function get_role(user_id) {
      return new Promise((resolve, reject) => {
        con.query('SELECT role FROM Users WHERE user_id = ?', [user_id], (error, results) => {
          if (error) {
            reject(error);
          } else {
            if (results.length > 0) {
              resolve(results[0].role);
            } else {
              reject(new Error("User not found"));  // User not found with the specified user_id
            }
          }
        });
    });
}

async function get_user_account_info_data_layer(user_id)
{
    let return_data = {
        street_address: "",
        city: "",
        state: "",
        username: "",
        email: "",
        phone_number: "",
        first_name: "",
        last_name: "",
        zip_code: ""
    };
    let get_address_city_state_zip_sql = "SELECT address, city, state, zip_code FROM Addresses WHERE user_id = ?"
    return new Promise((resolve, reject) =>{
        con.query(get_address_city_state_zip_sql, [user_id], function(err, results){
            if(err)
            {
                console.log(err);
                reject("sql failure");
            }
            if(results.length > 0) //The user may not have given an address
            {
                return_data.street_address = results[0].address;
                return_data.city = results[0].city;
                return_data.state = results[0].state;
                return_data.zip_code = results[0].zip_code;
            }
            let get_other_account_info_sql = "SELECT email, username, phone_number, first_name, last_name FROM Users WHERE user_id = ?";
            con.query(get_other_account_info_sql, [user_id], function(err, results){
                if(err)
                {
                    console.log(err);
                    reject("sql failure");
                }
                return_data.phone_number = results[0].phone_number; //There must be at least 1 entry here in order for the user to be logged in.
                return_data.email = results[0].email;
                return_data.username = results[0].username;
                return_data.first_name = results[0].first_name;
                return_data.last_name = results[0].last_name;
                resolve(return_data);
            })
        });
    })
}

module.exports.get_user_account_info_data_layer = get_user_account_info_data_layer;
module.exports.get_role = get_role