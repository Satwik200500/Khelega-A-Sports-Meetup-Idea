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