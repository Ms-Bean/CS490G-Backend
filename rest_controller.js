const { request } = require("express");

const login = require("./business_layer/login");
const registration = require("./business_layer/registration");
const user_info = require("./business_layer/user_info");
const coach_search = require("./business_layer/coach_search");
const daily_survey = require("./business_layer/daily_survey");
const client_coach_interaction = require("./business_layer/client_coach_interaction");
const messaging = require("./business_layer/messaging");
const profile_management = require("./business_layer/profile_management");
const coach_dashboard = require("./business_layer/coach_dashboard");
const exercise = require("./business_layer/exercise");

async function health_check(req, res) {
  res.status(200).send("Hello, world!");
}
async function insert_user_controller(req, res) {
  try {
    const userResponse = await registration.insert_user_business_layer(
      req.body.first_name,
      req.body.last_name,
      req.body.username,
      req.body.email,
      req.body.password,
      req.body.role
    );

    // Set session information (common for both branches)
    req.session.user = { username: req.body.username, user_id: userResponse.user_id };

    // If address information is provided, set the address.
    if (req.body.state && req.body.city && req.body.street_address && req.body.zip_code) {
      await registration.set_user_address_business_layer(
        userResponse.user_id,
        req.body.street_address,
        req.body.city,
        req.body.state,
        req.body.zip_code
      );
    }

    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Credentials", "true");
    res.status(200).send({ message: userResponse.message });

  } catch (error_message) {
    console.error(error_message);
    if (!res.headersSent) {
      res.header("Access-Control-Allow-Origin", "http://localhost:3000");
      res.status(400).send({ message: error_message });
    }
  }
}

async function login_controller(req, res) {
  console.log("Hello");
    login
      .login_business_layer(req.body.username, req.body.password)
      .then((response) => {
        req.session.user = { username: req.body.username, user_id: response.user_id};
        res.header("Access-Control-Allow-Origin", "http://localhost:3000");
        res.header("Access-Control-Allow-Credentials", "true");
        res.status(200).send({
          success: true,
          message: response.message,
        });
      })
      .catch((error_message) => {
        res.header("Access-Control-Allow-Origin", "http://localhost:3000");
        res.status(400).send({
          message: error_message,
        });
      });
}
async function logout_controller(req, res) {
  req.session.destroy((err) => {
    if(err) {
      res.status(500).send({ message: "Failed to logout. Try again." });
      return;
    }
    res.clearCookie('connect.sid', { path: '/' });
    res.status(200).send({ message: "Logged out successfully" });
  });
}
async function accept_client_survey_controller(req, res) {
  if(req.session.user === undefined || req.session.user.user_id == undefined)
  {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Credentials", "true");
    res.status(400).send({
      message: "User is not logged in."
    });
  }
  else
  {
    registration
      .accept_client_survey_business_layer(
        req.session.user["user_id"],
        req.body.weight,
        req.body.height,
        req.body.experience,
        req.body.budget
      )
      .then((response) =>{
        res.header("Access-Control-Allow-Credentials", "true");
        res.header("Access-Control-Allow-Origin", "http://localhost:3000");
        res.status(200).send({
          message: response
        });
      })
      .catch((error_message) =>{
        console.log(error_message);
        res.header("Access-Control-Allow-Credentials", "true");
        res.header("Access-Control-Allow-Origin", "http://localhost:3000");
        res.status(400).send({
          message: error_message
        });
      })
    }
}

async function accept_coach_survey_controller(req, res) {
  registration
    .accept_coach_survey_business_layer(
      req.session.user["user_id"],
      req.body.cost_per_session,
      req.body.availability,
      req.body.experience
    )
    .then((response) =>{
      res.header("Access-Control-Allow-Origin", "http://localhost:3000");
      res.status(200).send({
        message: response
      });
    })
    .catch((error_message) =>{
      console.log(error_message);
      res.header("Access-Control-Allow-Origin", "http://localhost:3000");
      res.status(400).send({
        message: error_message
      });
    })
}

async function request_coach_controller(req, res)
{
  client_coach_interaction
    .request_coach_business_layer(
      req.body.coach_id,
      req.session.user["user_id"]
    )    
    .then((response) =>{
      res.header("Access-Control-Allow-Origin", "http://localhost:3000");
      res.status(200).send({
        message: response
      });
    })
    .catch((error) =>{
      console.log(error.message);
      res.header("Access-Control-Allow-Origin", "http://localhost:3000");
      res.status(400).send({
        message: error.message
      });
    });
}

async function accept_client_controller(req, res)
{
  client_coach_interaction
    .accept_client_business_layer(
      req.session.user["user_id"],
      req.body.client_id
    )
    .then((response) =>{
      res.header("Access-Control-Allow-Origin", "http://localhost:3000");
      res.status(200).send({
        message: response
      });
    })
    .catch((error) =>{
      console.log(error);
      res.header("Access-Control-Allow-Origin", "http://localhost:3000");
      res.status(400).send({
        message: error?.message ?? error
      });
    });
}

