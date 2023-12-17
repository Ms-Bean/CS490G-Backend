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


describe("Test counting search result hits", () => {
    afterEach(() => {
        jest.clearAllMocks();
    })

    test("Test successful call to func", async () => {
        const filter_options = JSON.parse(JSON.stringify(template_request.filter_options));
        con.query.to
    })
});