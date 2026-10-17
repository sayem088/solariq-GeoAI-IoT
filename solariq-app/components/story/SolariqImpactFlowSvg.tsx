"use client";

import React, { useState } from "react";
import { Droplets, Leaf, Zap, Shield, Sparkles, TrendingUp, CheckCircle2 } from "lucide-react";

export default function SolariqImpactFlowSvg() {
  const [activePillar, setActivePillar] = useState<"water" | "methane" | "energy" | null>(null);

  return (
    <div className="w-full bg-white rounded-3xl border border-stone-200/90 shadow-sm p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Section Sub-header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2 border-b border-stone-100">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full inline-block">
            Global Climate & Food Contribution
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 mt-1">
            How SolariQ Operates & What It Contributes to the World
          </h2>
        </div>
        <p className="text-xs text-stone-500 font-medium sm:text-right">
          A closed-loop cyber-physical framework saving water, cutting greenhouse methane, and powering rural grids
        </p>
      </div>

      {/* SVG Infographic Canvas */}
      <div className="w-full relative flex items-center justify-center select-none overflow-hidden rounded-2xl bg-gradient-to-b from-stone-50/70 via-white to-stone-50/50 border border-stone-100">
        <svg
          viewBox="0 0 1100 520"
          className="w-full h-auto max-h-[520px] object-contain"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="waterPillarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f0f9ff" />
              <stop offset="100%" stopColor="#e0f2fe" />
            </linearGradient>

            <linearGradient id="methanePillarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ecfdf5" />
              <stop offset="100%" stopColor="#d1fae5" />
            </linearGradient>

            <linearGradient id="energyPillarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fefce8" />
              <stop offset="100%" stopColor="#fef3c7" />
            </linearGradient>

            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#065f46" />
            </linearGradient>

            <filter id="svgSoftShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.07" />
            </filter>
          </defs>

          {/* ============================================================== */}
          {/* CONNECTING CROSS-SYNERGY FLOW ARROWS */}
          {/* ============================================================== */}
          {/* Line 1 -> 2: Shaded Water cools PV and feeds DC Pump */}
          <path
            d="M 330 240 C 370 200, 390 200, 420 240"
            stroke="#0284c7"
            strokeWidth="2.5"
            strokeDasharray="6,4"
            fill="none"
            className="pipe-water-active"
          />
          {/* Line 2 -> 3: 10-Minute Shutoff diverts 100% clean power to Grid */}
          <path
            d="M 680 240 C 720 200, 740 200, 770 240"
            stroke="#059669"
            strokeWidth="2.5"
            strokeDasharray="6,4"
            fill="none"
            className="grid-wire-active"
          />

          {/* Synergy Badges in the flow */}
          <g transform="translate(345, 185)" filter="url(#svgSoftShadow)">
            <rect x="0" y="0" width="85" height="20" rx="10" fill="#ffffff" stroke="#38bdf8" strokeWidth="1" />
            <text x="42" y="14" fill="#0369a1" fontSize="9" fontFamily="'Asul', serif" fontWeight="700" textAnchor="middle">
              Cooling Flow ➔
            </text>
          </g>

          <g transform="translate(695, 185)" filter="url(#svgSoftShadow)">
            <rect x="0" y="0" width="90" height="20" rx="10" fill="#ffffff" stroke="#10b981" strokeWidth="1" />
            <text x="45" y="14" fill="#047857" fontSize="9" fontFamily="'Asul', serif" fontWeight="700" textAnchor="middle">
              Auto Bypass ➔
            </text>
          </g>

          {/* ============================================================== */}
          {/* PILLAR 1: CANAL & FRESHWATER CONSERVATION */}
          {/* ============================================================== */}
          <g
            transform="translate(45, 40)"
            className="cursor-pointer"
            onMouseEnter={() => setActivePillar("water")}
            onMouseLeave={() => setActivePillar(null)}
          >
            {/* Background Column Card */}
            <rect
              x="0"
              y="0"
              width="310"
              height="435"
              rx="24"
              fill="url(#waterPillarGrad)"
              stroke={activePillar === "water" ? "#0284c7" : "#bae6fd"}
              strokeWidth={activePillar === "water" ? "2" : "1.2"}
              filter="url(#svgSoftShadow)"
            />

            {/* Pillar Number & Category */}
            <g transform="translate(24, 28)">
              <span className="text-2xl font-bold font-mono text-sky-800">
                01
              </span>
              <text x="0" y="0" fill="#0369a1" fontSize="12" fontFamily="'Asul', serif" fontWeight="700" letterSpacing="1">
                PILLAR 01 • WATER PRESERVATION
              </text>
              <text x="0" y="24" fill="#0c4a6e" fontSize="18" fontFamily="'Asul', serif" fontWeight="700">
                Canal Surface Shield
              </text>
            </g>

            {/* Visual Diagram: Shaded Canal Cross Section */}
            <g transform="translate(30, 95)">
              {/* Elevated PV Canopy Frame */}
              <rect x="30" y="10" width="190" height="18" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
              <line x1="50" y1="28" x2="50" y2="70" stroke="#78716c" strokeWidth="3" />
              <line x1="200" y1="28" x2="200" y2="70" stroke="#78716c" strokeWidth="3" />

              {/* Shading Rays Stopped */}
              <line x1="90" y1="0" x2="90" y2="10" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,2" />
              <line x1="130" y1="0" x2="130" y2="10" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,2" />
              <line x1="170" y1="0" x2="170" y2="10" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,2" />

              {/* Water Canal Bed */}
              <path d="M 30 70 L 220 70 L 200 115 L 50 115 Z" fill="#0284c7" opacity="0.9" />
              <path d="M 60 90 Q 125 80 190 90" stroke="#bae6fd" strokeWidth="2" fill="none" opacity="0.8" className="water-wave-motion" />

              {/* Protective Shield Badge */}
              <rect x="55" y="42" width="140" height="20" rx="10" fill="#ffffff" stroke="#0284c7" strokeWidth="1.2" />
              <text x="125" y="56" fill="#0284c7" fontSize="10" fontFamily="'Asul', serif" fontWeight="700" textAnchor="middle">
                🛡️ Solar Thermal Shield
              </text>
            </g>

            {/* Quantified Impact Points */}
            <g transform="translate(24, 245)">
              {/* Metric 1 */}
              <g transform="translate(0, 0)">
                <circle cx="10" cy="10" r="10" fill="#0284c7" />
                <text x="10" y="14" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">✓</text>
                <text x="28" y="10" fill="#0c4a6e" fontSize="13" fontFamily="'Asul', serif" fontWeight="700">
                  72% Evaporation Stopped
                </text>
                <text x="28" y="25" fill="#475569" fontSize="11" fontFamily="'Asul', serif">
                  Saves 514 Liters daily per 20m reach
                </text>
              </g>

              {/* Metric 2 */}
              <g transform="translate(0, 48)">
                <circle cx="10" cy="10" r="10" fill="#0284c7" />
                <text x="10" y="14" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">✓</text>
                <text x="28" y="10" fill="#0c4a6e" fontSize="13" fontFamily="'Asul', serif" fontWeight="700">
                  Zero Arable Land Used
                </text>
                <text x="28" y="25" fill="#475569" fontSize="11" fontFamily="'Asul', serif">
                  Preserves Bangladesh's limited farmland
                </text>
              </g>

              {/* Metric 3 */}
              <g transform="translate(0, 96)">
                <circle cx="10" cy="10" r="10" fill="#0284c7" />
                <text x="10" y="14" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">✓</text>
                <text x="28" y="10" fill="#0c4a6e" fontSize="13" fontFamily="'Asul', serif" fontWeight="700">
                  +3.8% PV Cooling Bonus
                </text>
                <text x="28" y="25" fill="#475569" fontSize="11" fontFamily="'Asul', serif">
                  Natural vapor suppresses panel heat
                </text>
              </g>
            </g>
          </g>

          {/* ============================================================== */}
          {/* PILLAR 2: METHANE ABATEMENT & PRECISION AWD */}
          {/* ============================================================== */}
          <g
            transform="translate(395, 40)"
            className="cursor-pointer"
            onMouseEnter={() => setActivePillar("methane")}
            onMouseLeave={() => setActivePillar(null)}
          >
            {/* Background Column Card */}
            <rect
              x="0"
              y="0"
              width="310"
              height="435"
              rx="24"
              fill="url(#methanePillarGrad)"
              stroke={activePillar === "methane" ? "#059669" : "#a7f3d0"}
              strokeWidth={activePillar === "methane" ? "2" : "1.2"}
              filter="url(#svgSoftShadow)"
            />

            {/* Pillar Number & Category */}
            <g transform="translate(24, 28)">
              <text x="0" y="0" fill="#047857" fontSize="12" fontFamily="'Asul', serif" fontWeight="700" letterSpacing="1">
                PILLAR 02 • CLIMATE AGRONOMY
              </text>
              <text x="0" y="24" fill="#064e3b" fontSize="18" fontFamily="'Asul', serif" fontWeight="700">
                AWD Methane Abatement
              </text>
            </g>

            {/* Visual Diagram: Rice Paddy Rootzone & Methane Cut */}
            <g transform="translate(30, 95)">
              {/* Paddy Ground Plane */}
              <polygon points="10,60 120,25 240,25 130,60" fill="#6ee7b7" stroke="#059669" strokeWidth="1.5" />
              <polygon points="10,60 130,60 130,95 10,95" fill="#a7f3d0" />

              {/* Rice Plants */}
              <path d="M 45 42 L 40 20 M 45 42 L 50 18 M 45 42 L 45 15" stroke="#047857" strokeWidth="2" strokeLinecap="round" />
              <path d="M 100 42 L 95 20 M 100 42 L 105 18 M 100 42 L 100 15" stroke="#047857" strokeWidth="2" strokeLinecap="round" />
              <path d="M 160 30 L 155 12 M 160 30 L 165 10 M 160 30 L 160 8" stroke="#047857" strokeWidth="2" strokeLinecap="round" />

              {/* AWD Perforated Tube */}
              <rect x="180" y="20" width="12" height="50" rx="3" fill="#ffffff" stroke="#e11d48" strokeWidth="1.5" />
              <line x1="180" y1="52" x2="192" y2="52" stroke="#e11d48" strokeWidth="2" /> {/* -15cm */}

              {/* Strikethrough Methane (CH4) Bubble */}
              <g transform="translate(60, 5)">
                <ellipse cx="60" cy="18" rx="55" ry="16" fill="#ffffff" stroke="#059669" strokeWidth="1.2" />
                <text x="60" y="22" fill="#065f46" fontSize="10" fontFamily="'Asul', serif" fontWeight="700" textAnchor="middle">
                  🍃 -35% Methane (CH₄)
                </text>
              </g>
            </g>

            {/* Quantified Impact Points */}
            <g transform="translate(24, 245)">
              {/* Metric 1 */}
              <g transform="translate(0, 0)">
                <circle cx="10" cy="10" r="10" fill="#059669" />
                <text x="10" y="14" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">✓</text>
                <text x="28" y="10" fill="#064e3b" fontSize="13" fontFamily="'Asul', serif" fontWeight="700">
                  -35% Rice Methane (CH₄)
                </text>
                <text x="28" y="25" fill="#475569" fontSize="11" fontFamily="'Asul', serif">
                  Breaks anaerobic bacterial cycle
                </text>
              </g>

              {/* Metric 2 */}
              <g transform="translate(0, 48)">
                <circle cx="10" cy="10" r="10" fill="#059669" />
                <text x="10" y="14" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">✓</text>
                <text x="28" y="10" fill="#064e3b" fontSize="13" fontFamily="'Asul', serif" fontWeight="700">
                  10-Minute Precision Quota
                </text>
                <text x="28" y="25" fill="#475569" fontSize="11" fontFamily="'Asul', serif">
                  Automated shutoff stops flood waste
                </text>
              </g>

              {/* Metric 3 */}
              <g transform="translate(0, 96)">
                <circle cx="10" cy="10" r="10" fill="#059669" />
                <text x="10" y="14" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">✓</text>
                <text x="28" y="10" fill="#064e3b" fontSize="13" fontFamily="'Asul', serif" fontWeight="700">
                  30% Irrigation Water Saved
                </text>
                <text x="28" y="25" fill="#475569" fontSize="11" fontFamily="'Asul', serif">
                  42,500 L conserved per cluster season
                </text>
              </g>
            </g>
          </g>

          {/* ============================================================== */}
          {/* PILLAR 3: CLEAN GRID POWER & RURAL PROSPERITY */}
          {/* ============================================================== */}
          <g
            transform="translate(745, 40)"
            className="cursor-pointer"
            onMouseEnter={() => setActivePillar("energy")}
            onMouseLeave={() => setActivePillar(null)}
          >
            {/* Background Column Card */}
            <rect
              x="0"
              y="0"
              width="310"
              height="435"
              rx="24"
              fill="url(#energyPillarGrad)"
              stroke={activePillar === "energy" ? "#d97706" : "#fde68a"}
              strokeWidth={activePillar === "energy" ? "2" : "1.2"}
              filter="url(#svgSoftShadow)"
            />

            {/* Pillar Number & Category */}
            <g transform="translate(24, 28)">
              <text x="0" y="0" fill="#b45309" fontSize="12" fontFamily="'Asul', serif" fontWeight="700" letterSpacing="1">
                PILLAR 03 • ENERGY & PROSPERITY
              </text>
              <text x="0" y="24" fill="#78350f" fontSize="18" fontFamily="'Asul', serif" fontWeight="700">
                Battery-Free Grid Feed
              </text>
            </g>

            {/* Visual Diagram: Transmission Grid & Replaced Diesel Engine */}
            <g transform="translate(30, 95)">
              {/* Transmission Pole */}
              <line x1="80" y1="10" x2="80" y2="95" stroke="#78716c" strokeWidth="3" />
              <line x1="60" y1="25" x2="100" y2="25" stroke="#78716c" strokeWidth="3" />
              <circle cx="65" cy="25" r="3" fill="#a8a29e" />
              <circle cx="95" cy="25" r="3" fill="#a8a29e" />

              <line x1="200" y1="10" x2="200" y2="95" stroke="#78716c" strokeWidth="3" />
              <line x1="180" y1="25" x2="220" y2="25" stroke="#78716c" strokeWidth="3" />

              {/* Dynamic Power Line */}
              <path d="M 65 25 Q 130 35 195 25" stroke="#059669" strokeWidth="2.5" fill="none" className="grid-wire-active" />

              {/* Avoided Diesel Fuel Canister with Cross */}
              <g transform="translate(130, 50)">
                <rect x="0" y="0" width="28" height="34" rx="4" fill="#fee2e2" stroke="#ef4444" strokeWidth="1.2" />
                <line x1="4" y1="4" x2="24" y2="30" stroke="#ef4444" strokeWidth="2" />
                <line x1="24" y1="4" x2="4" y2="30" stroke="#ef4444" strokeWidth="2" />
              </g>

              {/* Grid Feed Callout */}
              <g transform="translate(50, 5)">
                <rect x="0" y="0" width="160" height="20" rx="10" fill="#ffffff" stroke="#d97706" strokeWidth="1.2" />
                <text x="80" y="14" fill="#b45309" fontSize="10" fontFamily="'Asul', serif" fontWeight="700" textAnchor="middle">
                  ⚡ +485W Clean Grid Export
                </text>
              </g>
            </g>

            {/* Quantified Impact Points */}
            <g transform="translate(24, 245)">
              {/* Metric 1 */}
              <g transform="translate(0, 0)">
                <circle cx="10" cy="10" r="10" fill="#d97706" />
                <text x="10" y="14" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">✓</text>
                <text x="28" y="10" fill="#78350f" fontSize="13" fontFamily="'Asul', serif" fontWeight="700">
                  100% Battery-Free Flow
                </text>
                <text x="28" y="25" fill="#475569" fontSize="11" fontFamily="'Asul', serif">
                  Zero costly chemical battery replacement
                </text>
              </g>

              {/* Metric 2 */}
              <g transform="translate(0, 48)">
                <circle cx="10" cy="10" r="10" fill="#d97706" />
                <text x="10" y="14" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">✓</text>
                <text x="28" y="10" fill="#78350f" fontSize="13" fontFamily="'Asul', serif" fontWeight="700">
                  Replaces Dirty Diesel Fuel
                </text>
                <text x="28" y="25" fill="#475569" fontSize="11" fontFamily="'Asul', serif">
                  Saves BDT 68.25 per watering cycle
                </text>
              </g>

              {/* Metric 3 */}
              <g transform="translate(0, 96)">
                <circle cx="10" cy="10" r="10" fill="#d97706" />
                <text x="10" y="14" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">✓</text>
                <text x="28" y="10" fill="#78350f" fontSize="13" fontFamily="'Asul', serif" fontWeight="700">
                  78 Tons CO₂e Mitigated
                </text>
                <text x="28" y="25" fill="#475569" fontSize="11" fontFamily="'Asul', serif">
                  Per 100 kWp canal corridor annually
                </text>
              </g>
            </g>
          </g>
        </svg>
      </div>

      {/* Planetary Scale Banner */}
      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
          <span className="text-stone-700">
            <strong>The Global Impact Multiplier:</strong> In Bangladesh alone, applying SolariQ across 100 km of BWDB canals conserves <strong>46.5M Liters of water</strong>, injects <strong>114.2 MWh</strong> of green power, and prevents <strong>78 tons of emissions</strong> every year.
          </span>
        </div>
        <span className="shrink-0 text-emerald-900 font-bold bg-emerald-100/80 px-2.5 py-1 rounded-full text-[11px]">
          SREDA & BRRI Benchmarked
        </span>
      </div>
    </div>
  );
}
