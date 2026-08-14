export type LearningLevel =
  | "beginner"
  | "elementary"
  | "intermediate"
  | "upper_intermediate"
  | "advanced";

export type LearningMode = "text" | "voice";

/**
 * The shape the rest of the app works with. Repository implementations
 * (Mongoose, in-memory) each map their own storage format to/from this.
 */
export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  level: LearningLevel;
  preferredLearningMode: LearningMode;
  preferredTopics: string[];
  dailyGoal: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  name: string;
  email: string;
  passwordHash: string;
}

/** Fields safe to send to the client — never includes passwordHash. */
export type PublicUser = Omit<UserRecord, "passwordHash">;

export function toPublicUser(user: UserRecord): PublicUser {
  const { passwordHash: _passwordHash, ...publicUser } = user;
  return publicUser;
}
