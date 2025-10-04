const pool = require("../db");

class TaskModel {

    // show all data
    async getAllTasks(){
        const result = await pool.query("SELECT * FROM task ORDER BY create_at DESC");
        return result.rows;
    }
    
    // creating data
    async create(taskData){
        const {
            title,
            is_completed = false,
            category = 'General',
            priority = 'medium',
            note = null, 
            due_date = null,
            reminder = null
        } = taskData

        const result = await pool.query(
            `INSERT INTO task 
            (title, is_completed, category, priority, note, due_date, reminder) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [title, is_completed, category, priority, note , due_date, reminder]
        );
        return result.rows[0];
    }

    // update data
    async update(id, updates){
        const { 
            title, 
            is_completed,
            category,
            priority,
            note, 
            due_date,
            reminder
        } = updates;

        const result = await pool.query(
        `UPDATE task SET 
            title = COALESCE($1, title),
            is_completed = COALESCE($2, is_completed), 
            category = COALESCE($3, category),
            priority = COALESCE($4, priority),
            note = COALESCE($5, note),
            due_date = COALESCE($6, due_date),
            reminder = COALESCE($7, reminder)
        WHERE id = $8 RETURNING *`,
        [title, is_completed, category, priority, note, due_date, reminder, id]
        );
        return result.rows[0];
    }

    async delete(id){
        const result = await pool.query(
            "DELETE FROM task WHERE id = $1 RETURNING *",
            [id]
        )
        return result.rows[0];
    }
}

module.exports = new TaskModel();