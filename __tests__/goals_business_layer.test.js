const dataLayer = require('../data_layer/goals');
const businessLayer = require('../business_layer/goals');

jest.mock('../data_layer/goals');

describe('goals business layer', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should retrieve goal name by id', async () => {
    const mockGoalId = 1;
    const mockGoalName = 'Test Goal';
    dataLayer.goal_name_by_id_data_layer.mockResolvedValue(mockGoalName);

    const result = await businessLayer.goal_name_by_id_business_layer(mockGoalId);

    expect(dataLayer.goal_name_by_id_data_layer).toHaveBeenCalledWith(mockGoalId);
    expect(result).toBe(mockGoalName);
  });

  it('should retrieve all goals', async () => {
    const mockGoals = [{ id: 1, name: 'Test Goal 1' }, { id: 2, name: 'Test Goal 2' }];
    dataLayer.get_all_goals_data_layer.mockResolvedValue(mockGoals);

    const result = await businessLayer.get_all_goals_business_layer();

    expect(dataLayer.get_all_goals_data_layer).toHaveBeenCalled();
    expect(result).toEqual(mockGoals);
  });
});