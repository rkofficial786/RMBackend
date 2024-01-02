const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    accountType: {
      type: String,
      enum: ["Admin", "User"],
      required: true,
      default: "User",
    },

    approved: {
      type: String,
    },

    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    goals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Goals",
      },
    ],

    token: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
