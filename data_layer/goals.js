let connection = require("./conn");
let con = connection.con;

/**
 * Retrieves the goal name based on the goal_id.
 * @param {number} goalId - The goal_id to search for.
 * @returns {Promise<string>} - Resolves with the goal name.
 */
async function goal_name_by_id_data_layer(goalId) {
    let sql = "SELECT name FROM Goals WHERE goal_id = ?";
  
    return new Promise((resolve, reject) => {
      con.query(sql, [goalId], (err, results) => {
        if (err) {
          console.error("Error executing SQL in goal_name_by_id_data_layer:", err);
          reject(new Error("Failed to retrieve goal name from the database."));
        } else {
          // Assuming the goal_id is unique and always returns one row
          resolve(results[0]?.name || "");
        }
      });
    });
  }
  
  /**
 * Retrieves all goals from the Goals table.
 * @returns {Promise<Array>} - Resolves with an array of goal records.
 */
async function get_all_goals_data_layer() {
  let sql = "SELECT * FROM Goals";

  return new Promise((resolve, reject) => {
    con.query(sql, (err, results) => {
      if (err) {
        console.error("Error executing SQL in get_all_goals_data_layer:", err);
        reject(new Error("Failed to retrieve goals from the database."));
      } else {
        resolve(results);
      }
    });
  });
}

module.exports.get_all_goals_data_layer = get_all_goals_data_layer;
module.exports.goal_name_by_id_data_layer = goal_name_by_id_data_layer;
  