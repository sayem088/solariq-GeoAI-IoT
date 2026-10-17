"use client";

import React, { useState } from "react";
import { useNexusStore, OperationalStep, locationProfiles } from "@/lib/nexusStore";
import {
  Droplets,
  Sun,
  Zap,
  RotateCcw,
  Bell,
  ArrowRight,
  CheckCircle2,
  Info,
  Clock,
  MapPin,
  Calculator,
} from "lucide-react";
import { playWarningBuzzer, playSolenoidClick, playGridDivertChime } from "@/components/audio/BuzzerSynth";
import CalculationModal24h from "./CalculationModal24h";

export default function IsometricDigitalTwin() {
  const [isCalculationModalOpen, setIsCalculationModalOpen] = useState(false);
  const {
    solarWatts,
    pumpWatts,
    gridWatts,
    activePlotId,
    isPumpRunning,
    step,
    setStep,
    scenarioMode,
    flowRateLpm,
    canalDepthMeters,
    evapReductionPercent,
    plots,
    switchToPlot,
    inspectedComponent,
    setInspectedComponent,
    timerSecondsRemaining,
    startPlot4Irrigation,
    triggerSmartShutoff,
    resetCycle,
    selectedLocation,
  } = useNexusStore();

  const activeProfile = locationProfiles[selectedLocation];
  const isRain = scenarioMode === "monsoon-rain";
  const isNight = scenarioMode === "night-standby";

  // Timeline step handler
  const handleStepClick = (targetStep: OperationalStep) => {
    if (targetStep === 2) {
      playSolenoidClick();
      startPlot4Irrigation();
    } else if (targetStep === 4) {
      playWarningBuzzer();
      setStep(4);
    } else if (targetStep === 5) {
      playGridDivertChime();
      triggerSmartShutoff();
    } else {
      setStep(targetStep);
    }
  };

  const minutes = Math.floor(timerSecondsRemaining / 60);
  const seconds = timerSecondsRemaining % 60;
  const timerStr = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  // Coordinates of the 6 plots in the 1300x820 SVG layout
  const plotPositions = [
    { id: 1, x: 55, y: 505, label: "Plot 1" },
    { id: 2, x: 255, y: 505, label: "Plot 2" },
    { id: 3, x: 455, y: 505, label: "Plot 3" },
    { id: 4, x: 655, y: 505, label: "Plot 4" }, // Critical Deficit
    { id: 5, x: 855, y: 505, label: "Plot 5" },
    { id: 6, x: 1055, y: 505, label: "Plot 6" },
  ];

  // Component details dictionary
  const componentDetails: Record<
    string,
    { title: string; subtitle: string; explanation: string; benefit: string }
  > = {
    canopy: {
      title: "① Modular Canal-Top Solar Canopy",
      subtitle: "5x Monocrystalline PV Arrays Elevated Over Water Corridor",
      explanation:
        "Elevated 5.2m steel frame holding 485W solar panels directly above the canal corridor. Shields water from direct sun, cutting 72% evaporation. Rising water vapor cools panels from below, generating +3.8% more electricity.",
      benefit: "Saves precious agricultural land while keeping canal water from drying out in the dry season.",
    },
    canal: {
      title: `② ${activeProfile.canalSystem}`,
      subtitle: `Demonstration Reach: ${activeProfile.name} (${activeProfile.coordinates})`,
      explanation:
        `A ${canalDepthMeters}m deep canal waterway. SolariQ transforms open evaporation channels across Bangladesh into dual-benefit energy and water conduits without consuming arable land.`,
      benefit: `Saves water stage and cuts 72% surface evaporation loss during critical dry spells.`,
    },
    pump: {
      title: "③ 120W DC Solar Submersible Pump",
      subtitle: "Brushless Direct-Drive Motor with Variable Frequency",
      explanation:
        "A 120W DC submersible solar pump drawing surface water directly from the shaded canal into the distribution manifold. Powered 100% by solar—zero diesel fuel cost, zero emissions.",
      benefit: "Replaces dirty diesel pumps that cost farmers BDT 180-220/hour in expensive imported fuel.",
    },
    "edge-ai": {
      title: "④ ESP32-S3 Edge-AI Kiosk",
      subtitle: "Autonomous Cyber-Physical Soil & Hydrology Controller",
      explanation:
        "An on-site weatherproof edge computer running a localized soil moisture regression model. Reads AWD tube levels, calculates exact 10-minute water quotas, and sounds buzzer warnings at minute 9.",
      benefit: "Takes the guesswork out of farming, preventing wasteful flood irrigation and over-pumping.",
    },
    manifold: {
      title: "⑤ 6-Way Latching Manifold Hub",
      subtitle: "Bistable Low-Power Solenoid Distribution Valve Hub",
      explanation:
        "Equipped with bistable pulse-latching solenoids. Draws only a brief 50ms electric pulse to open or close, directing 100% of pumped canal water strictly to the plot that actually needs it.",
      benefit: "Zero leakage or wasteful flooding across plots that already have adequate moisture.",
    },
    plots: {
      title: `⑥ 6 Crop Rootzone Plots (${activeProfile.cropFocus})`,
      subtitle: `10 Decimal Each (~404 sq.m) • AWD Monitored • ${activeProfile.name}`,
      explanation:
        `Six test plots with staggered transplant ages. Perforated AWD observation tubes measure water depth underground. The safe threshold is -15cm. Plot 4 has dropped to -15cm and receives a 10-minute replenishment.`,
      benefit: "Cuts total water consumption by 30% while reducing climate-warming methane gas emissions by 35%.",
    },
    grid: {
      title: "⑦ 33kV Rural Grid Interconnection",
      subtitle: "Net-Metered Power Export under SREDA Guidelines",
      explanation:
        "Routes all surplus solar electricity (485W - 120W = 365W during pumping, and 100% 485W when pump shuts off) into the rural village electricity grid, earning net-metered income for farmers.",
      benefit: "Turns an agricultural irrigation station into a community clean power mini-generator.",
    },
  };

  const currentInfo = componentDetails[inspectedComponent || "plots"] || componentDetails.plots;


  return (
    <div className="w-full min-h-screen flex flex-col justify-start py-3 relative select-none space-y-4 pb-16">
      {/* 1. Sleek Narrative Timeline Scrubber (Top Bar) */}
      <div className="editorial-container max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 w-full mb-1">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2.5 border-b border-stone-200/70">
          {/* Timeline Sequence Steps */}
          <div className="flex items-center gap-1 sm:gap-2 text-xs">
            <span className="text-[11px] uppercase tracking-wider text-stone-500 font-bold mr-1 hidden sm:inline">
              Timeline:
            </span>

            {[
              { num: 1, label: "01. AWD Deficit", desc: "Plot 4 at -15cm", stepNum: 1 },
              { num: 2, label: "02. Farmer Consent", desc: "Pump ON (120W)", stepNum: 2 },
              { num: 3, label: "03. Canal Shading", desc: "Mist Cooling (+3.8%)", stepNum: 3 },
              { num: 4, label: "04. 9-Min Warning", desc: "Acoustic Buzzer", stepNum: 4 },
              { num: 5, label: "05. Smart Shutoff", desc: "100% to Grid (X+Y)", stepNum: 5 },
            ].map((st) => (
              <button
                key={st.num}
                onClick={() => handleStepClick(st.stepNum as OperationalStep)}
                className={`px-3 py-1.5 rounded-full text-xs transition-all text-left ${
                  step === st.stepNum
                    ? st.stepNum === 4
                      ? "bg-rose-900 text-rose-50 font-bold shadow-xs animate-pulse ring-2 ring-rose-500/40"
                      : "bg-emerald-900 text-stone-100 font-bold shadow-xs ring-2 ring-emerald-700/30"
                    : "bg-stone-200/70 text-stone-700 hover:bg-stone-300/80"
                }`}
              >
                <span className="block font-bold leading-tight">{st.label}</span>
                <span className="text-[10px] opacity-80 leading-tight hidden lg:block">{st.desc}</span>
              </button>
            ))}
          </div>

          {/* Right Status Indicators */}
          <div className="flex items-center gap-2.5 text-xs">
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-700 font-semibold border border-stone-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
              <span>Corridor: <strong>{activeProfile.name}</strong></span>
            </span>

            {isPumpRunning && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-900 font-bold animate-pulse">
                <Droplets className="w-3.5 h-3.5 text-sky-700" />
                <span>Pumping Active ({timerStr})</span>
              </span>
            )}

            <button
              onClick={resetCycle}
              className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-900 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Interactive Living Landscape Vector Canvas (Big & Spacious) */}
      <div className="editorial-container max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 w-full relative flex items-center justify-center">
        <div className="w-full bg-white rounded-3xl border border-stone-200/90 shadow-sm p-3 sm:p-5 relative overflow-hidden">
          {isRain && (
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#38bdf8_1.5px,transparent_1.5px)] [background-size:18px_18px] opacity-40 animate-pulse z-10" />
          )}

          <svg
            viewBox="0 0 1300 820"
            className="w-full h-auto min-h-[580px] md:min-h-[680px] lg:min-h-[740px] max-h-[860px] select-none"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
          >
          <defs>
            <linearGradient id="canalWaterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>

            <linearGradient id="pvPanelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>

            <linearGradient id="pipeWaterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>

            <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.08" />
            </filter>
          </defs>

          {/* ============================================================== */}
          {/* LAYER 1: CANAL WATERWAY & EARTH STRUCTURE */}
          {/* ============================================================== */}
          {/* Embankment Roads */}
          <path d="M 40 120 L 1260 120 L 1260 165 L 40 165 Z" fill="#ebe8e1" />
          {/* Retaining Walls */}
          <path d="M 40 165 L 1260 165 L 1220 255 L 80 255 Z" fill="#d6d1c7" stroke="#b8b0a2" strokeWidth="2.5" />
          {/* Dynamic Water Volume */}
          <path
            d="M 50 175 Q 350 170 650 175 T 1250 175 L 1215 250 L 85 250 Z"
            fill="url(#canalWaterGrad)"
            opacity="0.95"
            className="cursor-pointer"
            onClick={() => setInspectedComponent("canal")}
          />
          {/* Animated Water Ripple Currents */}
          <path className="water-wave-motion" d="M 140 192 Q 260 185 380 192 T 620 192" stroke="#bae6fd" strokeWidth="3" fill="none" opacity="0.8" />
          <path className="water-wave-motion" d="M 550 215 Q 670 208 790 215 T 1030 215" stroke="#bae6fd" strokeWidth="3" fill="none" opacity="0.8" />
          <path className="water-wave-motion" d="M 880 195 Q 1000 188 1120 195 T 1230 195" stroke="#bae6fd" strokeWidth="3" fill="none" opacity="0.8" />

          {/* Structural Steel Trusses */}
          {[200, 440, 680, 920].map((cx) => (
            <g key={`truss-${cx}`}>
              <line x1={cx} y1={95} x2={cx} y2={40} stroke="#57534e" strokeWidth="5" strokeLinecap="round" />
              <line x1={cx + 60} y1={230} x2={cx + 60} y2={40} stroke="#57534e" strokeWidth="5" strokeLinecap="round" />
              <line x1={cx - 40} y1={40} x2={cx + 100} y2={40} stroke="#78716c" strokeWidth="4" />
            </g>
          ))}

          {/* Rising Microclimate Cooling Vectors */}
          <path
            d="M 230 145 L 230 75 M 450 145 L 450 75 M 670 145 L 670 75 M 890 145 L 890 75 M 1110 145 L 1110 75"
            stroke="#0284c7"
            strokeWidth="2.5"
            strokeDasharray="5,4"
            className="water-wave-motion"
          />

          {/* ============================================================== */}
          {/* LAYER 2: PIPELINES & ELECTRICAL WIRES (Behind Badges) */}
          {/* ============================================================== */}
          {/* Main Hydraulic Lift Pipe */}
          <path d="M 380 215 L 380 430 L 430 430" fill="none" stroke="#78716c" strokeWidth="12" strokeLinecap="round" />
          {isPumpRunning && (
            <path d="M 380 215 L 380 430 L 430 430" fill="none" stroke="url(#pipeWaterGrad)" strokeWidth="7" strokeLinecap="round" className="pipe-water-active" />
          )}

          {/* 6 Manifold Outlet Pipes branching into 6 Plots */}
          <path d="M 460 448 L 460 475 L 145 475 L 145 505" fill="none" stroke="#d6d1c7" strokeWidth="5" />
          <path d="M 540 448 L 540 475 L 345 475 L 345 505" fill="none" stroke="#d6d1c7" strokeWidth="5" />
          <path d="M 620 448 L 620 475 L 545 475 L 545 505" fill="none" stroke="#d6d1c7" strokeWidth="5" />
          <path d="M 700 448 L 700 475 L 745 475 L 745 505" fill="none" stroke="#d6d1c7" strokeWidth="5" />
          <path d="M 780 448 L 780 475 L 945 475 L 945 505" fill="none" stroke="#d6d1c7" strokeWidth="5" />
          <path d="M 860 448 L 860 475 L 1145 475 L 1145 505" fill="none" stroke="#d6d1c7" strokeWidth="5" />

          {/* Active Pipe Highlight into Currently Active Plot */}
          {isPumpRunning && activePlotId === 4 && (
            <path d="M 700 448 L 700 475 L 745 475 L 745 505" fill="none" stroke="#0284c7" strokeWidth="6" strokeLinecap="round" className="pipe-water-active" />
          )}

          {/* Electrical Wires */}
          <path d="M 670 68 L 670 295" fill="none" stroke="#b45309" strokeWidth="3.5" strokeDasharray="8,5" className={solarWatts > 0 ? "energy-wire-active" : ""} />
          <path d="M 550 335 L 408 335 L 408 215" fill="none" stroke="#b45309" strokeWidth="3.5" strokeDasharray="8,5" className={isPumpRunning ? "energy-wire-active" : ""} />
          <path d="M 800 335 L 1120 335 L 1120 250" fill="none" stroke="#065f46" strokeWidth="4.5" strokeDasharray="8,5" className={gridWatts > 0 ? "grid-wire-active" : ""} />

          {/* ============================================================== */}
          {/* LAYER 3: HARDWARE ARRAYS */}
          {/* ============================================================== */}
          {/* 5 Photovoltaic Module Arrays */}
          {[140, 360, 580, 800, 1020].map((px) => (
            <g
              key={`panel-${px}`}
              filter="url(#softShadow)"
              className="cursor-pointer"
              onClick={() => setInspectedComponent("canopy")}
            >
              <rect
                x={px}
                y={14}
                width={180}
                height={54}
                rx="5"
                fill="url(#pvPanelGrad)"
                stroke={inspectedComponent === "canopy" ? "#065f46" : "#38bdf8"}
                strokeWidth="2"
              />
              <line x1={px} y1={41} x2={px + 180} y2={41} stroke="#0284c7" strokeWidth="1" />
              <line x1={px + 60} y1={14} x2={px + 60} y2={68} stroke="#0284c7" strokeWidth="1" />
              <line x1={px + 120} y1={14} x2={px + 120} y2={68} stroke="#0284c7" strokeWidth="1" />
            </g>
          ))}

          {/* Submersible DC Pump */}
          <g className="cursor-pointer" onClick={() => setInspectedComponent("pump")}>
            <circle cx="380" cy="215" r="26" fill="#1c1917" stroke="#0284c7" strokeWidth="3.5" filter="url(#softShadow)" />
            <circle cx="380" cy="215" r="14" fill="#38bdf8" className={isPumpRunning ? "pump-rotor-spinning" : ""} />
          </g>

          {/* ESP32-S3 Edge-AI Kiosk */}
          <g className="cursor-pointer" onClick={() => setInspectedComponent("edge-ai")}>
            <rect
              x="550"
              y="295"
              width="250"
              height="85"
              rx="10"
              fill="#ffffff"
              stroke={inspectedComponent === "edge-ai" ? "#065f46" : "#10b981"}
              strokeWidth="2.5"
              filter="url(#softShadow)"
            />
            <rect x="562" y="307" width="226" height="34" rx="5" fill="#1c1917" />
            <text x="574" y="329" fill={isPumpRunning ? "#38bdf8" : "#10b981"} fontSize="12" fontFamily="'Asul', serif" fontWeight="bold">
              {isPumpRunning ? `STATUS: PUMP ON → PLOT ${activePlotId}` : step === 5 ? "GRID FEED: 100% ACTIVE" : "AI STATUS: STANDBY"}
            </text>
            <text x="675" y="364" fill="#1c1917" fontSize="13" fontFamily="'Asul', serif" fontWeight="700" textAnchor="middle">
              ④ ESP32-S3 EDGE-AI KIOSK
            </text>
          </g>

          {/* 6-Way Latching Manifold Hub */}
          <g className="cursor-pointer" onClick={() => setInspectedComponent("manifold")}>
            <rect x="430" y="415" width="480" height="34" rx="6" fill="#292524" stroke="#57534e" strokeWidth="2" filter="url(#softShadow)" />
            <text x="670" y="437" fill="#f5f5f4" fontSize="12" fontFamily="'Asul', serif" fontWeight="700" textAnchor="middle">
              ⑤ 6-WAY LATCHING MANIFOLD (50ms Pulse Solenoids)
            </text>
          </g>

          {/* 33kV Rural Grid Pylon */}
          <g
            id="grid-pylon"
            transform="translate(1100, 155)"
            className="cursor-pointer"
            onClick={() => setInspectedComponent("grid")}
          >
            <line x1="30" y1="85" x2="30" y2="0" stroke="#065f46" strokeWidth="4.5" />
            <line x1="5" y1="26" x2="55" y2="26" stroke="#065f46" strokeWidth="3.5" />
            <line x1="12" y1="52" x2="48" y2="52" stroke="#065f46" strokeWidth="3.5" />
          </g>

          {/* 6 Agricultural Paddies (Kurigram Testbed - 10 Dec Each) */}
          <g id="six-paddies">
            {plotPositions.map((plot) => {
              const data = plots.find((p) => p.id === plot.id);
              const isActive = plot.id === activePlotId && isPumpRunning;
              const isPlot4 = plot.id === 4;

              return (
                <g
                  key={`plot-svg-${plot.id}`}
                  transform={`translate(${plot.x}, ${plot.y})`}
                  className="cursor-pointer transition-all"
                  onClick={() => {
                    switchToPlot(plot.id);
                    setInspectedComponent("plots");
                  }}
                >
                  <rect
                    x="0"
                    y="0"
                    width="180"
                    height="165"
                    rx="10"
                    fill={isActive ? "#ecfeff" : isPlot4 && step === 1 ? "#fffbeb" : "#ffffff"}
                    stroke={isActive ? "#0284c7" : isPlot4 ? "#b45309" : "#d6d1c7"}
                    strokeWidth={isActive ? "3" : isPlot4 ? "2.5" : "1.5"}
                    filter="url(#softShadow)"
                  />
                  <rect x="10" y="10" width="160" height="70" rx="6" fill={isActive ? "#e0f2fe" : isPlot4 ? "#fef3c7" : "#ecfdf5"} />
                  <line x1="20" y1="25" x2="160" y2="25" stroke="#059669" strokeWidth="3" strokeDasharray="5,5" />
                  <line x1="20" y1="42" x2="160" y2="42" stroke="#059669" strokeWidth="3" strokeDasharray="5,5" />
                  <line x1="20" y1="60" x2="160" y2="60" stroke="#059669" strokeWidth="3" strokeDasharray="5,5" />

                  {isActive && (
                    <circle cx="90" cy="42" r="26" fill="#38bdf8" opacity="0.45" className="sprinkler-mist" />
                  )}

                  <text x="90" y="102" fill="#1c1917" fontSize="13" fontFamily="'Asul', serif" fontWeight="700" textAnchor="middle">
                    {plot.label}: BORO RICE
                  </text>

                  <rect
                    x="15"
                    y="110"
                    width="150"
                    height="24"
                    rx="5"
                    fill={data && data.awdTubeCm <= -15 ? "#fee2e2" : "#f5f5f4"}
                  />
                  <text
                    x="90"
                    y="126"
                    fill={data && data.awdTubeCm <= -15 ? "#b91c1c" : "#1c1917"}
                    fontSize="12"
                    fontFamily="'Asul', serif"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    AWD: {data ? `${data.awdTubeCm}cm` : "0cm"} ({data?.moisture}%)
                  </text>

                  <text
                    x="90"
                    y="152"
                    fill={isActive ? "#0284c7" : isPlot4 ? "#b45309" : "#78716c"}
                    fontSize="11"
                    fontFamily="'Asul', serif"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    {isActive ? "● WATERING NOW" : isPlot4 ? "● DEFICIT ALERT" : "STANDBY"}
                  </text>
                </g>
              );
            })}
          </g>

          {/* ============================================================== */}
          {/* LAYER 4: EDITORIAL BADGES (Rendered strictly on top of wires) */}
          {/* ============================================================== */}
          {/* ① Canopy Badge */}
          <g
            transform="translate(410, 85)"
            filter="url(#softShadow)"
            className="cursor-pointer"
            onClick={() => setInspectedComponent("canopy")}
          >
            <rect x="0" y="0" width="500" height="34" rx="17" fill="#ffffff" stroke="#b45309" strokeWidth="2" />
            <text x="20" y="22" fill="#b45309" fontSize="13" fontFamily="'Asul', serif" fontWeight="700">
              ① CANAL SOLAR CANOPY
            </text>
            <text x="215" y="22" fill="#1c1917" fontSize="12" fontFamily="'Asul', serif" fontWeight="700">
              {solarWatts}W Clean PV • +3.8% Shaded Water Cooling
            </text>
          </g>

          {/* ② Canal Waterway Badge */}
          <g
            transform="translate(60, 205)"
            filter="url(#softShadow)"
            className="cursor-pointer"
            onClick={() => setInspectedComponent("canal")}
          >
            <rect x="0" y="0" width="340" height="32" rx="16" fill="#ffffff" stroke="#0284c7" strokeWidth="2" />
            <text x="18" y="21" fill="#0284c7" fontSize="13" fontFamily="'Asul', serif" fontWeight="700">
              ② CANAL REACH: {activeProfile.id === "kurigram" ? "TEESTA PILOT" : activeProfile.id === "barind" ? "BARIND CANAL" : activeProfile.id === "kushtia-gk" ? "G-K MAIN REACH" : "UNIVERSAL REACH"}
            </text>
            <text x="250" y="21" fill="#1c1917" fontSize="12" fontFamily="'Asul', serif" fontWeight="700">
              {canalDepthMeters}m Depth
            </text>
          </g>

          {/* ③ Solar Pump Badge */}
          <g
            transform="translate(140, 255)"
            filter="url(#softShadow)"
            className="cursor-pointer"
            onClick={() => setInspectedComponent("pump")}
          >
            <rect x="0" y="0" width="230" height="30" rx="15" fill="#ffffff" stroke={isPumpRunning ? "#0284c7" : "#78716c"} strokeWidth="1.5" />
            <text x="14" y="20" fill={isPumpRunning ? "#0284c7" : "#1c1917"} fontSize="13" fontFamily="'Asul', serif" fontWeight="700">
              ③ SOLAR PUMP
            </text>
            <text x="135" y="20" fill="#1c1917" fontSize="11" fontFamily="'Asul', serif" fontWeight="700">
              {pumpWatts}W (0 Fuel)
            </text>
          </g>

          {/* ⑦ Rural Grid Badges */}
          <g
            transform="translate(1030, 115)"
            filter="url(#softShadow)"
            className="cursor-pointer"
            onClick={() => setInspectedComponent("grid")}
          >
            <rect x="0" y="0" width="190" height="28" rx="14" fill="#ffffff" stroke="#065f46" strokeWidth="1.5" />
            <text x="14" y="19" fill="#065f46" fontSize="12" fontFamily="'Asul', serif" fontWeight="700">
              ⑦ 33kV RURAL GRID
            </text>
          </g>

          <g
            transform="translate(1045, 255)"
            filter="url(#softShadow)"
            className="cursor-pointer"
            onClick={() => setInspectedComponent("grid")}
          >
            <rect x="0" y="0" width="160" height="26" rx="13" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.5" />
            <text x="14" y="18" fill="#065f46" fontSize="12" fontFamily="'Asul', serif" fontWeight="700">
              +{gridWatts}W EXPORT
            </text>
          </g>

          {/* ⑥ 6 Plots Bottom Title Badge */}
          <g transform="translate(360, 685)" filter="url(#softShadow)">
            <rect x="0" y="0" width="580" height="26" rx="13" fill="#ffffff" stroke="#065f46" strokeWidth="1.5" />
            <text x="290" y="18" fill="#065f46" fontSize="12" fontFamily="'Asul', serif" fontWeight="700" textAnchor="middle">
              ⑥ 6 CROP ROOTZONE PLOTS (10 DEC EACH • AWD MONITORED • {activeProfile.name.toUpperCase()})
            </text>
          </g>
        </svg>
        </div>
      </div>

      {/* 3. Subsystem Selector & Bottom Hotspot Detail Bar */}
      <div className="editorial-container max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 w-full space-y-2 mt-1">
        {/* Subsystem Selection Pills */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pb-1 text-xs">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mr-1">
            Explore System:
          </span>
          {(
            [
              { key: "canopy", label: "① Solar Canopy" },
              { key: "canal", label: "② Canal Reach" },
              { key: "pump", label: "③ Solar Pump" },
              { key: "edge-ai", label: "④ Edge-AI Kiosk" },
              { key: "manifold", label: "⑤ 6-Way Manifold" },
              { key: "plots", label: "⑥ 6 Rice Paddies" },
              { key: "grid", label: "⑦ 33kV Rural Grid" },
            ] as const
          ).map((item) => (
            <button
              key={item.key}
              onClick={() => setInspectedComponent(item.key)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                inspectedComponent === item.key
                  ? "bg-emerald-900 text-stone-100 shadow-xs ring-1 ring-emerald-700"
                  : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Detailed Inspection Card */}
        <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div className="flex items-start gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-700 shrink-0 mt-1" />
            <div>
              <strong className="text-stone-900 font-bold text-sm sm:text-base font-serif block">
                {currentInfo.title}
              </strong>
              <span className="text-xs font-semibold text-emerald-900 block mt-0.5">
                {currentInfo.subtitle}
              </span>
              <p className="text-stone-600 text-xs sm:text-sm mt-1 max-w-3xl font-normal leading-relaxed">
                {currentInfo.explanation}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2 text-xs font-semibold text-emerald-950 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200 self-start md:self-auto">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{currentInfo.benefit}</span>
          </div>
        </div>
      </div>

      {/* 4. Sleek Floating Side Button: 24-Hour Calculation & Physics Audit */}
      <button
        onClick={() => setIsCalculationModalOpen(true)}
        className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 flex items-center gap-3 px-3.5 py-3 rounded-2xl bg-white/95 hover:bg-stone-900 text-stone-900 hover:text-white border-2 border-emerald-800/40 hover:border-emerald-700 shadow-xl backdrop-blur-md transition-all duration-200 hover:scale-105 group"
        title="Open 24-Hour Diurnal Energy & Hydrology Physics Audit"
      >
        <div className="w-8 h-8 rounded-xl bg-emerald-900 text-stone-100 flex items-center justify-center font-bold shrink-0 shadow-xs group-hover:bg-emerald-700 transition-colors">
          <Calculator className="w-4 h-4 text-emerald-300" />
        </div>
        <div className="text-left hidden lg:block">
          <span className="block text-xs font-bold leading-tight group-hover:text-stone-100 text-stone-900">
            24-Hour Calculation
          </span>
          <span className="block text-[10px] uppercase tracking-wider font-semibold text-emerald-800 group-hover:text-emerald-300">
            Physics & Energy Audit
          </span>
        </div>
      </button>

      {/* 5. 24-Hour Calculation Modal */}
      <CalculationModal24h
        isOpen={isCalculationModalOpen}
        onClose={() => setIsCalculationModalOpen(false)}
      />
    </div>
  );
}
