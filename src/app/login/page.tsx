import AuthButtons from "@/components/AuthButtons";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function LoginPage() {
  let userEmail: string | null = null;
  try {
    const supabase = await getSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    userEmail = data.user?.email ?? null;
  } catch {}

  return (
    <div className="mx-auto max-w-xl px-5 py-12">
      <h1 className="text-3xl font-extrabold mb-4">Login</h1>
      <p className="opacity-80 mb-6">
        Join the crew to save settings and flex your garage.
      </p>
      <AuthButtons />
      {userEmail && (
        <p className="mt-6 text-sm">
          You are signed in as{" "}
          <span className="font-semibold">{userEmail}</span>. Head to{" "}
          <Link href="/garage" className="underline">
            the Garage
          </Link>
          .
        </p>
      )}
      <EnvHint />
    </div>
  );
}

function EnvHint() {
  const missing =
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!missing) return null;
  return (
    <div className="mt-8 rounded-lg border border-yellow-400 bg-yellow-50 text-yellow-900 p-4 text-sm">
      Missing Supabase env vars. Add them to <code>.env.local</code> using the
      template in <code>.env.example</code>.
    </div>
  );
}
