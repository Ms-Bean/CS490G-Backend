// neccessary modules and packages
const express = require("express");
const cors = require("cors");
const app = express();
const session = require("express-session");
const bodyParser = require("body-parser");

const controller = require("./rest_controller");
const profile_management = require("./business_layer/profile_management")

// set server port
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

// session handling
app.use(
  session({
    secret: "JMH@jaf.erq_ucd6vbt",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use((req, res, next) => {
  next();
});

// Define API endpoints
app.post("/insert_user", controller.insert_user_controller);
app.get("/health_check", controller.health_check);
app.post("/login", controller.login_controller);
app.post("/logout", controller.logout_controller);
app.post("/onboarding/client", controller.accept_client_survey_controller);
app.post("/onboarding/coach", controller.accept_coach_survey_controller);
app.post("/request_coach", controller.request_coach_controller);
app.post("/accept_client", controller.accept_client_controller);
app.get("/get_role", controller.get_role_controller);
app.get("/get_user_account_info", controller.get_user_account_info_controller);
app.post("/alter_account_info", controller.alter_account_info_controller);
app.route('/messages')
    .get(controller.get_client_coach_messages_controller);
app.route('/messages/list')    
    .get(controller.get_client_coach_list_controller);  
app.route('/messages/insert')
    .post(controller.insert_message_controller)
app.post('/coaches/search', controller.search_coaches_controller);
app.post('/daily_survey', controller.insert_daily_survey_controller);
app.get('/get_user_profile', controller.get_user_profile);
app.post('/set_user_profile', controller.set_user_profile);
app.get("/get_coach_dashboard_info", controller.get_coach_dashboard_info);

app.get("/check_session", (req, res) => {
  if (req.session.user) {
    res.status(200).send({ isLoggedIn: true, user: req.session.user });
  } else {
    res.status(200).send({ isLoggedIn: false });
  }
});
app.listen(PORT, () => {
  console.log("Server running on port " + PORT.toString());
});

profile_management.get_profile_info(996).then((response) =>{
  console.log(response)
}).catch((err) => {
  console.log(err);
});