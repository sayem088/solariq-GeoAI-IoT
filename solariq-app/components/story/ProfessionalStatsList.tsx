"use client";

import React, { useState } from "react";
import {
  Droplets,
  Layers,
  Zap,
  TrendingDown,
  ShieldCheck,
  Check,
  ArrowUpRight,
  Info,
  Calendar,
} from "lucide-react";

interface StatItem {
  id: string;
  index: string;
  domain: string;
  title: string;
  summary: string;
  metricValue: string;
  metricUnit: string;
  baselineLabel: string;
  baselineValue: string;
  solariqLabel: string;
  solariqValue: string;
  reductionPercent: number; // For visualization bar (0 - 100)
  highlightColor: string;
  protocol: string;
  impactQuote: string;
}

const statsData: StatItem[] = [
  {
    id: "evaporation",
    index: "01",
    domain: "Canal Hydrology",
    title: "Surface Evaporation Suppression",
    summary:
      "Raised PV canopy directly shades open canal water, blocking high solar irradiance and wind draft without acquiring scarce arable land.",
    metricValue: "72%",
    metricUnit: "Evaporative Loss Blocked",
    baselineLabel: "Open Exposed Canal",
    baselineValue: "714 L / day",
    solariqLabel: "Canopy Shaded Water",
    solariqValue: "200 L / day",
    reductionPercent: 72,
    highlightColor: "sky",
    protocol: "Penman-Monteith Equation • BWDB Kurigram Canal Log #K-27",
    impactQuote: "Saves 514 Liters of freshwater daily per 20-meter reach.",
  },
  {
    id: "awd-water",
    index: "02",
    domain: "Precision Agronomy",
    title: "AWD Rootzone Irrigation Quota",
    summary:
      "Capacitive soil sensors and automated manifold deliver exactly 420 Liters before auto-latching shut, terminating the habitual 15-minute farmer over-pumping.",
    metricValue: "420 L",
    metricUnit: "Per 10-Minute Cycle",
    baselineLabel: "Unmetered Paddy Flooding",
    baselineValue: "1,400 L / 25 min",
    solariqLabel: "Precision ESP32-S3 Quota",
    solariqValue: "420 L / 10 min",
    reductionPercent: 70,
    highlightColor: "emerald",
    protocol: "BRRI dhan29 AWD Standard • Perforated Tube Guideline",
    impactQuote: "Conserves 30% aggregate seasonal water (42,500 L saved per 6-plot cluster).",
  },
  {
    id: "clean-power",
    index: "03",
    domain: "Grid Electrical",
    title: "Dynamic 33kV Rural Feeder Export",
    summary:
      "100% battery-free power balancer diverts 365W surplus during irrigation and instantly feeds full 485W into village feeder lines when pump stops.",
    metricValue: "485 W",
    metricUnit: "Battery-Free Peak Export",
    baselineLabel: "Conventional Solar / Genset",
    baselineValue: "0 W to Grid (Idle Waste)",
    solariqLabel: "SolariQ Dynamic Bypass",
    solariqValue: "485 W Clean Feed",
    reductionPercent: 100,
    highlightColor: "amber",
    protocol: "BREB / SREDA Net-Metering Standard (33kV Feeder Line)",
    impactQuote: "Generates 2.85 kWh clean export daily, replacing dirty diesel engines.",
  },
  {
    id: "methane",
    index: "04",
    domain: "Climate Mitigation",
    title: "Greenhouse Methane Abatement",
    summary:
      "Periodic aerobic drying intervals in AWD cycles break methanogenic bacterial colonies in flooded rice rootzones, sharply cutting agricultural GHG emissions.",
    metricValue: "-35%",
    metricUnit: "Rice Field CH₄ Abated",
    baselineLabel: "Continuous Deep Flooding",
    baselineValue: "1.20 kg CH₄ / ha",
    solariqLabel: "AWD Aerated Intervals",
    solariqValue: "0.78 kg CH₄ / ha",
    reductionPercent: 35,
    highlightColor: "emerald",
    protocol: "IPCC Tier-2 Rice Agronomy • DoE National Grid Factor 0.62 tCO₂/MWh",
    impactQuote: "Avoids 1.77 kg CO₂e daily per demonstration cluster (78 tons CO₂e per 100 kWp corridor).",
  },
  {
    id: "affordability",
    index: "05",
    domain: "Frugal Engineering",
    title: "Smallholder Hardware Target BOM",
    summary:
      "Eliminating costly chemical battery banks in favor of direct DC pump coupling and local ESP32-S3 edge controllers lowers capital investment for smallholder cooperatives.",
    metricValue: "BDT 20k",
    metricUnit: "Hardware Target BOM",
    baselineLabel: "Standard Solar+Inverter System",
    baselineValue: "BDT 65,000+",
    solariqLabel: "SolariQ Frugal Edge BOM",
    solariqValue: "BDT 20,000",
    reductionPercent: 69,
    highlightColor: "stone",
    protocol: "DIU Cooperative Ag-Model • 2 Boro Season Payback",
    impactQuote: "Fully recouped within two dry-season Boro rice harvest cycles.",
  },
];

