import { getSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function POST() {
  try {
    const supabase = await getSupabaseServerClient();
    await supabase.auth.signOut();
  } catch {}
  redirect("/");
}
