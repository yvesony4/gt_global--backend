import jwt from "jsonwebtoken"; // Library to create the token to authorize the user to access resources
import User from "../models/userModel.js";

const requireAuth = async (req, res, next) => {
  // Check if the user is authenticated
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];

  try {
    //Verifying the token against the secret key defined as the environment variable
    const { _id } = jwt.verify(token, process.env.SECRET);

    req.user = await User.findOne({ _id }).select("_id");
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Request is not authorized" });
  }
};

export default requireAuth;
