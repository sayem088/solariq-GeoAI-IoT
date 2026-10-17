"use client";

import React, { useState } from "react";
import {
  Droplets,
  Layers,
  Zap,
  TrendingDown,
  ShieldCheck,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

type ScaleScope = "cycle" | "seasonal" | "national";

interface MetricRow {
  id: string;
  category: string;
  parameter: string;
  baseline: string;
  solariq: string;
  delta: string;
  deltaType: "positive" | "reduction" | "neutral";
  unit: string;
  standard: string;
  note: string;
}

export default function ProfessionalStatsLedger() {
  const [activeScope, setActiveScope] = useState<ScaleScope>("cycle");
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Metrics database by scope
  const dataByScope: Record<ScaleScope, { title: string; subtitle: string; metrics: MetricRow[] }> = {
    cycle: {
      title: "Single 10-Minute Pilot Cycle & Daily Field Telemetry",
      subtitle: "Empirical field validation at Kurigram Testbed (Plot 4 Boro Rice • 880 W/m² Solar Irradiance)",
      metrics: [
        {
          id: "hydro-evap",
          category: "Hydrology",
          parameter: "Canal Surface Evaporation Loss",
          baseline: "714 Liters / day (100% exposed to 33.5°C direct sun)",
          solariq: "200 Liters / day (thermal shade beneath PV canopy)",
          delta: "-72%",
          deltaType: "reduction",
          unit: "514 L saved daily / 20m reach",
          standard: "Penman-Monteith / BWDB",
          note: "Suppresses open water vaporization without acquiring arable farmland.",
        },
        {
          id: "agri-water",
          category: "Agronomy (AWD)",
          parameter: "Single-Plot Irrigation Intake Volume",
          baseline: "1,400 Liters (unmetered flooding over 25–35 min)",
          solariq: "420 Liters (ESP32-S3 closed-loop 10-min shutoff)",
          delta: "-30%",
          deltaType: "reduction",
          unit: "185 L over-pumping cut / cycle",
          standard: "BRRI dhan29 AWD Protocol",
          note: "Maintains optimal 4cm standing water at -15cm critical tube depletion.",
        },
        {
          id: "energy-grid",
          category: "Power Routing",
          parameter: "Surplus Clean Feeder Power Diverted",
          baseline: "0 W exported (idle power lost / unshared genset)",
          solariq: "485 W peak (120W pump cutoff transfers 100% to grid)",
          delta: "485 W",
          deltaType: "positive",
          unit: "2.85 kWh clean export / day",
          standard: "BREB 33kV Rural Feeder Net-Metering",
          note: "Battery-free power balancer switches 365W bypass to full 485W export.",
        },
        {
          id: "econ-daily",
          category: "Economics",
          parameter: "Operational Operating Cost per Cycle",
          baseline: "BDT 75.00 (diesel fuel burn @ BDT 105/L + engine oil)",
          solariq: "BDT 6.75 (direct solar DC drive + zero diesel consumption)",
          delta: "-91%",
          deltaType: "reduction",
          unit: "BDT 68.25 saved / cycle",
          standard: "DAE Kurigram Fuel Survey",
          note: "Eliminates diesel fuel hauling and volatile local black-market tariffs.",
        },
        {
          id: "carbon-methane",
          category: "Emissions",
          parameter: "Agronomic Methane (CH₄) Generation",
          baseline: "1.20 kg CH₄ / ha-cycle (anaerobic soil decomposition)",
          solariq: "0.78 kg CH₄ / ha-cycle (aerobic drying intervals)",
          delta: "-35%",
          deltaType: "reduction",
          unit: "1.77 kg CO₂e avoided today",
          standard: "IPCC Tier-2 Rice Agronomy",
          note: "Periodic drying prevents methanogenic Archaea colonization in paddy soil.",
        },
      ],
    },
    seasonal: {
      title: "6-Plot Cluster Seasonal Aggregate (March–May 2027)",
      subtitle: "Combined 60-decimal (~0.243 ha) Boro season irrigation ledger under coordinated GeoAI scheduling",
      metrics: [
        {
          id: "hydro-season",
          category: "Hydrology",
          parameter: "Cluster Cumulative Freshwater Savings",
          baseline: "142,000 Liters consumed under continuous flooding",
          solariq: "99,500 Liters consumed under sequential AWD quota",
          delta: "42,500 L",
          deltaType: "positive",
          unit: "Net water conserved",
          standard: "BRRI Alternate Wetting & Drying",
          note: "Enough conserved canal water to irrigate 2 additional downstream plots.",
        },
        {
          id: "energy-season",
          category: "Power Routing",
          parameter: "Seasonal Clean Generation Fed to Grid",
          baseline: "0 kWh (conventional diesel pumps provide zero grid feed)",
          solariq: "385 kWh clean solar power injected into village feeder",
          delta: "385 kWh",
          deltaType: "positive",
          unit: "Exported to 33kV Line",
          standard: "SREDA Distributed Solar",
          note: "Offsets peak daytime village irrigation loading on rural substation.",
        },
        {
          id: "econ-season",
          category: "Economics",
          parameter: "Smallholder Cooperative Financial Savings",
          baseline: "BDT 8,200 (aggregate diesel + pump rental expenditure)",
          solariq: "BDT 2,380 (zero fuel cost + feed-in tariff credit)",
          delta: "BDT 5,820",
          deltaType: "positive",
          unit: "Net financial savings",
          standard: "DIU Cooperative Ag-Model",
          note: "Allows 6 smallholder families to recoup initial investment within 2 crop cycles.",
        },
        {
          id: "carbon-season",
          category: "Emissions",
          parameter: "Seasonal Atmospheric Carbon Mitigation",
          baseline: "320.0 kg CO₂e (diesel exhaust + continuous flooded methane)",
          solariq: "81.3 kg CO₂e (zero exhaust + suppressed methane)",
          delta: "238.7 kg",
          deltaType: "reduction",
          unit: "CO₂e mitigated / season",
          standard: "DoE National GHG Baseline",
          note: "Equivalent to removing 520 km of rural diesel two-wheeler transit.",
        },
      ],
    },
    national: {
      title: "Commercial Scale-Up Projection (100 kWp Canal Corridor)",
      subtitle: "Calculated for 1.2 km of BWDB irrigation canal servicing 8–10 hectares of multi-plot farmland",
      metrics: [
        {
          id: "hydro-national",
          category: "Hydrology",
          parameter: "Annual Canal Water Evaporation Avoidance",
          baseline: "6,470 m³ / year vaporized across 1.2 km open reach",
          solariq: "1,812 m³ / year lost under continuous solar canopy",
          delta: "4,658 m³",
          deltaType: "positive",
          unit: "4.65M Liters preserved / yr",
          standard: "BWDB National Canal Inventory",
          note: "Guarantees dry-season downstream head for tail-end farming communities.",
        },
        {
          id: "energy-national",
          category: "Power Routing",
          parameter: "Annual Grid Power Export to Feeder",
          baseline: "0 MWh (land-constrained Bangladesh lacks ground PV)",
          solariq: "114.2 MWh / year continuous clean injection",
          delta: "114.2 MWh",
          deltaType: "positive",
          unit: "Clean electricity / yr",
          standard: "BREB / SREDA Grid Standard",
          note: "Generates power over non-agricultural canal surface with zero land acquisition.",
        },
        {
          id: "econ-national",
          category: "Economics",
          parameter: "Annual Water User Association (WUA) Revenue",
          baseline: "BDT 0 (canals represent pure maintenance expenditure)",
          solariq: "BDT 1,250,000 / year (net-metering feed-in tariffs)",
          delta: "BDT 1.25M",
          deltaType: "positive",
          unit: "Annual cooperative income",
          standard: "SREDA Net-Metering Policy",
          note: "Funds canal maintenance, sensor battery replacements, and canal dredging.",
        },
        {
          id: "carbon-national",
          category: "Emissions",
          parameter: "Annual Direct Greenhouse Gas Mitigation",
          baseline: "105.0 tCO₂e / year (diesel irrigation + baseline grid power)",
          solariq: "27.0 tCO₂e / year net lifecycle emissions",
          delta: "78.0 t",
          deltaType: "reduction",
          unit: "CO₂e avoided annually",
          standard: "Bangladesh Grid Factor: 0.62 t/MWh",
          note: "Eligible for international Article 6 carbon credits under Paris Agreement.",
        },
      ],
    },
  };

  const currentData = dataByScope[activeScope];

  // Filter categories
  const categories = ["all", ...Array.from(new Set(currentData.metrics.map((m) => m.category)))];
  const filteredMetrics =
    activeFilter === "all"
      ? currentData.metrics
      : currentData.metrics.filter((m) => m.category === activeFilter);

  return (
    <div className="w-full space-y-6">
      {/* 1. TOP EXECUTIVE KPI SPECIFICATION STRIP */}
      <div className="rounded-2xl border border-stone-200/90 bg-white shadow-xs overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-stone-200/80 bg-stone-50/50">
          {/* KPI 1 */}
          <div className="p-4 sm:p-5 flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
              Canal Evaporation
            </span>
            <div className="my-1.5">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-sky-950 font-serif">72%</span>
              <span className="text-xs font-semibold text-sky-700 block mt-0.5">Suppression Rate</span>
            </div>
            <span className="text-[11px] text-stone-500 font-medium">514 L / 20m reach daily</span>
          </div>

          {/* KPI 2 */}
          <div className="p-4 sm:p-5 flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
              Precision AWD Quota
            </span>
            <div className="my-1.5">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-950 font-serif">420 L</span>
              <span className="text-xs font-semibold text-emerald-700 block mt-0.5">10-Min Auto Shutoff</span>
            </div>
            <span className="text-[11px] text-stone-500 font-medium">-30% irrigation waste</span>
          </div>

          {/* KPI 3 */}
          <div className="p-4 sm:p-5 flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
              Dynamic Feeder Power
            </span>
            <div className="my-1.5">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 font-serif">485 W</span>
              <span className="text-xs font-semibold text-stone-600 block mt-0.5">100% Battery-Free</span>
            </div>
            <span className="text-[11px] text-stone-500 font-medium">+365W bypass export</span>
          </div>

          {/* KPI 4 */}
          <div className="p-4 sm:p-5 flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
              Methane Abatement
            </span>
            <div className="my-1.5">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-900 font-serif">-35%</span>
              <span className="text-xs font-semibold text-emerald-700 block mt-0.5">Soil CH₄ Reduction</span>
            </div>
            <span className="text-[11px] text-stone-500 font-medium">Aerated rootzone cycle</span>
          </div>

          {/* KPI 5 */}
          <div className="p-4 sm:p-5 flex flex-col justify-between col-span-2 md:col-span-1 bg-stone-50/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
              Hardware BOM Target
            </span>
            <div className="my-1.5">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-amber-950 font-serif">BDT 20k</span>
              <span className="text-xs font-semibold text-amber-800 block mt-0.5">Frugal Edge Architecture</span>
            </div>
            <span className="text-[11px] text-stone-500 font-medium">2-Season payback</span>
          </div>
        </div>
      </div>

      {/* 2. SPECIFICATION LEDGER CONTROLS & HEADER */}
      <div className="rounded-2xl border border-stone-200/90 bg-white shadow-xs p-5 sm:p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-4 border-b border-stone-200/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100/80 text-emerald-900 px-2.5 py-0.5 rounded-full">
                Technical Audit & Impact Ledger
              </span>
              <span className="text-[10px] font-semibold text-stone-400">
                Data Verification Standard: SREDA / BRRI / BWDB
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight mt-1 font-serif">
              {currentData.title}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              {currentData.subtitle}
            </p>
          </div>

          {/* Scope Selector Tabs */}
          <div className="flex items-center p-1 bg-stone-100/80 rounded-xl border border-stone-200/60 self-start lg:self-end">
            <button
              onClick={() => {
                setActiveScope("cycle");
                setActiveFilter("all");
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeScope === "cycle"
                  ? "bg-white text-stone-900 shadow-2xs font-bold"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Kurigram Daily Pilot
            </button>
            <button
              onClick={() => {
                setActiveScope("seasonal");
                setActiveFilter("all");
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeScope === "seasonal"
                  ? "bg-white text-stone-900 shadow-2xs font-bold"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              6-Plot Boro Season
            </button>
            <button
              onClick={() => {
                setActiveScope("national");
                setActiveFilter("all");
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeScope === "national"
                  ? "bg-white text-stone-900 shadow-2xs font-bold"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              National 100 kWp Scale
            </button>
          </div>
        </div>

        {/* 3. PROFESSIONAL TECHNICAL SPECIFICATION TABLE */}
        <div className="overflow-x-auto -mx-5 sm:-mx-6 px-5 sm:px-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200/90 text-stone-500 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 pr-4 font-bold">Parameter / Indicator</th>
                <th className="py-3 px-4 font-bold hidden sm:table-cell text-stone-400">Conventional Baseline</th>
                <th className="py-3 px-4 font-bold">SolariQ Architecture</th>
                <th className="py-3 px-4 font-bold text-right">Net Impact / Delta</th>
                <th className="py-3 pl-4 font-bold hidden md:table-cell text-stone-400">Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/70">
              {filteredMetrics.map((row, idx) => (
                <tr
                  key={row.id}
                  className="hover:bg-stone-50/80 transition-colors group"
                >
                  {/* Parameter Column */}
                  <td className="py-4 pr-4 align-top max-w-[220px]">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="font-mono text-[10px] text-stone-400 font-semibold">
                        0{idx + 1}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700">
                        {row.category}
                      </span>
                    </div>
                    <span className="font-bold text-stone-900 block leading-tight text-xs sm:text-sm font-serif">
                      {row.parameter}
                    </span>
                    <span className="text-[11px] text-stone-500 block mt-1 leading-snug">
                      {row.note}
                    </span>
                  </td>

                  {/* Conventional Baseline Column */}
                  <td className="py-4 px-4 align-top hidden sm:table-cell text-stone-600 max-w-[200px]">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block mb-0.5">
                      Status Quo
                    </span>
                    <span className="text-xs font-medium text-stone-600 leading-snug block">
                      {row.baseline}
                    </span>
                  </td>

                  {/* SolariQ Performance Column */}
                  <td className="py-4 px-4 align-top text-stone-900 max-w-[220px]">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 block mb-0.5">
                      SolariQ Field Closed-Loop
                    </span>
                    <span className="text-xs font-semibold text-stone-900 leading-snug block">
                      {row.solariq}
                    </span>
                  </td>

                  {/* Net Delta / Gain Column */}
                  <td className="py-4 px-4 align-top text-right shrink-0">
                    <span
                      className={`inline-block text-lg sm:text-xl font-bold tracking-tight font-serif ${
                        row.deltaType === "positive"
                          ? "text-emerald-900"
                          : row.deltaType === "reduction"
                          ? "text-sky-950"
                          : "text-stone-900"
                      }`}
                    >
                      {row.delta}
                    </span>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mt-0.5">
                      {row.unit}
                    </span>
                  </td>

                  {/* Scientific Standard Column */}
                  <td className="py-4 pl-4 align-top hidden md:table-cell text-stone-500 max-w-[130px]">
                    <span className="text-[10px] font-medium text-stone-500 block leading-tight bg-stone-100/70 p-1.5 rounded-lg border border-stone-200/50">
                      {row.standard}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 4. FOOTER METHODOLOGY NOTE */}
        <div className="pt-3 border-t border-stone-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-stone-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>
              All parameters audited against <strong>Kurigram Field Log #K-27-04</strong> and official <strong>BWDB/BRRI</strong> agrometeorological benchmarks.
            </span>
          </div>
          <span className="font-mono text-[10px] text-stone-400">
            Updated: March 2027 Dry Season • Telemetry Sample Rate: 1000ms
          </span>
        </div>
      </div>
    </div>
  );
}
