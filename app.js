import dotenv from "dotenv";
dotenv.config();
import express from "express";
import * as indexRouter from "./modules/index.router.js";
import connectDB from "./DB/connection.js";
const app = express();
app.use(express.json());
const port = 3000;
const baseURL = process.env.BASEURL;

connectDB();
app.use(`${baseURL}/upload`, express.static("./upload"));
app.use(`${baseURL}/user`, indexRouter.userRouter);
app.use(`${baseURL}/auth`, indexRouter.authRouter);
app.use(`${baseURL}/messages`, indexRouter.messagesRouter);

app.use("*", (req, res) => {
  res.json({ message: "In-Valid URL" });
});

app.listen(port, () => console.log("Ez to Go"));
