const business_layer = require("../../business_layer/client_coach_interaction");

const data_layer = require("../../data_layer/client_coach_interaction");
const { get_role } = require("../../data_layer/user_info");

jest.mock("../../data_layer/user_info");
jest.mock("../../data_layer/client_coach_interaction");
jest.mock("../../data_layer/messaging");
jest.mock("../../business_layer/workout_management");

beforeEach(() => jest.clearAllMocks());

describe("Test requesting clients of a coach", () => {
    test("Test successfully retrieving clients of coach", async () => {
        const user_id = 4;
        const expected_response = [
            {user_id: 5},
            {user_id: 2},
            {user_id: 1}
        ];

        get_role.mockResolvedValue("coach");
        data_layer.get_requested_clients_of_coach_data_layer.mockResolvedValue(expected_response);
        expect(business_layer.get_requested_clients_of_coach_business_layer(user_id)).resolves.toEqual(expected_response);
    });

    test("Test unsuccessfully retrieving clients of coach due to role", async () => {
        const user_id = 4;
        const expected_response = "Only coach can check their client requests.";
        get_role.mockResolvedValue("client");
        expect(business_layer.get_requested_clients_of_coach_business_layer(user_id)).rejects.toThrow(expected_response);
    });

    test("Test unsuccessfully retrieving clients of coach due to data layer", async () => {
        const user_id = 4;
        const expected_response = "Some error message";
        get_role.mockResolvedValue("coach");
        data_layer.get_requested_clients_of_coach_data_layer.mockRejectedValue(new Error(expected_response));
        expect(business_layer.get_requested_clients_of_coach_business_layer(user_id)).rejects.toThrow(expected_response);
    });
});


describe("Test getting user profile by id", () => {
    test("Successfuly retrieve user profile", async () => {
        const user_id = 29;
        const expected_response = [{
            user_id: user_id,
            about_me: "About me",
            experience_level: 2,
            created: Date.now(),
            modified: Date.now(),
            height: 100,
            weight: 100,
            medical_conditions: "Medical conditions",
            budget: "$$",
            goals: "Goals",
            target_weight: 101,
            profile_picture: "https://www.image.com",
            birthday: "2000-12-17"
        }];
        data_layer.get_User_Profile_By_Id_Data_Layer.mockResolvedValue(expected_response);
        expect(business_layer.get_User_Profile_By_Id_business_layer(user_id)).resolves.toEqual(expected_response);
    });

    test("Unsuccessfuly retrieve user profile", async () => {
        const user_id = 29;
        const expected_response = "Some error message";
        data_layer.get_User_Profile_By_Id_Data_Layer.mockRejectedValue(new Error(expected_response));
        expect(business_layer.get_User_Profile_By_Id_business_layer(user_id)).rejects.toThrow(expected_response);
    });
});


describe("Testing requests for coaches", () => {
    test("Bad coach id and client ids", async () => {
        const bad_coach_id = -4;
        const bad_client_id = null;
        const good_client_id = 1;

        expect(business_layer.request_coach_business_layer(bad_coach_id, bad_client_id)).rejects.toEqual("User is not logged in");
        expect(business_layer.request_coach_business_layer(bad_coach_id, good_client_id)).rejects.toEqual("Invalid coach id");
    });

    test("Failed retrieval of request", async () => {
        const coach_id = 2;
        const client_id = 4;
        const expected_error_message = "Something went wrong";

        data_layer.get_clients_coach_or_request.mockRejectedValue(new Error(expected_error_message));
        expect(business_layer.request_coach_business_layer(coach_id, client_id)).rejects.toThrow(expected_error_message);
    });

    test("Failed retrieval of request due to duplicate", async () => {
        const coach_id = 2;
        const client_id = 4;
        const duplicate_coach_request = [{coach_id, client_id}];
        const expected_error_message = "Duplicate coach request";

        data_layer.get_clients_coach_or_request.mockResolvedValue(duplicate_coach_request);
        expect(business_layer.request_coach_business_layer(coach_id, client_id)).rejects.toEqual(expected_error_message);
    });

    test("Failed posting of new request due to data layer failure", async () => {
        const coach_id = 2;
        const client_id = 4;
        const expected_error_message = "Something went wrong";

        data_layer.get_clients_coach_or_request.mockResolvedValue([]);
        data_layer.request_coach_data_layer.mockRejectedValue(new Error(expected_error_message));
        expect(business_layer.request_coach_business_layer(coach_id, client_id)).rejects.toThrow(expected_error_message);
    });

    test("Successful posting of new request", async () => {
        const coach_id = 2;
        const client_id = 4;
        const expected_message = "Success";

        data_layer.get_clients_coach_or_request.mockResolvedValue([]);
        data_layer.request_coach_data_layer.mockResolvedValue(expected_message);
        expect(business_layer.request_coach_business_layer(coach_id, client_id)).resolves.toEqual(expected_message);
    });
});


