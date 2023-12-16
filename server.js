const { app, PORT } = require("./app");


app.listen(PORT, () => {
    console.log("Server running on port " + PORT.toString());
});