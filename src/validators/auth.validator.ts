import { body } from "express-validator";

export const registerValidators = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ max: 100 })
    .withMessage("Name must be under 100 characters."),
  body("email").trim().isEmail().withMessage("A valid email is required.").normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters."),
];

export const loginValidators = [
  body("email").trim().isEmail().withMessage("A valid email is required.").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required."),
];

export const updateProfileValidators = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty.")
    .isLength({ max: 100 })
    .withMessage("Name must be under 100 characters."),
  body("level")
    .optional()
    .isIn(["beginner", "elementary", "intermediate", "upper_intermediate", "advanced"])
    .withMessage("Invalid level."),
  body("preferredLearningMode")
    .optional()
    .isIn(["text", "voice"])
    .withMessage("preferredLearningMode must be text or voice."),
  body("preferredTopics")
    .optional()
    .isArray({ max: 20 })
    .withMessage("preferredTopics must be a list of up to 20 items."),
  body("preferredTopics.*").optional().isString().isLength({ max: 50 }),
  body("dailyGoal")
    .optional({ nullable: true })
    .isString()
    .isLength({ max: 200 })
    .withMessage("dailyGoal must be under 200 characters."),
];
