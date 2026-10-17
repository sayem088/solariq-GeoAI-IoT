"use client";

import React, { useState } from "react";
import Link from "next/link";
import HeaderNav from "@/components/hud/HeaderNav";
import SolariqNexusConceptSvg from "@/components/story/SolariqNexusConceptSvg";
import SolariqImpactFlowSvg from "@/components/story/SolariqImpactFlowSvg";
import PureCalculationGrid3x3 from "@/components/story/PureCalculationGrid3x3";
import HowItWorksModal from "@/components/hud/HowItWorksModal";
import {
  Layers,
  LayoutDashboard,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbfa] text-stone-900 selection:bg-emerald-900/15 selection:text-emerald-950 font-sans">
      {/* 1. Explainer Modal */}
      <HowItWorksModal isOpen={isHowItWorksOpen} onClose={() => setIsHowItWorksOpen(false)} />

      {/* 2. Minimalist & Elegant Header Navigation */}
      <HeaderNav onOpenHowItWorks={() => setIsHowItWorksOpen(true)} />

      <main className="editorial-container max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-8 pb-16 space-y-12 flex-1 w-full">
        {/* ============================================================= */}
        {/* 🌟 1. MINIMAL HERO HEADLINE (CLEAN & MINIMAL TEXT) */}
        {/* ============================================================= */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-900 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>Bangladesh Canal–Agri Nexus • Prototype Testbed: Kurigram</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 leading-[1.15]">
            Sun on Water. Life in Soil.
          </h1>

          <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal">
            Elevating modular solar PV over public irrigation canals suppresses water evaporation, powers autonomous AWD rice irrigation, and feeds clean energy directly into rural village grids.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
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
              <span>Area Telemetry Dashboard ⊞</span>
            </Link>
          </div>
        </section>

        {/* ============================================================= */}
        {/* 🌟 2. PROJECT CONCEPT SVG DIAGRAM (FIRST THING ON THE PAGE!) */}
        {/* ============================================================= */}
        <section className="w-full">
          <SolariqNexusConceptSvg />
        </section>

        {/* ============================================================= */}
        {/* 🌟 3. HOW IT WORKS & WHAT IT CONTRIBUTES TO THE WORLD (2ND SVG) */}
        {/* ============================================================= */}
        <section className="w-full">
          <SolariqImpactFlowSvg />
        </section>

        {/* ============================================================= */}
        {/* 🌟 3. 3×3 PURE CALCULATION MATRIX & SCIENTIFIC REFERENCES */}
        {/* ============================================================= */}
        <section className="w-full">
          <PureCalculationGrid3x3 />
        </section>

        {/* ============================================================= */}
        {/* 🚀 4. SYSTEM EXPLORATION GATEWAYS */}
        {/* ============================================================= */}
        <section className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/twin"
            className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-emerald-700 transition-all group flex items-center justify-between shadow-2xs hover:shadow-xs"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>Full 100vh Vector SCADA</span>
              </span>
              <h4 className="text-base font-bold text-stone-900 group-hover:text-emerald-950 font-serif">
                2.5D Cyber-Physical Digital Twin →
              </h4>
              <p className="text-stone-500 text-xs">
                Step through the 5-step operational timeline, live manifold latching & 24h physics audit.
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-stone-400 group-hover:text-emerald-800 group-hover:translate-x-1 transition-all shrink-0 ml-4" />
          </Link>

          <Link
            href="/dashboard"
            className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-emerald-700 transition-all group flex items-center justify-between shadow-2xs hover:shadow-xs"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-600" />
                <span>Live Edge Telemetry Stream</span>
              </span>
              <h4 className="text-base font-bold text-stone-900 group-hover:text-emerald-950 font-serif">
                Area-Based Regional SCADA Console →
              </h4>
              <p className="text-stone-500 text-xs">
                Inspect real-time ESP32-S3 sensor feeds, canal hydrology logs & 6-plot AWD moisture matrix.
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-stone-400 group-hover:text-emerald-800 group-hover:translate-x-1 transition-all shrink-0 ml-4" />
          </Link>
        </section>
      </main>

      {/* Institutional Credits Footer */}
      <footer className="w-full py-8 border-t border-stone-200/80 bg-[#f7f6f2] text-xs text-stone-600">
        <div className="editorial-container max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <span className="font-bold text-stone-900 block text-sm">
              SolariQ.world — Adaptive Solar & Edge-AI IoT Canal–Agri Framework
            </span>
            <p className="text-stone-500 text-[11px] mt-0.5">
              National Scalable Architecture for Bangladesh BWDB Canals • Demonstration Prototype at Kurigram
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-stone-600 text-xs">
            <span>Team: <strong className="text-stone-900">SolariQ</strong></span>
            <span>•</span>
            <span>Lead: <strong className="text-stone-900">Md Abu Sayem Sarker</strong></span>
            <span>•</span>
            <span>Institution: <strong className="text-stone-900">Daffodil International University (DIU)</strong></span>
            <span>•</span>
            <span>Cost Target: <strong className="text-emerald-900 font-bold">BDT 20,000</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
