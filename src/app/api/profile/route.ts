import { getSupabaseServerClient } from "@/lib/supabase/server";

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
    const supabase = await getSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
      });

    const body = await req.json().catch(() => ({}));
    const settings = body?.settings ?? null;
    if (!settings)
      return new Response(JSON.stringify({ error: "invalid" }), {
        status: 400,
      });

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
