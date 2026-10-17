"use client";

import React, { useState } from "react";
import { useNexusStore } from "@/lib/nexusStore";
import { Droplets, Zap, DollarSign, Cloud, Leaf, TrendingUp, Award, CheckCircle2 } from "lucide-react";

export default function ImpactLedger() {
  const { savedToday, futurePredicted } = useNexusStore();
  const [horizon, setHorizon] = useState<"daily" | "seasonal" | "national">("daily");

  return (
    <section className="w-full py-12 border-b border-stone-200/60 select-none">
      <div className="editorial-container max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Section Header & Horizon Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-wider text-emerald-800 font-bold block mb-1">
              Chapter 04 • Quantified Ecological & Financial Ledger
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              Planetary & Community Impact Accounting
            </h2>
            <p className="mt-2 text-stone-600 text-sm leading-relaxed">
              Every drop of water and watt of solar energy is accounted for: from the <strong>Kurigram Pilot 01</strong> cluster to nationwide scaling across Bangladesh’s 5,000+ km canal network.
            </p>
          </div>

          <div className="inline-flex p-1 rounded-full bg-stone-200/70 gap-1 shrink-0 flex-wrap">
            <button
              onClick={() => setHorizon("daily")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                horizon === "daily"
                  ? "bg-white text-stone-900 shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Kurigram Single Cycle
            </button>
            <button
              onClick={() => setHorizon("seasonal")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                horizon === "seasonal"
                  ? "bg-white text-stone-900 shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              120-Day Testbed Season
            </button>
            <button
              onClick={() => setHorizon("national")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                horizon === "national"
                  ? "bg-emerald-900 text-stone-100 shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              National Scale (100km Canals)
            </button>
          </div>
        </div>

        {/* Grand Typography Impact Rows */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-6 py-6 border-y border-stone-300/80">
          {/* Water Saved */}
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-stone-500 font-bold block">
              Water Conserved
            </span>
            <div className="text-3xl sm:text-4xl font-bold text-stone-900 editorial-number">
              {horizon === "daily"
                ? `${savedToday.waterLiters} L`
                : horizon === "seasonal"
                ? `${(futurePredicted.seasonalWaterLiters / 1000).toFixed(1)}k L`
                : "46.5M L"}
            </div>
            <p className="text-xs text-stone-500">
              {horizon === "daily"
                ? "Canal shading + AWD"
                : horizon === "seasonal"
                ? "Per 6-plot cluster"
                : "100km canal airspace"}
            </p>
          </div>

          {/* Energy Avoided */}
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-stone-500 font-bold block">
              Pumping Avoided
            </span>
            <div className="text-3xl sm:text-4xl font-bold text-stone-900 editorial-number">
              {horizon === "daily" ? `${savedToday.pumpKwhAvoided} kWh` : horizon === "seasonal" ? "14.4 kWh" : "1.44 MWh"}
            </div>
            <p className="text-xs text-stone-500">
              Eliminated over-flood run
            </p>
          </div>

          {/* Clean Grid Export */}
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-stone-500 font-bold block">
              Grid Clean Export
            </span>
            <div className="text-3xl sm:text-4xl font-bold text-emerald-800 editorial-number">
              {horizon === "daily"
                ? `${savedToday.gridExportKwh} kWh`
                : horizon === "seasonal"
                ? `${futurePredicted.seasonalGridKwh} kWh`
                : `${futurePredicted.pilotGridMwhYear} MWh`}
            </div>
            <p className="text-xs text-stone-500">
              {horizon === "national" ? "Surplus to national grid" : "Surplus to 33kV feeder"}
            </p>
          </div>

          {/* Money Saved */}
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-stone-500 font-bold block">
              Community Savings
            </span>
            <div className="text-3xl sm:text-4xl font-bold text-stone-900 editorial-number">
              {horizon === "daily"
                ? `BDT ${savedToday.moneyBdt}`
                : horizon === "seasonal"
                ? `BDT ${futurePredicted.seasonalMoneyBdt.toLocaleString()}`
                : "BDT 1.25 Cr"}
            </div>
            <p className="text-xs text-stone-500">
              {horizon === "national" ? "Avoided fuel + grid credit" : "Avoided diesel + net credit"}
            </p>
          </div>

          {/* Methane Cut */}
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-stone-500 font-bold block">
              Methane Abatement
            </span>
            <div className="text-3xl sm:text-4xl font-bold text-emerald-700 editorial-number">
              -35% CH₄
            </div>
            <p className="text-xs text-stone-500">
              AWD periodic soil aeration
            </p>
          </div>

          {/* Carbon Mitigated */}
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-stone-500 font-bold block">
              Carbon Mitigated
            </span>
            <div className="text-3xl sm:text-4xl font-bold text-stone-900 editorial-number">
              {horizon === "daily"
                ? `${savedToday.co2Kg} kg`
                : horizon === "seasonal"
                ? `${futurePredicted.seasonalCo2Kg} kg`
                : `${futurePredicted.pilotCo2TonsYear} Tons`}
            </div>
            <p className="text-xs text-stone-500">
              CO₂e avoided
            </p>
          </div>
        </div>

        {/* UN SDGs & Prototype Target Footer */}
        <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
          {/* SDGs */}
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block">
              Targeted UN Sustainable Development Goals:
            </span>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {[
                "SDG 2: Zero Hunger",
                "SDG 6: Clean Water",
                "SDG 7: Affordable Clean Energy",
                "SDG 9: Industry & Infrastructure",
                "SDG 12: Responsible Consumption",
                "SDG 13: Climate Action",
                "SDG 15: Life on Land",
              ].map((sdg) => (
                <span
                  key={sdg}
                  className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 text-[11px] font-semibold border border-stone-200/60"
                >
                  {sdg}
                </span>
              ))}
            </div>
          </div>

          {/* Prototype Target */}
          <div className="p-4 rounded-xl bg-emerald-900 text-stone-100 max-w-sm shrink-0">
            <span className="text-[11px] uppercase tracking-wider text-emerald-300 font-bold block">
              Frugal Innovation Target:
            </span>
            <div className="text-2xl font-bold text-white editorial-number mt-0.5">
              BDT 20,000 (~$165 USD)
            </div>
            <p className="text-[11px] text-emerald-100/80 mt-1 leading-relaxed">
              Standardized modular ESP32-S3 edge node, pulse latching valves, and locally fabricated canopy brackets for direct adoption by Bangladesh farmer cooperatives.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
