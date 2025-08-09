"use client";

import { useEffect, useState } from "react";

type Settings = {
  theme: "light" | "dark";
  carNickname: string;
  crewPersonality: "chaotic" | "wise" | "goofy";
};

const defaultSettings: Settings = {
  theme: "light",
  carNickname: "Lil Zippy",
  crewPersonality: "goofy",
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const json = localStorage.getItem("garage_settings");
    if (json) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(json) });
      } catch {}
    }
    // Try load from server
    fetch("/api/profile")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.settings) {
          setSettings((prev) => ({ ...prev, ...data.settings }));
          localStorage.setItem(
            "garage_settings",
            JSON.stringify({ ...settings, ...data.settings })
          );
        }
      })
      .catch(() => {});
  }, []);

  function onChange<K extends keyof Settings>(key: K, value: Settings[K]) {
    const next = { ...settings, [key]: value } as Settings;
    setSettings(next);
    setSaved(false);
    if (key === "theme") {
      const isDark = value === "dark";
      document.documentElement.classList.toggle("dark", isDark);
      localStorage.setItem("garage_theme", isDark ? "dark" : "light");
    }
  }

  async function save() {
    localStorage.setItem("garage_settings", JSON.stringify(settings));
    // Try save to server
    try {
      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
    } catch {}
    setSaved(true);
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <h1 className="text-3xl font-extrabold mb-6">Settings</h1>
      <div className="grid gap-6">
        <div>
          <label className="block text-sm font-semibold mb-1">Theme</label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onChange("theme", "light")}
              className={`px-3 py-2 rounded-lg border ${
                settings.theme === "light" ? "bg-blue-600 text-white" : ""
              }`}>
              Light
            </button>
            <button
              type="button"
              onClick={() => onChange("theme", "dark")}
              className={`px-3 py-2 rounded-lg border ${
                settings.theme === "dark" ? "bg-blue-600 text-white" : ""
              }`}>
              Dark
            </button>
          </div>
          <p className="text-xs opacity-70 mt-2">
            Default is always Light. Toggle to Dark any time.
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">
            Car Nickname
          </label>
          <input
            className="w-full rounded-lg p-2 bg-white/60 dark:bg-white/10 backdrop-blur outline-none ring-1 ring-transparent focus:ring-2 focus:ring-blue-300/60"
            value={settings.carNickname}
            onChange={(e) => onChange("carNickname", e.target.value)}
            placeholder="Lil Zippy"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">
            Crew Personality
          </label>
          <div className="flex gap-3">
            {(["chaotic", "wise", "goofy"] as const).map((p) => (
              <button
                key={p}
                onClick={() => onChange("crewPersonality", p)}
                className={`px-3 py-2 rounded-lg border ${
                  settings.crewPersonality === p ? "bg-blue-600 text-white" : ""
                }`}>
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={save}
            className="rounded-full bg-blue-600 text-white px-6 py-2 font-semibold">
            Save
          </button>
          {saved && (
            <span className="text-sm opacity-70 self-center">
              Saved locally ✔︎
            </span>
          )}
        </div>
      </div>
      <p className="mt-8 text-sm opacity-70">
        Note: For demo, settings save to your browser. Connect Supabase DB later
        to persist across devices.
      </p>
    </div>
  );
}
