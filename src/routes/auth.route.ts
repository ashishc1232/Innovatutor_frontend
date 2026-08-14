import { Router } from "express";
import { login, logout, me, register, updateMe } from "../controllers/auth.controller";
import { protect } from "../middlewares/auth.middleware";
import { authRateLimiter } from "../middlewares/rateLimit";
import { handleValidationErrors } from "../middlewares/validate";
import { loginValidators, registerValidators, updateProfileValidators } from "../validators/auth.validator";

const router = Router();

router.post(
  "/register",
  authRateLimiter,
  registerValidators,
  handleValidationErrors,
  register
);
router.post("/login", authRateLimiter, loginValidators, handleValidationErrors, login);
router.get("/me", protect, me);
router.patch("/me", protect, updateProfileValidators, handleValidationErrors, updateMe);
router.post("/logout", protect, logout);

export default router;
