export function buildVocabularyPrompt(
  topic: string,
  level: string
): { system: string; user: string } {
  const system = `Generate a structured vocabulary list for an English learner.
Include a spread across basic, intermediate, and advanced difficulty, biased
toward the learner's stated level: ${level}.
Respond ONLY with a JSON array, no preamble, no markdown fences, where each item matches:
{
  "word": string,
  "meaning": string,
  "partOfSpeech": string,
  "pronunciation": string,
  "exampleSentence": string,
  "difficulty": "basic" | "intermediate" | "advanced",
  "synonyms": string[],
  "commonMistakes": string[]
}`;

  const user = JSON.stringify({ topic, level });
  return { system, user };
}
