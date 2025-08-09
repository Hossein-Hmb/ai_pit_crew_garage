import Link from "next/link";

export default function Home() {
  return (
    <div className="px-6 py-10 md:py-14">
      <section className="grid md:grid-cols-2 gap-8 md:gap-12 items-center text-center md:text-left">
        <div>
          <div className="mb-4 text-5xl md:text-6xl">🛠️🏎️</div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 font-title leading-tight">
            Welcome to the AI Pit Crew Garage
          </h1>
          <p className="opacity-80 mb-6 max-w-xl md:mx-0 mx-auto">
            A childish, funny, and cool lab where your car gets silly names,
            chaotic race strategies, and loud crew cheers. Bring snacks.
          </p>
          <div className="flex justify-center md:justify-start gap-3 md:gap-4">
            <Link
              href="/garage"
              className="group relative inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-white bg-gradient-to-br from-blue-600 to-indigo-600 shadow-[0_10px_24px_rgba(37,99,235,0.35)] hover:shadow-[0_15px_35px_rgba(37,99,235,0.45)] transition-all">
              <span className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              Enter the Garage
            </Link>
            <Link
              href="/login"
              className="group relative inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-white bg-gradient-to-br from-slate-700 to-slate-900 shadow-[0_10px_24px_rgba(0,0,0,0.35)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.45)] transition-all">
              <span className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              Login
            </Link>
          </div>
        </div>
        <div className="relative h-48 md:h-64">
          <div className="absolute inset-0 rounded-3xl bg-white/50 dark:bg-white/10 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.12)]" />
          <div className="absolute inset-4 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(59,130,246,0.2),rgba(99,102,241,0.2))]" />
            <div className="absolute -inset-x-10 inset-y-0 opacity-30 [background:repeating-linear-gradient(90deg,transparent_0,transparent_22px,rgba(255,255,255,0.9)_24px,transparent_26px)] animate-pulse" />
          </div>
        </div>
      </section>

      <section className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            title: "Car Names",
            emoji: "🚗",
            desc: "Ridiculous nicknames on tap.",
          },
          {
            title: "Pit Plans",
            emoji: "⛽",
            desc: "Silly strategies that might work.",
          },
          {
            title: "Crew Cheers",
            emoji: "📣",
            desc: "Boosts morale by 1000%.",
          },
        ].map((c) => (
          <div
            key={c.title}
            className="rounded-2xl bg-white/60 dark:bg-white/10 backdrop-blur-xl p-6 text-left shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.16)] transition-shadow min-h-[140px] flex flex-col">
            <div className="text-2xl mb-2">{c.emoji}</div>
            <div className="font-bold mb-1">{c.title}</div>
            <div className="text-sm opacity-80">{c.desc}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
