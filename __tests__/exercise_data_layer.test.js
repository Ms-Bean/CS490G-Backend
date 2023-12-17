const { get_all_exercises_data_layer } = require("../data_layer/exercise");
const connection = require("../data_layer/conn");

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

describe("get_all_exercises_data_layer", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should correctly process and return data", async () => {
    const mockData = [
      {
        exercise_id: 1,
        name: "Test Exercise",
        difficulty: "Medium",
        goal_name: "Build Muscle",
        muscle_groups: JSON.stringify(["Arms", "Chest"]),
        equipment_items: JSON.stringify(["Dumbbells", "Bench"]),
      },
    ];
    connection.con.query.mockImplementation((sql, callback) => {
      callback(null, mockData);
    });
    const result = await get_all_exercises_data_layer();
    expect(result).toEqual([
      {
        exercise_id: 1,
        name: "Test Exercise",
        difficulty: "Medium",
        goal_name: "Build Muscle",
        muscle_groups: ["Arms", "Chest"],
        equipment_items: ["Dumbbells", "Bench"],
      },
    ]);
  });
  it("should throw an error when query fails", async () => {
    connection.con.query.mockImplementation((sql, callback) => {
      callback(new Error("Query failed"), null);
    });
    await expect(get_all_exercises_data_layer()).rejects.toThrow(
      "Failed to retrieve exercises data from the database."
    );
  });
});

const { get_exercise_by_id_data_layer } = require("../data_layer/exercise");
describe("get_exercise_by_id_data_layer", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should return exercise data for a valid exercise ID", async () => {
    const mockData = [
      {
        exercise_id: 1,
        name: "Test Exercise",
        difficulty: "Medium",
        goal_name: "Build Muscle",
        equipment_items: JSON.stringify([]),
        muscle_groups: JSON.stringify(["Arms"]),
      },
    ];
    connection.con.query.mockImplementation((sql, values, callback) => {
      expect(values).toEqual([1]);
      callback(null, mockData);
    });
    const result = await get_exercise_by_id_data_layer(1);
    expect(result).toEqual({
      exercise_id: 1,
      name: "Test Exercise",
      difficulty: "Medium",
      goal_name: "Build Muscle",
      equipment_items: "[]",
      muscle_groups: '["Arms"]',
    });
  });
  it("should return null for a non-existing exercise ID", async () => {
    connection.con.query.mockImplementation((sql, values, callback) => {
      expect(values).toEqual([999]);
      callback(null, []);
      s;
    });
    const result = await get_exercise_by_id_data_layer(999);
    expect(result).toBeNull();
  });
  it("should throw an error when query fails", async () => {
    connection.con.query.mockImplementation((sql, values, callback) => {
      callback(new Error("Query failed"), null);
    });
    await expect(get_exercise_by_id_data_layer(1)).rejects.toThrow(
      "Failed to retrieve exercise from the database."
    );
  });
});

const { update_exercise_data_layer } = require("../data_layer/exercise");
describe("update_exercise_data_layer", () => {
  const mockExerciseData = {
    exercise_id: 1,
    name: "Updated Exercise",
    description: "Updated Description",
    user_who_created_it: "User1",
    difficulty: "Hard",
    video_link: "http://example.com/video",
    goal_id: 2,
    thumbnail: "http://example.com/thumbnail",
    equipment_items: [{ value: "New Equipment" }],
    muscle_groups: [{ value: "New Muscle Group" }],
    active: 1,
  };
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should successfully update an exercise", async () => {
    connection.con.beginTransaction.mockImplementation((cb) => cb(null));
    connection.con.query.mockImplementation((sql, values, cb) => cb(null));
    connection.con.commit.mockImplementation((cb) => cb(null));
    await expect(
      update_exercise_data_layer(mockExerciseData)
    ).resolves.not.toThrow();
    await update_exercise_data_layer(mockExerciseData);
    expect(connection.con.beginTransaction).toHaveBeenCalled();
    expect(connection.con.query).toHaveBeenCalled();
    expect(connection.con.commit).toHaveBeenCalled();
  });
  it("should rollback and throw an error if the update fails", async () => {
    connection.con.beginTransaction.mockImplementation((cb) => cb(null));
    connection.con.query.mockImplementation((sql, values, cb) => {
      if (sql.includes("UPDATE Exercise_Bank")) {
        cb(new Error("Update failed"));
      } else {
        cb(null);
      }
    });
    connection.con.rollback.mockImplementation((cb) => cb(null));
    await expect(
      update_exercise_data_layer(mockExerciseData)
    ).rejects.toThrow();
    expect(connection.con.rollback).toHaveBeenCalled();
    try {
      await update_exercise_data_layer(mockExerciseData);
    } catch (e) {}
    expect(connection.con.beginTransaction).toHaveBeenCalled();
    expect(connection.con.query).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.any(Function)
    );
    expect(connection.con.rollback).toHaveBeenCalled();
  });
});

