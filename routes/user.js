import express from "express";
import {
  forgot_password,
  getUsers,
  loginUser,
  reset_password,
  signupUser,
} from "../controllers/userController.js";

const router = express.Router();

// login route
router.post("/login", loginUser);

// signup route
router.post("/signup", signupUser);

//forgot password
router.post("/forgot_password", forgot_password);

//reset password
router.post("/reset_password", reset_password);

router.get("/fetchUsers", getUsers);

export default router;
