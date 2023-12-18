const exerciseBank = require('../../data_layer/exercise');
const goals = require('../../data_layer/goals');
const userInfo = require('../../data_layer/user_info');
const exerciseBusinessLayer = require('../../business_layer/exercise'); // Assuming your business layer functions are in a file named exercise.js

jest.mock('../../data_layer/exercise');

describe('Exercise Business Layer Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get_all_exercises_business_layer', () => {
    test('should get all exercises', async () => {
      const expectedExercises = [{ id: 1, name: 'Exercise 1' }, { id: 2, name: 'Exercise 2' }];
      exerciseBank.get_all_exercises_data_layer.mockResolvedValue(expectedExercises);

      const result = await exerciseBusinessLayer.get_all_exercises_business_layer();

      expect(result).toEqual(expectedExercises);
      expect(exerciseBank.get_all_exercises_data_layer).toHaveBeenCalled();
    });

    // Add more tests for different scenarios, such as error cases, if needed
  });

  describe('get_exercise_by_id_business_layer', () => {
    test('should get exercise by id', async () => {
      const exerciseId = 1;
      const expectedExercise = { id: exerciseId, name: 'Exercise 1' };
      exerciseBank.get_exercise_by_id_data_layer.mockResolvedValue(expectedExercise);

      const result = await exerciseBusinessLayer.get_exercise_by_id_business_layer(exerciseId);

      expect(result).toEqual(expectedExercise);
      expect(exerciseBank.get_exercise_by_id_data_layer).toHaveBeenCalledWith(exerciseId);
    });

    // Add more tests for different scenarios, such as error cases, if needed
  });
});