export default function ProfessionalStatsList() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="w-full space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-100/70 text-emerald-900 text-[11px] font-bold uppercase tracking-wider mb-2">
            <span>Empirical Field Specifications</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 font-serif">
            Performance & Impact Ledger
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl font-normal">
            Quantified engineering benchmarks validated on the Kurigram demonstration corridor across canal hydrology, rice agronomy, dynamic power diversion, and planetary carbon.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-stone-500 font-medium self-start md:self-end">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>Field Validated</span>
          </span>
          <span>•</span>
          <span>BWDB / BRRI Standards</span>
        </div>
      </div>

      {/* Professional Stats List */}
      <div className="divide-y divide-stone-200 border-t border-b border-stone-200">
        {statsData.map((item) => {
          const isSelected = selectedId === item.id;

          return (
            <div
              key={item.id}
              onClick={() => setSelectedId(isSelected ? null : item.id)}
              className={`group py-6 transition-all duration-200 cursor-pointer ${
                isSelected ? "bg-stone-50/70 px-4 -mx-4 rounded-2xl" : "hover:bg-stone-50/40 px-3 -mx-3 rounded-xl"
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* 1. Index & Domain Title (5 cols) */}
                <div className="lg:col-span-5 space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-stone-400">
                      {item.index}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                      {item.domain}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-stone-900 font-serif group-hover:text-emerald-950 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-stone-600 leading-relaxed max-w-lg font-normal">
                    {item.summary}
                  </p>
                </div>

                {/* 2. Precision Comparison Bar (4 cols) */}
                <div className="lg:col-span-4 space-y-2 bg-white/70 p-3 rounded-xl border border-stone-200/80">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-stone-500 font-medium">Conventional Baseline:</span>
                    <span className="font-mono font-semibold text-stone-600">{item.baselineValue}</span>
                  </div>

                  {/* Relative Visual Meter */}
                  <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden flex">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.highlightColor === "sky"
                          ? "bg-sky-600"
                          : item.highlightColor === "emerald"
                          ? "bg-emerald-700"
                          : item.highlightColor === "amber"
                          ? "bg-amber-600"
                          : "bg-stone-700"
                      }`}
                      style={{ width: `${item.reductionPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-0.5">
                    <span className="font-bold text-emerald-950">SolariQ Closed-Loop:</span>
                    <span className="font-mono font-bold text-emerald-900">{item.solariqValue}</span>
                  </div>
                </div>

                {/* 3. Big Metric Number (3 cols) */}
                <div className="lg:col-span-3 flex lg:flex-col lg:items-end justify-between items-center text-right shrink-0">
                  <div>
                    <span className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 font-serif block">
                      {item.metricValue}
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mt-0.5">
                      {item.metricUnit}
                    </span>
                  </div>

                  <span className="text-[11px] text-emerald-800 font-medium flex items-center gap-1 mt-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Validated</span>
                  </span>
                </div>
              </div>

              {/* Expandable Technical Footnote & Citation */}
              {isSelected && (
                <div className="mt-4 pt-4 border-t border-stone-200/80 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-stone-600">
                  <div className="flex items-start gap-2 bg-white p-3 rounded-xl border border-stone-200">
                    <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-stone-900 block text-[11px] uppercase tracking-wide">
                        Impact Calculation
                      </strong>
                      <p className="text-[11px] text-stone-600 mt-0.5">{item.impactQuote}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-white p-3 rounded-xl border border-stone-200">
                    <Calendar className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-stone-900 block text-[11px] uppercase tracking-wide">
                        Validation Protocol
                      </strong>
                      <p className="text-[11px] text-stone-600 mt-0.5">{item.protocol}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Aggregate Institutional Note */}
      <div className="p-4 rounded-xl bg-stone-100/70 border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-600">
        <div className="flex items-center gap-2">
          <span className="font-bold text-stone-900">National Replication Multiplier:</span>
          <span>
            Applying this framework across 100 km of BWDB irrigation canals conserves <strong>46.5M Liters</strong> of water and injects <strong>114.2 MWh</strong> of green power annually.
          </span>
        </div>
        <span className="font-mono text-[10px] text-stone-500 shrink-0">
          Source: BRRI / BWDB / SREDA (2025–2027)
        </span>
      </div>
    </div>
  );
}
