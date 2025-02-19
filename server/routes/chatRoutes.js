import express from "express";
import { createChat, getUserChats } from "../controllers/chatController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createChat);
router.get("/", authMiddleware, getUserChats);

export default router;
