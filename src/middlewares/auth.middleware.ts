import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { verifyAuthToken } from "../utils/jwt";

export function protect(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    next(new AppError("Authentication required.", 401, "UNAUTHORIZED"));
    return;
  }

  const token = header.slice("Bearer ".length);
  try {
    const payload = verifyAuthToken(token);
    req.userId = payload.userId;
    next();
  } catch (err) {
    next(err);
  }
}
