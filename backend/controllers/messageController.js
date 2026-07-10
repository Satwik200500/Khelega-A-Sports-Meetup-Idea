import Message from "../models/Message.js";

export const getMessagesByPost = async (req, res) => {
  try {
    const messages = await Message.find({ post: req.params.postId })
      .populate("sender", "name")
      .sort({ createdAt: 1 });

    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};