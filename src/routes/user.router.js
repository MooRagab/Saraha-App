import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { validation } from "../middleware/validation.js";
import {
  getShareProfile,
  profile,
  updatePassword,
  uploadProfilePic,
  userMessage,
} from "./controller/userController.js";
import * as validators from "../validation/user.validation.js";
import { HME, multerValidation, myMulter } from "../services/multer.js";

const router = Router();
router.patch(
  "/profile/pic",
  auth(),
  myMulter(multerValidation.image).single("image"),
  HME,
  uploadProfilePic
);
router.get("/profile", validation(validators.checkToken), auth(), profile);
router.get("/messages", validation(validators.checkToken), auth(), userMessage);
router.get("/profile/share/:id", getShareProfile);
router.patch("/password", auth(), updatePassword);

export default router;