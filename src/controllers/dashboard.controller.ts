import { NextFunction, Request, Response } from "express";
import { getDashboardSummary } from "../services/dashboard.service";

export async function getDashboard(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const summary = await getDashboardSummary(req.userId as string);
    res.status(200).json({ success: true, ...summary });
  } catch (err) {
    next(err);
  }
}
