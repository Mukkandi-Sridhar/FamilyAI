import { useRef, useState } from "react";
import { Award, Flame, Mic, MicOff, RotateCcw, Send, Sparkles, Trophy, Zap } from "lucide-react";
import { Button, Card, ErrorBanner, Input, Label, Spinner, Tag } from "../components/ui";
import {
  replyLanguageSession,
  startLanguageSession,
  summarizeLanguageSession,
  type LanguageSummaryResult,
} from "../lib/api";

const LEVELS = ["Beginner", "Intermediate", "Advanced"];

interface TurnMessage {
  role: "tutor" | "student";
  targetText: string;
  translation?: string;
  correction?: { correctedVersion: string | null; explanation: string | null; wasCorrect: boolean };
}

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  start: () => void;
  onresult: ((e: any) => void) | null;
  onerror: ((e: any) => void) | null;
  onend: (() => void) | null;
};

function getSpeechRecognition(): (new () => SpeechRecognitionLike) | null {
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export default function LanguageAgent() {
  const [phase, setPhase] = useState<"setup" | "practice" | "summary">("setup");
  const [targetLanguage, setTargetLanguage] = useState("Spanish");
  const [nativeLanguage, setNativeLanguage] = useState("English");
  const [level, setLevel] = useState("Beginner");
  const [scenario, setScenario] = useState("Ordering food at a restaurant");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [instructions, setInstructions] = useState("");
  const [messages, setMessages] = useState<TurnMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [badges, setBadges] = useState<string[]>([]);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const [summary, setSummary] = useState<LanguageSummaryResult | null>(null);

  async function handleStart() {
    setLoading(true);
    setError(null);
    try {
      const data = await startLanguageSession({ targetLanguage, nativeLanguage, level, scenario });
      setSessionId(data.sessionId);
      setInstructions(data.instructions);
      setMessages([{ role: "tutor", targetText: data.openingMessage.targetText, translation: data.openingMessage.translation }]);
      setXp(data.xp);
      setStreak(data.streak);
      setPhase("practice");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleSend() {
    if (!sessionId || !draft.trim()) return;
    const studentText = draft;
    setMessages((prev) => [...prev, { role: "student", targetText: studentText }]);
    setDraft("");
    setLoading(true);
    setError(null);
    try {
      const data = await replyLanguageSession({ sessionId, message: studentText });
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          correction: { correctedVersion: data.correctedVersion, explanation: data.explanation, wasCorrect: data.wasCorrect },
        };
        updated.push({ role: "tutor", targetText: data.tutorMessage.targetText, translation: data.tutorMessage.translation });
        return updated;
      });
      setXp(data.xp);
      setStreak(data.streak);
      setBadges(data.badges);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleFinish() {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await summarizeLanguageSession({ sessionId });
      setSummary(data);
      setPhase("summary");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleMic() {
    const Recognition = getSpeechRecognition();
    if (!Recognition) return;
    if (listening) {
      recognitionRef.current = null;
      setListening(false);
      return;
    }
    const rec = new Recognition();
    rec.lang = targetLanguage;
    rec.interimResults = false;
    rec.onresult = (e: any) => {
      const transcript = e.results?.[0]?.[0]?.transcript;
      if (transcript) setDraft((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recognitionRef.current = rec;
    setListening(true);
    rec.start();
  }

  function handleRestart() {
    setPhase("setup");
    setSessionId(null);
    setMessages([]);
    setSummary(null);
    setXp(0);
    setStreak(0);
    setBadges([]);
  }

  const micSupported = !!getSpeechRecognition();

  return (
    <div>
      <p className="text-sm font-medium" style={{ color: "var(--color-language)" }}>
        Language Learning Agent
      </p>
      <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight animate-fade-up">Practice speaking, live.</h1>
      <p className="mt-2 max-w-2xl text-[var(--color-text-dim)]">
        A roleplay conversation partner that corrects grammar gently, teaches new vocabulary, and scores the
        session. Type or speak your replies.
      </p>

      {phase === "setup" && (
        <Card className="mt-8 max-w-xl p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Target language</Label>
              <Input value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)} />
            </div>
            <div>
              <Label>Your language</Label>
              <Input value={nativeLanguage} onChange={(e) => setNativeLanguage(e.target.value)} />
            </div>
            <div className="col-span-2">
              <Label>Level</Label>
              <div className="flex gap-1.5">
                {LEVELS.map((l) => (
                  <Button key={l} variant={level === l ? "primary" : "outline"} className="flex-1 px-2" onClick={() => setLevel(l)}>
                    {l}
                  </Button>
                ))}
              </div>
            </div>
            <div className="col-span-2">
              <Label>Scenario</Label>
              <Input value={scenario} onChange={(e) => setScenario(e.target.value)} placeholder="e.g. Ordering food, Job interview" />
            </div>
          </div>
          <Button className="mt-5 w-full" onClick={handleStart} disabled={loading}>
            {loading ? <Spinner /> : <Sparkles size={14} />}
            {loading ? "Setting the scene..." : "Start practicing"}
          </Button>
          {error && (
            <div className="mt-3">
              <ErrorBanner message={error} />
            </div>
          )}
        </Card>
      )}

      {phase === "practice" && (
        <div className="mt-8 max-w-2xl">
          <div className="mb-4 flex items-center gap-2">
            <Tag tone="brand">
              <Zap size={11} className="mr-1 inline" /> {xp} XP
            </Tag>
            <Tag tone={streak > 0 ? "good" : "default"}>
              <Flame size={11} className="mr-1 inline" /> {streak} streak
            </Tag>
            {badges.map((b) => (
              <Tag key={b}>
                <Award size={11} className="mr-1 inline" /> {b}
              </Tag>
            ))}
            <Button variant="ghost" className="ml-auto" onClick={handleFinish} disabled={loading}>
              Finish &amp; get summary
            </Button>
          </div>

          <p className="mb-3 text-xs italic text-[var(--color-text-dim)]">{instructions}</p>

          <Card className="flex flex-col p-0">
            <div className="flex max-h-[26rem] flex-col gap-3 overflow-y-auto p-5">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "student" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex max-w-[85%] flex-col gap-1 ${m.role === "student" ? "items-end" : "items-start"}`}>
                    <div
                      className="rounded-2xl px-3.5 py-2.5 text-sm"
                      style={
                        m.role === "student"
                          ? { background: "var(--color-text)", color: "white" }
                          : { background: "var(--color-surface-2)", color: "var(--color-text)" }
                      }
                    >
                      {m.targetText}
                    </div>
                    {m.translation && <p className="px-1 text-xs text-[var(--color-text-faint)]">{m.translation}</p>}
                    {m.correction && !m.correction.wasCorrect && (
                      <div className="max-w-full rounded-lg px-3 py-2 text-xs" style={{ background: "var(--color-language-soft)" }}>
                        <p className="font-medium" style={{ color: "var(--color-language)" }}>
                          {m.correction.correctedVersion}
                        </p>
                        <p className="mt-0.5 text-[var(--color-text-dim)]">{m.correction.explanation}</p>
                      </div>
                    )}
                    {m.correction?.wasCorrect && <Tag tone="good">Nice — correct!</Tag>}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-[var(--color-surface-2)] px-3.5 py-2.5 text-sm text-[var(--color-text-dim)]">
                    <Spinner className="mr-1.5 inline" /> ...
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 border-t border-[var(--color-border)] p-4">
              {micSupported && (
                <button
                  onClick={handleMic}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-colors"
                  style={
                    listening
                      ? { background: "var(--color-language)", borderColor: "var(--color-language)", color: "white" }
                      : { borderColor: "var(--color-border)", color: "var(--color-text-dim)" }
                  }
                  aria-label="Speak"
                >
                  {listening ? <MicOff size={15} /> : <Mic size={15} />}
                </button>
              )}
              <Input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={`Reply in ${targetLanguage}...`}
              />
              <Button onClick={handleSend} disabled={loading || !draft.trim()}>
                <Send size={14} />
              </Button>
            </div>
          </Card>
          {error && (
            <div className="mt-3">
              <ErrorBanner message={error} />
            </div>
          )}
        </div>
      )}

      {phase === "summary" && summary && (
        <Card className="mt-8 max-w-2xl p-8">
          <div className="mb-5 flex items-center gap-3">
            <Trophy size={28} style={{ color: "var(--color-language)" }} />
            <div>
              <p className="text-sm text-[var(--color-text-dim)]">Session complete</p>
              <p className="text-2xl font-semibold">{summary.totalXp} XP earned</p>
            </div>
          </div>
          <div className="mb-5 flex flex-wrap gap-2">
            <Tag tone="good">{summary.turns} turns</Tag>
            <Tag tone="brand">Best streak {summary.bestStreak}</Tag>
            {summary.badges.map((b) => (
              <Tag key={b}>{b}</Tag>
            ))}
          </div>
          <p className="mb-5 text-sm leading-relaxed text-[var(--color-text-dim)]">{summary.fluencyNote}</p>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-dim)]">New vocabulary</h4>
              <ul className="flex flex-col gap-1.5 text-sm">
                {summary.vocabList.map((v, i) => (
                  <li key={i}>
                    <span className="font-medium">{v.word}</span> — {v.meaning}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-language)" }}>
                Common mistakes
              </h4>
              <ul className="flex flex-col gap-1.5 text-sm">
                {summary.commonMistakes.map((m, i) => (
                  <li key={i}>• {m}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-dim)]">Next steps</p>
            <ul className="flex flex-col gap-1 text-sm">
              {summary.suggestedNextSteps.map((s, i) => (
                <li key={i}>• {s}</li>
              ))}
            </ul>
          </div>

          <Button variant="outline" className="mt-6 w-full" onClick={handleRestart}>
            <RotateCcw size={14} /> Practice another scenario
          </Button>
        </Card>
      )}
    </div>
  );
}
