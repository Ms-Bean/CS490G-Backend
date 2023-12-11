const daily_survey = require("../data_layer/daily_survey");

/**
 * Inserts daily survey data into the database.
 *
 * @param {Object} surveyData - Data of the daily survey.
 * @returns {Promise<string>} - Resolves with a success message.
 * @throws {Promise<string>} - Rejects with an error message if insertion fails.
 */
async function insert_daily_survey_business_layer(surveyData) {
  try {
    // Validate survey date is not in the future

    const surveyDateParts = surveyData.date.split('-');
    const surveyDate = new Date(
      surveyDateParts[0],     // Year
      surveyDateParts[1] -1 ,  // Month 
      surveyDateParts[2]      // Day
    );

    const currentDateParts = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }).split(',');
    const currentDate = new Date(currentDateParts[0]);

    console.log(surveyDate);
    console.log(currentDate);

    if (surveyDate > currentDate) {
      throw new Error('Cannot do future surveys.');
    }


    // Check for values below 0
    const nonNegativeFields = ['water_intake', 'calories_burned', 'weight', 'calories_consumed'];

    for (const field of nonNegativeFields) {
      if (typeof surveyData[field] !== 'undefined' && surveyData[field] < 0) {
        throw new Error(`Values cannot be below 0.`);
      }
    }

    const data_layer_response = await daily_survey.insert_daily_survey_data_layer(surveyData);
    return data_layer_response;
  } catch (error) {
    return Promise.reject(error);
  }
}

module.exports.insert_daily_survey_business_layer = insert_daily_survey_business_layer;
