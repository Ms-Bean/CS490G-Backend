let connection = require("./conn");
let con = connection.con;

/**
 * Retrieves all exercises from the Exercise_Bank.
 * This function queries the Exercise_Bank table and returns all rows.
 * @returns {Promise<Array>} - Resolves with an array of exercises.
 */
async function get_all_exercises_data_layer() {
  // SQL query to select all exercises
  let sql = "SELECT * FROM Exercise_Bank";

  return new Promise((resolve, reject) => {
    // Executing the SQL query
    con.query(sql, (err, results) => {
      if (err) {
        console.error("Error executing SQL in get_all_exercises_data_layer:", err);
        reject(new Error("Failed to retrieve exercises from the database."));
      } else {
        // Successfully retrieved the exercises
        resolve(results);
      }
    });
  });
}

/**
 * Modifies an exercise item in the Exercise_Bank table.
 * This function updates a specific exercise record with the provided data.
 *
 * @param {Object} exerciseData - Data for updating the exercise. 
 *                                Expected to have exercise_id and other exercise details.
 * @returns {Promise<string>} - Resolves with a success message.
 * @throws {Error} - Throws an error if the update operation fails.
 */
async function update_exercise_data_layer(exerciseData) {
  const { exercise_id, name, description, user_who_created_it, difficulty, video_link, goal_id, thumbnail } = exerciseData;

  // SQL query to update a specific exercise
  let sql = `
    UPDATE Exercise_Bank 
    SET name = ?, description = ?, user_who_created_it = ?, difficulty = ?, video_link = ?, goal_id = ?, thumbnail = ?
    WHERE exercise_id = ?
  `;

  return new Promise((resolve, reject) => {
    // Executing the SQL query with the provided exercise data
    con.query(
      sql,
      [name, description, user_who_created_it, difficulty, video_link, goal_id, thumbnail, exercise_id],
      (err, result) => {
        if (err) {
          console.error("Error executing SQL in update_exercise_data_layer:", err);
          reject(new Error("Failed to update exercise in the database."));
        } else {
          // Successfully updated the exercise
          resolve("Exercise updated successfully");
        }
      }
    );
  });
}

module.exports.get_all_exercises_data_layer = get_all_exercises_data_layer;
module.exports.update_exercise_data_layer = update_exercise_data_layer;
