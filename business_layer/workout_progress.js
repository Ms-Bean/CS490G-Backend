const login = require("../data_layer/login");
const registration = require("../data_layer/registration");
const user_info = require("../data_layer/user_info");
const coach_search = require("../data_layer/coach_search");
const daily_survey = require("../data_layer/daily_survey");
const client_coach_interaction = require("../data_layer/client_coach_interaction");
const messaging = require("../data_layer/messaging");
const workout_management = require("../data_layer/workout_management");
const exercise = require("../data_layer/exercise");
const Workout_Progress = require("../data_layer/workout_progress");


class APIError extends Error {
    constructor(message, status_code) {
        super(message);
        this.status_code = status_code;
        this.name = APIError.name;
    }
}

async function create_workout_progress(userId, workout_progress_request) {
    console.log("workout_progress : " , workout_progress_request);
    _validate_workout_progress_request(workout_progress_request);

    //check if the exercise exists
    const wpe = await workout_management.get_workout_exercise_by_id(workout_progress_request.workout_exercise_id);
    if (wpe === null) {
        throw new APIError(`Workout exercise with id ${workout_progress_request.workout_plan_exercise_id} does not exist`, 400);
    }
    
    const {user_id, workout_exercise_id, set_number, date, weight, reps} = workout_progress_request;
    _validate_exercise_day(date, wpe.weekday);

    if (userId !== user_id) {
        throw new APIError(`User with ID ${user_id} cannot create workout progress on other's behalf`, 403);
    }
    const new_workout_progress = {
        user_id : user_id,
        workout_exercise_id : workout_exercise_id,
        set_number : set_number,
        date : date,
        weight : weight,
        reps : reps
    }

    return Workout_Progress.create(new_workout_progress);
}

// async function update_workout_progress(userId, workout_progress_request){
//     //_validate_workout_progress_request(workout_progress_request);

//     //check if the exercise exists
//     const wpe = await workout_management.get_workout_exercise_by_id(workout_progress_request.workout_exercise_id);
//     if (wpe === null) {
//         throw new APIError(`Workout exercise with id ${workout_progress_request.workout_plan_exercise_id} does not exist`, 400);
//     }

//     return Workout_Progress.update(workout_progress_request);
// }

// async function get_workout_progress_by_user_id({userId}) {
//     const workout_progress = await Workout_Progress.getAllByUserId(user_id);
//     if (workout_progress === null) {
//         throw new APIError(`No workout progress with id ${user_id} exists`, 404);
//     } else if (workout_progress.user_id !== userId) {
//         throw new APIError(`User unauthorized to view workout progress with id ${wp_id} because they don't own the workout progress`, 403);
//     }

//     return workout_progress;
// }

function _validate_workout_progress_request(workout_progress_request) {
    console.log("validating...")
    let message = "";
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!Number.isInteger(workout_progress_request.user_id)){
        message = "user id must be an integer";
    }
    else if(!Number.isInteger(workout_progress_request.workout_exercise_id)){
        message = "workout exercise id must be an integer";
    }
    else if(!dateRegex.test(workout_progress_request.date)){
        message = "date must be of form yyyy-mm-dd"
    }
    else if(!Number.isInteger(workout_progress_request.set_number)){
        message = "set number must be an integer";
    }
    else if(!Number.isInteger(workout_progress_request.weight)){
        message = "Weight must be an integer";
    }
    else if(!Number.isInteger(workout_progress_request.reps)){
        message = "reps must be an integer";
    }

    if (message) {
        throw new APIError(message, 400);
    }
}

function _validate_exercise_day(workout_progress_date, exercise_date) {
    const date = new Date(JSON.stringify(workout_progress_date));

    const day_of_week = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const weekday = day_of_week[date.getDay()];

    if (exercise_date !== weekday){
        throw new APIError(`Cannot log progress outside of ${exercise_date}`, 400);
    }
}

module.exports = {
    create_workout_progress
};