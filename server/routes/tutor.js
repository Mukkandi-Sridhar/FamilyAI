import { Router } from "express";
import { randomUUID } from "crypto";
import { askStructured } from "../openaiClient.js";

const router = Router();
const sessions = new Map();
const MAX_RETRIES = 2;

const planSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    modules: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: { type: "string" },
          storyHook: { type: "string" },
          explanation: { type: "string" },
          questions: {
            type: "array",
            minItems: 2,
            maxItems: 2,
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                question: { type: "string" },
                rubric: { type: "string" },
              },
              required: ["question", "rubric"],
            },
          },
        },
        required: ["title", "storyHook", "explanation", "questions"],
      },
    },
  },
  required: ["modules"],
};

const gradeSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    verdict: { type: "string", enum: ["correct", "partial", "incorrect"] },
    feedback: { type: "string" },
    hint: { type: ["string", "null"] },
    followUpQuestion: { type: ["string", "null"] },
  },
  required: ["verdict", "feedback", "hint", "followUpQuestion"],
};

// Split into three independent schemas (fired in parallel) instead of one giant
// call — smaller, more reliable structured-output calls, and lower latency
// since they run concurrently rather than one huge sequential generation.

const coreMaterialsSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    summary: { type: "string" },
    definitions: {
      type: "array",
      minItems: 5,
      maxItems: 8,
      items: {
        type: "object",
        additionalProperties: false,
        properties: { term: { type: "string" }, definition: { type: "string" } },
        required: ["term", "definition"],
      },
    },
    formulae: {
      type: "array",
      minItems: 0,
      maxItems: 6,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: { type: "string" },
          formula: { type: "string" },
          description: { type: "string" },
        },
        required: ["name", "formula", "description"],
      },
    },
    diagrams: {
      type: "array",
      minItems: 1,
      maxItems: 3,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: { type: "string" },
          description: {
            type: "string",
            description: "A text-based labeled diagram the student can visualize or sketch (arrows, labels, layout described in words).",
          },
        },
        required: ["title", "description"],
      },
    },
    mnemonics: {
      type: "array",
      minItems: 3,
      maxItems: 5,
      items: {
        type: "object",
        additionalProperties: false,
        properties: { concept: { type: "string" }, trick: { type: "string" } },
        required: ["concept", "trick"],
      },
    },
    mindMap: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          topic: { type: "string" },
          points: { type: "array", items: { type: "string" } },
        },
        required: ["topic", "points"],
      },
    },
    keyPoints: { type: "array", minItems: 10, maxItems: 10, items: { type: "string" } },
    revisionNotes: { type: "string" },
    commonMistakes: { type: "array", minItems: 5, maxItems: 5, items: { type: "string" } },
    lastMinuteExamTips: { type: "array", minItems: 5, maxItems: 5, items: { type: "string" } },
  },
  required: [
    "summary",
    "definitions",
    "formulae",
    "diagrams",
    "mnemonics",
    "mindMap",
    "keyPoints",
    "revisionNotes",
    "commonMistakes",
    "lastMinuteExamTips",
  ],
};

const ASSERTION_REASON_OPTIONS = [
  "Both A and R are true, and R is the correct explanation of A",
  "Both A and R are true, but R is NOT the correct explanation of A",
  "A is true, but R is false",
  "A is false, but R is true",
];

const practiceBankSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    faqQuestions: {
      type: "array",
      minItems: 5,
      maxItems: 8,
      items: {
        type: "object",
        additionalProperties: false,
        properties: { question: { type: "string" }, answer: { type: "string" } },
        required: ["question", "answer"],
      },
    },
    twoMarkQuestions: {
      type: "array",
      minItems: 5,
      maxItems: 5,
      items: {
        type: "object",
        additionalProperties: false,
        properties: { question: { type: "string" }, answer: { type: "string" } },
        required: ["question", "answer"],
      },
    },
    threeMarkQuestions: {
      type: "array",
      minItems: 5,
      maxItems: 5,
      items: {
        type: "object",
        additionalProperties: false,
        properties: { question: { type: "string" }, answer: { type: "string" } },
        required: ["question", "answer"],
      },
    },
    fiveMarkQuestions: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: {
        type: "object",
        additionalProperties: false,
        properties: { question: { type: "string" }, answer: { type: "string" } },
        required: ["question", "answer"],
      },
    },
    caseStudyQuestions: {
      type: "array",
      minItems: 2,
      maxItems: 2,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          scenario: { type: "string" },
          questions: { type: "array", minItems: 3, maxItems: 3, items: { type: "string" } },
        },
        required: ["scenario", "questions"],
      },
    },
    assertionReasonQuestions: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          assertion: { type: "string" },
          reason: { type: "string" },
          correctOption: { type: "string", enum: ASSERTION_REASON_OPTIONS },
          explanation: { type: "string" },
        },
        required: ["assertion", "reason", "correctOption", "explanation"],
      },
    },
    mcqs: {
      type: "array",
      minItems: 5,
      maxItems: 5,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          question: { type: "string" },
          options: { type: "array", items: { type: "string" } },
          correctIndex: { type: "number" },
        },
        required: ["question", "options", "correctIndex"],
      },
    },
    fillBlanks: {
      type: "array",
      minItems: 5,
      maxItems: 5,
      items: {
        type: "object",
        additionalProperties: false,
        properties: { sentence: { type: "string" }, answer: { type: "string" } },
        required: ["sentence", "answer"],
      },
    },
    matchTheFollowing: {
      type: "object",
      additionalProperties: false,
      properties: {
        leftColumn: { type: "array", minItems: 5, maxItems: 5, items: { type: "string" } },
        rightColumn: {
          type: "array",
          minItems: 5,
          maxItems: 5,
          items: { type: "string" },
          description: "The right-hand matches, shuffled out of order.",
        },
        correctPairs: {
          type: "array",
          minItems: 5,
          maxItems: 5,
          items: {
            type: "object",
            additionalProperties: false,
            properties: { left: { type: "string" }, right: { type: "string" } },
            required: ["left", "right"],
          },
        },
      },
      required: ["leftColumn", "rightColumn", "correctPairs"],
    },
    trueFalse: {
      type: "array",
      minItems: 5,
      maxItems: 5,
      items: {
        type: "object",
        additionalProperties: false,
        properties: { statement: { type: "string" }, answer: { type: "boolean" } },
        required: ["statement", "answer"],
      },
    },
    oneWordAnswers: {
      type: "array",
      minItems: 5,
      maxItems: 5,
      items: {
        type: "object",
        additionalProperties: false,
        properties: { question: { type: "string" }, answer: { type: "string" } },
        required: ["question", "answer"],
      },
    },
    applicationQuestions: { type: "array", minItems: 3, maxItems: 3, items: { type: "string" } },
    hotsQuestions: { type: "array", minItems: 2, maxItems: 2, items: { type: "string" } },
  },
  required: [
    "faqQuestions",
    "twoMarkQuestions",
    "threeMarkQuestions",
    "fiveMarkQuestions",
    "caseStudyQuestions",
    "assertionReasonQuestions",
    "mcqs",
    "fillBlanks",
    "matchTheFollowing",
    "trueFalse",
    "oneWordAnswers",
    "applicationQuestions",
    "hotsQuestions",
  ],
};

const assessmentBankSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    questions: {
      type: "array",
      minItems: 25,
      maxItems: 25,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          type: { type: "string", enum: ["mcq", "short", "long", "application", "hots"] },
          question: { type: "string" },
          options: { type: "array", items: { type: "string" } },
          rubric: { type: "string" },
        },
        required: ["type", "question", "options", "rubric"],
      },
    },
  },
  required: ["questions"],
};

const assessGradeSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    verdict: { type: "string", enum: ["correct", "partial", "incorrect"] },
    explanation: { type: "string" },
  },
  required: ["verdict", "explanation"],
};

const finalReportSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scoreOutOf100: { type: "number" },
    strengths: { type: "array", items: { type: "string" } },
    weaknesses: { type: "array", items: { type: "string" } },
    revisionPlan: { type: "string" },
    daysRecommended: { type: "number" },
    encouragement: { type: "string" },
  },
  required: ["scoreOutOf100", "strengths", "weaknesses", "revisionPlan", "daysRecommended", "encouragement"],
};

const extraPracticeSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    questions: {
      type: "array",
      minItems: 15,
      maxItems: 15,
      items: {
        type: "object",
        additionalProperties: false,
        properties: { topic: { type: "string" }, question: { type: "string" } },
        required: ["topic", "question"],
      },
    },
  },
  required: ["questions"],
};

function currentModule(session) {
  return session.modules[session.moduleIndex];
}
function currentQuestionRubric(session) {
  return currentModule(session).questions[session.questionIndex].rubric;
}
function progress(session) {
  return { module: session.moduleIndex + 1, totalModules: session.modules.length };
}
function lessonPayload(session, extra = {}) {
  const mod = currentModule(session);
  return {
    sessionId: session.id,
    stage: "lesson",
    progress: progress(session),
    module: { title: mod.title, storyHook: mod.storyHook, explanation: mod.explanation },
    question: session.currentQuestionText,
    ...extra,
  };
}

router.post("/start", async (req, res, next) => {
  try {
    const { board, className, subject, chapter, level } = req.body;
    if (!board || !className || !subject || !chapter || !level) {
      return res.status(400).json({ error: "board, className, subject, chapter, level are required" });
    }

    const plan = await askStructured({
      schemaName: "lesson_plan",
      schema: planSchema,
      system:
        "Act as an experienced, patient teacher with 20+ years of experience on the given exam board. " +
        "Break the chapter into exactly 3 short learning modules, one concept each, ordered simplest to hardest for the student's level. " +
        "Each module needs: a short, interesting real-life story or analogy that introduces the concept (storyHook), a simple explanation suited to the student's level (explanation), and exactly 2 check questions each with a private grading rubric describing what a correct answer must contain (never reveal the rubric to the student).",
      user: `Board: ${board}\nClass: ${className}\nSubject: ${subject}\nChapter: ${chapter}\nStudent level: ${level}`,
    });

    const session = {
      id: randomUUID(),
      meta: { board, className, subject, chapter, level },
      modules: plan.modules,
      moduleIndex: 0,
      questionIndex: 0,
      retryCount: 0,
      currentQuestionText: plan.modules[0].questions[0].question,
      stage: "lesson",
      scorecard: { correct: 0, partial: 0, incorrect: 0 },
      materials: null,
      assessment: null,
    };
    sessions.set(session.id, session);

    res.json(lessonPayload(session));
  } catch (err) {
    next(err);
  }
});

