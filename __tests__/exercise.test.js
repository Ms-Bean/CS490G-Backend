const sinon = require('sinon');
const conn = require("../data_layer/conn");
const exercise_data_layer = require("../data_layer/exercise");
const exercise_business_layer = require("../business_layer/exercise");
const user_info_data_layer = require("../data_layer/user_info");
const goals_data_layer = require("../data_layer/goals");
describe('exercise', () => {
  beforeEach(() => {
  });
  afterEach(function () {
    sinon.restore();
  });

  describe("get_all_exercises_business_layer", function () {
    it("shold get a response from the data layer", async function () {
        sinon.stub(exercise_data_layer, "get_all_exercises_data_layer").returns(Promise.resolve("test"))
        result = await exercise_business_layer.get_all_exercises_business_layer();
        expect(result).toEqual("test");
    });
  });
  describe("get_exercise_by_id_business_layer", function () {
    it("shold get an exercise by id from the data layer", async function () {
        sinon.stub(exercise_data_layer, "get_exercise_by_id_data_layer").returns(Promise.resolve("test"))
        result = await exercise_business_layer.get_exercise_by_id_business_layer(5);
        expect(result).toEqual("test");
    });
  });
  describe("get_all_equipment_business_layer", function () {
    it("shold get a response from the data layer", async function () {
        sinon.stub(exercise_data_layer, "get_all_equipment_data_layer").returns(Promise.resolve("test"))
        result = await exercise_business_layer.get_all_equipment_business_layer();
        expect(result).toEqual("test");
    });
  });
  describe("get_all_muscle_groups_business_layer", function () {
    it("shold get a response from the data layer", async function () {
        sinon.stub(exercise_data_layer, "get_all_muscle_groups_data_layer").returns(Promise.resolve("test"))
        result = await exercise_business_layer.get_all_muscle_groups_business_layer();
        expect(result).toEqual("test");
    });
  });
  describe("check_exercise_references_business_layer", function () {
    it("shold get a response from the data layer", async function () {
        sinon.stub(exercise_data_layer, "check_exercise_references_data_layer").returns(Promise.resolve("test"))
        result = await exercise_business_layer.check_exercise_references_business_layer(2);
        expect(result).toEqual("test");
    });
  });

  describe("_validate_update_exercise_request", function () {
    it("should validate the update exercises request", async function () {
        sinon.stub(user_info_data_layer, "get_role").returns(Promise.resolve())
        sinon.stub(goals_data_layer, "goal_name_by_id_data_layer").returns(Promise.resolve("strong"));
        sinon.stub(exercise_data_layer, "get_exercise_by_id_data_layer").returns([1]);
        result = await exercise_business_layer._validate_update_exercise_request({
            name: "exercise",
            description: "an exercise",
            difficulty: "2",
            active: 1,
            video_link: "http://thing.org",
            equipment_items: ["Barbells"],
            muscle_groups: ["Barbells"],
            goal_id: 4,
            user_who_created_it: 5,
            exercise_id: 5
        });
        expect(result).toEqual(null);
    });
  });
  describe("_validate_add_exercise_request", function () {
    it("should validate the add exercises request", async function () {
        sinon.stub(user_info_data_layer, "get_role").returns(Promise.resolve())
        sinon.stub(goals_data_layer, "goal_name_by_id_data_layer").returns(Promise.resolve("strong"));
        sinon.stub(exercise_data_layer, "get_exercise_by_id_data_layer").returns([1]);
        result = await exercise_business_layer._validate_add_exercise_request({
            name: "exercise",
            description: "an exercise",
            difficulty: "2",
            video_link: "http://thing.org",
            equipment_items: ["Barbells"],
            muscle_groups: ["Barbells"],
            goal_id: 4,
            user_who_created_it: 5
        });
        expect(result).toEqual(null);
    });
  });
  describe("get_all_exercises_data_layer", function () {
    it("should fetch all exercises", async function () {
        sinon.stub(conn.con, "query").yields(null, [{muscle_groups: JSON.stringify({group: 'deltoids'}), equipment_items: JSON.stringify({group: 'shoes'})}]);
        result = await exercise_data_layer.get_all_exercises_data_layer();
        expect(result).toStrictEqual([{"equipment_items": {"group": "shoes"}, "muscle_groups": {"group": "deltoids"}}]);
    });
  });
  describe("get_all_exercises_data_layer failure", function () {
    it("should fail to fetch all exercises", async function () {
        sinon.stub(conn.con, "query").yields("err", null);
        try
        {
            result = await exercise_data_layer.get_all_exercises_data_layer();
            expect(1).toBe(2);
        }
        catch(err)
        {
            expect(err.message).toBe("Failed to retrieve exercises data from the database.");
        }
    });
  });
  describe("get_exercise_by_id_data_layer", function () {
    it("should fetch a single exercise", async function () {
        sinon.stub(conn.con, "query").yields(null, ["test"]);
        result = await exercise_data_layer.get_exercise_by_id_data_layer(5);
        expect(result).toBe("test");
    });
  });
  describe("get_exercise_by_id_data_layer failure", function () {
    it("should fail to fetch a single exercise", async function () {
        sinon.stub(conn.con, "query").yields("err", null);
        try
        {
            result = await exercise_data_layer.get_exercise_by_id_data_layer(5);
            expect(1).toBe(2);
        }
        catch(err)
        {
            expect(err.message).toBe("Failed to retrieve exercise from the database.");
        }
    });
  });
  describe("update_exercise_data_layer", function(){
    it("should update an exercise", async function(){
        sinon.stub(conn.con, "beginTransaction").yields(null);
        sinon.stub(conn.con, "commit").yields(null);
        sinon.stub(conn.con, "rollback").yields();
        sinon.stub(conn.con, "query").yields(null, "")
        result = await exercise_data_layer.update_exercise_data_layer({
            exercise_id: 2,
            name: "exercise",
            description: "description",
            user_who_created_it: 5,
            difficulty: 3,
            video_link: "http://google.com",
            goal_id: 3,
            thumbnail: "image.jpg",
            equipment_items: ['a', 'b', 'c'],
            muscle_groups: ['d', 'e', 'f'],
            active: 1
        });

    })
  });
});