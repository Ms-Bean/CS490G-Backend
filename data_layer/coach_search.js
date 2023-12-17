let connection = require("./conn");
let con = connection.con;

/**
 * 
 * @param {Object} filter_options
 * @param {string} [filter_options.name] 
 * @param {boolean|null} filter_options.accepting_new_clients 
 * @param {Object} [filter_options.hourly_rate] 
 * @param {number} filter_options.hourly_rate.min 
 * @param {number} filter_options.hourly_rate.max 
 * @param {Object} [filter_options.experience_level] 
 * @param {number} filter_options.experience_level.min 
 * @param {number} filter_options.experience_level.max 
 * @param {Object} [filter_options.location] 
 * @param {string} [filter_options.location.city] 
 * @param {string} [filter_options.location.state] 
 */
function _build_search_coach_filter_clauses({name, accepting_new_clients, hourly_rate, experience_level, location}) {
    const name_cond = name ? `CONCAT(Users.first_name, ' ', Users.last_name) LIKE ?` : "";
    const accepting_new_clients_cond = accepting_new_clients !== null ? "Coaches.accepting_new_clients = ?" : "";
    const hourly_rate_cond = hourly_rate ? "Coaches.hourly_rate BETWEEN ? AND ?" : "";
    const experience_level_cond = experience_level ? "Coaches.experience_level BETWEEN ? AND ?" : "";
    const cities_cond = location?.city ? "Addresses.city LIKE ?" : "";
    const states_cond = location?.state ? "Addresses.state LIKE ?" : "";
    const accepted_cond = "Coaches.accepted = 1";
    const where_conds = [name_cond, accepting_new_clients_cond, hourly_rate_cond, experience_level_cond, cities_cond, states_cond, accepted_cond].filter(s => s).join(" AND ");

    const sql_args = [];
    if (name_cond) sql_args.push(`${name}%`);
    if (accepting_new_clients_cond) sql_args.push(accepting_new_clients);
    if (hourly_rate_cond) sql_args.push(...[hourly_rate.min, hourly_rate.max]);
    if (experience_level_cond) sql_args.push(...[experience_level.min, experience_level.max]);
    if (cities_cond) sql_args.push(`${location.city}%`);
    if (states_cond) sql_args.push(`${location.state}%`);

    return {
        where: where_conds ? "WHERE " + where_conds : "",
        args: sql_args
    };
}

/**
 * 
 * @param {Object} sort_options 
 * @param {"name"|"hourly_rate"|"experience_level"} sort_options.key 
 * @param {boolean} sort_options.is_descending 
 */
function _build_search_coach_sort_options({key, is_descending}) {
    const order = is_descending ? "DESC" : "ASC";
    const key_to_sql_map = new Map([
        ["name", `Users.first_name ${order}, Users.last_name ${order}`],
        ["hourly_rate", `Coaches.hourly_rate ${order}`],
        ["experience_level", `Coaches.experience_level ${order}`]
    ]);

    return `ORDER BY ${key_to_sql_map.get(key)}`;
}

/**
 * 
 * @param {Object} search_options
 * @param {Object} search_options.filter_options
 * @param {string} search_options.filter_options.name 
 * @param {boolean} search_options.filter_options.accepting_new_clients 
 * @param {Object} search_options.filter_options.hourly_rate 
 * @param {number} search_options.filter_options.hourly_rate.min 
 * @param {number} search_options.filter_options.hourly_rate.max 
 * @param {Object} search_options.filter_options.location 
 * @param {string} search_options.filter_options.location.city 
 * @param {string} search_options.filter_options.location.state
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
function search_coaches_data_layer({filter_options, sort_options, page_info}) {
    const {where, args} = _build_search_coach_filter_clauses(filter_options);
    const order_by = sort_options ? _build_search_coach_sort_options(sort_options) : "";
    const next_entry = (page_info.page_num - 1) * page_info.page_size;
    args.push(...[page_info.page_size, next_entry]);
    const sql = `SELECT Coaches.user_id, Coaches.hourly_rate, Coaches.coaching_history, Coaches.accepting_new_clients, Coaches.experience_level,
                    Users.first_name, Users.last_name, User_Profile.about_me, User_Profile.profile_picture, GROUP_CONCAT(Goals.name SEPARATOR ',') AS goals, Addresses.address, Addresses.city, Addresses.state
                FROM Coaches
                    INNER JOIN Users ON Coaches.user_id = Users.user_id
                    INNER JOIN User_Profile ON Coaches.user_id = User_Profile.user_id
                    LEFT JOIN Coaches_Goals ON Coaches.user_id = Coaches_Goals.coach_id
                    LEFT JOIN Goals ON Coaches_Goals.goal_id = Goals.goal_id
                    LEFT JOIN Addresses ON Coaches.user_id = Addresses.user_id
                ${where}
                GROUP BY Coaches.user_id
                ${order_by}
                LIMIT ? OFFSET ?`;

    return new Promise((resolve, reject) => {
        con.query(sql, args, (err, results) => {
            if (err) {
                reject(err);
                return;
            }

            const mapped_results = results.map(r => {
                return {
                    coach_id: r.user_id,
                    personal_info: {
                        first_name: r.first_name,
                        last_name: r.last_name,
                        about_me: r.about_me,
                        profile_picture: r.profile_picture
                    },
                    professional_info: {
                        hourly_rate: r.hourly_rate,
                        coaching_history: r.coaching_history,
                        accepting_new_clients: r.accepting_new_clients,
                        experience_level: r.experience_level,
                        goals: r.goals?.split(','),
                    },
                    location: {
                        address: r.address,
                        city: r.city,
                        state: r.state
                    }
                };
            });
            resolve(mapped_results);
        });
    });
}

/**
 * 
 * @param {Object} search_options
 * @param {Object} search_options.filter_options
 * @param {string} search_options.filter_options.name 
 * @param {boolean} search_options.filter_options.accepting_new_clients 
 * @param {Object} search_options.filter_options.hourly_rate 
 * @param {number} search_options.filter_options.hourly_rate.min 
 * @param {number} search_options.filter_options.hourly_rate.max 
 * @param {Object} search_options.filter_options.location 
 * @param {string} search_options.filter_options.location.city 
 * @param {string} search_options.filter_options.location.state
 * @returns {Promise<number>} 
 */
function count_coach_search_results({filter_options}) {
    const {where, args} = _build_search_coach_filter_clauses(filter_options);
    const sql = `SELECT Coaches.user_id
                FROM Coaches
                    INNER JOIN Users ON Coaches.user_id = Users.user_id
                    INNER JOIN User_Profile ON Coaches.user_id = User_Profile.user_id
                    LEFT JOIN Coaches_Goals ON Coaches.user_id = Coaches_Goals.coach_id
                    LEFT JOIN Goals ON Coaches_Goals.goal_id = Goals.goal_id
                    LEFT JOIN Addresses ON Coaches.user_id = Addresses.user_id
                ${where}
                GROUP BY Coaches.user_id`;
                return new Promise((resolve, reject) => {
                    con.query(sql, args, (err, results) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(results.length);
                    });
                });
}
module.exports.search_coaches_data_layer = search_coaches_data_layer;
module.exports.count_coach_search_results = count_coach_search_results;
module.exports._build_search_coach_filter_clauses = _build_search_coach_filter_clauses;