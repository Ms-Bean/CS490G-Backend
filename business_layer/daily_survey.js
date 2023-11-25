const login = require("../data_layer/login");
const registration = require("../data_layer/registration");
const user_info = require("../data_layer/user_info");
const coach_search = require("../data_layer/coach_search");
const daily_survey = require("../data_layer/daily_survey");
const client_coach_interaction = require("../data_layer/client_coach_interaction");
const messaging = require("../data_layer/messaging")

async function insert_daily_survey_business_layer({user_id,calories_consumed,weight,calories_burned,created,modified,date,water_intake,mood,}) {
  
    return new Promise((resolve, reject) => {
        daily_survey.insert_daily_survey_data_layer(user_id,calories_consumed,weight,calories_burned,created,modified,date,water_intake,mood)
        .then((data_layer_response) => {
          resolve(data_layer_response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

module.exports.insert_daily_survey_business_layer = insert_daily_survey_business_layer;