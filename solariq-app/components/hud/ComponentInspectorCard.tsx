"use client";

import React from "react";
import { useNexusStore } from "@/lib/nexusStore";
import { Sun, Droplets, Zap, Cpu, Layers, Activity, CheckCircle2, Info } from "lucide-react";

export default function ComponentInspectorCard() {
  const { inspectedComponent, setInspectedComponent, flowRateLpm, isPumpRunning, activePlotId, gridWatts } = useNexusStore();

  const componentDetails: Record<
    string,
    { title: string; subtitle: string; icon: any; color: string; explanation: string; specs: string[]; benefit: string }
  > = {
    canopy: {
      title: "① Canal-Top Solar Canopy",
      subtitle: "5x Monocrystalline PV Arrays Elevated Over Water",
      icon: Sun,
      color: "text-amber-600 bg-amber-50 border-amber-200",
      explanation:
        "Elevated steel frame holding 485W solar panels directly above the BWDB irrigation canal. By shielding the water surface from the scorching dry season sun, it blocks 72% of water evaporation. In turn, cool water evaporating below naturally cools the solar panels, generating +3.8% more electricity.",
      specs: ["Capacity: 485W Peak", "Pan Evaporation Blocked: 72%", "Water Cooling Boost: +3.8%", "Farmland Used: 0 sq.m (Canal airspace)"],
      benefit: "Saves precious farmland in land-scarce Kurigram while saving thousands of liters of canal water from drying out.",
    },
    canal: {
      title: "② BWDB Canal Waterway",
      subtitle: "Primary Irrigation Corridor (Teesta / Jamuna Link)",
      icon: Droplets,
      color: "text-sky-600 bg-sky-50 border-sky-200",
      explanation:
        "A 1.85m deep canal corridor that supplies surface water to local farming clusters. SolariQ transforms this open evaporation canal into a protected dual-benefit energy corridor, ensuring water lasts all the way through the dry March-April harvest.",
      specs: ["Canal Stage: 1.85m Depth", "Current Discharge: " + flowRateLpm.toFixed(1) + " L/min", "Evaporation Shaded: 72%", "Water: Fresh non-saline"],
      benefit: "Retains water longer into the brutal dry season so downstream smallholder farmers do not run out of irrigation water.",
    },
    pump: {
      title: "③ 120W DC Solar Submersible Pump",
      subtitle: "High-Efficiency Brushless Direct-Drive Motor",
      icon: Zap,
      color: "text-sky-600 bg-sky-50 border-sky-200",
      explanation:
        "A 120W DC submersible solar pump drawing surface water from the shaded canal into the distribution manifold. Runs entirely on clean solar power—zero diesel fuel cost, zero emissions, and zero maintenance headaches.",
      specs: ["Motor: 120W Brushless DC", "Discharge Rate: 42.0 Liters/min", "Fuel Cost: BDT 0.00", "Status: " + (isPumpRunning ? "Actively Pumping" : "Motor Standby")],
      benefit: "Replaces noisy diesel pumps that cost Kurigram farmers BDT 180–220 per hour in costly imported fuel.",
    },
    "edge-ai": {
      title: "④ ESP32-S3 Edge-AI Kiosk",
      subtitle: "Autonomous Cyber-Physical Soil & Hydrology Controller",
      icon: Cpu,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
      explanation:
        "An on-site weatherproof edge computer running a localized soil-water model. It reads AWD tube levels, calculates exact 10-minute water quotas, triggers buzzer warnings at minute 9, and enforces automatic shutoff at minute 10.",
      specs: ["Processor: Dual-Core ESP32-S3", "Model: Kurigram AWD Regressor", "Cycle: 10-Minute Quota", "Power Draw: < 2.5W"],
      benefit: "Takes the guesswork out of farming, preventing wasteful flood irrigation and over-pumping.",
    },
    manifold: {
      title: "⑤ 6-Way Latching Manifold Hub",
      subtitle: "Bistable Low-Power Solenoid Distribution Valve Hub",
      icon: Layers,
      color: "text-slate-700 bg-slate-100 border-slate-300",
      explanation:
        "A motorized manifold equipped with bistable pulse-latching solenoids. It only draws a tiny 50ms pulse of electricity to open or close, directing 100% of pumped canal water strictly into the plot that actually needs water.",
      specs: ["Valves: 6x Bistable Latching Solenoids", "Pulse Duration: 50 milliseconds", "Idle Power: 0W", "Active Port: Plot " + activePlotId],
      benefit: "Zero leakage or wasteful flooding across plots that already have plenty of moisture.",
    },
    plots: {
      title: "⑥ 6 Boro Rice Paddies (AWD Regime)",
      subtitle: "10 Decimal Each (~404 sq.m) Cultivating BRRI dhan29",
      icon: Activity,
      color: "text-emerald-700 bg-emerald-50 border-emerald-300",
      explanation:
        "Six adjacent test plots with staggered transplant ages. Each plot has an AWD observation tube. The internationally certified AWD safe threshold is -15cm. Plot 4 has dropped to -15cm (28% moisture) and requires a 10-minute water replenishment.",
      specs: ["Plot 4 Stage: Panicle Initiation (D+26)", "AWD Level: -15cm (Critical)", "Water Quota: 420 Liters (10 mins)", "Methane Cut: -35% vs Flooding"],
      benefit: "Saves up to 30% total water while mitigating climate-warming methane gas emissions.",
    },
    grid: {
      title: "⑦ 33kV Rural Grid Interconnection",
      subtitle: "Net-Metered Clean Power Export under SREDA Guidelines",
      icon: Zap,
      color: "text-emerald-700 bg-emerald-50 border-emerald-300",
      explanation:
        "The system routes all surplus solar electricity (485W - 120W = 365W during pumping, and 100% 485W when pump shuts off) into the rural village electricity grid, earning net-metered financial income for the farmers.",
      specs: ["Grid: 33kV Distribution Line", "Live Feed: +" + gridWatts + "W", "Rule: X + Y Balancer", "Tariff Offset: BDT 48.5/day"],
      benefit: "Turns an agricultural irrigation station into a rural community clean power mini-generator.",
    },
  };

  const currentInfo = componentDetails[inspectedComponent || "plots"] || componentDetails.plots;
  const CurrentIcon = currentInfo.icon;

  return (
    <div className="w-full pro-card p-4 sm:p-5 bg-white border border-slate-200 shadow-sm flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg border ${currentInfo.color}`}>
            <CurrentIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-sans">{currentInfo.title}</h3>
            <p className="text-[11px] font-mono text-slate-500">{currentInfo.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            CLICK SVG ELEMENTS TO INSPECT
          </span>
        </div>
      </div>

      {/* Explanation */}
      <p className="text-xs sm:text-sm text-slate-700 font-sans leading-relaxed">
        {currentInfo.explanation}
      </p>

      {/* Technical Specs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        {currentInfo.specs.map((spec, i) => (
          <div key={i} className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 font-medium">
            {spec}
          </div>
        ))}
      </div>

      {/* Benefit to Kurigram Farmer */}
      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <strong>Impact on Kurigram Farmer:</strong> {currentInfo.benefit}
        </div>
      </div>
    </div>
  );
}
