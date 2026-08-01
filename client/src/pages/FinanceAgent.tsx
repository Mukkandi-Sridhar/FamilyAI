import { useState } from "react";
import { Plus, Trash2, Wand2 } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Button, Card, EmptyState, ErrorBanner, Input, Label, Spinner, Tag } from "../components/ui";
import { analyzeFinances, type FinanceResult } from "../lib/api";

const CATEGORY_COLORS: Record<string, string> = {
  Essentials: "#2a78d6",
  "Non-Essentials": "#eb6834",
  Investments: "#1baf7a",
  Savings: "#eda100",
  Entertainment: "#e87ba4",
};

const DEFAULT_INCOME = 95000;
const DEFAULT_EXPENSES = [
  { name: "Home Loan EMI", amount: 22000 },
  { name: "Groceries", amount: 12500 },
  { name: "Milk", amount: 2100 },
  { name: "Electricity", amount: 2800 },
  { name: "Internet", amount: 1000 },
  { name: "Mobile Recharge", amount: 1200 },
  { name: "School Fees", amount: 8000 },
  { name: "Petrol", amount: 6500 },
  { name: "Dining Out", amount: 5200 },
  { name: "Swiggy/Zomato", amount: 3800 },
  { name: "Amazon Shopping", amount: 4700 },
  { name: "Netflix", amount: 649 },
  { name: "Disney+ Hotstar", amount: 899 },
  { name: "Gym Membership", amount: 1500 },
  { name: "Medical Expenses", amount: 2000 },
  { name: "Life Insurance Premium", amount: 3500 },
  { name: "SIP Investment", amount: 5000 },
  { name: "Emergency Savings", amount: 3000 },
  { name: "Temple Donation", amount: 1000 },
  { name: "Weekend Movie", amount: 2000 },
  { name: "Clothing Shopping", amount: 3500 },
];

