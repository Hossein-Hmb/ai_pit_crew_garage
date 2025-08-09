import OpenAI from "openai";
import { z } from "zod";

const schema = z.object({
  color: z.string().min(1).max(64),
  vibe: z.enum(["goofy", "chaotic", "cool"]).default("goofy"),
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

  const { color, vibe } = parsed.data;
  const prompt = `You are a silly car-namer in a kid's garage. Invent 3 over-the-top car nicknames based on color=${color} and vibe=${vibe}. Return just one final best name.`;
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.9,
    messages: [
      { role: "system", content: "Keep it playful, safe-for-work, short." },
      { role: "user", content: prompt },
    ],
  });

  const text =
    completion.choices[0]?.message?.content?.trim() || "Turbo Nugget";
  return new Response(JSON.stringify({ name: text }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
