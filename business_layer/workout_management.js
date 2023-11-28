const login = require("../data_layer/login");
const registration = require("../data_layer/registration");
const user_info = require("../data_layer/user_info");
const coach_search = require("../data_layer/coach_search");
const daily_survey = require("../data_layer/daily_survey");
const client_coach_interaction = require("../data_layer/client_coach_interaction");
const messaging = require("../data_layer/messaging");
const workout_management = require("../data_layer/workout_management");


async function create_workout_plan(wp_request) {
    try {
        _validate_create_workout_plan_request(wp_request)
    } catch (e) {
        e.code = 400;
        throw e;
    }

    const wp = new workout_management.WorkoutPlan({
        workout_plan_id: 0,
        name: wp_request.name,
        author_id: wp_request.author_id,
    });

    try {
        return workout_management.create_workout_plan(wp);
    } catch (e) {
        e.code = 500;
        throw e;
    }
}

async function create_workout_plan_exercise(user_id, wpe_request) {
    try {
        _validate_create_workout_plan_exercise_request(wpe_request);
    } catch (e) {
        e.code = 400;
        throw e;
    }

    const wpe = new workout_management.WorkoutPlanExercise(wpe_request);
    const wp = await workout_management.get_workout_by_id(wpe.workout_plan_id);
    if (wp === null) {
        const error = new Error(`Workout plan with id ${wpe.workout_plan_id} does not exist`);
        error.code = 400;
        throw error;
    } else if (wp.author_id !== user_id) {
        const error = new Error(`User unauthorized to create exercise for workout plan with id ${wp.workout_plan_id} because they don't own the workout plan`);
        error.code = 403;
        throw error;
    }

    return workout_management.create_workout_exercise(wpe);
}


// TODO: Clean up and refactor
// TODO: Validate exercises property
function _validate_create_workout_plan_request(wp_request) {
    if (typeof wp_request.name !== "string") {
        throw new Error("Workout plan name must be a string");
    }
    if (!Number.isInteger(wp_request.author_id)) {
        throw new Error("Workout plan author_id must be an integer");
    }
    if (wp_request.exercises != null) {
        throw new Error("Inserting Workout plan exercises not supported yet");
    }
}


// TODO: Clean up and refactor
// TODO: Validate exercises property
function _validate_create_workout_plan_exercise_request(wpe_request) {
    const weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const time_regex = /^((0[0-9])|(1[0-2]))(:[0-5][0-9]){2}$/;
    if (!weekdays.includes(wpe_request.weekday)) {
        throw new Error("Workout plan exercise `weekday` must be one of the days of the week");
    }
    if (!time_regex.test(wpe_request.time)) {
        throw new Error("Workout plan exercise `time` must be of form 00:00:00");
    }
    if (!Number.isInteger(wpe_request.workout_plan_id)) {
        throw new Error("Workout plan exercise `workout_plan_id` must be an integer");
    }
    if (!Number.isInteger(wpe_request.exercise_id)) {
        throw new Error("Workout plan exercise `exercise_id` must be an integer");
    }
    if (wpe_request.reps_per_set !== null && !Number.isInteger(wpe_request.reps_per_set)) {
        throw new Error("Workout plan exercise `reps_per_set` must be an integer or null");
    }
    if (wpe_request.num_sets !== null && !Number.isInteger(wpe_request.num_sets)) {
        throw new Error("Workout plan exercise `num_sets` must be an integer or null");
    }
    if (wpe_request.weight !== null && !Number.isInteger(wpe_request.weight)) {
        throw new Error("Workout plan exercise `weight` must be an integer or null");
    }
}


module.exports = {
    create_workout_plan,
    create_workout_plan_exercise
};

const con = require("../data_layer/conn").con;
const testing = async () => {
    const wpe_request = {
        workout_plan_id: 25,
        exercise_id: 37,
        weekday: "tuesday",
        time: "10:45:00",
        reps_per_set: null,
        num_sets: null,
        weight: null
    };

    const wp = await create_workout_plan_exercise(1, wpe_request);
    console.log(wp);
};
testing().then(() => console.log("Done!")).catch((e) => {
    console.log(`Error code: ${e.code ?? 500}`);
    console.log(`Error message: ${e.message}`);
}).finally(() => con.end());
