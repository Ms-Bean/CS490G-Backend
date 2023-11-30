let connection = require("./conn");
let con = connection.con;

/**
 * Retrieves all exercises from the Exercise_Bank.
 * This function queries the Exercise_Bank table and returns all rows.
 * @returns {Promise<Array>} - Resolves with an array of exercises.
 */
async function get_all_exercises_data_layer() {
  // SQL query to select all exercises along with their corresponding goal names
  let sql = `
    SELECT Exercise_Bank.*, Goals.name AS goal_name 
    FROM Exercise_Bank
    LEFT JOIN Goals ON Exercise_Bank.goal_id = Goals.goal_id;
  `;

  return new Promise((resolve, reject) => {
    con.query(sql, (err, results) => {
      if (err) {
        console.error("Error executing SQL in get_all_exercises_data_layer:", err);
        reject(new Error("Failed to retrieve exercises from the database."));
      } else {
        // Successfully retrieved the exercises along with goal names
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

async function delete_exercise_data_layer(exerciseId) {
  let sql = "DELETE FROM Exercise_Bank WHERE exercise_id = ?";

  return new Promise((resolve, reject) => {
    con.query(sql, [exerciseId], (err, result) => {
      if (err) {
        console.error("Error executing SQL in delete_exercise_data_layer:", err);
        reject(new Error("Failed to delete exercise from the database."));
      } else {
        resolve("Exercise deleted successfully");
      }
    });
  });
}

async function add_exercise_data_layer(exerciseData) {
  let sql = `
    INSERT INTO Exercise_Bank (name, description, user_who_created_it, difficulty, video_link, goal_id, thumbnail)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const { name, description, user_who_created_it, difficulty, video_link, goal_id, thumbnail } = exerciseData;

  return new Promise((resolve, reject) => {
    con.query(
      sql, 
      [name, description, user_who_created_it, difficulty, video_link, goal_id, thumbnail], 
      (err, result) => {
        if (err) {
          console.error("Error executing SQL in add_exercise_data_layer:", err);
          reject(new Error("Failed to add new exercise to the database."));
        } else {
          resolve("New exercise added successfully");
        }
      }
    );
  });
}

module.exports.add_exercise_data_layer = add_exercise_data_layer;
module.exports.delete_exercise_data_layer = delete_exercise_data_layer;
module.exports.get_all_exercises_data_layer = get_all_exercises_data_layer;
module.exports.update_exercise_data_layer = update_exercise_data_layer;
