const {
  insert_daily_survey_business_layer,
} = require("../business_layer/daily_survey");
const {
  insert_daily_survey_data_layer,
} = require("../data_layer/daily_survey");
const daily_survey = require("../data_layer/daily_survey");
const connection = require("../data_layer/conn");
jest.mock("../data_layer/daily_survey", () => ({
  insert_daily_survey_data_layer: jest.fn(),
}));
jest.mock("../data_layer/conn", () => ({
  con: {
    query: jest.fn(),
  },
}));
describe("insert_daily_survey_business_layer", () => {
  const mockSurveyData = {
    date: "2023-04-01",
    water_intake: 8,
    calories_burned: 500,
    weight: 150,
    calories_consumed: 2000,
  };
  it("should successfully insert a survey", async () => {
    daily_survey.insert_daily_survey_data_layer.mockResolvedValue(
      "Information inserted"
    );
    const result = await insert_daily_survey_business_layer(mockSurveyData);
    expect(result).toBe("Information inserted");
    expect(daily_survey.insert_daily_survey_data_layer).toHaveBeenCalledWith(
      mockSurveyData
    );
  });
  it("should reject with an error for future dates", async () => {
    const futureDateData = { ...mockSurveyData, date: "2099-12-31" };
    await expect(
      insert_daily_survey_business_layer(futureDateData)
    ).rejects.toThrow("You cannot add future surveys.");
  });
  it("should reject with an error for negative values", async () => {
    const negativeValueData = { ...mockSurveyData, water_intake: -1 };
    await expect(
      insert_daily_survey_business_layer(negativeValueData)
    ).rejects.toThrow("Values cannot be below 0.");
  });
});
describe("insert_daily_survey_data_layer", () => {
  const mockSurveyData = {
    calories_consumed: 2000,
    weight: 150,
    calories_burned: 500,
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
    date: "2023-04-01",
    user_id: 1,
    water_intake: 8,
    mood: "Good",
  };
  beforeEach(() => {
    connection.con.query.mockReset();
  });
  it("should insert survey data into the database", async () => {
    connection.con.query.mockImplementation((sql, params, callback) => {
      callback(null, { affectedRows: 1 });
    });
    const result = await insert_daily_survey_data_layer(mockSurveyData);
    expect(result).toBe("Information inserted");
  });
});
