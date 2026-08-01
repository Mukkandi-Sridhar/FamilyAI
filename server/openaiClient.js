import "dotenv/config";
import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is missing. Add it to server/.env");
}

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

export async function askStructured({ system, user, schema, schemaName }) {
  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    response_format: {
      type: "json_schema",
      json_schema: { name: schemaName, strict: true, schema },
    },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("Empty model response");
  return JSON.parse(content);
}

// Same as askStructured, but the user turn includes an image (data URL) alongside text —
// used by the Homework Coach agent's photo-upload flow. Vision needs a capable model even
// when OPENAI_MODEL is set to a text-only one, so this always uses gpt-4o-mini.
export async function askStructuredWithImage({ system, text, imageDataUrl, schema, schemaName }) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: system },
      {
        role: "user",
        content: [
          { type: "text", text },
          { type: "image_url", image_url: { url: imageDataUrl } },
        ],
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: { name: schemaName, strict: true, schema },
    },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("Empty model response");
  return JSON.parse(content);
}
