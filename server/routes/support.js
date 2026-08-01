import { Router } from "express";
import { randomUUID } from "crypto";
import { askStructured } from "../openaiClient.js";

const router = Router();
const sessions = new Map();

const replySchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reply: { type: "string" },
    escalate: { type: "boolean" },
    escalateReason: { type: ["string", "null"] },
  },
  required: ["reply", "escalate", "escalateReason"],
};

router.post("/start", async (req, res, next) => {
  try {
    const { businessName, knowledgeBase } = req.body;
    if (!businessName || !knowledgeBase) {
      return res.status(400).json({ error: "businessName and knowledgeBase are required" });
    }

    const session = {
      id: randomUUID(),
      businessName,
      knowledgeBase,
      transcript: [],
    };
    sessions.set(session.id, session);

    res.json({
      sessionId: session.id,
      greeting: `Hi! I'm ${businessName}'s support assistant. How can I help you today?`,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/message", async (req, res, next) => {
  try {
    const { sessionId, message } = req.body;
    const session = sessions.get(sessionId);
    if (!session) return res.status(404).json({ error: "Session not found" });
    if (!message) return res.status(400).json({ error: "message is required" });

    session.transcript.push({ role: "customer", content: message });
    const history = session.transcript.map((t) => `${t.role === "customer" ? "Customer" : "Agent"}: ${t.content}`).join("\n");

    const result = await askStructured({
      schemaName: "support_reply",
      schema: replySchema,
      system:
        `Act as ${session.businessName}'s friendly, efficient customer support agent. Answer ONLY using the knowledge base below — never invent policies, prices, order statuses, or facts not in it. ` +
        "If the knowledge base contains the answer, reply helpfully and concisely. If the question is outside the knowledge base, ambiguous, a complaint, or otherwise needs a human (e.g. account-specific issues you can't verify, refund disputes, anger/frustration), set escalate to true with a short escalateReason, and still give a brief, empathetic holding reply telling the customer a human will follow up. Otherwise escalate is false and escalateReason is null.\n\n" +
        `Knowledge base:\n${session.knowledgeBase}`,
      user: `Conversation so far:\n${history}\n\nRespond to the customer's latest message.`,
    });

    session.transcript.push({ role: "agent", content: result.reply });
    res.json({ sessionId: session.id, ...result });
  } catch (err) {
    next(err);
  }
});

export default router;
