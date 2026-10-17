"use client";

import React, { useState } from "react";
import { useNexusStore } from "@/lib/nexusStore";
import { Droplets, Zap, DollarSign, Cloud, Leaf, TrendingUp, Award } from "lucide-react";

export default function ImpactTickers() {
  const { savedToday, futurePredicted } = useNexusStore();
  const [activeTab, setActiveTab] = useState<"today" | "future">("today");

  return (
    <div className="w-full pro-card p-5 bg-white border border-slate-200 shadow-sm flex flex-col gap-4">
      {/* Header & Tab Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <Award className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-mono font-bold tracking-wider text-slate-800 uppercase">
            SUSTAINABILITY & FINANCIAL IMPACT DASHBOARD
          </h3>
        </div>

        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-100 border border-slate-200">
          <button
            onClick={() => setActiveTab("today")}
            className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-all ${
              activeTab === "today"
                ? "bg-white text-emerald-800 font-bold shadow-xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Saved Today (Kurigram)
          </button>
          <button
            onClick={() => setActiveTab("future")}
            className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-all ${
              activeTab === "future"
                ? "bg-white text-emerald-800 font-bold shadow-xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Future Predictive Horizons
          </button>
        </div>
      </div>

      {/* Tab 1: Saved Today */}
      {activeTab === "today" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Water Saved */}
          <div className="p-3.5 rounded-xl bg-sky-50/60 border border-sky-200 flex flex-col justify-between">
            <div className="flex items-center justify-between text-sky-700">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-bold">WATER SAVED</span>
              <Droplets className="w-3.5 h-3.5" />
            </div>
            <div className="my-1.5">
              <div className="text-2xl font-black font-mono text-slate-900">{savedToday.waterLiters}</div>
              <span className="text-[10px] font-mono text-slate-500">Liters Today</span>
            </div>
            <span className="text-[10px] font-mono text-sky-700 font-medium">Evap + Over-pumping</span>
          </div>

          {/* Energy Conserved */}
          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 flex flex-col justify-between">
            <div className="flex items-center justify-between text-amber-700">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-bold">PUMP CONSERVED</span>
              <Zap className="w-3.5 h-3.5" />
            </div>
            <div className="my-1.5">
              <div className="text-2xl font-black font-mono text-slate-900">{savedToday.pumpKwhAvoided}</div>
              <span className="text-[10px] font-mono text-slate-500">kWh Waste Cut</span>
            </div>
            <span className="text-[10px] font-mono text-amber-800 font-medium">15 min Runtime Saved</span>
          </div>

          {/* Clean Grid Export */}
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col justify-between">
            <div className="flex items-center justify-between text-emerald-700">
              <span className="text-[10px] font-mono uppercase text-emerald-800 font-bold">GRID FEED-IN</span>
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <div className="my-1.5">
              <div className="text-2xl font-black font-mono text-emerald-700">{savedToday.gridExportKwh}</div>
              <span className="text-[10px] font-mono text-slate-500">kWh Exported</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-800 font-bold">Surplus Clean Power</span>
          </div>

          {/* Financial Savings */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-700">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-bold">MONEY SAVED</span>
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="my-1.5">
              <div className="text-2xl font-black font-mono text-slate-900">BDT {savedToday.moneyBdt}</div>
              <span className="text-[10px] font-mono text-slate-500">Daily Savings</span>
            </div>
            <span className="text-[10px] font-mono text-slate-600 font-medium">Avoided Diesel / Tariffs</span>
          </div>

          {/* Carbon Avoidance */}
          <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 flex flex-col justify-between">
            <div className="flex items-center justify-between text-emerald-700">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-bold">CO₂ MITIGATED</span>
              <Cloud className="w-3.5 h-3.5" />
            </div>
            <div className="my-1.5">
              <div className="text-2xl font-black font-mono text-emerald-700">{savedToday.co2Kg}</div>
              <span className="text-[10px] font-mono text-slate-500">kg CO₂e Avoided</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-700 font-medium">0.62 tCO₂/MWh Factor</span>
          </div>

          {/* Methane Cut */}
          <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 flex flex-col justify-between">
            <div className="flex items-center justify-between text-teal-700">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-bold">METHANE CUT</span>
              <Leaf className="w-3.5 h-3.5" />
            </div>
            <div className="my-1.5">
              <div className="text-2xl font-black font-mono text-teal-700">-{savedToday.ch4ReductionPercent}%</div>
              <span className="text-[10px] font-mono text-slate-500">CH₄ Emissions</span>
            </div>
            <span className="text-[10px] font-mono text-teal-800 font-medium">AWD Aeration Cycle</span>
          </div>
        </div>
      ) : (
        /* Tab 2: Future Predictive Horizons */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-sky-50/50 border border-sky-200 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-mono font-bold text-sky-900 uppercase">
                SEASON TOTAL: 6 BORO PADDIES (60 DECIMAL)
              </h4>
              <span className="text-[10px] font-mono text-slate-500">March - May 2027</span>
            </div>
            <div className="grid grid-cols-2 gap-3 my-2 text-xs font-mono">
              <div>
                <span className="text-slate-500 text-[10px] block">Water Conserved:</span>
                <strong className="text-sky-800 text-sm">42,500 Liters</strong>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Clean Grid Power:</span>
                <strong className="text-emerald-700 text-sm">385 kWh</strong>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Farmer Cooperative ROI:</span>
                <strong className="text-slate-900 text-sm">BDT 5,820</strong>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Seasonal Carbon Cut:</span>
                <strong className="text-emerald-700 text-sm">238.7 kg CO₂e</strong>
              </div>
            </div>
            <p className="text-[11px] text-slate-600 pt-2 border-t border-sky-100">
              Shared equitably across 6 farming households via local Water-User Association (WUA).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-mono font-bold text-emerald-900 uppercase">
                FULL PILOT SCALE-UP (100 kWp CANAL REACH)
              </h4>
              <span className="text-[10px] font-mono text-slate-500">500m Reach (6 - 10 ha)</span>
            </div>
            <div className="grid grid-cols-2 gap-3 my-2 text-xs font-mono">
              <div>
                <span className="text-slate-500 text-[10px] block">Annual Water Saved:</span>
                <strong className="text-sky-800 text-sm">4,658 m³ / year</strong>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Annual Grid Export:</span>
                <strong className="text-emerald-700 text-sm">114.2 MWh / year</strong>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Annual Net Revenue:</span>
                <strong className="text-slate-900 text-sm">BDT 1,250,000 / year</strong>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Annual Carbon Avoided:</span>
                <strong className="text-emerald-700 text-sm">78.0 tCO₂e / year</strong>
              </div>
            </div>
            <p className="text-[11px] text-slate-600 pt-2 border-t border-emerald-100">
              Net Metering under SREDA guidelines (Power Division, 2018) via rural utility cooperative (BREB/PBS).
            </p>
          </div>
        </div>
      )}

      {/* UN SDG Pills */}
      <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
        <span className="text-[10px] font-mono text-slate-500 font-bold uppercase mr-1">UN SDGs:</span>
        <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700 border border-slate-200">SDG 2 (Zero Hunger)</span>
        <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-sky-50 text-sky-800 border border-sky-200">SDG 6 (Clean Water)</span>
        <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-amber-50 text-amber-800 border border-amber-200">SDG 7 (Clean Energy)</span>
        <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700 border border-slate-200">SDG 9 (Infrastructure)</span>
        <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700 border border-slate-200">SDG 10 (Reduced Inequality)</span>
        <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200">SDG 12 (Responsible Consumption)</span>
        <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200">SDG 13 (Climate Action)</span>
        <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-teal-50 text-teal-800 border border-teal-200">SDG 15 (Life on Land)</span>
      </div>
    </div>
  );
}
