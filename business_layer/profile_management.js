const profile_management = require("../data_layer/profile_management");
const user_info = require("../data_layer/user_info");


async function get_profile_info(user_id)
{
    return new Promise((resolve, reject) =>{
        user_info.get_role(user_id).then((role) =>{
            if(role != "client" && role != "coach")
            {
                reject("User is not a client or coach");
            }

            return_data = {}

            profile_management.get_client_profile_info(user_id).then((response) =>{
                return_data.client_profile_info = response;

                if(role == "coach")
                {
                    profile_management.get_coach_profile_info(user_id).then((response_2) =>{
                        return_data.coach_profile_info = response_2;
                        resolve(return_data);
                    }).catch((err) => {
                        reject(err)
                    });
                }
                else
                {
                    resolve(return_data);
                }
            }).catch((err) =>{
                reject(err);
            })
        }).catch((err) =>{
            reject(err)
        })
    });
}
async function set_profile_info(user_id, pfp_link, about_me, experience_level, height, weight, medical_conditions, budget, goals, target_weight, birthday, availability, hourly_rate, coaching_history, accepting_new_clients, coaching_experience_level)
{
    return new Promise((resolve, reject) =>{
        user_info.get_role(user_id).then((role) =>{
            if(role != "client" && role != "coach")
            {
                reject("User is not a client or coach");
            }

            return_data = {}


            if(pfp_link !== undefined || experience_level !== undefined || height !== undefined || weight !== undefined || medical_conditions !== undefined || budget !== undefined || goals !== undefined || target_weight !== undefined || birthday !== undefined)
            {
                profile_management.set_client_profile_info(user_id, about_me, experience_level, height, weight, medical_conditions, budget, goals, target_weight, birthday,pfp_link).then((response) =>{
                    resolve("Information updated")
                }).catch((err) =>{
                    reject(err);
                })
            }
            else if(role == "coach" && (availability !== undefined && hourly_rate !== undefined && coaching_history !== undefined && coaching_experience_level !== undefined && accepting_new_clients !== undefined))
            {
                profile_management.set_coach_profile_info(user_id, availability, hourly_rate, coaching_history, accepting_new_clients, coaching_experience_level).then((response_2) =>{
                    resolve("Information updated");
                }).catch((err) => {
                    reject(err)
                });
            }
            else
            {
                reject("Invalid input");
            }
        }).catch((err) =>{
            reject(err)
        })
    });
}
module.exports.get_profile_info = get_profile_info;
module.exports.set_profile_info = set_profile_info;
