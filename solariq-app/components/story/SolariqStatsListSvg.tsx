"use client";

import React, { useState } from "react";
import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

interface StatItem {
  id: string;
  index: string;
  category: string;
  title: string;
  baseline: string;
  solariq: string;
  metric: string;
  metricLabel: string;
  detail: string;
  protocol: string;
  color: string;
  barPct: number;
}

const statsList: StatItem[] = [
  {
    id: "hydro",
    index: "01",
    category: "CANAL HYDROLOGY",
    title: "Surface Evaporation Suppression",
    baseline: "714 L / day lost (unshaded)",
    solariq: "200 L / day (PV shielded)",
    metric: "72%",
    metricLabel: "Evaporation Blocked",
    detail: "514 Liters conserved daily per 20m reach without acquiring scarce farmland.",
    protocol: "BWDB Gauging • Penman-Monteith",
    color: "#0284c7",
    barPct: 72,
  },
  {
    id: "agro",
    index: "02",
    category: "PRECISION AGRONOMY",
    title: "AWD Rootzone Irrigation Quota",
    baseline: "1,400 L / 25 min (flood waste)",
    solariq: "420 L / 10 min (smart shutoff)",
    metric: "420 L",
    metricLabel: "Per 10-Min Cycle",
    detail: "ESP32-S3 sensor shutoff cuts 30% freshwater waste (42,500 L / season).",
    protocol: "BRRI dhan29 AWD Tube Standard",
    color: "#065f46",
    barPct: 70,
  },
  {
    id: "energy",
    index: "03",
    category: "GRID ELECTRICAL",
    title: "Dynamic 33kV Rural Feeder Export",
    baseline: "0 W to Grid (idle / diesel)",
    solariq: "485 W Peak (dynamic bypass)",
    metric: "485 W",
    metricLabel: "Battery-Free Grid Feed",
    detail: "100% battery-free diversion feeds 2.85 kWh clean export daily, replacing diesel.",
    protocol: "BREB / SREDA 33kV Feeder",
    color: "#d97706",
    barPct: 100,
  },
  {
    id: "climate",
    index: "04",
    category: "CLIMATE MITIGATION",
    title: "Greenhouse Methane Abatement",
    baseline: "1.20 kg CH₄ / ha (anaerobic)",
    solariq: "0.78 kg CH₄ / ha (aerated)",
    metric: "-35%",
    metricLabel: "Paddy Methane Abated",
    detail: "Periodic rootzone aeration suppresses methanogenic bacteria in rice soil.",
    protocol: "IPCC Tier-2 Rice Agronomy",
    color: "#047857",
    barPct: 35,
  },
  {
    id: "econ",
    index: "05",
    category: "FRUGAL ENGINEERING",
    title: "Smallholder Hardware Target BOM",
    baseline: "BDT 65,000+ (battery storage)",
    solariq: "BDT 20,000 (direct DC edge)",
    metric: "BDT 20k",
    metricLabel: "Target Hardware BOM",
    detail: "Engineered for rural smallholder affordability; pays for itself in 2 Boro seasons.",
    protocol: "DIU Cooperative Ag-Model",
    color: "#78350f",
    barPct: 69,
  },
];

