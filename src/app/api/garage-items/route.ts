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
      return new Response(JSON.stringify({ items: [] }), { status: 200 });
    const { data, error } = await supabase
      .from("garage_items")
      .select("id, kind, input, output, favorite, is_public, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return new Response(JSON.stringify({ items: data ?? [] }), { status: 200 });
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
    const schema = z.object({
      kind: z.enum(["car_name", "pit_strategy", "crew_cheer"]),
      input: z.any().optional(),
      output: z.string().min(1).max(4000),
      favorite: z.boolean().optional(),
      is_public: z.boolean().optional(),
    });
    const body = await req.json().catch(() => ({}));
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: "invalid" }), {
        status: 400,
      });
    }
    const { kind, input, output, favorite, is_public } = parsed.data;
    const { data, error } = await supabase
      .from("garage_items")
      .insert({
        user_id: user.id,
        kind,
        input,
        output,
        favorite: !!favorite,
        is_public: !!is_public,
      })
      .select("id")
      .single();
    if (error) throw error;
    return new Response(JSON.stringify({ id: data.id }), { status: 200 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "error";
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
