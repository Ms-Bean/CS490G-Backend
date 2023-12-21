const login = require("../data_layer/login");
const registration = require("../data_layer/registration");
const user_info = require("../data_layer/user_info");
const coach_search = require("../data_layer/coach_search");
const daily_survey = require("../data_layer/daily_survey");
const client_coach_interaction = require("../data_layer/client_coach_interaction");
const messaging = require("../data_layer/messaging")

function _get_filter_options_constants() {
    return {
        min_experience_level: 0,
        max_experience_level: 1000,
        min_hourly_rate: 0,
        max_hourly_rate: 1_000_000
    };
}

/**
 * 
 * @param {Array<number>} nums 
 * @returns {boolean}
 */
function _assert_is_sorted(nums) {
    for (let i = 0; i < nums.length - 1; i++) {
        if (nums[i] > nums[i + 1]) {
            return false;
        }
    }

    return true;
}

// TODO: Finish validation of filter options
function _validate_ranges_of_filter_options(normalized_filter_options) {
    const {experience_level, hourly_rate} = normalized_filter_options;
    const errors = [];
    const {min_experience_level, max_experience_level, min_hourly_rate, max_hourly_rate} = _get_filter_options_constants();
    if (!_assert_is_sorted([min_experience_level, experience_level.min, experience_level.max, max_experience_level])) {
        errors.push(`Invalid range for experience level. Should fit ${min_experience_level} <= min exp level <= max exp level <= ${max_experience_level}`);
    }
    if (!_assert_is_sorted([min_hourly_rate, hourly_rate.min, hourly_rate.max, max_hourly_rate])) {
        errors.push(`Invalid range for hourly rate. Should fit ${min_hourly_rate} <= min hourly rate <= max hourly rate <= ${max_hourly_rate}`);
    }

    return errors;
}


function _check_types_of_filter_options(normalized_filter_options) {
    const errors = [];
    if (typeof normalized_filter_options.name !== 'string') {
        errors.push(`Name filter must be of type 'string' not ${typeof normalized_filter_options.name}`);
    }
    if (normalized_filter_options.accepting_new_clients !== null && typeof normalized_filter_options.accepting_new_clients !== "boolean") {
        errors.push(`Accepting new clients filter must be of type 'boolean' not ${typeof normalized_filter_options.name}`);
    }
    if (typeof normalized_filter_options.location.city !== 'string') {
        errors.push(`City filter must be of type 'string' not ${typeof normalized_filter_options.location.city}`);
    }
    if (typeof normalized_filter_options.location.state !== 'string') {
        errors.push(`State filter must be of type 'string' not ${typeof normalized_filter_options.location.state}`);
    }
    if (!Number.isInteger(normalized_filter_options.experience_level.min)) {
        errors.push(`Min experience level must be an integer`);
    }
    if (!Number.isInteger(normalized_filter_options.experience_level.max)) {
        errors.push(`Max experience level must be an integer`);
    }
    if (!Number.isInteger(normalized_filter_options.hourly_rate.min)) {
        errors.push(`Min hourly rate must be an integer`);
    }
    if (!Number.isInteger(normalized_filter_options.hourly_rate.max)) {
        errors.push(`Max hourly rate must be an integer`);
    }
    if(!Array.isArray(normalized_filter_options.goals) || !normalized_filter_options.goals.every(g => Number.isInteger(g))) {
        errors.push("`goals` must be an array of integers (goal_ids)");
    }

    return errors;
}


function _normalize_filter_options(filter_options) {
    const constants = _get_filter_options_constants();
    const normalized = {};

    normalized.name = filter_options?.name ?? "";
    normalized.hourly_rate = {
        min: filter_options?.hourly_rate?.min ?? constants.min_hourly_rate,
        max: filter_options?.hourly_rate?.max ?? constants.max_hourly_rate
    };
    normalized.experience_level = {
        min: filter_options?.experience_level?.min ?? constants.min_experience_level,
        max: filter_options?.experience_level?.max ?? constants.max_experience_level
    };
    normalized.location = {
        city: filter_options?.location?.city ?? "",
        state: filter_options?.location?.state ?? ""
    };
    normalized.goals = filter_options?.goals ?? [];
    normalized.accepting_new_clients = filter_options?.accepting_new_clients ?? null;

    return normalized;
}


