import Task from "../models/taskModel.js";
import mongoose from "mongoose";

// get all tasks
const getTasks = async (req, res) => {
  const createdBy = req.user.id;
  const tasks = await Task.find({ createdBy }).sort({ createdAt: -1 });
  res.status(200).json(tasks);
};

// get a single task
export const getTask = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such task" });
  }

  const task = await Task.findById(id);

  if (!task) {
    return res.status(404).json({ error: "No such task" });
  }

  res.status(200).json(task);
};

// create new task
export const createTask = async (req, res) => {
  const {
    title,
    startDate,
    endDate,
    assignee,
    selectedProject,
    description,
    priority,
  } = req.body;

  const url = req.protocol + "://" + req.get("host");

  let emptyFields = [];
  if (!title) {
    emptyFields.push("title");
  }
  if (!startDate) {
    emptyFields.push("startDate");
  }
  if (!endDate) {
    emptyFields.push("endDate");
  }
  if (!assignee) {
    emptyFields.push("assignee");
  }
  if (!selectedProject) {
    emptyFields.push("selectedProject");
  }
  if (!description) {
    emptyFields.push("description");
  }
  if (!priority) {
    emptyFields.push("priority");
  }
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the fields", emptyFields });
  }

  // add the task to the database
  try {
    const createdBy = req.user.id;
    const attachedFile = url + "/public/" + Date.now();
    const task = await Task.create({
      title,
      startDate,
      endDate,
      assignee,
      selectedProject,
      description,
      priority,
      createdBy,
      attachedFile,
    });
    res.status(200).json(task);
  } catch (error) {
    console.log("This is the error message" + error);
    res.status(400).json({ error: error.message });
  }
};

// delete a task
export const deleteTask = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such task" });
  }

  const task = await Task.findOneAndDelete({ _id: id });

  if (!task) {
    return res.status(400).json({ error: "No such task" });
  }

  res.status(200).json(task);
};

// update a task
export const updateTask = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such task" });
  }

  const task = await Task.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  if (!task) {
    return res.status(400).json({ error: "No such task" });
  }

  res
    .status(200)
    .json({ responseCode: 200, responseMessage: "task updated successfully" });
};

export default getTasks;
