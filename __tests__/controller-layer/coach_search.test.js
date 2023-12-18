const request = require("supertest");
const { app } = require("../../app");

const { search_coaches_business_layer } = require("../../business_layer/coach_search");

jest.mock("../../business_layer/coach_search");


const request_body = {
    page_info: {
        page_size: 1,
        page_num: 3
    },
    filter_options: {
        name: "H",
        accepting_new_clients: true,
        hourly_rate: {min: 0, max: 4},
        location: {city: "Newark", state: "NJ"},
        experience_level: {min: 0, max: 4},
        goals: [1, 2, 5]
    },
    sort_options: {
        key: "name",
        is_descending: true
    }
};

describe("Testing Coach Search", () => {
    test("Successful Search", async () => {
        const expected_coaches = [{user_id: 3}, {user_id: 2}, {user_id: 4}];
        const expected_page_info = {
            page_num: request_body.page_info.page_num,
            page_size: request_body.page_info.page_size,
            page_count: 5,
            has_next: true,
            has_prev: true
        };
        const expected_response = {coaches: expected_coaches, page_info: expected_page_info};

        search_coaches_business_layer.mockResolvedValue(expected_response);

        const response = await request(app)
            .post("/coaches/search")
            .send(request_body)
            .accept("application/json")
            .expect(200)
        expect(response.body).toEqual(expected_response);
    });

    test("Unsuccessful Search", async () => {
        const expected_response = {message: "Something went wrong"};

        search_coaches_business_layer.mockRejectedValue(new Error(expected_response.message));

        const response = await request(app)
            .post("/coaches/search")
            .send(request_body)
            .accept("application/json")
            .expect(500)
        expect(response.body).toEqual(expected_response);
    });
});
