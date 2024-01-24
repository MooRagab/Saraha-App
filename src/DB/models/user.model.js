import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    fName: { type: String },
    lName: { type: String },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    age: { type: Number },
    gender: { type: String, enum: ["Male", "Female"], default: "Male" },
    confirmEmail: { type: Boolean, default: false },
    blocked: { type: Boolean, default: false },
    online: { type: Boolean, default: false },
    profilePic: { type: String },
    coverPics: Array,
    password: { type: String, required: true },
    code: { type: String, default: null },
  },
  { timestamps: true }
);

export const userModel = mongoose.model("User", userSchema);
