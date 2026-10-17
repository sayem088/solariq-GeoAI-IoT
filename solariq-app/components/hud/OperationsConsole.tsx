"use client";

import React, { useState } from "react";
import { useNexusStore } from "@/lib/nexusStore";
import {
  Zap,
  Droplets,
  ShieldCheck,
  Info,
  Sun,
  Cpu,
  Layers,
  Activity,
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
} from "lucide-react";
import { playSolenoidClick } from "@/components/audio/BuzzerSynth";

export default function OperationsConsole() {
  const [activeTab, setActiveTab] = useState<"inspector" | "plots" | "impact">("inspector");

  const {
    solarWatts,
    pumpWatts,
    gridWatts,
    flowRateLpm,
    canalDepthMeters,
    evapReductionPercent,
    step,
    activePlotId,
    isPumpRunning,
    plots,
    switchToPlot,
    savedToday,
    inspectedComponent,
    setInspectedComponent,
  } = useNexusStore();

  const activePlotData = plots.find((p) => p.id === activePlotId) || plots[3];

  // Component Details Dictionary for Plain-English Understanding
  const componentDetails: Record<
    string,
    { title: string; subtitle: string; icon: any; color: string; explanation: string; specs: string[]; benefit: string }
  > = {
    canopy: {
      title: "1. Canal-Top Solar Canopy",
      subtitle: "5x Monocrystalline PV Arrays Elevated Over Water",
      icon: Sun,
      color: "text-amber-600 bg-amber-50 border-amber-200",
      explanation:
        "Elevated 5.2m steel frame holding 485W solar panels directly above the BWDB irrigation canal. By shielding the open water surface from direct sunlight, it blocks 72% of water evaporation while natural water evaporation cools the panels from below, generating +3.8% more solar electricity.",
      specs: ["Capacity: 485W Peak", "Pan Evaporation Cut: 72%", "Water Cooling Boost: +3.8%", "Land Footprint: 0 sq.m (Canal airspace)"],
      benefit: "Saves valuable agricultural land in land-scarce Kurigram while conserving millions of liters of canal water.",
    },
    canal: {
      title: "2. BWDB Canal Waterway",
      subtitle: "Primary Irrigation Corridor (Teesta / Jamuna Link)",
      icon: Droplets,
      color: "text-sky-600 bg-sky-50 border-sky-200",
      explanation:
        "A 1.85m deep government irrigation canal that supplies surface water to local smallholder farming clusters. SolariQ transforms this open evaporation canal into a shaded, dual-benefit energy and water conduit.",
      specs: ["Canal Stage: 1.85m depth", "Current Discharge: " + flowRateLpm.toFixed(1) + " L/min", "Evaporation Shaded: 72%", "Water Quality: Non-saline fresh runoff"],
      benefit: "Retains water longer into the brutal March-April dry season, ensuring downstream farmers have water.",
    },
    pump: {
      title: "3. 120W DC Solar Submersible Pump",
      subtitle: "Brushless Direct-Drive Motor with Variable Frequency",
      icon: Zap,
      color: "text-sky-600 bg-sky-50 border-sky-200",
      explanation:
        "A high-efficiency 120W DC solar brushless pump that draws surface water directly from the shaded canal into the distribution manifold. Requires zero diesel, zero grid electricity, and zero battery replacement.",
      specs: ["Power: 120W DC", "Discharge Rate: 42.0 Liters/min", "Fuel Cost: BDT 0.00", "State: " + (isPumpRunning ? "Actively Pumping" : "Standby")],
      benefit: "Replaces dirty diesel pumps that cost farmers BDT 180-220/hour in costly imported fuel.",
    },
    "edge-ai": {
      title: "4. ESP32-S3 Edge-AI Kiosk",
      subtitle: "Autonomous Cyber-Physical Soil & Hydrology Controller",
      icon: Cpu,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
      explanation:
        "An on-site weatherproof edge computing kiosk running a localized random forest soil-water model. It reads AWD perforation tubes, calculates precise 10-minute water quotas, triggers warning buzzers, and enforces automated shutoff.",
      specs: ["Processor: Dual-Core ESP32-S3", "Model: Kurigram AWD Regressor", "Duty Cycle: 10-Minute Quota", "Power Draw: < 2.5W"],
      benefit: "Takes the guesswork away from farmers, preventing over-pumping and water wastage.",
    },
    manifold: {
      title: "5. 6-Way Latching Pulse Manifold",
      subtitle: "Bistable Low-Power Solenoid Distribution Valve Hub",
      icon: Layers,
      color: "text-slate-700 bg-slate-100 border-slate-300",
      explanation:
        "A compact 6-way manifold equipped with pulse-latching solenoids. It only draws a brief 50ms electric pulse to open or close, directing 100% of the pumped canal water strictly to the plot that actually needs it.",
      specs: ["Valves: 6x Bistable Latching Solenoids", "Pulse Duration: 50 milliseconds", "Standby Power: 0W", "Active Port: Plot " + activePlotId],
      benefit: "Zero leakage or wasteful flood irrigation across plots that already have adequate moisture.",
    },
    plots: {
      title: "6. 6 Boro Rice Paddies (AWD Regime)",
      subtitle: "10 Decimal Each (~404 sq.m) Cultivating BRRI dhan29",
      icon: Activity,
      color: "text-emerald-700 bg-emerald-50 border-emerald-300",
      explanation:
        "Six adjacent test plots with staggered transplant ages. Each plot has a perforated AWD observation tube. The internationally certified AWD safe threshold is -15cm. Plot 4 has dropped to -15cm (28% moisture) and requires a 10-minute irrigation cycle.",
      specs: ["Plot 4 Status: Panicle Initiation (D+26)", "AWD Level: -15cm (Critical)", "Water Quota: 420 Liters (10 mins)", "Methane Cut: -35% vs Flooding"],
      benefit: "Saves up to 30% total water while mitigating climate-warming methane gas emissions.",
    },
    grid: {
      title: "7. 33kV Rural Grid Interconnection",
      subtitle: "Net-Metered Power Export under SREDA Guidelines",
      icon: Zap,
      color: "text-emerald-700 bg-emerald-50 border-emerald-300",
      explanation:
        "The system routes all surplus solar electricity (485W - 120W = 365W during pumping, and 100% 485W when pump shuts off) into the rural electricity grid, earning net-metered financial credits for the farming collective.",
      specs: ["Voltage: 33kV Distribution Sub-Line", "Current Export: " + gridWatts + "W", "Rule: X + Y Balancer", "Tariff Offset: BDT 48.5/day"],
      benefit: "Turns an agricultural irrigation station into a rural community clean power mini-generator.",
    },
  };

  const currentInfo = componentDetails[inspectedComponent || "plots"] || componentDetails.plots;
  const CurrentIcon = currentInfo.icon;

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* 1. Header Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/70 p-2 shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab("inspector")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === "inspector"
                ? "bg-white text-emerald-800 shadow-xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Info className="w-3.5 h-3.5 text-emerald-600" />
            <span>1. System Inspector</span>
          </button>

          <button
            onClick={() => setActiveTab("plots")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === "plots"
                ? "bg-white text-emerald-800 shadow-xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Droplets className="w-3.5 h-3.5 text-sky-600" />
            <span>2. 6 Paddies AWD</span>
          </button>

          <button
            onClick={() => setActiveTab("impact")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === "impact"
                ? "bg-white text-emerald-800 shadow-xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>3. Impact & Savings</span>
          </button>
        </div>
      </div>

      {/* 2. Scrollable Body per Tab */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* ============================================================== */}
        {/* TAB 1: SYSTEM INSPECTOR & POWER ROUTER */}
        {/* ============================================================== */}
        {activeTab === "inspector" && (
          <div className="space-y-4">
            {/* Dynamic Interactive Component Inspector Card */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-lg border ${currentInfo.color}`}>
                    <CurrentIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 font-sans">{currentInfo.title}</h3>
                    <p className="text-[11px] font-mono text-slate-500">{currentInfo.subtitle}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  LIVE INSPECT
                </span>
              </div>

              {/* Plain English Explanation */}
              <p className="text-xs text-slate-700 font-sans leading-relaxed">
                {currentInfo.explanation}
              </p>

              {/* Specs Pills */}
              <div className="grid grid-cols-2 gap-1.5">
                {currentInfo.specs.map((spec, i) => (
                  <div key={i} className="px-2 py-1 rounded-md bg-white border border-slate-200 text-[10px] font-mono text-slate-700">
                    {spec}
                  </div>
                ))}
              </div>

              {/* Farmer Benefit */}
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Impact on Farmer:</strong> {currentInfo.benefit}
                </div>
              </div>
            </div>

            {/* Dynamic Power Balancer (X + Y Rule) */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-800">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>DYNAMIC POWER ROUTER BALANCER (X + Y)</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  SREDA Net Metering
                </span>
              </div>

              {/* Equation Cards */}
              <div className="grid grid-cols-5 items-center gap-1.5 text-center">
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 flex flex-col items-center">
                  <span className="text-[9px] font-mono text-amber-800 font-bold uppercase">Solar Yield</span>
                  <span className="text-lg font-black font-mono text-slate-900">{solarWatts}W</span>
                  <span className="text-[9px] font-mono text-amber-700">Canal PV</span>
                </div>

                <span className="text-slate-400 font-bold text-lg">−</span>

                <div className="p-2.5 rounded-lg bg-sky-50 border border-sky-200 flex flex-col items-center">
                  <span className="text-[9px] font-mono text-sky-800 font-bold uppercase">Pump Load</span>
                  <span className="text-lg font-black font-mono text-slate-900">{pumpWatts}W</span>
                  <span className="text-[9px] font-mono text-sky-700">{pumpWatts > 0 ? "Plot 4 Active" : "Standby"}</span>
                </div>

                <span className="text-slate-400 font-bold text-lg">=</span>

                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 flex flex-col items-center shadow-xs">
                  <span className="text-[9px] font-mono text-emerald-800 font-bold uppercase">Grid Feed</span>
                  <span className="text-lg font-black font-mono text-emerald-700">+{gridWatts}W</span>
                  <span className="text-[9px] font-mono text-emerald-700">{step === 5 ? "100% Export" : "Surplus"}</span>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-mono text-slate-600 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>
                  <strong>The $X + Y$ Rule:</strong> When pumping completes at minute 10:00, the 120W motor load transfers automatically to clean grid export.
                </span>
              </div>
            </div>

            {/* Canal Hydrology Summary */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-slate-500 block text-[10px]">Canal Water Level</span>
                <strong className="text-slate-800 text-sm">{canalDepthMeters}m</strong> (Safe Buffer)
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <span className="text-slate-500 block text-[10px]">Pump Discharge</span>
                <strong className="text-sky-600 text-sm">{flowRateLpm.toFixed(1)} L/min</strong>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <span className="text-slate-500 block text-[10px]">Evaporation Cut</span>
                <strong className="text-emerald-700 text-sm">{evapReductionPercent}%</strong> (Canopy Shade)
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: 6 BORO RICE PADDIES AWD MONITOR */}
        {/* ============================================================== */}
        {activeTab === "plots" && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
              <strong>What is AWD (Alternate Wetting and Drying)?</strong>
              <p className="mt-1 text-[11px] text-amber-800 leading-relaxed font-sans">
                A field perforation tube is inserted into the soil. As long as water remains within 15 cm below ground, the rice roots have ample moisture. 
                When water drops below <strong>-15 cm</strong>, irrigation is triggered. This saves 30% water and prevents continuous flooding which emits high methane.
              </p>
            </div>

            {/* 6 Plots List */}
            <div className="space-y-2">
              {plots.map((plot) => {
                const isActive = plot.id === activePlotId && isPumpRunning;
                const isCritical = plot.awdTubeCm <= -15;

                return (
                  <div
                    key={plot.id}
                    onClick={() => {
                      playSolenoidClick();
                      switchToPlot(plot.id);
                      setInspectedComponent("plots");
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                      isActive
                        ? "bg-sky-50 border-sky-400 ring-2 ring-sky-300 shadow-sm"
                        : isCritical
                        ? "bg-amber-50/70 border-amber-300 hover:border-amber-400"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold font-mono text-xs text-slate-900">{plot.name}</span>
                        <span className="text-[10px] font-mono text-slate-500">({plot.areaDecimal} dec)</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {plot.cropStage} (D+{plot.transplantAgeDays})
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                          isActive
                            ? "bg-sky-100 text-sky-800 animate-pulse"
                            : isCritical
                            ? "bg-rose-100 text-rose-800"
                            : "bg-emerald-50 text-emerald-800"
                        }`}
                      >
                        {isActive ? "WATERING NOW" : isCritical ? "DEFICIT ALERT (-15cm)" : "STANDBY"}
                      </span>
                    </div>

                    {/* Moisture & AWD Tube Level Bars */}
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                      <div>
                        <div className="flex justify-between text-slate-500 mb-0.5">
                          <span>Soil Moisture:</span>
                          <strong className="text-slate-800">{plot.moisture}%</strong>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${plot.moisture < 30 ? "bg-amber-500" : "bg-emerald-500"}`}
                            style={{ width: `${plot.moisture}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-500 mb-0.5">
                          <span>AWD Tube Depth:</span>
                          <strong className={isCritical ? "text-rose-600 font-bold" : "text-emerald-700"}>
                            {plot.awdTubeCm} cm
                          </strong>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isCritical ? "bg-rose-500" : "bg-sky-500"}`}
                            style={{ width: `${Math.min(100, Math.max(10, 100 + plot.awdTubeCm * 5))}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: IMPACT & SUSTAINABILITY */}
        {/* ============================================================== */}
        {activeTab === "impact" && (
          <div className="space-y-4">
            {/* Today's Actual Savings */}
            <div>
              <h4 className="text-xs font-mono font-bold text-slate-800 mb-2 uppercase">
                Direct Resource Savings (Today's Cycle)
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-sky-50 border border-sky-200">
                  <span className="text-[10px] font-mono text-sky-700 block">Water Saved</span>
                  <span className="text-xl font-black font-mono text-slate-900">{savedToday.waterLiters}</span>
                  <span className="text-[10px] font-mono text-slate-500 ml-1">Liters</span>
                  <p className="text-[9px] text-sky-800 mt-1">Via canal shading + precision AWD</p>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                  <span className="text-[10px] font-mono text-amber-700 block">Pumping Conserved</span>
                  <span className="text-xl font-black font-mono text-slate-900">{savedToday.pumpKwhAvoided}</span>
                  <span className="text-[10px] font-mono text-slate-500 ml-1">kWh</span>
                  <p className="text-[9px] text-amber-800 mt-1">15 min flood over-pumping cut</p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] font-mono text-emerald-700 block">Clean Grid Export</span>
                  <span className="text-xl font-black font-mono text-slate-900">{savedToday.gridExportKwh}</span>
                  <span className="text-[10px] font-mono text-slate-500 ml-1">kWh</span>
                  <p className="text-[9px] text-emerald-800 mt-1">Surplus fed into 33kV rural grid</p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] font-mono text-emerald-700 block">Daily Money Saved</span>
                  <span className="text-xl font-black font-mono text-slate-900">BDT {savedToday.moneyBdt}</span>
                  <p className="text-[9px] text-emerald-800 mt-1">Avoided diesel + grid export credit</p>
                </div>
              </div>
            </div>

            {/* Emissions & Methane Reductions */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-slate-500 block text-[10px]">CO2 Avoided</span>
                <strong className="text-slate-900 text-sm">{savedToday.co2Kg} kg</strong> (Today)
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <span className="text-slate-500 block text-[10px]">Methane Reduction</span>
                <strong className="text-emerald-700 text-sm">-35% CH4</strong> (AWD Aeration)
              </div>
            </div>

            {/* UN Sustainable Development Goals */}
            <div>
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block mb-1.5">
                Targeted UN SDGs:
              </span>
              <div className="flex flex-wrap gap-1 text-[10px] font-mono">
                {["SDG 2 (Zero Hunger)", "SDG 6 (Clean Water)", "SDG 7 (Clean Energy)", "SDG 9 (Innovation)", "SDG 12 (Consumption)", "SDG 13 (Climate Action)", "SDG 15 (Life on Land)"].map((sdg) => (
                  <span key={sdg} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                    {sdg}
                  </span>
                ))}
              </div>
            </div>

            {/* Prototype Economics */}
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-sans">
              <strong className="font-bold">Affordable Prototype Target: BDT 20,000</strong>
              <p className="text-[11px] text-emerald-800 mt-1">
                Built with off-the-shelf ESP32-S3 microcontroller, bistable pulse latching solenoids, and standard PV mounting brackets. Designed for village farmer cooperatives in rural Kurigram.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
