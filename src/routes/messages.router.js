import { Router } from "express";

import {
  messagesList,
  sendMessages,
  softDeleteMessages,
} from "./controller/messageController.js";
import * as valdators from "../validation/messages.validation.js";
import { auth } from "../middleware/auth.js";
import { validation } from "../middleware/validation.js";

const router = Router();

router.get("/", messagesList);
router.post("/:reciverId", validation(valdators.sendMessage), sendMessages);
router.patch("/:id", auth(), softDeleteMessages);

export default router;
