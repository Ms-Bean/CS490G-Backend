const { app, server } = require("../../app");
const request = require("supertest");

const { insert_user_business_layer, set_user_address_business_layer } = require("../../business_layer/registration");
jest.mock("../../business_layer/registration.js");


const user_credentials = {
    first_name: "First",
    last_name: "Last",
    username: "User",
    email: "user@email.com",
    password: "P4ss_w0rd!",
    role: "client"
};

const location_info = {
    street_address: "1 Main Street",
    city: "New York",
    state: "NY",
    zip_code: "00000"
};


beforeAll(() => {
    server.close();
});

// To check whether inserted user is in the session
beforeAll(() => {
    app.get("/get-session", (req, res) => {
        res.json({session: req.session});
    });
})


afterEach(() => {
    jest.clearAllMocks();
})


test("Successful insert", async () => {
    const request_body = {...user_credentials, ...location_info};
    const expected_user_id = 5;
    const expected_response = {message: "Successfully added user"};
    const expected_session_user = {username: user_credentials.username, user_id: expected_user_id};

    insert_user_business_layer.mockResolvedValue({user_id: expected_user_id, message: expected_response.message});
    const agent = request.agent(app);

    const insert_response = await agent
        .post("/insert_user")
        .send(request_body)
        .accept("application/json")
        .expect(200);
    expect(insert_response.body).toEqual(expected_response);
    expect(set_user_address_business_layer).toHaveBeenCalledWith(
        expected_user_id,
        location_info.street_address, location_info.city, location_info.state, location_info.zip_code
    );

    const session_response = await agent
        .get("/get-session")
        .expect(200);
    expect(session_response.body?.session?.user).toEqual(expected_session_user);
});


test("Unsuccessful insert", async () => {
    const request_body = {...user_credentials, ...location_info};
    const expected_response = {message: "Some type of error message"};

    insert_user_business_layer.mockRejectedValue(expected_response.message);
    const agent = request.agent(app);

    const insert_response = await agent
        .post("/insert_user")
        .send(request_body)
        .accept("application/json")
        .expect(400);
    expect(insert_response.body).toEqual(expected_response);
    expect(set_user_address_business_layer).not.toHaveBeenCalled();

    const session_response = await agent
        .get("/get-session")
        .expect(200);
    expect(session_response.body?.session?.user).toBeUndefined();
});
