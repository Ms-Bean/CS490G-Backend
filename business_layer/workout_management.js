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

    try {
        await workout_management.create_workout_plan(wp_request.author_id, wp_request.name);
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

    const {workout_plan_id, exercise_id} = wpe_request;
    const workout_plan = await workout_management.get_workout_by_id(workout_plan_id);
    if (workout_plan === null) {
        const error = new Error(`Workout plan with id ${workout_plan_id} does not exist`);
        error.code = 400;
        throw error;
    } else if (workout_plan.author_id !== user_id) {
        const error = new Error(`User unauthorized to create exercise for workout plan with id ${workout_plan_id} because they don't own the workout plan`);
        error.code = 403;
        throw error;
    }

    const details = {
        weekday: wpe_request.weekday,
        time: wpe_request.time,
        reps_per_set: wpe_request.reps_per_set,
        num_sets: wpe_request.num_sets,
        weight: wpe_request.weight
    };

    await workout_management.create_workout_exercise(workout_plan_id, exercise_id, details);
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
    if (typeof wpe_request.name !== "string") {
        throw new Error("Workout plan exercise `name` must be a string");
    }
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
    if (!Number.isInteger(wpe_request.reps_per_set) || wpe_request.reps_per_set !== null) {
        throw new Error("Workout plan exercise `reps_per_set` must be an integer or null");
    }
    if (!Number.isInteger(wpe_request.num_sets) || wpe_request.num_sets !== null) {
        throw new Error("Workout plan exercise `num_sets` must be an integer or null");
    }
    if (!Number.isInteger(wpe_request.weight) || wpe_request.num_sets !== null) {
        throw new Error("Workout plan exercise `weight` must be an integer or null");
    }
}


module.exports = {
    create_workout_plan
};

const con = require("../data_layer/conn").con;
const testing = async () => {
    const workout_plan = {
        name: "New Workout 2",
        author_id: "F"
    };
    await create_workout_plan(workout_plan);
};
// testing().then(() => console.log("Done!")).catch((e) => {
//     console.log(`Error code: ${e.code}`);
//     console.log(`Error message: ${e.message}`);
// }).finally(() => con.end());
