data_layer = require("../data_layer");
describe('changeUserName', () => {
    it('should update username in db', async () => {
        const input = [
            {user_id: 60, weight: 150, height: 6.1, experience_level: "beginner", budget: 50.40},
            {user_id: 60, weight: 250, height: 6, experience_level: "intermediate", budget: 4.00},
            {user_id: 60, weight: 150, height: 6.1, experience_level: "beginner", budget: 50.40}
        ];
        for(var i = 0; i < input.length; i++)
        {
            await expect(data_layer.accept_client_survey_data_layer(input[i].user_id, input[i].weight, input[i].height, input[i].experience_level, input[i].budget)).resolves.toBe("Information updated.");
        }
    });
  });
  