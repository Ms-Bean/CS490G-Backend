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
            if(client_id === undefined || client_id == requester_id)
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
module.exports.get_client_dashboard_info = get_client_dashboard_info;