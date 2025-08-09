"use client";

import { createContext, useContext, useMemo, useState } from "react";

type CarNameData = {
  output: string;
  input: { color: string; vibe: string };
} | null;
type PitStrategyData = {
  output: string;
  input: { laps: number; tireWear: string };
} | null;
type CrewCheerData = {
  output: string;
  input: { name: string; style: string };
} | null;

type GarageState = {
  carName: CarNameData;
  pitStrategy: PitStrategyData;
  crewCheer: CrewCheerData;
  setCarName: (v: CarNameData) => void;
  setPitStrategy: (v: PitStrategyData) => void;
  setCrewCheer: (v: CrewCheerData) => void;
};

const Ctx = createContext<GarageState | null>(null);

export function useGarage() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useGarage must be used within <GarageProvider>");
  return ctx;
}

export function GarageProvider({ children }: { children: React.ReactNode }) {
  const [carName, setCarName] = useState<CarNameData>(null);
  const [pitStrategy, setPitStrategy] = useState<PitStrategyData>(null);
  const [crewCheer, setCrewCheer] = useState<CrewCheerData>(null);

  const value = useMemo(
    () => ({
      carName,
      pitStrategy,
      crewCheer,
      setCarName,
      setPitStrategy,
      setCrewCheer,
    }),
    [carName, pitStrategy, crewCheer]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