async function get_role_controller(req, res)
{
  if(req.session.user === undefined)
    res.status(400).send({message: "You are not logged in."});
  else if(req.session.user["user_id"] === undefined)
    res.status(400).send({message: "You are not logged in."});
  else
  {
    user_info
      .get_role_business_layer(
        req.session.user["user_id"]
      )
      .then((response) =>{
        res.header("Access-Control-Allow-Origin", "http://localhost:3000");
        res.status(200).send({
          message: response
        });
      }).catch((error_message) =>{
        console.log(error_message);
        res.header("Access-Control-Allow-Origin", "http://localhost:3000");
        res.status(400).send({
          message: error_message
        });
      })
    }
}

async function insert_message_controller(req, res) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  messaging.insert_message_business_layer(
    req.session.user['user_id'],
    req.body.recipient_id,
    req.body.content
  ).then((success_message) => res.json({message: success_message}))
   .catch((err) => res.status(400).json({message: err.message}));
}

async function get_client_coach_messages_controller(req, res) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  messaging.get_client_coach_messages_business_layer(
    req.session.user['user_id'],
    Number(req.query.other_user_id),
    Number(req.query.page_size),
    Number(req.query.page_num)
  ).then((message_dto) => {
    res.json(message_dto);
  })
  .catch((err) => res.status(400).json({message: err.message}));
}

async function get_user_account_info_controller(req, res)
{  
  if(req.session.user === undefined || req.session.user["user_id"] == undefined)
  {  
    res.status(400).send({
      message: "User is not logged in"
    });
  }
  else
  {
    user_info
    .get_user_account_info_business_layer(
      req.session.user["user_id"],
    )
    .then((response) =>{
      res.header("Access-Control-Allow-Origin", "http://localhost:3000");
      res.status(200).send({
        response
      });
    })
    .catch((error_message) =>{
      console.log(error_message);
      res.header("Access-Control-Allow-Origin", "http://localhost:3000");
      res.status(400).send({
        message: error_message
      });
    });
  }
}

async function alter_account_info_controller(req, res)
{
  console.log("HIII");
  if(req.session.user === undefined || req.session.user["user_id"] == undefined)
  {  
    res.status(400).send({
      message: "User is not logged in"
    });
  }
  else
  {
    registration
      .alter_account_info_business_layer(
        req.session.user["user_id"],
        req.body.first_name,
        req.body.last_name,
        req.body.username,
        req.body.email,
        req.body.password,
        req.body.phone_number,
        req.body.street_address,
        req.body.city,
        req.body.state,
        req.body.zip_code
      )
      .then((response) =>{
        res.header("Access-Control-Allow-Origin", "http://localhost:3000");
        res.status(200).send({
          message: response
        });
      })
      .catch((err) =>{
        console.log(err);
        res.header("Access-Control-Allow-Origin", "http://localhost:3000");
        res.status(400).send({
          message: err
        });
      })
  }
}

async function search_coaches_controller(req, res) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  let coach_data;
  try {
    coach_data = await coach_search.search_coaches_business_layer(req.body);
  } catch (e) {
    console.log(e);
    res.status(500).json({  // TODO: Handle Error codes better
      message: e.message
    });
    return;
  }

  res.json(coach_data);
}

async function insert_daily_survey_controller(req, res) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  
  if(req.session.user === undefined || req.session.user["user_id"] == undefined)
  {  
    res.status(400).send({
      message: "User is not logged in"
    });
  }
  else
  {
    try {
      const { calories_consumed,  weight, calories_burned, created, modified, date, user_id, water_intake, mood,} = req.body;

      const result = await daily_survey.insert_daily_survey_business_layer({
        calories_consumed,
        weight,
        calories_burned,
        created,
        modified,
        date,
        user_id,
        water_intake,
        mood,
      });

      res.json(result);
    } catch (error) {
      console.error("Error in insert_daily_survey_controller:", error.message);
      res.status(400).json({ message: error.message });
    }
  }
}

async function get_user_profile(req, res)
{
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  if(req.session.user === undefined || req.session.user["user_id"] == undefined)
  {  
    res.status(400).send({
      message: "User is not logged in"
    });
  }
  else
  {
    profile_management
      .get_profile_info(
        req.session.user["user_id"],
      )
      .then((response) =>{
        res.header("Access-Control-Allow-Origin", "http://localhost:3000");
        res.status(200).send({
          response: response
        });
      })
      .catch((err) =>{
        console.log(err);
        res.header("Access-Control-Allow-Origin", "http://localhost:3000");
        res.status(400).send({
          message: err
        });
      })
  }
}

