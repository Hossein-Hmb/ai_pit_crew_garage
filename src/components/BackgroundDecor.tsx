export default function BackgroundDecor() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Soft radial gradient backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(59,130,246,0.18),transparent),radial-gradient(900px_500px_at_80%_10%,rgba(236,72,153,0.15),transparent),linear-gradient(180deg,rgba(255,255,255,0.9),rgba(255,255,255,0.9))] dark:bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(59,130,246,0.15),transparent),radial-gradient(900px_500px_at_80%_10%,rgba(168,85,247,0.15),transparent),linear-gradient(180deg,rgba(10,10,10,0.9),rgba(10,10,10,0.9))]" />

      {/* Blurry blobs */}
      <div className="absolute -top-24 -left-24 h-[420px] w-[420px] rounded-full bg-blue-400/30 blur-3xl dark:bg-blue-500/20" />
      <div className="absolute -top-20 right-[-120px] h-[360px] w-[360px] rounded-full bg-pink-400/30 blur-3xl dark:bg-fuchsia-500/20" />
      <div className="absolute bottom-[-140px] left-1/2 -translate-x-1/2 h-[520px] w-[520px] rounded-full bg-teal-400/25 blur-3xl dark:bg-emerald-500/20" />

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 [mask-image:radial-gradient(75%_60%_at_50%_40%,black,transparent)] opacity-[0.25]">
        <div className="[background:linear-gradient(rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.06)_1px,transparent_1px)] dark:[background:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] h-full w-full bg-[length:24px_24px]" />
      </div>
    </div>
  );
}
