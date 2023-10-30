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
        req.body.password
      )
      .then((response) => {
        console.log(req.body.username);
        console.log(response.user_id)
        req.session.user = { username: req.body.username, user_id: response.user_id};
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
async function assign_role_controller(req, res) {
    console.log(req.session);
    business_layer
        .assign_role_business_layer(
            req.session.user["user_id"],
            req.body.is_coach
        )
        .then((response) => {
            res.header("Access-Control-Allow-Origin", "http://localhost:3000");
            res.status(200).send({
                message: response,
            });
        })
        .catch((error_message) => {
            console.log(error_message);
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

module.exports.logout_controller = logout_controller;
module.exports.insert_user_controller = insert_user_controller;
module.exports.health_check = health_check;
module.exports.login_controller = login_controller;
module.exports.assign_role_controller = assign_role_controller;