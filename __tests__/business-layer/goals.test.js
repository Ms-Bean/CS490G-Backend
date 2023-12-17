const dataLayer = require('../../data_layer/goals.js');
const businessLayer = require('../../business_layer/goals.js'); // Assuming your business layer functions are in a file named businessLayer.js

jest.mock('../../data_layer/goals.js');

describe('Business Layer Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('get_all_goals_business_layer - Success', async () => {
    const expectedGoals = [{ id: 1, name: 'Goal 1' }, { id: 2, name: 'Goal 2' }];
    dataLayer.get_all_goals_data_layer.mockResolvedValue(expectedGoals);

    const result = await businessLayer.get_all_goals_business_layer();

    expect(result).toEqual(expectedGoals);
  });

  test('goal_name_by_id_business_layer - Success', async () => {
    const goalId = 1;
    const expectedGoalName = 'Some Goal';
    dataLayer.goal_name_by_id_data_layer.mockResolvedValue(expectedGoalName);

    const result = await businessLayer.goal_name_by_id_business_layer(goalId);

    expect(result).toEqual(expectedGoalName);
  });

  // Add more tests for different scenarios, such as error cases, if needed
});
