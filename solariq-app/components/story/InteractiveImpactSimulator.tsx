"use client";

import React, { useState } from "react";
import {
  Droplets,
  Zap,
  TrendingDown,
  Coins,
  Sparkles,
  Maximize2,
  Gauge,
  CheckCircle2,
  Sliders,
} from "lucide-react";

type ScaleLevel = 1 | 2 | 3;

interface ScaleData {
  title: string;
  scopeLabel: string;
  corridorLength: string;
  farmlandServiced: string;
  waterSaved: string;
  waterUnit: string;
  waterSub: string;
  powerExport: string;
  powerUnit: string;
  powerSub: string;
  carbonAbated: string;
  carbonUnit: string;
  carbonSub: string;
  financialGain: string;
  financialUnit: string;
  financialSub: string;
  realWorldEquivalence: string;
  validationBadge: string;
}

const scaleDatabase: Record<ScaleLevel, ScaleData> = {
  1: {
    title: "Single Modular Pilot Reach",
    scopeLabel: "Kurigram Testbed (20-Meter Modular Reach)",
    corridorLength: "20 m Canal Top",
    farmlandServiced: "6 Adjacent Paddies (60 Dec)",
    waterSaved: "514 L",
    waterUnit: "Liters Saved / Day",
    waterSub: "72% evaporation blocked by PV canopy",
    powerExport: "485 W",
    powerUnit: "Peak Grid Export",
    powerSub: "100% battery-free dynamic bypass",
    carbonAbated: "1.77 kg",
    carbonUnit: "CO₂e Avoided / Day",
    carbonSub: "-35% paddy methane via AWD drying",
    financialGain: "BDT 68",
    financialUnit: "Daily Farmer Savings",
    financialSub: "Avoided diesel fuel burning",
    realWorldEquivalence:
      "Protects 25 rural water rations every day, eliminates local diesel pump smoke, and pays for its frugal BDT 20,000 edge hardware in two dry seasons.",
    validationBadge: "Empirical Sensor Log #K-27-04",
  },
  2: {
    title: "Village Cluster Seasonal Aggregate",
    scopeLabel: "Full Dry-Season (March–May 2027 • 120 Days)",
    corridorLength: "120 m Canal Reach",
    farmlandServiced: "1 Cooperative Farmland Cluster",
    waterSaved: "42,500 L",
    waterUnit: "Freshwater Conserved",
    waterSub: "Enough to irrigate 2 downstream plots",
    powerExport: "385 kWh",
    powerUnit: "Clean Feeder Energy",
    powerSub: "Offsets daytime village transformer load",
    carbonAbated: "238.7 kg",
    carbonUnit: "Seasonal GHG Mitigated",
    carbonSub: "IPCC Tier-2 Rice Agronomy baseline",
    financialGain: "BDT 5,820",
    financialUnit: "Net Cooperative Benefit",
    financialSub: "Combined fuel savings & grid tariffs",
    realWorldEquivalence:
      "Guarantees continuous dry-season harvest across 6 smallholder families without running deep tube-wells or depleting falling aquifers.",
    validationBadge: "BRRI Alternate Wetting & Drying Standard",
  },
  3: {
    title: "National Canal Network Replication",
    scopeLabel: "100 km of BWDB Irrigation Canals (Bangladesh Scale)",
    corridorLength: "100 km Public Corridor",
    farmlandServiced: "8,000 to 12,000 Farmland Hectares",
    waterSaved: "46.5M L",
    waterUnit: "Preserved Water / Year",
    waterSub: "46,580 m³ annual evaporation suppressed",
    powerExport: "114.2 MWh",
    powerUnit: "Clean Grid Power / Year",
    powerSub: "Zero agricultural farmland acquired",
    carbonAbated: "78.0 Tons",
    carbonUnit: "CO₂e Mitigated / Year",
    carbonSub: "Equivalent to 170 fewer diesel vehicles",
    financialGain: "BDT 1.25 Cr",
    financialUnit: "Annual Net-Meter Revenue",
    financialSub: "Funds rural canal dredging & upkeep",
    realWorldEquivalence:
      "Generates continuous clean utility power across unused public canal airspace while safeguarding food sovereignty and breaking rural methane cycles across Bangladesh.",
    validationBadge: "SREDA & DoE National Grid Factor 0.62 t/MWh",
  },
};

