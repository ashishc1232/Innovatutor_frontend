import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "./AppError";

export interface AuthTokenPayload extends JwtPayload {
  userId: string;
}

export function signAuthToken(userId: string): string {
  if (!env.jwtSecret) {
    throw new AppError(
      "JWT_SECRET is not configured on the server.",
      500,
      "AUTH_CONFIG_ERROR"
    );
  }
  const secret: Secret = env.jwtSecret;
  const options: SignOptions = {
    expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
  };
  return jwt.sign({ userId }, secret, options);
}

export function verifyAuthToken(token: string): AuthTokenPayload {
  if (!env.jwtSecret) {
    throw new AppError(
      "JWT_SECRET is not configured on the server.",
      500,
      "AUTH_CONFIG_ERROR"
    );
  }
  try {
    return jwt.verify(token, env.jwtSecret) as AuthTokenPayload;
  } catch {
    throw new AppError("Invalid or expired token.", 401, "INVALID_TOKEN");
  }
}
