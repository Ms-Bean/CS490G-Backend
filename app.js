// neccessary modules and packages
const express = require("express");
const cors = require("cors");
const app = express();
const session = require("express-session");
const bodyParser = require("body-parser");
require('dotenv').config();

const controller = require("./rest_controller");
const profile_management = require("./business_layer/profile_management");
const client_dashboard = require("./business_layer/client_dashboard");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json")



// set server port
const PORT = 3500;

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 204,
};

// // Swagger options
// const options = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'Your API Documentation',
//       version: '1.0.0',
//       description: 'A sample API documentation for your Node.js backend',
//     },
//   },
//   apis: ['./routes/*.js'], // Path to the API routes
// };



app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(bodyParser.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
app.get("/requested_clients", controller.get_requested_clients_of_coach_controller);
app.post("/accept_client", controller.accept_client_controller);
app.post("/reject_client", controller.reject_client_controller);
app.get("/has_hired_coach/:coach_id", controller.check_if_client_has_hired_coach);
app.get("/get_clients/:coach_id", controller.get_users_clients);
app.get("/get_role", controller.get_role_controller);
// app.get("/get_profile_info", controller.get_User_Profile_By_Id_controller);
app.get("/get_user_account_info", controller.get_user_account_info_controller);
app.post("/alter_account_info", controller.alter_account_info_controller);
app.get("/get_client_dashboard_info", controller.get_client_dashboard_info);
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
app.post('/workout_plan/new', controller.create_new_workout_plan);
app.get('/workout_plan/author', controller.get_workout_plans_from_author);
app.route('/workout_plan/:id')
  .get(controller.get_workout_by_id)
  .put(controller.update_workout_plan)
  .delete(controller.delete_workout_plan);
app.post('/workout_plan/:wp_id/exercise/new', controller.create_workout_plan_exercise);
app.route('/workout_plan/:wp_id/exercise/:wpe_id')
  .get(controller.get_workout_plan_exercise_by_id)
  .put(controller.update_workout_plan_exercise)
  .delete(controller.delete_workout_plan_exercise);
app.get("/exercises", controller.get_all_exercises_controller);
app.put("/update_exercise/:exercise_id", controller.update_exercise_controller);
app.delete("/delete_exercise/:exercise_id", controller.delete_exercise_controller);
app.post("/add_exercise", controller.add_exercise_controller);
app.get("/goal_name/:goal_id", controller.goal_name_by_id_controller);
app.get("/goals", controller.get_all_goals_controller);
app.get('/muscle-groups', controller.get_all_muscle_groups_controller);
app.get('/equipment', controller.get_all_equipment_controller);
app.get("/exercise/:exercise_id", controller.get_exercise_by_id_controller);
app.get("/exercise/:exercise_id/references", controller.check_exercise_references_controller);
app.post("/workout_progress/new", controller.create_new_workout_progress);
app.get("/get_coach_dashboard_info/coach_request", controller.get_all_coach_request);
app.route("/get_coach_dashboard_info/coach_request/:coach_id")
  .put(controller.accept_coach)
  .delete(controller.reject_coach);
app.get("/get_client_target_weight/:client_id?", controller.get_client_target_weight);
app.post("/assign_workout_plan", controller.assign_workout_plan);
app.delete("/terminate/:terminatee_id", controller.terminate_client_coach);
app.get("/get_coach", controller.get_coach);
app.get("/check_user_workout_plan", controller.check_user_workout_plan_controller);

app.get("/check_session", (req, res) => {
  if (req.session.user) {
    res.status(200).send({ isLoggedIn: true, user: req.session.user });
  } else {
    res.status(200).send({ isLoggedIn: false });
  }
});


module.exports = {
  app,
  PORT
};