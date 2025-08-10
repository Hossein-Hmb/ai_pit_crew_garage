import { getSupabaseServerClient } from "@/lib/supabase/server";
import { z } from "zod";
import { isAllowedOrigin } from "@/lib/security/origin";

export async function GET() {
  try {
    const supabase = await getSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return new Response(JSON.stringify({ settings: null }), { status: 200 });
    const { data, error } = await supabase
      .from("profiles")
      .select("settings")
      .eq("id", user.id)
      .single();
    if (error && error.code !== "PGRST116") throw error; // ignore not found
    return new Response(JSON.stringify({ settings: data?.settings ?? null }), {
      status: 200,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "error";
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!isAllowedOrigin(req)) {
      return new Response(JSON.stringify({ error: "forbidden" }), {
        status: 403,
      });
    }
    const supabase = await getSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
      });

    const SettingsSchema = z.object({
      theme: z.enum(["light", "dark"]).optional(),
      carNickname: z.string().max(100).optional(),
      crewPersonality: z.enum(["chaotic", "wise", "goofy"]).optional(),
    });
    const body = await req.json().catch(() => ({}));
    const parsed = z.object({ settings: SettingsSchema }).safeParse(body);
    if (!parsed.success)
      return new Response(JSON.stringify({ error: "invalid" }), {
        status: 400,
      });
    const settings = parsed.data.settings;

    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, settings }, { onConflict: "id" });
    if (error) throw error;
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "error";
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
