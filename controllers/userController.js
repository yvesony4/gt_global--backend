import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// login a user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    // create a token
    const token = createToken(user._id);

    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// signup a user
export const signupUser = async (req, res) => {
  const { email, fullNames, password, confirmPassword } = req.body;

  try {
    if (password != confirmPassword) {
      return res.status(400).json({ error: "Password don't match" });
    }
    const user = await User.signup(email, fullNames, password);

    // create a token
    const token = createToken(user._id);

    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

function sendResetEmail(email, token) {
  const mailOptions = {
    from: "noreply@bookly.africa",
    to: email,
    subject: "Password Reset Request",
    text:
      `Hello QT global Software User, \n\n You are receiving this because you have requested the reset of the password for your account.\n\n` +
      `Please use the below token to proceed:\n\n` +
      `${token}\n\n` +
      `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
  };
  return transporter.sendMail(mailOptions);
}

// Forgot password
export const forgot_password = async function (req, res, next) {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.json({ responseCode: 400, responseMessage: "User not found" });
  } else {
    // Generate a reset token and set the token expiration time.
    const token = createToken(user._id);
    const tokenExpiration = Date.now() + 3600000; // Token valid for 1 hour.

    // Update the user's reset token and reset token expiration time in the database.
    user.resetToken = token;
    user.resetTokenExpiration = tokenExpiration;
    await User.findByIdAndUpdate(
      user.id,
      {
        $set: user,
      },
      {
        new: true,
      }
    );

    // Send the reset email with the token.
    sendResetEmail(user.email, token)
      .then(() => {
        return res
          .status(200)
          .json({ message: "Reset email sent successfully." });
      })
      .catch((error) => {
        console.error("Error sending reset email:", error);
        return res.status(500).json({ message: "Error sending reset email." });
      });
  }
};

export const reset_password = async function (req, res) {
  const token = req.body.token;
  const newPassword = req.body.newPassword;
  const confirmPassword = req.body.confirmPassword;

  const user = await User.findOne({ resetToken: req.body.token });

  if (!user) {
    // Invalid or expired token.
    return res.status(400).json({ message: "Invalid or expired token." });
  }

  if (token === user.resetToken) {
    if (newPassword != confirmPassword) {
      return res.status(400).json({ message: "Password do not match" });
    }
    // Reset the user's password with the new one.
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    user.password = hash;
    user.resetToken = null;
    user.resetTokenExpiration = null;
  }

  await User.findByIdAndUpdate(
    user.id,
    {
      $set: user,
    },
    {
      new: true,
    }
  );

  return res.status(200).json({ message: "Password reset successfully" });
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    if (!users) {
      return res.status(400).json({ responseMessage: "no record found" });
    }
    return res.status(200).json(users);
  } catch (err) {
    return res
      .status(400)
      .json({ responseCode: 400, responseMessage: "Error retrieving users" });
  }
};

export default signupUser;
