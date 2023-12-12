let connection = require("./conn");
let con = connection.con;

/**
 * Inserts daily survey data into the database.
 *
 * @param {Object} surveyData - Data of the daily survey.
 * @returns {Promise<string>} - Resolves with a success message.
 * @throws {Error} - Throws an error if insertion fails.
 */
async function insert_daily_survey_data_layer({
  calories_consumed,
  weight,
  calories_burned,
  created,
  modified,
  date,
  user_id,
  water_intake,
  mood,
}) {
  const formattedCreatedDatetime = new Date(created)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  const formattedModifiedDatetime = new Date(modified)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  let sql = `
      INSERT INTO User_Daily_Survey (calories_consumed, weight, calories_burned, created, modified, date, user_id, water_intake, mood) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

  return new Promise((resolve, reject) => {
    con.query(
      sql,
      [
        calories_consumed,
        weight,
        calories_burned,
        formattedCreatedDatetime,
        formattedModifiedDatetime,
        date,
        user_id,
        water_intake,
        mood,
      ],
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            reject(new Error("Duplicate entry found for the given date."));
          } else {
            console.error(err);
            reject(
              new Error("Failed to insert daily survey into the database.")
            );
          }
        } else {
          if (result.affectedRows > 0) {
            resolve("Information inserted");
          } else {
            reject(new Error("No data found to insert."));
          }
        }
      }
    );
  });
}

module.exports.insert_daily_survey_data_layer = insert_daily_survey_data_layer;
