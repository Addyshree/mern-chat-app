import jwt from "jsonwebtoken";
import User from "../modals/user.modal.js";

//first check if there is token or not//jwt encoded user id - cookie me jwt liy the
//then check for valid token and decode it
//after decoding check if it is correct or not match with userid saved in db
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorised - No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorised - Invalid token" });
    }

    const user = await User.findById(decoded.userId).select("-password"); //mius krke deslect  kr rhe password

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    //if user authenticated
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware :", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