function formatINR(n: number) {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

export default function FinanceAgent() {
  const [income, setIncome] = useState(DEFAULT_INCOME);
  const [expenses, setExpenses] = useState(DEFAULT_EXPENSES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FinanceResult | null>(null);

  function updateExpense(i: number, field: "name" | "amount", value: string) {
    setExpenses((prev) =>
      prev.map((e, idx) => (idx === i ? { ...e, [field]: field === "amount" ? Number(value) || 0 : value } : e))
    );
  }
  function removeExpense(i: number) {
    setExpenses((prev) => prev.filter((_, idx) => idx !== i));
  }
  function addExpense() {
    setExpenses((prev) => [...prev, { name: "", amount: 0 }]);
  }

  async function handleAnalyze() {
    setLoading(true);
    setError(null);
    try {
      const cleaned = expenses.filter((e) => e.name.trim() && e.amount > 0);
      const data = await analyzeFinances({ income, expenses: cleaned });
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const totalExpenses = expenses.reduce((s, e) => s + (e.amount || 0), 0);
  const chartData = result?.categories.filter((c) => c.total > 0).map((c) => ({ name: c.name, value: c.total })) ?? [];

  return (
    <div>
      <p className="text-sm font-medium" style={{ color: "var(--color-finance)" }}>
        Finance Coach
      </p>
      <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight animate-fade-up">Where did the month go?</h1>
      <p className="mt-2 max-w-2xl text-[var(--color-text-dim)]">
        Enter your income and monthly expenses. The coach categorizes spend, flags what's cuttable, and proposes
        next month's budget.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="p-6 lg:col-span-2">
          <Label>Monthly income</Label>
          <Input
            type="number"
            value={income}
            onChange={(e) => setIncome(Number(e.target.value) || 0)}
            className="mb-5"
          />

          <div className="mb-2 flex items-center justify-between">
            <Label>Expenses</Label>
            <span className="text-xs text-[var(--color-text-dim)]">Total {formatINR(totalExpenses)}</span>
          </div>

          <div className="flex max-h-96 flex-col gap-2 overflow-y-auto pr-1">
            {expenses.map((e, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="min-w-0 flex-1">
                  <Input
                    value={e.name}
                    placeholder="Expense name"
                    onChange={(ev) => updateExpense(i, "name", ev.target.value)}
                  />
                </div>
                <div className="w-28 shrink-0">
                  <Input
                    type="number"
                    value={e.amount || ""}
                    placeholder="0"
                    onChange={(ev) => updateExpense(i, "amount", ev.target.value)}
                  />
                </div>
                <button
                  onClick={() => removeExpense(i)}
                  className="shrink-0 rounded-lg p-2 text-[var(--color-text-dim)] hover:bg-[var(--color-surface-2)] hover:text-rose-600"
                  aria-label="Remove expense"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <Button variant="outline" className="mt-3 w-full" onClick={addExpense}>
            <Plus size={14} /> Add expense
          </Button>

          <Button className="mt-4 w-full" onClick={handleAnalyze} disabled={loading}>
            {loading ? <Spinner /> : <Wand2 size={14} />}
            {loading ? "Analyzing..." : "Analyze my budget"}
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
              title="No analysis yet"
              detail="Fill in your expenses and click Analyze — the breakdown, unnecessary spend, and next month's budget will appear here."
            />
          )}

          {loading && (
            <Card className="flex items-center justify-center gap-2 p-16 text-[var(--color-text-dim)]">
              <Spinner /> Crunching the numbers...
            </Card>
          )}

          {result && (
            <div className="animate-pop-in flex flex-col gap-6">
              <Card className="p-6">
                <h3 className="mb-1 text-sm font-semibold">Summary</h3>
                <p className="text-sm leading-relaxed text-[var(--color-text-dim)]">{result.summary}</p>
              </Card>

              <Card className="p-6">
                <h3 className="mb-4 text-sm font-semibold">Spend by category</h3>
                <div className="flex flex-col items-center gap-4 sm:flex-row">
                  <div className="h-56 w-full sm:w-1/2">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={55}
                          outerRadius={85}
                          paddingAngle={2}
                          strokeWidth={2}
                          stroke="var(--color-surface-solid)"
                          isAnimationActive={false}
                        >
                          {chartData.map((d) => (
                            <Cell key={d.name} fill={CATEGORY_COLORS[d.name] ?? "#8b90a8"} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => formatINR(Number(value ?? 0))}
                          contentStyle={{
                            background: "var(--color-surface-2)",
                            border: "1px solid var(--color-border)",
                            borderRadius: 8,
                            color: "var(--color-text)",
                            fontSize: 12,
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex w-full flex-col gap-2 sm:w-1/2">
                    {result.categories.map((c) => (
                      <div key={c.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 shrink-0 rounded-full"
                            style={{ background: CATEGORY_COLORS[c.name] ?? "#8b90a8" }}
                          />
                          <span className="text-[var(--color-text)]">{c.name}</span>
                        </div>
                        <span className="text-[var(--color-text-dim)]">
                          {formatINR(c.total)} · {c.pct}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="mb-3 text-sm font-semibold">Top unnecessary expenses</h3>
                <div className="flex flex-col gap-2.5">
                  {result.topUnnecessary.map((t, i) => (
                    <div key={i} className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] pb-2.5 last:border-0 last:pb-0">
                      <div>
                        <p className="text-sm font-medium">{t.name}</p>
                        <p className="text-xs text-[var(--color-text-dim)]">{t.reason}</p>
                      </div>
                      <Tag tone="warn">{formatINR(t.amount)}</Tag>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="mb-3 text-sm font-semibold">Suggestions to save</h3>
                <div className="flex flex-col gap-2.5">
                  {result.suggestions.map((s, i) => (
                    <div key={i} className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] pb-2.5 last:border-0 last:pb-0">
                      <div>
                        <p className="text-sm font-medium">{s.title}</p>
                        <p className="text-xs text-[var(--color-text-dim)]">{s.detail}</p>
                      </div>
                      <Tag tone="good">Save {formatINR(s.estimatedMonthlySavings)}</Tag>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="mb-3 text-sm font-semibold">Next month's budget</h3>
                <div className="grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2">
                  {result.nextMonthBudget.map((b, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-[var(--color-text-dim)]">{b.name}</span>
                      <span className="font-medium">{formatINR(b.recommendedAmount)}</span>
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
