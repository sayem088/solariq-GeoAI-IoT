"use client";

import React from "react";
import { useNexusStore } from "@/lib/nexusStore";
import { Sun, Droplets, Zap, ArrowRight, ShieldCheck, Check } from "lucide-react";

export default function EnergyWaterPhysics() {
  const { solarWatts, pumpWatts, gridWatts, flowRateLpm, canalDepthMeters, evapReductionPercent, step } = useNexusStore();

  return (
    <section className="w-full py-12 border-b border-stone-200/60 select-none">
      <div className="editorial-container max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="mb-8 max-w-2xl">
          <span className="text-xs uppercase tracking-wider text-emerald-800 font-bold block mb-1">
            Chapter 02 • Cyber-Physical Energy & Water Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            The Canal Microclimate & Dynamic Power Balancer
          </h2>
          <p className="mt-2 text-stone-600 text-sm leading-relaxed">
            Harvesting energy directly above water corridors unlocks a self-reinforcing thermodynamic cycle: the solar panels shield the canal against extreme solar radiation, while natural water evaporation cools the silicon cells to maximize electrical efficiency.
          </p>
        </div>

        {/* Two-Column Editorial Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Column 1: Canal Hydrology & Evaporation Physics */}
          <div className="border-t border-stone-300/80 pt-6 space-y-5">
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Droplets className="w-4 h-4 text-sky-600" />
              <span>Canal Hydrology & Evaporation Suppression</span>
            </h3>

            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Across Bangladesh’s 5,000+ km of irrigation canals and arid global basins—demonstrated live in the Kurigram Teesta River testbed—open water channels lose up to <strong>8–10 mm of depth daily</strong> strictly through open pan evaporation. By shielding canal reaches with elevated modular PV canopy frames:
            </p>

            {/* Metrics Row */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="border-l-2 border-emerald-700 pl-3">
                <span className="block text-2xl sm:text-3xl font-bold text-stone-900 editorial-number">
                  {evapReductionPercent}%
                </span>
                <span className="text-xs text-stone-500 font-medium">Pan Evaporation Cut</span>
              </div>

              <div className="border-l-2 border-sky-600 pl-3">
                <span className="block text-2xl sm:text-3xl font-bold text-stone-900 editorial-number">
                  {canalDepthMeters}m
                </span>
                <span className="text-xs text-stone-500 font-medium">Canal Stage Buffer</span>
              </div>

              <div className="border-l-2 border-amber-600 pl-3">
                <span className="block text-2xl sm:text-3xl font-bold text-stone-900 editorial-number">
                  +3.8%
                </span>
                <span className="text-xs text-stone-500 font-medium">PV Cooling Output Boost</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-stone-100/80 border border-stone-200/80 text-xs text-stone-700 leading-relaxed">
              <strong>Ground-Mounted Solar vs. Canal-Top Solar:</strong> Standard solar farms in Bangladesh consume scarce agricultural cropland (~3–4 acres/MW). SolariQ requires <strong>zero square meters of agricultural land</strong> by deploying in existing government canal airspace.
            </div>
          </div>

          {/* Column 2: The Dynamic X + Y Grid Routing Engine */}
          <div className="border-t border-stone-300/80 pt-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-600" />
                <span>The Dynamic X + Y Net-Metering Balancer</span>
              </h3>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                SREDA Compliant
              </span>
            </div>

            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Rather than storing energy in toxic, expensive chemical batteries, SolariQ uses the national 33kV rural grid as a frictionless energy buffer through real-time power routing:
            </p>

            {/* Fluid Power Balance Diagram */}
            <div className="p-5 rounded-2xl bg-stone-100/90 border border-stone-200/90 flex flex-col gap-4">
              <div className="flex items-center justify-between text-xs font-bold text-stone-500 uppercase tracking-wider">
                <span>Generation Source</span>
                <span>Active Loads & Grid</span>
              </div>

              {/* Dynamic Numbers */}
              <div className="grid grid-cols-5 items-center text-center gap-2">
                <div className="p-3 rounded-xl bg-white border border-stone-200 shadow-2xs">
                  <span className="text-[10px] text-amber-800 font-bold block">Solar Canopy</span>
                  <span className="text-2xl font-bold text-stone-900 editorial-number">{solarWatts}W</span>
                </div>

                <span className="text-xl font-bold text-stone-400">−</span>

                <div className="p-3 rounded-xl bg-white border border-stone-200 shadow-2xs">
                  <span className="text-[10px] text-sky-800 font-bold block">DC Pump Load</span>
                  <span className="text-2xl font-bold text-stone-900 editorial-number">{pumpWatts}W</span>
                </div>

                <span className="text-xl font-bold text-stone-400">=</span>

                <div className="p-3 rounded-xl bg-emerald-900 text-stone-100 shadow-xs">
                  <span className="text-[10px] text-emerald-300 font-bold block">33kV Grid Export</span>
                  <span className="text-2xl font-bold text-white editorial-number">+{gridWatts}W</span>
                </div>
              </div>

              {/* Real-Time Rule Explanation */}
              <div className="pt-2 border-t border-stone-200 text-xs text-stone-600 flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  <strong>The X + Y Auto-Divert:</strong> During irrigation, baseline surplus clean electricity (X = 365W) is continuously exported. At minute 10:00, when the AWD soil quota is replenished, the pump motor auto-shuts off and <strong>100% of generated solar power ({solarWatts}W)</strong> feeds directly into the village rural grid.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
