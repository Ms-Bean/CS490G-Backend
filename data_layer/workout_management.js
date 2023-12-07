// TODO: Assign and Unassign workout plans
// TODO: Test getting assigned workout plans
// TODO: Wrap DELETE queries in transactions, due to effect of cascading
// TODO: Learn how to deal with time without the date

const exercise_data_layer = require("./exercise");
const connection = require("./conn");
const con = connection.con;

class WorkoutPlan {
    constructor({workout_plan_id = 0, name = "", author_id = 0, exercises = null}) {
        this.workout_plan_id = workout_plan_id;
        this.name = name;
        this.author_id = author_id;
        this.exercises = exercises;
    }
}

class WorkoutPlanExercise {
    constructor({workout_plan_exercise_id = 0, workout_plan_id = 0, weekday = "sunday", time = "00:00:00",
                reps_per_set = null, num_sets = null, weight = null, exercise = null}) {
        this.workout_plan_exercise_id = workout_plan_exercise_id;
        this.workout_plan_id = workout_plan_id;
        this.weekday = weekday;
        this.time = time;
        this.reps_per_set = reps_per_set;
        this.num_sets = num_sets;
        this.weight = weight;
        this.exercise = exercise;
    }

    get exercise_id() {
        return this.exercise?.exercise_id ?? 0;
    }
}


async function create_workout_plan(wp) {
    const sql = "INSERT INTO Workout_Plans (name, user_who_created_it) VALUES (?, ?)";
    const {name, author_id} = wp;
    const workout_plan_id = await new Promise((resolve, reject) => {
        con.query(sql, [name, author_id], (err, results) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(results.insertId);
        });
    });

    return new WorkoutPlan({workout_plan_id, name, author_id});
}


async function update_workout_plan(workout_plan) {
    const sql = "UPDATE Workout_Plans SET name = ? WHERE workout_plan_id = ?";
    const {workout_plan_id, name} = workout_plan;
    await new Promise((resolve, reject) => {
        con.query(sql, [name, workout_plan_id], (err) => {
            if (err) {
                reject(err);
                return;
            }

            resolve();
        });
    });

    return get_workout_by_id(workout_plan_id);
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

            const workouts = results.map(r => new WorkoutPlan(r));
            resolve(workouts);
        });
    });
}


async function get_exercises_of_workouts(workout_plan_ids) {
    const sql = `SELECT wpe.id, wpe.workout_plan_id, wpe.exercise_id, wpe.weekday, wpe.time,
        wpe.reps_per_set, wpe.num_sets, wpe.weight
    FROM Workout_Plan_Exercises wpe
    WHERE workout_plan_id IN (?)
    GROUP BY wpe.id`;
    const results = await new Promise((resolve, reject) => {
        con.query(sql, [workout_plan_ids], (err, results) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(results);
        });
    });

    const exercises = await Promise.all(results.map(async r => new WorkoutPlanExercise({
        workout_plan_exercise_id: r.id,
        workout_plan_id: r.workout_plan_id,
        weekday: r.weekday,
        time: r.time,
        reps_per_set: r.reps_per_set,
        num_sets: r.num_sets,
        weight: r.weight,
        exercise: await exercise_data_layer.get_exercise_by_id_data_layer(r.exercise_id)
    })));

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


async function create_workout_exercise(wpe) {
    const sql = `INSERT INTO Workout_Plan_Exercises
        (workout_plan_id, exercise_id, weekday, time, reps_per_set, num_sets, weight)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const {workout_plan_id, exercise_id, weekday, time, reps_per_set, num_sets, weight} = wpe;
    const args = [workout_plan_id, exercise_id, weekday, time, reps_per_set, num_sets, weight];
    const results = await new Promise((resolve, reject) => {
        con.query(sql, args, (err, results) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(results);
        });
    });

    return new WorkoutPlanExercise({
        workout_plan_exercise_id: results.insertId,
        workout_plan_id: wpe.workout_plan_id,
        weekday: wpe.weekday,
        time: wpe.time,
        reps_per_set: wpe.reps_per_set,
        num_sets: wpe.num_sets,
        weight: wpe.weight,
        exercise: wpe.exercise
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


async function update_workout_exercise(wpe) {
    const {exercise_id, weekday, time, reps_per_set, num_sets, weight, workout_plan_exercise_id} = wpe;
    const {set_clause, args} = _get_update_args({exercise_id, weekday, time, reps_per_set, num_sets, weight});
    const sql = `UPDATE Workout_Plan_Exercises
        SET ${set_clause}
        WHERE id = ?`;
    args.push(workout_plan_exercise_id);
    await new Promise((resolve, reject) => {
        con.query(sql, args, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });

    return new WorkoutPlanExercise({
        workout_plan_exercise_id: wpe.workout_plan_exercise_id,
        workout_plan_id: wpe.workout_plan_id,
        weekday: wpe.weekday,
        time: wpe.time,
        reps_per_set: wpe.reps_per_set,
        num_sets: wpe.num_sets,
        weight: wpe.weight,
        exercise: await exercise_data_layer.get_exercise_by_id_data_layer(wpe.exercise_id)
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


async function get_workout_exercise_by_id(workout_plan_exercise_id) {
    const sql = `SELECT wpe.id, wpe.workout_plan_id, wpe.exercise_id, wpe.weekday, wpe.time,
        wpe.reps_per_set, wpe.num_sets, wpe.weight
    FROM Workout_Plan_Exercises wpe
    WHERE wpe.id = ?
    GROUP BY wpe.id`;

    const results = await new Promise((resolve, reject) => {
        con.query(sql, [workout_plan_exercise_id], (err, results) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(results);
        });
    });

    if (results.length === 0) {
        return null;
    }

    const row = results[0];
    const wpe = new WorkoutPlanExercise({
        workout_plan_exercise_id: row.id,
        workout_plan_id: row.workout_plan_id,
        weekday: row.weekday,
        time: row.time,
        reps_per_set: row.reps_per_set,
        num_sets: row.num_sets,
        weight: row.weight,
        exercise: await exercise_data_layer.get_exercise_by_id_data_layer(row.exercise_id)
    });

    return wpe;
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
    delete_exercises_of_workout,
    get_workout_exercise_by_id,
    WorkoutPlanExercise,
    WorkoutPlan
};
