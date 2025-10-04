const express = require('express');
const cors = require('cors');
const taskRoutes = require("./routes/taskRouter");

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json()); 

// Routes
app.use('/tasks', taskRoutes);

const PORT =  3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});