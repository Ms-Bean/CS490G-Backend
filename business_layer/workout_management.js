const login = require("../data_layer/login");
const registration = require("../data_layer/registration");
const user_info = require("../data_layer/user_info");
const coach_search = require("../data_layer/coach_search");
const daily_survey = require("../data_layer/daily_survey");
const client_coach_interaction = require("../data_layer/client_coach_interaction");
const messaging = require("../data_layer/messaging");
const workout_management = require("../data_layer/workout_management");
const exercise = require("../data_layer/exercise");


class APIError extends Error {
    constructor(message, status_code) {
        super(message);
        this.status_code = status_code;
        this.name = APIError.name;
    }
}
async function assign_workout_plan(assigner_id, client_id, workout_plan_id)
{
    return new Promise((resolve, reject) =>{

        if(assigner_id == client_id)
        {
            workout_management.assign_workout_plan(client_id, workout_plan_id).then((response) =>{
                resolve("assigned");
            }).catch((err) =>{
                console.log(err);
                reject("sql failure");
            })
        }
        else
        {
            client_coach_interaction.check_if_client_has_hired_coach(assigner_id, client_id).then((response_bool) =>{
                console.log(response_bool);
                console.log(assigner_id);
                console.log(client_id);
                if(response_bool)
                {
                    workout_management.assign_workout_plan(client_id, workout_plan_id).then((response) =>{
                        resolve("assigned");
                    }).catch((err) =>{
                        console.log(err);
                        reject("sql failure");
                    })
                }
                else
                {
                    reject("Permission denied");
                }
            });
        }
    });
}
async function create_workout_plan(user_id, wp_request) {
    try{
        _validate_create_workout_plan_request(wp_request);
        const {name, author_id} = wp_request;

        if (user_id !== author_id) {
            const type = await user_info.get_role(user_id);
            if(type !== "coach"){
                throw new APIError(`User with ID ${user_id} cannot create workout plans on other's behalf`, 403);
            }
            const clientList = await client_coach_interaction.get_clients_of_coach_data_layer(user_id);
            const isClient = clientList.some((client) => client.id === author_id);
            if(!isClient){
                throw new APIError(`User with ID ${user_id} cannot create workout plan for User with ID ${author_id}`, 403);
            }
        }
        const wp = new workout_management.WorkoutPlan({
            workout_plan_id: 0,
            name: name,
            author_id: author_id,
        });

        return workout_management.create_workout_plan(wp);
    } catch (error){
        throw error;
    }
}

async function create_user_workout_plan(uwp_request){
    const {user_id, workout_plan_id} = uwp_request;

    const uwp = new workout_management.UserWorkoutPlan({
        user_id : user_id,
        workout_plan_id : workout_plan_id
    });

    return workout_management.create_user_workout_plan(uwp);
}


async function get_user_workout_plan(user_id, assignee_id) {
    if (user_id !== assignee_id && !await client_coach_interaction.check_if_client_has_hired_coach(user_id, assignee_id)) {
        throw new APIError(`User with ID ${user_id} not authorized to view workout assignment of the user with ID ${assignee_id}`, 403);
    }

    return workout_management.get_user_workout_plan(assignee_id);
}


async function delete_user_workout_plan(user_id, assignee_id) {
    if (user_id !== assignee_id && !await client_coach_interaction.check_if_client_has_hired_coach(user_id, assignee_id)) {
        throw new APIError(`User with ID ${user_id} not authorized to delete workout assignment of the user with ID ${assignee_id}`, 403);
    }

    await workout_management.delete_user_workout_plan(assignee_id);
}


