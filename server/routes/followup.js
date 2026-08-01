import { Router } from "express";
import { askStructured } from "../openaiClient.js";

const router = Router();

const schema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hotLead: { type: "boolean" },
    priorityScore: { type: "number", description: "1-10, how urgently this contact should be followed up with" },
    priorityReason: { type: "string" },
    thankYouEmail: {
      type: "object",
      additionalProperties: false,
      properties: { subject: { type: "string" }, body: { type: "string" } },
      required: ["subject", "body"],
    },
    quotationNote: {
      type: "string",
      description: "A short note summarizing what should go in the quotation/pricing follow-up, based on what was discussed",
    },
    followUpSchedule: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          day: { type: "number", enum: [3, 7, 15] },
          channel: { type: "string", enum: ["Email", "WhatsApp", "Call"] },
          message: { type: "string" },
        },
        required: ["day", "channel", "message"],
      },
    },
    whatsappReminder: { type: "string" },
    crmNote: { type: "string", description: "A concise CRM-ready summary of this contact/deal stage" },
  },
  required: [
    "hotLead",
    "priorityScore",
    "priorityReason",
    "thankYouEmail",
    "quotationNote",
    "followUpSchedule",
    "whatsappReminder",
    "crmNote",
  ],
};

router.post("/generate", async (req, res, next) => {
  try {
    const { contactName, relationship, meetingNotes, goal, productOrService } = req.body;
    if (!contactName || !meetingNotes) {
      return res.status(400).json({ error: "contactName and meetingNotes are required" });
    }

    const result = await askStructured({
      schemaName: "followup_plan",
      schema,
      system:
        "Act as a sales follow-up assistant for a business. A sales rep just finished a customer meeting. From the meeting notes, draft everything needed so no lead is forgotten: " +
        "a Thank You email, a short quotation note (what pricing/product info to send), a follow-up schedule at day 3, day 7, and day 15 (channel + message for each), a WhatsApp reminder message, and a one-line CRM note. " +
        "Every message field (thankYouEmail.body, each followUpSchedule[].message, whatsappReminder) must be the literal, ready-to-send text addressed to the customer — never a description or instruction about what to send. " +
        "Also score how hot/urgent this lead is (1-10) and explain why. Keep messages ready-to-send with minimal edits, in a warm but professional tone. Never invent commitments the rep didn't make.",
      user: `Contact: ${contactName}${relationship ? ` (${relationship})` : ""}\nProduct/Service discussed: ${productOrService || "Not specified"}\nGoal: ${goal || "Move the deal forward"}\n\nMeeting notes:\n${meetingNotes}`,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