// Function to search for coaches based on various criteria
/**
 * 
 * @param {Object} search_options
 * @param {Object} [search_options.filter_options]
 * @param {string} [search_options.filter_options.name] 
 * @param {boolean} [search_options.filter_options.accepting_new_clients] 
 * @param {Object} [search_options.filter_options.hourly_rate] 
 * @param {number} [search_options.filter_options.hourly_rate.min] 
 * @param {number} [search_options.filter_options.hourly_rate.max] 
 * @param {Object} [search_options.filter_options.location] 
 * @param {string} [search_options.filter_options.location.city] 
 * @param {string} [search_options.filter_options.location.state] 
 * @param {Object} [search_options.filter_options.experience_level] 
 * @param {number} [search_options.filter_options.experience_level.min] 
 * @param {number} [search_options.filter_options.experience_level.max] 
 * @param {Array<number>} [search_options.filter_options.goals]
 * 
 * @param {Object} [search_options.sort_options]
 * @param {"name"|"hourly_rate"|"experience_level"} search_options.sort_options.key 
 * @param {boolean} search_options.sort_options.is_descending 
 * 
 * @param {Object} search_options.page_info 
 * @param {number} search_options.page_info.page_size 
 * @param {number} search_options.page_info.page_num 
 * @returns {Promise<Object>} 
 */
async function search_coaches_business_layer({filter_options, sort_options, page_info}) {
    const norm_filter_options = _normalize_filter_options(filter_options);
    const type_errors = _check_types_of_filter_options(norm_filter_options);
    if (type_errors.length > 0) {
        return Promise.reject(new Error(type_errors.join(', ')));
    }
    const range_errors = _validate_ranges_of_filter_options(norm_filter_options);
    if (range_errors.length > 0) {
        return Promise.reject(new Error(range_errors.join(', ')));
    }

    const valid_sort_keys = ["name", "hourly_rate", "experience_level"];
    if (sort_options) {
        if (!valid_sort_keys.includes(sort_options.key)) {
            return Promise.reject(new Error(`'${sort_options.key}' is an invalid sort key`));
        } else if (typeof sort_options.is_descending !== 'boolean') {
            return Promise.reject(new Error("sort_options property missing sort direction"));
        }
    }
    if (!page_info) {
        return Promise.reject(new Error("Search request missing `page_info` property"));
    } else if (!Number.isInteger(page_info.page_num) || !Number.isInteger(page_info.page_size) || page_info.page_size < 1 || page_info.page_num < 1) {
        return Promise.reject(new Error("Invalid page info"));
    }

    const formatted_search_options = {
        filter_options: norm_filter_options,
        sort_options: sort_options,
        page_info: page_info
    };

    const result_count = await coach_search.count_coach_search_results(formatted_search_options);
    const page_count = Math.ceil(result_count / page_info.page_size) || 1;
    page_info.page_num = Math.min(page_info.page_num, page_count);

    const coaches = await coach_search.search_coaches_data_layer(formatted_search_options);
    return {
        page_info: {
            page_num: page_info.page_num,
            page_size: page_info.page_size,
            page_count: page_count,
            has_next: page_info.page_num < page_count,
            has_prev: page_info.page_num > 1
        },
        coaches: coaches
    };
}
module.exports._get_filter_options_constants = _get_filter_options_constants;
module.exports._assert_is_sorted = _assert_is_sorted;
module.exports._validate_ranges_of_filter_options = _validate_ranges_of_filter_options;
module.exports._check_types_of_filter_options = _check_types_of_filter_options;
module.exports._normalize_filter_options = _normalize_filter_options;
module.exports.search_coaches_business_layer = search_coaches_business_layer;