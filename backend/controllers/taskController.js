const pool = require("../db"); 

exports.getAllTask = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM task ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createTask = async (req, res) => {
  const { title } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO task (title, is_completed) VALUES ($1, $2) RETURNING *",
      [title, false]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateTask = async (req, res) => {
  const id = parseInt(req.params.id);
  const { title, is_completed } = req.body;

  try {
    const result = await pool.query(
      "UPDATE task SET title = $1, is_completed = $2 WHERE id = $3 RETURNING *",
      [title, is_completed, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

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