const exercise_bank = require("../data_layer/exercise");
const goals = require("../data_layer/goals");
const user_info = require("../data_layer/user_info");

/**
 * Retrieves all exercises.
 * @returns {Promise<Array>} - Resolves with an array of exercises.
 */
async function get_all_exercises_business_layer() {
    return exercise_bank.get_all_exercises_data_layer();
}

async function get_exercise_by_id_business_layer(exerciseId) {
    return exercise_bank.get_exercise_by_id_data_layer(exerciseId);
}

/**
 * Business logic for updating an exercise item.
 *
 * @param {Object} exerciseData - Data for the exercise to be updated.
 * @returns {Promise<string>} - Resolves with a success message.
 * @throws {Promise<string>} - Rejects with an error message if the update operation fails.
 */
async function update_exercise_business_layer(exerciseData) {
    return exercise_bank.update_exercise_data_layer(exerciseData);
}

async function delete_exercise_business_layer(exerciseId) {
    return exercise_bank.delete_exercise_data_layer(exerciseId);
}

async function add_exercise_business_layer(exerciseData) {
    const validation_result = await _validate_add_exercise_request(exerciseData);
    if (validation_result !== null) {
        throw new Error(validation_result);
    }
    return exercise_bank.add_exercise_data_layer(exerciseData);
}

async function get_all_equipment_business_layer() {
    return exercise_bank.get_all_equipment_data_layer();
}

async function get_all_muscle_groups_business_layer() {
    return exercise_bank.get_all_muscle_groups_data_layer();
}

async function check_exercise_references_business_layer(exerciseId) {
    return exercise_bank.check_exercise_references_data_layer(exerciseId);
}


async function _validate_add_exercise_request(exercise_data) {
    const validation_funcs = {
        name: _validate_name,
        description: _validate_description,
        user_who_created_it: _validate_author,
        difficulty: _validate_difficulty,
        video_link: _validate_video_link,
        goal_id: _validate_goal,
        equipmentItems: _validate_equipment_items,
        muscleGroups: _validate_muscle_groups
    };

    for (const [k, func] of Object.entries(validation_funcs)) {
        const result = await func(exercise_data[k]);
        if (result) {
            return result;
        }
    }

    return null;
}


async function _is_authorized(user_id) {
    if (!Number.isInteger(Number(user_id))) {
        return `\`user_id\` must be an integer, not ${user_id}`;
    }

    // Check that the user exists
    let role;
    try {
        role = await user_info.get_role(user_id);
    } catch (e) {
        if (e.message === "User not found") {
            return `User with ID ${user_id} does not exist`;
        }
        throw e;
    }

    if (role !== "admin") {
        return `User must be an admin to perform this action`;
    }

    return null;
}


/**
 * Takes the `name` property of an exercise and returns the appropriate error message
 * that the property contains, if there is an error
 * @param {any} name The name attribute of an exercise
 * @returns {string|null}
 */
function _validate_name(name) {
    if (typeof name !== "string") {
        return `\`name\` must be a string, not ${typeof name}`; 
    } else if (name.trim().length === 0) {
        return "`name` must not be blank";
    }

    return null;
}


/**
 * Takes the `description` property of an exercise and returns the appropriate error message
 * that the property contains, if there is an error
 * @param {any} description The description attribute of an exercise
 * @returns {string|null}
 */
function _validate_description(description) {
    if (typeof description !== "string") {
        return `\`description\` must be a string, not ${typeof description}`; 
    } else if (description.trim().length === 0) {
        return "`description` must not be blank";
    }

    return null;
}


/**
 * Validates the `user_who_created_it` property of the exercise and returns the
 * appropriate error message, if it finds any errors
 * @param {any} user_who_created_it ID of the author of the exercise
 * @returns {Promise<string|null>}
 */
async function _validate_author(user_who_created_it) {
    const author_id = Number(user_who_created_it);
    if (!Number.isInteger(author_id)) {
        return `\`user_who_created_it\` must be an integer, not ${user_who_created_it}`;
    }

    // Check that the user exists
    try {
        await user_info.get_role(author_id);
    } catch (e) {
        if (e.message === "User not found") {
            return `User with ID ${author_id} does not exist`;
        } 
        throw e;
    }

    return null;
}


/**
 * Validates the `difficulty` property of the exercise and returns the
 * appropriate error message, if it finds any errors
 * @param {any} difficulty Level of difficulty of the exercise
 * @returns {string|null}
 */
function _validate_difficulty(difficulty) {
    const original_diff = difficulty;
    difficulty = Number(difficulty);
    if (!Number.isInteger(difficulty) || difficulty < 0) {
        return `\`difficulty\` must be a nonnegative integer, not ${original_diff}`;
    }
    return null;
}


