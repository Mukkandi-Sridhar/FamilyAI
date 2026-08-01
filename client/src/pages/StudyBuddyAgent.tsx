import { useState } from "react";
import { Award, BookOpen, CheckCircle2, GraduationCap, Lightbulb, RotateCcw, Send, Sparkles, Target } from "lucide-react";
import { Button, Card, ErrorBanner, Input, Label, ProgressBar, Spinner, Tag, Textarea } from "../components/ui";
import MaterialsPanel from "../components/MaterialsPanel";
import {
  answerAssessment,
  answerLesson,
  getSummary,
  startLesson,
  type AssessmentQuestion,
  type ExtraPracticeQuestion,
  type FinalReport,
  type Materials,
} from "../lib/api";

type Phase = "setup" | "lesson" | "summary-ready" | "assessment" | "done";

const LEVELS = ["Beginner", "Average", "Advanced"];

export default function StudyBuddyAgent() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [board, setBoard] = useState("CBSE");
  const [className, setClassName] = useState("8");
  const [subject, setSubject] = useState("Science");
  const [chapter, setChapter] = useState("Photosynthesis");
  const [level, setLevel] = useState("Average");

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [progress, setProgress] = useState({ module: 1, totalModules: 1 });
  const [moduleView, setModuleView] = useState<{ title: string; storyHook: string; explanation: string } | null>(null);
  const [question, setQuestion] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [scorecard, setScorecard] = useState<{ correct: number; partial: number; incorrect: number } | null>(null);
  const [answerDraft, setAnswerDraft] = useState("");

  const [materials, setMaterials] = useState<Materials | null>(null);
  const [assessmentQ, setAssessmentQ] = useState<AssessmentQuestion | null>(null);
  const [assessmentFeedback, setAssessmentFeedback] = useState<{ verdict: string; explanation: string } | null>(null);
  const [mcqChoice, setMcqChoice] = useState<string | null>(null);
  const [finalReport, setFinalReport] = useState<{ finalScore: number; report: FinalReport } | null>(null);
  const [extraPractice, setExtraPractice] = useState<ExtraPracticeQuestion[]>([]);

  async function handleStart() {
    setLoading(true);
    setError(null);
    try {
      const data = await startLesson({ board, className, subject, chapter, level });
      setSessionId(data.sessionId);
      setProgress(data.progress);
      setModuleView(data.module);
      setQuestion(data.question);
      setFeedback(null);
      setHint(null);
      setAnswerDraft("");
      setPhase("lesson");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleAnswerLesson() {
    if (!sessionId || !answerDraft.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await answerLesson({ sessionId, answer: answerDraft });
      setAnswerDraft("");
      if (data.stage === "summary") {
        setFeedback(data.feedback);
        setScorecard(data.scorecard);
        setPhase("summary-ready");
        return;
      }
      setProgress(data.progress);
      setModuleView(data.module);
      setQuestion(data.question);
      setFeedback(data.feedback ?? null);
      setHint(data.hint ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleGetSummary() {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getSummary({ sessionId });
      setMaterials(data.materials);
      setAssessmentQ(data.next);
      setAssessmentFeedback(null);
      setMcqChoice(null);
      setAnswerDraft("");
      setPhase("assessment");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleAssessmentAnswer() {
    const answer = assessmentQ?.type === "mcq" ? mcqChoice : answerDraft;
    if (!sessionId || !answer || !answer.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await answerAssessment({ sessionId, answer });
      setAssessmentFeedback({ verdict: data.verdict, explanation: data.explanation });
      setAnswerDraft("");
      setMcqChoice(null);
      if (data.stage === "done") {
        setFinalReport({ finalScore: data.finalScore, report: data.report });
        setExtraPractice(data.extraPractice);
        setPhase("done");
      } else {
        setAssessmentQ(data.next);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleRestart() {
    setPhase("setup");
    setSessionId(null);
    setModuleView(null);
    setQuestion(null);
    setFeedback(null);
    setHint(null);
    setScorecard(null);
    setMaterials(null);
    setAssessmentQ(null);
    setAssessmentFeedback(null);
    setFinalReport(null);
    setExtraPractice([]);
    setAnswerDraft("");
  }

  return (
    <div>
      <p className="text-sm font-medium" style={{ color: "var(--color-tutor)" }}>
        Study Buddy
      </p>
      <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight animate-fade-up">My child doesn't understand.</h1>
      <p className="mt-2 max-w-2xl text-[var(--color-text-dim)]">
        A patient tutor that teaches one concept at a time, checks understanding before moving on, then runs a full
        graded assessment.
      </p>

      {error && (
        <div className="mt-4">
          <ErrorBanner message={error} />
        </div>
      )}

      {phase === "setup" && (
        <Card className="mt-8 max-w-xl p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Board</Label>
              <Input value={board} onChange={(e) => setBoard(e.target.value)} placeholder="CBSE / State Board" />
            </div>
            <div>
              <Label>Class</Label>
              <Input value={className} onChange={(e) => setClassName(e.target.value)} placeholder="8" />
            </div>
            <div>
              <Label>Subject</Label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Science" />
            </div>
            <div>
              <Label>Chapter / topic</Label>
              <Input value={chapter} onChange={(e) => setChapter(e.target.value)} placeholder="Photosynthesis" />
            </div>
            <div className="col-span-2">
              <Label>Level</Label>
              <div className="flex gap-3">
                {LEVELS.map((l) => (
                  <Button key={l} variant={level === l ? "primary" : "outline"} className="flex-1" onClick={() => setLevel(l)}>
                    {l}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <Button className="mt-5 w-full" onClick={handleStart} disabled={loading}>
            {loading ? <Spinner /> : <GraduationCap size={14} />}
            {loading ? "Preparing lesson..." : "Start lesson"}
          </Button>
        </Card>
      )}

      {phase === "lesson" && moduleView && (
        <div className="mt-8 flex flex-col gap-5">
          <div>
            <div className="mb-1.5 flex items-center justify-between text-xs text-[var(--color-text-dim)]">
              <span>
                Module {progress.module} of {progress.totalModules}
              </span>
              <span>{moduleView.title}</span>
            </div>
            <ProgressBar value={progress.module - 1} max={progress.totalModules} colorVar="--color-tutor" />
          </div>

          <Card className="p-6">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--color-tutor)" }}>
              <BookOpen size={16} /> {moduleView.title}
            </div>
            <p className="mb-3 text-sm italic leading-relaxed text-[var(--color-text-dim)]">{moduleView.storyHook}</p>
            <p className="text-sm leading-relaxed">{moduleView.explanation}</p>
          </Card>

          {feedback && (
            <Card className="flex items-start gap-2.5 p-4">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0" style={{ color: "var(--color-tutor)" }} />
              <p className="text-sm leading-relaxed">{feedback}</p>
            </Card>
          )}
          {hint && (
            <Card
              className="flex items-start gap-2.5 border-transparent p-4"
              style={{ background: "var(--color-finance-soft)" }}
            >
              <Lightbulb size={16} className="mt-0.5 shrink-0" style={{ color: "var(--color-finance)" }} />
              <p className="text-sm leading-relaxed text-[var(--color-text)]">{hint}</p>
            </Card>
          )}

          <Card className="p-6">
            <p className="mb-3 text-sm font-medium">{question}</p>
            <Textarea
              value={answerDraft}
              onChange={(e) => setAnswerDraft(e.target.value)}
              placeholder="Type your answer..."
              rows={3}
            />
            <Button className="mt-3" onClick={handleAnswerLesson} disabled={loading || !answerDraft.trim()}>
              {loading ? <Spinner /> : <Send size={14} />}
              {loading ? "Checking..." : "Submit answer"}
            </Button>
          </Card>
        </div>
      )}

      {phase === "summary-ready" && (
        <Card className="mt-8 max-w-xl p-6 text-center">
          <Sparkles size={28} className="mx-auto mb-3" style={{ color: "var(--color-tutor)" }} />
          <h3 className="text-lg font-semibold">Lesson complete!</h3>
          {feedback && <p className="mt-2 text-sm text-[var(--color-text-dim)]">{feedback}</p>}
          {scorecard && (
            <div className="mt-4 flex justify-center gap-2">
              <Tag tone="good">{scorecard.correct} correct</Tag>
              <Tag tone="warn">{scorecard.partial} partial</Tag>
              <Tag tone="bad">{scorecard.incorrect} incorrect</Tag>
            </div>
          )}
          <Button className="mt-5 w-full" onClick={handleGetSummary} disabled={loading}>
            {loading ? <Spinner /> : <Sparkles size={14} />}
            {loading ? "Preparing materials..." : "Get revision materials & start assessment"}
          </Button>
        </Card>
      )}

      {phase === "assessment" && materials && assessmentQ && (
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <MaterialsPanel materials={materials} />
          </div>

          <div className="lg:col-span-3">
            <div className="mb-1.5 flex items-center justify-between text-xs text-[var(--color-text-dim)]">
              <span>
                Assessment · question {assessmentQ.index + 1} of {assessmentQ.total}
              </span>
              <Tag>{assessmentQ.type}</Tag>
            </div>
            <ProgressBar value={assessmentQ.index} max={assessmentQ.total} colorVar="--color-tutor" />

            {assessmentFeedback && (
              <Card
                className="mt-4 border-transparent p-4 text-sm"
                style={{
                  background:
                    assessmentFeedback.verdict === "correct"
                      ? "var(--color-recipe-soft)"
                      : assessmentFeedback.verdict === "partial"
                        ? "var(--color-finance-soft)"
                        : "#fdf0f0",
                }}
              >
                <p
                  className="font-medium capitalize"
                  style={{
                    color:
                      assessmentFeedback.verdict === "correct"
                        ? "var(--color-recipe)"
                        : assessmentFeedback.verdict === "partial"
                          ? "var(--color-finance)"
                          : "#b8433f",
                  }}
                >
                  {assessmentFeedback.verdict}
                </p>
                <p className="mt-1 text-[var(--color-text)]">{assessmentFeedback.explanation}</p>
              </Card>
            )}

            <Card className="mt-4 p-6">
              <p className="mb-4 text-sm font-medium">{assessmentQ.question}</p>
              {assessmentQ.type === "mcq" ? (
                <div className="flex flex-col gap-2">
                  {assessmentQ.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => setMcqChoice(opt)}
                      className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                        mcqChoice === opt
                          ? "border-[var(--color-brand)] bg-[var(--color-brand)]/10"
                          : "border-[var(--color-border)] hover:bg-[var(--color-surface-2)]"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <Textarea
                  value={answerDraft}
                  onChange={(e) => setAnswerDraft(e.target.value)}
                  placeholder="Type your answer..."
                  rows={4}
                />
              )}
              <Button
                className="mt-4"
                onClick={handleAssessmentAnswer}
                disabled={loading || (assessmentQ.type === "mcq" ? !mcqChoice : !answerDraft.trim())}
              >
                {loading ? <Spinner /> : <Send size={14} />}
                {loading ? "Grading..." : "Submit answer"}
              </Button>
            </Card>
          </div>
        </div>
      )}

      {phase === "done" && finalReport && (
        <Card className="mt-8 max-w-3xl p-8">
          <div className="mb-5 flex items-center gap-3">
            <Award size={28} style={{ color: "var(--color-tutor)" }} />
            <div>
              <p className="text-sm text-[var(--color-text-dim)]">Final score</p>
              <p className="text-2xl font-semibold">{finalReport.finalScore} / 100</p>
            </div>
          </div>
          <p className="mb-5 text-sm leading-relaxed text-[var(--color-text-dim)]">{finalReport.report.encouragement}</p>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-recipe)" }}>
                Strengths
              </h4>
              <ul className="flex flex-col gap-1.5 text-sm">
                {finalReport.report.strengths.map((s, i) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-finance)" }}>
                Weak areas
              </h4>
              <ul className="flex flex-col gap-1.5 text-sm">
                {finalReport.report.weaknesses.map((s, i) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-dim)]">
              Revision plan · {finalReport.report.daysRecommended} days
            </p>
            <p className="mt-1.5 text-sm leading-relaxed">{finalReport.report.revisionPlan}</p>
          </div>

          {extraPractice.length > 0 && (
            <div className="mt-5">
              <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-dim)]">
                <Target size={13} /> Extra practice — focused on your weak areas
              </h4>
              <div className="flex flex-col gap-2">
                {extraPractice.map((q, i) => (
                  <div key={i} className="rounded-lg border border-[var(--color-border)] p-3 text-sm">
                    <Tag tone="warn">{q.topic}</Tag>
                    <p className="mt-1.5">{q.question}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button variant="outline" className="mt-6 w-full" onClick={handleRestart}>
            <RotateCcw size={14} /> Start a new chapter
          </Button>
        </Card>
      )}
    </div>
  );
}
