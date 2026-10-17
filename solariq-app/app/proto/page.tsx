"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  RefreshCw,
  Wifi,
  WifiOff,
  Zap,
  Droplets,
  CheckCircle2,
  Clock,
  TrendingUp,
  MapPin,
  ChevronRight,
  X,
  Leaf,
  Layers,
  Sparkles,
  Info,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

// ─── Plot Data: 6 Dharla Canal-Cluster Plots ──────────────────────────────────
// Exactly 6 plots with area, condition, geolocation.
// 5th land has the prominent "Take Action" trigger as requested.

interface PlotItem {
  id: number;
  plotNumber: number;
  name: string;
  owner: string;
  area: string;
  crop: string;
  moisture: number; // %
  awdTube: number; // cm relative to ground
  stage: string;
  lat: string;
  lng: string;
  status: "optimal" | "standby" | "saturated" | "moderate" | "critical";
  condition: string;
  prevYearMin: number;
  hasTakeAction?: boolean;
}

const PLOTS: PlotItem[] = [
  {
    id: 1,
    plotNumber: 1,
    name: "Plot 1 (A-1)",
    owner: "Abdul Gafur",
    area: "10 Decimal (4,360 sq.ft)",
    crop: "Boro Rice (BRRI dhan29)",
    moisture: 52,
    awdTube: -4,
    stage: "Tillering (Day 22)",
    lat: "25.8154°N",
    lng: "89.6321°E",
    status: "optimal",
    condition: "Optimal — Soil water table healthy",
    prevYearMin: 20,
  },
  {
    id: 2,
    plotNumber: 2,
    name: "Plot 2 (A-2)",
    owner: "Rezaul Karim",
    area: "10 Decimal (4,360 sq.ft)",
    crop: "Boro Rice (BRRI dhan29)",
    moisture: 48,
    awdTube: -6,
    stage: "Tillering (Day 20)",
    lat: "25.8151°N",
    lng: "89.6328°E",
    status: "standby",
    condition: "Standby — Root zone moisture adequate",
    prevYearMin: 20,
  },
  {
    id: 3,
    plotNumber: 3,
    name: "Plot 3 (A-3)",
    owner: "Mofiz Uddin",
    area: "10 Decimal (4,360 sq.ft)",
    crop: "Boro Rice (BRRI dhan29)",
    moisture: 68,
    awdTube: +3,
    stage: "Early Vegetative (Day 14)",
    lat: "25.8148°N",
    lng: "89.6335°E",
    status: "saturated",
    condition: "Satisfied — Irrigated 2 days ago",
    prevYearMin: 15,
  },
  {
    id: 4,
    plotNumber: 4,
    name: "Plot 4 (B-1)",
    owner: "Anowar Hossain",
    area: "10 Decimal (4,360 sq.ft)",
    crop: "Boro Rice (BRRI dhan29)",
    moisture: 42,
    awdTube: -8,
    stage: "Tillering (Day 19)",
    lat: "25.8145°N",
    lng: "89.6342°E",
    status: "moderate",
    condition: "Moderate — Approaching AWD threshold in 48h",
    prevYearMin: 20,
  },
  {
    id: 5,
    plotNumber: 5,
    name: "Plot 5 (B-2)",
    owner: "Nurul Islam (Selected)",
    area: "10 Decimal (4,360 sq.ft)",
    crop: "Boro Rice (BRRI dhan29)",
    moisture: 24,
    awdTube: -15,
    stage: "Panicle Initiation (Day 26) ⚠",
    lat: "25.8142°N",
    lng: "89.6349°E",
    status: "critical",
    condition: "⚠ CRITICAL WATER DEFICIT — AWD tube at −15 cm trigger limit. GeoAI: Irrigate immediately!",
    prevYearMin: 25, // Habitual farmer over-pumping!
    hasTakeAction: true,
  },
  {
    id: 6,
    plotNumber: 6,
    name: "Plot 6 (B-3)",
    owner: "Shah Alam",
    area: "10 Decimal (4,360 sq.ft)",
    crop: "Boro Rice (BRRI dhan29)",
    moisture: 58,
    awdTube: -2,
    stage: "Vegetative (Day 16)",
    lat: "25.8139°N",
    lng: "89.6356°E",
    status: "optimal",
    condition: "Standby — Moisture satisfied",
    prevYearMin: 20,
  },
];

// Pump duration options for Plot 5 (10-decimal plot)
interface DurationOption {
  min: number;
  fillPct: number;
  label: string;
  litres: number;
  depthCm: number;
  isAiRecommended?: boolean;
  isFarmerPastHabit?: boolean;
}

