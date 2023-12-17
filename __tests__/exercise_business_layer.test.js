const connection = require("../data_layer/conn");
const exercise = require("../data_layer/exercise");
const exercise_bank = require("../data_layer/exercise");

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
