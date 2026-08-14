import { NextFunction, Request, Response } from "express";
import {
  analyzeConversationById,
  createConversation,
  deleteConversation,
  getConversation,
  listConversations,
  sendMessage,
} from "../services/conversation.service";
import { LearningLevel, LearningMode } from "../types/user";

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { mode, languageLevel } = req.body as {
      mode?: LearningMode;
      languageLevel?: LearningLevel;
    };
    const conversation = await createConversation(req.userId as string, mode, languageLevel);
    res.status(201).json({ success: true, conversation });
  } catch (err) {
    next(err);
  }
}

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const conversations = await listConversations(req.userId as string);
    res.status(200).json({ success: true, conversations });
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const conversation = await getConversation(req.params.id as string, req.userId as string);
    res.status(200).json({ success: true, conversation });
  } catch (err) {
    next(err);
  }
}

export async function postMessage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { content, languageLevel, inputType } = req.body as {
      content: string;
      languageLevel?: LearningLevel;
      inputType?: "text" | "voice";
    };
    const conversation = await sendMessage(
      req.params.id as string,
      req.userId as string,
      content,
      languageLevel ?? "beginner",
      inputType ?? "text"
    );
    res.status(200).json({ success: true, conversation });
  } catch (err) {
    next(err);
  }
}

export async function analyze(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const analysis = await analyzeConversationById(
      req.params.id as string,
      req.userId as string
    );
    res.status(200).json({ success: true, analysis });
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await deleteConversation(req.params.id as string, req.userId as string);
    res.status(200).json({ success: true, message: "Conversation deleted." });
  } catch (err) {
    next(err);
  }
}
