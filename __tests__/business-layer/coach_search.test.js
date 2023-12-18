const business_layer = require("../../business_layer/coach_search");
const { count_coach_search_results, search_coaches_data_layer } = require("../../data_layer/coach_search");

jest.mock("../../data_layer/coach_search");

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


describe("Testing Business rules for coach search", () => {
    test("Test good ranges for filter options", () => {
        const filter_options = JSON.parse(JSON.stringify(template_request.filter_options));
        
        const errors = business_layer._validate_ranges_of_filter_options(filter_options);
        expect(errors).toHaveLength(0);
    });

    test("Test bad ranges for filter options", () => {
        const filter_options = JSON.parse(JSON.stringify(template_request.filter_options));
        [filter_options.hourly_rate.min, filter_options.hourly_rate.max] = [-1, 3];
        [filter_options.experience_level.min, filter_options.experience_level.max] = [5, 2];
        
        const errors = business_layer._validate_ranges_of_filter_options(filter_options);
        expect(errors).toHaveLength(2);
    });

    test("Test all good types for filter options", () => {
        const filter_options = JSON.parse(JSON.stringify(template_request.filter_options));

        const errors = business_layer._check_types_of_filter_options(filter_options);
        expect(errors).toHaveLength(0);
    });

    test("Test all bad types for filter options", () => {
        const filter_options = JSON.parse(JSON.stringify(template_request.filter_options));
        filter_options.accepting_new_clients = "34";
        filter_options.experience_level = {min: {}, max: "2"};
        filter_options.hourly_rate = {min: [], max: /^12/};
        filter_options.location = {city: 4.3, state: true};
        filter_options.name = 9;


        const errors = business_layer._check_types_of_filter_options(filter_options);
        expect(errors).toHaveLength(8);
    });

    test("Test normalization of empty filter options object", () => {
        const expected_result = {
            name: "",
            accepting_new_clients: null,
            experience_level: {min: 0, max: 1000},
            hourly_rate: {min: 0, max: 1_000_000},
            location: {city: "", state: ""},
        };

        const actual_result = business_layer._normalize_filter_options({});
        expect(actual_result).toEqual(expected_result);
    });

    test("Test normalization of full filter options object", () => {
        const filter_options = JSON.parse(JSON.stringify(template_request.filter_options));
        
        const result = business_layer._normalize_filter_options(filter_options);
        expect(result).toEqual(filter_options);
    });

    test("Test rejection of request when given filter options with bad types", async () => {
        const request_with_bad_types = JSON.parse(JSON.stringify(template_request));
        request_with_bad_types.filter_options = {
            accepting_new_clients: "34",
            experience_level: {min: {}, max: "2"},
            hourly_rate: {min: [], max: /^12/},
            location: {city: 4.3, state: true},
            name: 9
        };
        
        expect(business_layer.search_coaches_business_layer(request_with_bad_types)).rejects.toBeInstanceOf(Error);
    });

    test("Test rejection of request when given filter options with bad ranges", async () => {
        const request_with_bad_ranges = JSON.parse(JSON.stringify(template_request));
        [request_with_bad_ranges.filter_options.hourly_rate.min, request_with_bad_ranges.filter_options.hourly_rate.max] = [-1, 3];
        [request_with_bad_ranges.filter_options.experience_level.min, request_with_bad_ranges.filter_options.experience_level.max] = [5, 2];


        expect(business_layer.search_coaches_business_layer(request_with_bad_ranges)).rejects.toBeInstanceOf(Error);
    });

    test("Test rejection of request when given sort options with bad key", async () => {
        const request_with_bad_sort_key = JSON.parse(JSON.stringify(template_request));
        request_with_bad_sort_key.sort_options.key = "wrong";

        expect(business_layer.search_coaches_business_layer(request_with_bad_sort_key)).rejects.toThrow(`'${request_with_bad_sort_key.sort_options.key}' is an invalid sort key`);
    });

    test("Test rejection of request when given sort options with bad descending flag", async () => {
        const request_with_bad_descending = JSON.parse(JSON.stringify(template_request));
        request_with_bad_descending.sort_options.is_descending = "wrong type";

        expect(business_layer.search_coaches_business_layer(request_with_bad_descending)).rejects.toThrow("sort_options property missing sort direction");
    });

    test("Test rejection of request when given bad page info", async () => {
        const request_with_bad_page_info = JSON.parse(JSON.stringify(template_request));
        request_with_bad_page_info.page_info.page_num = "4b3";

        expect(business_layer.search_coaches_business_layer(request_with_bad_page_info)).rejects.toThrow("Invalid page info");

        request_with_bad_page_info.page_info = undefined;
        expect(business_layer.search_coaches_business_layer(request_with_bad_page_info)).rejects.toThrow("Search request missing `page_info` property");
    });

    test("Test successful retrieval of search results", async () => {
        const request = JSON.parse(JSON.stringify(template_request));
        const expected_coaches = [{user_id: 1}];
        const expected_page_count = 5;
        const expected_page_info = {
            ...request.page_info,
            page_count: expected_page_count,
            has_next: request.page_info.page_num < expected_page_count,
            has_prev: request.page_info.page_num > 1
        };
        const expected_response = {
            coaches: expected_coaches,
            page_info: expected_page_info
        };

        count_coach_search_results.mockResolvedValue(expected_page_count);
        search_coaches_data_layer.mockResolvedValue(expected_coaches);

        await expect(business_layer.search_coaches_business_layer(request)).resolves.toEqual(expected_response);
    });

    test("Test unsuccessful retrieval of search results", async () => {
        const request = JSON.parse(JSON.stringify(template_request));
        count_coach_search_results.mockResolvedValue(0);
        search_coaches_data_layer.mockRejectedValue(new Error("Something went wrong"));

        expect(business_layer.search_coaches_business_layer(request)).rejects.toThrow("Something went wrong");
    });
});
