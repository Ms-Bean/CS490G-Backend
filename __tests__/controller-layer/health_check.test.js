const { app, server } = require("../../app");
const request = require("supertest");


beforeAll(() => {
    server.close();
});

test("Test health check endpoint", async () => {
    const response = await request(app)
        .get("/health_check")
        .expect(200);
    expect(response.text).toEqual("Hello, world!");
});