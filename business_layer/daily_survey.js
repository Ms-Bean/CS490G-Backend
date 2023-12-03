const daily_survey = require("../data_layer/daily_survey");

/**
 * Inserts daily survey data into the database.
 *
 * @param {Object} surveyData - Data of the daily survey.
 * @returns {Promise<string>} - Resolves with a success message.
 * @throws {Promise<string>} - Rejects with an error message if insertion fails.
 */
async function insert_daily_survey_business_layer(surveyData) {
  return new Promise((resolve, reject) => {
    daily_survey
      .insert_daily_survey_data_layer(surveyData)
      .then((data_layer_response) => {
        resolve(data_layer_response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

module.exports.insert_daily_survey_business_layer =
  insert_daily_survey_business_layer;
