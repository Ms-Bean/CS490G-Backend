const { request } = require("express");
const business_layer = require("./business_layer");
async function health_check(req, res) {
  res.status(200).send("Hello, world!");
}
async function insert_user_controller(req, res) {
  try {
    const userResponse = await business_layer.insert_user_business_layer(
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
      await business_layer.set_user_address_business_layer(
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
    business_layer
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
    business_layer
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
  business_layer
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
  business_layer
    .request_coach_business_layer(
      req.body.coach_id,
      req.session.user["user_id"],
      req.body.comment
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
    });
}

async function accept_client_controller(req, res)
{
  business_layer
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
    business_layer
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
  business_layer.insert_message_business_layer(
    req.session.user['user_id'],
    req.body.recipient_id,
    req.body.content
  ).then((success_message) => res.json({message: success_message}))
   .catch((err_message) => res.status(400).json({message: err_message}));
}

async function get_client_coach_messages_controller(req, res) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  business_layer.get_client_coach_messages_business_layer(
    req.session.user['user_id'],
    req.body.other_user_id,
    req.body.page_size,
    req.body.page_num
  ).then((message_dto) => {
    res.json(message_dto);
  })
  .catch((err_message) => res.status(400).json({message: err_message}));
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
    business_layer
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
    business_layer
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
    console.log('Request Body: ', req.body);
    coach_data = await business_layer.search_coaches_business_layer(req.body);
  } catch (e) {
    console.log(e);
    res.status(500).json({  // TODO: Handle Error codes better
      message: e.message
    });
    return;
  }

  console.log(coach_data);
  res.json(coach_data);
}

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