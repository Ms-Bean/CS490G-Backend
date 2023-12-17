// const goals = require('../data_layer/goals');
const workout_progress_data_layer = require('../data_layer/workout_progress');
const workout_progress_business_layer = require('../business_layer/workout_progress');
const workout_management_dependency = require("../data_layer/workout_management");
const sinon = require('sinon');
const mysql = require("mysql");
const conn = require("../data_layer/conn");

jest.mock('../data_layer/conn', () => {
    return {
      con: {
        query: jest.fn(),
      },
    };
  });

const Workout_Progress_Payload = {
    user_id : 1,
    workout_exercise_id : 221,
    set_number : 2,
    date : "2023-12-19",
    weight: 45,
    reps: 3,
}
  
describe('workout_progress', () => {
  beforeEach(() => {
  });
  afterEach(function () {
    sinon.restore();
  });

    describe("Insert workout progress business layer", () => {
        it("should insert workout progress", async () => {
            //Arrange
            sinon.stub(workout_management_dependency, "get_workout_exercise_by_id").returns(Promise.resolve({
                id : 221,
                workout_plan_id : 7,
                exercise_id : 26,
                weekday : "tuesday",
                time : "10:00:00",
                reps_per_set : 11,
                num_sets : 5,
                weight : 31
            }));
            sinon.stub(workout_progress_data_layer, "create").returns(Promise.resolve("success"));
            //Act
            const result = await workout_progress_business_layer.create_workout_progress(1, Workout_Progress_Payload);
            //Assert
            expect(result).toBe("success");
        })
    })

    describe("Create workout progress data layer", function(){
        it("should give us the result from the db query'", async function () {
            // Arrange
            sinon.stub(conn.con, 'query').yields(null,[Workout_Progress_Payload]);
            // Act
            let result;
            result = await workout_progress_data_layer.create(Workout_Progress_Payload);
            //Assert
            expect(result).toEqual(Workout_Progress_Payload);
        });
      });
});