async function set_user_profile(req, res)
{
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  if(req.session.user === undefined || req.session.user["user_id"] == undefined)
  {  
    res.status(400).send({
      message: "User is not logged in"
    });
  }
  else
  {
    console.log(req.body);
    profile_management
      .set_profile_info(
        req.session.user["user_id"],
        req.body.about_me,
        req.body.experience_level,
        req.body.height,
        req.body.weight,
        req.body.medical_conditions,
        req.body.budget,
        req.body.goals,
        req.body.target_weight,
        req.body.birthday,
        req.body.availability,
        req.body.hourly_rate,
        req.body.coaching_history,
        req.body.accepting_new_clients,
        req.body.coaching_experience_level
      )
      .then((response) =>{
        res.header("Access-Control-Allow-Origin", "http://localhost:3000");
        res.status(200).send({
          response: "Information updated"
        });
      })
      .catch((err) =>{
        console.log(err);
        res.header("Access-Control-Allow-Origin", "http://localhost:3000");
        res.status(400).send({
          message: err
        });
      })
  }
}

async function get_coach_dashboard_info(req, res)
{
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  if(req.session.user === undefined || req.session.user["user_id"] == undefined)
  {  
    res.status(400).send({
      message: "User is not logged in"
    });
  }
  else
  {
    console.log(req.body);
    coach_dashboard
      .get_coach_dashboard_info(
        req.session.user["user_id"]
      )
      .then((response) =>{
        res.header("Access-Control-Allow-Origin", "http://localhost:3000");
        res.status(200).send(response);
      })
      .catch((err) =>{
        console.log(err);
        res.header("Access-Control-Allow-Origin", "http://localhost:3000");
        res.status(400).send({
          message: err
        });
      })
  }
}
async function get_all_exercises_controller(req, res) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    const exercises = await exercise.get_all_exercises_business_layer();
    res.json(exercises);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function update_exercise_controller(req, res) {
  console.log("Received request to update an exercise", req.body);
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");

  if (!req.session.user || !req.session.user["user_id"]) {
    console.log("Access denied: User is not logged in");
    return res.status(403).send({ message: "Access denied: User is not logged in" });
  }

  try {
    const userRole = await user_info.get_role_business_layer(req.session.user["user_id"]);
    
    if (userRole !== 'admin') {
      console.log("Access denied: User is not an admin", req.session.user);
      return res.status(403).send({ message: "Access denied: User is not an admin" });
    }

    console.log("User is authorized. Updating exercise with provided data");
    const exerciseData = req.body; // Assuming exerciseData contains all necessary fields
    const message = await exercise.update_exercise_business_layer(exerciseData);
    console.log("Exercise updated successfully, sending response");
    res.status(200).json({ message });
  } catch (error) {
    console.error("Error in update_exercise_controller:", error);
    res.status(400).json({ message: error.message });
  }
}

async function delete_exercise_controller(req, res) {
  console.log("Received request to delete an exercise", req.params);
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");

  if (!req.session.user || !req.session.user["user_id"]) {
    console.log("Access denied: User is not logged in");
    return res.status(403).send({ message: "Access denied: User is not logged in" });
  }

  const exerciseId = req.params.exercise_id;
  try {
    const message = await exercise.delete_exercise_business_layer(exerciseId);
    console.log("Exercise deleted successfully, sending response");
    res.status(200).json({ message });
  } catch (error) {
    console.error("Error in delete_exercise_controller:", error);
    res.status(400).json({ message: error.message });
  }
}

async function add_exercise_controller(req, res) {
  console.log("Received request to add a new exercise", req.body);
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");

  if (!req.session.user || !req.session.user["user_id"]) {
    console.log("Access denied: User is not logged in");
    return res.status(403).send({ message: "Access denied: User is not logged in" });
  }

  try {
    const exerciseData = req.body; // Assuming exerciseData contains all necessary fields
    const message = await exercise.add_exercise_business_layer(exerciseData);
    console.log("New exercise added successfully, sending response");
    res.status(201).json({ message });
  } catch (error) {
    console.error("Error in add_exercise_controller:", error);
    res.status(400).json({ message: error.message });
  }
}

module.exports.add_exercise_controller = add_exercise_controller;
module.exports.delete_exercise_controller = delete_exercise_controller;
module.exports.get_all_exercises_controller = get_all_exercises_controller;
module.exports.update_exercise_controller = update_exercise_controller;
module.exports.insert_daily_survey_controller = insert_daily_survey_controller;
module.exports.get_user_account_info_controller = get_user_account_info_controller;
module.exports.accept_client_controller = accept_client_controller;
module.exports.logout_controller = logout_controller;
module.exports.insert_user_controller = insert_user_controller;
module.exports.health_check = health_check;
module.exports.login_controller = login_controller;
module.exports.accept_client_survey_controller = accept_client_survey_controller;
module.exports.accept_coach_survey_controller = accept_coach_survey_controller;
module.exports.request_coach_controller = request_coach_controller;
module.exports.get_role_controller = get_role_controller;
module.exports.insert_message_controller = insert_message_controller;
module.exports.get_client_coach_messages_controller = get_client_coach_messages_controller;
module.exports.alter_account_info_controller = alter_account_info_controller;
module.exports.search_coaches_controller = search_coaches_controller;
module.exports.get_user_profile = get_user_profile;
module.exports.set_user_profile = set_user_profile;
module.exports.get_coach_dashboard_info = get_coach_dashboard_info;