const { delete_exercise_data_layer } = require("../data_layer/exercise");
describe("delete_exercise_data_layer", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should successfully deactivate an exercise", async () => {
    connection.con.query.mockImplementation((sql, values, callback) => {
      expect(values).toEqual([1]);
      callback(null, { affectedRows: 1 });
    });
    await expect(delete_exercise_data_layer(1)).resolves.toBe(
      "Exercise deactivated successfully."
    );
  });
  it("should throw an error when query fails", async () => {
    connection.con.query.mockImplementation((sql, values, callback) => {
      callback(new Error("Query failed"), null);
    });
    await expect(delete_exercise_data_layer(1)).rejects.toThrow(
      "Failed to deactivate exercise in the database."
    );
  });
});

const { add_exercise_data_layer } = require("../data_layer/exercise");
describe("add_exercise_data_layer", () => {
  const mockExerciseData = {
    name: "New Exercise",
    description: "Exercise Description",
    user_who_created_it: "User1",
    difficulty: "Medium",
    video_link: "http://example.com/video",
    goal_id: 1,
    thumbnail: "http://example.com/thumbnail",
    equipmentItems: ["Dumbbell"],
    muscleGroups: ["Arms"],
  };
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should successfully add a new exercise", async () => {
    connection.con.beginTransaction.mockImplementation((cb) => cb(null));
    connection.con.query.mockImplementation((sql, values, cb) =>
      cb(null, { insertId: 1 })
    );
    connection.con.commit.mockImplementation((cb) => cb(null));
    await expect(
      add_exercise_data_layer(mockExerciseData)
    ).resolves.not.toThrow();
    expect(connection.con.beginTransaction).toHaveBeenCalled();
    expect(connection.con.query).toHaveBeenCalled();
    expect(connection.con.commit).toHaveBeenCalled();
  });
  it("should rollback and throw an error if exercise insertion fails", async () => {
    connection.con.beginTransaction.mockImplementation((cb) => cb(null));
    connection.con.query.mockImplementation((sql, values, cb) => {
      if (sql.includes("INSERT INTO Exercise_Bank")) {
        cb(new Error("Insertion failed"));
      } else {
        cb(null, { insertId: 1 });
      }
    });
    connection.con.rollback.mockImplementation((cb) => cb(null));
    await expect(add_exercise_data_layer(mockExerciseData)).rejects.toThrow();
    expect(connection.con.rollback).toHaveBeenCalled();
  });
});

const { get_all_muscle_groups_data_layer } = require("../data_layer/exercise");
describe("get_all_muscle_groups_data_layer", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should return a list of muscle groups", async () => {
    const mockResults = [{ muscle_group: "Arms" }, { muscle_group: "Legs" }];
    connection.con.query.mockImplementation((sql, callback) => {
      callback(null, mockResults);
    });
    const result = await get_all_muscle_groups_data_layer();
    expect(result).toEqual([{ Arms: "Arms" }, { Legs: "Legs" }]);
  });
  it("should throw an error when query fails", async () => {
    connection.con.query.mockImplementation((sql, callback) => {
      callback(new Error("Query failed"), null);
    });
    await expect(get_all_muscle_groups_data_layer()).rejects.toThrow(
      "Failed to retrieve muscle groups from the database."
    );
  });
});

const { get_all_equipment_data_layer } = require("../data_layer/exercise");
describe("get_all_equipment_data_layer", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should return a list of equipment items", async () => {
    const mockResults = [
      { equipment_item: "Dumbbells" },
      { equipment_item: "Barbell" },
    ];
    connection.con.query.mockImplementation((sql, callback) => {
      callback(null, mockResults);
    });
    const result = await get_all_equipment_data_layer();
    expect(result).toEqual([
      { Dumbbells: "Dumbbells" },
      { Barbell: "Barbell" },
    ]);
  });
  it("should throw an error when query fails", async () => {
    connection.con.query.mockImplementation((sql, callback) => {
      callback(new Error("Query failed"), null);
    });
    await expect(get_all_equipment_data_layer()).rejects.toThrow(
      "Failed to retrieve equipment from the database."
    );
  });
});
