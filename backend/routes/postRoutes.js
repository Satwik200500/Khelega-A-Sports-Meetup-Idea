import express from "express";
import { createPost, getAllPosts, joinPost, leavePost } from "../controllers/postController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createPost);
router.get("/", getAllPosts);
router.put("/:id/join", protect, joinPost);
router.put("/:id/leave", protect, leavePost);

export default router;
