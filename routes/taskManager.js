import express from "express";
import imgUpload from "./fileUpload.js";

import requireAuth from "../middleware/requireAuth.js";
import getTasks, {
  createTask,
  deleteTask,
  getTask,
  updateTask,
} from "../controllers/taskController.js";

const router = express.Router();

// require auth for all task routes
router.use(requireAuth);

// GET all tasks
router.get("/", getTasks);

//GET a single task
router.get("/:id", getTask);

// POST a new task
router.post("/", imgUpload, createTask);

// DELETE a task
router.delete("/:id", deleteTask);

// UPDATE a task
router.patch("/:id", updateTask);

export default router;
