"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { useNexusStore } from "@/lib/nexusStore";

export default function SolarCanopy() {
  const { solarWatts, scenarioMode } = useNexusStore();
  const canopyRef = useRef<THREE.Group>(null);

  const isSummer = scenarioMode === "kurigram-dry";
  const glowIntensity = Math.min(1, solarWatts / 500);

  return (
    <group ref={canopyRef} position={[0, 0, 0]}>
      {/* 1. Heavy Structural Steel Columns & Diagonal Trusses */}
      {[-12, -6, 0, 6, 12].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          {/* North Column */}
          <mesh position={[0, 2.2, 3.8]} castShadow>
            <cylinderGeometry args={[0.15, 0.18, 4.4, 16]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.25} />
          </mesh>
          {/* South Column */}
          <mesh position={[0, 2.2, -3.8]} castShadow>
            <cylinderGeometry args={[0.15, 0.18, 4.4, 16]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.25} />
          </mesh>
          {/* Main Transverse Truss Beam */}
          <mesh position={[0, 4.4, 0]} castShadow>
            <boxGeometry args={[0.25, 0.25, 8.2]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Diagonal Bracing */}
          <mesh position={[0, 2.8, 1.8]} rotation={[0.45, 0, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 3.8]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} />
          </mesh>
          <mesh position={[0, 2.8, -1.8]} rotation={[-0.45, 0, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 3.8]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} />
          </mesh>
        </group>
      ))}

      {/* 2. Longitudinal Purlins */}
      {[-3.2, -1.6, 0, 1.6, 3.2].map((z) => (
        <mesh key={`purlin-${z}`} position={[0, 4.55, z]} castShadow>
          <boxGeometry args={[32, 0.12, 0.12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.25} />
        </mesh>
      ))}

      {/* 3. Photovoltaic Solar Modules (7 Arrays of Panels) */}
      {[-12, -8, -4, 0, 4, 8, 12].map((x) => (
        <group key={`pv-${x}`} position={[x, 4.75, 0]} rotation={[0.16, 0, 0]}>
          {/* Anodized Aluminum Outer Frame */}
          <mesh castShadow>
            <boxGeometry args={[3.7, 0.12, 6.2]} />
            <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Monocrystalline Solar Cell Silicon Wafer Layer */}
          <mesh position={[0, 0.07, 0]} castShadow>
            <boxGeometry args={[3.55, 0.03, 6.0]} />
            <meshStandardMaterial
              color="#0b1e36"
              emissive="#0284c7"
              emissiveIntensity={0.25 * glowIntensity}
              roughness={0.1}
              metalness={0.92}
            />
          </mesh>

          {/* Photovoltaic Busbar Grid Grid Lines */}
          {[-1.2, 0, 1.2].map((bx) => (
            <mesh key={`bus-${bx}`} position={[bx, 0.09, 0]}>
              <boxGeometry args={[0.04, 0.01, 5.9]} />
              <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.5} />
            </mesh>
          ))}
        </group>
      ))}

      {/* 4. Canal Evaporative Shading Shadow (Visualizing the 70% evaporation cut) */}
      <mesh position={[0, -0.28, 0]} receiveShadow>
        <planeGeometry args={[30, 6.6]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.55} />
      </mesh>

      {/* Floating 3D Badge: Canal Solar Array */}
      <Html position={[0, 6.2, 0]} center distanceFactor={22}>
        <div className="pointer-events-none px-3 py-1.5 rounded-lg bg-amber-950/90 border border-amber-400/60 text-xs font-mono font-bold text-amber-200 shadow-xl whitespace-nowrap backdrop-blur-md flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
          ☀️ CANAL SOLAR ARRAY [{solarWatts}W GENERATION]
        </div>
      </Html>
    </group>
  );
}
