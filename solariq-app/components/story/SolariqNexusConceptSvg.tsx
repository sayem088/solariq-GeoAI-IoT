"use client";

import React, { useState } from "react";
import { Sun, Droplets, Zap, Layers, Activity, ArrowRight, CheckCircle2 } from "lucide-react";

export default function SolariqNexusConceptSvg() {
  const [activeHighlight, setActiveHighlight] = useState<"solar" | "canal" | "pump" | "awd" | "grid" | null>(null);

  return (
    <div className="w-full bg-white rounded-3xl border border-stone-200/90 shadow-sm p-4 sm:p-6 lg:p-8 space-y-6">
      {/* SVG Diagram Canvas */}
      <div className="w-full relative flex items-center justify-center select-none overflow-hidden rounded-2xl bg-gradient-to-b from-stone-50/80 via-white to-stone-50/60 border border-stone-100">
        <svg
          viewBox="0 0 1100 580"
          className="w-full h-auto max-h-[580px] object-contain"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Linear Gradients */}
            <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f0fdf4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#fbfbfa" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="sunGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>

            <linearGradient id="solarPanelGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="60%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            <linearGradient id="canalGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>

            <linearGradient id="fieldGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>

            <linearGradient id="soilGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d6d3d1" />
              <stop offset="100%" stopColor="#a8a29e" />
            </linearGradient>

            {/* Drop Shadows */}
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.08" />
            </filter>

            {/* Grid Export Arrowhead Marker */}
            <marker id="gridExportArrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#059669" />
            </marker>
          </defs>

          {/* Background Atmosphere */}
          <rect x="0" y="0" width="1100" height="580" fill="url(#skyGrad)" />

          {/* ============================================================== */}
          {/* 1. SUN & SOLAR ENERGY RAYS */}
          {/* ============================================================== */}
          <g
            className="cursor-pointer transition-opacity"
            onMouseEnter={() => setActiveHighlight("solar")}
            onMouseLeave={() => setActiveHighlight(null)}
          >
            {/* Sun Body */}
            <circle cx="180" cy="85" r="42" fill="url(#sunGrad)" filter="url(#softGlow)" opacity="0.95" />
            <circle cx="180" cy="85" r="54" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="6,4" fill="none" opacity="0.6" className="animate-spin" style={{ transformOrigin: "180px 85px", animationDuration: "25s" }} />

            {/* Sun Rays streaming down to Canopy */}
            <line x1="180" y1="135" x2="280" y2="230" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,5" opacity="0.75" />
            <line x1="210" y1="120" x2="350" y2="230" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,5" opacity="0.75" />
            <line x1="235" y1="95" x2="420" y2="230" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,5" opacity="0.75" />
            <line x1="140" y1="120" x2="220" y2="230" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,5" opacity="0.75" />

            {/* Sun Callout */}
            <g transform="translate(60, 45)" filter="url(#cardShadow)">
              <rect x="0" y="0" width="95" height="24" rx="12" fill="#ffffff" stroke="#f59e0b" strokeWidth="1" />
              <text x="47" y="16" fill="#b45309" fontSize="10" fontFamily="'Asul', serif" fontWeight="700" textAnchor="middle">
                880 W/m² Sun
              </text>
            </g>
          </g>

          {/* ============================================================== */}
          {/* 2. CANAL WATERWAY (BWDB REACH) */}
          {/* ============================================================== */}
          <g
            className="cursor-pointer"
            onMouseEnter={() => setActiveHighlight("canal")}
            onMouseLeave={() => setActiveHighlight(null)}
          >
            {/* Concrete Canal Bed & Embankments */}
            <path d="M 60 410 L 520 410 L 560 330 L 100 330 Z" fill="#e7e5e4" stroke="#d6d3d1" strokeWidth="1.5" />
            <path d="M 80 430 L 500 430 L 520 410 L 60 410 Z" fill="#d6d3d1" />

            {/* Canal Water Surface */}
            <path d="M 85 410 L 505 410 L 545 345 L 115 345 Z" fill="url(#canalGrad)" opacity="0.9" />

            {/* Flowing Water Currents */}
            <path d="M 140 375 Q 260 365 380 375 T 480 375" stroke="#bae6fd" strokeWidth="2" fill="none" opacity="0.8" className="water-wave-motion" />
            <path d="M 120 395 Q 240 385 360 395 T 460 395" stroke="#bae6fd" strokeWidth="2" fill="none" opacity="0.8" className="water-wave-motion" />

            {/* Protective Shading Shield Bracket */}
            <path d="M 145 285 L 145 335 M 475 285 L 475 335" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.6" />
            <line x1="145" y1="310" x2="475" y2="310" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.5" />

            {/* Evaporation Blocked Callout Badge */}
            <g transform="translate(195, 295)" filter="url(#cardShadow)">
              <rect x="0" y="0" width="225" height="26" rx="13" fill="#ffffff" stroke="#0284c7" strokeWidth="1.5" />
              <text x="112" y="17" fill="#0369a1" fontSize="11" fontFamily="'Asul', serif" fontWeight="700" textAnchor="middle">
                🛡️ 72% Evaporation Blocked
              </text>
            </g>

            {/* Water Vapor Cooling Arrows (Rising to PV underside) */}
            <g opacity="0.85">
              <path d="M 220 340 Q 225 310 220 280" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3,3" fill="none" />
              <polygon points="220,275 216,283 224,283" fill="#38bdf8" />

              <path d="M 330 340 Q 335 310 330 280" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3,3" fill="none" />
              <polygon points="330,275 326,283 334,283" fill="#38bdf8" />

              <path d="M 440 340 Q 445 310 440 280" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3,3" fill="none" />
              <polygon points="440,275 436,283 444,283" fill="#38bdf8" />
            </g>

            {/* Mist Cooling Callout */}
            <g transform="translate(435, 345)" filter="url(#cardShadow)">
              <rect x="0" y="0" width="135" height="22" rx="11" fill="#ecfdf5" stroke="#10b981" strokeWidth="1" />
              <text x="67" y="15" fill="#065f46" fontSize="10" fontFamily="'Asul', serif" fontWeight="700" textAnchor="middle">
                +3.8% PV Mist Cooling
              </text>
            </g>
          </g>

          {/* ============================================================== */}
          {/* 3. ELEVATED CANAL-TOP SOLAR CANOPY */}
          {/* ============================================================== */}
          <g
            className="cursor-pointer"
            onMouseEnter={() => setActiveHighlight("solar")}
            onMouseLeave={() => setActiveHighlight(null)}
          >
            {/* Steel Truss Structural Posts */}
            <line x1="140" y1="410" x2="160" y2="250" stroke="#78716c" strokeWidth="4" strokeLinecap="round" />
            <line x1="480" y1="410" x2="460" y2="250" stroke="#78716c" strokeWidth="4" strokeLinecap="round" />
            <line x1="140" y1="330" x2="480" y2="330" stroke="#a8a29e" strokeWidth="2" strokeDasharray="4,4" />

            {/* Transverse Cross Support Girder */}
            <line x1="150" y1="250" x2="470" y2="250" stroke="#57534e" strokeWidth="4.5" strokeLinecap="round" />

            {/* 4x Elevated Modular PV Panels (Inclined 23° over canal) */}
            <g transform="translate(145, 205)">
              {/* Panel 1 */}
              <polygon points="10,40 75,15 145,15 80,40" fill="url(#solarPanelGrad)" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="45" y1="27" x2="110" y2="27" stroke="#38bdf8" strokeWidth="0.8" opacity="0.6" />
              {/* Panel 2 */}
              <polygon points="90,40 155,15 225,15 160,40" fill="url(#solarPanelGrad)" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="125" y1="27" x2="190" y2="27" stroke="#38bdf8" strokeWidth="0.8" opacity="0.6" />
              {/* Panel 3 */}
              <polygon points="170,40 235,15 305,15 240,40" fill="url(#solarPanelGrad)" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="205" y1="27" x2="270" y2="27" stroke="#38bdf8" strokeWidth="0.8" opacity="0.6" />
            </g>

            {/* Solar Canopy Title Badge */}
            <g transform="translate(200, 180)" filter="url(#cardShadow)">
              <rect x="0" y="0" width="220" height="26" rx="13" fill="#ffffff" stroke="#065f46" strokeWidth="1.5" />
              <text x="110" y="17" fill="#065f46" fontSize="11" fontFamily="'Asul', serif" fontWeight="700" textAnchor="middle">
                ☀️ 485W Modular Solar Canopy
              </text>
            </g>
          </g>

          {/* ============================================================== */}
          {/* 4. DC SOLAR SUBMERSIBLE PUMP & 6-WAY MANIFOLD */}
          {/* ============================================================== */}
          <g
            className="cursor-pointer"
            onMouseEnter={() => setActiveHighlight("pump")}
            onMouseLeave={() => setActiveHighlight(null)}
          >
            {/* Submersible Pump in Canal */}
            <rect x="290" y="380" width="45" height="24" rx="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
            {/* Impeller Spinner Indicator */}
            <circle cx="312" cy="392" r="6" fill="#0284c7" />
            <path d="M 312 386 L 312 398 M 306 392 L 318 392" stroke="#ffffff" strokeWidth="1.5" />

            {/* Pump Power Wire from Canopy */}
            <path d="M 312 250 L 312 380" stroke="#f59e0b" strokeWidth="2.5" className="energy-wire-active" />

            {/* Cyan Hydraulic Water Delivery Pipe from Pump to Manifold */}
            <path d="M 335 392 L 580 392 L 580 430 L 640 430" stroke="#0284c7" strokeWidth="5" fill="none" strokeLinecap="round" className="pipe-water-active" />

            {/* Pump Badge */}
            <g transform="translate(260, 420)" filter="url(#cardShadow)">
              <rect x="0" y="0" width="135" height="22" rx="11" fill="#f0f9ff" stroke="#0284c7" strokeWidth="1" />
              <text x="67" y="15" fill="#0369a1" fontSize="10" fontFamily="'Asul', serif" fontWeight="700" textAnchor="middle">
                120W DC Pump (42 LPM)
              </text>
            </g>

            {/* 6-Way Bistable Latching Manifold Hub */}
            <g transform="translate(635, 415)">
              <rect x="0" y="0" width="55" height="32" rx="8" fill="#1e293b" stroke="#10b981" strokeWidth="1.5" />
              <circle cx="14" cy="16" r="4" fill="#64748b" />
              <circle cx="28" cy="16" r="4" fill="#64748b" />
              <circle cx="42" cy="16" r="5" fill="#10b981" className="animate-pulse" /> {/* Valve 4 Active */}
            </g>

            {/* Manifold Callout */}
            <g transform="translate(615, 380)" filter="url(#cardShadow)">
              <rect x="0" y="0" width="115" height="22" rx="11" fill="#ffffff" stroke="#10b981" strokeWidth="1" />
              <text x="57" y="15" fill="#047857" fontSize="10" fontFamily="'Asul', serif" fontWeight="700" textAnchor="middle">
                6-Way Manifold
              </text>
            </g>
          </g>

          {/* ============================================================== */}
          {/* 5. 6 AGRICULTURAL BORO RICE PLOTS UNDER AWD */}
          {/* ============================================================== */}
          <g
            className="cursor-pointer"
            onMouseEnter={() => setActiveHighlight("awd")}
            onMouseLeave={() => setActiveHighlight(null)}
          >
            {/* Water pipe routing into Plot 4 */}
            <path d="M 690 430 L 760 430 L 760 460 L 830 460" stroke="#0284c7" strokeWidth="3.5" fill="none" className="pipe-water-active" />

            {/* 6 Paddy Plots Ground Plane */}
            <g transform="translate(710, 360)">
              {/* Plot 1 */}
              <polygon points="10,50 80,20 150,20 80,50" fill="#a7f3d0" stroke="#059669" strokeWidth="1" opacity="0.8" />
              {/* Plot 2 */}
              <polygon points="60,65 130,35 200,35 130,65" fill="#a7f3d0" stroke="#059669" strokeWidth="1" opacity="0.8" />
              {/* Plot 3 */}
              <polygon points="110,80 180,50 250,50 180,80" fill="#a7f3d0" stroke="#059669" strokeWidth="1" opacity="0.8" />
              {/* Plot 4 (Active Irrigation - Receiving Water) */}
              <polygon points="160,95 230,65 300,65 230,95" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" opacity="0.9" />
              {/* Plot 5 */}
              <polygon points="210,110 280,80 350,80 280,110" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" opacity="0.7" />
              {/* Plot 6 */}
              <polygon points="260,125 330,95 400,95 330,125" fill="#a7f3d0" stroke="#059669" strokeWidth="1" opacity="0.8" />

              {/* Water furrows in Plot 4 */}
              <line x1="185" y1="88" x2="265" y2="88" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="4,2" />
              <line x1="205" y1="78" x2="285" y2="78" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="4,2" />
            </g>

            {/* AWD Tube Graphic */}
            <g transform="translate(940, 410)" filter="url(#cardShadow)">
              <rect x="0" y="0" width="12" height="40" rx="3" fill="#ffffff" stroke="#e11d48" strokeWidth="1.5" />
              <line x1="0" y1="28" x2="12" y2="28" stroke="#e11d48" strokeWidth="2" /> {/* -15cm mark */}
            </g>

            {/* AWD Paddy Callout Badge */}
            <g transform="translate(800, 320)" filter="url(#cardShadow)">
              <rect x="0" y="0" width="240" height="26" rx="13" fill="#ffffff" stroke="#059669" strokeWidth="1.5" />
              <text x="120" y="17" fill="#065f46" fontSize="11" fontFamily="'Asul', serif" fontWeight="700" textAnchor="middle">
                🌾 AWD Precision Paddies (-35% CH₄)
              </text>
            </g>

            <g transform="translate(860, 485)" filter="url(#cardShadow)">
              <rect x="0" y="0" width="170" height="22" rx="11" fill="#ecfdf5" stroke="#10b981" strokeWidth="1" />
              <text x="85" y="15" fill="#065f46" fontSize="10" fontFamily="'Asul', serif" fontWeight="700" textAnchor="middle">
                10-Min Auto Shutoff (420 L)
              </text>
            </g>
          </g>

          {/* ============================================================== */}
          {/* 6. DYNAMIC 33kV RURAL GRID EXPORT (X + Y POWER BALANCER) */}
          {/* ============================================================== */}
          <g
            className="cursor-pointer"
            onMouseEnter={() => setActiveHighlight("grid")}
            onMouseLeave={() => setActiveHighlight(null)}
          >
            {/* Rural Utility Transmission Poles */}
            <line x1="820" y1="220" x2="820" y2="120" stroke="#78716c" strokeWidth="3.5" />
            <line x1="795" y1="135" x2="845" y2="135" stroke="#78716c" strokeWidth="3" />
            <circle cx="800" cy="135" r="3" fill="#a8a29e" />
            <circle cx="840" cy="135" r="3" fill="#a8a29e" />

            <line x1="990" y1="220" x2="990" y2="120" stroke="#78716c" strokeWidth="3.5" />
            <line x1="965" y1="135" x2="1015" y2="135" stroke="#78716c" strokeWidth="3" />
            <circle cx="970" cy="135" r="3" fill="#a8a29e" />
            <circle cx="1010" cy="135" r="3" fill="#a8a29e" />

            {/* 33kV High Voltage Power Line Wires */}
            <path d="M 800 135 Q 885 145 970 135" stroke="#10b981" strokeWidth="2.5" fill="none" className="grid-wire-active" />
            <path d="M 840 135 Q 925 145 1010 135" stroke="#10b981" strokeWidth="2.5" fill="none" className="grid-wire-active" markerEnd="url(#gridExportArrow)" />

            {/* Grid Export Spline Wire from Solar Canopy to Rural Feeder (Outward Export) */}
            <path d="M 450 215 Q 630 160 800 135" stroke="#059669" strokeWidth="3" fill="none" strokeDasharray="6,4" className="grid-wire-active" markerEnd="url(#gridExportArrow)" />

            {/* Visual Directional Flow Indicators (Pointing Outward to Grid) */}
            <g opacity="0.85">
              <path d="M 575 186 L 585 180 L 575 174" stroke="#059669" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 695 158 L 705 152 L 695 146" stroke="#059669" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>

            {/* Grid Export Callout Badge */}
            <g transform="translate(730, 90)" filter="url(#cardShadow)">
              <rect x="0" y="0" width="230" height="26" rx="13" fill="#ecfdf5" stroke="#059669" strokeWidth="1.5" />
              <text x="115" y="17" fill="#047857" fontSize="11" fontFamily="'Asul', serif" fontWeight="700" textAnchor="middle">
                ⚡ 33kV Rural Grid Export (+365W / 485W)
              </text>
            </g>

            {/* Battery-Free Callout */}
            <g transform="translate(860, 160)" filter="url(#cardShadow)">
              <rect x="0" y="0" width="135" height="20" rx="10" fill="#ffffff" stroke="#a8a29e" strokeWidth="1" />
              <text x="67" y="14" fill="#57534e" fontSize="9" fontFamily="'Asul', serif" fontWeight="600" textAnchor="middle">
                100% Battery-Free Flow
              </text>
            </g>
          </g>
        </svg>
      </div>

      {/* Interactive Micro-Explainer Strip (Responsive & Minimal Text) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
        <div
          onMouseEnter={() => setActiveHighlight("solar")}
          onMouseLeave={() => setActiveHighlight(null)}
          className={`p-3 rounded-2xl border transition-all cursor-pointer ${
            activeHighlight === "solar"
              ? "bg-amber-50/80 border-amber-300 ring-1 ring-amber-400"
              : "bg-stone-50/80 hover:bg-stone-100/80 border-stone-200/70"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-600 shrink-0" />
            <strong className="text-stone-900 font-bold">1. Solar Canopy</strong>
          </div>
          <p className="text-stone-500 text-[11px] mt-1">485W PV elevated over canal. Saves zero arable farmland.</p>
        </div>

        <div
          onMouseEnter={() => setActiveHighlight("canal")}
          onMouseLeave={() => setActiveHighlight(null)}
          className={`p-3 rounded-2xl border transition-all cursor-pointer ${
            activeHighlight === "canal"
              ? "bg-sky-50/80 border-sky-300 ring-1 ring-sky-400"
              : "bg-stone-50/80 hover:bg-stone-100/80 border-stone-200/70"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-600 shrink-0" />
            <strong className="text-stone-900 font-bold">2. Water Shield</strong>
          </div>
          <p className="text-stone-500 text-[11px] mt-1">72% evaporation blocked + rising mist cools PV by 4.2°C.</p>
        </div>

        <div
          onMouseEnter={() => setActiveHighlight("awd")}
          onMouseLeave={() => setActiveHighlight(null)}
          className={`p-3 rounded-2xl border transition-all cursor-pointer ${
            activeHighlight === "awd"
              ? "bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-400"
              : "bg-stone-50/80 hover:bg-stone-100/80 border-stone-200/70"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-700 shrink-0" />
            <strong className="text-stone-900 font-bold">3. AWD Irrigation</strong>
          </div>
          <p className="text-stone-500 text-[11px] mt-1">Auto 10-min shutoff delivery (420L) cuts methane emissions by 35%.</p>
        </div>

        <div
          onMouseEnter={() => setActiveHighlight("grid")}
          onMouseLeave={() => setActiveHighlight(null)}
          className={`p-3 rounded-2xl border transition-all cursor-pointer ${
            activeHighlight === "grid"
              ? "bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-400"
              : "bg-stone-50/80 hover:bg-stone-100/80 border-stone-200/70"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-800 shrink-0" />
            <strong className="text-stone-900 font-bold">4. Grid Interconnect</strong>
          </div>
          <p className="text-stone-500 text-[11px] mt-1">100% battery-free. Diverts 365W to 485W clean power to village feeder.</p>
        </div>
      </div>
    </div>
  );
}
