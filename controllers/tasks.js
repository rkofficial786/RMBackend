const Category = require("../models/Category");
const Task = require("../models/Task");
const User = require("../models/User");
const updateTaskOverdueStatus = require("../utils/overdueStatus");

exports.getTodayTask = async (req, res) => {
  try {
    // Create a new Date object
    const today = new Date();

    // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const dayOfWeek = today.getDay();

    // Create an array of weekdays
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Get today's day as a string
    const todayString = daysOfWeek[dayOfWeek];
    const userId = req.user.id;
    const data=await Task.find({user:userId,repeat: { $in: [todayString] }})
    return res.status(200).json({
      success: true,
      allTodayTask:data,
      message: "Task Fetched Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { name, description, timeRange, repeat, category } = req.body;
    if (!name || !description || !repeat || !timeRange || !category) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const userId = req.user.id;

    const userDetails = await User.findById(userId);

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User Details Not Found",
      });
    }
    const categoryDetails = await Category.findById(category);

    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category Details Not Found",
      });
    }

    const newTask = await Task.create({
      name,
      description,
      user: userDetails._id,
      timeRange,
      repeat,
      category: categoryDetails._id,
    });

    await User.findByIdAndUpdate(
      {
        _id: userDetails._id,
      },
      {
        $push: {
          tasks: newTask._id,
        },
      },
      { new: true }
    );

    await Category.findByIdAndUpdate(
      { _id: categoryDetails._id },
      {
        $push: {
          Task: newTask._id,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      newTask,
      message: "Task Created Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;

    console.log(taskId, "id");

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task Not Found",
      });
    }

    // Ensure that the task belongs to the authenticated user
    if (task.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to delete this task",
      });
    }

    // Remove task from user's tasks array
    await User.findByIdAndUpdate(userId, {
      $pull: {
        tasks: taskId,
      },
    });

    // Remove task from category's tasks array
    await Category.findByIdAndUpdate(task.category, {
      $pull: {
        Task: taskId,
      },
    });

    // Delete the task
    await Task.findByIdAndDelete(taskId);

    return res.status(200).json({
      success: true,
      message: "Task Deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;

    const { name, description, timeRange, repeat, category } = req.body;

    // Check if the task exists
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task Not Found",
      });
    }

    // Ensure that the task belongs to the authenticated user
    if (task.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to update this task",
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        $set: {
          name,
          description,
          timeRange,
          repeat,
          category,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      updatedTask,
      message: "Task Updated Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const formatDate = (date) => {
  const day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayOfWeek = daysOfWeek[date.getDay()];
  return { date: `${day} + "-" + ${month} + "-" + ${year}`, day: dayOfWeek };
};
exports.markTaskComplete = async (req, res) => {
  try {
    const currentDate = new Date();
    const formattedPreviousDate = formatDate(currentDate);
    const taskId = req.params.id;
    const userId = req.user.id;

    const { journal, dedicationLevel } = req.body;

    // Check if the task exists
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task Not Found",
      });
    }

    // Ensure that the task belongs to the authenticated user
    if (task.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to mark this task as complete",
      });
    }

    // Update task with completed status and optional journal/dedicationLevel
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        $set: {
          completed: true,
          journal: journal || "",
          dedicationLevel: dedicationLevel || task.dedicationLevel,
        },
        $push: {
          totalCompleted: {
            journal: journal || "",
            dedicationLevel: dedicationLevel || task.dedicationLevel,
            date: formattedPreviousDate.date,
          },
        },
      },
      { new: true }
    );

    //await updateTaskOverdueStatus(updatedTask);

    return res.status(200).json({
      success: true,
      updatedTask,
      message: "Task Marked as Complete Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
