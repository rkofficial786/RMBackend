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
      unique: true,
    },
    phone: {
      type: Number,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    timeSpent: {
      allTime: { type: Number, default: 0 },
      thisMonth: { type: Number, default: 0 },
      today: { type: Number, default: 0 },
    },
    accountType: {
      type: String,
      enum: ["Admin", "User"],
      required: true,
      default: "User",
    },
    approved: {
      type: Boolean,
      default: false,
    },

    bday: {
      type: Date,
    },

    token: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },

    streak: {
      currentStreak: { type: Number, default: 0 },
      highestStreak: { type: Number, default: 0 },
      lastActiveDate: { type: Date },
    },
    points: {
      totalPoints: { type: Number, default: 0 },
      earnedThisMonth: { type: Number, default: 0 },
      transactions: [
        {
          date: { type: Date, default: Date.now },
          points: { type: Number },
          description: { type: String },
        },
      ],
    },

    achievements: [
      {
        title: { type: String },
        description: { type: String },
        dateEarned: { type: Date, default: Date.now },
      },
    ],
    progressUpdates: [
      {
        date: { type: Date, default: Date.now },
        update: { type: String },
      },
    ],

    subscription: {
      plan: { type: String, enum: ["Free", "Pro", "Premium"], default: "Free" },
      startDate: { type: Date },
      endDate: { type: Date },
      isActive: { type: Boolean, default: false },
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
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],

    focusSessions: [
      {
        sessionName: { type: String },
        startTime: { type: Date },
        endTime: { type: Date },
        duration: { type: Number },
      },
    ],

    reminders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reminders",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
