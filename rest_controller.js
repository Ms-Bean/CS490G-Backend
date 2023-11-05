const { request } = require("express");
const business_layer = require("./business_layer");
async function health_check(req, res) {
  res.status(200).send("Hello, world!");
}
async function insert_user_controller(req, res) {
  business_layer
    .insert_user_business_layer(
      req.body.first_name,
      req.body.last_name,
      req.body.username,
      req.body.email,
      req.body.password,
      req.body.role
    )
    .then((response) => {
      if(req.body.state !== undefined && req.body.city !== undefined && req.body.street_address !== undefined)
      {
        business_layer
          .set_user_address_business_layer(
            response.user_id,
            req.body.state,
            req.body.city,
            req.body.street_address
            )
            .then((response_2) =>{
              console.log(req.body.username);
              console.log(response.user_id)
              req.session.user = { username: req.body.username, user_id: response.user_id};
              console.log("Session after registration:")
              console.log(req.session);
              res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // Use of wildcard causes issues during registration?
              res.header("Access-Control-Allow-Credentials", "true"); // Allows the browser to send credentials/cookies with the request
              res.status(200).send({
                message: response.message
              });
            })
      }
      console.log(req.body.username);
      console.log(response.user_id)
      req.session.user = { username: req.body.username, user_id: response.user_id};
      console.log("Session after registration:")
      console.log(req.session);
      res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // Use of wildcard causes issues during registration?
      res.header("Access-Control-Allow-Credentials", "true"); // Allows the browser to send credentials/cookies with the request
      res.status(200).send({
        message: response.message
      });
    })
    .catch((error_message) => {
      res.header("Access-Control-Allow-Origin", "http://localhost:3000");
      res.status(400).send({
        message: error_message
      });
      console.log(error_message);
    });
}

async function login_controller(req, res) {
    business_layer
      .login_business_layer(req.body.username, req.body.password)
      .then((response) => {
        req.session.user = { username: req.body.username, user_id: response.user_id};
        console.log(req.session);
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
  console.log(req.session);
  if(req.session.user === undefined || req.session.user.user_id == undefined)
  {
    console.log(req.session);
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
  console.log(req.session);
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
    .catch((error_message) =>{
      console.log(error_message);
      res.header("Access-Control-Allow-Origin", "http://localhost:3000");
      res.status(400).send({
        message: error_message
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