export default function InteractiveImpactSimulator() {
  const [scale, setScale] = useState<ScaleLevel>(1);

  const active = scaleDatabase[scale];

  return (
    <div className="w-full bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 lg:p-10 space-y-8 select-none">
      {/* 1. Header & Interactive Scale Dial */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-stone-200/80">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-950 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Interactive Scale Simulator</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-stone-900 font-serif">
            Simulate SolariQ Impact at Scale
          </h2>

          <p className="text-xs sm:text-sm text-stone-600 max-w-xl font-normal leading-relaxed">
            Move between the physical Kurigram testbed, seasonal cluster aggregates, and national-scale BWDB canal corridors to witness empirical and projected resource gains.
          </p>
        </div>

        {/* 3-Way Tactical Scale Switcher */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-stone-100/90 p-1.5 rounded-2xl border border-stone-200 self-start lg:self-end">
          <button
            onClick={() => setScale(1)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
              scale === 1
                ? "bg-white text-stone-900 shadow-xs font-bold"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>1 Reach (20m Pilot)</span>
          </button>

          <button
            onClick={() => setScale(2)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
              scale === 2
                ? "bg-white text-stone-900 shadow-xs font-bold"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-sky-600" />
            <span>6-Plot Cluster (Season)</span>
          </button>

          <button
            onClick={() => setScale(3)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
              scale === 3
                ? "bg-emerald-900 text-stone-100 shadow-xs font-bold"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>100 km National Network</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Scope Indicator Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-mono font-bold text-stone-400 text-xs">SCOPE {scale}/3:</span>
          <span className="font-bold text-stone-900 text-sm">{active.scopeLabel}</span>
        </div>
        <div className="flex items-center gap-4 text-stone-500 font-medium">
          <span>Corridor: <strong className="text-stone-800">{active.corridorLength}</strong></span>
          <span>•</span>
          <span>Target: <strong className="text-stone-800">{active.farmlandServiced}</strong></span>
        </div>
      </div>

      {/* 3. The 4 Big Dynamic Macro-Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1: Water Preserved */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-sky-50/50 to-white border border-sky-100 hover:border-sky-300 transition-all space-y-3 group">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-sky-100/80 text-sky-800 flex items-center justify-center">
              <Droplets className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 bg-sky-100/60 px-2 py-0.5 rounded-full">
              Water
            </span>
          </div>

          <div>
            <span className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-sky-950 font-serif block group-hover:scale-105 transition-transform origin-left">
              {active.waterSaved}
            </span>
            <span className="text-xs font-bold text-stone-700 block mt-1">
              {active.waterUnit}
            </span>
          </div>

          <p className="text-[11px] text-stone-500 font-medium pt-1 border-t border-sky-100/60">
            {active.waterSub}
          </p>
        </div>

        {/* Metric 2: Clean Power Injected */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-amber-50/50 to-white border border-amber-100 hover:border-amber-300 transition-all space-y-3 group">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-100/80 text-amber-800 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/60 px-2 py-0.5 rounded-full">
              Power
            </span>
          </div>

          <div>
            <span className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 font-serif block group-hover:scale-105 transition-transform origin-left">
              {active.powerExport}
            </span>
            <span className="text-xs font-bold text-stone-700 block mt-1">
              {active.powerUnit}
            </span>
          </div>

          <p className="text-[11px] text-stone-500 font-medium pt-1 border-t border-amber-100/60">
            {active.powerSub}
          </p>
        </div>

        {/* Metric 3: Carbon & Methane Abated */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-emerald-50/50 to-white border border-emerald-100 hover:border-emerald-300 transition-all space-y-3 group">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center">
              <TrendingDown className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded-full">
              Carbon
            </span>
          </div>

          <div>
            <span className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-emerald-950 font-serif block group-hover:scale-105 transition-transform origin-left">
              {active.carbonAbated}
            </span>
            <span className="text-xs font-bold text-stone-700 block mt-1">
              {active.carbonUnit}
            </span>
          </div>

          <p className="text-[11px] text-stone-500 font-medium pt-1 border-t border-emerald-100/60">
            {active.carbonSub}
          </p>
        </div>

        {/* Metric 4: Smallholder Prosperity */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-stone-50 to-white border border-stone-200 hover:border-stone-400 transition-all space-y-3 group">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-stone-200 text-stone-800 flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-700 bg-stone-200/60 px-2 py-0.5 rounded-full">
              Economics
            </span>
          </div>

          <div>
            <span className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-amber-950 font-serif block group-hover:scale-105 transition-transform origin-left">
              {active.financialGain}
            </span>
            <span className="text-xs font-bold text-stone-700 block mt-1">
              {active.financialUnit}
            </span>
          </div>

          <p className="text-[11px] text-stone-500 font-medium pt-1 border-t border-stone-200">
            {active.financialSub}
          </p>
        </div>
      </div>

      {/* 4. Real-World Equivalence Narrative */}
      <div className="p-5 rounded-2xl bg-stone-900 text-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
            Real-World Planetary Significance
          </span>
          <p className="text-sm font-normal text-stone-200 leading-relaxed max-w-3xl">
            {active.realWorldEquivalence}
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-800 border border-stone-700 text-stone-300 text-[11px]">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>{active.validationBadge}</span>
        </div>
      </div>
    </div>
  );
}
