import { body } from "express-validator";

export const createConversationValidators = [
  body("mode").optional().isIn(["text", "voice"]).withMessage("mode must be text or voice."),
  body("languageLevel")
    .optional()
    .isIn(["beginner", "elementary", "intermediate", "upper_intermediate", "advanced"])
    .withMessage("Invalid languageLevel."),
];

export const sendMessageValidators = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Message content is required.")
    .isLength({ max: 2000 })
    .withMessage("Message must be under 2000 characters."),
];
