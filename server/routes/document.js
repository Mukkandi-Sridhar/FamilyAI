import { Router } from "express";
import { askStructured } from "../openaiClient.js";

const router = Router();

const schema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string" },
    executiveSummary: { type: "string" },
    trends: { type: "array", items: { type: "string" }, description: "Key trends or highlights spotted in the data/notes" },
    chartData: {
      type: "array",
      description: "If the raw input contains quantifiable data (numbers, sales figures, counts over time/category), extract it here as label/value pairs for a bar chart. Empty array if the input has no quantifiable data.",
      items: {
        type: "object",
        additionalProperties: false,
        properties: { label: { type: "string" }, value: { type: "number" } },
        required: ["label", "value"],
      },
    },
    sections: {
      type: "array",
      minItems: 2,
      items: {
        type: "object",
        additionalProperties: false,
        properties: { heading: { type: "string" }, content: { type: "string" } },
        required: ["heading", "content"],
      },
    },
    insights: { type: "array", items: { type: "string" }, description: "Recommendations / suggested next actions based on the report" },
    actionItems: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: { item: { type: "string" }, owner: { type: "string" }, dueHint: { type: "string" } },
        required: ["item", "owner", "dueHint"],
      },
    },
  },
  required: ["title", "executiveSummary", "trends", "chartData", "sections", "insights", "actionItems"],
};

router.post("/generate", async (req, res, next) => {
  try {
    const { reportType, audience, tone, rawNotes } = req.body;
    if (!reportType || !rawNotes) {
      return res.status(400).json({ error: "reportType and rawNotes are required" });
    }

    const result = await askStructured({
      schemaName: "business_report",
      schema,
      system:
        "Act as a professional business analyst and writer. A manager gave you raw notes or data instead of spending hours formatting a report themselves. " +
        `Turn it into a polished, well-structured "${reportType}". Write a title, an executive summary, key trends/highlights, clearly organized sections, insights/recommendations, and action items with a suggested owner and timing where relevant. ` +
        "If the raw input contains numeric/quantifiable data (sales figures, counts, percentages by category or time period), extract it into chartData as label/value pairs suitable for a bar chart; otherwise leave chartData empty. Match the requested tone and audience.",
      user: `Report type: ${reportType}\nAudience: ${audience || "Internal team"}\nTone: ${tone || "Professional"}\n\nRaw notes / data:\n${rawNotes}`,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
