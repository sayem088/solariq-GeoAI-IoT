"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { useNexusStore } from "@/lib/nexusStore";

export default function PlotCluster() {
  const { plots, activePlotId, isPumpRunning, step } = useNexusStore();
  const alertRingRef = useRef<THREE.Mesh>(null);

  // Animate warning pulse on Plot 4 in Step 1
  useFrame((state) => {
    if (alertRingRef.current && step === 1) {
      const scale = 1 + Math.sin(state.clock.getElapsedTime() * 4) * 0.08;
      alertRingRef.current.scale.set(scale, 1, scale);
    }
  });

  // Coordinates for the 6 plots in front of the canal
  const plotPositions: [number, number, number][] = [
    [-8.0, 0, 9.5], // Plot 1
    [-4.8, 0, 9.5], // Plot 2
    [-1.6, 0, 9.5], // Plot 3
    [1.6, 0, 9.5],  // Plot 4 (Target)
    [4.8, 0, 9.5],  // Plot 5
    [8.0, 0, 9.5],  // Plot 6
  ];

  return (
    <group position={[0, 0, 0]}>
      {plots.map((plot, idx) => {
        const [x, y, z] = plotPositions[idx];
        const isSelected = plot.id === activePlotId;
        const isWatering = isSelected && isPumpRunning;
        const isCritical = plot.moisture < 30;

        return (
          <group key={plot.id} position={[x, y, z]}>
            {/* 1. Earthen Bund Borders (Raised clay dike) */}
            <mesh position={[0, 0.12, 0]} receiveShadow castShadow>
              <boxGeometry args={[2.8, 0.24, 4.4]} />
              <meshStandardMaterial color="#78350f" roughness={0.85} />
            </mesh>

            {/* 2. Inner Paddy Soil Bed */}
            <mesh position={[0, 0.2, 0]} receiveShadow>
              <boxGeometry args={[2.5, 0.08, 4.1]} />
              <meshStandardMaterial
                color={
                  isWatering
                    ? "#1e293b" // Wet flooded loam
                    : isCritical
                    ? "#92400e" // Parched dry loam
                    : "#365314" // Moist rich agricultural loam
                }
                roughness={isWatering ? 0.2 : 0.75}
                metalness={isWatering ? 0.5 : 0.05}
              />
            </mesh>

            {/* 3. Lush Rice Seedling Rows */}
            {[-0.8, -0.4, 0, 0.4, 0.8].map((rx) => (
              <mesh key={`seedling-${rx}`} position={[rx, 0.35, 0]} castShadow>
                <boxGeometry args={[0.16, 0.28, 3.6]} />
                <meshStandardMaterial
                  color={isCritical ? "#a3e635" : "#22c55e"}
                  emissive={isWatering ? "#10b981" : "#000000"}
                  emissiveIntensity={isWatering ? 0.2 : 0}
                  roughness={0.5}
                />
              </mesh>
            ))}

            {/* 4. Shallow Water Gleam Layer when Irrigated */}
            {isWatering && (
              <mesh position={[0, 0.26, 0]}>
                <boxGeometry args={[2.46, 0.02, 4.06]} />
                <meshStandardMaterial
                  color="#38bdf8"
                  emissive="#0284c7"
                  emissiveIntensity={0.3}
                  transparent
                  opacity={0.7}
                  roughness={0.1}
                  metalness={0.7}
                />
              </mesh>
            )}

            {/* 5. 3D Perforated AWD Observation Tube (BRRI Standard Field Sensor) */}
            <group position={[0.9, 0.35, 1.5]}>
              {/* White Perforated PVC Tube */}
              <mesh castShadow>
                <cylinderGeometry args={[0.08, 0.08, 0.55, 12]} />
                <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.1} />
              </mesh>
              {/* Slotted Rings */}
              {[-0.1, 0, 0.1].map((ty) => (
                <mesh key={`slot-${ty}`} position={[0, ty, 0]}>
                  <cylinderGeometry args={[0.085, 0.085, 0.02, 12]} />
                  <meshStandardMaterial color="#334155" />
                </mesh>
              ))}
              {/* Depth Float Bead */}
              <mesh position={[0, plot.awdTubeCm <= -15 ? -0.16 : 0.08, 0]}>
                <sphereGeometry args={[0.065, 12, 12]} />
                <meshBasicMaterial
                  color={plot.awdTubeCm <= -15 ? "#f43f5e" : "#10b981"}
                />
              </mesh>
            </group>

            {/* 6. Step 1 Amber Hazard Contour on Plot 4 */}
            {plot.id === 4 && step === 1 && (
              <mesh ref={alertRingRef} position={[0, 0.28, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[1.5, 1.7, 32]} />
                <meshBasicMaterial color="#f59e0b" side={THREE.DoubleSide} />
              </mesh>
            )}

            {/* 7. Floating 3D Label Badge Above Each Plot */}
            <Html position={[0, 1.2, 0]} center distanceFactor={20}>
              <div
                className={`pointer-events-none px-2 py-0.5 rounded-md text-[10px] font-mono font-bold whitespace-nowrap shadow-lg border backdrop-blur-md transition-all ${
                  isWatering
                    ? "bg-cyan-500 text-black border-cyan-300 ring-2 ring-cyan-400 shadow-cyan-500/50 scale-105"
                    : isCritical
                    ? "bg-rose-500 text-white border-rose-400 shadow-rose-500/50 animate-pulse"
                    : "bg-slate-900/85 text-slate-200 border-white/10"
                }`}
              >
                {plot.name} ({plot.moisture}%)
                {plot.id === 4 && " [AWD -15cm]"}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
