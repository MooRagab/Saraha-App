import jwt from "jsonwebtoken";
import { userModel } from "../DB/models/user.model.js";

export const auth = () => {
  return async (req, res, next) => {
    try {
      const { authorization } = req.headers;

      // console.log(authorization);

      if (!authorization?.startsWith(process.env.BEARER_KEY)) {
        res.json({ message: "In-Valid Bareaer Key" });
      } else {
        const token = authorization.split(process.env.BEARER_KEY)[1];
        const decoded = jwt.verify(token, process.env.SIGNIN_TOKEN);
        if (!decoded?.id) {
          res.json({ message: "Invalid token payload" });
        } else {
          const user = await userModel
            .findById(decoded.id)
            .select("userName email");
          if (!user) {
            res.json({ message: "invalid token user" });
          } else {
            req.user = user;
            next();
          }
        }
      }
    } catch (error) {
      res.json({ message: "Catch Error", error });
    //   console.log(error);
    }
  };
};
