import { userModel } from "../DB/models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import { sendEmail } from "../services/email.js";

export const signUp = async (req, res) => {
  const { userName, email, password } = req.body;
  const user = await userModel.findOne({ email }).select("email");
  if (user) {
    res.json({ message: "Email is already In Use" });
  } else {
    const hashPassword = await bcrypt.hash(
      password,
      parseInt(process.env.saltRound)
    );
    const neswUser = new userModel({
      email,
      userName,
      password: hashPassword,
    });
    const savedUser = await neswUser.save();
    const token = jwt.sign({ id: savedUser._id }, process.env.emailToken, {
      expiresIn: 60 * 60,
    });
    const rfToken = jwt.sign({ id: savedUser._id }, process.env.emailToken);
    const link = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmEmail/${token}`;
    const linkRf = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/refToken/${rfToken}`;
    sendEmail(
      email,
      "ConfirmationEmail",
      `<a href = '${link}'>Follow Me To Confirm your Acc</a> <br> 
       <a href = '${linkRf}'>Re-Confirmation Email</a>`
    );
    savedUser
      ? res.json({ message: "Done" })
      : res.json({ message: "Fail to signUp" });
  }
};

export const confirmEmail = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) {
      res.json({ message: "In-valid Token" });
    } else {
      const decoded = jwt.verify(token, process.env.emailToken);
      if (!decoded?.id) {
        res.json({ message: "In-valid token payload " });
      } else {
        const user = await userModel.updateOne(
          { _id: decoded.id, confirmEmail: false },
          { confirmEmail: true }
        );
        user.modifiedCount
          ? res.json({ message: "Done plz process to login page" })
          : res.json({ message: "Already Confirmed" });
      }
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    res.json({ message: "In-Valid Account" });
  } else {
    if (!user.confirmEmail) {
      res.json({ message: "Please Confirm Email" });
    } else {
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        res.json({ message: "Invalid Password" });
      } else {
        const token = jwt.sign(
          { id: user._id, isloggedIn: true },
          process.env.loginToken
        );
        await userModel.updateOne({ _id: user._id }, { online: true });
        res.json({ message: "Done", token });
      }
    }
  }
};

export const sendCode = async (req, res) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email }).select("email");
  if (!user) {
    res.json({ message: "In-Valid Email" });
  } else {
    const code = nanoid();
    // const code = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
    myEmail(email, "Forget Password", `<h1>Access Code : ${code}</h1>`);
    const updatedUser = await userModel.updateOne(
      { _id: user._id },
      { code: code }
    );
    updatedUser.modifiedCount
      ? res.json({ message: "Done" })
      : res.json({ message: "Fail" });
  }
};

export const forgetPassword = async (req, res) => {
  const { code, newPassword, email } = req.body;
  if (code == null) {
    res.json({ message: "In-Valid Code" });
  } else {
    const hashPassword = await bcrypt.hash(
      newPassword,
      parseInt(process.env.saltRound)
    );
    const user = await userModel.updateOne(
      { email, code },
      { password: hashPassword, code: null }
    );
    user.modifiedCount
      ? res.json({ message: "Done" })
      : res.json({ message: "In-valid Code" });
  }
};

export const refreshEmailConfirmation = async (req, res) => {
  const { token } = req.params;
  const decoded = jwt.verify(token, process.env.emailToken);
  if (!decoded?.id) {
    res.json({ message: "In-Valid Token PayLoad" });
  } else {
    const user = await userModel
      .findById(decoded.id)
      .select("email confirmEmail");
    if (!user) {
      res.json({ message: "Not Registred Accoint" });
    } else {
      if (user.confirmEmail) {
        res.json({ message: "Already Confirmed" });
      } else {
        const token = jwt.sign({ id: user._id }, process.env.emailToken, {
          expiresIn: 60 * 5,
        });

        const link = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmEmail/${token}`;

        myEmail(
          user.email,
          "ConfirmationEmail",
          `<a href = '${link}'>Follow Me To Confirm your Acc</a> `
        );

        res.json({ message: "Done" });
      }
    }
  }
};
