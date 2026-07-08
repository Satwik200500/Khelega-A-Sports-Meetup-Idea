import Post from "../models/Post.js";

export const createPost = async (req, res) => {
  try {
    const { sport, location, dateTime, playersNeeded, hasEquipment } = req.body;

    const newPost = await Post.create({
      sport,
      location,
      dateTime,
      playersNeeded,
      hasEquipment,
      createdBy: req.userId,
    });

    res.status(201).json({
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: posts.length,
      posts,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const joinPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.status !== "open") {
      return res.status(400).json({ message: "This post is no longer open for joining" });
    }

    const alreadyJoined = post.playersJoined.some(
      (playerId) => playerId.toString() === req.userId
    );
    if (alreadyJoined) {
      return res.status(400).json({ message: "You have already joined this post" });
    }

    if (post.playersJoined.length >= post.playersNeeded) {
      return res.status(400).json({ message: "This post is already full" });
    }

    post.playersJoined.push(req.userId);

    if (post.playersJoined.length >= post.playersNeeded) {
      post.status = "full";
    }

    await post.save();

    res.status(200).json({
      message: "Joined post successfully",
      post,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const leavePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const hasJoined = post.playersJoined.some(
      (playerId) => playerId.toString() === req.userId
    );
    if (!hasJoined) {
      return res.status(400).json({ message: "You have not joined this post" });
    }

    post.playersJoined = post.playersJoined.filter(
      (playerId) => playerId.toString() !== req.userId
    );

    if (post.status === "full") {
      post.status = "open";
    }

    await post.save();

    res.status(200).json({
      message: "Left post successfully",
      post,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: "You are not authorized to delete this post" });
    }

    await post.deleteOne();

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("playersJoined", "name email");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ post });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};