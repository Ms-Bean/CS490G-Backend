const request = require("supertest");

const { app } = require("../../app");
const { login_business_layer } = require("../../business_layer/login");

jest.mock("../../business_layer/login");

const login_credentials = {
    username: "Username1",
    password: "P4$$_wOrd!"
};


beforeAll(() => {
    app.get("/get-session", (req, res) => {
        res.json({session: req.session});
    });
});


test("Successful login", async () => {
    const expected_user_id = 1;
    const expected_user = {username: login_credentials.username, user_id: expected_user_id};
    const expected_message = "Success message";
    const expected_response = {success: true, message: expected_message, user: expected_user};

    login_business_layer.mockResolvedValue({user_id: expected_user_id, message: expected_message});

    const agent = request.agent(app);
    const login_response = await agent
        .post("/login")
        .accept("application/json")
        .send(login_credentials)
        .expect(200);
    expect(login_response.body).toEqual(expected_response);

    const session_response = await agent
        .get("/get-session")
        .expect(200);
    expect(session_response.body?.session?.user).toEqual(expected_user);
});


test("Unsuccessful login", async () => {
    const expected_message = "Some error message";
    const expected_response = {message: expected_message};

    login_business_layer.mockRejectedValue(expected_message);

    const agent = request.agent(app);
    const login_response = await agent
        .post("/login")
        .accept("application/json")
        .send(login_credentials)
        .expect(400);
    expect(login_response.body).toEqual(expected_response);

    const session_response = await agent
        .get("/get-session")
        .expect(200);
    expect(session_response.body?.session?.user).toBeUndefined();
});
