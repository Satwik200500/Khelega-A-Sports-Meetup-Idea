import express from "express";
import { getMessagesByPost } from "../controllers/messageController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:postId", protect, getMessagesByPost);

export default router;