import { messagesModel } from "../../../DB/models/messages.model.js";
import { userModel } from "../../../DB/models/user.model.js";
import bcrypt from "bcrypt";
import cloudinary from "../../../services/cloudinary.js";

export const profile = async (req, res) => {
  const user = await userModel.findById(req.user._id);
  res.json({ message: "Done", user });
};

export const userMessage = async (req, res) => {
  const messages = await messagesModel.find({ reciverId: req.user._id });
  res.json({ message: "Done", messages });
};

export const getShareProfile = async (req, res) => {
  const { id } = req.params;
  const user = await userModel.findById(id).select("userName email profilePic");
  user
    ? res.json({ message: "Done", user })
    : res.json({ message: "In-Valid Profile" });
};

export const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await userModel.findById(req.user._id);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      res.json({ message: "Wrong Old Password" });
    } else {
      const newHash = await bcrypt.hash(
        newPassword,
        parseInt(process.env.saltRound)
      );
      const updatedUser = await userModel.updateOne(
        { _id: user._id },
        { password: newHash }
      );
      updatedUser.modifiedCount
        ? res.json({ message: "Updated" })
        : res.json({ message: "Fail To Update" });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const uploadProfilePic = async (req, res) => {
  if (!req.file) {
    res.status(400).json({ message: "plz upload ur file" });
  } else {
    // const imageUrl = req.file.destination + "/" + req.file.filename;
    const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
      folder: `user/profile/${req.user._id}`,
    });
    await userModel.updateOne(
      { _id: req.user._id },
      { profilePic: secure_url }
    );
    res.status(200).json({ message: "Done", secure_url });
  }
};
