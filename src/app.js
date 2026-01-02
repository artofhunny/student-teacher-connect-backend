const express = require("express");
const connectDB = require("./config/database");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://student-teacher-connect-frontend.vercel.app",
    ],
    credentials: true,
  })
);

const authRoute = require("./routes/auth");
const assignmentRoute = require("./routes/assignment");

app.use("/", authRoute);
app.use("/", assignmentRoute);

connectDB().then(() => {
  console.log("Dataase Connected successfully");
  app.listen(process.env.PORT, () =>
    console.log("Project listen successfully")
  );
});
