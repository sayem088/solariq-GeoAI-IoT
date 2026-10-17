"use client";

import React, { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import CanalWater from "./CanalWater";
import SolarCanopy from "./SolarCanopy";
import MicroclimateMist from "./MicroclimateMist";
import PumpManifold from "./PumpManifold";
import FlowSplines from "./FlowSplines";
import PlotCluster from "./PlotCluster";
import RainStorm from "./RainStorm";
import PlotWaterSpray from "./PlotWaterSpray";
import { useNexusStore } from "@/lib/nexusStore";
import { Eye, Compass } from "lucide-react";

type CameraPreset = "nexus" | "canal" | "plot4" | "grid";

interface CameraConfig {
  pos: [number, number, number];
  target: [number, number, number];
}

const PRESETS: Record<CameraPreset, CameraConfig> = {
  // Nexus: Perfectly frames the canal (top), pump/manifold (center), 6 plots (front), and grid (right)
  nexus: { pos: [0, 22, 27], target: [0, 0, 5.0] },
  // Canal: Low-angle close-up beneath PV canopy
  canal: { pos: [-5, 4.0, 7.5], target: [-4, 1.2, 0] },
  // Plot 4: Focused on Plot 4 AWD observation tube & crop rows
  plot4: { pos: [1.6, 6.0, 16.5], target: [1.6, 0.4, 9.5] },
  // Grid: High-angle view of 33kV transmission pylon & emerald surge
  grid: { pos: [9, 10, 4], target: [14, 4.0, -5] },
};

function CameraController({ preset }: { preset: CameraPreset }) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const targetConfig = PRESETS[preset];
  const isTransitioning = useRef<boolean>(true);
  const prevPreset = useRef<CameraPreset>(preset);

  useEffect(() => {
    if (prevPreset.current !== preset) {
      prevPreset.current = preset;
      isTransitioning.current = true;
    }
  }, [preset]);

  useFrame((state) => {
    if (isTransitioning.current) {
      const targetVec = new THREE.Vector3(...targetConfig.pos);
      const lookAtVec = new THREE.Vector3(...targetConfig.target);

      state.camera.position.lerp(targetVec, 0.08);

      if (controlsRef.current) {
        controlsRef.current.target.lerp(lookAtVec, 0.08);
        controlsRef.current.update();
      }

      // Once arrived within small threshold, release camera so user can orbit freely!
      if (state.camera.position.distanceTo(targetVec) < 0.25) {
        isTransitioning.current = false;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enablePan={true}
      enableZoom={true}
      maxPolarAngle={Math.PI / 2.05}
      minDistance={5}
      maxDistance={50}
      dampingFactor={0.06}
      target={[0, 0, 5.0]}
    />
  );
}

export default function Scene() {
  const { scenarioMode } = useNexusStore();
  const [activePreset, setActivePreset] = React.useState<CameraPreset>("nexus");

  const isNight = scenarioMode === "night-standby";
  const isRain = scenarioMode === "monsoon-rain";

  return (
    <div className="relative w-full h-[520px] sm:h-[600px] lg:h-[680px] rounded-2xl overflow-hidden glass-panel border border-white/10 shadow-2xl">
      {/* 1. Cinematic Camera Views Toolbar */}
      <div className="absolute top-3 left-3 z-20 flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/10 shadow-xl">
        <span className="text-[10px] font-mono text-slate-400 px-2 flex items-center gap-1">
          <Eye className="w-3.5 h-3.5 text-cyan-400" /> 3D VIEWS:
        </span>

        <button
          onClick={() => setActivePreset("nexus")}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium transition-all ${
            activePreset === "nexus"
              ? "bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 font-bold shadow-[0_0_10px_rgba(0,240,255,0.2)]"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Kurigram Nexus
        </button>

        <button
          onClick={() => setActivePreset("canal")}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium transition-all ${
            activePreset === "canal"
              ? "bg-amber-500/25 text-amber-300 border border-amber-400/50 font-bold shadow-[0_0_10px_rgba(245,158,11,0.2)]"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Canal Shading
        </button>

        <button
          onClick={() => setActivePreset("plot4")}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium transition-all ${
            activePreset === "plot4"
              ? "bg-rose-500/25 text-rose-300 border border-rose-400/50 font-bold shadow-[0_0_10px_rgba(244,63,94,0.25)]"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Plot 4 AWD Pad
        </button>

        <button
          onClick={() => setActivePreset("grid")}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium transition-all ${
            activePreset === "grid"
              ? "bg-emerald-500/25 text-emerald-300 border border-emerald-400/50 font-bold shadow-[0_0_10px_rgba(16,185,129,0.2)]"
              : "text-slate-400 hover:text-white"
          }`}
        >
          33kV Grid Pylon
        </button>
      </div>

      {/* 2. 3D WebGL Canvas */}
      <Canvas
        camera={{ position: [0, 22, 27], fov: 42 }}
        shadows
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        {/* Sky / Scene Deep Indigo Atmosphere */}
        <color attach="background" args={[isNight ? "#03060f" : "#070d1c"]} />
        <fog attach="fog" args={[isNight ? "#03060f" : "#070d1c", 25, 75]} />

        <CameraController preset={activePreset} />

        {/* Studio Lighting System */}
        <ambientLight intensity={isNight ? 0.35 : isRain ? 0.9 : 1.6} />

        {/* Key Directional Sun (Golden Warm Daylight) */}
        <directionalLight
          position={[18, 28, 16]}
          intensity={isNight ? 0.2 : isRain ? 1.0 : 2.8}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-28}
          shadow-camera-right={28}
          shadow-camera-top={28}
          shadow-camera-bottom={-28}
          shadow-bias={-0.0001}
          color="#fffbeb"
        />

        {/* Fill Sky Light (Electric Cyan Microclimate) */}
        <directionalLight position={[-18, 20, -12]} intensity={1.2} color="#38bdf8" />

        {/* Central Hub Bioluminescent Glow */}
        <pointLight position={[0, 2.5, 4.5]} intensity={1.6} color="#00f0ff" distance={20} />
        <pointLight position={[14, 5.0, -6]} intensity={1.4} color="#10b981" distance={18} />

        {/* Rural Agricultural Landscape Ground Terrain */}
        <mesh position={[0, -0.65, 5]} receiveShadow>
          <planeGeometry args={[100, 70]} />
          <meshStandardMaterial
            color={isNight ? "#050a14" : "#09171f"}
            roughness={0.9}
          />
        </mesh>
        
        {/* High-Tech Perspective Grid Helper */}
        <gridHelper
          args={[90, 45, "#1e3a5f", "#0c1b30"]}
          position={[0, -0.62, 5]}
        />

        {/* 3D Scene Components */}
        <Suspense fallback={null}>
          <CanalWater />
          <SolarCanopy />
          <MicroclimateMist />
          <PumpManifold />
          <FlowSplines />
          <PlotCluster />
          <RainStorm />
          <PlotWaterSpray />
        </Suspense>
      </Canvas>

      {/* Floating 3D Navigation Watermark Hint */}
      <div className="absolute bottom-3 right-3 pointer-events-none px-3 py-1 rounded-full bg-slate-900/85 border border-white/5 text-[10px] font-mono text-slate-400 flex items-center gap-1.5 shadow-md">
        <Compass className="w-3 h-3 text-cyan-400" />
        <span>Drag to Orbit • Scroll to Zoom • Select Views</span>
      </div>
    </div>
  );
}
