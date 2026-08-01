import { useRef, useState } from "react";
import {
  BookOpen,
  Camera,
  CheckCircle2,
  Layers,
  Lightbulb,
  ListChecks,
  RotateCcw,
  Send,
  Sparkles,
  Target,
  Upload,
} from "lucide-react";
import { Button, Card, ErrorBanner, Input, Label, ProgressBar, Spinner, Tabs, Tag, Textarea } from "../components/ui";
import {
  answerHomeworkQuiz,
  checkHomeworkAnswer,
  getHomeworkMaterials,
  startHomework,
  type HomeworkMaterials,
} from "../lib/api";

type Phase = "upload" | "solving" | "solved" | "quiz" | "done";

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function HomeworkAgent() {
  const [phase, setPhase] = useState<Phase>("upload");
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [level, setLevel] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [problemText, setProblemText] = useState("");
  const [subject, setSubject] = useState("");
  const [conceptExplanation, setConceptExplanation] = useState("");
  const [guidingQuestion, setGuidingQuestion] = useState("");
  const [answerDraft, setAnswerDraft] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [solutionSteps, setSolutionSteps] = useState<{ steps: string[]; finalAnswer: string } | null>(null);

  const [materials, setMaterials] = useState<HomeworkMaterials | null>(null);
  const [quizQ, setQuizQ] = useState<{ index: number; total: number; question: string; options: string[] } | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<{ correct: boolean; correctIndex: number; selected: number } | null>(null);
  const [quizResult, setQuizResult] = useState<{ score: number; total: number; weakAreas: string[] } | null>(null);

  async function handleFilePicked(file: File) {
    const dataUrl = await fileToDataUrl(file);
    setImageDataUrl(dataUrl);
  }

  async function handleAnalyze() {
    if (!imageDataUrl) return;
    setLoading(true);
    setError(null);
    try {
      const data = await startHomework({ imageDataUrl, level: level || undefined });
      if (!data.readable) {
        setError(data.issue);
        return;
      }
      setSessionId(data.sessionId);
      setProblemText(data.problemText);
      setSubject(data.subject);
      setConceptExplanation(data.conceptExplanation);
      setGuidingQuestion(data.guidingQuestion);
      setPhase("solving");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckAnswer() {
    if (!sessionId || !answerDraft.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await checkHomeworkAnswer({ sessionId, answer: answerDraft });
      setAnswerDraft("");
      setFeedback(data.feedback);
      setHint(data.hint);
      if (data.verdict === "correct" || data.revealSolution) {
        if (data.revealSolution) setSolutionSteps(data.revealSolution);
        setPhase("solved");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleGetMaterials() {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getHomeworkMaterials({ sessionId });
      setMaterials(data.materials);
      setQuizQ(data.firstQuestion);
      setQuizFeedback(null);
      setPhase("quiz");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleQuizAnswer(selectedIndex: number) {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await answerHomeworkQuiz({ sessionId, selectedIndex });
      setQuizFeedback({ correct: data.correct, correctIndex: data.correctIndex, selected: selectedIndex });
      if (data.done) {
        setTimeout(() => {
          setQuizResult({ score: data.score, total: data.total, weakAreas: data.weakAreas });
          setPhase("done");
        }, 900);
      } else {
        setTimeout(() => {
          setQuizQ(data.nextQuestion);
          setQuizFeedback(null);
        }, 900);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleRestart() {
    setPhase("upload");
    setImageDataUrl(null);
    setSessionId(null);
    setFeedback(null);
    setHint(null);
    setSolutionSteps(null);
    setMaterials(null);
    setQuizQ(null);
    setQuizFeedback(null);
    setQuizResult(null);
    setAnswerDraft("");
  }

  return (
    <div>
      <p className="text-sm font-medium" style={{ color: "var(--color-homework)" }}>
        Homework Coach
      </p>
      <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight animate-fade-up">Learn it, don't copy it.</h1>
      <p className="mt-2 max-w-2xl text-[var(--color-text-dim)]">
        Snap a photo of a homework question — the coach explains the method, has you attempt it, checks your work,
        then builds revision materials and a quiz from it.
      </p>

      {error && (
        <div className="mt-4 max-w-2xl">
          <ErrorBanner message={error} />
        </div>
      )}

      {phase === "upload" && (
        <Card className="mt-8 max-w-xl p-6">
          <Label>Photo of the homework question</Label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFilePicked(e.target.files[0])}
          />
          {imageDataUrl ? (
            <div className="mb-4 overflow-hidden rounded-xl border border-[var(--color-border)]">
              <img src={imageDataUrl} alt="Homework question" className="max-h-72 w-full object-contain" />
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mb-4 flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-2)]/50 py-12 text-[var(--color-text-dim)] transition-colors hover:bg-[var(--color-surface-2)]"
            >
              <Camera size={22} />
              <span className="text-sm">Click to upload or take a photo</span>
            </button>
          )}
          {imageDataUrl && (
            <Button variant="outline" className="mb-5 w-full" onClick={() => fileInputRef.current?.click()}>
              <Upload size={14} /> Choose a different photo
            </Button>
          )}

          <Label>Student level (optional)</Label>
          <Input value={level} onChange={(e) => setLevel(e.target.value)} placeholder="e.g. Class 6, Beginner" className="mb-5" />

          <Button className="w-full" onClick={handleAnalyze} disabled={loading || !imageDataUrl}>
            {loading ? <Spinner /> : <Sparkles size={14} />}
            {loading ? "Reading the question..." : "Analyze homework"}
          </Button>
        </Card>
      )}

      {(phase === "solving" || phase === "solved") && (
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2">
            {imageDataUrl && (
              <Card className="overflow-hidden p-0">
                <img src={imageDataUrl} alt="Homework question" className="max-h-64 w-full object-contain" />
              </Card>
            )}
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Tag tone="brand">{subject}</Tag>
            </div>
            <p className="mt-3 text-sm text-[var(--color-text-dim)]">{problemText}</p>
          </div>

          <div className="flex flex-col gap-5 lg:col-span-3">
            <Card className="p-6">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--color-homework)" }}>
                <BookOpen size={16} /> Let's break it down
              </div>
              <p className="text-sm leading-relaxed">{conceptExplanation}</p>
            </Card>

            {feedback && (
              <Card className="flex items-start gap-2.5 p-4">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0" style={{ color: "var(--color-homework)" }} />
                <p className="text-sm leading-relaxed">{feedback}</p>
              </Card>
            )}
            {hint && (
              <Card className="flex items-start gap-2.5 border-transparent p-4" style={{ background: "var(--color-finance-soft)" }}>
                <Lightbulb size={16} className="mt-0.5 shrink-0" style={{ color: "var(--color-finance)" }} />
                <p className="text-sm leading-relaxed text-[var(--color-text)]">{hint}</p>
              </Card>
            )}

            {phase === "solving" && (
              <Card className="p-6">
                <p className="mb-3 text-sm font-medium">{guidingQuestion}</p>
                <Textarea value={answerDraft} onChange={(e) => setAnswerDraft(e.target.value)} placeholder="Show your work / write your answer..." rows={3} />
                <Button className="mt-3" onClick={handleCheckAnswer} disabled={loading || !answerDraft.trim()}>
                  {loading ? <Spinner /> : <Send size={14} />}
                  {loading ? "Checking..." : "Check my answer"}
                </Button>
              </Card>
            )}

            {phase === "solved" && (
              <>
                {solutionSteps && (
                  <Card className="p-6">
                    <h3 className="mb-2 text-sm font-semibold">Full worked solution</h3>
                    <ol className="flex flex-col gap-1.5 text-sm">
                      {solutionSteps.steps.map((s, i) => (
                        <li key={i} className="flex gap-2.5">
                          <span className="shrink-0 font-medium text-[var(--color-text-dim)]">{i + 1}.</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ol>
                    <p className="mt-3 text-sm font-medium">Final answer: {solutionSteps.finalAnswer}</p>
                  </Card>
                )}
                <Button className="w-full" onClick={handleGetMaterials} disabled={loading}>
                  {loading ? <Spinner /> : <Layers size={14} />}
                  {loading ? "Building revision kit..." : "Get notes, flashcards & quiz"}
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {phase === "quiz" && materials && quizQ && (
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Tabs
              tabs={[
                {
                  id: "notes",
                  label: "Notes",
                  content: (
                    <Card className="p-5">
                      <p className="text-sm leading-relaxed text-[var(--color-text-dim)]">{materials.shortNotes}</p>
                    </Card>
                  ),
                },
                {
                  id: "flashcards",
                  label: "Flashcards",
                  content: (
                    <div className="flex flex-col gap-2.5">
                      {materials.flashcards.map((f, i) => (
                        <Card key={i} className="p-4">
                          <p className="text-sm font-medium">{f.front}</p>
                          <p className="mt-1 text-sm text-[var(--color-text-dim)]">{f.back}</p>
                        </Card>
                      ))}
                    </div>
                  ),
                },
                {
                  id: "practice",
                  label: "Practice",
                  content: (
                    <Card className="p-5">
                      <ul className="flex flex-col gap-2 text-sm">
                        {materials.practiceQuestions.map((q, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-[var(--color-text-dim)]">{i + 1}.</span>
                            <span>{q}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 flex flex-col gap-3 border-t border-[var(--color-border-soft)] pt-4">
                        {materials.diagrams.map((d, i) => (
                          <div key={i}>
                            <p className="text-sm font-medium">{d.title}</p>
                            <p className="mt-0.5 text-xs text-[var(--color-text-dim)]">{d.description}</p>
                          </div>
                        ))}
                      </div>
                    </Card>
                  ),
                },
              ]}
            />
          </div>

          <div className="lg:col-span-3">
            <div className="mb-1.5 flex items-center justify-between text-xs text-[var(--color-text-dim)]">
              <span className="flex items-center gap-1.5">
                <ListChecks size={13} /> Quiz · question {quizQ.index + 1} of {quizQ.total}
              </span>
            </div>
            <ProgressBar value={quizQ.index} max={quizQ.total} colorVar="--color-homework" />

            <Card className="mt-4 p-6">
              <p className="mb-4 text-sm font-medium">{quizQ.question}</p>
              <div className="flex flex-col gap-2">
                {quizQ.options.map((opt, i) => {
                  const isSelected = quizFeedback?.selected === i;
                  const isCorrectOpt = quizFeedback && i === quizFeedback.correctIndex;
                  return (
                    <button
                      key={i}
                      disabled={!!quizFeedback || loading}
                      onClick={() => handleQuizAnswer(i)}
                      className="rounded-lg border px-3 py-2 text-left text-sm transition-colors disabled:cursor-default"
                      style={
                        isCorrectOpt
                          ? { borderColor: "var(--color-recipe)", background: "var(--color-recipe-soft)" }
                          : isSelected
                            ? { borderColor: "#e0665f", background: "#fdf0f0" }
                            : { borderColor: "var(--color-border)" }
                      }
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      )}

      {phase === "done" && quizResult && (
        <Card className="mt-8 max-w-xl p-8">
          <div className="mb-5 flex items-center gap-3">
            <Target size={28} style={{ color: "var(--color-homework)" }} />
            <div>
              <p className="text-sm text-[var(--color-text-dim)]">Quiz score</p>
              <p className="text-2xl font-semibold">
                {quizResult.score} / {quizResult.total}
              </p>
            </div>
          </div>
          {quizResult.weakAreas.length > 0 ? (
            <>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-finance)" }}>
                Weak areas to revisit
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {quizResult.weakAreas.map((w, i) => (
                  <Tag key={i} tone="warn">
                    {w}
                  </Tag>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-[var(--color-recipe)]">Perfect score — no weak areas detected!</p>
          )}
          <Button variant="outline" className="mt-6 w-full" onClick={handleRestart}>
            <RotateCcw size={14} /> Try another homework question
          </Button>
        </Card>
      )}
    </div>
  );
}
