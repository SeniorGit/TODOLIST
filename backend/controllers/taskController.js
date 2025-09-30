// import database configuration
const pool = require("../db"); 

// show all to do list 
exports.getAllTask = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM task ORDER BY create_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error getAllTask" });
  }
};

// creating to do list
exports.createTask = async (req, res) => {
  const { 
    title,
    category = 'General',
    priority = 'medium',
    note, 
    due_date,
    reminder
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO task 
      (title, is_completed, category, priority, note, due_date, reminder) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [title, false, category, priority, note || null, due_date || null, reminder || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error createTask" });
  }
};

// Update to do list
exports.updateTask = async (req, res) => {
  const id = parseInt(req.params.id);
  const { 
    title, 
    is_completed,
    category,
    priority,
    note, 
    due_date,
    reminder
  } = req.body;

  try {
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

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error Update" });
  }
};

// delete task 
exports.deleteTask = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const result = await pool.query(
      "DELETE FROM task WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};