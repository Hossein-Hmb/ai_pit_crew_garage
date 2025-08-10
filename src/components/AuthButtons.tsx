"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Github, LogOut, Mail } from "lucide-react";
import { useState } from "react";

export default function AuthButtons() {
  const [loading, setLoading] = useState<string | null>(null);

  async function signInWithProvider(provider: "github" | "google") {
    setLoading(provider);
    try {
      const supabase = getSupabaseBrowserClient();
      const redirectTo = `${window.location.origin}/auth/callback`;
      await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo },
      });
    } finally {
      setLoading(null);
    }
  }

  async function signOut() {
    setLoading("signout");
    try {
      const supabase = getSupabaseBrowserClient();
      await supabase.auth.signOut();
      window.location.assign("/");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => signInWithProvider("github")}
        disabled={loading !== null}
        className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 text-white px-5 py-2.5 shadow-[0_10px_25px_rgba(0,0,0,0.25)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.35)] transition-all disabled:opacity-50">
        <span className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <Github size={18} />
        <span>
          {loading === "github" ? "Revving..." : "Sign in with GitHub"}
        </span>
      </button>
      <button
        onClick={() => signInWithProvider("google")}
        disabled={loading !== null}
        className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 text-white px-5 py-2.5 shadow-[0_10px_25px_rgba(244,63,94,0.35)] hover:shadow-[0_15px_35px_rgba(244,63,94,0.45)] transition-all disabled:opacity-50">
        <span className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        <Mail size={18} />
        <span>{loading === "google" ? "Vroom..." : "Sign in with Google"}</span>
      </button>
      <button
        onClick={signOut}
        disabled={loading !== null}
        className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 text-white px-5 py-2.5 shadow-[0_10px_25px_rgba(0,0,0,0.25)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.35)] transition-all disabled:opacity-50">
        <span className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <LogOut size={18} />
        <span>{loading === "signout" ? "Rolling out..." : "Sign out"}</span>
      </button>
    </div>
  );
}
