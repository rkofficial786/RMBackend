// Import the required modules
const express = require("express");

const router = express.Router();

const { auth } = require("../middlewares/auth");
const { createGoal, addJournal, addLevel } = require("../controllers/goals");

router.post("/create-goal", auth, createGoal);
// router.delete("/delete-task/:id", auth, deleteTask);
router.put("/add-journal/:goalId", auth, addJournal);
router.put("/add-level/:goalId", auth, addLevel);
// router.put("/mark-completed/:id",auth ,markTaskComplete)

module.exports = router;
