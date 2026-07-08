import express from "express";
import { createPost, getAllPosts, joinPost, leavePost, deletePost, getPostById } from "../controllers/postController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createPost);
router.get("/", getAllPosts);
router.put("/:id/join", protect, joinPost);
router.put("/:id/leave", protect, leavePost);
router.get("/:id", getPostById);
router.delete("/:id", protect, deletePost);

export default router;
