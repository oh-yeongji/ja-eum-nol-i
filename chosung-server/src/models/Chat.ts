import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  roomId: String,
  sender: String,
  message: String,
  type: { type: String, default: "talk" },
  createdAt: { type: Date, default: Date.now },
});

export const Chat = mongoose.model("Chat", chatSchema);
