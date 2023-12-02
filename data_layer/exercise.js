let connection = require("./conn");
let con = connection.con;

async function get_all_exercises_data_layer() {
  let sql = "SELECT name, exercise_id FROM Exercise_Bank";

  return new Promise((resolve, reject) => {
    con.query(sql, (err, results) => {
      if (err) {
        console.error(
          "Error executing SQL in get_all_exercise_names_data_layer:",
          err
        );
        reject(new Error("Failed to retrieve exercise names from the database."));
      } else {
        resolve(results);
      }
    });
  });
}

async function get_exercise_by_id_data_layer(exerciseId) {
  let sql = `
    SELECT 
      Exercise_Bank.*,
      Goals.name AS goal_name,
      IFNULL(Equipment.equipment_items, JSON_ARRAY()) AS equipment_items,
      IFNULL(MuscleGroups.muscle_groups, JSON_ARRAY()) AS muscle_groups
    FROM 
      Exercise_Bank
    LEFT JOIN 
      Goals ON Exercise_Bank.goal_id = Goals.goal_id
    LEFT JOIN 
      (SELECT 
         exercise_id, 
         JSON_ARRAYAGG(JSON_OBJECT(equipment_item, equipment_item)) AS equipment_items
       FROM 
         (SELECT DISTINCT exercise_id, equipment_item FROM Exercise_Equipment) AS DistinctEquipment
       GROUP BY exercise_id) AS Equipment ON Exercise_Bank.exercise_id = Equipment.exercise_id
    LEFT JOIN 
      (SELECT 
         exercise_id, 
         JSON_ARRAYAGG(JSON_OBJECT(muscle_group, muscle_group)) AS muscle_groups
       FROM 
         (SELECT DISTINCT exercise_id, muscle_group FROM Exercise_Muscle_Group) AS DistinctMuscleGroup
       GROUP BY exercise_id) AS MuscleGroups ON Exercise_Bank.exercise_id = MuscleGroups.exercise_id
    WHERE 
      Exercise_Bank.exercise_id = ?
    GROUP BY 
      Exercise_Bank.exercise_id;
  `;

  return new Promise((resolve, reject) => {
    con.query(sql, [exerciseId], (err, results) => {
      console.log("results", results);
      if (err) {
        console.error(
          "Error executing SQL in get_exercise_by_id_data_layer:",
          err
        );
        reject(new Error("Failed to retrieve exercise from the database."));
      } else {
        resolve(results.length > 0 ? results[0] : null);
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
    equipment_items,
    muscle_groups,
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
          exercise_id,
        ],
        (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve();
        }
      );
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

    if (equipment_items && equipment_items.length > 0) {
      sql = `INSERT INTO Exercise_Equipment (exercise_id, equipment_item) VALUES ?`;
      const equipmentValues = equipment_items.map(item => [exercise_id, item.value]); // Extract 'value' from each item
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

    if (muscle_groups && muscle_groups.length > 0) {
      sql = `INSERT INTO Exercise_Muscle_Group (exercise_id, muscle_group) VALUES ?`;
      const muscleGroupValues = muscle_groups.map(item => [exercise_id, item.value]); // Extract 'value' from each item
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
    equipmentItems, // Array of equipment items
    muscleGroups, // Array of muscle groups
  } = exerciseData;

  try {
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

    // Insert into Exercise_Bank
    const insertedExercise = await new Promise((resolve, reject) => {
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
            return reject(err);
          }
          resolve(result.insertId);
        }
      );
    });

    // Insert into Exercise_Muscle_Group
    if (muscleGroups && muscleGroups.length > 0) {
      sql = `INSERT INTO Exercise_Muscle_Group (exercise_id, muscle_group) VALUES ?`;
      const muscleGroupValues = muscleGroups.map((item) => [insertedExercise, item]);
      await new Promise((resolve, reject) => {
        con.query(sql, [muscleGroupValues], (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
    }

    // Insert into Exercise_Equipment
    if (equipmentItems && equipmentItems.length > 0) {
      sql = `INSERT INTO Exercise_Equipment (exercise_id, equipment_item) VALUES ?`;
      const equipmentValues = equipmentItems.map((item) => [insertedExercise, item]);
      await new Promise((resolve, reject) => {
        con.query(sql, [equipmentValues], (err, result) => {
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
        resolve("New exercise added successfully");
      });
    });
  } catch (err) {
    // Rollback the transaction in case of error
    await new Promise((resolve, reject) => {
      con.rollback(() => {
        reject(err);
      });
    });
    throw err;
  }
}

async function get_all_muscle_groups_data_layer() {
  let sql = "SELECT DISTINCT muscle_group FROM Exercise_Muscle_Group";

  return new Promise((resolve, reject) => {
    con.query(sql, (err, results) => {
      if (err) {
        console.error("Error executing SQL in get_all_muscle_groups_data_layer:", err);
        reject(new Error("Failed to retrieve muscle groups from the database."));
      } else {
        const formattedResults = results.map(item => ({ [item.muscle_group]: item.muscle_group }));
        resolve(formattedResults);
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
        const formattedResults = results.map(item => ({ [item.equipment_item]: item.equipment_item }));
        resolve(formattedResults);
      }
    });
  });
}


module.exports.get_exercise_by_id_data_layer = get_exercise_by_id_data_layer;
module.exports.get_all_equipment_data_layer = get_all_equipment_data_layer;
module.exports.get_all_muscle_groups_data_layer =
  get_all_muscle_groups_data_layer;
module.exports.add_exercise_data_layer = add_exercise_data_layer;
module.exports.delete_exercise_data_layer = delete_exercise_data_layer;
module.exports.get_all_exercises_data_layer = get_all_exercises_data_layer;
module.exports.update_exercise_data_layer = update_exercise_data_layer;
