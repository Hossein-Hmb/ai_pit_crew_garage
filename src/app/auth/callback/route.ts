import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    if (code) {
      const supabase = await getSupabaseServerClient();
      await supabase.auth.exchangeCodeForSession(code);
      // Supabase sets cookies via our cookie adapter
      return NextResponse.redirect(new URL("/garage", request.url));
    }
  } catch {}
  return NextResponse.redirect(new URL("/login", request.url));
}
