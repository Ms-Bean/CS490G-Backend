const exercise = require("../data_layer/exercise");
const exercise_bank = require("../data_layer/exercise");
const user_info = require("../data_layer/user_info");

jest.mock("../data_layer/exercise");
jest.mock("../data_layer/goals");
jest.mock("../data_layer/user_info");

const {
  get_all_exercises_business_layer,
  get_exercise_by_id_business_layer,
  update_exercise_business_layer,
  delete_exercise_business_layer,
  add_exercise_business_layer,
  get_all_equipment_business_layer,
  get_all_muscle_groups_business_layer,
  check_exercise_references_business_layer,
} = require("../business_layer/exercise");
jest.mock("../data_layer/conn", () => {
  return {
    con: {
      query: jest.fn(),
      beginTransaction: jest.fn(),
      commit: jest.fn(),
      rollback: jest.fn(),
    },
  };
});

jest.mock("../data_layer/exercise", () => ({
  get_all_exercises_data_layer: jest.fn(),
  get_exercise_by_id_data_layer: jest.fn(),
  update_exercise_data_layer: jest.fn(),
  delete_exercise_data_layer: jest.fn(),
  add_exercise_data_layer: jest.fn(),
  get_all_muscle_groups_data_layer: jest.fn(),
  get_all_equipment_data_layer: jest.fn(),
  check_exercise_references_data_layer: jest.fn(),
}));

describe("get_all_exercises_business_layer", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should retrieve all exercises", async () => {
    const mockData = [{ id: 1, name: "Exercise 1" }];
    exercise.get_all_exercises_data_layer.mockResolvedValue(mockData);
    const result = await get_all_exercises_business_layer();
    expect(result).toEqual(mockData);
    expect(exercise.get_all_exercises_data_layer).toHaveBeenCalled();
  });
});

describe("get_exercise_by_id_business_layer", () => {
  it("should retrieve exercise by ID", async () => {
    const mockExercise = { id: 1, name: "Exercise 1" };
    exercise_bank.get_exercise_by_id_data_layer.mockResolvedValue(mockExercise);
    const result = await get_exercise_by_id_business_layer(1);
    expect(result).toEqual(mockExercise);
    expect(exercise_bank.get_exercise_by_id_data_layer).toHaveBeenCalledWith(1);
  });
});

describe("get_all_muscle_groups_business_layer", () => {
  it("should return all muscle groups", async () => {
    const mockMuscleGroups = [
      { muscle_group: "Arms" },
      { muscle_group: "Legs" },
    ];
    exercise_bank.get_all_muscle_groups_data_layer.mockResolvedValue(
      mockMuscleGroups
    );
    const muscleGroups = await get_all_muscle_groups_business_layer();
    expect(muscleGroups).toEqual(mockMuscleGroups);
    expect(exercise_bank.get_all_muscle_groups_data_layer).toHaveBeenCalled();
  });
});

describe("check_exercise_references_business_layer", () => {
  it("should return reference messages for an exercise", async () => {
    const mockReferences = ["Exercise is part of a workout plan."];
    const exerciseId = 1;
    exercise_bank.check_exercise_references_data_layer.mockResolvedValue(
      mockReferences
    );
    const references = await check_exercise_references_business_layer(
      exerciseId
    );
    expect(references).toEqual(mockReferences);
    expect(
      exercise_bank.check_exercise_references_data_layer
    ).toHaveBeenCalledWith(exerciseId);
  });
});

describe('update_exercise_business_layer', () => {
  // Mock data
  const validExerciseData = {
    exercise_id: 1,
    name: "Updated Exercise",
    description: "Updated Description",
    difficulty: 2,
    video_link: "http://example.com/video",
    equipment_items: [{ value: "Dumbbell" }],
    muscle_groups: [{ value: "Arms" }],
    goal_id: 1,
    user_who_created_it: 1,
    active: "true"
  };

  const invalidExerciseData = { ...validExerciseData, name: '' }; // Invalid due to empty name

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('successfully updates an exercise', async () => {
    exercise_bank.update_exercise_data_layer.mockResolvedValue('Exercise updated successfully');
    user_info.get_role.mockResolvedValue('admin'); // Assuming the user is an admin or valid role
    const result = await update_exercise_business_layer(validExerciseData);
    expect(result).toEqual('Exercise updated successfully');
    expect(exercise_bank.update_exercise_data_layer).toHaveBeenCalledWith(validExerciseData);
  });

  it('fails to update an exercise with invalid data', async () => {
    await expect(update_exercise_business_layer(invalidExerciseData)).rejects.toThrow('`name` must not be blank');
  });

  it('handles an error from the data layer', async () => {
    const errorMessage = 'Error updating exercise';
    exercise_bank.update_exercise_data_layer.mockRejectedValue(new Error(errorMessage));
    user_info.get_role.mockResolvedValue('admin'); // Assuming the user is an admin or valid role
    await expect(update_exercise_business_layer(validExerciseData)).rejects.toThrow(errorMessage);
  });
});

