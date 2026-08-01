import { Router } from "express";
import { randomUUID } from "crypto";
import { askStructured, askStructuredWithImage } from "../openaiClient.js";

const router = Router();
const sessions = new Map();
const MAX_RETRIES = 2;

const startSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    readable: {
      type: "boolean",
      description: "true only if the photo clearly shows a legible homework/study question (text, math problem, diagram with a question, etc.)",
    },
    issue: {
      type: ["string", "null"],
      description: "If readable is false, a one-sentence, friendly explanation of what's wrong (e.g. 'This looks like a logo, not a homework question' or 'The photo is too blurry to read') and what to do. Null if readable is true.",
    },
    problemText: { type: ["string", "null"], description: "The homework question, transcribed from the photo. Null if not readable." },
    subject: { type: ["string", "null"], description: "Null if not readable." },
    conceptExplanation: {
      type: ["string", "null"],
      description: "A simple, step-by-step-style explanation of the concept/method needed — break the approach into small steps like a patient tutor, without giving the final answer. Null if not readable.",
    },
    guidingQuestion: { type: ["string", "null"], description: "A question that prompts the student to attempt solving it themselves. Null if not readable." },
    rubric: { type: ["string", "null"], description: "Private: what a correct final answer/solution must contain. Null if not readable." },
  },
  required: ["readable", "issue", "problemText", "subject", "conceptExplanation", "guidingQuestion", "rubric"],
};

const gradeSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    verdict: { type: "string", enum: ["correct", "partial", "incorrect"] },
    feedback: { type: "string" },
    hint: { type: ["string", "null"] },
  },
  required: ["verdict", "feedback", "hint"],
};

const solutionSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    steps: { type: "array", items: { type: "string" }, description: "The full worked solution, one step per array item" },
    finalAnswer: { type: "string" },
  },
  required: ["steps", "finalAnswer"],
};

const materialsSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shortNotes: { type: "string", description: "One-page revision notes on this topic" },
    flashcards: {
      type: "array",
      minItems: 8,
      maxItems: 8,
      items: {
        type: "object",
        additionalProperties: false,
        properties: { front: { type: "string" }, back: { type: "string" } },
        required: ["front", "back"],
      },
    },
    practiceQuestions: { type: "array", minItems: 10, maxItems: 10, items: { type: "string" }, description: "10 important practice questions on this topic" },
    diagrams: {
      type: "array",
      minItems: 5,
      maxItems: 5,
      items: {
        type: "object",
        additionalProperties: false,
        properties: { title: { type: "string" }, description: { type: "string" } },
        required: ["title", "description"],
      },
    },
    quiz: {
      type: "array",
      minItems: 10,
      maxItems: 10,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          question: { type: "string" },
          options: { type: "array", items: { type: "string" } },
          correctIndex: { type: "number" },
          topic: { type: "string", description: "The sub-topic this question tests, used to identify weak areas" },
        },
        required: ["question", "options", "correctIndex", "topic"],
      },
    },
  },
  required: ["shortNotes", "flashcards", "practiceQuestions", "diagrams", "quiz"],
};

