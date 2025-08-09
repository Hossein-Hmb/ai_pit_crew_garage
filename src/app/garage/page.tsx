import CarNameForm from "@/components/forms/CarNameForm";
import PitStrategyForm from "@/components/forms/PitStrategyForm";
import CrewCheerForm from "@/components/forms/CrewCheerForm";
import { GarageProvider } from "@/components/garage/GarageContext";
import SaveAllButton from "@/components/garage/SaveAllButton";

export default async function GaragePage() {
  return (
    <GarageProvider>
      <div className="mx-auto max-w-5xl px-5 py-12">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-extrabold font-title">The Garage</h1>
          <SaveAllButton />
        </div>
        <p className="opacity-80 mb-8">
          Pick a tool. Make chaos. Impress imaginary sponsors.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <section className="rounded-2xl p-5 bg-white/60 dark:bg-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.16)] transition-shadow">
            <h2 className="font-bold text-xl mb-2">🚗 Car Name Generator</h2>
            <p className="text-sm opacity-80 mb-4">
              Describe your ride and get a ridiculous nickname.
            </p>
            <CarNameForm />
          </section>

          <section className="rounded-2xl p-5 bg-white/60 dark:bg-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.16)] transition-shadow">
            <h2 className="font-bold text-xl mb-2">⛽ Pit Stop Strategy</h2>
            <p className="text-sm opacity-80 mb-4">
              Race length? Tire vibes? Get a goofy plan.
            </p>
            <PitStrategyForm />
          </section>

          <section className="rounded-2xl p-5 bg-white/60 dark:bg-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.16)] transition-shadow md:col-span-2">
            <h2 className="font-bold text-xl mb-2">
              📣 Crew Cheer Synthesizer
            </h2>
            <p className="text-sm opacity-80 mb-4">
              Generate chants to make your car feel special.
            </p>
            <CrewCheerForm />
          </section>
        </div>
      </div>
    </GarageProvider>
  );
}
