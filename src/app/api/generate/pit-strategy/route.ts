import OpenAI from "openai";
import { z } from "zod";

const schema = z.object({
  laps: z.number().min(5).max(500),
  tireWear: z.enum(["low", "medium", "high"]).default("medium"),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse({ ...body, laps: Number(body?.laps) });
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
  const { laps, tireWear } = parsed.data;
  const prompt = `Create a funny pit stop strategy for a ${laps}-lap race with ${tireWear} tire wear. Include lap numbers, tire choices, and one ridiculous tip. Max 120 words.`;
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.8,
    messages: [
      { role: "system", content: "Be concise, family-friendly, and playful." },
      { role: "user", content: prompt },
    ],
  });

  const text =
    completion.choices[0]?.message?.content?.trim() ||
    "Pit on lap 20 for pizza and fresh tires.";
  return new Response(JSON.stringify({ strategy: text }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
