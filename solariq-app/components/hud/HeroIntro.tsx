"use client";

import React from "react";
import Link from "next/link";
import { useNexusStore, ScenarioMode, locationProfiles, DeploymentLocation } from "@/lib/nexusStore";
import {
  Sun,
  CloudRain,
  Snowflake,
  Moon,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  MapPin,
  Globe,
  LayoutDashboard,
  Layers,
} from "lucide-react";

export default function HeroIntro() {
  const { scenarioMode, setScenarioMode, selectedLocation, setLocation } = useNexusStore();
  const activeProfile = locationProfiles[selectedLocation];

  return (
    <section className="w-full pt-8 pb-6 border-b border-stone-200/60 select-none">
      <div className="editorial-container max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 flex flex-col gap-6">
        {/* Top Badges & Headline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/10 text-emerald-900 text-xs font-bold tracking-wide">
                <Globe className="w-3.5 h-3.5 text-emerald-700" />
                <span>Bangladesh Canal–Agri Nexus</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-950 text-xs font-bold">
                <MapPin className="w-3.5 h-3.5 text-amber-700" />
                <span>Prototype Testbed: Kurigram</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 leading-[1.15]">
              Sun on Water. Life in Soil.
            </h1>

            <p className="mt-3 text-stone-600 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
              Elevating modular solar PV over public irrigation canals suppresses water evaporation, powers precision rootzone irrigation, and exports surplus clean electricity directly into rural village grids.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 mt-5">
              <Link
                href="/twin"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-900 text-stone-100 font-bold hover:bg-emerald-800 transition-all text-xs shadow-xs hover:scale-105"
              >
                <Layers className="w-3.5 h-3.5 text-emerald-300" />
                <span>Launch 2.5D Digital Twin</span>
                <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
              </Link>

              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-stone-800 font-bold border border-stone-300/80 hover:bg-stone-100 hover:border-stone-400 transition-all text-xs shadow-2xs hover:scale-105"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-emerald-700" />
                <span>View Regional Dashboard ⊞</span>
              </Link>
            </div>
          </div>

          {/* Minimalist Scenario Presets */}
          <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
            <span className="text-[11px] uppercase tracking-wider text-stone-400 font-bold">
              Simulate Climate Scenario:
            </span>

            <div className="inline-flex flex-wrap p-1 rounded-full bg-stone-200/60 gap-1">
              <button
                onClick={() => setScenarioMode("kurigram-dry")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  scenarioMode === "kurigram-dry"
                    ? "bg-white text-stone-900 shadow-xs font-bold"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-600" />
                <span>Summer Dry</span>
              </button>

              <button
                onClick={() => setScenarioMode("monsoon-rain")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  scenarioMode === "monsoon-rain"
                    ? "bg-white text-stone-900 shadow-xs font-bold"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <CloudRain className="w-3.5 h-3.5 text-sky-600" />
                <span>Rain Preempt</span>
              </button>

              <button
                onClick={() => setScenarioMode("winter-micro")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  scenarioMode === "winter-micro"
                    ? "bg-white text-stone-900 shadow-xs font-bold"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <Snowflake className="w-3.5 h-3.5 text-emerald-700" />
                <span>Winter Drip</span>
              </button>

              <button
                onClick={() => setScenarioMode("night-standby")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  scenarioMode === "night-standby"
                    ? "bg-stone-900 text-white shadow-xs font-bold"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-stone-400" />
                <span>Night</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scalable Testbed Corridor Selector Strip */}
        <div className="pt-3 border-t border-stone-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-stone-400 font-bold shrink-0">
              Demonstration Corridors:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(locationProfiles) as DeploymentLocation[]).map((locKey) => {
                const loc = locationProfiles[locKey];
                const isSelected = selectedLocation === locKey;
                return (
                  <button
                    key={locKey}
                    onClick={() => setLocation(locKey)}
                    className={`px-3 py-1 rounded-full text-xs transition-all font-semibold ${
                      isSelected
                        ? "bg-stone-900 text-stone-100 shadow-2xs font-bold"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200/80 hover:text-stone-900"
                    }`}
                  >
                    <span>{loc.name}</span>
                    {locKey === "kurigram" && (
                      <span className="ml-1.5 text-[9px] uppercase tracking-wider bg-emerald-800 text-emerald-100 px-1.5 py-0.2 rounded-full">
                        Pilot
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Corridor Telemetry Pill */}
          <div className="flex items-center gap-2 text-stone-500 text-[11px]">
            <span className="font-semibold text-stone-800">{activeProfile.canalSystem}</span>
            <span>•</span>
            <span>{activeProfile.coordinates}</span>
            <span>•</span>
            <span className="text-emerald-800 font-bold">{activeProfile.cropFocus}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

