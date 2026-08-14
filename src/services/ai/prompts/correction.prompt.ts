export function buildCorrectionPrompt(sentence: string): {
  system: string;
  user: string;
} {
  const system = `You review a single English sentence written by a language learner.
If it contains a meaningful grammar or usage mistake, return a correction.
If the sentence is already acceptable natural English, return null.
Respond ONLY with JSON, no preamble, no markdown fences, matching exactly:
{ "original": string, "corrected": string, "explanation": string } or null`;

  const user = JSON.stringify({ sentence });
  return { system, user };
}
