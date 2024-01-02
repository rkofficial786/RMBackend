const Task = require("../models/Task");

async function updateTaskOverdueStatus(task) {
    try {
      if (task.completed || task.overdue) {
        return;
      }
  
      const currentDate = moment();
      const taskEndTime = moment(task.timeRange.end, 'h:mm A');
  
      // Check if the task is overdue based on repeat and completion
      if (
        isTaskOverdueOnDay(currentDate, task.repeat, taskEndTime) &&
        !task.completed
      ) {
        await Task.findByIdAndUpdate(task._id, { $set: { overdue: true } });
      }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
          });
    }
  }
  
  
// Helper function to check if the task is overdue on the current day
function isTaskOverdueOnDay(currentDate, repeat, taskEndTime) {
    const dayOfWeek = currentDate.format('dddd').toLowerCase();
  
    if (!repeat[dayOfWeek]) {
      // Task is not scheduled for the current day
      return false;
    }
  
    const updateWindowStart = taskEndTime.clone().subtract(24, 'hours');
    const updateWindowEnd = taskEndTime.clone();
  
    return currentDate.isAfter(updateWindowEnd) && currentDate.isAfter(taskEndTime);
  }
  

  module.exports = updateTaskOverdueStatus;