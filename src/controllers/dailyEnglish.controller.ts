import { Request, Response } from "express";
import { dailyEnglishCategories } from "../data/dailyEnglish";

export function getDailyEnglish(req: Request, res: Response): void {
  const categoryId = req.query.category as string | undefined;
  if (categoryId) {
    const category = dailyEnglishCategories.find((c) => c.id === categoryId);
    res.status(200).json({ success: true, categories: category ? [category] : [] });
    return;
  }
  res.status(200).json({ success: true, categories: dailyEnglishCategories });
}
