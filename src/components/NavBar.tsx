import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import SessionIndicator from "@/components/SessionIndicator";

export default async function NavBar() {
  let userEmail: string | null = null;
  try {
    const supabase = await getSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    userEmail = data.user?.email ?? null;
  } catch {
    userEmail = null;
  }

  return (
    <header className="sticky top-0 z-30 border-b border-black/10 dark:border-white/10 bg-white/60 dark:bg-black/30 backdrop-blur-xl text-slate-800 dark:text-slate-200">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="font-extrabold text-xl font-title tracking-wide">
          🛠️🏎️ AI Pit Crew Garage
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/garage" className="hover:underline">
            Garage
          </Link>
          <Link href="/garage/shelf" className="hover:underline">
            Shelf
          </Link>
          <Link href="/settings" className="hover:underline">
            Settings
          </Link>
          <SessionIndicator active={!!userEmail} />
          {userEmail ? (
            <form action="/auth/signout" method="post">
              <button className="hover:underline" type="submit">
                Log out
              </button>
            </form>
          ) : (
            <Link href="/login" className="hover:underline">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
