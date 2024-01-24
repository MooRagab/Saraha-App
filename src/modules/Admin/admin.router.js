import { Router } from "express";
import * as validators from "./admin.validation.js";
import {
  confirmEmail,
  signIn,
  signUp,
  sendCode,
  forgetPassword,
  refreshEmailConfirmation,
} from "./controller/registerController.js";
import { validation } from "../../middleware/validation.js";

const router = Router();

router.post("/signUp", validation(validators.signUp), signUp);
router.get("/confirmEmail/:token",validation(validators.checkToken), confirmEmail);
router.post("/signIn", validation(validators.signIn), signIn);
router.patch("/sendCode", sendCode);
router.patch("/forgetPassword", forgetPassword);
router.get("/refToken/:token", refreshEmailConfirmation);

export default router;
