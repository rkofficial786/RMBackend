const mongoose = require("mongoose");

// Journal schema to track daily entries
const journalSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  text: {
    type: String,
    required: true,
  },
});

// Breakpoint schema for goal milestones
const breakpointSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    default: 1,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  completionDate: {
    type: Date,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

// Main goal schema
const goalsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    breakpoints: [breakpointSchema],
    journal: [journalSchema],

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    totalBreakpoints: {
      type: Number,
      default: 0,
    },
    completedBreakpoints: {
      type: Number,
      default: 0,
    },
    overdueBreakpoints: {
      type: Number,
      default: 0,
    },
    progress: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Middleware to auto-update goal stats
goalsSchema.pre("save", function (next) {
  const goal = this;

  // Recalculate total, completed, and overdue breakpoints
  goal.totalBreakpoints = goal.breakpoints.length;
  goal.completedBreakpoints = goal.breakpoints.filter(
    (bp) => bp.completed
  ).length;
  goal.overdueBreakpoints = goal.breakpoints.filter(
    (bp) => !bp.completed && bp.dueDate < Date.now()
  ).length;

  // Calculate progress percentage
  goal.progress = (goal.completedBreakpoints / goal.totalBreakpoints) * 100;

  next();
});

module.exports = mongoose.model("Goals", goalsSchema);
