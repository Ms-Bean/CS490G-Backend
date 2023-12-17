const sinon = require('sinon');
const conn = require("../data_layer/conn");
const Workout_Progress = require("../data_layer/workout_progress");
const workout_progress_data_layer = require("../data_layer/workout_progress");
const workout_progress_business_layer = require("../business_layer/workout_progress");
const workout_management_data_layer = require("../data_layer/workout_management");
const workout_management_business_layer = require("../business_layer/workout_management");
const user_info_data_layer = require("../data_layer/user_info");
const goals_data_layer = require("../data_layer/goals");
describe('exercise', () => {
  beforeEach(() => {
  });
  afterEach(function () {
    sinon.restore();
  });

  describe("create_workout_progress business layer", function () {
    it("should log progress", async function () {
        sinon.stub(workout_management_data_layer, "get_workout_exercise_by_id").returns({weekday: "sunday"})
        sinon.stub(Workout_Progress, "create").returns(Promise.resolve("test"))
        result = await workout_progress_business_layer.create_workout_progress(3,{
            user_id: 3,
            workout_exercise_id: 4,
            date: "2023-12-17",
            set_number: 1,
            weight: 1,
            reps: 1
        });
        expect(result).toEqual("test");
    });
  });
  describe("create_workout_progress business layer fail 1", function () {
    it("should fail progress", async function () {
        sinon.stub(workout_management_data_layer, "get_workout_exercise_by_id").returns({weekday: "sunday"})
        sinon.stub(Workout_Progress, "create").returns(Promise.resolve("test"))
        try
        {
            result = await workout_progress_business_layer.create_workout_progress(3,{
                user_id: "5",
                workout_exercise_id: 4,
                date: "2023-12-17",
                set_number: 1,
                weight: 1,
                reps: 1
            });
            expect(1).toBe(0);
        }
        catch(err)
        {
            expect(err.message).toBe("user id must be an integer");
        }
    });
  });
  describe("create_workout_progress business layer fail 2", function () {
    it("should fail progress", async function () {
        sinon.stub(workout_management_data_layer, "get_workout_exercise_by_id").returns({weekday: "sunday"})
        sinon.stub(Workout_Progress, "create").returns(Promise.resolve("test"))
        try
        {
            result = await workout_progress_business_layer.create_workout_progress(3,{
                user_id: 5,
                workout_exercise_id: "a",
                date: "2023-12-17",
                set_number: 1,
                weight: 1,
                reps: 1
            });
            expect(1).toBe(0);
        }
        catch(err)
        {
            expect(err.message).toBe("workout exercise id must be an integer");
        }
    });
  });
  describe("create_workout_progress business layer fail 3", function () {
    it("should fail progress", async function () {
        sinon.stub(workout_management_data_layer, "get_workout_exercise_by_id").returns({weekday: "sunday"})
        sinon.stub(Workout_Progress, "create").returns(Promise.resolve("test"))
        try
        {
            result = await workout_progress_business_layer.create_workout_progress(3,{
                user_id: 5,
                workout_exercise_id: 5,
                date: "2023-",
                set_number: 1,
                weight: 1,
                reps: 1
            });
            expect(1).toBe(0);
        }
        catch(err)
        {
            expect(err.message).toBe("date must be of form yyyy-mm-dd");
        }
    });
  });
  describe("create_workout_progress business layer fail 4", function () {
    it("should fail progress", async function () {
        sinon.stub(workout_management_data_layer, "get_workout_exercise_by_id").returns({weekday: "sunday"})
        sinon.stub(Workout_Progress, "create").returns(Promise.resolve("test"))
        try
        {
            result = await workout_progress_business_layer.create_workout_progress(3,{
                user_id: 5,
                workout_exercise_id: 5,
                date: "2023-12-17",
                set_number: "a",
                weight: 1,
                reps: 1
            });
            expect(1).toBe(0);
        }
        catch(err)
        {
            expect(err.message).toBe("set number must be an integer");
        }
    });
  });
  describe("create_workout_progress business layer fail 5", function () {
    it("should fail progress", async function () {
        sinon.stub(workout_management_data_layer, "get_workout_exercise_by_id").returns({weekday: "sunday"})
        sinon.stub(Workout_Progress, "create").returns(Promise.resolve("test"))
        try
        {
            result = await workout_progress_business_layer.create_workout_progress(3,{
                user_id: 5,
                workout_exercise_id: 5,
                date: "2023-12-17",
                set_number: 1,
                weight: "a",
                reps: 1
            });
            expect(1).toBe(0);
        }
        catch(err)
        {
            expect(err.message).toBe("Weight must be an integer");
        }
    });
  });
  describe("create_workout_progress business layer fail 6", function () {
    it("should fail progress", async function () {
        sinon.stub(workout_management_data_layer, "get_workout_exercise_by_id").returns({weekday: "sunday"})
        sinon.stub(Workout_Progress, "create").returns(Promise.resolve("test"))
        try
        {
            result = await workout_progress_business_layer.create_workout_progress(3,{
                user_id: 5,
                workout_exercise_id: 5,
                date: "2023-12-17",
                set_number: 1,
                weight: 1,
                reps: "a"
            });
            expect(1).toBe(0);
        }
        catch(err)
        {
            expect(err.message).toBe("reps must be an integer");
        }
    });
  });

  describe("create_workout_progress business layer fail 6", function () {
    it("should fail progress", async function () {
        sinon.stub(workout_management_data_layer, "get_workout_exercise_by_id").returns({weekday: "sunday"})
        sinon.stub(Workout_Progress, "create").returns(Promise.resolve("test"))
        try
        {
            result = await workout_progress_business_layer.create_workout_progress(3,{
                user_id: 5,
                workout_exercise_id: 5,
                date: "2023-12-17",
                set_number: 1,
                weight: 1,
                reps: "a"
            });
            expect(1).toBe(0);
        }
        catch(err)
        {
            expect(err.message).toBe("reps must be an integer");
        }
    });
  });

  describe("create_workout_progress data layer", function () {
    it("should fail progress", async function () {
        let stub = sinon.stub(conn.con, "query").onCall(0).yields(null, [{set_number: 3}]);
        stub.onCall(1).yields(null, {insertId: 3});
        let workout_progress = {
            user_id: 5,
            workout_exercise_id: 5,
            date: "2023-12-17",
            set_number: 1,
            weight: 1,
            reps: "a"
        };
        result = await Workout_Progress.create(workout_progress);
        expect(result["user_id"]).toBe(5);
        expect(result["workout_exercise_id"]).toBe(5);
        expect(result["date"]).toBe('2023-12-17');
    });
  });
  describe("getAll_workout_progress data layer", function () {
    it("should return null", async function () {
        sinon.stub(conn.con, "query").yields(null, []);
        result = await Workout_Progress.getAll();
        expect(result).toBe(null);
    });
  });
  describe("getAllByUserId_workout_progress data layer", function () {
    it("should return null", async function () {
        sinon.stub(conn.con, "query").yields(null, []);
        result = await Workout_Progress.getAllByUserId(4);
        expect(result).toBe(null);
    });
  });
  describe("getAllByUserId_workout_progress data layer failure", function () {
    it("should return err", async function () {
        sinon.stub(conn.con, "query").yields("err", null);
        try
        {
            result = await Workout_Progress.getAllByUserId(4);
            expect(1).toBe(0);
        }
        catch(err)
        {
            expect(err).toBe("err");
        }
    });
  });
  describe("getAll_workout_progress data layer failure", function () {
    it("should return err", async function () {
        sinon.stub(conn.con, "query").yields("err", null);
        try
        {
            result = await Workout_Progress.getAll();
            expect(1).toBe(0);
        }
        catch(err)
        {
            expect(err).toBe("err");
        }
    });
  });
  describe("getAllByUserIdAndExercise_workout_progress data layer", function () {
    it("should return null", async function () {
        sinon.stub(conn.con, "query").yields(null, []);
        result = await Workout_Progress.getAllByUserIdAndExercise();
        expect(result).toBe(null);
    });
  });
  describe("getAllByUserIdAndExercise_workout_progress data layer failure", function () {
    it("should return err", async function () {
        sinon.stub(conn.con, "query").yields("err", null);
        try
        {
            result = await Workout_Progress.getAllByUserIdAndExercise();
            expect(1).toBe(0);
        }
        catch(err)
        {
            expect(err).toBe("err");
        }
    });
  });
  describe("getByKeys data layer failure", function () {
    it("should return err", async function () {
        sinon.stub(conn.con, "query").yields("err", null);
        try
        {
            result = await Workout_Progress.getByKeys();
            expect(1).toBe(0);
        }
        catch(err)
        {
            expect(err).toBe("err");
        }
    });
  });
  describe("getByKeys data layer", function () {
    it("should return null", async function () {
        sinon.stub(conn.con, "query").yields(null, []);
        result = await Workout_Progress.getByKeys();
        expect(result).toBe(null);
    });
  });
  describe("workout_progress_update_data layer", function () {
    it("should return cats", async function () {
        let workout_progress = {
            user_id: 5,
            workout_exercise_id: 5,
            date: "2023-12-17",
            set_number: 1,
            weight: 1,
            reps: 1
        };
        sinon.stub(conn.con, "query").yields(null, "cats");
        result = await Workout_Progress.update(workout_progress);
        expect(result).toBe("cats");
    });
  });
  describe("workout_progress_update_data layer_failure", function () {
    it("should return err", async function () {
        let workout_progress = {
            user_id: 5,
            workout_exercise_id: 5,
            date: "2023-12-17",
            set_number: 1,
            weight: 1,
            reps: 1
        };
        sinon.stub(conn.con, "query").yields("err", null);
        try
        {
            result = await Workout_Progress.update(workout_progress);
            expect(1).toBe(0);
        }
        catch(err)
        {
            expect(err).toBe("err");
        }
    });
  });
  describe("workout_progress_deleteByKeys_data layer", function () {
    it("should  throw an error", async function () {
        sinon.stub(conn.con, "query").yields(null, {affectedRows: "cats"});
        try
        {
            result = await Workout_Progress.deleteByKeys(1, 2, 3, '11-27-2001');
            expect(1).toBe(0);
        }
        catch(err)
        {
        }
    });
  });
});