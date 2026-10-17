"use client";

import React, { useState } from "react";
import Link from "next/link";
import HeaderNav from "@/components/hud/HeaderNav";
import HowItWorksModal from "@/components/hud/HowItWorksModal";
import { useNexusStore, locationProfiles, DeploymentLocation } from "@/lib/nexusStore";
import {
  LayoutDashboard,
  MapPin,
  Waves,
  Sun,
  Zap,
  Droplets,
  Activity,
  Cpu,
  Layers,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Gauge,
  Thermometer,
  Wind,
  Compass,
  Radio,
  FileText,
  BarChart3,
} from "lucide-react";

export default function AreaDashboardPage() {
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const {
    selectedLocation,
    setLocation,
    solarWatts,
    pumpWatts,
    gridWatts,
    flowRateLpm,
    canalDepthMeters,
    activePlotId,
    isPumpRunning,
    plots,
    step,
    timerSecondsRemaining,
    savedToday,
  } = useNexusStore();

  const activeProfile = locationProfiles[selectedLocation];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const minutes = Math.floor(timerSecondsRemaining / 60);
  const seconds = timerSecondsRemaining % 60;
  const timerStr = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbfa] text-stone-900 selection:bg-emerald-900/15 selection:text-emerald-950 font-sans">
      <HowItWorksModal isOpen={isHowItWorksOpen} onClose={() => setIsHowItWorksOpen(false)} />
      <HeaderNav onOpenHowItWorks={() => setIsHowItWorksOpen(true)} />

      <main className="editorial-container max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 w-full py-8 space-y-8 flex-1">
        {/* ================================================================= */}
        {/* 1. AREA & BASIN SELECTOR BAR */}
        {/* ================================================================= */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200/80">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-bold uppercase tracking-wider">
                <Radio className="w-3 h-3 text-emerald-700 animate-pulse" />
                <span>Live Edge SCADA Stream</span>
              </span>
              <span className="text-xs text-stone-400 font-mono">NODE-ESP32-S3-01</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
              Area-Based Regional Telemetry Dashboard
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Field Telemetry & Edge-AI Agronomic Closed-Loop SCADA across Bangladesh BWDB Irrigation Canals
            </p>
          </div>

          {/* Area Selector Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-full bg-stone-200/70">
            {(Object.keys(locationProfiles) as DeploymentLocation[]).map((locKey) => {
              const loc = locationProfiles[locKey];
              const isSelected = selectedLocation === locKey;
              return (
                <button
                  key={locKey}
                  onClick={() => setLocation(locKey)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs transition-all font-semibold ${
                    isSelected
                      ? "bg-white text-stone-900 shadow-xs font-bold"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  <MapPin className={`w-3.5 h-3.5 ${isSelected ? "text-emerald-700" : "text-stone-400"}`} />
                  <span>{loc.name}</span>
                  {locKey === "kurigram" && (
                    <span className="text-[9px] uppercase px-1 rounded bg-emerald-100 text-emerald-900 font-bold">
                      Pilot
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* ================================================================= */}
        {/* 2. REGIONAL OVERVIEW BANNER */}
        {/* ================================================================= */}
        <section className="p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Active Corridor Profile
              </span>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-stone-900">{activeProfile.name}</h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                  {activeProfile.region}
                </span>
              </div>
              <p className="text-xs text-stone-600 font-normal">
                {activeProfile.canalSystem} • Coordinates: <span className="font-mono text-stone-800">{activeProfile.coordinates}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-stone-200 lg:pl-6">
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Crop Focus</span>
                <strong className="text-stone-900 font-bold block mt-0.5">{activeProfile.cropFocus}</strong>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Water Stress</span>
                <strong className="text-amber-900 font-bold block mt-0.5">{activeProfile.waterStress}</strong>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Canal Stage Target</span>
                <strong className="text-sky-900 font-bold block mt-0.5">{activeProfile.depthMeters} m Depth</strong>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Edge Protocol</span>
                <strong className="text-emerald-900 font-bold block mt-0.5">ESP-NOW / MQTT</strong>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleRefresh}
                className={`p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors ${
                  isRefreshing ? "animate-spin text-emerald-800" : ""
                }`}
                title="Refresh sensor telemetry"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <Link
                href="/twin"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-900 text-stone-100 hover:bg-emerald-800 font-bold text-xs transition-colors shadow-xs"
              >
                <span>Launch 2.5D Twin</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 3. 4-COLUMN REGIONAL TELEMETRY METRICS */}
        {/* ================================================================= */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-stone-400 text-xs">
              <span className="font-bold uppercase tracking-wider text-[10px]">Canal Water Stage</span>
              <Waves className="w-4 h-4 text-sky-600" />
            </div>
            <div className="mt-3">
              <div className="text-3xl font-bold text-sky-900">{canalDepthMeters} m</div>
              <p className="text-[11px] text-stone-500 mt-1">Ultrasonic level sensor reading (Safe buffer: &gt; 1.2m)</p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px]">
              <span className="text-stone-500">Surface Flow:</span>
              <strong className="text-stone-800 font-mono">0.45 m/s</strong>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-stone-400 text-xs">
              <span className="font-bold uppercase tracking-wider text-[10px]">Canal Solar Canopy</span>
              <Sun className="w-4 h-4 text-amber-600" />
            </div>
            <div className="mt-3">
              <div className="text-3xl font-bold text-amber-900">{solarWatts} W</div>
              <p className="text-[11px] text-stone-500 mt-1">5x PV array + water vapor microclimate cooling (+3.8%)</p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px]">
              <span className="text-stone-500">Irradiance:</span>
              <strong className="text-stone-800 font-mono">880 W/m²</strong>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-stone-400 text-xs">
              <span className="font-bold uppercase tracking-wider text-[10px]">DC Submersible Pump</span>
              <Droplets className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-3">
              <div className="text-3xl font-bold text-stone-900">
                {isPumpRunning ? `${flowRateLpm} LPM` : "0.0 LPM"}
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                {isPumpRunning
                  ? `Active on Plot ${activePlotId} (Remaining: ${timerStr})`
                  : "Pump latched off • Zero water waste"}
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px]">
              <span className="text-stone-500">Pump Load:</span>
              <strong className="text-sky-900 font-mono">{pumpWatts} W</strong>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-stone-400 text-xs">
              <span className="font-bold uppercase tracking-wider text-[10px]">33kV Rural Grid Feed</span>
              <Zap className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="mt-3">
              <div className="text-3xl font-bold text-emerald-900">+{gridWatts} W</div>
              <p className="text-[11px] text-stone-500 mt-1">
                {pumpWatts > 0 ? "Surplus export (X = 365W)" : "100% Full bypass (X + Y = 485W)"}
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px]">
              <span className="text-stone-500">Tariff Credit:</span>
              <strong className="text-emerald-900 font-mono">+BDT 4.50 / kWh</strong>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 4. DETAILED TELEMETRY SECTIONS (4 CRITICAL DOMAINS) */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* DOMAIN 1: CANAL HYDROLOGICAL LOG */}
          <section className="p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200/80">
              <h3 className="font-bold text-stone-900 flex items-center gap-2">
                <Waves className="w-4 h-4 text-sky-700" />
                <span>1. Canal Hydrological & Evaporation Log</span>
              </h3>
              <span className="text-[11px] font-mono text-stone-400">SENSOR-HYD-04</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Water Temperature</span>
                <span className="text-lg font-bold text-stone-900 block mt-0.5">22.4°C</span>
                <p className="text-[11px] text-stone-500 mt-0.5">4.2°C cooler than dry ambient soil</p>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Dissolved Oxygen</span>
                <span className="text-lg font-bold text-stone-900 block mt-0.5">7.2 mg/L</span>
                <p className="text-[11px] text-stone-500 mt-0.5">Healthy aquatic ecosystem under canopy</p>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Canal Surface Velocity</span>
                <span className="text-lg font-bold text-stone-900 block mt-0.5">0.45 m/s</span>
                <p className="text-[11px] text-stone-500 mt-0.5">Teesta-Jamuna steady diversion rate</p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <span className="text-emerald-800 block text-[10px] uppercase font-bold">Pan Evaporation Blocked</span>
                <span className="text-lg font-bold text-emerald-950 block mt-0.5">185 Liters</span>
                <p className="text-[11px] text-emerald-800 mt-0.5">Conserved from atmosphere today</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-100/70 text-xs text-stone-600 leading-relaxed">
              <strong className="text-stone-900 block mb-0.5">Hydrological Summary:</strong>
              Open pan evaporation during Kurigram's March heat reaches 8.5 mm/day. By elevating 5x monocrystalline PV panels across the 4.2m canal corridor, 72% of solar thermal radiation is blocked from heating the water, preserving canal depth for downstream smallholders.
            </div>
          </section>

          {/* DOMAIN 2: ELECTRICAL ROUTING LEDGER */}
          <section className="p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200/80">
              <h3 className="font-bold text-stone-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-800" />
                <span>2. Electrical Routing Ledger (Dynamic X + Y)</span>
              </h3>
              <span className="text-[11px] font-mono text-stone-400">GRID-METER-01</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Total PV Generated Today</span>
                <span className="text-lg font-bold text-stone-900 block mt-0.5">3.85 kWh</span>
                <p className="text-[11px] text-stone-500 mt-0.5">3.88 kWh diurnal projected target</p>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Pumping Energy Used</span>
                <span className="text-lg font-bold text-sky-900 block mt-0.5">0.12 kWh</span>
                <p className="text-[11px] text-stone-500 mt-0.5">10-minute precision AWD quota</p>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Clean Grid Export Today</span>
                <span className="text-lg font-bold text-emerald-900 block mt-0.5">3.73 kWh</span>
                <p className="text-[11px] text-stone-500 mt-0.5">Net-metered feed to village feeder</p>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Inverter Power Factor</span>
                <span className="text-lg font-bold text-stone-900 block mt-0.5">0.98 pf</span>
                <p className="text-[11px] text-stone-500 mt-0.5">High harmonic compliance</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 leading-relaxed">
              <strong className="block mb-0.5">Zero Chemical Battery Architecture:</strong>
              No expensive lead-acid or lithium batteries to maintain or replace. While pumping Plot 4, 365W streams directly into the grid; once Plot 4 reaches AWD capacity, 100% (485W) bypasses directly to rural electrification.
            </div>
          </section>

          {/* DOMAIN 3: 6-PLOT SOIL & AWD MOISTURE MATRIX */}
          <section className="p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200/80">
              <h3 className="font-bold text-stone-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-700" />
                <span>3. 6-Plot Soil Matric Potential & Moisture Matrix</span>
              </h3>
              <span className="text-[11px] font-mono text-stone-400">AWD-RADIAL-06</span>
            </div>

            <div className="space-y-2.5">
              {plots.map((p) => {
                const isPlot4 = p.id === 4;
                const isWatering = p.id === activePlotId && isPumpRunning;
                return (
                  <div
                    key={p.id}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 text-xs ${
                      isPlot4
                        ? "bg-amber-50/80 border-amber-300 ring-1 ring-amber-400/50"
                        : "bg-stone-50 border-stone-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                          isWatering
                            ? "bg-sky-600 text-white animate-pulse"
                            : isPlot4
                            ? "bg-amber-700 text-white"
                            : "bg-stone-200 text-stone-700"
                        }`}
                      >
                        P{p.id}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <strong className="text-stone-900 font-bold">{p.name}</strong>
                          <span className="text-[10px] text-stone-500">({p.cropStage})</span>
                        </div>
                        <span className="text-[11px] text-stone-600">
                          Moisture: <strong className={isPlot4 ? "text-rose-700" : "text-stone-800"}>{p.moisture}%</strong> • AWD Level:{" "}
                          <strong className={isPlot4 ? "text-rose-700" : "text-stone-800"}>{p.awdTubeCm} cm</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isWatering ? (
                        <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-900 font-bold text-[10px] animate-pulse">
                          WATERING (10m)
                        </span>
                      ) : isPlot4 ? (
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-900 font-bold text-[10px]">
                          CRITICAL AWD DEFICIT
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-stone-200/80 text-stone-600 font-semibold text-[10px]">
                          Standby (Safe)
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3 rounded-xl bg-stone-100 text-[11px] text-stone-600">
              <strong>BRRI AWD Rule:</strong> Water is replenished only when field water level drops to 15 cm below soil surface (-15 cm in perforated tube). Plot 4 reached this threshold today; all other plots remain within safe rootzone reserves.
            </div>
          </section>

          {/* DOMAIN 4: HARDWARE HEALTH & DIAGNOSTICS */}
          <section className="p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200/80">
              <h3 className="font-bold text-stone-900 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-800" />
                <span>4. Hardware Health, Diagnostics & Cost Compliance</span>
              </h3>
              <span className="text-[11px] font-mono text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                ALL SYSTEMS NOMINAL
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-600" />
                  <div>
                    <span className="font-bold text-stone-900 block">ESP32-S3 Dual-Core Edge Node</span>
                    <span className="text-[11px] text-stone-500">FreeRTOS Closed Loop • Firmware v2.4</span>
                  </div>
                </div>
                <span className="font-mono text-stone-700 text-[11px]">RSSI: -58 dBm (Strong)</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-600" />
                  <div>
                    <span className="font-bold text-stone-900 block">6-Way Bistable Latching Solenoids</span>
                    <span className="text-[11px] text-stone-500">50ms Pulse Drive • Zero Standby Power</span>
                  </div>
                </div>
                <span className="font-mono text-emerald-800 text-[11px] font-bold">Valve #4 Latched</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-600" />
                  <div>
                    <span className="font-bold text-stone-900 block">Ultrasonic Canal Stage Sensor</span>
                    <span className="text-[11px] text-stone-500">JSN-SR04T Waterproof Transducer</span>
                  </div>
                </div>
                <span className="font-mono text-stone-700 text-[11px]">1.85m ± 2mm Accuracy</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-amber-600" />
                  <div>
                    <span className="font-bold text-stone-900 block">Piezo Acoustic Warning Buzzer</span>
                    <span className="text-[11px] text-stone-500">880 Hz / 1174 Hz Chime for Minute 9</span>
                  </div>
                </div>
                <span className="font-mono text-stone-700 text-[11px]">Armed for Minute 9</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between text-xs">
              <div>
                <strong className="text-emerald-950 font-bold block">Frugal Innovation BOM Compliance:</strong>
                <span className="text-emerald-800 text-[11px]">Total hardware unit cost strictly engineered for rural affordability</span>
              </div>
              <strong className="text-emerald-950 font-bold text-sm bg-white px-2.5 py-1 rounded-lg border border-emerald-300">
                BDT 20,000 Target
              </strong>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 border-t border-stone-200/80 bg-[#f7f6f2] text-xs text-stone-600">
        <div className="editorial-container max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <span>SolariQ Area Telemetry Console • Active Demonstration: {activeProfile.name}</span>
          <div className="flex items-center gap-3">
            <Link href="/" className="hover:text-stone-900 underline">Story & Vision</Link>
            <span>•</span>
            <Link href="/twin" className="hover:text-stone-900 underline">2.5D Digital Twin</Link>
            <span>•</span>
            <span>Cost Target: <strong className="text-emerald-900">BDT 20,000</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
