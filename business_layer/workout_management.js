const login = require("../data_layer/login");
const registration = require("../data_layer/registration");
const user_info = require("../data_layer/user_info");
const coach_search = require("../data_layer/coach_search");
const daily_survey = require("../data_layer/daily_survey");
const client_coach_interaction = require("../data_layer/client_coach_interaction");
const messaging = require("../data_layer/messaging");
const workout_management = require("../data_layer/workout_management");


class APIError extends Error {
    constructor(message, status_code) {
        super(message);
        this.status_code = status_code;
        this.name = APIError.name;
    }
}


async function create_workout_plan(wp_request) {
    _validate_create_workout_plan_request(wp_request);
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
    _validate_create_workout_plan_exercise_request(wpe_request);
    const wpe = new workout_management.WorkoutPlanExercise(wpe_request);
    const wp = await workout_management.get_workout_by_id(wpe.workout_plan_id);
    if (wp === null) {
        throw new APIError(`Workout plan with id ${wpe.workout_plan_id} does not exist`, 400);
    } else if (wp.author_id !== user_id) {
        throw new APIError(`User unauthorized to create exercise for workout plan with id ${wp.workout_plan_id} because they don't own the workout plan`, 403);
    }

    return workout_management.create_workout_exercise(wpe);
}


async function update_workout_plan(user_id, new_wp) {
    _validate_create_workout_plan_request(new_wp);
    const wp = await workout_management.get_workout_by_id(new_wp.workout_plan_id);
    if (wp === null) {
        throw new APIError(`Workout plan with id ${new_wp.workout_plan_id} does not exist`, 400);
    } else if (wp.author_id !== user_id) {
        throw new APIError(`User unauthorized to modify workout plan with id ${wp.workout_plan_id} because they don't own the workout plan`, 403);
    }

    return workout_management.update_workout_plan(new_wp);
}


async function update_workout_plan_exercise(user_id, wpe_request) {
    _validate_create_workout_plan_exercise_request(wpe_request);
    const wp = await workout_management.get_workout_by_id(wpe_request.workout_plan_id);
    const {workout_plan_id, workout_plan_exercise_id} = wpe_request;
    if (wp === null) {
        throw new APIError(`No workout plan with id ${workout_plan_id} exists`, 400);
    } else if (wp.author_id !== user_id) {
        throw new APIError(`User unauthorized to modify workout plan with id ${workout_plan_id} because they don't own the workout plan`, 403);
    }

    const wpe = (await workout_management.get_exercises_by_workout_id(workout_plan_id))
        .reduce((p, c) => c.workout_plan_exercise_id === workout_plan_exercise_id ? c : p, null);

    if (wpe === null) {
        throw new APIError(`Workout plan exercise with id ${workout_plan_exercise_id} doesn't exist under workout plan with id ${workout_plan_id}`, 400);
    }

    return workout_management.update_workout_exercise(wpe_request);
}


async function delete_workout_plan(user_id, wp_request) {
    _validate_create_workout_plan_request(wp_request);
    const {workout_plan_id} = wp_request;
    const wp = await workout_management.get_workout_by_id(workout_plan_id);
    if (wp === null) {
        throw new APIError(`No workout plan with id ${workout_plan_id} exists`, 400);
    } else if (wp.author_id !== user_id) {
        throw new APIError(`User unauthorized to modify workout plan with id ${workout_plan_id} because they don't own the workout plan`, 403);
    }

    await workout_management.delete_workout_plan(workout_plan_id);
}

async function delete_workout_plan_exercise(user_id, wpe_request) {
    _validate_create_workout_plan_exercise_request(wpe_request);
    const wp = await workout_management.get_workout_by_id(wpe_request.workout_plan_id);
    const {workout_plan_id, workout_plan_exercise_id} = wpe_request;
    if (wp === null) {
        throw new APIError(`No workout plan with id ${workout_plan_id} exists`, 400);
    } else if (wp.author_id !== user_id) {
        throw new APIError(`User unauthorized to modify workout plan with id ${workout_plan_id} because they don't own the workout plan`, 403);
    }

    const wpe = (await workout_management.get_exercises_by_workout_id(workout_plan_id))
        .reduce((p, c) => c.workout_plan_exercise_id === workout_plan_exercise_id ? c : p, null);

    if (wpe === null) {
        throw new APIError(`Workout plan exercise with id ${workout_plan_exercise_id} doesn't exist under workout plan with id ${workout_plan_id}`, 400);
    }

    await workout_management.delete_workout_exercise(workout_plan_exercise_id);
}

// TODO: Clean up and refactor
// TODO: Validate exercises property
function _validate_create_workout_plan_request(wp_request) {
    let message = "";
    if (typeof wp_request.name !== "string") {
        message = "Workout plan name must be a string";
    } else if (!Number.isInteger(wp_request.author_id)) {
        message = "Workout plan author_id must be an integer";
    } else if (wp_request.exercises != null) {
        message = "Inserting Workout plan exercises not supported yet";
    }

    if (message) {
        throw new APIError(message, 400);
    }
}


// TODO: Clean up and refactor
// TODO: Validate exercises property
function _validate_create_workout_plan_exercise_request(wpe_request) {
    let message = "";
    const weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const time_regex = /^(([0-1]\d)|(2[0-3]))(:[0-5]\d){2}$/;
    if (!weekdays.includes(wpe_request.weekday)) {
        message = "Workout plan exercise `weekday` must be one of the days of the week";
    } else if (!time_regex.test(wpe_request.time)) {
        message = "Workout plan exercise `time` must be of form 00:00:00";
    } else if (!Number.isInteger(wpe_request.workout_plan_id)) {
        message = "Workout plan exercise `workout_plan_id` must be an integer";
    } else if (!Number.isInteger(wpe_request.exercise_id)) {
        message = "Workout plan exercise `exercise_id` must be an integer";
    } else if (wpe_request.reps_per_set !== null && !Number.isInteger(wpe_request.reps_per_set)) {
        message = "Workout plan exercise `reps_per_set` must be an integer or null";
    } else if (wpe_request.num_sets !== null && !Number.isInteger(wpe_request.num_sets)) {
        message = "Workout plan exercise `num_sets` must be an integer or null";
    } else if (wpe_request.weight !== null && !Number.isInteger(wpe_request.weight)) {
        message = "Workout plan exercise `weight` must be an integer or null";
    }

    if (message) {
        throw new APIError(message, 400);
    }
}


module.exports = {
    create_workout_plan,
    create_workout_plan_exercise,
    update_workout_plan,
    update_workout_plan_exercise
};

const con = require("../data_layer/conn").con;
const testing = async () => {
    const wp_request = {
        workout_plan_id: 25,
        name: 'New Name for Second New Workout from Business Layer',
        author_id: 2
    };
    const wpe_request = {
        workout_plan_exercise_id: 287,
        workout_plan_id: 22,
        exercise_id: 36,
        weekday: "wednesday",
        time: "17:00:00",
        reps_per_set: 5,
        num_sets: 3,
        weight: 150
    }

    const wpe = await delete_workout_plan_exercise(2, wpe_request);
    console.log(wpe);
};
testing().then(() => console.log("Done!")).catch((e) => {
    console.log(`Error code: ${e.status_code ?? 500}`);
    console.log(`Error message: ${e.message}`);
}).finally(() => con.end());
