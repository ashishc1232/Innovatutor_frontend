import { Router } from "express";
import { body, query } from "express-validator";
import {
  getVocabulary,
  listSavedVocabulary,
  removeSavedVocabulary,
  saveVocabularyItem,
} from "../controllers/vocabulary.controller";
import { protect } from "../middlewares/auth.middleware";
import { aiRateLimiter } from "../middlewares/rateLimit";
import { handleValidationErrors } from "../middlewares/validate";

const router = Router();

router.use(protect);

router.get(
  "/",
  aiRateLimiter,
  [
    query("topic").optional().trim().isLength({ max: 100 }),
    query("level")
      .optional()
      .isIn(["beginner", "elementary", "intermediate", "upper_intermediate", "advanced"]),
  ],
  handleValidationErrors,
  getVocabulary
);

router.get("/saved", listSavedVocabulary);

router.post(
  "/saved",
  [
    body("word").trim().notEmpty().isLength({ max: 100 }),
    body("meaning").trim().notEmpty().isLength({ max: 500 }),
    body("partOfSpeech").trim().notEmpty().isLength({ max: 50 }),
    body("exampleSentence").trim().notEmpty().isLength({ max: 500 }),
    body("difficulty").isIn(["basic", "intermediate", "advanced"]),
  ],
  handleValidationErrors,
  saveVocabularyItem
);

router.delete("/saved/:id", removeSavedVocabulary);

export default router;
