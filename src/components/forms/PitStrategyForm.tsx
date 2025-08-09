"use client";

import { useState } from "react";
import { useGarage } from "@/components/garage/GarageContext";

export default function PitStrategyForm() {
  const [laps, setLaps] = useState(50);
  const [tireWear, setTireWear] = useState("medium");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { setPitStrategy } = useGarage();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/generate/pit-strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ laps, tireWear }),
      });
      const data = await res.json();
      const output = data.strategy || data.text || "No plan, just vibes 🤷";
      setResult(output);
      setPitStrategy({ output, input: { laps, tireWear } });
    } catch {
      setResult("Spilled Gatorade on the strategy laptop");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      <div className="flex gap-3 items-center">
        <label className="text-sm">Race Laps</label>
        <input
          type="number"
          min={5}
          max={500}
          className="rounded-lg p-2 w-28 bg-white/60 dark:bg-white/10 backdrop-blur outline-none ring-1 ring-transparent focus:ring-2 focus:ring-emerald-300/60"
          value={laps}
          onChange={(e) => setLaps(parseInt(e.target.value || "0"))}
        />
      </div>
      <select
        className="rounded-lg p-2 bg-white/60 dark:bg-white/10 backdrop-blur outline-none ring-1 ring-transparent focus:ring-2 focus:ring-emerald-300/60"
        value={tireWear}
        onChange={(e) => setTireWear(e.target.value)}>
        <option value="low">Low tire wear</option>
        <option value="medium">Medium tire wear</option>
        <option value="high">High tire wear</option>
      </select>
      <button
        disabled={loading}
        className="group relative inline-flex items-center justify-center rounded-xl px-5 py-2.5 font-semibold text-white bg-gradient-to-br from-emerald-500 to-green-600 shadow-[0_10px_24px_rgba(16,185,129,0.35)] hover:shadow-[0_15px_35px_rgba(16,185,129,0.45)] transition-all disabled:opacity-50">
        <span className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        {loading ? "Calculating..." : "Plan my chaos"}
      </button>
      {result && (
        <div className="mt-3 flex items-start justify-between gap-3">
          <p className="text-sm whitespace-pre-wrap">🛞 {result}</p>
        </div>
      )}
    </form>
  );
}
