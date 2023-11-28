import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import taskRoutes from "./routes/taskManager.js";
import userRoutes from "./routes/user.js";

const app = express();
dotenv.config();

// middleware
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes
app.use("/api/tasks", taskRoutes);
app.use("/api/user", userRoutes);
// connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log("connected to db & listening on port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
