const workoutManagement = require('../../data_layer/workout_management.js');
const exercise = require('../../data_layer/exercise.js');
const clientCoachInteraction = require('../../data_layer/client_coach_interaction.js');
const businessLayer = require('../../business_layer/workout_management.js');
const user_info = require('../../data_layer/user_info.js'); // Import the user_info module

jest.mock('../../data_layer/workout_management.js');
jest.mock('../../data_layer/exercise.js');
jest.mock('../../data_layer/client_coach_interaction.js');
jest.mock('../../data_layer/user_info.js');

describe('Business Layer Tests', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    test('assign_workout_plan - Same assigner and client', async () => {
      const assigner_id = 1;
      const client_id = 1;
      const workout_plan_id = 1;
  
      workoutManagement.assign_workout_plan.mockResolvedValue('assigned');
  
      const result = await businessLayer.assign_workout_plan(assigner_id, client_id, workout_plan_id);
  
      expect(result).toBe('assigned');
      expect(workoutManagement.assign_workout_plan).toHaveBeenCalledWith(client_id, workout_plan_id);
    });
  
    test('assign_workout_plan - Different assigner and client with permission', async () => {
      const assigner_id = 2;
      const client_id = 1;
      const workout_plan_id = 1;
  
      clientCoachInteraction.check_if_client_has_hired_coach.mockResolvedValue(true);
      workoutManagement.assign_workout_plan.mockResolvedValue('assigned');
  
      const result = await businessLayer.assign_workout_plan(assigner_id, client_id, workout_plan_id);
  
      expect(result).toBe('assigned');
      expect(clientCoachInteraction.check_if_client_has_hired_coach).toHaveBeenCalledWith(assigner_id, client_id);
      expect(workoutManagement.assign_workout_plan).toHaveBeenCalledWith(client_id, workout_plan_id);
    });

  });
  
  // Add more test cases for other functions in the businessLayer module