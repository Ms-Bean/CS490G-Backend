const login = require("../data_layer/login");
const registration = require("../data_layer/registration");
const user_info = require("../data_layer/user_info");
const coach_search = require("../data_layer/coach_search");
const daily_survey = require("../data_layer/daily_survey");
const client_coach_interaction = require("../data_layer/client_coach_interaction");
const messaging = require("../data_layer/messaging")
// Function to insert a message between a client and a coach
/**
 * @param {number} current_user_id - ID of the user sending the message.
 * @param {number} recipient_id - ID of the user receiving the message.
 * @param {string} content - Content of the message.
 * @returns {Promise<string>} - Resolves with a success message if the message is sent successfully.
 * @throws {Promise<string>} - Rejects with an error message if message insertion fails.
 */
async function insert_message_business_layer(current_user_id, recipient_id, content) {
    if (!Number.isInteger(current_user_id)) {
        return Promise.reject(new Error("Invalid user id"));
    }
    if (!Number.isInteger(recipient_id)) {
        return Promise.reject(new Error("Invalid recipient id"));
    }
    if (!content) {
        return Promise.reject(new Error("Cannot send empty message"));
    }

    if (!(await client_coach_interaction.check_if_client_has_hired_coach(current_user_id, recipient_id) || await client_coach_interaction.check_if_client_has_hired_coach(recipient_id, current_user_id))) {
        return Promise.reject(new Error("Current user cannot message another user that's neither their coach nor client"));
    }
    return messaging.insert_message_data_layer(current_user_id, recipient_id, content);
}
// TODO rename other_user_id to a more descriptive name

// Function to retrieve client-coach messages
/**
 * @param {number} current_user_id - ID of the user making the request.
 * @param {number} other_user_id - ID of the other user in the conversation.
 * @param {number} page_size - Number of messages per page.
 * @param {number} page_num - Page number.
 * @returns {Promise<Object>} - Resolves with an object containing page information and messages.
 * @throws {Promise<string>} - Rejects with an error message if message retrieval fails.
 */
async function get_client_coach_messages_business_layer(current_user_id, other_user_id, page_size, page_num) {
    if (!Number.isInteger(current_user_id)) {
        return Promise.reject(new Error("Invalid user id"));
    }
    if (!Number.isInteger(other_user_id)) {
        return Promise.reject(new Error("Invalid other user id"));
    }
    if (!Number.isInteger(page_size) || page_size <= 0) {
        return Promise.reject(new Error("Invalid page size"));
    }
    if (!Number.isInteger(page_num) || page_num <= 0) {
        return Promise.reject(new Error("Invalid page number"));
    }

    if (!(await client_coach_interaction.check_if_client_has_hired_coach(current_user_id, other_user_id) || await client_coach_interaction.check_if_client_has_hired_coach(other_user_id, current_user_id))) {
        return Promise.reject(new Error("Current user cannot view messages from another user that's neither their coach nor client"));
    }

    const message_count = await messaging.count_client_coach_messages(current_user_id, other_user_id);
    const page_count = Math.ceil(message_count / page_size) || 1;
    page_num = Math.min(page_num, page_count);
    
    const messages = await messaging.get_client_coach_message_page_data_layer(current_user_id, other_user_id, page_size, page_num);
    const messages_dto = {
        page_info: {
            page_num: page_num,
            page_size: page_size,
            page_count: page_count,
            has_next: page_num < page_count,
            has_prev: page_num > 1
        },
        messages: messages
    }
    return messages_dto;
} 
module.exports.insert_message_business_layer = insert_message_business_layer;
module.exports.get_client_coach_messages_business_layer = get_client_coach_messages_business_layer;