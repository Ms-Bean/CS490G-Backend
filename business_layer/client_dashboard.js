let client_dashboard = require("../data_layer/client_dashboard");
let user_info = require("../business_layer/user_info");


async function get_client_dashboard_info(requester_id, client_id)
{
    return new Promise((resolve, reject) =>{

        if(!/^[0-9]+$/.test(requester_id))
        {
            reject("Invalid requester id")
        }
        user_info.get_role_business_layer(requester_id).then((response) =>{
            if(client_id === "undefined" || client_id == "null" || client_id == requester_id || client_id === undefined)
            {
                client_dashboard.get_client_dashboard_info(requester_id).then((requester_response) =>{
                    resolve(requester_response);
                }).catch((err) =>{
                    console.log(err);
                    reject(err);
                })
            }
            else
            {
                console.log(client_id)
                if(!/^[0-9]+$/.test(client_id))
                {
                    reject("Invalid client id")
                }
                client_dashboard.check_is_coach(client_id, requester_id).then((response) =>{
                    client_dashboard.get_client_dashboard_info(client_id).then((client_response) =>{
                        resolve(client_response);
                    }).catch((err) =>{
                        console.log(err);
                        reject(err);
                    })
                }).catch((err) =>{
                    reject("Requester does not have permission to view client's dashboard");
                })
            }
        }).catch((err) =>{
            reject("Requester not a user");
        });
        
    })
}

async function get_client_target_weight_business_layer(client_id) {
    return client_dashboard.get_client_target_weight(client_id)
      .then(targetWeight => targetWeight)
      .catch(err => {
        throw err;
      });
  }



async function check_user_workout_plan({ user_id }) {
    if (!user_id) {
        return Promise.reject(new Error("User ID is required"));
    }

    const workoutPlans = await client_dashboard.get_user_workout_plan({ user_id });
    return workoutPlans.length > 0 ? workoutPlans : null;
}

module.exports.check_user_workout_plan = check_user_workout_plan;
module.exports.get_client_dashboard_info = get_client_dashboard_info;
module.exports.get_client_target_weight_business_layer = get_client_target_weight_business_layer;
  