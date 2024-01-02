// Import the required modules
const express = require("express");
const { createCategory } = require("../controllers/category");
const { auth } = require("../middlewares/auth");
const router = express.Router();

// Route for sending OTP to the user's email
router.post("/create-category", auth, createCategory);

module.exports = router;
