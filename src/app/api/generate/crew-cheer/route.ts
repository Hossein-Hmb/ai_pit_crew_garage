import OpenAI from "openai";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1).max(64),
  style: z.enum(["cute", "epic", "silly"]).default("cute"),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: "Invalid input" }), {
      status: 400,
    });
  }
  if (!process.env.OPENAI_API_KEY) {
    return new Response(JSON.stringify({ error: "Missing OPENAI_API_KEY" }), {
      status: 500,
    });
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const { name, style } = parsed.data;
  const prompt = `Write a short, rhyming cheer for ${name} in a ${style} style. 3-5 lines. Add emojis sparingly.`;
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.85,
    messages: [
      { role: "system", content: "Be supportive and fun. No profanity." },
      { role: "user", content: prompt },
    ],
  });

  const text = completion.choices[0]?.message?.content?.trim() || "Go go go!";
  return new Response(JSON.stringify({ cheer: text }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
