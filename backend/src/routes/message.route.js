import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
  sendMessage,
  getUsersForSidebar,
  getMessages,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);

export default router;
