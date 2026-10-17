"use client";

import React from "react";
import { X, Sun, Droplets, Zap, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HowItWorksModal({ isOpen, onClose }: HowItWorksModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600">
            <Sun className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-sans">
              How SolariQ Works in 4 Simple Steps
            </h2>
            <p className="text-xs text-slate-500">
              Universal Canal–Agri Adaptive Framework • Demonstrated at Kurigram Pilot 01
            </p>
          </div>
        </div>

        {/* 4 Illustrated Steps */}
        <div className="space-y-4 text-xs font-sans">
          {/* Step 1 */}
          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-amber-500 text-white font-bold font-mono flex items-center justify-center shrink-0 text-xs">
              1
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Canal Shading & Free Space</h4>
              <p className="text-slate-600 mt-1 leading-relaxed">
                Solar panels are built over irrigation canals rather than precious farmland. This blocks the sun from drying up the canal (<strong>72% less evaporation</strong>) while cool canal water naturally cools the panels from beneath, increasing electricity output by <strong>+3.8%</strong>.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold font-mono flex items-center justify-center shrink-0 text-xs">
              2
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Smart Alternate Wetting and Drying (AWD)</h4>
              <p className="text-slate-600 mt-1 leading-relaxed">
                Rice paddies do not need continuous deep flooding! Perforated AWD pipes measure water depth underground. As long as water is within <strong>15 cm below ground</strong>, rice roots stay healthy. This cuts total water consumption by <strong>30%</strong> and slashes global-warming methane emissions by <strong>35%</strong>.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-3.5 rounded-xl bg-sky-50/60 border border-sky-200 flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-sky-600 text-white font-bold font-mono flex items-center justify-center shrink-0 text-xs">
              3
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Precision 10-Minute Solar Pumping</h4>
              <p className="text-slate-600 mt-1 leading-relaxed">
                When Plot 4 drops to -15 cm, the on-site ESP32 computer automatically opens Plot 4's valve and runs the solar DC pump for exactly 10 minutes (42 L/min). At minute 9, a buzzer alerts the farmer. At minute 10, the valve shuts tight to prevent wasting a single drop.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-300 flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-emerald-700 text-white font-bold font-mono flex items-center justify-center shrink-0 text-xs">
              4
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">The $X + Y$ Clean Grid Export Rule</h4>
              <p className="text-slate-600 mt-1 leading-relaxed">
                While pumping: <strong>Solar (485W) - Pump (120W) = 365W</strong> exported to the rural grid. When the pump shuts off, <strong>100% of solar power (485W)</strong> flows directly into the village 33kV grid, earning net-metering income under Bangladesh SREDA guidelines!
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-500">
            Prototype Cost: <strong className="text-emerald-700">BDT 20,000</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-xs"
          >
            Got it, Let's Explore!
          </button>
        </div>
      </div>
    </div>
  );
}
