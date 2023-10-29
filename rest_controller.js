const business_layer = require('./business_layer');

async function health_check(req, res) 
{
    res.status(200).send("Hello, world!");
}
async function insert_user_controller(req, res) 
{
    business_layer.insert_user_business_layer(req.headers.first_name, req.headers.last_name, req.headers.username, req.headers.email, req.headers.password).then((response) =>{
        console.log("Sending response");
        res.header("Access-Control-Allow-Origin", "*");
        res.status(200).send({
            message: "Successfully added user!"
        });
    }).catch((error_message) =>{
        console.log(error_message);
        res.header("Access-Control-Allow-Origin", "*");
        res.status(400).send({
            message: error_message
        });
    });
}
module.exports.insert_user_controller = insert_user_controller;
module.exports.health_check = health_check;