const express = require("express");
const cron = require("node-cron");

const app = express();

const userRoutes = require("./routes/User");
const categoryRoutes = require("./routes/Category");
const taskRoutes = require("./routes/Task");
const goalRoutes = require("./routes/goals");
const database = require("./config/database");
const Task = require("./models/Task");
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
const formatDate = (date) => {
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayOfWeek = daysOfWeek[date.getDay()];
  return { date: `${year}-${month}-${day}`, day: dayOfWeek };
};
const task = cron.schedule(
  "* * * * *",
  async () => {
    try {
      const currentDate = new Date();
      let previousDate = new Date(currentDate);
      previousDate.setDate(currentDate.getDate());
      const formattedPreviousDate = formatDate(previousDate);
      console.log(formattedPreviousDate)
      const post_date=new Date(formattedPreviousDate.date);
      await Task.updateMany(
        {
          isCompleted: false,
          repeat: { $in: [formattedPreviousDate.day] },
        },
        {
          $push: {
            totalOverdue: {
              date: post_date,
            },
          },
          $set:{
            journal:"",
            dedicationLevel:5,
            isCompleted:false
          }
        }
      );
      await Task.updateMany(
        {
          repeat: { $in: [formattedPreviousDate.day] },
        },
        {
          $set: { isCompleted: false, journal: "", dedicationLevel: 5 },
        }
      );
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
app.use("/api/v1/goals", goalRoutes);

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
