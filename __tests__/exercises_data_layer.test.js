const exerciseDataLayer = require('../data_layer/exercise_data_layer');
const connection = require('../data_layer/conn');

jest.mock('../data_layer/conn', () => {
  return {
    con: {
      query: jest.fn(),
    },
  };
});

describe('Exercise Data Layer', () => {
  describe('get_all_exercises_data_layer', () => {
    it('should return all active exercises with their details', async () => {
      const mockExercises = [
        // mock data here 
      ];
      connection.con.query.mockImplementation((sql, callback) => {
        callback(null, mockExercises);
      });

      const result = await exerciseDataLayer.get_all_exercises_data_layer();
      expect(result).toEqual(mockExercises);
      expect(connection.con.query).toHaveBeenCalledWith(expect.any(String), expect.any(Function));
    });

    it('should handle errors when retrieving all exercises', async () => {
      connection.con.query.mockImplementation((sql, callback) => {
        callback(new Error('Database error'), null);
      });

      await expect(exerciseDataLayer.get_all_exercises_data_layer()).rejects.toThrow('Failed to retrieve exercises data from the database.');
    });
  });

  describe('get_exercise_by_id_data_layer', () => {
    it('should return exercise details for a given ID', async () => {
      const exerciseId = 1;
      const mockExercise = {
        // mock data here
      };
      connection.con.query.mockImplementation((sql, params, callback) => {
        callback(null, [mockExercise]);
      });

      const result = await exerciseDataLayer.get_exercise_by_id_data_layer(exerciseId);
      expect(result).toEqual(mockExercise);
      expect(connection.con.query).toHaveBeenCalledWith(expect.any(String), [exerciseId], expect.any(Function));
    });

    it('should handle errors when retrieving exercise by ID', async () => {
      connection.con.query.mockImplementation((sql, params, callback) => {
        callback(new Error('Database error'), null);
      });

      await expect(exerciseDataLayer.get_exercise_by_id_data_layer(1)).rejects.toThrow('Failed to retrieve exercise from the database.');
    });
  });
});
