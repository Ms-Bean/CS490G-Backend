const goals = require('../data_layer/goals');
const connection = require('../data_layer/conn');

jest.mock('../data_layer/conn', () => {
    return {
      con: {
        query: jest.fn(),
      },
    };
  });
  
  describe('Goals Data Layer', () => {
    describe('goal_name_by_id_data_layer', () => {
      it('should return the goal name for a given ID', async () => {
        const goalId = 1;
        const mockGoalName = 'Goal Name';
        connection.con.query.mockImplementation((sql, params, callback) => {
          callback(null, [{ name: mockGoalName }]);
        });
  
        const result = await goals.goal_name_by_id_data_layer(goalId);
        expect(result).toBe(mockGoalName);
        expect(connection.con.query).toHaveBeenCalledWith(expect.any(String), [goalId], expect.any(Function));
      });
  
      it('should handle errors', async () => {
        connection.con.query.mockImplementation((sql, params, callback) => {
          callback(new Error('Database error'), null);
        });
  
        await expect(goals.goal_name_by_id_data_layer(1)).rejects.toThrow('Failed to retrieve goal name from the database.');
      });
    });
  
    describe('get_all_goals_data_layer', () => {
      it('should return all goals', async () => {
        const mockGoals = [{ goal_id: 1, name: 'Goal 1' }, { goal_id: 2, name: 'Goal 2' }];
        connection.con.query.mockImplementation((sql, callback) => {
          callback(null, mockGoals);
        });
  
        const result = await goals.get_all_goals_data_layer();
        expect(result).toEqual(mockGoals);
        expect(connection.con.query).toHaveBeenCalledWith(expect.any(String), expect.any(Function));
      });
  
      it('should handle errors', async () => {
        connection.con.query.mockImplementation((sql, callback) => {
          callback(new Error('Database error'), null);
        });
  
        await expect(goals.get_all_goals_data_layer()).rejects.toThrow('Failed to retrieve goals from the database.');
      });
    });
  });