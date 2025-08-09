"use client";

import { useState } from "react";
import { useGarage } from "@/components/garage/GarageContext";

export default function CarNameForm() {
  const [color, setColor] = useState("");
  const [vibe, setVibe] = useState("goofy");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { setCarName } = useGarage();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/generate/car-name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ color, vibe }),
      });
      const data = await res.json();
      const output = data.name || data.text || "No name, car shy 😳";
      setResult(output);
      setCarName({ output, input: { color, vibe } });
    } catch {
      setResult("Engine light is on (API error)");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      <input
        className="rounded-lg p-2 bg-white/60 dark:bg-white/10 backdrop-blur outline-none ring-1 ring-transparent focus:ring-2 focus:ring-blue-300/60"
        placeholder="Color (e.g. lime green)"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
      <select
        className="rounded-lg p-2 bg-white/60 dark:bg-white/10 backdrop-blur outline-none ring-1 ring-transparent focus:ring-2 focus:ring-blue-300/60"
        value={vibe}
        onChange={(e) => setVibe(e.target.value)}>
        <option value="goofy">Goofy</option>
        <option value="chaotic">Chaotic</option>
        <option value="cool">Cool</option>
      </select>
      <button
        disabled={loading}
        className="group relative inline-flex items-center justify-center rounded-xl px-5 py-2.5 font-semibold text-white bg-gradient-to-br from-blue-600 to-indigo-600 shadow-[0_10px_24px_rgba(37,99,235,0.35)] hover:shadow-[0_15px_35px_rgba(37,99,235,0.45)] transition-all disabled:opacity-50">
        <span className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        {loading ? "Revving..." : "Generate"}
      </button>
      {result && (
        <div className="mt-3 flex items-start justify-between gap-3">
          <p className="text-sm whitespace-pre-wrap">🧰 {result}</p>
        </div>
      )}
    </form>
  );
}
