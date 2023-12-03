const dataLayer = require("../data_layer/goals");

/**
 * Retrieves the goal name based on the goal_id.
 * @param {number} goalId - The goal_id to search for.
 * @returns {Promise<string>} - Resolves with the goal name.
 */
async function goal_name_by_id_business_layer(goalId) {
  return dataLayer.goal_name_by_id_data_layer(goalId);
}

/**
 * Retrieves all goals.
 * @returns {Promise<Array>} - Resolves with an array of goals.
 */
async function get_all_goals_business_layer() {
  return dataLayer.get_all_goals_data_layer();
}

module.exports.get_all_goals_business_layer = get_all_goals_business_layer;
module.exports.goal_name_by_id_business_layer = goal_name_by_id_business_layer;