const DURATION_OPTIONS: DurationOption[] = [
  {
    min: 10,
    fillPct: 60,
    label: "10 min",
    litres: 420,
    depthCm: 4,
    isAiRecommended: true,
  },
  {
    min: 15,
    fillPct: 78,
    label: "15 min",
    litres: 630,
    depthCm: 5.5,
  },
  {
    min: 20,
    fillPct: 92,
    label: "20 min",
    litres: 840,
    depthCm: 7,
  },
  {
    min: 25,
    fillPct: 100,
    label: "25 min",
    litres: 1050,
    depthCm: 9,
    isFarmerPastHabit: true,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 1. NATIONAL GRID ANIMATED SVG
// In background: Realistic LED Bulb glowing brightly green when idle (exporting),
// turning OFF when pump is running.
// Live animated laser electricity particles traveling Solar -> Controller -> 33kV Grid.
// When pump turns on: Power splits, meter drops dynamically from 485W to 365W.
// ─────────────────────────────────────────────────────────────────────────────

function NationalGridSvg({
  pumpRunning,
  espOnline,
}: {
  pumpRunning: boolean;
  espOnline: boolean;
}) {
  const solarWatts = 485;
  const pumpWatts = pumpRunning ? 120 : 0;
  const gridWatts = solarWatts - pumpWatts;
  const ledActive = espOnline && !pumpRunning;

  return (
    <div className="relative w-full rounded-3xl bg-gradient-to-b from-[#09131f] via-[#0b1726] to-[#040810] border border-cyan-900/40 shadow-2xl p-4 sm:p-6 overflow-hidden text-white">
      {/* Background ambient radial glow from the LED & Solar Inverter */}
      <div
        className={`absolute -top-16 left-1/2 -translate-x-1/2 w-[500px] h-[220px] rounded-full blur-3xl pointer-events-none transition-all duration-1000 ${pumpRunning ? "bg-amber-500/10" : "bg-emerald-500/20"
          }`}
      />

      {/* Header bar: Title & Dynamic Electricity Meter */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-white/10 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
            <Zap className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
                National Grid Transmission Telemetry
              </span>
              <span
                className={`w-2 h-2 rounded-full ${pumpRunning ? "bg-amber-400 animate-ping" : "bg-emerald-400 animate-pulse"
                  }`}
              />
            </div>
            <p className="text-[11px] text-stone-400">
              Canal-Top 485W PV Array •  33kV Substation Feed
            </p>
          </div>
        </div>

        {/* Dynamic Electricity Meter Display */}
        <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md rounded-2xl px-4 py-2 border border-white/10">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
              Grid Injected Power
            </span>
            <div className="flex items-baseline gap-1 justify-end">
              <span
                className={`text-2xl sm:text-3xl font-black tabular-nums transition-colors duration-700 ${pumpRunning ? "text-amber-400" : "text-emerald-400"
                  }`}
              >
                {gridWatts}
              </span>
              <span className="text-xs font-bold text-stone-300">Watts</span>
            </div>
          </div>

          <div className="h-8 w-px bg-white/15" />

          <div className="text-left">
            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
              Array Generation
            </span>
            <span className="text-base font-black text-cyan-300 tabular-nums">
              485W Peak
            </span>
            <span className="text-[10px] text-stone-400 block">
              {pumpRunning ? "120W pump diverted" : "100% exported"}
            </span>
          </div>
        </div>
      </div>

      {/* Animated SVG Schematic */}
      <div className="w-full overflow-x-auto pb-1">
        <svg
          viewBox="0 0 920 260"
          className="w-full min-w-[760px] h-auto select-none font-sans"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="pvGlass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="50%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            <linearGradient id="pvHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.8" />
              <stop offset="40%" stopColor="#60a5fa" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="waterFlowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.9" />
            </linearGradient>

            <radialGradient id="ledBulbRadial" cx="50%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor="#6ee7b7" />
              <stop offset="70%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" />
            </radialGradient>

            <radialGradient id="ledOffRadial" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#4b5563" />
              <stop offset="70%" stopColor="#1f2937" />
              <stop offset="100%" stopColor="#111827" />
            </radialGradient>

            <filter id="glowGreenFilter" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <filter id="glowAmberFilter" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* ──────────────── Canal Basin under Solar Canopy ────────────────── */}
          <rect x="25" y="170" width="240" height="50" rx="10" fill="url(#waterFlowGrad)" />
          {/* Flow waves */}
          <path
            d="M 35 185 Q 65 178 95 185 T 155 185 T 215 185 T 255 185"
            fill="none"
            stroke="#bae6fd"
            strokeWidth="1.8"
            opacity="0.7"
          />
          <text x="145" y="208" textAnchor="middle" fill="#f0f9ff" fontSize="10.5" fontWeight="bold">
            BWDB Re-Excavated Public Canal
          </text>

          {/* Steel Overhead Truss Support */}
          <line x1="45" y1="170" x2="60" y2="75" stroke="#64748b" strokeWidth="3" />
          <line x1="245" y1="170" x2="230" y2="75" stroke="#64748b" strokeWidth="3" />
          <line x1="45" y1="170" x2="230" y2="75" stroke="#334155" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="245" y1="170" x2="60" y2="75" stroke="#334155" strokeWidth="1.5" strokeDasharray="3 3" />

          {/* Canal-Top Solar PV Modules */}
          <g transform="translate(40, 40)">
            <rect x="10" y="20" width="200" height="44" rx="4" fill="#020617" stroke="#475569" strokeWidth="2" />
            {/* 4 Multi-crystalline Solar Panels */}
            {[15, 62, 109, 156].map((x, i) => (
              <g key={i}>
                <rect x={x} y="24" width="43" height="36" rx="2" fill="url(#pvGlass)" stroke="#38bdf8" strokeWidth="1" />
                <line x1={x} y1="42" x2={x + 43} y2="42" stroke="#60a5fa" strokeWidth="0.8" opacity="0.6" />
                <line x1={x + 21} y1="24" x2={x + 21} y2="60" stroke="#60a5fa" strokeWidth="0.8" opacity="0.6" />
              </g>
            ))}
            {/* Diagonal Reflection Highlight */}
            <path d="M 15 24 L 90 24 L 55 60 L 15 60 Z" fill="url(#pvHighlight)" opacity="0.45" />

            {/* Solar Badge */}
            <rect x="48" y="-6" width="124" height="22" rx="11" fill="#065f46" stroke="#10b981" strokeWidth="1.5" />
            <text x="110" y="9" textAnchor="middle" fill="#ecfdf5" fontSize="11" fontWeight="900">
              ☀ 485W Canal-Top Solar
            </text>
          </g>

          {/* ──────────────── Central SolariQ Bi-directional Inverter ────────── */}
          <g transform="translate(390, 48)">
            {/* Controller Enclosure */}
            <rect x="0" y="0" width="150" height="115" rx="14" fill="#0f172a" stroke="#1e293b" strokeWidth="2.5" />
            <rect x="10" y="10" width="130" height="95" rx="8" fill="#020617" stroke="#334155" strokeWidth="1" />

            {/* SolariQ Microchip Icon */}
            <rect x="45" y="20" width="60" height="42" rx="6" fill="#022c22" stroke="#10b981" strokeWidth="1.5" />
            <text x="75" y="38" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="900" letterSpacing="1">
              SOLARIQ
            </text>
            <text x="75" y="52" textAnchor="middle" fill="#6ee7b7" fontSize="8.5" fontWeight="bold">
              EDGE-AI IOT
            </text>

            {/* Status Indicator */}
            <circle
              cx="35"
              cy="84"
              r="4.5"
              fill={pumpRunning ? "#f59e0b" : "#10b981"}
              className="animate-pulse"
            />
            <text x="47" y="87" fill="#e2e8f0" fontSize="9.5" fontWeight="bold">
              {pumpRunning ? "Pump Active (120W)" : "100% Export (485W)"}
            </text>

            <text x="75" y="132" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontWeight="bold">
              Bi-Directional Controller
            </text>
          </g>

          {/* ──────────────── High-Voltage 33kV National Grid Pylon (Right) ───── */}
          <g transform="translate(730, 20)">
            {/* Steel Lattice Transmission Tower */}
            <polygon points="50,25 15,195 85,195" fill="none" stroke="#64748b" strokeWidth="3" />
            {/* Cross Arms */}
            <line x1="0" y1="55" x2="100" y2="55" stroke="#94a3b8" strokeWidth="3" />
            <line x1="10" y1="90" x2="90" y2="90" stroke="#94a3b8" strokeWidth="2.5" />
            <line x1="20" y1="125" x2="80" y2="125" stroke="#94a3b8" strokeWidth="2.5" />

            {/* Lattice Diagonal Braces */}
            <line x1="32" y1="55" x2="68" y2="90" stroke="#475569" strokeWidth="1.2" />
            <line x1="68" y1="55" x2="32" y2="90" stroke="#475569" strokeWidth="1.2" />
            <line x1="28" y1="90" x2="72" y2="125" stroke="#475569" strokeWidth="1.2" />
            <line x1="72" y1="90" x2="28" y2="125" stroke="#475569" strokeWidth="1.2" />
            <line x1="22" y1="125" x2="78" y2="170" stroke="#475569" strokeWidth="1.2" />
            <line x1="78" y1="125" x2="22" y2="170" stroke="#475569" strokeWidth="1.2" />

            {/* Ceramic Insulators */}
            <circle cx="2" cy="60" r="3" fill="#cbd5e1" />
            <circle cx="98" cy="60" r="3" fill="#cbd5e1" />
            <circle cx="12" cy="95" r="3" fill="#cbd5e1" />
            <circle cx="88" cy="95" r="3" fill="#cbd5e1" />

            {/* Grid Export Badge */}
            <rect
              x="-18"
              y="200"
              width="136"
              height="28"
              rx="14"
              fill={pumpRunning ? "#451a03" : "#064e3b"}
              stroke={pumpRunning ? "#d97706" : "#059669"}
              strokeWidth="2"
            />
            <text
              x="50"
              y="218"
              textAnchor="middle"
              fill={pumpRunning ? "#fef3c7" : "#ecfdf5"}
              fontSize="13"
              fontWeight="900"
            >
              ⚡ {gridWatts}W to Grid
            </text>
            <text x="50" y="15" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="black">
              33kV National Grid
            </text>
          </g>

          {/* ──────────────── THE HARDWARE D6 LED BULB (Inside Background) ───── */}
          {/* Integrated right in the transmission schematic between Inverter & Grid */}
          <g transform="translate(600, 140)">
            {/* LED Ambient Glow Aura when active */}
            {ledActive && (
              <circle cx="30" cy="35" r="42" fill="#10b981" opacity="0.25" filter="url(#glowGreenFilter)" />
            )}
            {ledActive && (
              <circle cx="30" cy="35" r="28" fill="#34d399" opacity="0.4" className="animate-pulse" />
            )}

            {/* Glass Bulb Dome */}
            <ellipse
              cx="30"
              cy="35"
              rx="20"
              ry="22"
              fill={ledActive ? "url(#ledBulbRadial)" : "url(#ledOffRadial)"}
              stroke={ledActive ? "#6ee7b7" : "#4b5563"}
              strokeWidth="2"
            />

            {/* Glowing Internal Filament */}
            <path
              d="M 23 35 Q 26 27 30 35 Q 34 43 37 35"
              fill="none"
              stroke={ledActive ? "#ffffff" : "#6b7280"}
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Bulb Collar & Metal Base */}
            <rect
              x="22"
              y="54"
              width="16"
              height="8"
              rx="2"
              fill={ledActive ? "#a7f3d0" : "#374151"}
              stroke={ledActive ? "#34d399" : "#4b5563"}
              strokeWidth="1.2"
            />
            <rect x="20" y="62" width="20" height="4" rx="1" fill="#6b7280" />
            <rect x="22" y="66" width="16" height="4" rx="1" fill="#4b5563" />

            {/* Anode / Cathode Wire Pins */}
            <line x1="24" y1="70" x2="24" y2="82" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
            <line x1="36" y1="70" x2="36" y2="82" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />

            {/* Status Label */}
            <text
              x="30"
              y="100"
              textAnchor="middle"
              fill={ledActive ? "#34d399" : "#94a3b8"}
              fontSize="10"
              fontWeight="900"
            >
              Hardware D6 LED: {ledActive ? "ON (Grid Feed)" : "OFF (Pump Active)"}
            </text>
          </g>

          {/* ──────────────── Submersible Pump Unit (Bottom Left/Center) ──────── */}
          <g transform="translate(425, 175)">
            <rect
              x="15"
              y="5"
              width="55"
              height="38"
              rx="7"
              fill={pumpRunning ? "#0f172a" : "#1e293b"}
              stroke={pumpRunning ? "#38bdf8" : "#475569"}
              strokeWidth="2"
            />
            {/* Spinning Impeller */}
            <circle
              cx="42"
              cy="24"
              r="11"
              fill="#020617"
              stroke={pumpRunning ? "#0284c7" : "#334155"}
              strokeWidth="1.5"
            />
            <g
              transform="translate(42, 24)"
              style={
                pumpRunning
                  ? {
                    animation: "spinSlow 0.6s linear infinite",
                    transformOrigin: "center",
                  }
                  : undefined
              }
            >
              <line x1="-8" y1="0" x2="8" y2="0" stroke={pumpRunning ? "#38bdf8" : "#64748b"} strokeWidth="2" />
              <line x1="0" y1="-8" x2="0" y2="8" stroke={pumpRunning ? "#38bdf8" : "#64748b"} strokeWidth="2" />
            </g>

            {/* Delivery Pipe Out */}
            <path
              d="M 70 24 L 115 24 L 115 48"
              fill="none"
              stroke={pumpRunning ? "#38bdf8" : "#475569"}
              strokeWidth="4"
              strokeLinecap="round"
            />
            {pumpRunning && (
              <circle cx="115" cy="48" r="4.5" fill="#38bdf8" className="animate-ping" />
            )}

            <text
              x="42"
              y="56"
              textAnchor="middle"
              fill={pumpRunning ? "#38bdf8" : "#64748b"}
              fontSize="9.5"
              fontWeight="bold"
            >
              {pumpRunning ? "Pump: 120W (Active)" : "Pump: 0W (Idle)"}
            </text>
          </g>

          {/* ──────────────── Animated Power Lines & Energy Lasers ─────────────── */}
          {/* Wire 1: Solar Canopy -> Inverter */}
          <path d="M 250 95 L 390 95" fill="none" stroke="#10b981" strokeWidth="4" opacity="0.3" />
          <path
            d="M 250 95 L 390 95"
            fill="none"
            stroke="#34d399"
            strokeWidth="4"
            strokeDasharray="8 12"
            filter="url(#glowGreenFilter)"
            style={{ animation: "flowRight 0.8s linear infinite" }}
          />

          {/* Wire 2: Inverter -> 33kV National Grid */}
          <path
            d="M 540 95 L 730 95"
            fill="none"
            stroke={pumpRunning ? "#f59e0b" : "#10b981"}
            strokeWidth="4.5"
            opacity="0.3"
          />
          <path
            d="M 540 95 L 730 95"
            fill="none"
            stroke={pumpRunning ? "#fbbf24" : "#34d399"}
            strokeWidth="4.5"
            strokeDasharray="10 14"
            filter={pumpRunning ? "url(#glowAmberFilter)" : "url(#glowGreenFilter)"}
            style={{ animation: "flowRight 0.7s linear infinite" }}
          />

          {/* Wire 3: Inverter -> Submersible Pump */}
          <path
            d="M 465 160 L 465 180"
            fill="none"
            stroke={pumpRunning ? "#38bdf8" : "#334155"}
            strokeWidth="3.5"
            opacity={pumpRunning ? 0.9 : 0.4}
          />
          {pumpRunning && (
            <path
              d="M 465 160 L 465 180"
              fill="none"
              stroke="#67e8f9"
              strokeWidth="3.5"
              strokeDasharray="4 6"
              style={{ animation: "flowDown 0.5s linear infinite" }}
            />
          )}

          {/* Energy Path Badges */}
          <rect x="280" y="76" width="76" height="17" rx="4" fill="#020617" stroke="#10b981" strokeWidth="1" />
          <text x="318" y="88" textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="bold">
            +485W Solar
          </text>

          <rect
            x="615"
            y="76"
            width="90"
            height="17"
            rx="4"
            fill="#020617"
            stroke={pumpRunning ? "#f59e0b" : "#10b981"}
            strokeWidth="1"
          />
          <text
            x="660"
            y="88"
            textAnchor="middle"
            fill={pumpRunning ? "#fbbf24" : "#34d399"}
            fontSize="9"
            fontWeight="bold"
          >
            {pumpRunning ? "365W to Grid" : "100% to Grid"}
          </text>
        </svg>
      </div>

      {/* Footer info note */}
      <div className="mt-2 pt-2 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-stone-400 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>
            {pumpRunning
              ? "⚡ Dynamic Load Balancing: 120W powering pump, 365W surplus exported to National Grid."
              : "✔ Standby Mode: 100% of solar generation (485W) exported directly to 33kV National Grid."}
          </span>
        </div>
        <div className="text-[11px] text-stone-500">
          Ref: SREDA Net-Metering Guidelines (2025)
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. AGRICULTURAL CADASTRAL SVG MAP ("YOUR LAND" TAB)
// Aerial layout of all 6 plots along Dharla Canal.
// Plot 5 is explicitly the 5th land with the red alert outline & Take Action button!
// ─────────────────────────────────────────────────────────────────────────────

function LandCadastralMapSvg({
  onSelectPlot5,
}: {
  onSelectPlot5: () => void;
}) {
  return (
    <div className="w-full rounded-3xl bg-white border border-stone-200 shadow-sm p-4 sm:p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
              Interactive Cadastral Layout
            </span>
            <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              6 Smallholder Parcels
            </span>
          </div>
          <p className="text-sm font-bold text-stone-800 mt-0.5">
            Kurigram Dharla Canal Agri-Corridor (AWD Network)
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs text-stone-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-emerald-500" />
            <span>Optimal (AWD OK)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-amber-400" />
            <span>Standby / Moderate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-red-500 animate-pulse" />
            <span className="font-bold text-red-700">Land 5 Deficit (Action Req.)</span>
          </div>
        </div>
      </div>

      {/* Cadastral Map SVG */}
      <div className="w-full overflow-x-auto">
        <svg
          viewBox="0 0 880 340"
          className="w-full min-w-[700px] h-auto select-none font-sans"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="canalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>

            <pattern id="cropRows" width="12" height="12" patternUnits="userSpaceOnUse">
              <line x1="0" y1="6" x2="12" y2="6" stroke="#10b981" strokeWidth="1" opacity="0.25" />
            </pattern>

            <pattern id="drySoilPattern" width="16" height="16" patternUnits="userSpaceOnUse">
              <path d="M0 0 L16 16 M16 0 L0 16" stroke="#ef4444" strokeWidth="0.8" opacity="0.25" />
            </pattern>
          </defs>

          {/* Background Soil Landscape */}
          <rect x="0" y="0" width="880" height="340" rx="16" fill="#fdfcfb" />

          {/* ──────────────── Public Canal on Left Margin ───────────────────── */}
          <rect x="20" y="20" width="60" height="300" rx="10" fill="url(#canalGradient)" />
          {/* Water wave text */}
          <g transform="translate(55, 170) rotate(-90)">
            <text textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold" letterSpacing="2">
              DHARLA PUBLIC IRRIGATION CANAL (SOLAR CANOPY)
            </text>
          </g>

          {/* Canal Lateral Feeder Pipe Channel */}
          <rect x="80" y="160" width="30" height="20" fill="#0284c7" opacity="0.8" />
          <line x1="110" y1="40" x2="110" y2="300" stroke="#0284c7" strokeWidth="4" strokeDasharray="4 4" />
          <text x="115" y="320" fill="#0369a1" fontSize="9" fontWeight="bold">
            6-Way Solenoid Valve Feeder
          </text>

          {/* ──────────────── 6 Agricultural Plots ──────────────────────────── */}

          {/* ROW 1: PLOTS 1, 2, 3 */}
          {/* Plot 1 (A-1) */}
          <g transform="translate(130, 30)">
            <rect
              x="0"
              y="0"
              width="230"
              height="130"
              rx="12"
              fill="#ecfdf5"
              stroke="#10b981"
              strokeWidth="1.5"
            />
            <rect x="0" y="0" width="230" height="130" rx="12" fill="url(#cropRows)" />
            <text x="15" y="25" fill="#065f46" fontSize="13" fontWeight="bold">
              Plot 1: A-1 (10 Decimal)
            </text>
            <text x="15" y="42" fill="#047857" fontSize="10">
              Farmer: Abdul Gafur • Boro Rice
            </text>
            <rect x="15" y="55" width="85" height="22" rx="11" fill="#d1fae5" />
            <text x="57" y="70" textAnchor="middle" fill="#065f46" fontSize="10" fontWeight="bold">
              Moisture: 52%
            </text>
            <rect x="108" y="55" width="85" height="22" rx="11" fill="#e0f2fe" />
            <text x="150" y="70" textAnchor="middle" fill="#0369a1" fontSize="10" fontWeight="bold">
              AWD: -4 cm
            </text>
            <text x="15" y="102" fill="#059669" fontSize="10" fontWeight="semibold">
              ✔ Standby — Moisture Adequate
            </text>
            <text x="15" y="118" fill="#9ca3af" fontSize="9">
              GPS: 25.8154°N, 89.6321°E
            </text>
          </g>

          {/* Plot 2 (A-2) */}
          <g transform="translate(380, 30)">
            <rect
              x="0"
              y="0"
              width="230"
              height="130"
              rx="12"
              fill="#ecfdf5"
              stroke="#10b981"
              strokeWidth="1.5"
            />
            <rect x="0" y="0" width="230" height="130" rx="12" fill="url(#cropRows)" />
            <text x="15" y="25" fill="#065f46" fontSize="13" fontWeight="bold">
              Plot 2: A-2 (10 Decimal)
            </text>
            <text x="15" y="42" fill="#047857" fontSize="10">
              Farmer: Rezaul Karim • Boro Rice
            </text>
            <rect x="15" y="55" width="85" height="22" rx="11" fill="#d1fae5" />
            <text x="57" y="70" textAnchor="middle" fill="#065f46" fontSize="10" fontWeight="bold">
              Moisture: 48%
            </text>
            <rect x="108" y="55" width="85" height="22" rx="11" fill="#e0f2fe" />
            <text x="150" y="70" textAnchor="middle" fill="#0369a1" fontSize="10" fontWeight="bold">
              AWD: -6 cm
            </text>
            <text x="15" y="102" fill="#059669" fontSize="10" fontWeight="semibold">
              ✔ Standby — Table Intact
            </text>
            <text x="15" y="118" fill="#9ca3af" fontSize="9">
              GPS: 25.8151°N, 89.6328°E
            </text>
          </g>

          {/* Plot 3 (A-3) */}
          <g transform="translate(630, 30)">
            <rect
              x="0"
              y="0"
              width="230"
              height="130"
              rx="12"
              fill="#f0fdf4"
              stroke="#059669"
              strokeWidth="1.5"
            />
            <rect x="0" y="0" width="230" height="130" rx="12" fill="url(#cropRows)" />
            <text x="15" y="25" fill="#065f46" fontSize="13" fontWeight="bold">
              Plot 3: A-3 (10 Decimal)
            </text>
            <text x="15" y="42" fill="#047857" fontSize="10">
              Farmer: Mofiz Uddin • Boro Rice
            </text>
            <rect x="15" y="55" width="85" height="22" rx="11" fill="#d1fae5" />
            <text x="57" y="70" textAnchor="middle" fill="#065f46" fontSize="10" fontWeight="bold">
              Moisture: 68%
            </text>
            <rect x="108" y="55" width="85" height="22" rx="11" fill="#dbeafe" />
            <text x="150" y="70" textAnchor="middle" fill="#1e40af" fontSize="10" fontWeight="bold">
              AWD: +3 cm
            </text>
            <text x="15" y="102" fill="#0284c7" fontSize="10" fontWeight="semibold">
              ✔ Satisfied — Watered 2d Ago
            </text>
            <text x="15" y="118" fill="#9ca3af" fontSize="9">
              GPS: 25.8148°N, 89.6335°E
            </text>
          </g>

          {/* ROW 2: PLOTS 4, 5 (CRITICAL), 6 */}
          {/* Plot 4 (B-1) */}
          <g transform="translate(130, 180)">
            <rect
              x="0"
              y="0"
              width="230"
              height="140"
              rx="12"
              fill="#fffbeb"
              stroke="#f59e0b"
              strokeWidth="1.5"
            />
            <text x="15" y="25" fill="#92400e" fontSize="13" fontWeight="bold">
              Plot 4: B-1 (10 Decimal)
            </text>
            <text x="15" y="42" fill="#b45309" fontSize="10">
              Farmer: Anowar Hossain • Boro Rice
            </text>
            <rect x="15" y="55" width="85" height="22" rx="11" fill="#fef3c7" />
            <text x="57" y="70" textAnchor="middle" fill="#b45309" fontSize="10" fontWeight="bold">
              Moisture: 42%
            </text>
            <rect x="108" y="55" width="85" height="22" rx="11" fill="#fed7aa" />
            <text x="150" y="70" textAnchor="middle" fill="#c2410c" fontSize="10" fontWeight="bold">
              AWD: -8 cm
            </text>
            <text x="15" y="102" fill="#d97706" fontSize="10" fontWeight="semibold">
              ⏳ Moderate — Queued in 48h
            </text>
            <text x="15" y="122" fill="#9ca3af" fontSize="9">
              GPS: 25.8145°N, 89.6342°E
            </text>
          </g>

          {/* ──────────────── PLOT 5 (5TH LAND): CRITICAL DEFICIT & ACTION ──── */}
          <g
            transform="translate(380, 180)"
            className="cursor-pointer group"
            onClick={onSelectPlot5}
          >
            {/* Pulsing red beacon halo */}
            <rect
              x="-4"
              y="-4"
              width="238"
              height="148"
              rx="16"
              fill="none"
              stroke="#ef4444"
              strokeWidth="2.5"
              className="animate-pulse"
            />
            {/* Card Body */}
            <rect
              x="0"
              y="0"
              width="230"
              height="140"
              rx="12"
              fill="#fef2f2"
              stroke="#dc2626"
              strokeWidth="2"
            />
            <rect x="0" y="0" width="230" height="140" rx="12" fill="url(#drySoilPattern)" />

            {/* Header */}
            <text x="15" y="24" fill="#991b1b" fontSize="13" fontWeight="900">
              ★ Plot 5: B-2 (5th Land)
            </text>
            <text x="15" y="40" fill="#b91c1c" fontSize="10" fontWeight="bold">
              Farmer: Nurul Islam • Panicle Stage
            </text>

            {/* Critical Metrics */}
            <rect x="15" y="50" width="90" height="22" rx="11" fill="#fee2e2" />
            <text x="60" y="65" textAnchor="middle" fill="#b91c1c" fontSize="10" fontWeight="900">
              Moisture: 24% ⚠
            </text>
            <rect x="110" y="50" width="105" height="22" rx="11" fill="#fecaca" />
            <text x="162" y="65" textAnchor="middle" fill="#991b1b" fontSize="10" fontWeight="900">
              AWD: -15 cm (CRITICAL)
            </text>

            <text x="15" y="90" fill="#dc2626" fontSize="10" fontWeight="black">
              GeoAI Alert: Irrigate Immediately!
            </text>

            {/* TAKE ACTION BUTTON (Embedded inside the 5th land) */}
            <rect
              x="15"
              y="102"
              width="200"
              height="28"
              rx="8"
              fill="#064e3b"
              className="transition-all duration-300 hover:opacity-90"
            />
            <text
              x="115"
              y="120"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="11"
              fontWeight="900"
              letterSpacing="0.5"
            >
              ⚡ TAKE ACTION → (IRRIGATE)
            </text>
          </g>

          {/* Plot 6 (B-3) */}
          <g transform="translate(630, 180)">
            <rect
              x="0"
              y="0"
              width="230"
              height="140"
              rx="12"
              fill="#ecfdf5"
              stroke="#10b981"
              strokeWidth="1.5"
            />
            <rect x="0" y="0" width="230" height="130" rx="12" fill="url(#cropRows)" />
            <text x="15" y="25" fill="#065f46" fontSize="13" fontWeight="bold">
              Plot 6: B-3 (10 Decimal)
            </text>
            <text x="15" y="42" fill="#047857" fontSize="10">
              Farmer: Shah Alam • Boro Rice
            </text>
            <rect x="15" y="55" width="85" height="22" rx="11" fill="#d1fae5" />
            <text x="57" y="70" textAnchor="middle" fill="#065f46" fontSize="10" fontWeight="bold">
              Moisture: 58%
            </text>
            <rect x="108" y="55" width="85" height="22" rx="11" fill="#e0f2fe" />
            <text x="150" y="70" textAnchor="middle" fill="#0369a1" fontSize="10" fontWeight="bold">
              AWD: -2 cm
            </text>
            <text x="15" y="102" fill="#059669" fontSize="10" fontWeight="semibold">
              ✔ Standby — Moisture Satisfied
            </text>
            <text x="15" y="122" fill="#9ca3af" fontSize="9">
              GPS: 25.8139°N, 89.6356°E
            </text>
          </g>
        </svg>
      </div>

      <div className="bg-amber-50 rounded-2xl p-3.5 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">5th Land (Plot 5 / B-2) Action Required:</span>{" "}
          Field AWD perforated tube has receded to <strong>−15 cm</strong> below the soil surface (the critical threshold established by BRRI).
          Click <strong>Take Action</strong> to open the precision GeoAI irrigation controller.
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. DYNAMIC PADDY FIELD AWD SOIL CROSS-SECTION SVG ("TAKE ACTION" VIEW)
// Shows: Canal Submersible Pump → Soil Layers → Rice Plants → Rising Water Level
// AWD Perforated Pipe Gauge dynamically reflects root-zone hydration!
// ─────────────────────────────────────────────────────────────────────────────

function FieldCrossSectionSvg({
  fillPct,
  animatedPct,
  pumpRunning,
  chosenDuration,
}: {
  fillPct: number;
  animatedPct: number;
  pumpRunning: boolean;
  chosenDuration: DurationOption | null;
}) {
  // Water height in pixels inside field basin (max 85px depth)
  const maxWaterHeight = 85;
  const currentWaterPx = (animatedPct / 100) * maxWaterHeight;
  const targetWaterPx = (fillPct / 100) * maxWaterHeight;

  // AWD tube level interpolates from -15cm up to +4cm (or chosen depth)
  const targetDepthCm = chosenDuration?.depthCm ?? 4;
  const currentAwdCm = -15 + (animatedPct / 100) * (15 + targetDepthCm);

  // Moisture interpolates from 24% to 68%
  const currentMoisture = Math.round(24 + (animatedPct / 100) * 44);

  return (
    <div className="w-full rounded-3xl bg-white border border-stone-200 shadow-md p-4 sm:p-6 space-y-4">
      {/* Title & Realtime Readouts */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-700">
              Live Field Cross-Section
            </span>
            {pumpRunning && (
              <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2.5 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                <Droplets className="w-3 h-3 text-sky-600" />
                PUMP ACTIVE (120W)
              </span>
            )}
          </div>
          <h3 className="text-lg font-black text-stone-900 mt-0.5">
            Plot 5: AWD Infiltration & Basin Flooding
          </h3>
        </div>

        {/* Live Gauges */}
        <div className="flex items-center gap-3">
          {/* Moisture Gauge */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl px-3 py-1.5 text-center">
            <span className="text-[10px] font-bold text-stone-400 uppercase block">
              Root Moisture
            </span>
            <span
              className={`text-base font-black ${currentMoisture >= 50 ? "text-emerald-600" : "text-amber-600"
                }`}
            >
              {currentMoisture}%
            </span>
          </div>

          {/* AWD Tube Reading */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl px-3 py-1.5 text-center">
            <span className="text-[10px] font-bold text-stone-400 uppercase block">
              AWD Tube Level
            </span>
            <span
              className={`text-base font-black ${currentAwdCm >= 0 ? "text-emerald-600" : "text-red-500"
                }`}
            >
              {currentAwdCm > 0 ? `+${currentAwdCm.toFixed(1)}` : currentAwdCm.toFixed(1)} cm
            </span>
          </div>

          {/* Water Volume Delivered */}
          <div className="bg-sky-50 border border-sky-200 rounded-2xl px-3 py-1.5 text-center">
            <span className="text-[10px] font-bold text-sky-700 uppercase block">
              Discharge
            </span>
            <span className="text-base font-black text-sky-800 tabular-nums">
              {Math.round((animatedPct / 100) * (chosenDuration?.litres ?? 420))} L
            </span>
          </div>
        </div>
      </div>

      {/* SVG Interactive Cutaway View */}
      <div className="w-full overflow-x-auto">
        <svg
          viewBox="0 0 880 320"
          className="w-full min-w-[720px] h-auto select-none font-sans"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Water gradient */}
            <linearGradient id="paddyWaterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.95" />
            </linearGradient>

            {/* Topsoil Gradient */}
            <linearGradient id="topsoilGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#78350f" />
              <stop offset="100%" stopColor="#451a03" />
            </linearGradient>

            {/* Subsoil Hardpan Gradient */}
            <linearGradient id="hardpanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#57534e" />
              <stop offset="100%" stopColor="#292524" />
            </linearGradient>

            {/* Infiltration Wet Zone Gradient */}
            <radialGradient id="wetPlume" cx="50%" cy="0%" r="80%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.5" />
              <stop offset="70%" stopColor="#1e3a8a" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#451a03" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* ──────────────── 1. Irrigation Canal on Left Cutaway ─────────────── */}
          <rect x="20" y="80" width="120" height="220" rx="8" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="2" />
          {/* Canal Water Pool */}
          <rect x="25" y="120" width="110" height="175" rx="6" fill="#0284c7" opacity="0.85" />
          <text x="80" y="110" textAnchor="middle" fill="#0369a1" fontSize="11" fontWeight="bold">
            Public Canal
          </text>

          {/* Submersible Pump in Canal Pool */}
          <g transform="translate(45, 170)">
            <rect
              x="0"
              y="0"
              width="60"
              height="75"
              rx="8"
              fill={pumpRunning ? "#0f172a" : "#334155"}
              stroke={pumpRunning ? "#38bdf8" : "#64748b"}
              strokeWidth="2"
            />
            {/* Pump Grille */}
            <line x1="10" y1="50" x2="50" y2="50" stroke="#38bdf8" strokeWidth="1.5" />
            <line x1="10" y1="56" x2="50" y2="56" stroke="#38bdf8" strokeWidth="1.5" />
            <line x1="10" y1="62" x2="50" y2="62" stroke="#38bdf8" strokeWidth="1.5" />

            <text x="30" y="30" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
              SOLARIQ
            </text>
            <text x="30" y="42" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="bold">
              {pumpRunning ? "120W ON" : "STANDBY"}
            </text>
          </g>

          {/* Water Delivery Pipe spanning Canal to Field Basin */}
          <path
            d="M 75 170 L 75 60 L 190 60 L 190 145"
            fill="none"
            stroke={pumpRunning ? "#0284c7" : "#64748b"}
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 75 170 L 75 60 L 190 60 L 190 145"
            fill="none"
            stroke={pumpRunning ? "#38bdf8" : "#94a3b8"}
            strokeWidth="4"
            strokeDasharray={pumpRunning ? "8 6" : "none"}
            style={pumpRunning ? { animation: "flowRight 0.6s linear infinite" } : undefined}
          />

          {/* Water Gushing Stream from Nozzle if Running */}
          {pumpRunning && (
            <g transform="translate(190, 145)">
              <path
                d="M 0 0 C 15 25 35 45 60 55"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="5"
                strokeLinecap="round"
                className="animate-pulse"
              />
              {/* Splashing spray particles */}
              <circle cx="65" cy="55" r="4" fill="#38bdf8" className="animate-ping" />
              <circle cx="50" cy="45" r="2.5" fill="#7dd3fc" />
              <circle cx="70" cy="50" r="3" fill="#bae6fd" />
            </g>
          )}

          {/* ──────────────── 2. Field Basin & Soil Strata ─────────────────────── */}
          {/* Topsoil Clay-Loam Layer (y: 190 to 250) */}
          <rect x="160" y="190" width="570" height="60" fill="url(#topsoilGrad)" />
          {/* Subsoil Hardpan Layer (Perched Table Barrier) (y: 250 to 300) */}
          <rect x="160" y="250" width="570" height="50" rx="4" fill="url(#hardpanGrad)" />
          <text x="175" y="275" fill="#a8a29e" fontSize="9" fontWeight="bold">
            Impermeable Hardpan Layer (Retains Perched AWD Water Table)
          </text>
          <text x="175" y="215" fill="#d6d3d1" fontSize="9" fontWeight="bold">
            Root Zone (0 to 15 cm Soil Depth)
          </text>

          {/* Wet Infiltration Plume if water is present */}
          {animatedPct > 0 && (
            <ellipse
              cx="450"
              cy="200"
              rx="270"
              ry={(animatedPct / 100) * 45}
              fill="url(#wetPlume)"
            />
          )}

          {/* Fibrous Rice Root Systems Underground */}
          {[260, 340, 420, 500, 580, 660].map((x, i) => (
            <g key={i} transform={`translate(${x}, 190)`}>
              <path
                d="M 0 0 Q -10 20 -15 35 M 0 0 Q 5 22 10 38 M 0 0 Q -3 15 -5 45 M 0 0 Q 8 18 18 30"
                fill="none"
                stroke={animatedPct > 30 ? "#fef08a" : "#ca8a04"}
                strokeWidth="1.2"
                opacity="0.8"
              />
            </g>
          ))}

          {/* ──────────────── 3. Standing Ponding Water Layer ─────────────────── */}
          {animatedPct > 0 && (
            <g>
              <rect
                x="160"
                y={190 - currentWaterPx}
                width="570"
                height={currentWaterPx}
                fill="url(#paddyWaterGrad)"
                opacity="0.8"
              />
              {/* Water surface ripples */}
              {pumpRunning && (
                <path
                  d={`M 160 ${190 - currentWaterPx} Q 220 ${188 - currentWaterPx} 280 ${190 - currentWaterPx
                    } T 400 ${190 - currentWaterPx} T 520 ${190 - currentWaterPx} T 640 ${190 - currentWaterPx
                    } T 730 ${190 - currentWaterPx}`}
                  fill="none"
                  stroke="#e0f2fe"
                  strokeWidth="2"
                  opacity="0.9"
                />
              )}
            </g>
          )}

          {/* Optimal Target Depth Line (+4 cm target) */}
          <line
            x1="160"
            y1={190 - targetWaterPx}
            x2="730"
            y2={190 - targetWaterPx}
            stroke="#10b981"
            strokeWidth="1.8"
            strokeDasharray="5 4"
          />
          <rect
            x="615"
            y={190 - targetWaterPx - 16}
            width="110"
            height="16"
            rx="4"
            fill="#064e3b"
          />
          <text
            x="670"
            y={190 - targetWaterPx - 4}
            textAnchor="middle"
            fill="#a7f3d0"
            fontSize="9"
            fontWeight="bold"
          >
            ★ TARGET DEPTH (+4 cm)
          </text>

          {/* ──────────────── 4. Lush Boro Rice Tillers ───────────────────────── */}
          {[260, 340, 420, 500, 580, 660].map((x, i) => {
            const isLush = animatedPct > 25;
            return (
              <g key={i} transform={`translate(${x}, 190)`}>
                <path
                  d="M 0 0 C -15 -35 -25 -65 -35 -80 M 0 0 C -8 -45 -10 -75 -12 -95 M 0 0 C 0 -50 0 -80 0 -100 M 0 0 C 8 -45 10 -75 12 -95 M 0 0 C 15 -35 25 -65 35 -80"
                  fill="none"
                  stroke={isLush ? "#15803d" : "#84cc16"}
                  strokeWidth={isLush ? "2.5" : "2"}
                  strokeLinecap="round"
                />
                <circle cx="-12" cy="-95" r="2" fill="#eab308" />
                <circle cx="0" cy="-100" r="2" fill="#eab308" />
                <circle cx="12" cy="-95" r="2" fill="#eab308" />
              </g>
            );
          })}

          {/* ──────────────── 5. AWD Perforated Observation Pipe (Right Side) ─── */}
          <g transform="translate(745, 90)">
            <rect
              x="0"
              y="20"
              width="45"
              height="190"
              rx="4"
              fill="#f8fafc"
              stroke="#0284c7"
              strokeWidth="2"
              opacity="0.9"
            />
            {/* Perforation holes in soil zone */}
            {[105, 120, 135, 150, 165, 180, 195].map((y, idx) => (
              <g key={idx}>
                <circle cx="8" cy={y} r="2" fill="#64748b" />
                <circle cx="22" cy={y} r="2" fill="#64748b" />
                <circle cx="37" cy={y} r="2" fill="#64748b" />
              </g>
            ))}

            {/* Internal Water Level inside AWD Pipe */}
            {(() => {
              const startY = 175; // -15cm
              const targetY = 80; // +4cm
              const currentY = startY - (animatedPct / 100) * (startY - targetY);
              const waterHeight = 210 - currentY;
              return (
                <rect
                  x="2"
                  y={currentY}
                  width="41"
                  height={Math.max(0, waterHeight)}
                  rx="2"
                  fill="#0284c7"
                  opacity="0.8"
                />
              );
            })()}

            {/* Scale Markings */}
            <line x1="0" y1="75" x2="10" y2="75" stroke="#059669" strokeWidth="1.5" />
            <text x="48" y="78" fill="#059669" fontSize="8" fontWeight="bold">
              +5 cm
            </text>
            <line x1="0" y1="100" x2="15" y2="100" stroke="#0f172a" strokeWidth="2" />
            <text x="48" y="103" fill="#0f172a" fontSize="8" fontWeight="bold">
              0 cm (Surface)
            </text>
            <line x1="0" y1="125" x2="10" y2="125" stroke="#64748b" strokeWidth="1" />
            <text x="48" y="128" fill="#64748b" fontSize="8">
              -5 cm
            </text>
            <line x1="0" y1="150" x2="10" y2="150" stroke="#f59e0b" strokeWidth="1" />
            <text x="48" y="153" fill="#b45309" fontSize="8">
              -10 cm
            </text>
            <line x1="0" y1="175" x2="15" y2="175" stroke="#dc2626" strokeWidth="2" strokeDasharray="2 2" />
            <text x="48" y="178" fill="#dc2626" fontSize="8" fontWeight="bold">
              -15 cm (ALERT)
            </text>

            <text x="22" y="12" textAnchor="middle" fill="#0369a1" fontSize="9" fontWeight="black">
              AWD TUBE
            </text>
          </g>
        </svg>
      </div>

      {/* Progress & Target Fill Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-stone-600 font-semibold">
          <span>Field Hydration Progress</span>
          <span className="font-bold text-sky-700">
            {Math.round(animatedPct)}% of {fillPct}% target fill
          </span>
        </div>
        <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full transition-all duration-300"
            style={{ width: `${(animatedPct / fillPct) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. VERIFIED SAVINGS MODAL
// Referencing calculations.docx & SolariQ_Executive_Pitch_Handout.md
// Displays time saved, water saved, surplus grid export, and methane avoidance.
// ─────────────────────────────────────────────────────────────────────────────

function VerifiedSavingsModal({
  chosenMin,
  prevYearMin,
  onClose,
}: {
  chosenMin: number;
  prevYearMin: number;
  onClose: () => void;
}) {
  const timeSavedMin = Math.max(0, prevYearMin - chosenMin);
  const waterSavedLitres = timeSavedMin * 42; // 42 L/min pump discharge
  const surplusKwh = parseFloat(((timeSavedMin * 120) / (60 * 1000)).toFixed(3)); // 120W pump freed to grid
  const dieselSavedTk = Math.round(timeSavedMin * 6.5); // BDT avoided diesel cost

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-lg p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  AWD Precision Cycle Complete
                </span>
              </div>
              <h2 className="text-xl font-black text-stone-900 mt-0.5">
                Plot 5 Irrigation & Savings Impact
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Time Savings Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-950 text-white p-5 shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-emerald-500/10 blur-xl pointer-events-none" />
          <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-300 mb-1">
            Verified Runtime Reduction
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-emerald-300">
              {timeSavedMin} Minutes
            </span>
            <span className="text-sm font-semibold text-emerald-100">
              Saved per session!
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-xs border-t border-emerald-800/80 pt-3">
            <div>
              <span className="text-emerald-300 block">Farmer Habitual Time:</span>
              <strong className="text-white text-sm">{prevYearMin} min</strong>
            </div>
            <div>
              <span className="text-emerald-300 block">SolariQ GeoAI AWD:</span>
              <strong className="text-emerald-300 text-sm">{chosenMin} min</strong>
            </div>
          </div>
        </div>

        {/* 4 Comparative Benefit Cards */}
        <div className="grid grid-cols-2 gap-3">
          {/* Card 1: Water Saved */}
          <div className="rounded-2xl bg-sky-50 border border-sky-100 p-3.5">
            <div className="flex items-center gap-2 mb-1 text-sky-700">
              <Droplets className="w-4 h-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider">
                Water Conserved
              </span>
            </div>
            <p className="text-2xl font-black text-sky-900">{waterSavedLitres} L</p>
            <p className="text-[10px] text-sky-600 mt-0.5">
              Prevents deep percolation & perched table flooding
            </p>
          </div>

          {/* Card 2: Clean Solar Grid Export */}
          <div className="rounded-2xl bg-amber-50 border border-amber-100 p-3.5">
            <div className="flex items-center gap-2 mb-1 text-amber-700">
              <Zap className="w-4 h-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider">
                Surplus Grid Export
              </span>
            </div>
            <p className="text-2xl font-black text-amber-900">+{timeSavedMin} min</p>
            <p className="text-[10px] text-amber-600 mt-0.5">
              100% solar diverted to 33kV National Grid
            </p>
          </div>

          {/* Card 3: Methane Cut */}
          <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-3.5">
            <div className="flex items-center gap-2 mb-1 text-emerald-700">
              <Leaf className="w-4 h-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider">
                Rice Methane
              </span>
            </div>
            <p className="text-2xl font-black text-emerald-900">−35% CH₄</p>
            <p className="text-[10px] text-emerald-600 mt-0.5">
              Aerobic-anaerobic AWD cycling (BRRI, 2020)
            </p>
          </div>

          {/* Card 4: Economic Value */}
          <div className="rounded-2xl bg-purple-50 border border-purple-100 p-3.5">
            <div className="flex items-center gap-2 mb-1 text-purple-700">
              <TrendingUp className="w-4 h-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider">
                Cost Avoided
              </span>
            </div>
            <p className="text-2xl font-black text-purple-900">৳{dieselSavedTk}</p>
            <p className="text-[10px] text-purple-600 mt-0.5">
              Diesel displacement & SREDA Net-Metering credit
            </p>
          </div>
        </div>

        {/* Official Reference Footer */}
        <div className="rounded-xl bg-stone-50 border border-stone-200 p-3 text-[11px] text-stone-500 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-stone-700">
            <Info className="w-3.5 h-3.5 text-stone-400" />
            <span>Official Government Benchmark:</span>
          </div>
          <p>
            Based on Department of Environment Grid Emission Factor (<strong>0.62 tCO₂/MWh</strong>, Jan 2025)
            and BRRI Alternate Wetting & Drying field trials. Pumping stopped early frees clean solar for the National Grid!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-2xl bg-stone-100 text-stone-700 font-bold hover:bg-stone-200 transition-colors text-sm"
          >
            Close
          </button>
          <Link
            href="/report"
            className="flex-1 py-3.5 rounded-2xl bg-emerald-950 text-white font-bold hover:bg-emerald-800 transition-colors shadow-md text-sm flex items-center justify-center gap-1.5"
          >
            <span>Open Seasonal Report</span>
            <ChevronRight className="w-4 h-4 text-emerald-300" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PROTO CONTROLLER PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function ProtoPage() {
  const [tab, setTab] = useState<"land" | "action">("land");
  const [selectedPlot, setSelectedPlot] = useState<PlotItem | null>(PLOTS[4]); // Defaults to Plot 5 (5th land)
  const [chosenDuration, setChosenDuration] = useState<DurationOption | null>(DURATION_OPTIONS[0]); // 10 min
  const [espOnline, setEspOnline] = useState(false);
  const [pumpRunning, setPumpRunning] = useState(false);
  const [animatedFill, setAnimatedFill] = useState(0);
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const [showModal, setShowModal] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  // Poll ESP status API
  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/proto/status", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setEspOnline(Boolean(data.online));
        setLastRefresh(new Date());
        if (data.status?.running) {
          setPumpRunning(true);
        } else if (pumpRunning) {
          setPumpRunning(false);
        }
      }
    } catch {
      // Offline or network error handled gracefully
    }
  }, [pumpRunning]);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  // Handle Action Trigger on Plot 5
  const handleSelectPlot5 = () => {
    setSelectedPlot(PLOTS[4]);
    setTab("action");
    setPhase("idle");
    setAnimatedFill(0);
  };

  // Handle Approve Pump Action
  const handleApprovePump = async () => {
    if (!chosenDuration) return;
    setPhase("running");
    setPumpRunning(true);
    setAnimatedFill(0);

    // Send command to ESP via API
    try {
      await fetch("/api/proto/commands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plotId: 5,
          durationMin: chosenDuration.min,
        }),
      });
    } catch {
      // Local fallback continues smoothly
    }

    // Animate filling process (in ~10 seconds so judges & users see the live filling cycle)
    const target = chosenDuration.fillPct;
    let current = 0;
    const step = target / 100; // 100 steps over 10 seconds
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(interval);
        setAnimatedFill(target);
        setPhase("done");
        setPumpRunning(false);
        setShowModal(true);
      } else {
        setAnimatedFill(current);
      }
    }, 100);
  };

  const handleReset = () => {
    setPhase("idle");
    setAnimatedFill(0);
    setPumpRunning(false);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-stone-900 pb-16">
      {/* ── Dynamic Injected CSS Keyframes ── */}
      <style>{`
        @keyframes flowRight {
          from { stroke-dashoffset: 24; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes flowDown {
          from { stroke-dashoffset: 12; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

      {/* ── Clean Navbar (No broken top LED) ─────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#f7f7f5]/90 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-600 hover:text-stone-900 hover:border-stone-300 transition-all shadow-sm"
              title="Return to Home"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-950 text-white font-black text-xs flex items-center justify-center shadow-sm">
                SQ
              </div>
              <span className="font-extrabold text-base text-stone-900 tracking-tight">
                SolariQ
              </span>
              <span className="text-stone-300 text-sm">/</span>
              <span className="text-xs sm:text-sm font-semibold text-stone-600">
                GeoAI Irrigation Controller
              </span>
            </div>
          </div>

          {/* Right Side: Seasonal Report Link + ESP Badge + Refresh */}
          <div className="flex items-center gap-2">
            <Link
              href="/report"
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-900 text-white hover:bg-emerald-800 transition-all shadow-sm"
              title="View Year-Round 365-Day Seasonal Report"
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-300" />
              <span>Seasonal Report</span>
            </Link>

            <button
              onClick={fetchStatus}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${espOnline
                  ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-sm shadow-emerald-100"
                  : "bg-white border-stone-200 text-stone-600 hover:border-stone-300"
                }`}
              title="Click to ping ESP8266 controller"
            >
              {espOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                  <span>ESP Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-stone-400" />
                  <span>ESP Offline (Sim)</span>
                </>
              )}
              <RefreshCw className="w-3 h-3 ml-0.5 opacity-60 hover:opacity-100" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content Container ───────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-4 pt-6 space-y-6">
        {/* Title & Location Context */}
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Kurigram Dharla Canal Controller
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Dharla River Reach • 6 Smallholder Boro Rice Plots • SREDA AWD Grid Nexus</span>
            </p>
          </div>

          {lastRefresh && (
            <span className="text-[11px] text-stone-400">
              Refreshed {Math.floor((Date.now() - lastRefresh.getTime()) / 1000)}s ago
            </span>
          )}
        </div>

        {/* ── 1. National Grid Flow (Animated SVG with integrated D6 LED) ── */}
        <section>
          <NationalGridSvg pumpRunning={pumpRunning} espOnline={espOnline} />
        </section>

        {/* ── Tab Switcher: "Your Land" | "Take Action" ─────────────────── */}
        <div className="flex rounded-2xl bg-stone-200/70 p-1.5 gap-1.5">
          <button
            onClick={() => setTab("land")}
            className={`flex-1 py-3 rounded-xl text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${tab === "land"
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-600 hover:text-stone-900"
              }`}
          >
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>Your Land (6 Plots Overview)</span>
          </button>

          <button
            onClick={() => setTab("action")}
            className={`flex-1 py-3 rounded-xl text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${tab === "action"
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-600 hover:text-stone-900"
              }`}
          >
            <Sparkles className="w-4 h-4 text-red-500 animate-pulse" />
            <span>Take Action (Plot 5 Irrigation)</span>
          </button>
        </div>

        {/* ── TAB 1: YOUR LAND (Interactive Cadastral SVG + Plot Cards) ── */}
        {tab === "land" && (
          <div className="space-y-6">
            {/* Visual Cadastral Map SVG */}
            <LandCadastralMapSvg onSelectPlot5={handleSelectPlot5} />

            {/* Individual Plot Cards List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500">
                  Individual Parcel Data (6 Plots)
                </h3>
                <span className="text-xs text-stone-400">
                  Click Plot 5 to trigger GeoAI irrigation
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {PLOTS.map((plot) => {
                  const is5th = plot.plotNumber === 5;
                  const isCritical = plot.status === "critical";

                  return (
                    <div
                      key={plot.id}
                      className={`rounded-2xl border p-4 transition-all duration-300 relative ${is5th
                          ? "bg-red-50/60 border-red-300 ring-2 ring-red-400/40 shadow-sm"
                          : "bg-white border-stone-200 hover:border-stone-300"
                        }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-extrabold text-stone-900 text-base">
                              {plot.name}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${isCritical
                                  ? "bg-red-100 text-red-700 border border-red-300"
                                  : plot.status === "moderate"
                                    ? "bg-amber-100 text-amber-700 border border-amber-300"
                                    : "bg-emerald-100 text-emerald-700 border border-emerald-300"
                                }`}
                            >
                              {plot.status}
                            </span>
                            {is5th && (
                              <span className="text-[10px] font-black bg-red-600 text-white px-2 py-0.5 rounded-full animate-pulse">
                                5TH NO LAND
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-stone-500 mt-0.5">
                            {plot.owner} • {plot.crop}
                          </p>
                          <p className="text-xs text-stone-400 mt-0.5">
                            Area: {plot.area} • GPS: {plot.lat}, {plot.lng}
                          </p>
                        </div>

                        {/* 5th land prominent Take Action Button */}
                        {is5th && (
                          <button
                            onClick={handleSelectPlot5}
                            className="shrink-0 px-4 py-2 rounded-xl bg-emerald-950 text-white text-xs font-bold hover:bg-emerald-800 active:scale-95 transition-all shadow-md flex items-center gap-1"
                          >
                            <span>Take Action</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* AWD & Moisture Level */}
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs border-t border-stone-100 pt-2.5">
                        <div className="bg-stone-50/80 rounded-xl p-2 border border-stone-100">
                          <span className="text-[10px] text-stone-400 uppercase font-semibold block">
                            Soil Moisture
                          </span>
                          <span
                            className={`font-black text-sm ${plot.moisture < 30
                                ? "text-red-600"
                                : plot.moisture < 45
                                  ? "text-amber-600"
                                  : "text-emerald-700"
                              }`}
                          >
                            {plot.moisture}%
                          </span>
                        </div>
                        <div className="bg-stone-50/80 rounded-xl p-2 border border-stone-100">
                          <span className="text-[10px] text-stone-400 uppercase font-semibold block">
                            AWD Tube Level
                          </span>
                          <span
                            className={`font-black text-sm ${plot.awdTube <= -10
                                ? "text-red-600"
                                : plot.awdTube < 0
                                  ? "text-amber-600"
                                  : "text-emerald-700"
                              }`}
                          >
                            {plot.awdTube > 0 ? `+${plot.awdTube}` : plot.awdTube} cm
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-stone-500 mt-2 italic">
                        {plot.condition}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: TAKE ACTION (Dedicated to the 5th Land / Plot 5) ──── */}
        {tab === "action" && (
          <div className="space-y-6">
            {/* Header: Land 5 Focus */}
            <div className="rounded-3xl bg-white border border-stone-200 p-5 shadow-sm space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-stone-900">
                      Plot 5: B-2 (Nurul Islam)
                    </span>
                    <span className="text-[11px] font-bold bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full border border-red-200">
                      5TH NO LAND • CRITICAL WATER DEFICIT
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    10 Decimal • Boro Rice (BRRI dhan29) • Panicle Initiation Stage
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">
                    Last Year Farmer Record
                  </span>
                  <span className="text-sm font-extrabold text-amber-600">
                    25 min habitual pumping
                  </span>
                </div>
              </div>

              {/* GeoAI Recommendation Callout */}
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                </div>
                <div className="text-xs sm:text-sm text-emerald-950 space-y-1">
                  <p className="font-extrabold text-emerald-900">
                    ★ GeoAI Recommendation: Pump for 10 Minutes (420 L)
                  </p>
                  <p className="text-emerald-800">
                    AWD water table has receded to <strong>−15 cm</strong>. Pumping 10 minutes restores optimal <strong>+4 cm</strong> ponding depth.
                    Stopping early saves <strong>15 minutes of electricity</strong>, immediately diverted to the National Grid!
                  </p>
                </div>
              </div>
            </div>

            {/* Duration Selector (Only in idle state) */}
            {phase === "idle" && (
              <div className="rounded-3xl bg-white border border-stone-200 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-stone-600">
                    Choose Pumping Duration (Plot 5 Fill %)
                  </h3>
                  <span className="text-xs text-stone-400">
                    42 L/min Solar Submersible Pump
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {DURATION_OPTIONS.map((opt) => {
                    const isSelected = chosenDuration?.min === opt.min;
                    return (
                      <button
                        key={opt.min}
                        onClick={() => setChosenDuration(opt)}
                        className={`rounded-2xl p-4 text-left border-2 transition-all relative ${isSelected
                            ? "border-emerald-600 bg-emerald-50/70 shadow-sm"
                            : "border-stone-200 bg-white hover:border-stone-300"
                          }`}
                      >
                        {opt.isAiRecommended && (
                          <span className="absolute -top-2.5 right-3 bg-emerald-700 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                            ★ GeoAI Pick
                          </span>
                        )}
                        {opt.isFarmerPastHabit && (
                          <span className="absolute -top-2.5 right-3 bg-amber-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Last Year
                          </span>
                        )}
                        <p className="text-xl font-black text-stone-900">{opt.label}</p>
                        <p className="text-xs font-bold text-emerald-700 mt-1">
                          ~{opt.fillPct}% Land Full
                        </p>
                        <p className="text-[11px] text-sky-600 font-semibold mt-0.5">
                          {opt.litres} L Discharge
                        </p>
                        <p className="text-[10px] text-stone-400 mt-1">
                          +{opt.depthCm} cm water depth
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Approve Button */}
                <button
                  onClick={handleApprovePump}
                  className="w-full py-4 rounded-2xl bg-emerald-950 text-white font-extrabold text-base hover:bg-emerald-900 active:scale-[0.99] transition-all shadow-lg shadow-emerald-950/20 flex items-center justify-center gap-2"
                >
                  <Droplets className="w-5 h-5 text-emerald-400" />
                  <span>
                    Approve for Pump — Run for {chosenDuration?.min} Minutes
                  </span>
                </button>
              </div>
            )}

            {/* ── Dynamic Field Cross-Section SVG (Shows live fill & AWD Gauge) ── */}
            <FieldCrossSectionSvg
              fillPct={chosenDuration?.fillPct ?? 60}
              animatedPct={animatedFill}
              pumpRunning={phase === "running"}
              chosenDuration={chosenDuration}
            />

            {/* Reset / Run Again Button if Done */}
            {phase === "done" && (
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowModal(true)}
                  className="flex-1 py-3.5 rounded-2xl bg-white border border-stone-200 text-stone-800 font-extrabold text-sm hover:bg-stone-50 transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>Quick Savings Summary</span>
                </button>
                <Link
                  href="/report"
                  className="flex-1 py-3.5 rounded-2xl bg-emerald-950 text-white font-extrabold text-sm hover:bg-emerald-900 transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <span>Full Seasonal Report (All 4 Seasons)</span>
                  <ChevronRight className="w-4 h-4 text-emerald-400" />
                </Link>
                <button
                  onClick={handleReset}
                  className="px-6 py-3.5 rounded-2xl bg-stone-100 text-stone-700 font-bold text-sm hover:bg-stone-200 transition-colors"
                >
                  Start Over
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── Savings Modal Pop-up ───────────────────────────────────────── */}
      {showModal && chosenDuration && (
        <VerifiedSavingsModal
          chosenMin={chosenDuration.min}
          prevYearMin={25}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
