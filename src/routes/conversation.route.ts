import { Router } from "express";
import { analyze, create, getById, list, postMessage, remove } from "../controllers/conversation.controller";
import { protect } from "../middlewares/auth.middleware";
import { aiRateLimiter } from "../middlewares/rateLimit";
import { handleValidationErrors } from "../middlewares/validate";
import {
  createConversationValidators,
  sendMessageValidators,
} from "../validators/conversation.validator";

const router = Router();

router.use(protect);

router.post("/", createConversationValidators, handleValidationErrors, create);
router.get("/", list);
router.get("/:id", getById);
router.delete("/:id", remove);
router.post(
  "/:id/messages",
  aiRateLimiter,
  sendMessageValidators,
  handleValidationErrors,
  postMessage
);
router.post("/:id/analysis", aiRateLimiter, analyze);

export default router;
