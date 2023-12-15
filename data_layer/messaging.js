let connection = require("./conn");
let con = connection.con;


// TODO Either create a Message class / Type or find a way to export this definition for other functions to use
/**
 * @typedef {Object} Message
 * @property {number} message_id 
 * @property {number} sender_id 
 * @property {number} receiver_id 
 * @property {string} content
 * @property {Date} created
 * @property {Date} modified 
 */
/**
 * 
 * @param {Object} messages 
 * @returns {Message}
 */
function _convert_to_message(message) {
    return {
        message_id: message.message_id,
        sender_id: message.sender_id,
        receiver_id: message.receiver_id,
        content: message.content,
        created: message.created,
        modified: message.modified
    };
}
/**
 * 
 * @param {number} user_id 
 * @param {number} other_user_id 
 * @param {number} page_size 
 * @param {number} page_num 
 * @returns {Promise<Message[]>}
 */
function get_client_coach_message_page_data_layer(user_id, other_user_id, page_size, page_num) {
    // order by clause is descending to ensure that latest messages appear first
    const sql = "SELECT message_id, sender_id, receiver_id, content, created, modified FROM Messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY created DESC LIMIT ? OFFSET ?";
    const next_entry = (page_num - 1) * page_size;
    return new Promise((resolve, reject) => {
        con.query(sql, [other_user_id, user_id, user_id, other_user_id, page_size, next_entry], (err, results) => {
            if (err) {
                console.log(err);
                reject(err)
            } else {
                resolve(results.map(m => _convert_to_message(m)));
            }
        });
    });
}


/**
 * Returns the messages between `user` and `other_user`. It's expected that either `user` is the client of the `other_user` or vice versa
 * @param {number} user_id 
 * @param {number} other_user_id 
 * @returns {Promise<number>}
 */
function count_client_coach_messages_data_layer(user_id, other_user_id) {
    const sql = "SELECT COUNT(message_id) AS message_count FROM Messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)";
    return new Promise((resolve, reject) => {
        con.query(sql, [other_user_id, user_id, user_id, other_user_id], (err, results) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(results[0].message_count);
            }
        });
    });
}

/**
 * 
 * @param {number} sender_id 
 * @param {number} receiver_id 
 * @param {string} content 
 * @returns {Promise<string>}
 */
function insert_message_data_layer(sender_id, receiver_id, content) {
    const sql = "INSERT INTO Messages (sender_id, receiver_id, content) VALUES (?, ?, ?)";
    return new Promise((resolve, reject) => {
        con.query(sql, [sender_id, receiver_id, content], (err, results) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                const success_message = "Message successfully added to database";
                console.log(success_message);
                resolve(success_message);
            }
        });
    });
}


async function delete_messages_between_users(user_id1, user_id2) {
    const sql = `DELETE FROM Messages
        WHERE (sender_id = ? AND receiver_id = ?) OR (receiver_id = ? AND sender_id = ?)`;
    await new Promise((resolve, reject) => {
        con.query(sql, [user_id1, user_id2, user_id2, user_id1], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}


module.exports.insert_message_data_layer = insert_message_data_layer;
module.exports.get_client_coach_message_page_data_layer = get_client_coach_message_page_data_layer;
module.exports.count_client_coach_messages_data_layer = count_client_coach_messages_data_layer;
module.exports.delete_messages_between_users = delete_messages_between_users;