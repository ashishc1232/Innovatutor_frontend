export interface DailySentence {
  sentence: string;
  meaning: string;
  usage: string;
  difficulty: "basic" | "intermediate" | "advanced";
  alternatives: string[];
}

export interface DailyCategory {
  id: string;
  name: string;
  sentences: DailySentence[];
}

export const dailyEnglishCategories: DailyCategory[] = [
  {
    id: "morning-routine",
    name: "Morning Routine",
    sentences: [
      {
        sentence: "I woke up early today.",
        meaning: "You got out of sleep early in the morning.",
        usage: "Use this to describe when your day started.",
        difficulty: "basic",
        alternatives: ["I got up early today.", "I was up before sunrise."],
      },
      {
        sentence: "I need to get ready for work.",
        meaning: "You have to prepare yourself before leaving for work.",
        usage: "Common when you're rushing in the morning.",
        difficulty: "basic",
        alternatives: ["I have to get dressed for work.", "I'm getting ready to head out."],
      },
      {
        sentence: "Let me grab a quick breakfast.",
        meaning: "You want to eat something fast before leaving.",
        usage: "Casual, used when short on time.",
        difficulty: "intermediate",
        alternatives: ["I'll eat something quick.", "Let me have a bite before I go."],
      },
    ],
  },
  {
    id: "restaurant",
    name: "Restaurant",
    sentences: [
      {
        sentence: "Could I see the menu, please?",
        meaning: "A polite way to ask for the list of food options.",
        usage: "Say this right after being seated.",
        difficulty: "basic",
        alternatives: ["May I have the menu?", "Can you bring the menu, please?"],
      },
      {
        sentence: "I'd like to order the grilled chicken.",
        meaning: "You are choosing a specific dish.",
        usage: "Use when the waiter asks what you'd like to eat.",
        difficulty: "basic",
        alternatives: ["I'll have the grilled chicken.", "Can I get the grilled chicken?"],
      },
      {
        sentence: "Could we get the bill, please?",
        meaning: "You are asking for the check at the end of the meal.",
        usage: "Say this when you're ready to pay and leave.",
        difficulty: "intermediate",
        alternatives: ["Can we have the check?", "Could you bring the bill over?"],
      },
    ],
  },
  {
    id: "asking-for-directions",
    name: "Asking for Directions",
    sentences: [
      {
        sentence: "Excuse me, how do I get to the station?",
        meaning: "You are asking someone for directions to a location.",
        usage: "Polite opener when approaching a stranger for help.",
        difficulty: "basic",
        alternatives: ["Sorry, could you tell me the way to the station?", "Which way is the station?"],
      },
      {
        sentence: "Is it within walking distance?",
        meaning: "You want to know if the place is close enough to walk to.",
        usage: "Follow-up question after getting directions.",
        difficulty: "intermediate",
        alternatives: ["Can I walk there?", "Is it far from here?"],
      },
      {
        sentence: "Turn left at the next intersection.",
        meaning: "An instruction telling someone which way to turn.",
        usage: "Use this when giving directions to someone else.",
        difficulty: "intermediate",
        alternatives: ["Take a left at the next crossing.", "Go left when you reach the junction."],
      },
    ],
  },
  {
    id: "shopping",
    name: "Shopping",
    sentences: [
      {
        sentence: "How much does this cost?",
        meaning: "You are asking for the price of an item.",
        usage: "Basic, direct question while shopping.",
        difficulty: "basic",
        alternatives: ["What's the price of this?", "How much is this?"],
      },
      {
        sentence: "Do you have this in a different size?",
        meaning: "You want to know if another size is available.",
        usage: "Common in clothing stores.",
        difficulty: "intermediate",
        alternatives: ["Is this available in another size?", "Do you have a bigger/smaller one?"],
      },
      {
        sentence: "I'm just browsing, thank you.",
        meaning: "You're looking around without intending to buy right now.",
        usage: "Polite way to decline help from a salesperson.",
        difficulty: "intermediate",
        alternatives: ["I'm just looking, thanks.", "Just checking things out for now."],
      },
    ],
  },
  {
    id: "small-talk",
    name: "Small Talk",
    sentences: [
      {
        sentence: "How has your day been so far?",
        meaning: "A friendly way to ask about someone's day.",
        usage: "Common opener in casual conversation.",
        difficulty: "basic",
        alternatives: ["How's your day going?", "How's it been today?"],
      },
      {
        sentence: "It's been quite busy, but good overall.",
        meaning: "A typical response describing a moderately hectic but positive day.",
        usage: "Use this as a natural reply to a small-talk question.",
        difficulty: "intermediate",
        alternatives: ["Pretty hectic, but I can't complain.", "Busy as always, but going well."],
      },
      {
        sentence: "We should catch up sometime soon.",
        meaning: "A suggestion to meet or talk again in the near future.",
        usage: "Common way to end a friendly conversation.",
        difficulty: "advanced",
        alternatives: ["Let's meet up again soon.", "We should grab coffee sometime."],
      },
    ],
  },
  {
    id: "interview",
    name: "Interview",
    sentences: [
      {
        sentence: "Tell me a little about yourself.",
        meaning: "An invitation to give a brief personal/professional introduction.",
        usage: "Extremely common opening interview question.",
        difficulty: "basic",
        alternatives: ["Could you introduce yourself?", "Walk me through your background."],
      },
      {
        sentence: "What are your greatest strengths?",
        meaning: "The interviewer wants to know your best professional qualities.",
        usage: "Standard interview question — prepare specific examples.",
        difficulty: "intermediate",
        alternatives: ["What would you say you're best at?", "What are you particularly good at?"],
      },
      {
        sentence: "Do you have any questions for us?",
        meaning: "The interviewer is inviting you to ask about the role or company.",
        usage: "Almost always asked at the end — always have a question ready.",
        difficulty: "advanced",
        alternatives: ["Is there anything you'd like to ask?", "Any questions on your end?"],
      },
    ],
  },
];
