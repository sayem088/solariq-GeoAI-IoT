"use client";

import React, { useEffect, useState } from "react";
import HeaderNav from "@/components/hud/HeaderNav";
import IsometricDigitalTwin from "@/components/twin/IsometricDigitalTwin";
import WarningModal from "@/components/hud/WarningModal";
import HowItWorksModal from "@/components/hud/HowItWorksModal";
import { useNexusStore } from "@/lib/nexusStore";

export default function DigitalTwinPage() {
  const { tickTimer } = useNexusStore();
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  // Heartbeat ticker for the 10-minute pumping cycle countdown
  useEffect(() => {
    const timer = setInterval(() => {
      tickTimer();
    }, 1000);
    return () => clearInterval(timer);
  }, [tickTimer]);

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#fbfbfa] text-stone-900 selection:bg-emerald-900/15 selection:text-emerald-950 font-sans">
      {/* 1. Acoustic & Explainer Modals */}
      <WarningModal />
      <HowItWorksModal isOpen={isHowItWorksOpen} onClose={() => setIsHowItWorksOpen(false)} />

      {/* 2. Top Header Navigation with Page Tabs & Area Dashboard Link */}
      <HeaderNav onOpenHowItWorks={() => setIsHowItWorksOpen(true)} />

      {/* 3. Vector SCADA Digital Twin Canvas */}
      <main className="flex-1 w-full relative">
        <IsometricDigitalTwin />
      </main>
    </div>
  );
}
