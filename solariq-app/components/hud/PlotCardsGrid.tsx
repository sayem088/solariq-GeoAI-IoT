"use client";

import React from "react";
import { useNexusStore } from "@/lib/nexusStore";
import { playSolenoidClick } from "@/components/audio/BuzzerSynth";
import { Droplet, AlertTriangle } from "lucide-react";

export default function PlotCardsGrid() {
  const { plots, activePlotId, isPumpRunning, switchToPlot } = useNexusStore();

  const handleCardClick = (id: number) => {
    playSolenoidClick();
    switchToPlot(id);
  };

  return (
    <div className="w-full flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-mono font-bold tracking-wider text-slate-700 uppercase">
          6-PLOT BORO RICE CLUSTER (10 DECIMAL EACH / AWD REGIME)
        </h3>
        <span className="text-[11px] font-mono text-emerald-700 font-medium">
          Click plot card to manually sequence solenoid
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {plots.map((plot) => {
          const isActive = plot.id === activePlotId && isPumpRunning;
          const isCritical = plot.moisture < 30;

          return (
            <div
              key={plot.id}
              onClick={() => handleCardClick(plot.id)}
              className={`pro-card p-3.5 cursor-pointer transition-all border ${
                isActive
                  ? "border-sky-500 bg-sky-50/60 shadow-md ring-2 ring-sky-400/40 -translate-y-1"
                  : isCritical
                  ? "border-amber-300 bg-amber-50/40 hover:border-amber-400 hover:-translate-y-0.5"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:-translate-y-0.5"
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold font-mono text-slate-900">{plot.name}</span>
                <span className="text-[10px] font-mono text-slate-500 font-medium">{plot.areaDecimal} dec</span>
              </div>

              {/* Crop & Age */}
              <div className="text-[11px] text-slate-600 font-sans line-clamp-1 mb-2 font-medium">
                {plot.cropStage} <span className="text-slate-400 font-mono">(D+{plot.transplantAgeDays})</span>
              </div>

              {/* Moisture Bar */}
              <div className="flex flex-col gap-1 mb-2">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-slate-500">Soil Moisture:</span>
                  <span
                    className={`font-bold ${
                      isCritical ? "text-amber-700" : isActive ? "text-sky-700" : "text-slate-800"
                    }`}
                  >
                    {plot.moisture}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden border border-slate-200/60">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      isCritical
                        ? "bg-gradient-to-r from-rose-500 to-amber-500"
                        : "bg-gradient-to-r from-emerald-500 to-sky-500"
                    }`}
                    style={{ width: `${Math.min(100, plot.moisture)}%` }}
                  />
                </div>
              </div>

              {/* AWD Tube Depth Level */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] font-mono">
                <span className="text-slate-500">AWD Tube:</span>
                <span
                  className={`font-bold ${
                    plot.awdTubeCm <= -15
                      ? "text-rose-600 animate-pulse"
                      : plot.awdTubeCm < 0
                      ? "text-amber-700"
                      : "text-emerald-700"
                  }`}
                >
                  {plot.awdTubeCm > 0 ? `+${plot.awdTubeCm}cm` : `${plot.awdTubeCm}cm`}
                </span>
              </div>

              {/* Status Pill */}
              <div className="mt-2.5 text-center">
                {isActive ? (
                  <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-full border border-sky-300 animate-pulse">
                    <Droplet className="w-2.5 h-2.5 text-sky-600" /> WATERING NOW
                  </span>
                ) : isCritical ? (
                  <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                    <AlertTriangle className="w-2.5 h-2.5 text-amber-600" /> DEFICIT ALERT
                  </span>
                ) : (
                  <span className="text-[9px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                    STANDBY
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
