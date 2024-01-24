import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { validation } from "../middleware/validation.js";
import {
  getShareProfile,
  profile,
  updatePassword,
  uploadProfilePic,
  userMessage,
} from "../controllers/userController.js";
import * as validators from "../validation/user.validation.js";
import { fileValidation, myMulter } from "../services/multer.js";

const router = Router();

router.use(auth());
router.get("/profile/share/:id", getShareProfile);
router.patch(
  "/profile/pic",
  myMulter(fileValidation.image).single("image"),
  uploadProfilePic
);
router.get("/profile", validation(validators.checkToken), profile);
router.get("/messages", validation(validators.checkToken), userMessage);
router.patch("/password", updatePassword);

export default router;
