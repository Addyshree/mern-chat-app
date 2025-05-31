import express from "express";
const router = express.Router();
import {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

//dont want to update all user profile
//we should authenticate the use to update it
//if request have jwt token so they are authenticate user

router.put("/updateProfile", protectRoute, updateProfile);
//if user  not authenticated we so cant call check
router.get("/check", protectRoute, checkAuth);
export default router;
