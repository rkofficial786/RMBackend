const express = require("express");
const cron = require("node-cron");

const app = express();

const userRoutes = require("./routes/User");
const categoryRoutes = require("./routes/Category");
const taskRoutes = require("./routes/Task");
const database = require("./config/database");
const cookieParser = require("cookie-parser");

const cors = require("cors");

const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 4000;

//db connect
database.connect();

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
const task = cron.schedule(
  "0 0 * * *",
  async () => {
    try {
      const currentDate = new Date().toISOString().slice(0, 10);
      
    } catch (error) {
      console.log(error);
    }
  },
  {
    timezone: "Asia/Kolkata",
  }
);
task.start();
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/task", taskRoutes);

//rest api

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is running",
  });
});

app.listen(PORT, () => {
  console.log(`App is ruuning in ${PORT}`);
});
