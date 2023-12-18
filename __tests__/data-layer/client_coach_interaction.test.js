const data_layer = require("../../data_layer/client_coach_interaction");
const { con } = require("../../data_layer/conn");

jest.mock("../../data_layer/conn");


afterEach(() => jest.clearAllMocks());


describe("Test retrieving user profile by id", () => {
    test("Testing handling database failure", async () => {
        const user_id = 3;
        const expected_response = "SQL failure";

        con.query.mockImplementation((sql, values, callback) => callback(new Error("Something went wrong")));

        await expect(data_layer.get_User_Profile_By_Id_Data_Layer(user_id)).rejects.toThrow(expected_response);
    });
});
