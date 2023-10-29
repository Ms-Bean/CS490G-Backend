const express = require('express');
const cors = require('cors');
const app = express();

const controller = require("./rest_controller");

const PORT = 3500 || process.env.PORT;

app.post('/insert_user', controller.insert_user_controller);
app.get('/health_check', controller.health_check);

app.use(cors());

app.options('*',cors());
app.listen(PORT, ()=>{
    console.log("Server running on port port " + PORT.toString());
})