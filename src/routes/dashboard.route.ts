import { Router } from "express";
import { getDashboard } from "../controllers/dashboard.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", protect, getDashboard);

export default router;
