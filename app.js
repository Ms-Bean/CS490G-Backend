const express = require("express");
const cors = require("cors");
const app = express();
const session = require("express-session");
const bodyParser = require("body-parser");

const controller = require("./rest_controller");

const PORT = 3500 || process.env.PORT;
app.use(cors());

app.options("*", cors());
app.listen(PORT, () => {
  console.log("Server running on port port " + PORT.toString());
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "JMH@jaf.erq_ucd6vbt",
    resave: false,
    saveUninitialized: true,
  })
);

app.post("/insert_user", controller.insert_user_controller);
app.get("/health_check", controller.health_check);
app.post("/login", controller.login_controller);
app.post("/assign_role", controller.assign_role_controller);