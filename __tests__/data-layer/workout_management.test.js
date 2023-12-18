const connection = require("../../data_layer/conn.js");
const { assign_workout_plan, create_workout_plan, get_workouts_by_author, get_workout_by_id,_get_workouts } = require("../../data_layer/workout_management.js"); // Replace "yourFileName" with the actual filename

// Mock the connection and query function
jest.mock("../../data_layer/conn.js");

jest.mock("../../data_layer/workout_management.js", () => ({
    ...jest.requireActual("../../data_layer/workout_management.js"),
    get_workout_by_id: jest.fn(),
  }));

describe("Workout Plan Functions", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("assign_workout_plan", () => {
    test("should assign workout plan successfully", async () => {
      const user_id = 1;
      const workout_plan_id = 2;

      const mockResults = { insertId: 123 };
      connection.con.query.mockImplementation((sql, values, callback) => {
        callback(null, mockResults);
      });

      await expect(assign_workout_plan(user_id, workout_plan_id)).resolves.toBe(
        "success"
      );

      expect(connection.con.query).toHaveBeenCalledWith(
        "INSERT INTO User_Workout_Plan (user_id, workout_plan_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE workout_plan_id = ?",
        [user_id, workout_plan_id, workout_plan_id],
        expect.any(Function)
      );
    });

    test("should reject on database error", async () => {
      const user_id = 1;
      const workout_plan_id = 2;

      const errorMessage = "Database error";
      connection.con.query.mockImplementation((sql, values, callback) => {
        callback(new Error(errorMessage));
      });

      await expect(assign_workout_plan(user_id, workout_plan_id)).rejects.toThrow(
        errorMessage
      );

      expect(connection.con.query).toHaveBeenCalledWith(
        "INSERT INTO User_Workout_Plan (user_id, workout_plan_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE workout_plan_id = ?",
        [user_id, workout_plan_id, workout_plan_id],
        expect.any(Function)
      );
    });
  });

  describe("create_workout_plan", () => {
    test("should create workout plan successfully", async () => {
      const mockResults = { insertId: 456 };
      connection.con.query.mockImplementation((sql, values, callback) => {
        callback(null, mockResults);
      });

      const wp = { name: "Test Plan", author_id: 1 };
      const result = await create_workout_plan(wp);

      expect(result).toEqual(
        expect.objectContaining({
          workout_plan_id: mockResults.insertId,
          name: wp.name,
          author_id: wp.author_id,
        })
      );

      expect(connection.con.query).toHaveBeenCalledWith(
        "INSERT INTO Workout_Plans (name, user_who_created_it) VALUES (?, ?)",
        [wp.name, wp.author_id],
        expect.any(Function)
      );
    });

    test("should reject on database error", async () => {
      const errorMessage = "Database error";
      connection.con.query.mockImplementation((sql, values, callback) => {
        callback(new Error(errorMessage));
      });

      const wp = { name: "Test Plan", author_id: 1 };
      await expect(create_workout_plan(wp)).rejects.toThrow(errorMessage);

      expect(connection.con.query).toHaveBeenCalledWith(
        "INSERT INTO Workout_Plans (name, user_who_created_it) VALUES (?, ?)",
        [wp.name, wp.author_id],
        expect.any(Function)
      );
    });
  });
  describe("_get_workouts", () => {
    test("should resolve with workout plans on successful query", async () => {
      const mockResults = [
        { workout_plan_id: 1, name: "Plan 1" },
        { workout_plan_id: 2, name: "Plan 2" },
      ];

      // Mock the connection.query function to return mockResults
      connection.con.query.mockImplementation((sql, values, callback) => {
        callback(null, mockResults);
      });

      // Define SQL query and parameters
      const sql = "SELECT * FROM Workout_Plans";
      const params = [];

      // Call the _get_workouts function
      const result = await expect(_get_workouts(sql, params)).resolves.toEqual(
        mockResults.map((r) => expect.objectContaining(r))
      );

      // Verify that connection.con.query was called with the correct parameters
      expect(connection.con.query).toHaveBeenCalledWith(
        sql,
        params,
        expect.any(Function)
      );
    });

    test("should reject on database error", async () => {
      const errorMessage = "Database error";

      // Mock the connection.query function to throw an error
      connection.con.query.mockImplementation((sql, values, callback) => {
        callback(new Error(errorMessage));
      });

      // Define SQL query and parameters
      const sql = "SELECT * FROM Workout_Plans";
      const params = [];

      // Call the _get_workouts function and expect it to reject with an error message
      await expect(_get_workouts(sql, params)).rejects.toThrow(errorMessage);

      // Verify that connection.con.query was called with the correct parameters
      expect(connection.con.query).toHaveBeenCalledWith(
        sql,
        params,
        expect.any(Function)
      );
    });
  });
});
