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
    test('create_user_workout_plan - Creates user workout plan successfully', async () => {
        const user_id = 1;
        const workout_plan_id = 1;
        const uwp_request = { user_id, workout_plan_id };
      
        const mockUserWorkoutPlan = {
          user_id: 1,
          workout_plan_id: 1,
          // Add other properties as needed
        };
      
        workoutManagement.UserWorkoutPlan.mockImplementationOnce(() => mockUserWorkoutPlan);
        workoutManagement.create_user_workout_plan.mockResolvedValue(mockUserWorkoutPlan);
      
        const result = await businessLayer.create_user_workout_plan(uwp_request);
      
        expect(result).toEqual(mockUserWorkoutPlan);
        expect(workoutManagement.UserWorkoutPlan).toHaveBeenCalledWith(uwp_request);
        expect(workoutManagement.create_user_workout_plan).toHaveBeenCalledWith(mockUserWorkoutPlan);
      });
    //   test('create_workout_plan_exercise - Coach creates workout plan exercise', async () => {
    //     const user_id = 1;
    //     const wpe_request = {
    //         weekday: 'monday',
    //         time: '12:00:00',
    //         workout_plan_id: 1,
    //         exercise_id: 1,
    //         reps_per_set: 10,
    //         num_sets: 3,
    //         weight: 50,
    //     };
    
    //     const mockExercise = { exercise_id: 1, name: 'Test Exercise' };
    //     const mockWorkoutPlan = { workout_plan_id: 1, author_id: 1 };
    //     const mockRole = 'coach';
    //     const mockClientList = [{ id: 2 }];
    
    //     exercise.get_exercise_by_id_data_layer.mockResolvedValue(mockExercise);
    //     workoutManagement.get_workout_by_id.mockResolvedValue(mockWorkoutPlan); // Corrected naming here
    //     user_info.get_role.mockResolvedValue(mockRole);
    //     clientCoachInteraction.get_clients_of_coach_data_layer.mockResolvedValue(mockClientList);
    //     workoutManagement.create_workout_exercise.mockResolvedValue('created'); // Corrected naming here
    
    //     const result = await businessLayer.create_workout_plan_exercise(user_id, wpe_request);
    
    //     expect(exercise.get_exercise_by_id_data_layer).toHaveBeenCalledWith(wpe_request.exercise_id);
    //     expect(workoutManagement.get_workout_by_id).toHaveBeenCalledWith(wpe_request.workout_plan_id);
    //     expect(user_info.get_role).toHaveBeenCalledWith(user_id);
    //     expect(clientCoachInteraction.get_clients_of_coach_data_layer).toHaveBeenCalledWith(user_id);
    //     expect(workoutManagement.create_workout_exercise).toHaveBeenCalledWith(
    //         expect.objectContaining({
    //             workout_plan_id: wpe_request.workout_plan_id,
    //             exercise_id: wpe_request.exercise_id,
    //             reps_per_set: wpe_request.reps_per_set,
    //             num_sets: wpe_request.num_sets,
    //             weight: wpe_request.weight,
    //         })
    //     );
    //     expect(() => businessLayer.create_workout_plan_exercise(user_id, wpe_request)).toThrow(APIError);
    //     //expect(result).toBe('created');
    // });
    test('update_workout_plan - User updates their own workout plan', async () => {
        const user_id = 1;
        const new_wp = {
            workout_plan_id: 1,
            name: 'Updated Workout Plan',
            author_id: user_id,
        };
    
        const mockWorkoutPlan = {
            workout_plan_id: 1,
            name: 'Original Workout Plan',
            author_id: user_id,
        };
    
        // Mocking functions
        workoutManagement.get_workout_by_id.mockResolvedValue(mockWorkoutPlan);
        workoutManagement.update_workout_plan.mockResolvedValue('updated');
    
        // Testing the function
        const result = await businessLayer.update_workout_plan(user_id, new_wp);
    
        // Expectations
        expect(workoutManagement.get_workout_by_id).toHaveBeenCalledWith(new_wp.workout_plan_id);
        expect(workoutManagement.update_workout_plan).toHaveBeenCalledWith(new_wp);
    
        // Additional expectation for the result when it's successful
        expect(result).toBe('updated');
    });
    // test('update_workout_plan_exercise - Coach updates workout plan exercise', async () => {
    //     // Mock data
    //     const user_id = 1;
    //     const wpe_request = {
    //         workout_plan_id: 1,
    //         workout_plan_exercise_id: 1,
    //         exercise_id: 1,
    //         reps_per_set: 12,
    //         num_sets: 4,
    //         weight: 60,
    //     };

    //     const mockWorkoutPlan = { workout_plan_id: 1, author_id: 1 };
    //     const mockExercise = { exercise_id: 1, name: 'Test Exercise' };

    //     workoutManagement.get_workout_by_id.mockResolvedValue(mockWorkoutPlan);
    //     workoutManagement.get_exercises_by_workout_id.mockResolvedValue([{ workout_plan_exercise_id: 1 }]);
    //     exercise.get_exercise_by_id_data_layer.mockResolvedValue(mockExercise);
    //     workoutManagement.update_workout_exercise.mockResolvedValue('updated');

    //     // Execute the function
    //     const result = await businessLayer.update_workout_plan_exercise(user_id, wpe_request);

    //     // Expectations
    //     expect(workoutManagement.get_workout_by_id).toHaveBeenCalledWith(wpe_request.workout_plan_id);
    //     expect(workoutManagement.get_exercises_by_workout_id).toHaveBeenCalledWith(wpe_request.workout_plan_id);
    //     expect(exercise.get_exercise_by_id_data_layer).toHaveBeenCalledWith(wpe_request.exercise_id);
    //     expect(workoutManagement.update_workout_exercise).toHaveBeenCalledWith(wpe_request);
    //     expect(result).toBe('updated');

    //     // Ensure the validation function was not called
    //     expect(businessLayer._validate_create_workout_plan_exercise_request).not.toHaveBeenCalled();
    // });

  });
  
  // Add more test cases for other functions in the businessLayer module