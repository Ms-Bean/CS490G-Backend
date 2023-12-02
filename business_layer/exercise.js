const exercise_bank = require("../data_layer/exercise");

/**
 * Retrieves all exercises.
 * @returns {Promise<Array>} - Resolves with an array of exercises.
 */
async function get_all_exercises_business_layer() {
  return exercise_bank.get_all_exercises_data_layer();
}

/**
 * Business logic for updating an exercise item.
 *
 * @param {Object} exerciseData - Data for the exercise to be updated.
 * @returns {Promise<string>} - Resolves with a success message.
 * @throws {Promise<string>} - Rejects with an error message if the update operation fails.
 */
async function update_exercise_business_layer(exerciseData) {
  return exercise_bank.update_exercise_data_layer(exerciseData);
}

async function delete_exercise_business_layer(exerciseId) {
  return exercise_bank.delete_exercise_data_layer(exerciseId);
}

async function add_exercise_business_layer(exerciseData) {
  return exercise_bank.add_exercise_data_layer(exerciseData);
}

async function get_all_equipment_business_layer() {
  return exercise_bank.get_all_equipment_data_layer();
}

async function get_all_muscle_groups_business_layer() {
  return exercise_bank.get_all_muscle_groups_data_layer();
}

module.exports.get_all_muscle_groups_business_layer = get_all_muscle_groups_business_layer;
module.exports.get_all_equipment_business_layer = get_all_equipment_business_layer;
module.exports.add_exercise_business_layer = add_exercise_business_layer;
module.exports.get_all_exercises_business_layer = get_all_exercises_business_layer;
module.exports.delete_exercise_business_layer = delete_exercise_business_layer;
module.exports.update_exercise_business_layer = update_exercise_business_layer;