describe('delete_exercise_business_layer', () => {
  // Mock data
  const validExerciseId = 1;
  const invalidExerciseId = 999; // Assuming this ID doesn't exist

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('successfully deletes an exercise', async () => {
    exercise_bank.delete_exercise_data_layer.mockResolvedValue('Exercise deleted successfully');
    exercise_bank.get_exercise_by_id_data_layer.mockResolvedValue({ id: validExerciseId, name: "Exercise" });
    const result = await delete_exercise_business_layer(validExerciseId);
    expect(result).toEqual('Exercise deleted successfully');
    expect(exercise_bank.delete_exercise_data_layer).toHaveBeenCalledWith(validExerciseId);
  });

  it('fails to delete a non-existent exercise', async () => {
    exercise_bank.get_exercise_by_id_data_layer.mockResolvedValue(null);
    await expect(delete_exercise_business_layer(invalidExerciseId)).rejects.toThrow(`No exercise with ID ${invalidExerciseId} exists`);
  });

  it('handles an error from the data layer', async () => {
    const errorMessage = 'Error deleting exercise';
    exercise_bank.delete_exercise_data_layer.mockRejectedValue(new Error(errorMessage));
    exercise_bank.get_exercise_by_id_data_layer.mockResolvedValue({ id: validExerciseId, name: "Exercise" });
    await expect(delete_exercise_business_layer(validExerciseId)).rejects.toThrow(errorMessage);
  });
});


describe('add_exercise_business_layer', () => {
  // Mock data
  const validExerciseData = {
    name: "New Exercise",
    description: "New Description",
    difficulty: 2,
    video_link: "http://example.com/video",
    equipment_items: [{ value: "Dumbbell" }],
    muscle_groups: [{ value: "Arms" }],
    goal_id: 1,
    user_who_created_it: 1
  };

  const invalidExerciseData = { ...validExerciseData, name: '' }; // Invalid due to empty name

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('successfully adds a new exercise', async () => {
    exercise_bank.add_exercise_data_layer.mockResolvedValue('Exercise added successfully');
    user_info.get_role.mockResolvedValue('admin'); // Assuming the user is an admin or valid role
    const result = await add_exercise_business_layer(validExerciseData);
    expect(result).toEqual('Exercise added successfully');
    expect(exercise_bank.add_exercise_data_layer).toHaveBeenCalledWith(validExerciseData);
  });

  it('fails to add a new exercise with invalid data', async () => {
    await expect(add_exercise_business_layer(invalidExerciseData)).rejects.toThrow('`name` must not be blank');
  });

  it('handles an error from the data layer', async () => {
    const errorMessage = 'Error adding exercise';
    exercise_bank.add_exercise_data_layer.mockRejectedValue(new Error(errorMessage));
    user_info.get_role.mockResolvedValue('admin'); // Assuming the user is an admin or valid role
    await expect(add_exercise_business_layer(validExerciseData)).rejects.toThrow(errorMessage);
  });
});

describe('get_all_equipment_business_layer', () => {
  // Mock data
  const mockEquipmentData = [
    { id: 1, name: "Dumbbell" },
    { id: 2, name: "Barbell" }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('retrieves all equipment', async () => {
    exercise_bank.get_all_equipment_data_layer.mockResolvedValue(mockEquipmentData);
    const equipment = await get_all_equipment_business_layer();
    expect(equipment).toEqual(mockEquipmentData);
    expect(exercise_bank.get_all_equipment_data_layer).toHaveBeenCalled();
  });

  it('handles an error from the data layer', async () => {
    const errorMessage = 'Error fetching equipment data';
    exercise_bank.get_all_equipment_data_layer.mockRejectedValue(new Error(errorMessage));
    await expect(get_all_equipment_business_layer()).rejects.toThrow(errorMessage);
  });
});