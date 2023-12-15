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
        calories_consumed: 3478,
        weight: 259,
        calories_burned: 2452,
        created: '2023-11-10T05:00:00.000Z',
        modified: '2023-11-10T05:00:00.000Z',
        date: '2023-11-10',
        user_id: 1004,
        water_intake: 7,
        mood: 'great',
      },
    ];

    for (let i = 0; i < inputData.length; i++) {
      const result = await dataLayer.insert_daily_survey_data_layer(inputData[i]);
      expect(result).toBe("Information inserted");
    }
  });
});
