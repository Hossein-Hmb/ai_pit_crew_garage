"use client";

import { useEffect, useState } from "react";

type Item = { id: string; kind: string; output: string; created_at: string };

export default function ShelfPage() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch("/api/garage-items", { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
      })
      .then((data) => {
        if (!mounted) return;
        setItems((data?.items as Item[]) ?? []);
      })
      .catch((e) => {
        if (!mounted) return;
        setError(String(e?.message || e));
        setItems([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <h1 className="text-3xl font-extrabold mb-6 font-title">
        Your Garage Shelf
      </h1>
      <p className="opacity-80 mb-6">Saved names, strategies, and cheers.</p>
      {items === null ? (
        <p className="opacity-70">Loading…</p>
      ) : items.length === 0 ? (
        <p className="opacity-70">
          {error
            ? `Error: ${error}`
            : "Nothing saved yet. Generate something and hit “Save All to Garage”."}
        </p>
      ) : (
        <ul className="grid sm:grid-cols-2 gap-4">
          {items.map((it) => (
            <li
              key={it.id}
              className="rounded-2xl p-5 bg-white/60 dark:bg-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
              <div className="text-xs uppercase tracking-wide opacity-70 mb-1">
                {it.kind}
              </div>
              <div className="whitespace-pre-wrap text-sm">{it.output}</div>
              <div className="mt-2 text-xs opacity-60">
                {new Date(it.created_at).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