async function create_workout_plan_exercise(user_id, wpe_request) {
    try{
        wpe_request.reps_per_set = wpe_request.reps_per_set === 0 ? null : wpe_request.reps_per_set;
        wpe_request.num_sets = wpe_request.num_sets === 0 ? null : wpe_request.num_sets;
        wpe_request.weight = wpe_request.weight === 0 ? null : wpe_request.weight;
        _validate_create_workout_plan_exercise_request(wpe_request);
        const ex = await exercise.get_exercise_by_id_data_layer(wpe_request.exercise_id);
        if (ex === null) {
            throw new APIError(`No exercise with ID ${wpe_request.exercise_id} exists!`, 400);
        }
        
        wpe_request.exercise = ex;
        const wpe = new workout_management.WorkoutPlanExercise(wpe_request);
        const wp = await workout_management.get_workout_by_id(wpe.workout_plan_id);
        if (wp === null) {
            throw new APIError(`Workout plan with id ${wpe.workout_plan_id} does not exist`, 400);
        } else if (wp.author_id !== user_id) {
            const type = await user_info.get_role(user_id);
            if(type !== "coach"){
                throw new APIError(`User unauthorized to create exercise for workout plan with id ${wp.workout_plan_id} because they don't own the workout plan`, 403);
            }
            const clientList = await client_coach_interaction.get_clients_of_coach_data_layer(user_id);
            const isClient = clientList.some((client) => client.id === wp.author_id);
            if(!isClient){
                throw new APIError(`User with ID ${user_id} cannot create workout plan exericse for User with ID ${wp.author_id}`, 403);
            }
        }

        return workout_management.create_workout_exercise(wpe);
    } catch(error){
        throw error;
    }
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
    wpe_request.reps_per_set = wpe_request.reps_per_set === 0 ? null : wpe_request.reps_per_set;
    wpe_request.num_sets = wpe_request.num_sets === 0 ? null : wpe_request.num_sets;
    wpe_request.weight = wpe_request.weight === 0 ? null : wpe_request.weight;
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

    const ex = await exercise.get_exercise_by_id_data_layer(wpe_request.exercise_id);
    if (ex === null) {
        throw new APIError(`Exercise with id ${wpe_request.exercise_id} does not exist`, 400);
    }

    return workout_management.update_workout_exercise(wpe_request);
}


async function delete_workout_plan(user_id, wp_request) {
    const {workout_plan_id} = wp_request;
    if (!Number.isInteger(workout_plan_id)) {
        throw new APIError("Invalid workout plan id");
    }
    const wp = await workout_management.get_workout_by_id(workout_plan_id);
    if (wp === null) {
        throw new APIError(`No workout plan with id ${workout_plan_id} exists`, 400);
    } else if (wp.author_id !== user_id) {
        throw new APIError(`User unauthorized to modify workout plan with id ${workout_plan_id} because they don't own the workout plan`, 403);
    }

    await workout_management.delete_workout_plan(workout_plan_id);
}

async function delete_workout_plan_exercise(user_id, wpe_request) {
    const {workout_plan_id, workout_plan_exercise_id} = wpe_request;
    if (!Number.isInteger(workout_plan_id)) {
        throw new APIError("Invalid workout plan id");
    } else if (!Number.isInteger(workout_plan_exercise_id)) {
        throw new APIError("Invalid workout plan exercise id");
    }
    
    const wp = await workout_management.get_workout_by_id(workout_plan_id);
    if (wp === null) {
        throw new APIError(`No workout plan with id ${workout_plan_id} exists`, 400);
    } else if (wp.author_id !== user_id) {
        throw new APIError(`User unauthorized to modify workout plan with id ${workout_plan_id} because they don't own the workout plan`, 403);
    }

    const wpe = await workout_management.get_workout_exercise_by_id(workout_plan_exercise_id);
    if (wpe === null) {
        throw new APIError(`Workout plan exercise with id ${workout_plan_exercise_id} doesn't exist under workout plan with id ${workout_plan_id}`, 400);
    }

    await workout_management.delete_workout_exercise(workout_plan_exercise_id);
}


async function get_workout_plan_by_id({user_id, wp_id, include_exercises}) {
    const wp = await workout_management.get_workout_by_id(wp_id);
    if (wp === null) {
        throw new APIError(`No workout plan with id ${wp_id} exists`, 404);
    } 

    if (!include_exercises) {
        return wp;
    }

    wp.exercises = await workout_management.get_exercises_by_workout_id(wp_id);
    return wp;
}


