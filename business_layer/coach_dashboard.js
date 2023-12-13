let coach_dashboard = require("../data_layer/coach_dashboard");
let user_info = require("../business_layer/user_info");

async function get_coach_dashboard_info(coach_id)
{
    return new Promise((resolve, reject) => {
        user_info.get_role_business_layer(coach_id).then((response) =>{
            if(response != "coach")
            {
                reject("User is not a coach.");
            }
            coach_dashboard.get_coach_dashboard_info(coach_id).then((response) =>{
                resolve(response);
            }).catch((err) =>{
                reject(err);
            });
        }).catch((err) =>{
            reject(err);
        });
    });
}

async function accept_reject_clients_business_layer(coach_id, client_id, accept_reject_response) {
    try {
        const coachRole = await user_info.get_role_business_layer(coach_id);

        if (coachRole !== "coach") {
            throw new Error("User is not a coach.");
        }

        const response = await coach_dashboard.accept_reject_clients_data_layer(coach_id, client_id, accept_reject_response);

        return response;
    } catch (error) {
        throw error;
    }
}

async function get_all_coach_request(user_id) {
    try{

        const type = await user_info.get_role_business_layer(user_id);
        if(type !== "admin"){
            throw new APIError(`Only admin can view coach requests`, 403);
        }

        const coachList = coach_dashboard.getAllCoachRequest();
        return coachList;
    } catch (error){
        throw error;
    }
}

async function accept_coach(user_id, coach_id) {
    try{
        const type = await user_info.get_role_business_layer(user_id);
        if(type !== "admin"){
            throw new APIError(`Only admin can view coach requests`, 403);
        }

        result = await coach_dashboard.accept_coach(coach_id);
        return result;
    } catch(error){
        throw error;
    }
}

async function reject_coach(user_id, coach_id) {
    try{
        const type = await user_info.get_role_business_layer(user_id);
        if(type !== "admin"){
            throw new APIError(`Only admin can view coach requests`, 403);
        }

        result = await coach_dashboard.reject_coach(coach_id);
        return result;
    } catch(error){
        throw error;
    }
}

module.exports.accept_reject_clients_business_layer = accept_reject_clients_business_layer;
module.exports.get_coach_dashboard_info = get_coach_dashboard_info;
module.exports.get_all_coach_request = get_all_coach_request;
module.exports.accept_coach = accept_coach;
module.exports.reject_coach = reject_coach;