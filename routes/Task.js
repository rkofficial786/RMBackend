// Import the required modules
const express = require("express");
const { createTask, deleteTask, updateTask, markTaskComplete, getTodayTask } = require("../controllers/tasks");
const router = express.Router();

const { auth } = require("../middlewares/auth");

router.get("/get-task", auth, getTodayTask);
router.post("/create-task", auth, createTask);
router.delete("/delete-task/:id", auth, deleteTask);
router.put("/update-task/:id", auth, updateTask);
router.put("/mark-completed/:id",auth ,markTaskComplete)

module.exports = router;
