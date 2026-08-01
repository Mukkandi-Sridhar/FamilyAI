import { useState } from "react";
import { CheckSquare, FileText, Lightbulb, TrendingUp, Wand2 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button, Card, EmptyState, ErrorBanner, Input, Label, Spinner, Tag, Textarea } from "../components/ui";
import { generateReport, REPORT_TYPES, type ReportResult } from "../lib/api";

export default function DocumentAgent() {
  const [reportType, setReportType] = useState<string>(REPORT_TYPES[1]);
  const [audience, setAudience] = useState("Leadership team");
  const [tone, setTone] = useState("Professional");
  const [rawNotes, setRawNotes] = useState(
    "Monthly sales: Jan 4.2L, Feb 4.6L, Mar 5.1L, Apr 4.9L, May 5.8L, Jun 6.3L. New customers up 18% vs last quarter. Furniture category outperforming, kitchen category flat. Two big enquiries pending close. Marketing spend increased 10% in Q2."
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ReportResult | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const data = await generateReport({ reportType, audience, tone, rawNotes });
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <p className="text-sm font-medium" style={{ color: "var(--color-document)" }}>
        Document &amp; Report Agent
      </p>
      <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight animate-fade-up">Reports in minutes, not hours.</h1>
      <p className="mt-2 max-w-2xl text-[var(--color-text-dim)]">
        Paste raw notes or numbers — get a structured draft report with a summary, trends, a chart when there's data
        to chart, and action items. Verify and add business context before sending.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="p-6 lg:col-span-2">
          <Label>Report type</Label>
          <div className="mb-5 flex flex-wrap gap-1.5">
            {REPORT_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setReportType(t)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  reportType === t
                    ? "border-transparent bg-[var(--color-text)] text-white"
                    : "border-[var(--color-border)] text-[var(--color-text-dim)] hover:bg-[var(--color-surface-2)]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <Label>Audience</Label>
          <Input value={audience} onChange={(e) => setAudience(e.target.value)} className="mb-5" />

          <Label>Tone</Label>
          <Input value={tone} onChange={(e) => setTone(e.target.value)} className="mb-5" />

          <Label>Raw notes / data</Label>
          <Textarea value={rawNotes} onChange={(e) => setRawNotes(e.target.value)} rows={9} placeholder="Paste bullet points, numbers, or a data dump..." />

          <Button className="mt-4 w-full" onClick={handleGenerate} disabled={loading || !rawNotes.trim()}>
            {loading ? <Spinner /> : <Wand2 size={14} />}
            {loading ? "Writing report..." : "Generate report"}
          </Button>

          {error && (
            <div className="mt-3">
              <ErrorBanner message={error} />
            </div>
          )}
        </Card>

        <div className="flex flex-col gap-6 lg:col-span-3">
          {!result && !loading && (
            <EmptyState title="No report yet" detail="Add your notes or data and generate — the draft report will appear here." />
          )}
          {loading && (
            <Card className="flex items-center justify-center gap-2 p-16 text-[var(--color-text-dim)]">
              <Spinner /> Analyzing and drafting...
            </Card>
          )}

          {result && (
            <div className="animate-pop-in flex flex-col gap-6">
              <Card className="p-6">
                <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide" style={{ color: "var(--color-document)" }}>
                  <FileText size={13} /> {reportType}
                </div>
                <h2 className="text-lg font-semibold">{result.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-dim)]">{result.executiveSummary}</p>
              </Card>

              {result.trends.length > 0 && (
                <Card className="p-6">
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                    <TrendingUp size={15} /> Key trends
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {result.trends.map((t, i) => (
                      <Tag key={i} tone="brand">
                        {t}
                      </Tag>
                    ))}
                  </div>
                </Card>
              )}

              {result.chartData.length > 0 && (
                <Card className="p-6">
                  <h3 className="mb-4 text-sm font-semibold">At a glance</h3>
                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={result.chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                        <XAxis dataKey="label" tick={{ fontSize: 12, fill: "var(--color-text-dim)" }} axisLine={{ stroke: "var(--color-border)" }} tickLine={false} />
                        <YAxis tick={{ fontSize: 12, fill: "var(--color-text-dim)" }} axisLine={false} tickLine={false} />
                        <Tooltip
                          contentStyle={{
                            background: "var(--color-surface)",
                            border: "1px solid var(--color-border)",
                            borderRadius: 8,
                            fontSize: 12,
                          }}
                        />
                        <Bar dataKey="value" fill="var(--color-document)" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              )}

              <Card className="p-6">
                <h3 className="mb-3 text-sm font-semibold">Sections</h3>
                <div className="flex flex-col gap-4">
                  {result.sections.map((s, i) => (
                    <div key={i}>
                      <p className="text-sm font-medium">{s.heading}</p>
                      <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-dim)]">{s.content}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <Lightbulb size={15} /> Insights &amp; recommendations
                </h3>
                <ul className="flex flex-col gap-1.5 text-sm text-[var(--color-text-dim)]">
                  {result.insights.map((ins, i) => (
                    <li key={i} className="flex gap-2">
                      <span>•</span>
                      <span>{ins}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <CheckSquare size={15} /> Action items
                </h3>
                <div className="flex flex-col gap-2">
                  {result.actionItems.map((a, i) => (
                    <div key={i} className="flex items-start justify-between gap-4 border-b border-[var(--color-border-soft)] pb-2 last:border-0 last:pb-0">
                      <p className="text-sm">{a.item}</p>
                      <div className="shrink-0 text-right text-xs text-[var(--color-text-dim)]">
                        <p>{a.owner}</p>
                        <p>{a.dueHint}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
