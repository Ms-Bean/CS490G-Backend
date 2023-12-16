const connection = require("./conn");
const con = connection.con;

// Define the WorkoutProgress model object
const WorkoutProgress = function (workoutProgress) {
    this.user_id = workoutProgress.user_id;
    this.workout_exercise_id = workoutProgress.workout_exercise_id;
    this.set_number = workoutProgress.set_number;
    this.date = workoutProgress.date;
    this.weight = workoutProgress.weight;
    this.reps = workoutProgress.reps;
};

WorkoutProgress.create = async (newWorkProgress) => {
    const sql = `insert into Workout_Progress (user_id, workout_exercise_id, set_number, date, weight, reps)
                    values (?, ?, ?, ?, ?, ?)`;
    const { user_id, workout_exercise_id, set_number, date, weight, reps } = newWorkProgress;

    try {
        console.log("HERE GOES");
        const result = await new Promise((resolve, reject) => {
            con.query("SELECT set_number FROM Workout_Progress WHERE user_id = ? AND workout_exercise_id = ? AND date = ? ORDER BY set_number DESC LIMIT 1", [user_id, workout_exercise_id, date], (err, setnum) =>{
                if(err)
                {
                    console.log(err);
                    reject(err);
                    return;
                }
                console.log(setnum);
                let add;
                if(setnum.length == 0)
                {
                    add = 0
                }
                else
                {
                    add = setnum[0].set_number;
                }
                console.log("ABOUT TO INSERT");
                console.log(sql, [user_id, workout_exercise_id, add + 1, date, weight, reps])
                con.query(sql, [user_id, workout_exercise_id, add + 1, date, weight, reps], (err, results) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(results.insertId);
                });
            })
        });

        return new WorkoutProgress({ ...newWorkProgress, workout_progress_id: result });
    } catch (error) {
        throw error;
    }
};


WorkoutProgress.getAll = async () => {
    const sql = "SELECT * FROM Workout_Progress";

    try {
        const results = await new Promise((resolve, reject) => {
            con.query(sql, (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        });

        if (results.length === 0) {
            return null;
        }

        // Map the database results to WorkoutProgress instances
        const workoutProgressList = results.map((row) => new WorkoutProgress(row));
        return workoutProgressList;
    } catch (error) {
        throw error;
    }
};

WorkoutProgress.getAllByUserId = async (userId) => {
    const sql = "SELECT * FROM Workout_Progress WHERE user_id = ?";

    try {
        const results = await new Promise((resolve, reject) => {
            con.query(sql, [userId], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        });

        if (results.length === 0) {
            return null;
        }

        // Map the database results to WorkoutProgress instances
        const workoutProgressList = results.map((row) => new WorkoutProgress(row));
        return workoutProgressList;
    } catch (error) {
        throw error;
    }
};

WorkoutProgress.getAllByUserIdAndExercise = async (userId, workout_exercise_id) => {
    const sql = `SELECT * FROM Workout_Progress where user_id = ? AND workout_exercise_id = ?`
    try {
        const results = await new Promise((resolve, reject) => {
            con.query(sql, [userId, workout_exercise_id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        });

        if (results.length === 0) {
            return null;
        }

        // Map the database results to WorkoutProgress instances
        const workoutProgressList = results.map((row) => new WorkoutProgress(row));
        return workoutProgressList;
    } catch (error) {
        throw error;
    }
};

WorkoutProgress.getByKeys = async (user_id, workout_exercise_id, set_number, date) => {
    const sql = "SELECT * FROM Workout_Progress WHERE user_id = ? AND workout_exercise_id = ? AND set_number = ? AND date = ?";

    try {
        const results = await new Promise((resolve, reject) => {
            con.query(sql, [user_id, workout_exercise_id, set_number, date], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        });

        if (results.length === 0) {
            return null; // No matching entry found
        }

        // Assuming you expect only one matching entry, map it to a WorkoutProgress instance
        const workoutProgress = new WorkoutProgress(results[0]);
        return workoutProgress;
    } catch (error) {
        throw error;
    }
};

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

WorkoutProgress.update = async (workout_progress) => {
    const {user_id, workout_exercise_id, set_number, date, weight, reps} = workout_progress;
    const {set_clause, args} = _get_update_args({set_number, weight, reps});

    const sql = `UPDATE Workout_Progress
                SET ${set_clause}
                WHERE user_id = ?
                AND workout_exercise_id = ?
                AND date = ?`
    args.push(user_id);
    args.push(workout_exercise_id);
    args.push(date);

    try {
        // Execute the update query
        const result = await new Promise((resolve, reject) => {
            con.query(sql, args, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });

        // Return the result if needed
        return result;
    } catch (error) {
        // Handle any errors that may have occurred during the update
        console.error('Error updating workout progress:', error);
        throw error; // Rethrow the error to propagate it to the calling code if needed
    }
    
}

WorkoutProgress.deleteByKeys = async (user_id, workout_exercise_id, set_number, date) => {
    const sql = "DELETE FROM Workout_Progress WHERE user_id = ? AND workout_exercise_id = ? AND set_number = ? AND date = ?";

    try {
        const result = await new Promise((resolve, reject) => {
            your_pool.query(sql, [user_id, workout_exercise_id, set_number, date], (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results.affectedRows);
            });
        });

        return result > 0; // Return true if at least one row was deleted
    } catch (error) {
        throw error;
    }
};


module.exports = WorkoutProgress;