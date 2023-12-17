const request = require("supertest");

const { app } = require("../../app");

const test_user_id = 3;
const login_credentials = {
    username: "Username1",
    password: "P4$$_wOrd!"
};

beforeAll(() => {
    app.post("/fake-login", (req, res) => {
        req.session.user = { username: req.body.username, user_id: test_user_id };
        res.status(204).send();
    });

    app.get("/get-session", (req, res) => {
        res.json({session: req.session});
    });
});


test("Successful logout", async () => {
    const agent = request.agent(app);
    await agent
        .post("/fake-login")
        .accept("application/json")
        .send({username: login_credentials.username, password: "password"})
        .expect(204);

    await agent
        .post("/logout")
        .accept("application/json")
        .expect(200);

    const session_response = await agent
        .get("/get-session")
        .expect(200);
    expect(session_response.body?.session?.user).toBeUndefined();
});

// TODO: Create test for unsuccessful logout
