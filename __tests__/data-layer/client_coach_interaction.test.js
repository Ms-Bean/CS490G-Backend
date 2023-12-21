const { con } = require("../../data_layer/conn");
const data_layer = require("../../data_layer/client_coach_interaction");


jest.mock("../../data_layer/conn");


describe("Test getting clients of coach", () => {
    test("Database failure", async () => {
        const coach_id = 3;
        const expected_response = "Something went wrong";
        con.query.mockImplementation((sql, values, callback) => callback(new Error(expected_response)));

        await expect(data_layer.get_clients_of_coach_data_layer(coach_id)).rejects.toThrow(expected_response);
    });

    test("Successful retrieval", async () => {
        const coach_id = 3;
        const mock_db_row = [{
            client_id: 3,
            client_name: "clientName",
            pfp_link: "https://www.some-image.com",
            message: "Message",
            created: Date.now()
        }];
        const expected_response = [{
            id: mock_db_row[0].client_id,
            name: mock_db_row[0].client_name,
            profile_picture: mock_db_row[0].pfp_link,
            message_content: mock_db_row[0].message,
            message_created: mock_db_row[0].created
        }];
        con.query.mockImplementation((sql, values, callback) => callback(null, mock_db_row));
    
        await expect(data_layer.get_clients_of_coach_data_layer(coach_id)).resolves.toEqual(expected_response);
    });
});