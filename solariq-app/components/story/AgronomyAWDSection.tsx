"use client";

import React from "react";
import { useNexusStore } from "@/lib/nexusStore";
import { playSolenoidClick } from "@/components/audio/BuzzerSynth";
import { Droplet, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";

export default function AgronomyAWDSection() {
  const { plots, activePlotId, isPumpRunning, switchToPlot, setInspectedComponent } = useNexusStore();

  const handlePlotSelect = (id: number) => {
    playSolenoidClick();
    switchToPlot(id);
    setInspectedComponent("plots");
  };

  return (
    <section className="w-full py-12 border-b border-stone-200/60 select-none">
      <div className="editorial-container max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="mb-8 max-w-2xl">
          <span className="text-xs uppercase tracking-wider text-emerald-800 font-bold block mb-1">
            Chapter 03 • Autonomous Agronomy & Methane Abatement
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            6 Boro Rice Paddies Under Alternate Wetting and Drying
          </h2>
          <p className="mt-2 text-stone-600 text-sm leading-relaxed">
            Continuous deep flooding of rice paddies in Bangladesh depletes regional groundwater and creates anaerobic soil decomposition, releasing massive volumes of greenhouse methane (CH₄). SolariQ enforces the Alternate Wetting and Drying (AWD) protocol developed by IRRI and BRRI.
          </p>
        </div>

        {/* Agronomic Context Bar */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-600/20 text-xs text-amber-950 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <strong className="font-bold text-sm block">The -15cm AWD Safe Threshold Rule</strong>
            <p className="text-amber-900 text-xs mt-0.5">
              Perforated PVC observation tubes are driven 20cm into the rootzone. As long as the water table remains above <strong>-15cm below the soil surface</strong>, the rice root hairs have ample moisture. When the water table drops to <strong>-15cm</strong>, a 10-minute irrigation cycle is automatically scheduled.
            </p>
          </div>
          <div className="shrink-0 font-bold text-xs bg-amber-200/70 text-amber-900 px-3 py-1.5 rounded-lg border border-amber-300">
            Plot 4: -15cm Deficit Alert
          </div>
        </div>

        {/* The 6 Plots Agronomic Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {plots.map((plot) => {
            const isActive = plot.id === activePlotId && isPumpRunning;
            const isCritical = plot.awdTubeCm <= -15;

            return (
              <div
                key={plot.id}
                onClick={() => handlePlotSelect(plot.id)}
                className={`p-4 rounded-xl cursor-pointer transition-all border ${
                  isActive
                    ? "bg-sky-50 border-sky-400 ring-2 ring-sky-300 shadow-sm"
                    : isCritical
                    ? "bg-amber-50/70 border-amber-300 hover:border-amber-400 shadow-2xs"
                    : "bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/50"
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-2 border-b border-stone-200/70 mb-2">
                  <span className="font-bold text-sm text-stone-900">{plot.name}</span>
                  <span className="text-[11px] text-stone-500 font-semibold">{plot.areaDecimal} dec</span>
                </div>

                {/* Crop Stage */}
                <div className="text-xs text-stone-600 mb-3">
                  <span className="font-bold text-stone-800 block">{plot.cropStage}</span>
                  <span className="text-[11px] text-stone-400">Transplant D+{plot.transplantAgeDays}</span>
                </div>

                {/* Soil Moisture */}
                <div className="space-y-1 mb-3 text-xs">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-stone-500">Soil Moisture:</span>
                    <strong className={isCritical ? "text-amber-700 font-bold" : "text-stone-800"}>
                      {plot.moisture}%
                    </strong>
                  </div>
                  <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCritical ? "bg-amber-500" : "bg-emerald-600"
                      }`}
                      style={{ width: `${plot.moisture}%` }}
                    />
                  </div>
                </div>

                {/* AWD Depth Column */}
                <div className="pt-2 border-t border-stone-200/70 space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-stone-500">AWD Tube Depth:</span>
                    <strong
                      className={`font-bold ${
                        isCritical ? "text-rose-700" : "text-emerald-800"
                      }`}
                    >
                      {plot.awdTubeCm} cm
                    </strong>
                  </div>

                  <span
                    className={`block text-center text-[10px] font-bold py-1 px-1.5 rounded-md mt-2 ${
                      isActive
                        ? "bg-sky-100 text-sky-900 animate-pulse"
                        : isCritical
                        ? "bg-rose-100 text-rose-900"
                        : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    {isActive ? "● Watering (10m)" : isCritical ? "● Deficit Tipped" : "Safe Buffer"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
