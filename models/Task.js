const mongoose = require("mongoose");
const { boolean } = require("webidl-conversions");

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
    monday: {
      type: Boolean,
      default: false,
    },
    tuesday: {
      type: Boolean,
      default: false,
    },
    wednesday: {
      type: Boolean,
      default: false,
    },
    thursday: {
      type: Boolean,
      default: false,
    },
    friday: {
      type: Boolean,
      default: false,
    },
    saturday: {
      type: Boolean,
      default: false,
    },
    sunday: {
      type: Boolean,
      default: false,
    },
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
    type: Boolean,
    default: false,
  },
  overdue: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Task", taskSchema);
