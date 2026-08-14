import { NextFunction, Request, Response } from "express";
import { aiProvider } from "../services/ai";
import { savedVocabularyRepository } from "../repositories";
import { AppError } from "../utils/AppError";
import { LearningLevel } from "../types/user";
import { SaveVocabularyInput } from "../types/savedVocabulary";

export async function getVocabulary(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const topic = (req.query.topic as string) ?? "everyday conversation";
    const level = (req.query.level as LearningLevel) ?? "beginner";
    const vocabulary = await aiProvider.generateVocabulary(topic, level);
    res.status(200).json({ success: true, topic, level, vocabulary });
  } catch (err) {
    next(err);
  }
}

export async function saveVocabularyItem(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input = req.body as SaveVocabularyInput;
    const saved = await savedVocabularyRepository.save(req.userId as string, input);
    res.status(201).json({ success: true, saved });
  } catch (err) {
    next(err);
  }
}

export async function listSavedVocabulary(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const saved = await savedVocabularyRepository.listByUser(req.userId as string);
    res.status(200).json({ success: true, saved });
  } catch (err) {
    next(err);
  }
}

export async function removeSavedVocabulary(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const removed = await savedVocabularyRepository.remove(
      req.params.id as string,
      req.userId as string
    );
    if (!removed) {
      throw new AppError("Saved vocabulary item not found.", 404, "SAVED_VOCAB_NOT_FOUND");
    }
    res.status(200).json({ success: true, message: "Removed." });
  } catch (err) {
    next(err);
  }
}
