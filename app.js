const express = require("express");
const cors = require("cors");
const app = express();
const session = require("express-session");
const bodyParser = require("body-parser");

const controller = require("./rest_controller");

const PORT = 3500 || process.env.PORT;

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(bodyParser.json());

app.use(
  session({
    secret: "JMH@jaf.erq_ucd6vbt",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use((req, res, next) => {
  console.log('Session data:', req.session);
  next();
});

app.post("/insert_user", controller.insert_user_controller);
app.get("/health_check", controller.health_check);
app.post("/login", controller.login_controller);
app.post("/logout", controller.logout_controller);
app.post("/onboarding/client", controller.accept_client_survey_controller);
app.post("/onboarding/coach", controller.accept_coach_survey_controller);
app.post("/request_coach", controller.request_coach_controller);
app.post("/accept_client", controller.accept_client_controller);
app.get("/get_role", controller.get_role_controller);
app.post('/messages', controller.insert_message_controller);
app.get('/messages', controller.get_client_coach_messages_controller);

app.get("/check_session", (req, res) => {
  console.log("Checking session data:", req.session);
  if (req.session.user) {
    res.status(200).send({ isLoggedIn: true, user: req.session.user });
  } else {
    res.status(200).send({ isLoggedIn: false });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT.toString());
});