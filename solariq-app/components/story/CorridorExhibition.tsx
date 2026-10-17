"use client";

import React from "react";
import Link from "next/link";
import { useNexusStore, locationProfiles, DeploymentLocation } from "@/lib/nexusStore";
import {
  MapPin,
  Waves,
  Sun,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Layers,
  Compass,
} from "lucide-react";

export default function CorridorExhibition() {
  const { selectedLocation, setLocation } = useNexusStore();

  const corridors: {
    id: DeploymentLocation;
    number: string;
    name: string;
    basin: string;
    focus: string;
    challenges: string;
    impact: string;
    isPilot: boolean;
  }[] = [
    {
      id: "kurigram",
      number: "01",
      name: "Kurigram Pilot 01",
      basin: "Teesta-Jamuna Irrigation Basin (Rangpur Division)",
      focus: "Boro Rice (BRRI dhan29) under Alternate Wetting and Drying (AWD)",
      challenges: "Severe March pan evaporation (8.5mm/day), rapid water table decline, high diesel pump fuel cost (BDT 105/L).",
      impact: "72% canal evaporation blocked, 420L precision 10-minute cycles, BDT 68.25 diesel avoided per watering.",
      isPilot: true,
    },
    {
      id: "barind",
      number: "02",
      name: "Barind Deployment 02",
      basin: "Barind Tract Arid Corridor (Rajshahi Division)",
      focus: "Deep Aquifer Depletion Mitigation & Mixed Dryland Crops",
      challenges: "Over-extracted groundwater, dry season canal cracking, falling static water level (>35m deep).",
      impact: "Surface water diversion relieves deep tubewell stress, saving 1.2M Liters of deep aquifer water per km.",
      isPilot: false,
    },
    {
      id: "kushtia-gk",
      number: "03",
      name: "Kushtia GK Reach 03",
      basin: "Ganges-Kobodak (GK) Irrigation Project (Khulna Division)",
      focus: "Large-Scale River Diversion & High-Volume Gravity Canal Corridors",
      challenges: "Wide open surface area exposed to intense solar insolation, long-distance canal conveyance losses.",
      impact: "Elevated PV arrays form a contiguous 2.1m depth solar canopy, generating MW-scale clean electricity for rural feeders.",
      isPilot: false,
    },
    {
      id: "universal",
      number: "04",
      name: "Universal Modular Corridor",
      basin: "National Standard Modular Canal Airspace Specification",
      focus: "Prefabricated Modular Canal-Top PV & Autonomous Edge IoT Hubs",
      challenges: "Arable agricultural land scarcity in densely populated Bangladesh (0.05 ha per capita).",
      impact: "Zero arable land acquisition required; transforms 5,000+ km of public BWDB canals into renewable energy arteries.",
      isPilot: false,
    },
  ];

  return (
    <section className="w-full py-16 border-b border-stone-200/60 bg-[#fbfbfa]">
      <div className="editorial-container max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-full inline-block">
              National Scalability Matrix
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
              From Kurigram Pilot to 5,000+ Kilometers of Canals
            </h2>
            <p className="text-stone-600 text-sm leading-relaxed">
              While the active cyber-physical testbed is deployed in Kurigram, SolariQ is engineered as a universal prefabricated standard for canal networks managed by the Bangladesh Water Development Board (BWDB).
            </p>
          </div>

          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 hover:text-emerald-700 transition-colors shrink-0 group"
          >
            <span>Explore all basins in Area Dashboard</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 4 Corridors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {corridors.map((c) => {
            const isSelected = selectedLocation === c.id;
            return (
              <div
                key={c.id}
                onClick={() => setLocation(c.id)}
                className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-white border-emerald-700/80 ring-2 ring-emerald-700/20 shadow-md"
                    : "bg-white/70 hover:bg-white border-stone-200/90 hover:border-stone-300 shadow-2xs"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold font-mono text-stone-300">
                      {c.number}
                    </span>
                    {c.isPilot ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-900 text-stone-100">
                        Active Testbed
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                        Scale Reach
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-stone-900">{c.name}</h3>
                    <p className="text-[11px] font-medium text-emerald-800 mt-0.5">{c.basin}</p>
                  </div>

                  <div className="space-y-2 text-xs pt-3 border-t border-stone-100">
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">Agronomic Focus</span>
                      <p className="text-stone-700 font-medium mt-0.5">{c.focus}</p>
                    </div>

                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">Regional Challenge</span>
                      <p className="text-stone-600 text-[11px] mt-0.5 leading-relaxed">{c.challenges}</p>
                    </div>

                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">Quantified Impact</span>
                      <p className="text-emerald-950 font-semibold text-[11px] mt-0.5 leading-relaxed">{c.impact}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className={`font-semibold ${isSelected ? "text-emerald-800" : "text-stone-500"}`}>
                    {isSelected ? "● Selected Corridor" : "Click to Preview"}
                  </span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? "text-emerald-800" : "text-stone-400"}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
