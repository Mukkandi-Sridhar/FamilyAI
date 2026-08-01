import { Router } from "express";
import { randomUUID } from "crypto";
import { askStructured } from "../openaiClient.js";

const router = Router();
const sessions = new Map();

const openSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    targetText: { type: "string" },
    translation: { type: "string" },
    instructions: { type: "string", description: "One friendly line telling the student how to respond" },
  },
  required: ["targetText", "translation", "instructions"],
};

const replySchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wasCorrect: { type: "boolean", description: "true if the student's message had no notable grammar/vocab errors" },
    correctedVersion: { type: ["string", "null"], description: "The corrected sentence, only if there was an error" },
    explanation: { type: ["string", "null"], description: "Short, friendly explanation of the correction" },
    newVocab: { type: "array", items: { type: "string" }, description: "0-2 new words/phrases introduced in this turn, formatted 'word — meaning'" },
    aiTargetText: { type: "string", description: "The tutor's next line in the target language, continuing the conversation" },
    aiTranslation: { type: "string" },
    xpEarned: { type: "number", description: "5-20 XP for this turn based on effort/correctness" },
  },
  required: ["wasCorrect", "correctedVersion", "explanation", "newVocab", "aiTargetText", "aiTranslation", "xpEarned"],
};

const summarySchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    vocabList: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: { word: { type: "string" }, meaning: { type: "string" } },
        required: ["word", "meaning"],
      },
    },
    commonMistakes: { type: "array", items: { type: "string" } },
    fluencyNote: { type: "string" },
    suggestedNextSteps: { type: "array", items: { type: "string" } },
  },
  required: ["vocabList", "commonMistakes", "fluencyNote", "suggestedNextSteps"],
};

function badgesFor(session) {
  const badges = [];
  if (session.turns >= 1) badges.push("First Words");
  if (session.turns >= 5) badges.push("5 Turns Club");
  if (session.xp >= 50) badges.push("50 XP");
  if (session.xp >= 100) badges.push("100 XP");
  if (session.bestStreak >= 3) badges.push("3-in-a-row Streak");
  if (session.bestStreak >= 5) badges.push("5-in-a-row Streak");
  return badges;
}

router.post("/start", async (req, res, next) => {
  try {
    const { targetLanguage, nativeLanguage, level, scenario } = req.body;
    if (!targetLanguage || !nativeLanguage || !level || !scenario) {
      return res.status(400).json({ error: "targetLanguage, nativeLanguage, level, and scenario are required" });
    }

    const opening = await askStructured({
      schemaName: "language_open",
      schema: openSchema,
      system:
        `Act as a warm, encouraging ${targetLanguage} conversation tutor for a ${level} student whose native language is ${nativeLanguage}. ` +
        `Start a roleplay conversation for the scenario "${scenario}". Speak first in ${targetLanguage}, keep it short and level-appropriate, and give the ${nativeLanguage} translation plus a one-line instruction on how to reply.`,
      user: `Scenario: ${scenario}`,
    });

    const session = {
      id: randomUUID(),
      targetLanguage,
      nativeLanguage,
      level,
      scenario,
      transcript: [{ role: "tutor", content: opening.targetText }],
      vocab: [],
      mistakes: [],
      xp: 0,
      turns: 0,
      streak: 0,
      bestStreak: 0,
    };
    sessions.set(session.id, session);

    res.json({
      sessionId: session.id,
      openingMessage: { targetText: opening.targetText, translation: opening.translation },
      instructions: opening.instructions,
      xp: 0,
      streak: 0,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/reply", async (req, res, next) => {
  try {
    const { sessionId, message } = req.body;
    const session = sessions.get(sessionId);
    if (!session) return res.status(404).json({ error: "Session not found" });
    if (!message) return res.status(400).json({ error: "message is required" });

    session.transcript.push({ role: "student", content: message });
    const history = session.transcript.map((t) => `${t.role === "student" ? "Student" : "Tutor"}: ${t.content}`).join("\n");

    const result = await askStructured({
      schemaName: "language_turn",
      schema: replySchema,
      system:
        `Act as a warm, encouraging ${session.targetLanguage} conversation tutor for a ${session.level} student (native language ${session.nativeLanguage}), roleplaying the scenario "${session.scenario}". ` +
        "Check the student's last message for grammar/vocabulary errors in the target language. If there's an error, gently correct it and briefly explain why, in an encouraging tone (never harsh). If it's correct, say so warmly. " +
        "Introduce 0-2 new useful words/phrases naturally if it fits. Then continue the roleplay conversation with your next line in the target language plus its translation. Award 5-20 XP for the turn based on effort and correctness.",
      user: `Conversation so far:\n${history}\n\nRespond to the student's latest message.`,
    });

    session.turns += 1;
    session.xp += result.xpEarned;
    if (result.wasCorrect) {
      session.streak += 1;
      session.bestStreak = Math.max(session.bestStreak, session.streak);
    } else {
      session.streak = 0;
      if (result.correctedVersion) session.mistakes.push(result.correctedVersion);
    }
    if (result.newVocab?.length) session.vocab.push(...result.newVocab);
    session.transcript.push({ role: "tutor", content: result.aiTargetText });

    res.json({
      sessionId: session.id,
      wasCorrect: result.wasCorrect,
      correctedVersion: result.correctedVersion,
      explanation: result.explanation,
      newVocab: result.newVocab,
      tutorMessage: { targetText: result.aiTargetText, translation: result.aiTranslation },
      xp: session.xp,
      streak: session.streak,
      badges: badgesFor(session),
    });
  } catch (err) {
    next(err);
  }
});

router.post("/summary", async (req, res, next) => {
  try {
    const { sessionId } = req.body;
    const session = sessions.get(sessionId);
    if (!session) return res.status(404).json({ error: "Session not found" });

    const result = await askStructured({
      schemaName: "language_summary",
      schema: summarySchema,
      system:
        `Act as a ${session.targetLanguage} tutor wrapping up a practice session. Summarize new vocabulary the student encountered, common mistake patterns, an honest but encouraging fluency note, and 2-4 concrete suggested next steps.`,
      user: `Target language: ${session.targetLanguage}\nLevel: ${session.level}\nScenario: ${session.scenario}\nTurns completed: ${session.turns}\nVocab introduced: ${session.vocab.join(", ") || "None"}\nCorrections made: ${session.mistakes.join(" | ") || "None"}`,
    });

    res.json({
      sessionId: session.id,
      ...result,
      totalXp: session.xp,
      bestStreak: session.bestStreak,
      turns: session.turns,
      badges: badgesFor(session),
    });
  } catch (err) {
    next(err);
  }
});

export default router;
