import Message from "./models/Message.js";
import Post from "./models/Post.js";

export const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("joinPostRoom", ({ postId }) => {
      socket.join(postId);
    });

    socket.on("leavePostRoom", ({ postId }) => {
      socket.leave(postId);
    });

    socket.on("sendMessage", async ({ postId, userId, text }) => {
      try {
        const post = await Post.findById(postId);
        if (!post) return;

        const isParticipant =
          post.createdBy.toString() === userId ||
          post.playersJoined.some((p) => p.toString() === userId);

        if (!isParticipant) return;

        const message = await Message.create({
          post: postId,
          sender: userId,
          text,
        });

        const populatedMessage = await message.populate("sender", "name");

        io.to(postId).emit("newMessage", populatedMessage);
      } catch (error) {
        console.error("Error sending message:", error.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });
};