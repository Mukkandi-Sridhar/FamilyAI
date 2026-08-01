import { useState } from "react";
import { Calendar, Flame, Mail, MessageCircle, Phone, Wand2 } from "lucide-react";
import { Button, Card, EmptyState, ErrorBanner, Input, Label, Spinner, Tag, Textarea } from "../components/ui";
import { generateFollowUp, type FollowUpResult } from "../lib/api";

const CHANNEL_ICON = { Email: Mail, WhatsApp: MessageCircle, Call: Phone } as const;

export default function FollowUpAgent() {
  const [contactName, setContactName] = useState("Ramesh Furnishings");
  const [relationship, setRelationship] = useState("New enquiry");
  const [productOrService, setProductOrService] = useState("Modular kitchen, premium range");
  const [goal, setGoal] = useState("Close the deal");
  const [meetingNotes, setMeetingNotes] = useState(
    "Met at the showroom today. Interested in a modular kitchen for a 3BHK renovation. Budget around 4.5L. Asked for a detailed quotation. Mentioned they're also checking two other vendors. Wants to decide within 2 weeks. Seemed genuinely interested, good rapport."
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FollowUpResult | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const data = await generateFollowUp({ contactName, relationship, productOrService, goal, meetingNotes });
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <p className="text-sm font-medium" style={{ color: "var(--color-followup)" }}>
        Follow-up Agent
      </p>
      <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight animate-fade-up">No lead left behind.</h1>
      <p className="mt-2 max-w-2xl text-[var(--color-text-dim)]">
        Drop in meeting notes right after a customer call — get a thank-you email, quotation note, a 3/7/15-day
        follow-up schedule, and a WhatsApp reminder, drafted and ready to send.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="p-6 lg:col-span-2">
          <Label>Contact / company</Label>
          <Input value={contactName} onChange={(e) => setContactName(e.target.value)} className="mb-5" />

          <Label>Relationship stage</Label>
          <Input value={relationship} onChange={(e) => setRelationship(e.target.value)} placeholder="e.g. New enquiry, Existing client" className="mb-5" />

          <Label>Product / service discussed</Label>
          <Input value={productOrService} onChange={(e) => setProductOrService(e.target.value)} className="mb-5" />

          <Label>Goal</Label>
          <Input value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="e.g. Close the deal, Re-engage" className="mb-5" />

          <Label>Meeting notes</Label>
          <Textarea
            value={meetingNotes}
            onChange={(e) => setMeetingNotes(e.target.value)}
            rows={8}
            placeholder="What happened in the meeting/call?"
          />

          <Button className="mt-4 w-full" onClick={handleGenerate} disabled={loading || !contactName.trim() || !meetingNotes.trim()}>
            {loading ? <Spinner /> : <Wand2 size={14} />}
            {loading ? "Drafting follow-up..." : "Generate follow-up plan"}
          </Button>

          {error && (
            <div className="mt-3">
              <ErrorBanner message={error} />
            </div>
          )}
        </Card>

        <div className="flex flex-col gap-6 lg:col-span-3">
          {!result && !loading && (
            <EmptyState
              title="No follow-up plan yet"
              detail="Add meeting notes and generate — the thank-you email, schedule, and reminders will appear here."
            />
          )}
          {loading && (
            <Card className="flex items-center justify-center gap-2 p-16 text-[var(--color-text-dim)]">
              <Spinner /> Drafting the follow-up plan...
            </Card>
          )}

          {result && (
            <div className="animate-pop-in flex flex-col gap-6">
              <Card className="flex items-center justify-between p-5">
                <div className="flex items-center gap-2.5">
                  <Flame size={18} style={{ color: result.hotLead ? "var(--color-followup)" : "var(--color-text-faint)" }} />
                  <div>
                    <p className="text-sm font-semibold">{result.hotLead ? "Hot lead" : "Standard lead"}</p>
                    <p className="text-xs text-[var(--color-text-dim)]">{result.priorityReason}</p>
                  </div>
                </div>
                <Tag tone={result.priorityScore >= 7 ? "bad" : result.priorityScore >= 4 ? "warn" : "default"}>
                  Priority {result.priorityScore}/10
                </Tag>
              </Card>

              <Card className="p-6">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <Mail size={15} /> Thank-you email
                </h3>
                <p className="mb-2 text-sm font-medium text-[var(--color-text)]">{result.thankYouEmail.subject}</p>
                <p className="whitespace-pre-line text-sm leading-relaxed text-[var(--color-text-dim)]">{result.thankYouEmail.body}</p>
              </Card>

              <Card className="p-6">
                <h3 className="mb-2 text-sm font-semibold">Quotation note</h3>
                <p className="text-sm leading-relaxed text-[var(--color-text-dim)]">{result.quotationNote}</p>
              </Card>

              <Card className="p-6">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <Calendar size={15} /> Follow-up schedule
                </h3>
                <div className="flex flex-col gap-3">
                  {result.followUpSchedule.map((f, i) => {
                    const Icon = CHANNEL_ICON[f.channel];
                    return (
                      <div key={i} className="flex gap-3 border-b border-[var(--color-border-soft)] pb-3 last:border-0 last:pb-0">
                        <div className="flex h-8 w-14 shrink-0 items-center justify-center rounded-lg bg-[var(--color-followup-soft)] text-xs font-semibold" style={{ color: "var(--color-followup)" }}>
                          Day {f.day}
                        </div>
                        <div>
                          <p className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-dim)]">
                            <Icon size={12} /> {f.channel}
                          </p>
                          <p className="mt-0.5 text-sm">{f.message}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <MessageCircle size={15} /> WhatsApp reminder
                </h3>
                <p className="rounded-lg bg-[var(--color-surface-2)] p-3 text-sm">{result.whatsappReminder}</p>
              </Card>

              <Card className="p-6">
                <h3 className="mb-2 text-sm font-semibold">CRM note</h3>
                <p className="text-sm text-[var(--color-text-dim)]">{result.crmNote}</p>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
