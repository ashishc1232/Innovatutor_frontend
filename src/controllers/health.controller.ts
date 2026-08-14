import { Request, Response } from "express";
import { getHealthStatus } from "../services/health.service";

export function getHealth(req: Request, res: Response): void {
  const status = getHealthStatus();
  res.status(200).json({
    success: true,
    ...status,
  });
}