/**
 * Validates the `video_link` of an exercise and returns an error message, if an
 * error is found
 * @param {any} video_link The `video_link` attribute of an exercise`
 * @returns {string|null}
 */
function _validate_video_link(video_link) {
    return URL.canParse(video_link) ? null : `\`video_link\` must be a valid URL, not ${video_link}`;
}


/**
 * Validates the `goal_id` property of an exercise and returns an error message
 * if an error has been found
 * @param {any} goal_id `goal_id` property of an exercise
 * @returns {Promise<string|null>}
 */
async function _validate_goal(goal_id) {
    const original_goal_id = goal_id;
    goal_id = Number(goal_id);
    if (!Number.isInteger(goal_id)) {
        return `\`goal_id\` must be an integer, not ${original_goal_id}`;
    }

    const goal = await goals.goal_name_by_id_data_layer(goal_id);
    if (goal === "") {  // TODO: Make it so non-existent goals return null
        return `Goal with ID ${goal_id} doesn't exist`;
    }

    return null;
}


/**
 * Validates the `active` property of an exercise and returns an error message
 * if an error has been found
 * @param {any} active The `active` fields of an exercise
 * @returns {string|null}
 */
function _validate_active(active) {
    const original_val = active;
    active = typeof active !== "boolean" ? Number(active) : active;
    if (typeof active !== "boolean" || ![0, 1].includes(active)) {
        return `\`active\` must be a boolean, not ${original_val}`;
    }

    return null;
}


function _increment_counter(counter, element) {
    if (counter[element] === undefined) {
        counter[element] = 0;
    }
    counter[element]++;
    return counter;
};


/**
 * Validates the `muscleGroups` property of an exercise and returns the appropriate error message
 * that the property contains, if there is an error
 * @param {any} muscleGroups The `muscleGroups` attribute of an exercise
 * @returns {string|null}
 */
function _validate_muscle_groups(muscleGroups) {
    if (!Array.isArray(muscleGroups)) {
        return `\`muscleGroups\` must be an array of strings; got ${muscleGroups}`;
    }

    const nonStringIdx = muscleGroups.findIndex(e => typeof e !== "string");
    if (nonStringIdx !== -1) {
        return `\`muscleGroups\` must be an array of strings; found ${JSON.stringify(muscleGroups[nonStringIdx])}`; 
    } else if (muscleGroups.some(e => e.trim().length === 0)) {
        return `All elements of \`muscleGroups\` must be non-blank`;
    }

    const counter = muscleGroups.reduce(_increment_counter, {});
    const [duplicate_muscle_group] = Object.entries(counter).find(([_, v]) => v > 1) ?? [null];
    if (duplicate_muscle_group !== null) {
        return `All muscle groups must be unique; found duplicate muscle group: ${duplicate_muscle_group}`;
    }

    return null;
}


/**
 * Validates the `equipmentItems` property of an exercise and returns the appropriate error message
 * that the property contains, if there is an error
 * @param {any} equipmentItems The `equipmentItems` attribute of an exercise
 * @returns {string|null}
 */
function _validate_equipment_items(equipmentItems) {
    if (!Array.isArray(equipmentItems)) {
        return `\`equipmentItems\` must be an array of strings; got ${equipmentItems}`;
    }

    const nonStringIdx = equipmentItems.findIndex(e => typeof e !== "string");
    if (nonStringIdx !== -1) {
        return `\`equipmentItems\` must be an array of strings; found ${JSON.stringify(equipmentItems[nonStringIdx])}`; 
    } else if (equipmentItems.some(e => e.trim().length === 0)) {
        return `All elements of \`equipmentItems\` must be non-blank`;
    }

    const counter = equipmentItems.reduce(_increment_counter, {});
    const [duplicate_equipment_items] = Object.entries(counter).find(([_, v]) => v > 1) ?? [null];
    if (duplicate_equipment_items !== null) {
        return `All equipment items must be unique; found duplicate equipment item: ${duplicate_equipment_items}`;
    }

    return null;
}


module.exports.check_exercise_references_business_layer = check_exercise_references_business_layer;
module.exports.get_exercise_by_id_business_layer = get_exercise_by_id_business_layer;
module.exports.get_all_muscle_groups_business_layer = get_all_muscle_groups_business_layer;
module.exports.get_all_equipment_business_layer = get_all_equipment_business_layer;
module.exports.add_exercise_business_layer = add_exercise_business_layer;
module.exports.get_all_exercises_business_layer = get_all_exercises_business_layer;
module.exports.delete_exercise_business_layer = delete_exercise_business_layer;
module.exports.update_exercise_business_layer = update_exercise_business_layer;

// TODO: Consider removing these before merging
module.exports.validate_add_exercise_request = _validate_add_exercise_request;
