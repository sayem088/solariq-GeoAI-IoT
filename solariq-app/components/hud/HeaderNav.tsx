"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNexusStore, locationProfiles, DeploymentLocation } from "@/lib/nexusStore";
import {
  LayoutDashboard,
  Layers,
  ChevronDown,
  Check,
  MapPin,
  Menu,
  X,
  BookOpen,
} from "lucide-react";

interface HeaderNavProps {
  onOpenHowItWorks?: () => void;
}

export default function HeaderNav({ onOpenHowItWorks }: HeaderNavProps) {
  const pathname = usePathname();
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { selectedLocation, setLocation } = useNexusStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeProfile = locationProfiles[selectedLocation];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsLocationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full bg-[#fbfbfa]/90 backdrop-blur-md border-b border-stone-200/60 sticky top-0 z-50">
      <div className="editorial-container max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 h-16 flex items-center justify-between">
        {/* ============================================================= */}
        {/* 1. MINIMALIST BRAND IDENTITY (SolariQ.world) */}
        {/* ============================================================= */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg bg-emerald-900 text-stone-100 flex items-center justify-center font-bold text-xs tracking-tight shadow-2xs group-hover:bg-emerald-800 transition-colors">
            SQ
          </div>
          <div className="flex items-baseline">
            <span className="text-base font-bold tracking-tight text-stone-900">
              SolariQ
            </span>
            <span className="text-xs font-semibold text-emerald-800 ml-0.5">.world</span>
          </div>
        </Link>

        {/* ============================================================= */}
        {/* 2. SERENE, EDITORIAL NAVIGATION LINKS */}
        {/* ============================================================= */}
        <nav className="hidden md:flex items-center gap-8 text-xs">
          <Link
            href="/"
            className={`relative py-2 font-medium tracking-wide transition-colors ${
              pathname === "/"
                ? "text-stone-950 font-bold"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            <span>Story & Vision</span>
            {pathname === "/" && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-emerald-800 rounded-full" />
            )}
          </Link>

          <Link
            href="/twin"
            className={`relative py-2 font-medium tracking-wide flex items-center gap-1.5 transition-colors ${
              pathname === "/twin"
                ? "text-stone-950 font-bold"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            <Layers className={`w-3.5 h-3.5 ${pathname === "/twin" ? "text-emerald-800" : "text-stone-400"}`} />
            <span>2.5D Digital Twin</span>
            {pathname === "/twin" && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-emerald-800 rounded-full" />
            )}
          </Link>

          <Link
            href="/dashboard"
            className={`relative py-2 font-medium tracking-wide flex items-center gap-1.5 transition-colors ${
              pathname === "/dashboard"
                ? "text-stone-950 font-bold"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            <LayoutDashboard className={`w-3.5 h-3.5 ${pathname === "/dashboard" ? "text-emerald-800" : "text-stone-400"}`} />
            <span>Area Dashboard</span>
            {pathname === "/dashboard" && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-emerald-800 rounded-full" />
            )}
          </Link>

          <Link
            href="/work"
            className={`relative py-2 font-medium tracking-wide flex items-center gap-1.5 transition-colors ${
              pathname === "/work"
                ? "text-stone-950 font-bold"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${pathname === "/work" ? "bg-emerald-600 animate-pulse" : "bg-stone-300"}`} />
            <span>Live Demo</span>
            {pathname === "/work" && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-emerald-800 rounded-full" />
            )}
          </Link>
        </nav>

        {/* ============================================================= */}
        {/* 3. REFINED, QUIET ACTIONS */}
        {/* ============================================================= */}
        <div className="flex items-center gap-3">
          {/* Subtle Testbed Switcher Pill */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsLocationOpen(!isLocationOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-stone-700 hover:text-stone-900 hover:bg-stone-100/80 border border-stone-200/90 transition-all bg-white/70 shadow-2xs"
              title="Select demonstration corridor"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-[11px] text-stone-400 font-normal hidden sm:inline">Prototype:</span>
              <span className="font-semibold text-stone-800 text-[11px] sm:text-xs">
                {activeProfile.name.split(" ")[0]}
              </span>
              <ChevronDown
                className={`w-3 h-3 text-stone-400 transition-transform ${
                  isLocationOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isLocationOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-stone-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3.5 py-1.5 border-b border-stone-100 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  Select Demonstration Corridor
                </div>
                {(Object.keys(locationProfiles) as DeploymentLocation[]).map((locKey) => {
                  const loc = locationProfiles[locKey];
                  const isSelected = selectedLocation === locKey;
                  return (
                    <button
                      key={locKey}
                      onClick={() => {
                        setLocation(locKey);
                        setIsLocationOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 flex items-start gap-2.5 transition-colors ${
                        isSelected ? "bg-emerald-50/70 text-emerald-950" : "hover:bg-stone-50 text-stone-700"
                      }`}
                    >
                      <MapPin className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isSelected ? "text-emerald-700" : "text-stone-400"}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs ${isSelected ? "font-bold text-stone-900" : "font-semibold"}`}>
                            {loc.name}
                          </span>
                          {locKey === "kurigram" && (
                            <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-1.5 py-0.2 rounded">
                              Pilot
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-stone-400 mt-0.5 truncate">
                          {loc.canalSystem}
                        </p>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Minimalist "How It Works" Trigger */}
          {onOpenHowItWorks && (
            <button
              onClick={onOpenHowItWorks}
              className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-stone-900 text-stone-100 hover:bg-emerald-900 transition-colors shadow-2xs"
            >
              How It Works
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200/80 bg-[#fbfbfa] px-4 py-3 space-y-2 text-xs">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block py-2 px-3 rounded-lg font-semibold ${
              pathname === "/" ? "bg-emerald-100/70 text-emerald-950 font-bold" : "text-stone-700"
            }`}
          >
            Story & Vision
          </Link>
          <Link
            href="/twin"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block py-2 px-3 rounded-lg font-semibold ${
              pathname === "/twin" ? "bg-emerald-100/70 text-emerald-950 font-bold" : "text-stone-700"
            }`}
          >
            2.5D Digital Twin
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block py-2 px-3 rounded-lg font-semibold ${
              pathname === "/dashboard" ? "bg-emerald-100/70 text-emerald-950 font-bold" : "text-stone-700"
            }`}
          >
            Area Dashboard
          </Link>
        </div>
      )}
    </header>
  );
}
