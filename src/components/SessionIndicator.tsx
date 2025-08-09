"use client";

export default function SessionIndicator({ active }: { active: boolean }) {
  const color = active
    ? "from-emerald-500 to-green-600"
    : "from-rose-600 to-red-700";
  const label = active ? "DRS ON" : "DRS OFF";
  return (
    <div
      className={`hidden sm:inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold text-white bg-gradient-to-br ${color} shadow-[0_6px_16px_rgba(0,0,0,0.25)]`}
      aria-label={active ? "Session active" : "No session"}>
      <span
        className={`inline-block h-2 w-2 rounded-full ${
          active ? "bg-lime-200" : "bg-red-200"
        } animate-pulse`}
      />
      {label}
    </div>
  );
}
