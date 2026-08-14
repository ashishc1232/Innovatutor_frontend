import { Router } from "express";
import { getDailyEnglish } from "../controllers/dailyEnglish.controller";

const router = Router();

router.get("/", getDailyEnglish);

export default router;
