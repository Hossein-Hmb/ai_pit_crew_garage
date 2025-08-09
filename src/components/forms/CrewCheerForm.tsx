"use client";

import { useState } from "react";
import { useGarage } from "@/components/garage/GarageContext";

export default function CrewCheerForm() {
  const [name, setName] = useState("");
  const [style, setStyle] = useState("cute");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { setCrewCheer } = useGarage();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/generate/crew-cheer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, style }),
      });
      const data = await res.json();
      const output = data.cheer || data.text || "Crew is shy today";
      setResult(output);
      setCrewCheer({ output, input: { name, style } });
    } catch {
      setResult("Megaphone ran out of batteries");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      <input
        className="rounded-lg p-2 bg-white/60 dark:bg-white/10 backdrop-blur outline-none ring-1 ring-transparent focus:ring-2 focus:ring-fuchsia-300/60"
        placeholder="Driver or car name (e.g. Lightning McQueen)"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <select
        className="rounded-lg p-2 bg-white/60 dark:bg-white/10 backdrop-blur outline-none ring-1 ring-transparent focus:ring-2 focus:ring-fuchsia-300/60"
        value={style}
        onChange={(e) => setStyle(e.target.value)}>
        <option value="cute">Cute</option>
        <option value="epic">Epic</option>
        <option value="silly">Silly</option>
      </select>
      <button
        disabled={loading}
        className="group relative inline-flex items-center justify-center rounded-xl px-5 py-2.5 font-semibold text-white bg-gradient-to-br from-fuchsia-500 to-purple-600 shadow-[0_10px_24px_rgba(168,85,247,0.35)] hover:shadow-[0_15px_35px_rgba(168,85,247,0.45)] transition-all disabled:opacity-50">
        <span className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        {loading ? "Warming up..." : "Generate cheer"}
      </button>
      {result && (
        <div className="mt-3 flex items-start justify-between gap-3">
          <pre className="text-sm whitespace-pre-wrap">📣 {result}</pre>
        </div>
      )}
    </form>
  );
}
