import { userRepository } from "../repositories";
import { ProfileUpdateInput } from "../repositories/UserRepository";
import { PublicUser, toPublicUser } from "../types/user";
import { AppError } from "../utils/AppError";
import { signAuthToken } from "../utils/jwt";
import { comparePassword, hashPassword } from "../utils/password";

export interface AuthResult {
  user: PublicUser;
  token: string;
}

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<AuthResult> {
  const existing = await userRepository.findByEmail(email);
  if (existing) {
    throw new AppError(
      "An account with this email already exists.",
      409,
      "EMAIL_IN_USE"
    );
  }

  const passwordHash = await hashPassword(password);
  const user = await userRepository.create({ name, email, passwordHash });
  const token = signAuthToken(user.id);

  return { user: toPublicUser(user), token };
}

export async function loginUser(
  email: string,
  password: string
): Promise<AuthResult> {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new AppError("Invalid email or password.", 401, "INVALID_CREDENTIALS");
  }

  const isMatch = await comparePassword(password, user.passwordHash);
  if (!isMatch) {
    throw new AppError("Invalid email or password.", 401, "INVALID_CREDENTIALS");
  }

  const token = signAuthToken(user.id);
  return { user: toPublicUser(user), token };
}

export async function getCurrentUser(userId: string): Promise<PublicUser> {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new AppError("User not found.", 404, "USER_NOT_FOUND");
  }
  return toPublicUser(user);
}

export async function updateProfile(
  userId: string,
  updates: ProfileUpdateInput
): Promise<PublicUser> {
  const user = await userRepository.updateProfile(userId, updates);
  if (!user) {
    throw new AppError("User not found.", 404, "USER_NOT_FOUND");
  }
  return toPublicUser(user);
}
