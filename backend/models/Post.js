import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    sport: {
      type: String,
      required: true,
      enum: ["Football", "Cricket", "Badminton", "Basketball", "Volleyball", "Tennis", "Other"],
    },
    location: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
      required: false,
    },
    longitude: {
      type: Number,
      required: false,
   },
    dateTime: {
      type: Date,
      required: true,
    },
    playersNeeded: {
      type: Number,
      required: true,
      min: 1,
    },
    playersJoined: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    hasEquipment: {
      type: Boolean,
      required: true,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "full", "completed", "cancelled"],
      default: "open",
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

export default Post;