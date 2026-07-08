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