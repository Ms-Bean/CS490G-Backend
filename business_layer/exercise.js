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
    const validation_result = await _validate_update_exercise_request(exerciseData);
    if (validation_result !== null) {
        throw new Error(validation_result);
    }
    return exercise_bank.update_exercise_data_layer(exerciseData);
}

async function delete_exercise_business_layer(exerciseId) {
    const validation_result = await _validate_exercise_id(exerciseId);
    if (validation_result !== null) {
        throw new Error(validation_result);
    }
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


/**
 * Validates the properties of `obj` that are present in the `validations` object
 * @param {Object.<string, (any) => string|null|Promise<string, null>} validations Object that associates properties in `obj` with a validation function
 * @param {Object} obj The object to be validated
 * @returns {Promise<string|null>} An validation error message pertaining to one of the properties of `obj` or null if there are no validation errors for any of the `obj`'s properties
 */
async function _validate_obj(validations, obj) {
    for (const [k, func] of Object.entries(validations)) {
        const result = await func(obj[k]);
        if (result) {
            return result;
        }
    }

    return null;
}


/**
 * Validates new exercise request for errors
 * @param {Object} exercise_data Object to be validated before being used to create a new exercise
 * @returns {string|null} The validation error present for one of the request's properties, or null if there are no validation errors
 */
async function _validate_add_exercise_request(exercise_data) {
    const validation_funcs = {
        name: _validate_name,
        description: _validate_description,
        difficulty: _validate_difficulty,
        video_link: _validate_video_link,
        equipment_items: _validate_equipment_items,
        muscle_groups: _validate_muscle_groups,
        goal_id: _validate_goal,
        user_who_created_it: _validate_author
    };

    return _validate_obj(validation_funcs, exercise_data);
}


/**
 * Validates update exercise request for errors
 * @param {Object} exercise_data Object to be validated before being used to update an existing exercise
 * @returns {string|null} The validation error present for one of the request's properties, or null if there are no validation errors
 */
async function _validate_update_exercise_request(exercise_data) {
    const validation_funcs = {
        name: _validate_name,
        active: _validate_active,
        description: _validate_description,
        difficulty: _validate_difficulty,
        video_link: _validate_video_link,
        equipment_items: _validate_equipment_items,
        muscle_groups: _validate_muscle_groups,
        goal_id: _validate_goal,
        user_who_created_it: _validate_author,
        exercise_id: _validate_exercise_id
    };

    return _validate_obj(validation_funcs, exercise_data);
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
    return typeof video_link === "string" ? null : `\`video_link\` must be a valid URL, not ${video_link}`;
}


async function _validate_exercise_id(exercise_id) {
    const original_exercise_id = exercise_id;
    exercise_id = Number(exercise_id);
    if (!Number.isInteger(exercise_id)) {
        return `\`exercise_id\` must be an integer, not ${original_exercise_id}`;
    }

    const exercise = await exercise_bank.get_exercise_by_id_data_layer(exercise_id);
    if (exercise === null) {
        return `No exercise with ID ${exercise_id} exists`;
    }

    return null;
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
    active = ["true", "false"].includes(active) ? Number(active === "true") : Number(active);
    if (![0, 1].includes(active)) {
        return `\`active\` must be a boolean, not ${original_val}`;
    }

    return null;
}


/**
 * Helper function to count the occurences of strings in an iterable to determine duplicate elements
 * @param {Object.<string, number>} counter An object that counts the occurences of strings in an iterable
 * @param {string} element The element whose count in `counter` will be incremented by 1
 * @returns {Object.<string, number>} The `counter` so it can be used within `Array.reduce`
 */
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

    muscleGroups = muscleGroups.map(e => e.value);
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

    equipmentItems = equipmentItems.map(e => e.value);
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
