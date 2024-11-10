const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default:Date.now()
  },
  text: {
    type: String,
    required: true,
  },
});

const breakpointSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
  },
  date: {
    type: Date,
    required: true,
  },
  completed:{
    type:Boolean ,
    default:false
  }
});

const goalsSchema = new mongoose.Schema({
  title: {
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
});

module.exports = mongoose.model("Goals", goalsSchema);
