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
    SELECT 
      Exercise_Bank.*,
      Goals.name AS goal_name,
      GROUP_CONCAT(DISTINCT Exercise_Equipment.equipment_item) AS equipment_items,
      GROUP_CONCAT(DISTINCT Exercise_Muscle_Group.muscle_group) AS muscle_groups
    FROM 
      Exercise_Bank
    LEFT JOIN 
      Goals ON Exercise_Bank.goal_id = Goals.goal_id
    LEFT JOIN 
      Exercise_Equipment ON Exercise_Bank.exercise_id = Exercise_Equipment.exercise_id
    LEFT JOIN 
      Exercise_Muscle_Group ON Exercise_Bank.exercise_id = Exercise_Muscle_Group.exercise_id
    GROUP BY 
      Exercise_Bank.exercise_id;

  `;

  return new Promise((resolve, reject) => {
    con.query(sql, (err, results) => {
      if (err) {
        console.error(
          "Error executing SQL in get_all_exercises_data_layer:",
          err
        );
        reject(new Error("Failed to retrieve exercises from the database."));
      } else {
        resolve(results);
      }
    });
  });
}

async function update_exercise_data_layer(exerciseData) {
  const {
    exercise_id,
    name,
    description,
    user_who_created_it,
    difficulty,
    video_link,
    goal_id,
    thumbnail,
    equipmentItems, // Array of equipment items
    muscleGroups,   // Array of muscle groups
  } = exerciseData;

  // Start a transaction
  await new Promise((resolve, reject) => {
    con.beginTransaction((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });

  try {
    // Update Exercise_Bank table
    let sql = `
      UPDATE Exercise_Bank 
      SET name = ?, description = ?, user_who_created_it = ?, difficulty = ?, video_link = ?, goal_id = ?, thumbnail = ?
      WHERE exercise_id = ?
    `;
    await new Promise((resolve, reject) => {
      con.query(sql, [name, description, user_who_created_it, difficulty, video_link, goal_id, thumbnail, exercise_id], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });

    // Update Exercise_Equipment table
    sql = `DELETE FROM Exercise_Equipment WHERE exercise_id = ?`;
    await new Promise((resolve, reject) => {
      con.query(sql, [exercise_id], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });

    if (equipmentItems && equipmentItems.length > 0) {
      sql = `INSERT INTO Exercise_Equipment (exercise_id, equipment_item) VALUES ?`;
      const equipmentValues = equipmentItems.map(item => [exercise_id, item]);
      await new Promise((resolve, reject) => {
        con.query(sql, [equipmentValues], (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
    }

    // Update Exercise_Muscle_Group table
    sql = `DELETE FROM Exercise_Muscle_Group WHERE exercise_id = ?`;
    await new Promise((resolve, reject) => {
      con.query(sql, [exercise_id], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });

    if (muscleGroups && muscleGroups.length > 0) {
      sql = `INSERT INTO Exercise_Muscle_Group (exercise_id, muscle_group) VALUES ?`;
      const muscleGroupValues = muscleGroups.map(item => [exercise_id, item]);
      await new Promise((resolve, reject) => {
        con.query(sql, [muscleGroupValues], (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
    }

    // Commit the transaction
    await new Promise((resolve, reject) => {
      con.commit((err) => {
        if (err) {
          return reject(err);
        }
        resolve("Exercise updated successfully");
      });
    });
  } catch (err) {
    // Rollback the transaction in case of error
    await new Promise((resolve, reject) => {
      con.rollback(() => {
        reject(err);
      });
    });
  }
}

async function delete_exercise_data_layer(exerciseId) {
  let sql = "DELETE FROM Exercise_Bank WHERE exercise_id = ?";

  return new Promise((resolve, reject) => {
    con.query(sql, [exerciseId], (err, result) => {
      if (err) {
        console.error(
          "Error executing SQL in delete_exercise_data_layer:",
          err
        );
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

  const {
    name,
    description,
    user_who_created_it,
    difficulty,
    video_link,
    goal_id,
    thumbnail,
  } = exerciseData;

  return new Promise((resolve, reject) => {
    con.query(
      sql,
      [
        name,
        description,
        user_who_created_it,
        difficulty,
        video_link,
        goal_id,
        thumbnail,
      ],
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

async function get_all_muscle_groups_data_layer() {
  let sql = "SELECT DISTINCT muscle_group FROM Exercise_Muscle_Group";

  return new Promise((resolve, reject) => {
    con.query(sql, (err, results) => {
      if (err) {
        console.error("Error executing SQL in get_all_muscle_groups_data_layer:", err);
        reject(new Error("Failed to retrieve muscle groups from the database."));
      } else {
        resolve(results);
      }
    });
  });
}

async function get_all_equipment_data_layer() {
  let sql = "SELECT DISTINCT equipment_item FROM Exercise_Equipment";

  return new Promise((resolve, reject) => {
    con.query(sql, (err, results) => {
      if (err) {
        console.error("Error executing SQL in get_all_equipment_data_layer:", err);
        reject(new Error("Failed to retrieve equipment from the database."));
      } else {
        resolve(results);
      }
    });
  });
}

module.exports.get_all_equipment_data_layer = get_all_equipment_data_layer;
module.exports.get_all_muscle_groups_data_layer = get_all_muscle_groups_data_layer;
module.exports.add_exercise_data_layer = add_exercise_data_layer;
module.exports.delete_exercise_data_layer = delete_exercise_data_layer;
module.exports.get_all_exercises_data_layer = get_all_exercises_data_layer;
module.exports.update_exercise_data_layer = update_exercise_data_layer;