router.post("/start", async (req, res, next) => {
  try {
    const { imageDataUrl, level } = req.body;
    if (!imageDataUrl) return res.status(400).json({ error: "imageDataUrl is required" });

    const result = await askStructuredWithImage({
      schemaName: "homework_start",
      schema: startSchema,
      system:
        "Act as a patient homework tutor. A student uploaded a photo that is supposed to show a homework question. " +
        "FIRST, check whether the photo actually shows a legible homework/study question (readable text, a math problem, a diagram with a question, etc). " +
        "If it does NOT — e.g. it's a logo, an unrelated photo, a blank/mostly-empty image, or too blurry to read — set readable to false, write a one-sentence friendly explanation of what's wrong in issue, and set every other field to null. Do not invent a homework question that isn't there. " +
        "If it DOES show a legible question, set readable to true, issue to null, and: transcribe the question into problemText, identify the subject, then explain the concept/method needed in very simple language, breaking it into small steps like a worked example WITHOUT solving the exact problem or giving the final answer " +
        `(e.g. for "12 x 15", say something like "Let's multiply 12 x 10 = 120 and 12 x 5 = 60, now add them" — showing the method on a similar breakdown, not the final number). ` +
        "Then ask a guiding question that prompts the student to attempt it themselves. Also privately note a rubric of what a correct final answer must contain (never shown to the student).",
      text: `Student level: ${level || "Not specified"}. Here is a photo that should show their homework question.`,
      imageDataUrl,
    });

    if (!result.readable) {
      return res.json({ readable: false, issue: result.issue || "Couldn't read a homework question in that photo — try a clearer, closer photo of just the question." });
    }

    const session = {
      id: randomUUID(),
      problemText: result.problemText,
      subject: result.subject,
      rubric: result.rubric,
      level: level || "Not specified",
      retryCount: 0,
      solved: false,
      materials: null,
      quiz: null,
      quizIndex: 0,
      quizScore: 0,
      quizAnswers: [],
    };
    sessions.set(session.id, session);

    res.json({
      readable: true,
      sessionId: session.id,
      problemText: result.problemText,
      subject: result.subject,
      conceptExplanation: result.conceptExplanation,
      guidingQuestion: result.guidingQuestion,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/check-answer", async (req, res, next) => {
  try {
    const { sessionId, answer } = req.body;
    const session = sessions.get(sessionId);
    if (!session) return res.status(404).json({ error: "Session not found" });

    const grade = await askStructured({
      schemaName: "homework_grade",
      schema: gradeSchema,
      system:
        "Grade the student's attempt at solving their homework problem against the rubric. " +
        "If correct: appreciate them warmly and confirm. If partial: explain what's right and what's missing, give a hint (not the answer). If incorrect: do not reveal the answer — give a step-by-step nudging hint, breaking the next step down simply. Keep tone encouraging, like a patient tutor.",
      user: `Problem: ${session.problemText}\nRubric: ${session.rubric}\nStudent's attempt: ${answer}`,
    });

    if (grade.verdict === "correct") {
      session.solved = true;
      return res.json({ sessionId, verdict: grade.verdict, feedback: grade.feedback, hint: null, retriesLeft: null, revealSolution: null });
    }

    session.retryCount += 1;
    if (session.retryCount > MAX_RETRIES) {
      const solution = await askStructured({
        schemaName: "homework_solution",
        schema: solutionSchema,
        system: "Provide the full worked solution to the homework problem, broken into clear steps a student can follow, ending with the final answer.",
        user: `Problem: ${session.problemText}\nRubric: ${session.rubric}`,
      });
      session.solved = true;
      return res.json({
        sessionId,
        verdict: grade.verdict,
        feedback: grade.feedback + " Let's walk through the full solution together.",
        hint: null,
        retriesLeft: 0,
        revealSolution: solution,
      });
    }

    res.json({
      sessionId,
      verdict: grade.verdict,
      feedback: grade.feedback,
      hint: grade.hint,
      retriesLeft: MAX_RETRIES - session.retryCount + 1,
      revealSolution: null,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/materials", async (req, res, next) => {
  try {
    const { sessionId } = req.body;
    const session = sessions.get(sessionId);
    if (!session) return res.status(404).json({ error: "Session not found" });

    const materials = await askStructured({
      schemaName: "homework_materials",
      schema: materialsSchema,
      system:
        "Act as a homework tutor creating revision materials for the topic behind this problem, suited to the student's level. " +
        "Produce one-page short notes, 8 flashcards (front/back), 10 important practice questions, 5 text-described diagrams to practice, and a 10-question multiple-choice quiz — each quiz question tagged with the sub-topic it tests (for later weak-area detection).",
      user: `Problem: ${session.problemText}\nSubject: ${session.subject}\nStudent level: ${session.level}`,
    });

    session.materials = {
      shortNotes: materials.shortNotes,
      flashcards: materials.flashcards,
      practiceQuestions: materials.practiceQuestions,
      diagrams: materials.diagrams,
    };
    session.quiz = materials.quiz;
    session.quizIndex = 0;
    session.quizScore = 0;
    session.quizAnswers = [];

    res.json({
      sessionId,
      materials: session.materials,
      quizTotal: session.quiz.length,
      firstQuestion: { index: 0, total: session.quiz.length, question: session.quiz[0].question, options: session.quiz[0].options },
    });
  } catch (err) {
    next(err);
  }
});

router.post("/quiz-answer", async (req, res, next) => {
  try {
    const { sessionId, selectedIndex } = req.body;
    const session = sessions.get(sessionId);
    if (!session || !session.quiz) return res.status(404).json({ error: "Session or quiz not found" });

    const q = session.quiz[session.quizIndex];
    const correct = selectedIndex === q.correctIndex;
    if (correct) session.quizScore += 1;
    session.quizAnswers.push({ topic: q.topic, correct });
    session.quizIndex += 1;

    if (session.quizIndex >= session.quiz.length) {
      const weakTopics = [...new Set(session.quizAnswers.filter((a) => !a.correct).map((a) => a.topic))];
      return res.json({
        sessionId,
        correct,
        correctIndex: q.correctIndex,
        done: true,
        score: session.quizScore,
        total: session.quiz.length,
        weakAreas: weakTopics,
      });
    }

    const next_ = session.quiz[session.quizIndex];
    res.json({
      sessionId,
      correct,
      correctIndex: q.correctIndex,
      done: false,
      nextQuestion: { index: session.quizIndex, total: session.quiz.length, question: next_.question, options: next_.options },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
