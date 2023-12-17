const { con } = require("../../data_layer/conn");
const { count_coach_search_results, search_coaches_data_layer } = require("../../data_layer/coach_search");

jest.mock("../../data_layer/conn");

const template_request = {
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
    },
    sort_options: {
        key: "name",
        is_descending: true
    }
};


afterEach(() => {
    jest.clearAllMocks();
});


describe("Test counting search result hits", () => {
    test("Test successful call to func", async () => {
        const filter_options = JSON.parse(JSON.stringify(template_request.filter_options));
        const fake_search_results = [{}, {}, {}, {}];
        con.query.mockImplementation((sql, values, callback) => callback(null, fake_search_results));

        expect(count_coach_search_results({filter_options})).resolves.toBe(fake_search_results.length);
        expect(con.query).toHaveBeenCalled();
    });

    test("Test unsuccessful call to func", async () => {
        const filter_options = JSON.parse(JSON.stringify(template_request.filter_options));
        const expected_error_message = "Something went wrong"
        con.query.mockImplementation((sql, values, callback) => callback(new Error(expected_error_message)));

        expect(count_coach_search_results({filter_options})).rejects.toThrow(expected_error_message);
        expect(con.query).toHaveBeenCalled();
    })
});


describe("Testing retrieving search results", () => {
    test("Test successful retrieval with minimal filter options", async () => {
        const request = JSON.parse(JSON.stringify(template_request));
        request.filter_options = {
            name: "",
            accepting_new_clients: null,
            location: {city: "", state: ""},
        };
        const fake_search_results = [
            {
                user_id: 1,
                first_name: "FirstNameOne",
                last_name: "LastNameOne",
                about_me: "AboutMeOne",
                profile_picture: null,
                hourly_rate: 100,
                coaching_history: "History One",
                accepting_new_clients: true,
                experience_level: 2,
                goals: "G1,G2,G3",
                address: "1 Address Street",
                city: "One City",
                state: "NJ"
            }
        ];
        const expected_result = [{
            coach_id: 1,
            personal_info: {
                first_name: "FirstNameOne",
                last_name: "LastNameOne",
                about_me: "AboutMeOne",
                profile_picture: null
            },
            professional_info: {
                hourly_rate: 100,
                coaching_history: "History One",
                accepting_new_clients: true,
                experience_level: 2,
                goals: ["G1", "G2", "G3"]
            },
            location: {
                address: "1 Address Street",
                city: "One City",
                state: "NJ"
            }
        }];

        con.query.mockImplementation((sql, values, callback) => callback(null, fake_search_results));

        expect(search_coaches_data_layer(request)).resolves.toEqual(expected_result);
        expect(con.query).toHaveBeenCalled();
    });

    test("Test successful retrieval with maximal filter options", async () => {
        const request = JSON.parse(JSON.stringify(template_request));
        const fake_search_results = [
            {
                user_id: 1,
                first_name: "FirstNameOne",
                last_name: "LastNameOne",
                about_me: "AboutMeOne",
                profile_picture: null,
                hourly_rate: 100,
                coaching_history: "History One",
                accepting_new_clients: true,
                experience_level: 2,
                goals: "G1,G2,G3",
                address: "1 Address Street",
                city: "One City",
                state: "NJ"
            }
        ];
        const expected_result = [{
            coach_id: 1,
            personal_info: {
                first_name: "FirstNameOne",
                last_name: "LastNameOne",
                about_me: "AboutMeOne",
                profile_picture: null
            },
            professional_info: {
                hourly_rate: 100,
                coaching_history: "History One",
                accepting_new_clients: true,
                experience_level: 2,
                goals: ["G1", "G2", "G3"]
            },
            location: {
                address: "1 Address Street",
                city: "One City",
                state: "NJ"
            }
        }];

        con.query.mockImplementation((sql, values, callback) => callback(null, fake_search_results));

        expect(search_coaches_data_layer(request)).resolves.toEqual(expected_result);
        expect(con.query).toHaveBeenCalled();
    });

    test("Test unsuccessful retrieval", async () => {
        const request = JSON.parse(JSON.stringify(template_request));
        const expected_error_message = "Oops! Something went wrong";
        con.query.mockImplementation((sql, values, callback) => callback(new Error(expected_error_message)));

        expect(search_coaches_data_layer(request)).rejects.toThrow(expected_error_message);
        expect(con.query).toHaveBeenCalled();
    });
}); 
