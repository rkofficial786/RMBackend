// Import the required modules
const express = require("express");
const { createTask, deleteTask, updateTask, markTaskComplete, getTodayTask } = require("../controllers/tasks");
const router = express.Router();

const { auth } = require("../middlewares/auth");

router.get("/", auth, getTodayTask);
router.post("/", auth, createTask);
router.delete("/:id", auth, deleteTask);
router.put("/:id", auth, updateTask);
router.put("/mark-completed/:id",auth ,markTaskComplete)

module.exports = router;
