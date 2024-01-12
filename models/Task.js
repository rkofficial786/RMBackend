const mongoose = require("mongoose");
const completedSchema = new mongoose.Schema({
  journal: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  dedicationLevel: {
    type: Number,
    required: true,
  },
});
const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  timeRange: {
    start: {
      type: String,
      required: true,
    },
    end: {
      type: String,
      required: true,
    },
  },
  repeat: {
    required: true,
    type: Array,
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  journal: {
    type: String,
  },
  dedicationLevel: {
    type: Number,
    default: 5,
  },
  completed: {
    type: [completedSchema],
    default: false,
  },
  overdue: {
    type: Array,
    default: false,
  },
});

module.exports = mongoose.model("Task", taskSchema);
