let connection = require("./conn");
let con = connection.con;


//Note: The if the daily survey should not be taken more than once during the same day.
//TODO: The duplicate date error function
async function insert_daily_survey_data_layer({ calories_consumed, weight, calories_burned, created, modified, date, user_id, water_intake, mood, }) {
    const formattedCreatedDatetime = new Date(created).toISOString().slice(0, 19).replace('T', ' ');
    const formattedModifiedDatetime = new Date(modified).toISOString().slice(0, 19).replace('T', ' ');
  
    let sql = `
      INSERT INTO user_daily_survey (calories_consumed, weight, calories_burned, created, modified, date, user_id, water_intake, mood ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
  
    return new Promise((resolve, reject) => {
      con.query(
        sql,
        [calories_consumed, weight, calories_burned, formattedCreatedDatetime, formattedModifiedDatetime, date, user_id, water_intake, mood],
        (err, result) => {
          if (err) {
            console.error(err);
            reject("Failed to insert daily survey into the database.");
          } else {
            if (result.affectedRows > 0) {
              resolve("Information inserted");
            } else {
              resolve("No data found");
            }
          }
        }
      );
    });
}
module.exports.insert_daily_survey_data_layer = insert_daily_survey_data_layer;