/*
  - defining the schema of the task
*/
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    assignee: {
      type: String,
      required: true,
    },
    selectedProject: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      required: true,
    },
    attachedFile: {
      type: String,
    },

    //keeping the user ID who is creating the task
    createdBy: {
      type: String,
    },
  },
  { timestamps: true } // The time when the the record was created
);

export default mongoose.model("Task", taskSchema);
