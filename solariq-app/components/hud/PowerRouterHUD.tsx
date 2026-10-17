"use client";

import React from "react";
import { useNexusStore } from "@/lib/nexusStore";
import { Zap, Droplets, ShieldCheck, Info } from "lucide-react";

export default function PowerRouterHUD() {
  const { solarWatts, pumpWatts, gridWatts, flowRateLpm, canalDepthMeters, evapReductionPercent, step } = useNexusStore();

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* 1. Dynamic Power Routing Balancer (7 cols) */}
      <div className="lg:col-span-7 pro-card p-5 bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-mono font-bold tracking-wider text-slate-800 uppercase">
              DYNAMIC POWER ROUTER BALANCER
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            NET-METERED (SREDA)
          </span>
        </div>

        {/* Equation: Solar - Pump = Grid */}
        <div className="grid grid-cols-5 items-center gap-2 py-4">
          {/* Solar Yield */}
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-center">
            <span className="text-[10px] font-mono text-amber-800 uppercase font-bold">SOLAR YIELD</span>
            <div className="flex items-baseline gap-1 my-1">
              <span className="text-2xl font-black font-mono text-slate-900">{solarWatts}</span>
              <span className="text-xs font-mono text-slate-500">W</span>
            </div>
            <span className="text-[10px] font-mono text-amber-700">Canal PV Canopy</span>
          </div>

          {/* Minus Operator */}
          <div className="flex justify-center text-xl font-bold font-mono text-slate-400">−</div>

          {/* Pump Load */}
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-sky-50/60 border border-sky-200 text-center">
            <span className="text-[10px] font-mono text-sky-800 uppercase font-bold">PUMP LOAD</span>
            <div className="flex items-baseline gap-1 my-1">
              <span className="text-2xl font-black font-mono text-slate-900">{pumpWatts}</span>
              <span className="text-xs font-mono text-slate-500">W</span>
            </div>
            <span className="text-[10px] font-mono text-sky-700">
              {pumpWatts > 0 ? "Plot 4 Active" : "Motor Standby"}
            </span>
          </div>

          {/* Equals Operator */}
          <div className="flex justify-center text-xl font-bold font-mono text-slate-400">=</div>

          {/* Grid Export (X + Y) */}
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-center shadow-xs">
            <span className="text-[10px] font-mono text-emerald-800 font-bold uppercase">GRID FEED</span>
            <div className="flex items-baseline gap-1 my-1">
              <span className="text-2xl font-black font-mono text-emerald-700">{gridWatts}</span>
              <span className="text-xs font-mono text-emerald-700">W</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-800 font-bold">
              {pumpWatts === 0 ? "100% Export (X+Y)" : "Baseline Surplus (X)"}
            </span>
          </div>
        </div>

        {/* Dynamic Rule Explainer */}
        <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-slate-700 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong className="text-emerald-900 font-mono font-bold">The &quot;X + Y&quot; Rule in Real Time:</strong>{" "}
            {step === 5 ? (
              <span>
                Target AWD soil capacity was reached at 10 minutes. By shutting down the pump, SolariQ eliminated 15 minutes of excess runtime, diverting the full{" "}
                <strong className="text-emerald-800 font-mono font-bold">+120W (Y units)</strong> directly into Bangladesh’s national grid!
              </span>
            ) : (
              <span>
                Baseline clean surplus (<strong className="text-amber-800 font-mono font-bold">X = 365W</strong>) is exported continuously. 
                When pumping completes, the 120W motor load transfers automatically to clean grid feed.
              </span>
            )}
          </p>
        </div>
      </div>

      {/* 2. Canal Water Budget (5 cols) */}
      <div className="lg:col-span-5 pro-card p-5 bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
              <Droplets className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-mono font-bold tracking-wider text-slate-800 uppercase">
              CANAL WATER & EVAPORATION BUDGET
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-50 text-sky-700 border border-sky-200">
            CLOSED-LOOP
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5 py-3">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] font-mono text-slate-500 block">CANAL DEPTH</span>
            <div className="text-lg font-bold font-mono text-slate-900 mt-1">{canalDepthMeters} m</div>
            <span className="text-[9px] font-mono text-sky-600">Adequate Buffer</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] font-mono text-slate-500 block">DISCHARGE</span>
            <div className="text-lg font-bold font-mono text-sky-700 mt-1">{flowRateLpm.toFixed(1)}</div>
            <span className="text-[9px] font-mono text-slate-500">L / min</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] font-mono text-slate-500 block">EVAP SHADED</span>
            <div className="text-lg font-bold font-mono text-emerald-600 mt-1">{evapReductionPercent}%</div>
            <span className="text-[9px] font-mono text-emerald-700 font-bold">Canopy Cut</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs font-mono text-slate-600 pt-1 border-t border-slate-100">
          <span>Active Valve: <strong className="text-sky-700">Solenoid #4 (Boro Rice)</strong></span>
          <span>AWD Regime: <strong className="text-emerald-700 font-bold">-35% Methane</strong></span>
        </div>
      </div>
    </div>
  );
}
