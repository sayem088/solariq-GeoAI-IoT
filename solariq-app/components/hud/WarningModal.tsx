"use client";

import React, { useEffect } from "react";
import { useNexusStore } from "@/lib/nexusStore";
import { playWarningBuzzer, playSolenoidClick, playGridDivertChime } from "@/components/audio/BuzzerSynth";
import { AlertTriangle, Bell, ArrowRight, PowerOff } from "lucide-react";

export default function WarningModal() {
  const { isWarningArmed, timerSecondsRemaining, switchToPlot, triggerSmartShutoff } = useNexusStore();

  useEffect(() => {
    if (isWarningArmed) {
      playWarningBuzzer();
    }
  }, [isWarningArmed]);

  if (!isWarningArmed) return null;

  return (
    <div className="fixed inset-x-4 top-20 z-50 max-w-xl mx-auto bg-white border-2 border-rose-300 rounded-2xl p-4 sm:p-5 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex items-start gap-3.5">
        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 animate-bounce">
          <Bell className="w-5 h-5" />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold tracking-wider text-rose-700 uppercase flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> 1-MINUTE SWITCHING WARNING (09:00 ELAPSED)
            </span>
            <span className="px-2 py-0.5 rounded text-xs font-mono font-black bg-rose-600 text-white animate-pulse">
              {timerSecondsRemaining}s LEFT
            </span>
          </div>

          <p className="text-xs text-slate-700 font-sans mt-1.5 leading-relaxed">
            Plot 4 has reached its target AWD soil capacity. Switch to the next plot in the sequence or the system will automatically terminate pumping to prevent water & energy waste, diverting 100% solar power directly into Bangladesh’s national grid!
          </p>

          <div className="flex flex-wrap items-center gap-2.5 mt-3.5 pt-2.5 border-t border-slate-100">
            <button
              onClick={() => {
                playSolenoidClick();
                switchToPlot(5);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-xs"
            >
              <span>Switch to Plot 5</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                playGridDivertChime();
                triggerSmartShutoff();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200 transition-all"
            >
              <PowerOff className="w-3 h-3 text-slate-600" />
              <span>Allow Auto-Shutoff at 10:00</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