router.post("/answer", async (req, res, next) => {
  try {
    const { sessionId, answer } = req.body;
    const session = sessions.get(sessionId);
    if (!session) return res.status(404).json({ error: "Session not found" });
    if (session.stage !== "lesson") return res.status(400).json({ error: "Session is not in lesson stage" });

    const mod = currentModule(session);
    const rubric = currentQuestionRubric(session);

    const grade = await askStructured({
      schemaName: "answer_grade",
      schema: gradeSchema,
      system:
        "You are grading a student's spoken answer to a check-understanding question during a lesson. " +
        "Classify as correct, partial, or incorrect against the rubric. " +
        "If correct: warmly appreciate them, briefly reinforce the concept, set hint and followUpQuestion to null. " +
        "If partial: explain what they got right and what they missed, then set followUpQuestion to a new, similar question probing the missed part; hint should be null. " +
        "If incorrect: do NOT reveal the answer; give a hint or simpler analogy in hint, and set followUpQuestion to a new question after that hint. Keep tone friendly and encouraging, suited to the student's level.",
      user: `Concept: ${mod.title}\nQuestion asked: ${session.currentQuestionText}\nGrading rubric: ${rubric}\nStudent's answer: ${answer}\nStudent level: ${session.meta.level}`,
    });

    session.scorecard[grade.verdict] += 1;

    if (grade.verdict === "correct" || session.retryCount >= MAX_RETRIES) {
      const movedOn = session.retryCount >= MAX_RETRIES && grade.verdict !== "correct";
      session.retryCount = 0;
      session.questionIndex += 1;

      if (session.questionIndex >= mod.questions.length) {
        session.moduleIndex += 1;
        session.questionIndex = 0;

        if (session.moduleIndex >= session.modules.length) {
          session.stage = "summary";
          return res.json({
            sessionId: session.id,
            stage: "summary",
            feedback: grade.feedback + (movedOn ? " Let's move on and revisit this in your revision notes." : ""),
            scorecard: session.scorecard,
          });
        }
      }

      session.currentQuestionText = currentModule(session).questions[session.questionIndex].question;
      return res.json(
        lessonPayload(session, {
          feedback: grade.feedback + (movedOn ? " Let's move on and revisit this in your revision notes." : ""),
        })
      );
    }

    session.retryCount += 1;
    session.currentQuestionText = grade.followUpQuestion || session.currentQuestionText;
    res.json(lessonPayload(session, { feedback: grade.feedback, hint: grade.hint }));
  } catch (err) {
    next(err);
  }
});

