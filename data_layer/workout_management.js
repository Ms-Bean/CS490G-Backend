// TODO: Assign and Unassign workout plans
// TODO: Test getting assigned workout plans
// TODO: Wrap DELETE queries in transactions, due to effect of cascading
// TODO: Learn how to deal with time without the date
// TODO: Add ability to add, update, and delete exercises


const connection = require("./conn");
const con = connection.con;

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


async function get_workout_by_id(workout_plan_id) {
    const sql = `SELECT workout_plan_id, name, created, modified, user_who_created_it AS author_id
        FROM Workout_Plans
        WHERE workout_plan_id = ?`;
    const params = [workout_plan_id];
    const workout_arr = await _get_workouts(sql, params);
    return workout_arr?.[0] ?? null;
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

    const workout_arr = await _get_workouts(get_workout_sql, [workout_id]);
    return workout_arr[0];
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
        WHERE workout_plan_id IN (?)`;
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


async function get_exercise_by_id(exercise_id) {
    const sql = `SELECT Exercise_Bank.exercise_id, Exercise_Bank.name, Exercise_Bank.description, Exercise_Bank.created, Exercise_Bank.modified,
        Exercise_Bank.user_who_created_it AS creator_id, Exercise_Bank.difficulty, Exercise_Bank.video_link,
        GROUP_CONCAT(DISTINCT Exercise_Equipment.equipment_item) AS equipment_items, GROUP_CONCAT(DISTINCT Exercise_Muscle_Group.muscle_group) AS muscle_groups,
        GROUP_CONCAT(DISTINCT Exercise_Fitness_Goals.fitness_goal) AS fitness_goals
    FROM Exercise_Bank
        LEFT JOIN Exercise_Equipment USING (exercise_id)
        LEFT JOIN Exercise_Muscle_Group USING (exercise_id)
        LEFT JOIN Exercise_Fitness_Goals USING (exercise_id)
    WHERE Exercise_Bank.exercise_id = ?
    GROUP BY Exercise_Bank.exercise_id`;

    const exercise_row = await new Promise((resolve, reject) => {
        con.query(sql, [exercise_id], (err, results) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(results?.[0] ?? null);
        });
    });

    if (exercise_row === null) {
        return null;
    }

    return _convert_row_to_exercise(exercise_row);
}


async function get_all_exercises() {
    const sql = `SELECT Exercise_Bank.exercise_id, Exercise_Bank.name, Exercise_Bank.description, Exercise_Bank.created, Exercise_Bank.modified,
        Exercise_Bank.user_who_created_it AS creator_id, Exercise_Bank.difficulty, Exercise_Bank.video_link,
        GROUP_CONCAT(DISTINCT Exercise_Equipment.equipment_item) AS equipment_items, GROUP_CONCAT(DISTINCT Exercise_Muscle_Group.muscle_group) AS muscle_groups,
        GROUP_CONCAT(DISTINCT Exercise_Fitness_Goals.fitness_goal) AS fitness_goals
    FROM Exercise_Bank
        LEFT JOIN Exercise_Equipment USING (exercise_id)
        LEFT JOIN Exercise_Muscle_Group USING (exercise_id)
        LEFT JOIN Exercise_Fitness_Goals USING (exercise_id)
    GROUP BY Exercise_Bank.exercise_id`;

    const exercise_rows = await new Promise((resolve, reject) => {
        con.query(sql, (err, results) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(results);
        });
    });

    return exercise_rows.map(e => _convert_row_to_exercise(e));
}


function _convert_row_to_exercise(exercise_row) {
    return {
        exercise_id: exercise_row.exercise_id,
        name: exercise_row.name,
        description: exercise_row.description,
        created: exercise_row.created,
        modified: exercise_row.modified,
        creator_id: exercise_row.creator_id,
        video_link: exercise_row.video_link,
        difficulty: exercise_row.difficulty,
        equipment_items: exercise_row.equipment_items?.split(',') ?? [],
        muscle_groups: exercise_row.muscle_groups?.split(',') ?? [],
        fitness_goals: exercise_row.fitness_goals?.split(',') ?? [],
    };
}


module.exports = {
    create_workout_plan,
    update_workout_plan,
    delete_workout_plan,
    get_workouts_by_author,
    get_workout_by_id,
    // get_assigned_workout,
    get_exercises_of_workouts,
    get_exercises_by_workout_id,
    create_workout_exercise,
    update_workout_exercise,
    delete_workout_exercise,
    delete_exercises_of_workout
};

// TODO: Remove test code before committing
// const mysql = require("mysql");
// const con = mysql.createConnection({ 
//     host: "localhost",
//     user: "root", //Replace with your user
//     password: "cactusgreen", //Replace with your password
//     database: "cs490_database"
// });

// const create_workout_driver = async () => {
//     const author_id = 2;
//     await create_workout_plan(author_id, "NEW WORKOUT 2");
// }

// const get_workouts_by_author_driver = async () => {
//     const author_id = 2;
//     const workouts = await get_workouts_by_author(author_id);
//     for (const workout of workouts) {
//         console.log(workout);
//     }
// }

// const get_workout_by_id_driver = async () => {
//     const id = 22;
//     const workout = await get_workout_by_id(id);
//     console.log(workout);
// };

// const update_workout_plan_driver = async () => {
//     const new_name = "New Workout Name";
//     const id = 21;
//     await update_workout_plan(id, new_name);
// };

// const delete_workout_plan_driver = async () => {
//     const id = 22;
//     await delete_workout_plan(id);
// };

// const get_exercises_of_workouts_driver = async () => {
//     const ids = [1, 2, 3];
//     const exercises_by_workout = await get_exercises_of_workouts(ids);
//     console.log(exercises_by_workout);
// };

// const get_exercises_by_workout_id_driver = async () => {
//     const id = 21;
//     const exercises = await get_exercises_by_workout_id(id);
//     exercises.forEach(e => console.log(e));
// };

// const create_workout_exercise_driver = async () => {
//     const workout_plan_id = 21;
//     const exercise_id = 44;
//     const details = {
//         weekday: "thursday",
//         time: "10:30:00",
//     };

//     await create_workout_exercise(workout_plan_id, exercise_id, details);
// };

// const update_workout_exercise_driver = async () => {
//     const we_id = 288;
//     const details = {
//         num_sets: null,
//         reps_per_set: null
//     };

//     await update_workout_exercise(we_id, details);
// };

// const delete_workout_exercise_driver = async () => {
//     const we_id = 288;
//     await delete_workout_exercise(we_id);
// };

// const delete_exercises_of_workout_driver = async () => {
//     const workout_plan_id = 21;
//     delete_exercises_of_workout(workout_plan_id);
// };

// const func = async () => {
//     const exercise = await get_exercise_by_id(5);
//     console.log(exercise);
//     con.end();
// };
// func();
