import { NextFunction, Request, Response } from "express";
import { getCurrentUser, loginUser, registerUser, updateProfile } from "../services/auth.service";
import { ProfileUpdateInput } from "../repositories/UserRepository";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { name, email, password } = req.body as {
      name: string;
      email: string;
      password: string;
    };
    const result = await registerUser(name, email, password);
    res.status(201).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const result = await loginUser(email, password);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

export async function me(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // req.userId is attached by the `protect` auth middleware.
    const user = await getCurrentUser(req.userId as string);
    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
}

export function logout(req: Request, res: Response): void {
  // JWTs are stateless — "logout" is a client-side token discard. This
  // endpoint exists for API completeness and as a hook point for a future
  // token-blocklist if one is ever needed.
  res.status(200).json({ success: true, message: "Logged out." });
}

export async function updateMe(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const updates = req.body as ProfileUpdateInput;
    const user = await updateProfile(req.userId as string, updates);
    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
}
