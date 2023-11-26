// TODO: Assign and Unassign workout plans
// TODO: Wrap DELETE queries in transactions, due to effect of cascading

// const connection = require("./conn");
// const con = connection.con;

const mysql = require("mysql");

function create_workout_plan(author_id, name) {
    const sql = "INSERT INTO Workout_Plans (name, user_who_created_it) VALUES (?, ?)";
    return new Promise((resolve, reject) => {
        con.query(sql, [name, author_id], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}


function update_workout_plan(workout_plan_id, name) {
    const sql = "UPDATE Workout_Plans SET name = ? WHERE workout_plan_id = ?";
    return new Promise((resolve, reject) => {
        con.query(sql, [name, workout_plan_id], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}



function delete_workout_plan(workout_plan_id) {
    const sql = "DELETE FROM Workout_Plans WHERE workout_plan_id = ?";
    return new Promise((resolve, reject) => {
        con.query(sql, [workout_plan_id], (err) => {
            if (err) {
                reject(err);
                return;
            } 
            resolve();
        });
    });
}


async function get_workouts_by_author(author_id) {
    const sql = `SELECT workout_plan_id, name, created, modified, user_who_created_it AS author_id
        FROM Workout_Plans
        WHERE user_who_created_it = ?`;
    const params = [author_id];
    return _get_workouts(sql, params);
}

async function get_workouts_by_id(workout_plan_id) {
    const sql = `SELECT workout_plan_id, name, created, modified, user_who_created_it AS author_id
        FROM Workout_Plans
        WHERE workout_plan_id = ?`;
    const params = [workout_plan_id];
    return _get_workouts(sql, params);
}


async function get_assigned_workout(user_id) {
    const get_assigned_sql = `SELECT workout_plan_id
        FROM User_Workout_Plan
        WHERE user_id = ?`
    const get_workout_sql = `SELECT workout_plan_id, name, created, modified, user_who_created_it AS author_id
        FROM Workout_Plans
        WHERE workout_plan_id = ?`;
    const workout_id = await new Promise((resolve, reject) => {
        con.query(get_assigned_sql, [user_id], (err, results) => {
            if (err) {
                reject(err);
                return;
            }

            const workout_id = results.length > 0 ? results[0].workout_plan_id : null;
            resolve(workout_id);
        });
    });

    if (workout_id === null) {
        return null;
    }

    return _get_workouts(get_workout_sql, [workout_id])[0];
}


// TODO: Ask about pagination
function _get_workouts(sql, params) {
    return new Promise((resolve, reject) => {
        con.query(sql, params, (err, results) => {
            if (err) {
                reject(err);
                return;
            }

            const workouts = results.map(r => {
                return {
                    workout_plan_id: r.workout_plan_id,
                    name: r.name,
                    created: r.created,
                    modified: r.modified,
                    author_id: r.author_id
                };
            });

            resolve(workouts);
        });
    });
}


async function get_exercises_of_workouts(workout_plan_ids) {
    const sql = `SELECT id, workout_plan_id, exercise_id, weekday, time,
        created, modified, reps_per_set, num_sets, weight
        FROM Workout_Plan_Exercises
        WHERE workout_plan_ids IN ?`;
    const exercises = await new Promise((resolve, reject) => {
        con.query(sql, [workout_plan_ids], (err, results) => {
            if (err) {
                reject(err);
                return;
            }

            const exercises = results.map(r => {
                return {
                    id: r.id,
                    workout_plan_id: r.workout_plan_id,
                    exercise_id: r.exercise_id,
                    weekday: r.weekday,
                    time: r.time,
                    created: r.created,
                    modified: r.modified,
                    reps_per_set: r.reps_per_set,
                    num_sets: r.num_sets,
                    weight: r.weight
                };
            });

            resolve(exercises);
        });
    });

    const exercises_by_workout = {};
    exercises.forEach(e => {
        if (exercises_by_workout[e.workout_plan_id] === undefined) {
            exercises_by_workout[e.workout_plan_id] = [];
        }
        exercises_by_workout[e.workout_plan_id].push(e);
    });

    return exercises_by_workout;
}


async function get_exercises_by_workout_id(workout_plan_id) {
    const exercises_by_workout = await get_exercises_of_workouts([workout_plan_id]);
    return exercises_by_workout[workout_plan_id] ?? [];
}


function create_workout_exercise(workout_plan_id, exercise_id, details) {
    const sql = `INSERT INTO Workout_Plan_Exercises
        (workout_plan_id, exercise_id, weekday, time, reps_per_set, num_sets, weight)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const {weekday, time, reps_per_set, num_sets, weight} = details;
    const args = [workout_plan_id, exercise_id, weekday, time, reps_per_set, num_sets, weight];
    return new Promise((resolve, reject) => {
        con.query(sql, args, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}


function _get_update_args(args) {
    const kept_args = [];
    const query_parts = [];
    Object.entries(args).forEach(([key, val]) => {
        if (val === undefined) {
            return;
        }

        kept_args.push(val);
        query_parts.push(`${key} = ?`);
    });

    return {set_clause: query_parts.join(", "), args: kept_args};
}


function update_workout_exercise(workout_plan_exercise_id, details) {
    const {set_clause, args} = _get_update_args(details);
    const sql = `UPDATE Workout_Plan_Exercises
        SET ${set_clause}
        WHERE id = ?`;
    args.push(workout_plan_exercise_id);

    return new Promise((resolve, reject) => {
        con.query(sql, args, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}


function delete_workout_exercise(workout_plan_exercise_id) {
    const sql = `DELETE FROM Workout_Plan_Exercises
        WHERE id = ?`;
    return new Promise((resolve, reject) => {
        con.query(sql, [workout_plan_exercise_id], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

// When user wants to clear out the exercises from a workout plan without deleting the workout plan itself
function delete_exercises_of_workout(workout_plan_id) {
    const sql = `DELETE FROM Workout_Plan_Exercises
        WHERE workout_plan_id = ?`;
    return new Promise((resolve, reject) => {
        con.query(sql, [workout_plan_id], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}


const con = mysql.createConnection({ 
    host: "localhost",
    user: "root", //Replace with your user
    password: "cactusgreen", //Replace with your password
    database: "cs490_database"
});

const create_workout_driver = async () => {
    const author_id = 2;
    await create_workout_plan(author_id, "NEW WORKOUT 2");
}

const read_workouts_by_id_driver = async () => {
    const author_id = 2;
    const workouts = await get_workouts_by_author(author_id);
    for (const workout of workouts) {
        console.log(workout);
    }
}

const func = async () => {
    await read_workouts_by_id_driver();
    con.end();
}
func();
