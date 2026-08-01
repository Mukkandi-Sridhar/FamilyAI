import { Router } from "express";
import { askStructured } from "../openaiClient.js";

const router = Router();

// The "top unnecessary" and "suggestions" lists are capped by how many expense
// lines actually exist — asking for 10 when only 4 were submitted would force
// the model to either violate the schema or invent expenses. Build the schema
// per-request from the real expense count instead of a hardcoded 10.
function buildSchema(expenseCount) {
  const topN = Math.max(1, Math.min(10, expenseCount));
  return {
    type: "object",
    additionalProperties: false,
    properties: {
      categories: {
        type: "array",
        minItems: 5,
        maxItems: 5,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            name: {
              type: "string",
              enum: ["Essentials", "Non-Essentials", "Investments", "Savings", "Entertainment"],
            },
            total: { type: "number" },
            pct: { type: "number" },
            items: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                properties: {
                  name: { type: "string" },
                  amount: { type: "number" },
                },
                required: ["name", "amount"],
              },
            },
          },
          required: ["name", "total", "pct", "items"],
        },
      },
      topUnnecessary: {
        type: "array",
        minItems: topN,
        maxItems: topN,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            name: { type: "string" },
            amount: { type: "number" },
            reason: { type: "string" },
          },
          required: ["name", "amount", "reason"],
        },
      },
      suggestions: {
        type: "array",
        minItems: Math.min(5, topN),
        maxItems: Math.min(5, topN),
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            title: { type: "string" },
            detail: { type: "string" },
            estimatedMonthlySavings: { type: "number" },
          },
          required: ["title", "detail", "estimatedMonthlySavings"],
        },
      },
      nextMonthBudget: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            name: { type: "string" },
            recommendedAmount: { type: "number" },
          },
          required: ["name", "recommendedAmount"],
        },
      },
      summary: { type: "string" },
    },
    required: ["categories", "topUnnecessary", "suggestions", "nextMonthBudget", "summary"],
  };
}

const FALLBACK_CATEGORY = "Non-Essentials";

// The model is reliable at semantic categorization but not at arithmetic, and can
// occasionally drop a line item. Recompute all numbers from the original inputs
// and patch in anything missing, rather than trusting the model's totals.
function reconcile(result, expenses, income) {
  const byName = new Map(expenses.map((e) => [e.name.trim().toLowerCase(), e]));
  const placed = new Set();

  for (const category of result.categories) {
    category.items = category.items
      .map((item) => {
        const key = item.name.trim().toLowerCase();
        const original = byName.get(key);
        if (!original) return null; // model invented a line item that wasn't submitted
        if (placed.has(key)) return null; // model put the same item in more than one category — keep only the first
        placed.add(key);
        return { name: original.name, amount: original.amount };
      })
      .filter(Boolean);
  }

  const missing = expenses.filter((e) => !placed.has(e.name.trim().toLowerCase()));
  if (missing.length > 0) {
    const fallback = result.categories.find((c) => c.name === FALLBACK_CATEGORY) ?? result.categories[0];
    fallback.items.push(...missing.map((e) => ({ name: e.name, amount: e.amount })));
  }

  for (const category of result.categories) {
    category.total = category.items.reduce((sum, i) => sum + i.amount, 0);
    category.pct = income > 0 ? Math.round((category.total / income) * 10000) / 100 : 0;
  }

  // topUnnecessary can repeat the same expense or reference one that wasn't
  // submitted — dedupe against real expenses and drop anything invented.
  const seenUnnecessary = new Set();
  result.topUnnecessary = result.topUnnecessary.filter((item) => {
    const key = item.name.trim().toLowerCase();
    const original = byName.get(key);
    if (!original || seenUnnecessary.has(key)) return false;
    seenUnnecessary.add(key);
    item.name = original.name;
    item.amount = original.amount;
    return true;
  });

  return result;
}

router.post("/analyze", async (req, res, next) => {
  try {
    const { income, expenses } = req.body;
    if (!income || !Array.isArray(expenses) || expenses.length === 0) {
      return res.status(400).json({ error: "income and expenses[] are required" });
    }

    const expenseLines = expenses.map((e) => `${e.name} - ₹${e.amount}`).join("\n");
    const schema = buildSchema(expenses.length);
    const topN = schema.properties.topUnnecessary.minItems;

    const result = await askStructured({
      schemaName: "finance_analysis",
      schema,
      system:
        "Act as an experienced Indian personal finance coach. The categories array must contain EXACTLY 5 entries, one for each of: Essentials, Non-Essentials, Investments, Savings, Entertainment — in that order, even if a category's total is 0 with an empty items array. " +
        "Every single expense line item given by the user must be placed into exactly one category's items array — do not omit, merge, or drop any line item, and do not invent new ones. The amounts inside items must sum to that category's total, and totals across all 5 categories must sum to the full expense total. " +
        "For each category, compute the category total and its percentage of income. " +
        `Rank ALL submitted expenses by how unnecessary/cuttable they are and return the top ${topN} in topUnnecessary, most cuttable first, each with a short reason — use only expenses actually submitted, never invent new ones. ` +
        `Give exactly ${schema.properties.suggestions.minItems} practical suggestions to save money without hurting quality of life, each with an estimated monthly rupee saving. ` +
        "Propose a simple next month budget covering every original line item (recommended amount per line item). " +
        "Write a short plain-language summary of the family's financial health. All amounts are in Indian Rupees. Explain everything in simple language.",
      user: `Monthly Income: ₹${income}\n\nExpenses (${expenses.length} line items — every one of these must appear in the categories and nextMonthBudget):\n${expenseLines}`,
    });

    res.json(reconcile(result, expenses, income));
  } catch (err) {
    next(err);
  }
});

export default router;