export default function SolariqStatsListSvg() {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <div className="w-full bg-white rounded-3xl border border-stone-200/90 shadow-sm p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Sub-Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2 border-b border-stone-100">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full inline-block">
            Empirical Field Benchmarks
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 mt-1 font-serif">
            Performance & Resource Metrics Specification
          </h2>
        </div>
        <p className="text-xs text-stone-500 font-medium sm:text-right">
          Vector specification schematic audited on the Kurigram pilot corridor across hydrology, agronomy, power & carbon
        </p>
      </div>

      {/* Pure SVG Vector Canvas */}
      <div className="w-full relative flex items-center justify-center select-none overflow-hidden rounded-2xl bg-gradient-to-b from-stone-50/70 via-white to-stone-50/50 border border-stone-100">
        <svg
          viewBox="0 0 1100 660"
          className="w-full h-auto max-h-[660px] object-contain"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#065f46" />
              <stop offset="100%" stopColor="#0f766e" />
            </linearGradient>

            <linearGradient id="rowHoverGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#f1f5f9" />
            </linearGradient>

            <linearGradient id="blueBarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>

            <linearGradient id="greenBarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>

            <linearGradient id="amberBarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>

            <linearGradient id="emeraldBarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6ee7b7" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>

            <linearGradient id="brownBarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a8a29e" />
              <stop offset="100%" stopColor="#57534e" />
            </linearGradient>

            <filter id="svgRowShadow" x="-2%" y="-5%" width="104%" height="110%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodOpacity="0.05" />
            </filter>
          </defs>

          {/* ============================================================== */}
          {/* TABLE / LIST HEADER BAND */}
          {/* ============================================================== */}
          <g transform="translate(30, 20)">
            <rect x="0" y="0" width="1040" height="34" rx="8" fill="#f5f5f4" stroke="#e7e5e4" strokeWidth="1" />
            <text x="25" y="21" fill="#78716c" fontSize="10" fontFamily="'Asul', serif" fontWeight="700" letterSpacing="1">
              INDEX • DOMAIN & PARAMETER
            </text>
            <text x="460" y="21" fill="#78716c" fontSize="10" fontFamily="'Asul', serif" fontWeight="700" letterSpacing="1">
              CONVENTIONAL BASELINE ➔ SOLARIQ CLOSED-LOOP
            </text>
            <text x="930" y="21" fill="#78716c" fontSize="10" fontFamily="'Asul', serif" fontWeight="700" letterSpacing="1" textAnchor="middle">
              MEASURED IMPACT
            </text>
            <text x="1015" y="21" fill="#78716c" fontSize="9" fontFamily="'Asul', serif" fontWeight="700" textAnchor="middle">
              AUDIT
            </text>
          </g>

          {/* ============================================================== */}
          {/* STATS LIST ROWS (01 to 05) */}
          {/* ============================================================== */}
          {statsList.map((item, index) => {
            const yPos = 65 + index * 95;
            const isHovered = hoveredRow === index;

            return (
              <g
                key={item.id}
                transform={`translate(30, ${yPos})`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredRow(index)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                {/* Background Row Container */}
                <rect
                  x="0"
                  y="0"
                  width="1040"
                  height="85"
                  rx="14"
                  fill={isHovered ? "url(#rowHoverGrad)" : "#ffffff"}
                  stroke={isHovered ? item.color : "#e7e5e4"}
                  strokeWidth={isHovered ? "1.8" : "1"}
                  filter={isHovered ? "url(#svgRowShadow)" : "none"}
                  style={{ transition: "all 0.2s ease" }}
                />

                {/* Left Accent Color Indicator Bar */}
                <rect x="0" y="14" width="4" height="57" rx="2" fill={item.color} />

                {/* Column 1: Index, Domain Badge & Title */}
                <g transform="translate(24, 22)">
                  {/* Index Number */}
                  <text x="0" y="16" fill="#a8a29e" fontSize="13" fontFamily="'Asul', serif" fontWeight="700">
                    {item.index}
                  </text>

                  {/* Domain Category Pill */}
                  <rect x="26" y="4" width="125" height="18" rx="5" fill="#f5f5f4" stroke="#e7e5e4" strokeWidth="0.8" />
                  <text x="88" y="16" fill="#57534e" fontSize="8.5" fontFamily="'Asul', serif" fontWeight="700" textAnchor="middle" letterSpacing="0.8">
                    {item.category}
                  </text>

                  {/* Title */}
                  <text x="0" y="38" fill="#1c1917" fontSize="14" fontFamily="'Asul', serif" fontWeight="700">
                    {item.title}
                  </text>

                  {/* Brief Technical Detail */}
                  <text x="0" y="52" fill="#78716c" fontSize="10.5" fontFamily="'Asul', serif" fontWeight="400">
                    {item.detail}
                  </text>
                </g>

                {/* Column 2: Baseline vs SolariQ Comparison Graphic */}
                <g transform="translate(460, 16)">
                  {/* Top: Baseline text */}
                  <text x="0" y="14" fill="#78716c" fontSize="10" fontFamily="'Asul', serif" fontWeight="600">
                    Baseline: <tspan fill="#44403c" fontWeight="700">{item.baseline}</tspan>
                  </text>

                  {/* Visual Comparison Bar Track */}
                  <rect x="0" y="24" width="310" height="9" rx="4.5" fill="#e7e5e4" />
                  <rect
                    x="0"
                    y="24"
                    width={(310 * item.barPct) / 100}
                    height="9"
                    rx="4.5"
                    fill={
                      item.id === "hydro"
                        ? "url(#blueBarGrad)"
                        : item.id === "agro"
                        ? "url(#greenBarGrad)"
                        : item.id === "energy"
                        ? "url(#amberBarGrad)"
                        : item.id === "climate"
                        ? "url(#emeraldBarGrad)"
                        : "url(#brownBarGrad)"
                    }
                  />

                  {/* Bottom: SolariQ Closed-Loop text */}
                  <text x="0" y="51" fill="#065f46" fontSize="10.5" fontFamily="'Asul', serif" fontWeight="700">
                    SolariQ: <tspan fill="#064e3b" fontWeight="700">{item.solariq}</tspan>
                  </text>
                </g>

                {/* Column 3: Monumental Hero Metric Number & Label */}
                <g transform="translate(930, 24)">
                  <text
                    x="0"
                    y="28"
                    fill={item.color}
                    fontSize="26"
                    fontFamily="'Asul', serif"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    {item.metric}
                  </text>
                  <text
                    x="0"
                    y="45"
                    fill="#78716c"
                    fontSize="9.5"
                    fontFamily="'Asul', serif"
                    fontWeight="700"
                    textAnchor="middle"
                    letterSpacing="0.5"
                  >
                    {item.metricLabel.toUpperCase()}
                  </text>
                </g>

                {/* Column 4: Validation Stamp */}
                <g transform="translate(1015, 34)">
                  <circle cx="0" cy="0" r="10" fill="#ecfdf5" stroke="#10b981" strokeWidth="1" />
                  <text x="0" y="4" fill="#047857" fontSize="10" fontWeight="bold" textAnchor="middle">✓</text>
                  <text x="0" y="20" fill="#a8a29e" fontSize="7.5" fontFamily="'Asul', serif" fontWeight="700" textAnchor="middle">
                    VALID
                  </text>
                </g>
              </g>
            );
          })}

          {/* ============================================================== */}
          {/* BOTTOM NATIONAL REPLICATION SUMMARY BANNER (IN SVG) */}
          {/* ============================================================== */}
          <g transform="translate(30, 560)">
            <rect x="0" y="0" width="1040" height="75" rx="16" fill="#065f46" stroke="#047857" strokeWidth="1" />

            {/* Glowing Accent Icon */}
            <circle cx="45" cy="37" r="18" fill="#047857" />
            <text x="45" y="42" fill="#6ee7b7" fontSize="14" fontWeight="bold" textAnchor="middle">
              🌐
            </text>

            {/* Banner Content */}
            <g transform="translate(80, 24)">
              <text x="0" y="10" fill="#a7f3d0" fontSize="10" fontFamily="'Asul', serif" fontWeight="700" letterSpacing="1">
                NATIONAL BWDB REPLICATION POTENTIAL • 100 KM CANAL NETWORK
              </text>
              <text x="0" y="32" fill="#ffffff" fontSize="14" fontFamily="'Asul', serif" fontWeight="700">
                46.5M Liters Water Conserved • 114.2 MWh Clean Energy Export • 78.0 Tons CO₂e Mitigated Annually
              </text>
            </g>

            {/* Institutional Seal Badge */}
            <g transform="translate(930, 23)">
              <rect x="0" y="0" width="95" height="30" rx="8" fill="#047857" stroke="#10b981" strokeWidth="0.8" />
              <text x="47" y="19" fill="#d1fae5" fontSize="9" fontFamily="'Asul', serif" fontWeight="700" textAnchor="middle">
                SREDA / BRRI
              </text>
            </g>
          </g>
        </svg>
      </div>

      {/* Understated Editorial Gateways Beneath the SVG */}
      <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/twin"
          className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-emerald-700 transition-all group flex items-center justify-between shadow-2xs hover:shadow-xs"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>Full 100vh Vector SCADA</span>
            </span>
            <h4 className="text-base font-bold text-stone-900 group-hover:text-emerald-950 font-serif">
              2.5D Cyber-Physical Digital Twin →
            </h4>
            <p className="text-stone-500 text-xs">
              Step through the 5-step operational timeline, live manifold latching & 24h physics audit.
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-stone-400 group-hover:text-emerald-800 group-hover:translate-x-1 transition-all shrink-0 ml-4" />
        </Link>

        <Link
          href="/dashboard"
          className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-emerald-700 transition-all group flex items-center justify-between shadow-2xs hover:shadow-xs"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-600" />
              <span>Live Edge Telemetry Stream</span>
            </span>
            <h4 className="text-base font-bold text-stone-900 group-hover:text-emerald-950 font-serif">
              Area-Based Regional SCADA Console →
            </h4>
            <p className="text-stone-500 text-xs">
              Inspect real-time ESP32-S3 sensor feeds, canal hydrology logs & 6-plot AWD moisture matrix.
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-stone-400 group-hover:text-emerald-800 group-hover:translate-x-1 transition-all shrink-0 ml-4" />
        </Link>
      </div>
    </div>
  );
}