async function get_workout_plans_by_owner({user_id, author_id}) {
    await _is_authorized_to_view_workout_plan_or_throw_403(user_id, author_id);
    return workout_management.get_workouts_by_author(author_id);
}


async function get_workout_plan_exercise_by_id(user_id, wp_id, wpe_id) {
    const wp = await workout_management.get_workout_by_id(wp_id);
    if (wp === null) {
        throw new APIError(`No workout plan with id ${wp_id} exists`, 404);
    }
    await _is_authorized_to_view_workout_plan_or_throw_403(user_id, wp.author_id);

    const wpe = await workout_management.get_workout_exercise_by_id(wpe_id);
    if (wpe === null) {
        throw new APIError(`No workout plan exercise with ID ${wpe_id}`, 404);
    }

    return wpe;
}


async function _is_authorized_to_view_workout_plan_or_throw_403(user_id, wp_author_id) {
    if (user_id !== wp_author_id &&
            !(await client_coach_interaction.check_if_client_has_hired_coach(user_id, wp_author_id) || await client_coach_interaction.check_if_client_has_hired_coach(wp_author_id, user_id))) {
        throw new APIError(`User with ID ${user_id} not authorized to view workout plans owned by user with ID ${wp_author_id}`, 403);
    }
}


// TODO: Clean up and refactor
// TODO: Validate exercises property
function _validate_create_workout_plan_request(wp_request) {
    let message = "";
    if (typeof wp_request.name !== "string") {
        message = "Workout plan name must be a string";
    } else if (wp_request.name.trim().length === 0) {
        message = "Workout plan name must not be empty";
    } else if (!Number.isInteger(wp_request.author_id)) {
        message = "Workout plan author_id must be an integer";
    } else if (wp_request.exercises != null) {
        message = "Inserting Workout plan exercises not supported yet";
    }

    if (message) {
        throw new APIError(message, 400);
    }
}

function _validate_create_client_workout_plan_request(wp_request) {
    let message = "";
    if (typeof wp_request.name !== "string") {
        message = "Workout plan name must be a string";
    } else if (wp_request.name.trim().length === 0) {
        message = "Workout plan name must not be empty";
    } else if (!Number.isInteger(wp_request.author_id)) {
        message = "Workout plan author_id must be an integer";
    } else if (wp_request.exercises === null) {
        message = "Workout plan's exericses cannot be null";
    }

    if (message) {
        throw new APIError(message, 400);
    }
}


// TODO: Clean up and refactor
// TODO: Validate exercises property
function _validate_create_workout_plan_exercise_request(wpe_request) {
    let message = "";
    const weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
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
    } else if (wpe_request.reps_per_set !== null && wpe_request.reps_per_set <= 0) {
        message = "Workout plan exercise `reps_per_set` must be a positive integer";
    } else if (wpe_request.num_sets !== null && !Number.isInteger(wpe_request.num_sets)) {
        message = "Workout plan exercise `num_sets` must be an integer or null";
    } else if (wpe_request.num_sets !== null && wpe_request.num_sets <= 0) {
        message = "Workout plan exercise `num_sets` must be a positive integer";
    } else if (wpe_request.weight !== null && !Number.isInteger(wpe_request.weight)) {
        message = "Workout plan exercise `weight` must be an integer or null";
    } else if (wpe_request.weight !== null && wpe_request.weight <= 0) {
        message = "Workout plan exercise `weight` must be a positive integer";
    }

    if (message) {
        throw new APIError(message, 400);
    }
}


module.exports = {
    create_workout_plan,
    create_workout_plan_exercise,
    update_workout_plan,
    update_workout_plan_exercise,
    delete_workout_plan,
    delete_workout_plan_exercise,
    get_workout_plan_by_id,
    get_workout_plans_by_owner,
    get_workout_plan_exercise_by_id,
    create_user_workout_plan,
    delete_user_workout_plan,
    get_user_workout_plan,
    assign_workout_plan
};
