const dailySurvey = require('../../data_layer/daily_survey');
const businessLayer = require('../../business_layer/daily_survey'); // Adjust the path accordingly

jest.mock('../../data_layer/daily_survey');

describe('Daily Survey Business Layer Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should insert daily survey successfully', async () => {
    const surveyData = {
      date: '2023-01-01',
      water_intake: 8,
      calories_burned: 500,
      weight: 150,
      calories_consumed: 2000,
    };

    dailySurvey.insert_daily_survey_data_layer.mockResolvedValue('Survey inserted successfully');

    const result = await businessLayer.insert_daily_survey_business_layer(surveyData);

    expect(result).toBe('Survey inserted successfully');
    expect(dailySurvey.insert_daily_survey_data_layer).toHaveBeenCalledWith(surveyData);
  });

  test('should reject for a survey with a future date', async () => {
    const surveyData = {
      date: '2023-12-31', // Future date
      water_intake: 8,
      calories_burned: 500,
      weight: 150,
      calories_consumed: 2000,
    };

    await expect(businessLayer.insert_daily_survey_business_layer(surveyData)).rejects.toThrow('You cannot add future surveys.');
    expect(dailySurvey.insert_daily_survey_data_layer).not.toHaveBeenCalled();
  });

  test('should reject for a survey with values below 0', async () => {
    const surveyData = {
      date: '2023-01-01',
      water_intake: -1,
      calories_burned: 500,
      weight: 150,
      calories_consumed: 2000,
    };

    await expect(businessLayer.insert_daily_survey_business_layer(surveyData)).rejects.toThrow('Values cannot be below 0.');
    expect(dailySurvey.insert_daily_survey_data_layer).not.toHaveBeenCalled();
  });
});
