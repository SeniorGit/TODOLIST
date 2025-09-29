const express = require("express");
const taskRouter = express.Router();
const taskController = require("../controllers/taskController")


taskRouter.get("/", taskController.getAllTask);
taskRouter.post("/", taskController.createTask);
taskRouter.put("/:id", taskController.updateTask);
taskRouter.delete("/:id", taskController.deleteTask);

module.exports = taskRouter;