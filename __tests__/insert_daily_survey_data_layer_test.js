const dataLayer = require("../data_layer");

describe('insert_daily_survey_data_layer', () => {
  test('should insert daily survey data into the database for three users', async () => {
    const inputData = [
      {
        calories_consumed: 2200,
        weight: 140,
        calories_burned: 350,
        created: '2023-11-23T09:00:00Z',
        modified: '2023-11-23T09:30:00Z',
        date: '2023-11-23',
        user_id: 1005,
        water_intake: 10,
        mood: 'Sad',
      },
      {
        calories_consumed: 1800,
        weight: 160,
        calories_burned: 250,
        created: '2023-11-22T10:00:00Z',
        modified: '2023-11-22T10:30:00Z',
        date: '2023-11-22',
        user_id: 1004,
        water_intake: 6,
        mood: 'Neutral',
      },
    ];

    for (let i = 0; i < inputData.length; i++) {
      const result = await dataLayer.insert_daily_survey_data_layer(inputData[i]);
      expect(result).toBe("Information inserted");
    }
  });
});
