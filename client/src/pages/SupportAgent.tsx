import { useState } from "react";
import { AlertTriangle, Headset, Send, UserRound } from "lucide-react";
import { Button, Card, ErrorBanner, Input, Label, Spinner, Tag, Textarea } from "../components/ui";
import { sendSupportMessage, startSupportChat } from "../lib/api";

interface ChatMessage {
  role: "customer" | "agent";
  content: string;
  escalate?: boolean;
  escalateReason?: string | null;
}

const DEFAULT_KB = `Business: Ramesh Furnishings (furniture & modular kitchens)
Store hours: Mon-Sat, 10am-8pm
Delivery: 7-10 business days after order confirmation
Returns: 7-day return window for unused items with original packaging
Warranty: 2 years on all modular kitchen units, 1 year on furniture
Payment: 50% advance, balance on delivery. UPI, card, and bank transfer accepted
Current offer: 15% off on all modular kitchen orders placed before end of month
Order #10234 (Suresh K.): Modular kitchen, confirmed Jul 28, currently in production, expected delivery Aug 6
Order #10198 (Priya M.): Sofa set, shipped Jul 30, out for delivery, expected Aug 2`;

export default function SupportAgent() {
  const [phase, setPhase] = useState<"setup" | "chat">("setup");
  const [businessName, setBusinessName] = useState("Ramesh Furnishings");
  const [knowledgeBase, setKnowledgeBase] = useState(DEFAULT_KB);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");

  async function handleStart() {
    setLoading(true);
    setError(null);
    try {
      const data = await startSupportChat({ businessName, knowledgeBase });
      setSessionId(data.sessionId);
      setMessages([{ role: "agent", content: data.greeting }]);
      setPhase("chat");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleSend() {
    if (!sessionId || !draft.trim()) return;
    const customerMessage = draft;
    setMessages((prev) => [...prev, { role: "customer", content: customerMessage }]);
    setDraft("");
    setLoading(true);
    setError(null);
    try {
      const data = await sendSupportMessage({ sessionId, message: customerMessage });
      setMessages((prev) => [...prev, { role: "agent", content: data.reply, escalate: data.escalate, escalateReason: data.escalateReason }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleRestart() {
    setPhase("setup");
    setSessionId(null);
    setMessages([]);
    setDraft("");
  }

  return (
    <div>
      <p className="text-sm font-medium" style={{ color: "var(--color-support)" }}>
        Customer Support Agent
      </p>
      <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight animate-fade-up">Instant answers, day or night.</h1>
      <p className="mt-2 max-w-2xl text-[var(--color-text-dim)]">
        Give it your business's knowledge base — it answers customer questions grounded in that, and flags anything
        that needs a human.
      </p>

      {phase === "setup" && (
        <Card className="mt-8 max-w-2xl p-6">
          <Label>Business name</Label>
          <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="mb-5" />

          <Label>Knowledge base (policies, FAQs, order info, offers...)</Label>
          <Textarea value={knowledgeBase} onChange={(e) => setKnowledgeBase(e.target.value)} rows={12} className="font-mono text-xs" />

          <Button className="mt-4 w-full" onClick={handleStart} disabled={loading || !businessName.trim() || !knowledgeBase.trim()}>
            {loading ? <Spinner /> : <Headset size={14} />}
            {loading ? "Starting up..." : "Start support chat"}
          </Button>

          {error && (
            <div className="mt-3">
              <ErrorBanner message={error} />
            </div>
          )}
        </Card>
      )}

      {phase === "chat" && (
        <div className="mt-8 max-w-2xl">
          <Card className="flex flex-col p-0">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-3">
              <div className="flex items-center gap-2">
                <Headset size={15} style={{ color: "var(--color-support)" }} />
                <p className="text-sm font-medium">{businessName} support</p>
              </div>
              <Button variant="ghost" onClick={handleRestart}>
                New session
              </Button>
            </div>

            <div className="flex max-h-[28rem] flex-col gap-3 overflow-y-auto p-5">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "customer" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex max-w-[80%] flex-col gap-1.5 ${m.role === "customer" ? "items-end" : "items-start"}`}>
                    <div
                      className="rounded-2xl px-3.5 py-2.5 text-sm"
                      style={
                        m.role === "customer"
                          ? { background: "var(--color-text)", color: "white" }
                          : { background: "var(--color-surface-2)", color: "var(--color-text)" }
                      }
                    >
                      {m.content}
                    </div>
                    {m.escalate && (
                      <Tag tone="warn">
                        <AlertTriangle size={11} className="mr-1 inline" />
                        Escalated{m.escalateReason ? `: ${m.escalateReason}` : ""}
                      </Tag>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-[var(--color-surface-2)] px-3.5 py-2.5 text-sm text-[var(--color-text-dim)]">
                    <Spinner className="mr-1.5 inline" /> typing...
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 border-t border-[var(--color-border)] p-4">
              <UserRound size={16} className="shrink-0 text-[var(--color-text-faint)]" />
              <Input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask a question as a customer..."
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
    </div>
  );
}
