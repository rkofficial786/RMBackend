// Assuming you have a "User" model

const Goals = require("../models/Goals");
const User = require("../models/User");

const createGoal = async (req, res) => {
  try {
    const { title, breakpoints } = req.body;
    const userId = req.user.id; // Assuming you have user information stored in req.user

    // Create the goal with the provided title and breakpoints
    const createdGoal = await Goals.create({
      title,
      breakpoints,
      user: userId,
    });

    // Push the created goal to the user's goals array
    await User.findByIdAndUpdate(userId, {
      $push: { goals: createdGoal._id },
    });

    res.status(201).json({ success: true, data: createdGoal });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const addJournal = async (req, res) => {
  try {
    const { text } = req.body;
    const goalId = req.params.goalId;
    const userId = req.user.id;

    console.log(goalId, "goal");
    console.log(userId, "user");

    // Check if the goal belongs to the authenticated user
    const goal = await Goals.findById(goalId);
    if (!goal || goal.user.toString() !== userId) {
      return res.status(403).json({ success: false, error: "Unauthorized" });
    }

    const currentDateTime = new Date();

    // Create the journal entry with the provided text and current date and time
    const updatedGoal = await Goals.findByIdAndUpdate(
      goalId,
      {
        $push: {
          journal: {
            date: currentDateTime,
            text,
          },
        },
      },
      { new: true }
    );

    res.status(200).json({ success: true, data: updatedGoal });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const addLevel = async (req, res) => {
  try {
    const { level, breakpointId } = req.body;
    const goalId = req.params.goalId;
    const userId = req.user.id; // Assuming you have user information stored in req.user

    // Check if the goal belongs to the authenticated user
    const goal = await Goals.findById(goalId);
    if (!goal || goal.user.toString() !== userId) {
      return res.status(403).json({ success: false, error: "Unauthorized" });
    }
    console.log(breakpointId, "break");
    // Find the specified breakpoint by _id
    const selectedBreakpoint = goal.breakpoints.find(
      (breakpoint) => breakpoint._id.toString() === breakpointId
    );

    if (!selectedBreakpoint) {
      return res
        .status(404)
        .json({ success: false, error: "Breakpoint not found" });
    }

    // Update the level of the selected breakpoint and set completed to true
    selectedBreakpoint.level = level;
    selectedBreakpoint.completed = true;

    await goal.save();

    res.status(200).json({ success: true, data: goal });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

module.exports = { createGoal, addJournal, addLevel };
