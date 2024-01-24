import { messagesModel } from "../DB/models/messages.model.js";
import { userModel } from "../DB/models/user.model.js";

export const messagesList = async (req, res) => {
  const message = await messagesModel.find({ isDeleted: false }).populate([
    {
      path: "reciverId",
      select: "userName , email , profilePic",
    },
  ]);
  res.json({ message: " All Messages", message });
};

export const sendMessages = async (req, res) => {
  try {
    const { reciverId } = req.params;
    const { message } = req.body;
    const user = await userModel.findById(reciverId).select("userName");

    if (!user) {
      res.json({ message: "User not found" });
    } else {
      const newMessage = new messagesModel({ text: message, reciverId });
      const savedMessage = await newMessage.save();
      res.json({ message: "Done", savedMessage });
    }
  } catch (error) {
    res.json({ message: "Catch Error", error });
  }
};

export const softDeleteMessages = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const message = await messagesModel.updateOne(
    { _id: id, reciverId: userId },
    { isDeleted: true }
  );
  message.modifiedCount
    ? res.json({ message: "Done" })
    : res.json({ message: "Invalid Message or not auth" });
};