router.post("/summary", async (req, res, next) => {
  try {
    const { sessionId } = req.body;
    const session = sessions.get(sessionId);
    if (!session) return res.status(404).json({ error: "Session not found" });
    if (session.stage !== "summary") return res.status(400).json({ error: "Lesson not finished yet" });

    const moduleDigest = session.modules.map((m) => `${m.title}: ${m.explanation}`).join("\n");
    const context = `Board: ${session.meta.board}\nClass: ${session.meta.className}\nSubject: ${session.meta.subject}\nChapter: ${session.meta.chapter}\nStudent level: ${session.meta.level}\n\nModules covered:\n${moduleDigest}`;

    const [core, practice, assessmentBank] = await Promise.all([
      askStructured({
        schemaName: "core_materials",
        schema: coreMaterialsSchema,
        system:
          "Act as an experienced exam-board teacher wrapping up a chapter. Produce core revision materials: " +
          "a one-page chapter summary, important definitions, important formulae (empty array if the chapter has none), 1-3 text-described diagrams the student can visualize, memory tricks/mnemonics, a mind map (topics with bullet points), the 10 most important key points, condensed revision notes, 5 common mistakes students make on this topic, and 5 last-minute exam tips.",
        user: context,
      }),
      askStructured({
        schemaName: "practice_bank",
        schema: practiceBankSchema,
        system:
          "Act as an experienced exam-board teacher building a revision practice bank for a chapter (answers may be shown, this is for self-study, not live quizzing). Produce: " +
          "frequently asked examination questions with answers, 5 important 2-mark questions with answers, 5 important 3-mark questions with answers, 3 important 5-mark questions with answers, 2 case-study scenarios each with 3 questions, 3 assertion-reason questions (standard CBSE 4-option format) with the correct option and explanation, 5 MCQs with correct option index, 5 fill-in-the-blanks, one match-the-following set (5 left terms, 5 shuffled right matches, and the correct pairing), 5 true/false statements, 5 one-word-answer questions, 3 application-based questions, and 2 HOTS questions.",
        user: context,
      }),
      askStructured({
        schemaName: "assessment_bank",
        schema: assessmentBankSchema,
        system:
          "Act as an experienced exam-board teacher building a graded assessment (kept separate from the revision practice bank — do not repeat exact wording). Produce exactly 25 questions: 10 'mcq' items (4 options each in the options array, rubric field states the correct option text), 5 'short' answer items, 5 'long' answer items, 3 'application' items, 2 'hots' items — each with a private grading rubric. Non-mcq items should have an empty options array.",
        user: context,
      }),
    ]);

    session.materials = { ...core, ...practice };
    session.assessment = {
      questions: assessmentBank.questions,
      index: 0,
      points: 0,
      answers: [],
    };
    session.stage = "assessment";

    const first = session.assessment.questions[0];
    res.json({
      sessionId: session.id,
      stage: "assessment",
      materials: session.materials,
      next: {
        index: 0,
        total: session.assessment.questions.length,
        type: first.type,
        question: first.question,
        options: first.options,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.post("/assessment-answer", async (req, res, next) => {
  try {
    const { sessionId, answer } = req.body;
    const session = sessions.get(sessionId);
    if (!session) return res.status(404).json({ error: "Session not found" });
    if (session.stage !== "assessment") return res.status(400).json({ error: "Not in assessment stage" });

    const a = session.assessment;
    const q = a.questions[a.index];

    const grade = await askStructured({
      schemaName: "assessment_grade",
      schema: assessGradeSchema,
      system:
        "Grade the student's assessment answer against the rubric as correct, partial, or incorrect, and briefly explain why.",
      user: `Question (${q.type}): ${q.question}\nRubric / correct answer: ${q.rubric}\nStudent's answer: ${answer}`,
    });

    const pointsEarned = grade.verdict === "correct" ? 1 : grade.verdict === "partial" ? 0.5 : 0;
    a.points += pointsEarned;
    a.answers.push({ question: q.question, type: q.type, answer, verdict: grade.verdict });
    a.index += 1;

    if (a.index >= a.questions.length) {
      const missedTopics = a.answers
        .filter((x) => x.verdict !== "correct")
        .map((x) => `${x.type}: ${x.question}`)
        .join("\n");
      const strongTopics = a.answers
        .filter((x) => x.verdict === "correct")
        .map((x) => `${x.type}: ${x.question}`)
        .join("\n");

      const [report, extraPractice] = await Promise.all([
        askStructured({
          schemaName: "final_report",
          schema: finalReportSchema,
          system:
            "Act as a friendly mentor producing a final assessment report for a student, based on their scorecard. Be encouraging but honest.",
          user: `Chapter: ${session.meta.chapter} (${session.meta.subject}, ${session.meta.board}, ${session.meta.className})\nPoints earned: ${a.points} out of ${a.questions.length}\n\nQuestions answered correctly:\n${strongTopics || "None"}\n\nQuestions missed or partial:\n${missedTopics || "None"}`,
        }),
        askStructured({
          schemaName: "extra_practice",
          schema: extraPracticeSchema,
          system:
            "Act as a tutor generating 15 additional practice questions focused ONLY on the topics the student got wrong or partially wrong in their assessment. Tag each question with which weak topic it targets. If the student missed nothing (a perfect score), generate 15 slightly harder enrichment questions covering the whole chapter instead.",
          user: `Chapter: ${session.meta.chapter} (${session.meta.subject}, ${session.meta.board}, ${session.meta.className}), student level: ${session.meta.level}\n\nQuestions missed or partial:\n${missedTopics || "None — perfect score"}`,
        }),
      ]);

      session.stage = "done";
      return res.json({
        sessionId: session.id,
        stage: "done",
        verdict: grade.verdict,
        explanation: grade.explanation,
        finalScore: Math.round((a.points / a.questions.length) * 100),
        report,
        extraPractice: extraPractice.questions,
      });
    }

    const next = a.questions[a.index];
    res.json({
      sessionId: session.id,
      stage: "assessment",
      verdict: grade.verdict,
      explanation: grade.explanation,
      next: { index: a.index, total: a.questions.length, type: next.type, question: next.question, options: next.options },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
