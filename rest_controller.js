const { request } = require("express");

const login = require("./business_layer/login");
const registration = require("./business_layer/registration");
const user_info = require("./business_layer/user_info");
const coach_search = require("./business_layer/coach_search");
const daily_survey = require("./business_layer/daily_survey");
const client_coach_interaction = require("./business_layer/client_coach_interaction");
const messaging = require("./business_layer/messaging");
const profile_management = require("./business_layer/profile_management");
const workout_management = require("./business_layer/workout_management");
const coach_dashboard = require("./business_layer/coach_dashboard");
const exercise = require("./business_layer/exercise");
const goal = require("./business_layer/goals");
const workout_progress = require("./business_layer/workout_progress")


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
    res.status(200).send({message: "visitor"});
  else if(req.session.user["user_id"] === undefined)
    res.status(200).send({message: "visitor"});
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
async function get_client_coach_list_controller(req, res) {
  try {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");

    // Check if the user is logged in
    if (req.session.user === undefined || req.session.user["user_id"] == undefined) {
      throw new Error("User is not logged in");
    }

    // Get the role of the user
    const userRole = await user_info.get_role_business_layer(req.session.user["user_id"]);

    if (userRole === 'coach') {
      // If the user is a coach, get the list of clients and coaches
      const clientsList = await messaging.get_clients_list_of_coach_business_layer(req.session.user["user_id"]);
      const coachesList = await messaging.get_coaches_list_of_client_business_layer(req.session.user["user_id"]);

      // Combine clientsList and coachesList into a single array
      const user_id_List = [
        ...clientsList.map(clientId => ({ id: clientId, role: 'client' })),
        ...coachesList.map(coachId => ({ id: coachId, role: 'coach' })),
      ];

      // Send the combined list as JSON
      res.status(200).json({ user_id_List });
    }
    else if (userRole === 'client') {
      // If the user is a client, get the list of coaches
      const coachesList = await messaging.get_coaches_list_of_client_business_layer(req.session.user["user_id"]);

      // Add role field to coachesList
      const user_id_List = coachesList.map(coachId => ({ id: coachId, role: 'coach' }));

      // Send the coachesList as JSON
      res.status(200).json({ user_id_List });
    } else {
      throw new Error("Invalid user role");
    }
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: error.message });
  }
}

