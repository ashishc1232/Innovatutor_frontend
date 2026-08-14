import { Router } from "express";
import authRoute from "../auth.route";
import conversationRoute from "../conversation.route";
import dailyEnglishRoute from "../dailyEnglish.route";
import dashboardRoute from "../dashboard.route";
import healthRoute from "../health.route";
import vocabularyRoute from "../vocabulary.route";

const router = Router();

router.use("/health", healthRoute);
router.use("/auth", authRoute);
router.use("/conversations", conversationRoute);
router.use("/vocabulary", vocabularyRoute);
router.use("/daily-english", dailyEnglishRoute);
router.use("/dashboard", dashboardRoute);

export default router;