describe("Testing acceptance of clients", () => {
    test("Rejection of acceptance of client due to bad client or user ids", () => {
        const null_user_id = null;
        const bad_type_user_id = "trh";
        const bad_type_client_id = null;
        const good_user_id = 2;
        const good_client_id = 3;

        expect(business_layer.accept_client_business_layer(null_user_id, good_client_id)).rejects.toThrow("User is not logged in");
        expect(business_layer.accept_client_business_layer(bad_type_user_id, good_client_id)).rejects.toThrow("Invalid user id");
        expect(business_layer.accept_client_business_layer(good_user_id, bad_type_client_id)).rejects.toThrow("Invalid client id");
    });

    test("Reject acceptance of client due to no coach request", async () => {
        const user_id = 2;
        const client_id = 3;
        
        data_layer.check_if_client_coach_request_exists.mockResolvedValue(false);
        expect(business_layer.accept_client_business_layer(user_id, client_id)).rejects.toThrow("Request from client to coach does not exist");
    });

    test("Reject acceptance of client due to coach already hiring client", async () => {
        const user_id = 2;
        const client_id = 3;
        
        data_layer.check_if_client_coach_request_exists.mockResolvedValue(true);
        data_layer.check_if_client_has_hired_coach.mockResolvedValue(true);
        expect(business_layer.accept_client_business_layer(user_id, client_id)).rejects.toThrow("Coach cannot accept request from one of their current clients");
    });

    test("Reject acceptance of client due to failure in data layer", async () => {
        const user_id = 2;
        const client_id = 3;
        const expected_error_message = "Something went wrong :(";
        
        data_layer.check_if_client_coach_request_exists.mockResolvedValue(true);
        data_layer.check_if_client_has_hired_coach.mockResolvedValue(false);
        data_layer.accept_client_data_layer.mockRejectedValue(new Error(expected_error_message));
        expect(business_layer.accept_client_business_layer(user_id, client_id)).rejects.toThrow(expected_error_message);
    });

    test("Test acceptance of client", async () => {
        const user_id = 2;
        const client_id = 3;
        const data_layer_message = "Client successfully accepted";
        const expected_message = "You have accepted the client";
        
        data_layer.check_if_client_coach_request_exists.mockResolvedValue(true);
        data_layer.check_if_client_has_hired_coach.mockResolvedValue(false);
        data_layer.accept_client_data_layer.mockResolvedValue(data_layer_message);
        expect(business_layer.accept_client_business_layer(user_id, client_id)).resolves.toEqual(expected_message);
    });
});


describe("Test client rejection by coach", () => {
    test("Test rejection due to wrong role", async () => {
        const user_id = 3;
        const client_id = 6;
        const expected_message = `User with ID ${user_id} unauthorized to accept and reject coach requests`;
        const expected_code = 403;

        get_role.mockResolvedValue("client");
        try {
            await business_layer.reject_client_business_layer(user_id, client_id);
            expect(1).toBe(0);
        } catch (e) {
            expect(e.message).toEqual(expected_message);
            expect(e.code).toEqual(expected_code);
        }
    });

    test("Test rejection due to no request existing", async () => {
        const user_id = 3;
        const client_id = 6;
        const expected_message = `Request from client with ID ${client_id} to coach with ID ${user_id} does not exist`;
        const expected_code = 400;

        get_role.mockResolvedValue("coach");
        data_layer.check_if_client_coach_request_exists.mockResolvedValue(false);
        try {
            await business_layer.reject_client_business_layer(user_id, client_id);
            expect(1).toBe(0);
        } catch (e) {
            expect(e.message).toEqual(expected_message);
            expect(e.code).toEqual(expected_code);
        }
    });

    test("Test success of coach rejecting client", async () => {
        const user_id = 3;
        const client_id = 6;

        get_role.mockResolvedValue("coach");
        data_layer.check_if_client_coach_request_exists.mockResolvedValue(true);
        data_layer.delete_client_coach_row.mockResolvedValue();
        expect(business_layer.reject_client_business_layer(user_id, client_id)).resolves.toBeUndefined();
    });
});
