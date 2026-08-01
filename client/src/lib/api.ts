async function request<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`/api${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}

// ---------- Recipe agent ----------
export interface Recipe {
  title: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  difficulty: "Easy" | "Mid" | "Hard";
  caloriesPerServing: number;
  steps: string[];
  substitutions: string[];
}
export interface RecipeResult {
  recipes: Recipe[];
  shoppingList: string[];
}
export interface FamilyDetails {
  adults: number;
  children: number;
  diet: string;
  allergies: string;
  healthConditions: string;
}
export const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack"] as const;
export type MealType = (typeof MEAL_TYPES)[number];

export function generateRecipes(payload: {
  ingredients: string[];
  servings: number;
  mode: "simple" | "family";
  mealType: MealType;
  family?: FamilyDetails;
}) {
  return request<RecipeResult>("/recipe/generate", payload);
}

// ---------- Finance agent ----------
export interface FinanceCategory {
  name: string;
  total: number;
  pct: number;
  items: { name: string; amount: number }[];
}
export interface FinanceResult {
  categories: FinanceCategory[];
  topUnnecessary: { name: string; amount: number; reason: string }[];
  suggestions: { title: string; detail: string; estimatedMonthlySavings: number }[];
  nextMonthBudget: { name: string; recommendedAmount: number }[];
  summary: string;
}
export function analyzeFinances(payload: { income: number; expenses: { name: string; amount: number }[] }) {
  return request<FinanceResult>("/finance/analyze", payload);
}

// ---------- Study Buddy tutor agent ----------
export interface LessonPayload {
  sessionId: string;
  stage: "lesson";
  progress: { module: number; totalModules: number };
  module: { title: string; storyHook: string; explanation: string };
  question: string;
  feedback?: string;
  hint?: string | null;
}
export interface SummaryPayload {
  sessionId: string;
  stage: "summary";
  feedback: string;
  scorecard: { correct: number; partial: number; incorrect: number };
}
export const ASSERTION_REASON_OPTIONS = [
  "Both A and R are true, and R is the correct explanation of A",
  "Both A and R are true, but R is NOT the correct explanation of A",
  "A is true, but R is false",
  "A is false, but R is true",
] as const;

export interface Materials {
  // Core teaching
  summary: string;
  definitions: { term: string; definition: string }[];
  formulae: { name: string; formula: string; description: string }[];
  diagrams: { title: string; description: string }[];
  mnemonics: { concept: string; trick: string }[];
  mindMap: { topic: string; points: string[] }[];
  keyPoints: string[];
  revisionNotes: string;
  commonMistakes: string[];
  lastMinuteExamTips: string[];
  // Practice bank
  faqQuestions: { question: string; answer: string }[];
  twoMarkQuestions: { question: string; answer: string }[];
  threeMarkQuestions: { question: string; answer: string }[];
  fiveMarkQuestions: { question: string; answer: string }[];
  caseStudyQuestions: { scenario: string; questions: string[] }[];
  assertionReasonQuestions: {
    assertion: string;
    reason: string;
    correctOption: (typeof ASSERTION_REASON_OPTIONS)[number];
    explanation: string;
  }[];
  mcqs: { question: string; options: string[]; correctIndex: number }[];
  fillBlanks: { sentence: string; answer: string }[];
  matchTheFollowing: {
    leftColumn: string[];
    rightColumn: string[];
    correctPairs: { left: string; right: string }[];
  };
  trueFalse: { statement: string; answer: boolean }[];
  oneWordAnswers: { question: string; answer: string }[];
  applicationQuestions: string[];
  hotsQuestions: string[];
}
export interface AssessmentQuestion {
  index: number;
  total: number;
  type: "mcq" | "short" | "long" | "application" | "hots";
  question: string;
  options: string[];
}
export interface AssessmentStartPayload {
  sessionId: string;
  stage: "assessment";
  materials: Materials;
  next: AssessmentQuestion;
}
export interface AssessmentStepPayload {
  sessionId: string;
  stage: "assessment";
  verdict: "correct" | "partial" | "incorrect";
  explanation: string;
  next: AssessmentQuestion;
}
export interface FinalReport {
  scoreOutOf100: number;
  strengths: string[];
  weaknesses: string[];
  revisionPlan: string;
  daysRecommended: number;
  encouragement: string;
}
export interface ExtraPracticeQuestion {
  topic: string;
  question: string;
}
export interface AssessmentDonePayload {
  sessionId: string;
  stage: "done";
  verdict: "correct" | "partial" | "incorrect";
  explanation: string;
  finalScore: number;
  report: FinalReport;
  extraPractice: ExtraPracticeQuestion[];
}

export function startLesson(payload: {
  board: string;
  className: string;
  subject: string;
  chapter: string;
  level: string;
}) {
  return request<LessonPayload>("/tutor/start", payload);
}
export function answerLesson(payload: { sessionId: string; answer: string }) {
  return request<LessonPayload | SummaryPayload>("/tutor/answer", payload);
}
export function getSummary(payload: { sessionId: string }) {
  return request<AssessmentStartPayload>("/tutor/summary", payload);
}
export function answerAssessment(payload: { sessionId: string; answer: string }) {
  return request<AssessmentStepPayload | AssessmentDonePayload>("/tutor/assessment-answer", payload);
}

// ---------- Follow-up agent ----------
export interface FollowUpResult {
  hotLead: boolean;
  priorityScore: number;
  priorityReason: string;
  thankYouEmail: { subject: string; body: string };
  quotationNote: string;
  followUpSchedule: { day: 3 | 7 | 15; channel: "Email" | "WhatsApp" | "Call"; message: string }[];
  whatsappReminder: string;
  crmNote: string;
}
export function generateFollowUp(payload: {
  contactName: string;
  relationship?: string;
  meetingNotes: string;
  goal?: string;
  productOrService?: string;
}) {
  return request<FollowUpResult>("/followup/generate", payload);
}

// ---------- Document & Report agent ----------
export interface ReportResult {
  title: string;
  executiveSummary: string;
  trends: string[];
  chartData: { label: string; value: number }[];
  sections: { heading: string; content: string }[];
  insights: string[];
  actionItems: { item: string; owner: string; dueHint: string }[];
}
export const REPORT_TYPES = ["Weekly Report", "Monthly Report", "MIS Report", "Meeting Notes", "Proposal", "Status Report"] as const;
export function generateReport(payload: { reportType: string; audience?: string; tone?: string; rawNotes: string }) {
  return request<ReportResult>("/document/generate", payload);
}

// ---------- Customer Support agent ----------
export interface SupportStartResult {
  sessionId: string;
  greeting: string;
}
export interface SupportMessageResult {
  sessionId: string;
  reply: string;
  escalate: boolean;
  escalateReason: string | null;
}
export function startSupportChat(payload: { businessName: string; knowledgeBase: string }) {
  return request<SupportStartResult>("/support/start", payload);
}
export function sendSupportMessage(payload: { sessionId: string; message: string }) {
  return request<SupportMessageResult>("/support/message", payload);
}

// ---------- Language Learning agent ----------
export interface LanguageStartResult {
  sessionId: string;
  openingMessage: { targetText: string; translation: string };
  instructions: string;
  xp: number;
  streak: number;
}
export interface LanguageTurnResult {
  sessionId: string;
  wasCorrect: boolean;
  correctedVersion: string | null;
  explanation: string | null;
  newVocab: string[];
  tutorMessage: { targetText: string; translation: string };
  xp: number;
  streak: number;
  badges: string[];
}
export interface LanguageSummaryResult {
  sessionId: string;
  vocabList: { word: string; meaning: string }[];
  commonMistakes: string[];
  fluencyNote: string;
  suggestedNextSteps: string[];
  totalXp: number;
  bestStreak: number;
  turns: number;
  badges: string[];
}
export function startLanguageSession(payload: {
  targetLanguage: string;
  nativeLanguage: string;
  level: string;
  scenario: string;
}) {
  return request<LanguageStartResult>("/language/start", payload);
}
export function replyLanguageSession(payload: { sessionId: string; message: string }) {
  return request<LanguageTurnResult>("/language/reply", payload);
}
export function summarizeLanguageSession(payload: { sessionId: string }) {
  return request<LanguageSummaryResult>("/language/summary", payload);
}

// ---------- Homework Coach agent ----------
export type HomeworkStartResult =
  | {
      readable: true;
      sessionId: string;
      problemText: string;
      subject: string;
      conceptExplanation: string;
      guidingQuestion: string;
    }
  | { readable: false; issue: string };
export interface HomeworkGradeResult {
  sessionId: string;
  verdict: "correct" | "partial" | "incorrect";
  feedback: string;
  hint: string | null;
  retriesLeft: number | null;
  revealSolution: { steps: string[]; finalAnswer: string } | null;
}
export interface HomeworkMaterials {
  shortNotes: string;
  flashcards: { front: string; back: string }[];
  practiceQuestions: string[];
  diagrams: { title: string; description: string }[];
}
export interface HomeworkMaterialsResult {
  sessionId: string;
  materials: HomeworkMaterials;
  quizTotal: number;
  firstQuestion: { index: number; total: number; question: string; options: string[] };
}
export interface HomeworkQuizStepResult {
  sessionId: string;
  correct: boolean;
  correctIndex: number;
  done: false;
  nextQuestion: { index: number; total: number; question: string; options: string[] };
}
export interface HomeworkQuizDoneResult {
  sessionId: string;
  correct: boolean;
  correctIndex: number;
  done: true;
  score: number;
  total: number;
  weakAreas: string[];
}
export function startHomework(payload: { imageDataUrl: string; level?: string }) {
  return request<HomeworkStartResult>("/homework/start", payload);
}
export function checkHomeworkAnswer(payload: { sessionId: string; answer: string }) {
  return request<HomeworkGradeResult>("/homework/check-answer", payload);
}
export function getHomeworkMaterials(payload: { sessionId: string }) {
  return request<HomeworkMaterialsResult>("/homework/materials", payload);
}
export function answerHomeworkQuiz(payload: { sessionId: string; selectedIndex: number }) {
  return request<HomeworkQuizStepResult | HomeworkQuizDoneResult>("/homework/quiz-answer", payload);
}
