"use client";

import { useEffect, useState } from "react";
import { useGarage } from "./GarageContext";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function SaveAllButton() {
  const { carName, pitStrategy, crewCheer } = useGarage();
  const [saving, setSaving] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [justSaved, setJustSaved] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const disabled = !carName && !pitStrategy && !crewCheer;

  useEffect(() => {
    let mounted = true;
    async function check() {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data } = await supabase.auth.getUser();
        if (!mounted) return;
        setIsLoggedIn(!!data.user);
      } catch {
        setIsLoggedIn(false);
      }
    }
    check();
    return () => {
      mounted = false;
    };
  }, []);

  async function saveAll() {
    if (disabled) return;
    if (!isLoggedIn) {
      window.location.assign("/login");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const jobs: Promise<Response>[] = [];
      if (carName) {
        jobs.push(
          fetch("/api/garage-items", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              kind: "car_name",
              input: carName.input,
              output: carName.output,
            }),
          })
        );
      }
      if (pitStrategy) {
        jobs.push(
          fetch("/api/garage-items", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              kind: "pit_strategy",
              input: pitStrategy.input,
              output: pitStrategy.output,
            }),
          })
        );
      }
      if (crewCheer) {
        jobs.push(
          fetch("/api/garage-items", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              kind: "crew_cheer",
              input: crewCheer.input,
              output: crewCheer.output,
            }),
          })
        );
      }
      const responses = await Promise.all(jobs);
      const bad = responses.find((r) => !r.ok);
      if (!bad) {
        setJustSaved(true);
        setTimeout(() => setJustSaved(false), 2000);
      } else {
        const msg = await bad.text().catch(() => "Save failed");
        setError(msg || `Save failed (${bad.status})`);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={saveAll}
        disabled={saving || disabled}
        title={
          disabled
            ? "Generate something first"
            : isLoggedIn
            ? "Save all to your Garage"
            : "Login to save"
        }
        className="group relative inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white bg-gradient-to-br from-slate-700 to-slate-900 shadow-[0_10px_20px_rgba(0,0,0,0.25)] hover:shadow-[0_15px_28px_rgba(0,0,0,0.35)] transition-all disabled:opacity-50">
        <span className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        {saving
          ? "Saving..."
          : justSaved
          ? "Saved!"
          : isLoggedIn
          ? "Save All to Garage"
          : "Login to Save"}
      </button>
      {error && (
        <span className="text-xs text-rose-600 dark:text-rose-400">
          {error}
        </span>
      )}
    </div>
  );
}
