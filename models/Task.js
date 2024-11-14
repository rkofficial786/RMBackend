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
    min: 1,
    max: 10,
  },
});

const overdueSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
});

const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    timeRange: {
      start: {
        type: Date,
        required: true,
      },
      end: {
        type: Date,
        required: true,
      },
    },
    repeat: {
      type: String,
      required: true,
      enum: ["none", "daily", "weekly", "monthly"],
    },
    repeatDays: {
      type: [String],
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      default: [],
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
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

    isCompleted: {
      type: Boolean,
      default: false,
    },
    completionHistory: {
      type: [completedSchema],
      default: [],
    },
    overdueHistory: {
      type: [overdueSchema],
      default: [],
    },
  },
  { timestamps: true }
);

taskSchema.index({ user: 1 });
taskSchema.index({ isCompleted: 1 });

module.exports = mongoose.model("Task", taskSchema);