async function get_users_clients(req, res)
{  
  try {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");

    // Check if the user is logged in
    if (req.session.user === undefined || req.session.user["user_id"] == undefined) {
      throw new Error("User is not logged in");
    }

    // Get the role of the user
    const userRole = await user_info.get_role_business_layer(req.session.user["user_id"]);

    if (userRole === "coach"){
      const clientList = await client_coach_interaction.get_clients_of_coach_business_layer(req.session.user["user_id"]);

      res.status(200).json({clientList});
    }
    else{
      throw new Error("Not a Coach")
    }
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

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


async function create_new_workout_plan(req, res) {
  if (!is_logged_in(req)) {
    res.status(401).json({message: "Cannot create workout plan without logging in"});
    return;
  }

  const user_id = req.session.user.user_id;
  try {
    const workout_plan = await workout_management.create_workout_plan(user_id, req.body);
    res.json({workout_plan});
  } catch (e) {
    console.log(e.message);
    if (!e.status_code) {
      res.status(500).json({message: "Oops! Something went wrong on our end"});
    } else {
      res.status(e.status_code).json({message: e.message});
    }
  }
}


async function get_workout_plans_from_author(req, res) {
  if (!is_logged_in(req)) {
    res.status(401).json({message: "Cannot read workout plan without logging in"});
    return;
  }

  const author_id = Number(req.query.author_id);
  if (Number.isNaN(author_id)) {
    res.status(400).json({message: "Invalid author id"});
    return;
  }

  const user_id = req.session.user.user_id;
  try {
    const workout_plans = await workout_management.get_workout_plans_by_owner({user_id, author_id});
    res.json({workout_plans});
  } catch (e) {
    console.log(e.message);
    if (!e.status_code) {
      res.status(500).json({message: "Oops! Something went wrong on our end"});
    } else {
      res.status(e.status_code).json({message: e.message});
    }
  }
}


async function get_workout_by_id(req, res) {
  if (!is_logged_in(req)) {
    res.status(401).json({message: "Cannot read workout plan without logging in"});
    return;
  }

  if (Number.isNaN(Number(req.params.id))) {
    res.status(400).json({message: "Invalid exercise id"});
    return;
  }
  if (req.query.include_exercises && !["true", "false"].includes(req.query.include_exercises)) {
    res.status(400).json({message: "Invalid includes exercises query"});
    return;
  }

  const user_id = req.session.user.user_id;
  const include_exercises = req.query.include_exercises === "true";
  const wp_id = Number(req.params.id);
  try {
    const workout_plan = await workout_management.get_workout_plan_by_id({user_id, wp_id, include_exercises});
    res.json({workout_plan});
  } catch (e) {
    console.log(e.message);
    if (!e.status_code) {
      res.status(500).json({message: "Oops! Something went wrong on our end"});
    } else {
      res.status(e.status_code).json({message: e.message});
    }
  }
}


async function update_workout_plan(req, res) {
  if (!is_logged_in(req)) {
    res.status(401).json({message: "Cannot update workout plan without logging in"});
    return;
  }

  if (Number.isNaN(Number(req.params.id))) {
    res.status(400).json({message: "Invalid workout plan id"});
    return;
  }

  const user_id = req.session.user.user_id;
  req.body.workout_plan_id = Number(req.params.id);
  try {
    const workout_plan = await workout_management.update_workout_plan(user_id, req.body);
    res.json({workout_plan});
  } catch (e) {
    console.log(e.message);
    if (!e.status_code) {
      res.status(500).json({message: "Oops! Something went wrong on our end"});
    } else {
      res.status(e.status_code).json({message: e.message});
    }
  }
}


async function delete_workout_plan(req, res) {
  if (!is_logged_in(req)) {
    res.status(401).json({message: "Cannot update workout plan without logging in"});
    return;
  }

  if (Number.isNaN(Number(req.params.id))) {
    res.status(400).json({message: "Invalid workout plan id"});
    return;
  }

  const user_id = req.session.user.user_id;
  req.body.workout_plan_id = Number(req.params.id);
  try {
    await workout_management.delete_workout_plan(user_id, req.body);
    res.json({message: "Workout plan successfully deleted"});
  } catch (e) {
    console.log(e.message);
    if (!e.status_code) {
      res.status(500).json({message: "Oops! Something went wrong on our end"});
    } else {
      res.status(e.status_code).json({message: e.message});
    }
  }
}


async function create_workout_plan_exercise(req, res) {
  if (!is_logged_in(req)) {
    res.status(401).json({message: "Cannot update workout plan without logging in"});
    return;
  }

  if (Number.isNaN(Number(req.params.wp_id))) {
    res.status(400).json({message: "Invalid workout plan id"});
    return;
  }

  const user_id = req.session.user.user_id;
  req.body.workout_plan_id = Number(req.params.wp_id);
  try {
    const workout_plan_exercise = await workout_management.create_workout_plan_exercise(user_id, req.body);
    res.json({workout_plan_exercise});
  } catch (e) {
    console.log(e.message);
    if (!e.status_code) {
      res.status(500).json({message: "Oops! Something went wrong on our end"});
    } else {
      res.status(e.status_code).json({message: e.message});
    }
  }
}


async function update_workout_plan_exercise(req, res) {
  if (!is_logged_in(req)) {
    res.status(401).json({message: "Cannot update workout plan without logging in"});
    return;
  }

  if (Number.isNaN(Number(req.params.wp_id))) {
    res.status(400).json({message: "Invalid workout plan id"});
    return;
  } else if (Number.isNaN(Number(req.params.wpe_id))) {
    res.status(400).json({message: "Invalid workout plan exercise id"});
    return;
  }

  const user_id = req.session.user.user_id;
  req.body.workout_plan_id = Number(req.params.wp_id);
  req.body.workout_plan_exercise_id = Number(req.params.wpe_id);
  try {
    const workout_plan_exercise = await workout_management.update_workout_plan_exercise(user_id, req.body);
    res.json({workout_plan_exercise});
  } catch (e) {
    console.log(e.message);
    if (!e.status_code) {
      res.status(500).json({message: "Oops! Something went wrong on our end"});
    } else {
      res.status(e.status_code).json({message: e.message});
    }
  }
}


async function get_workout_plan_exercise_by_id(req, res) {
  if (!is_logged_in(req)) {
    res.status(401).json({message: "Cannot update workout plan without logging in"});
    return;
  }

  if (Number.isNaN(Number(req.params.wp_id))) {
    res.status(400).json({message: "Invalid workout plan id"});
    return;
  } else if (Number.isNaN(Number(req.params.wpe_id))) {
    res.status(400).json({message: "Invalid workout plan exercise id"});
    return;
  }

  const user_id = req.session.user.user_id;
  const workout_plan_id = Number(req.params.wp_id);
  const workout_plan_exercise_id = Number(req.params.wpe_id);
  try {
    const workout_plan_exercise = await workout_management.get_workout_plan_exercise_by_id(user_id, workout_plan_id, workout_plan_exercise_id);
    res.json({workout_plan_exercise});
  } catch (e) {
    console.log(e.message);
    if (!e.status_code) {
      res.status(500).json({message: "Oops! Something went wrong on our end"});
    } else {
      res.status(e.status_code).json({message: e.message});
    }
  }
}


async function delete_workout_plan_exercise(req, res) {
  if (!is_logged_in(req)) {
    res.status(401).json({message: "Cannot update workout plan without logging in"});
    return;
  }

  if (Number.isNaN(Number(req.params.wp_id))) {
    res.status(400).json({message: "Invalid workout plan id"});
    return;
  } else if (Number.isNaN(Number(req.params.wpe_id))) {
    res.status(400).json({message: "Invalid workout plan exercise id"});
    return;
  }

  const user_id = req.session.user.user_id;
  req.body.workout_plan_id = Number(req.params.wp_id);
  req.body.workout_plan_exercise_id = Number(req.params.wpe_id);
  try {
    await workout_management.delete_workout_plan_exercise(user_id, req.body);
    res.json({message: "Workout plan exercise successfully deleted"});
  } catch (e) {
    console.log(e.message);
    if (!e.status_code) {
      res.status(500).json({message: "Oops! Something went wrong on our end"});
    } else {
      res.status(e.status_code).json({message: e.message});
    }
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

async function get_client_dashboard_info(req, res)
{
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  if(req.session.user["user_id"] == undefined)
  {  
    res.status(400).send({
      message: "User is not logged in"
    });
  }
  else
  {
    if(req.headers.client_id !== undefined)
    {
      client_dashboard
        .get_client_dashboard_info(
          req.session.user["user_id"],
          req.headers.client_id
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
    else
    {      
      client_dashboard
        .get_client_dashboard_info(
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
}

// TODO: Use proper middleware to check if users are logged in for all routes that require it
function is_logged_in(req) {
  return req.session?.user?.user_id !== undefined;
}
module.exports.get_client_coach_list_controller = get_client_coach_list_controller;
// Get all exercises
async function get_all_exercises_controller(req, res) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  // if (!req.session.user || !req.session.user["user_id"]) {
  //   console.log("Access denied: User is not logged in");
  //   return res.status(403).send({ message: "Access denied: User is not logged in" });
  // }

  try {
    const exercises = await exercise.get_all_exercises_business_layer();
    res.json(exercises);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Update exercise (admin only)
async function update_exercise_controller(req, res) {
  console.log("Received request to update an exercise", req.body);
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");

  if (!req.session.user || !req.session.user["user_id"]) {
    console.log("Access denied: User is not logged in");
    return res.status(403).send({ message: "Access denied: User is not logged in" });
  }
  userRole = await user_info.get_role_business_layer(req.session.user["user_id"]);
  if (userRole !== 'admin') {
    console.log("Access denied: User is not an admin", req.session.user);
    return res.status(403).send({ message: "Access denied: User is not an admin" });
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

// Delete exercise (admin only)
async function delete_exercise_controller(req, res) {
  console.log("Received request to delete an exercise", req.params);
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");

  if (!req.session.user || !req.session.user["user_id"]) {
    console.log("Access denied: User is not logged in");
    return res.status(403).send({ message: "Access denied: User is not logged in" });
  }
  
  userRole = await user_info.get_role_business_layer(req.session.user["user_id"]);
  if (userRole !== 'admin') {
    console.log("Access denied: User is not an admin", req.session.user);
    return res.status(403).send({ message: "Access denied: User is not an admin" });
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

// Add exercise (admin only)
async function add_exercise_controller(req, res) {
  console.log("Received request to add a new exercise", req.body);
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");

  if (!req.session.user || !req.session.user["user_id"]) {
    console.log("Access denied: User is not logged in");
    return res.status(403).send({ message: "Access denied: User is not logged in" });
  }

  userRole = await user_info.get_role_business_layer(req.session.user["user_id"]);
  if (userRole !== 'admin') {
    console.log("Access denied: User is not an admin", req.session.user);
    return res.status(403).send({ message: "Access denied: User is not an admin" });
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

async function goal_name_by_id_controller(req, res) {
  const goalId = req.params.goal_id;

  try {
    const goalName = await exercise.goal_name_by_id_business_layer(goalId);
    res.json({ goalName });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function get_all_goals_controller(req, res) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    const goals = await goal.get_all_goals_business_layer();
    res.json(goals);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function get_all_muscle_groups_controller(req, res) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    const muscleGroups = await exercise.get_all_muscle_groups_business_layer();
    res.json(muscleGroups);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function get_all_equipment_controller(req, res) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    const equipmentItems = await exercise.get_all_equipment_business_layer();
    res.json(equipmentItems);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function get_exercise_by_id_controller(req, res) {
  console.log("Received request to get exercise by ID", req.params);
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");

  const exerciseId = req.params.exercise_id;

  if (!exerciseId) {
    console.log("Invalid request: Missing exercise ID");
    return res.status(400).send({ message: "Invalid request: Missing exercise ID" });
  }

  try {
    const exerciseDetails = await exercise.get_exercise_by_id_business_layer(exerciseId);
    if (!exerciseDetails) {
      console.log(`Exercise with ID ${exerciseId} not found`);
      return res.status(404).send({ message: "Exercise not found" });
    }
    console.log("Exercise details fetched successfully, sending response");
    res.status(200).json(exerciseDetails);
  } catch (error) {
    console.error("Error in get_exercise_by_id_controller:", error);
    res.status(400).json({ message: error.message });
  }
}

async function check_exercise_references_controller(req, res) {
  console.log("Received request to check exercise references", req.params);
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");

  const exerciseId = req.params.exercise_id;

  if (!exerciseId) {
    console.log("Invalid request: Missing exercise ID");
    return res.status(400).send({ message: "Invalid request: Missing exercise ID" });
  }

  try {
    const references = await exercise.check_exercise_references_business_layer(exerciseId);
    console.log("Exercise references checked successfully, sending response");
    res.status(200).json(references);
  } catch (error) {
    console.error("Error in check_exercise_references_controller:", error);
    res.status(400).json({ message: error.message });
  }
}

async function create_new_workout_progress(req, res) {
  if (!is_logged_in(req)) {
    res.status(401).json({message: "Cannot create workout progress without logging in"});
    return;
  }
  console.log(req.body);

  const user_id = req.session.user.user_id;
  try {
    const wp = await workout_progress.create_workout_progress(user_id, req.body);
    res.json({wp});
  } catch (e) {
    console.log("here", e.message);
    if (!e.status_code) {
      res.status(500).json({message: "Oops! Something went wrong on our end"});
    } else {
      res.status(e.status_code).json({message: e.message});
    }
  }
}

async function get_all_coach_request(req, res){
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  if (!is_logged_in(req)) {
    res.status(401).json({message: "Cannot get coach requests without logging in"});
    return;
  }

  const user_id = req.session.user.user_id;

  try {
    const coachList = await coach_dashboard.get_all_coach_request(user_id);
    res.json({coachList});
  } catch (e) {
    console.log(e.message);
    if (!e.status_code) {
      res.status(500).json({message: "Oops! Something went wrong on our end"});
    } else {
      res.status(e.status_code).json({message: e.message});
    }
  }
}

async function accept_coach(req, res){
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  if (!is_logged_in(req)) {
    res.status(401).json({message: "Cannot get coach requests without logging in"});
    return;
  }

  console.log(req.params);

  const user_id = req.session.user.user_id;
  const coach_id = req.params.coach_id;

  console.log(coach_id)

  try {
    const result = await coach_dashboard.accept_coach(user_id, coach_id)
    res.json({result});
  } catch (e) {
    console.log(e.message);
    if (!e.status_code) {
      res.status(500).json({message: "Oops! Something went wrong on our end"});
    } else {
      res.status(e.status_code).json({message: e.message});
    }
  }
}

async function reject_coach(req, res){
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  if (!is_logged_in(req)) {
    res.status(401).json({message: "Cannot get coach requests without logging in"});
    return;
  }

  const user_id = req.session.user.user_id;
  const coach_id = req.params.coach_id;

  try {
    const result = await coach_dashboard.reject_coach(user_id, coach_id)
    res.json({result});
  } catch (e) {
    console.log(e.message);
    if (!e.status_code) {
      res.status(500).json({message: "Oops! Something went wrong on our end"});
    } else {
      res.status(e.status_code).json({message: e.message});
    }
  }
}

module.exports.check_exercise_references_controller = check_exercise_references_controller;
module.exports.get_exercise_by_id_controller = get_exercise_by_id_controller;
module.exports.get_all_equipment_controller = get_all_equipment_controller;
module.exports.get_all_muscle_groups_controller = get_all_muscle_groups_controller;
module.exports.get_all_goals_controller = get_all_goals_controller;
module.exports.goal_name_by_id_controller = goal_name_by_id_controller;
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
module.exports.create_new_workout_plan = create_new_workout_plan;
module.exports.get_workout_plans_from_author = get_workout_plans_from_author;
module.exports.get_workout_by_id = get_workout_by_id;
module.exports.update_workout_plan = update_workout_plan;
module.exports.delete_workout_plan = delete_workout_plan;
module.exports.create_workout_plan_exercise = create_workout_plan_exercise;
module.exports.update_workout_plan_exercise = update_workout_plan_exercise;
module.exports.get_workout_plan_exercise_by_id = get_workout_plan_exercise_by_id;
module.exports.delete_workout_plan_exercise = delete_workout_plan_exercise;
module.exports.create_new_workout_progress = create_new_workout_progress;
module.exports.get_users_clients = get_users_clients;
module.exports.get_client_dashboard_info = get_client_dashboard_info;
module.exports.get_all_coach_request = get_all_coach_request;
module.exports.accept_coach = accept_coach;
module.exports.reject_coach = reject_coach;