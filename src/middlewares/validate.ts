import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export function handleValidationErrors(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: "Validation failed.",
      errorCode: "VALIDATION_ERROR",
      errors: errors.array().map((e) => ({
        field: "path" in e ? e.path : undefined,
        message: e.msg,
      })),
    });
    return;
  }
  next();
}
