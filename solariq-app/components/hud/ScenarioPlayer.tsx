"use client";

import React from "react";
import { useNexusStore, OperationalStep } from "@/lib/nexusStore";
import { playWarningBuzzer, playSolenoidClick, playGridDivertChime } from "@/components/audio/BuzzerSynth";
import { Sun, CloudRain, Snowflake, Moon, Bell, Droplets, RotateCcw, ChevronRight } from "lucide-react";

export default function ScenarioPlayer() {
  const {
    step,
    setStep,
    scenarioMode,
    setScenarioMode,
    isPumpRunning,
    timerSecondsRemaining,
    startPlot4Irrigation,
    triggerSmartShutoff,
    resetCycle,
  } = useNexusStore();

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

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-xs p-2.5 sm:p-3 flex flex-col gap-2 shrink-0">
      {/* Top Bar: Scenarios & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
        {/* Preset Modes */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-mono font-bold text-slate-500 uppercase mr-1">
            Mode:
          </span>

          <button
            onClick={() => setScenarioMode("kurigram-dry")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
              scenarioMode === "kurigram-dry"
                ? "bg-amber-100 text-amber-900 border border-amber-300 font-bold shadow-xs"
                : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            <Sun className="w-3 h-3 text-amber-600" />
            <span>Kurigram Summer Dry</span>
          </button>

          <button
            onClick={() => setScenarioMode("monsoon-rain")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
              scenarioMode === "monsoon-rain"
                ? "bg-sky-100 text-sky-900 border border-sky-300 font-bold shadow-xs"
                : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            <CloudRain className="w-3 h-3 text-sky-600" />
            <span>Rain Preempt (100% Grid)</span>
          </button>

          <button
            onClick={() => setScenarioMode("winter-micro")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
              scenarioMode === "winter-micro"
                ? "bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold shadow-xs"
                : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            <Snowflake className="w-3 h-3 text-emerald-600" />
            <span>Winter Micro-Drip</span>
          </button>

          <button
            onClick={() => setScenarioMode("night-standby")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
              scenarioMode === "night-standby"
                ? "bg-slate-800 text-white font-bold"
                : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            <Moon className="w-3 h-3 text-slate-400" />
            <span>Night Standby</span>
          </button>
        </div>

        {/* Right Status */}
        <div className="flex items-center gap-2">
          {isPumpRunning && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[11px] font-mono font-bold border border-sky-300 animate-pulse">
              <Droplets className="w-3 h-3 text-sky-600" /> Pumping ({timerStr})
            </span>
          )}

          <button
            onClick={resetCycle}
            className="flex items-center gap-1 text-[11px] font-mono text-slate-500 hover:text-emerald-700 transition-colors px-2 py-0.5 rounded-md hover:bg-slate-100"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Cycle</span>
          </button>
        </div>
      </div>

      {/* Operational Timeline Stepper */}
      <div className="grid grid-cols-5 gap-1.5">
        {/* Step 1 */}
        <button
          onClick={() => handleStepClick(1)}
          className={`p-2 rounded-xl text-left transition-all border ${
            step === 1
              ? "bg-amber-50 border-amber-400 shadow-xs ring-2 ring-amber-400/30"
              : "bg-slate-50/70 border-slate-200 hover:bg-slate-100/70"
          }`}
        >
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-amber-700">
            <span>STEP 1</span>
            <span>AWD DEFICIT</span>
          </div>
          <p className="text-xs font-bold text-slate-900 truncate">Plot 4 at -15cm</p>
          <p className="text-[10px] text-slate-500 font-mono truncate">10-Min Need Scheduled</p>
        </button>

        {/* Step 2 */}
        <button
          onClick={() => handleStepClick(2)}
          className={`p-2 rounded-xl text-left transition-all border ${
            step === 2
              ? "bg-sky-50 border-sky-400 shadow-xs ring-2 ring-sky-400/30"
              : "bg-slate-50/70 border-slate-200 hover:bg-slate-100/70"
          }`}
        >
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-sky-700">
            <span>STEP 2</span>
            <span>00:00</span>
          </div>
          <p className="text-xs font-bold text-slate-900 truncate">Farmer Consent</p>
          <p className="text-[10px] text-slate-500 font-mono truncate">Pump ON (120W DC)</p>
        </button>

        {/* Step 3 */}
        <button
          onClick={() => handleStepClick(3)}
          className={`p-2 rounded-xl text-left transition-all border ${
            step === 3
              ? "bg-sky-50 border-sky-400 shadow-xs ring-2 ring-sky-400/30"
              : "bg-slate-50/70 border-slate-200 hover:bg-slate-100/70"
          }`}
        >
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-sky-700">
            <span>STEP 3</span>
            <span>00:01 - 08:59</span>
          </div>
          <p className="text-xs font-bold text-slate-900 truncate">Canal Shading</p>
          <p className="text-[10px] text-slate-500 font-mono truncate">Cooling Mist (+3.8%)</p>
        </button>

        {/* Step 4 */}
        <button
          onClick={() => handleStepClick(4)}
          className={`p-2 rounded-xl text-left transition-all border ${
            step === 4
              ? "bg-rose-50 border-rose-400 shadow-xs ring-2 ring-rose-400/40 animate-pulse"
              : "bg-slate-50/70 border-slate-200 hover:bg-slate-100/70"
          }`}
        >
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-rose-700">
            <span>STEP 4</span>
            <span className="flex items-center gap-0.5">
              <Bell className="w-2.5 h-2.5" /> 09:00
            </span>
          </div>
          <p className="text-xs font-bold text-slate-900 truncate">1-Min Warning</p>
          <p className="text-[10px] text-rose-600 font-mono font-bold truncate">Buzzer Alert (60s)</p>
        </button>

        {/* Step 5 */}
        <button
          onClick={() => handleStepClick(5)}
          className={`p-2 rounded-xl text-left transition-all border ${
            step === 5
              ? "bg-emerald-50 border-emerald-400 shadow-xs ring-2 ring-emerald-400/40"
              : "bg-slate-50/70 border-slate-200 hover:bg-slate-100/70"
          }`}
        >
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-emerald-700">
            <span>STEP 5</span>
            <span>10:00</span>
          </div>
          <p className="text-xs font-bold text-slate-900 truncate">Smart Auto-Shutoff</p>
          <p className="text-[10px] text-emerald-700 font-mono font-bold truncate">100% to Grid (X+Y)</p>
        </button>
      </div>
    </div>
  );
}
