const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique:true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required:true
  },

  Task: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
});

// Export the Tags model
module.exports = mongoose.model("Category", categorySchema);
