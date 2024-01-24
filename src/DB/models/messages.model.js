import mongoose, { Types } from "mongoose";

const messagesSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    reciverId: { type: Types.ObjectId, ref: "User", required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const messagesModel = mongoose.model("Message", messagesSchema);
