"use client";

import React from "react";
import Link from "next/link";
import {
  Layers,
  LayoutDashboard,
  ArrowRight,
  Radio,
  SlidersHorizontal,
  Cpu,
  BarChart2,
  ShieldCheck,
} from "lucide-react";

export default function CinematicGatewayPortals() {
  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-2">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
            Exploration Gateways
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight mt-0.5 font-serif">
            Interactive System Portals
          </h3>
        </div>
        <span className="text-xs text-stone-500 font-medium">
          Choose an operational canvas to inspect
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gateway 1: 2.5D Cyber-Physical Digital Twin */}
        <Link
          href="/twin"
          className="group relative p-8 rounded-3xl bg-gradient-to-br from-stone-900 via-stone-950 to-emerald-950/80 text-stone-100 border border-emerald-900/40 hover:border-emerald-500/60 transition-all duration-300 shadow-lg hover:shadow-emerald-950/30 flex flex-col justify-between overflow-hidden"
        >
          {/* Subtle Ambient Decorative Glow */}
          <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none group-hover:bg-emerald-600/20 transition-all" />

          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-700/50 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Full 100vh Vector SCADA</span>
              </div>
              <Layers className="w-6 h-6 text-emerald-400/80 group-hover:scale-110 group-hover:rotate-6 transition-transform" />
            </div>

            <div>
              <h4 className="text-2xl font-bold text-white font-serif group-hover:text-emerald-300 transition-colors">
                2.5D Cyber-Physical Digital Twin
              </h4>
              <p className="text-stone-300 text-xs sm:text-sm mt-2 leading-relaxed font-normal">
                Step through the interactive 5-step operational timeline, live manifold valve latching, microclimate misting, and launch the 24-hour diurnal physics audit.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-stone-800/80 text-stone-300 border border-stone-700/60">
                01. 5-Step Operational Sequence
              </span>
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-stone-800/80 text-stone-300 border border-stone-700/60">
                02. 6-Way Manifold Latching
              </span>
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-stone-800/80 text-stone-300 border border-stone-700/60">
                03. 24h Physics Audit Modal
              </span>
            </div>
          </div>

          <div className="pt-6 relative z-10 flex items-center justify-between border-t border-stone-800/80 mt-6">
            <span className="text-xs font-bold text-emerald-400 group-hover:text-emerald-300 flex items-center gap-2">
              <span>Launch 100vh Digital Twin</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="text-[11px] font-mono text-stone-400">/twin</span>
          </div>
        </Link>

        {/* Gateway 2: Area-Based SCADA Dashboard */}
        <Link
          href="/dashboard"
          className="group relative p-8 rounded-3xl bg-white text-stone-900 border border-stone-200/90 hover:border-emerald-700 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between overflow-hidden"
        >
          {/* Subtle Ambient Decorative Glow */}
          <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-sky-500/5 blur-3xl pointer-events-none group-hover:bg-sky-500/10 transition-all" />

          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200/70 text-sky-800 text-xs font-bold uppercase tracking-wider">
                <Radio className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
                <span>Live Edge Telemetry Stream</span>
              </div>
              <LayoutDashboard className="w-6 h-6 text-sky-700 group-hover:scale-110 group-hover:-rotate-6 transition-transform" />
            </div>

            <div>
              <h4 className="text-2xl font-bold text-stone-900 font-serif group-hover:text-emerald-950 transition-colors">
                Area-Based Regional SCADA Console
              </h4>
              <p className="text-stone-600 text-xs sm:text-sm mt-2 leading-relaxed font-normal">
                Inspect real-time ESP32-S3 sensor streams, canal hydrology stages, dynamic power diversion accounting, and the 6-plot AWD soil moisture matrix across Bangladesh.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 border border-stone-200">
                01. Kurigram, Barind & Kushtia Basins
              </span>
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 border border-stone-200">
                02. 6-Plot AWD Matric Potential
              </span>
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 border border-stone-200">
                03. Dynamic 485W Feeder Ledger
              </span>
            </div>
          </div>

          <div className="pt-6 relative z-10 flex items-center justify-between border-t border-stone-200 mt-6">
            <span className="text-xs font-bold text-stone-900 group-hover:text-emerald-900 flex items-center gap-2">
              <span>Open Regional SCADA Console</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="text-[11px] font-mono text-stone-500">/dashboard</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
