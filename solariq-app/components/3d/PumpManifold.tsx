"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { useNexusStore } from "@/lib/nexusStore";

export default function PumpManifold() {
  const { isPumpRunning, step, activePlotId } = useNexusStore();
  const impellerRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (impellerRef.current && isPumpRunning) {
      impellerRef.current.rotation.y += delta * 18;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Submersible DC Pump in Canal */}
      <group position={[-6, -0.4, 0]}>
        {/* Pump Main Body */}
        <mesh castShadow>
          <cylinderGeometry args={[0.55, 0.55, 1.1, 16]} />
          <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Top Motor Cap */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.55, 0.3, 16]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Spinning Impeller Blades */}
        <mesh ref={impellerRef} position={[0, 0, 0]}>
          <boxGeometry args={[0.8, 0.1, 0.25]} />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={isPumpRunning ? 0.9 : 0.1}
          />
        </mesh>
        {/* Suction Screen Base */}
        <mesh position={[0, -0.6, 0]}>
          <cylinderGeometry args={[0.45, 0.45, 0.2, 16]} />
          <meshStandardMaterial color="#334155" roughness={0.6} />
        </mesh>

        {/* Floating Label for Pump */}
        <Html position={[0, 1.2, 0]} center distanceFactor={18}>
          <div className="pointer-events-none px-2 py-0.5 rounded bg-sky-950/85 border border-sky-400/50 text-[9px] font-mono text-sky-200 whitespace-nowrap shadow-md">
            12V DC PUMP {isPumpRunning ? "[42 L/min]" : "[OFF]"}
          </div>
        </Html>
      </group>

      {/* 2. Central Edge-AI Enclosure on South Embankment */}
      <group position={[0, 1.4, 4.6]}>
        {/* Steel Mounting Stand */}
        <mesh position={[0, -0.5, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.25, 1.0, 12]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* IP65 Weatherproof Kiosk Box */}
        <mesh castShadow>
          <boxGeometry args={[1.8, 1.4, 0.9]} />
          <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.2} />
        </mesh>

        {/* Glowing OLED Status Display Panel */}
        <mesh position={[0, 0.1, 0.46]}>
          <planeGeometry args={[1.4, 0.7]} />
          <meshBasicMaterial
            color={
              step === 5
                ? "#10b981"
                : step === 4
                ? "#f43f5e"
                : isPumpRunning
                ? "#00f0ff"
                : "#f59e0b"
            }
          />
        </mesh>

        {/* Kiosk Antenna */}
        <mesh position={[0.7, 0.9, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.6]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
        </mesh>

        {/* Floating Label for Kiosk */}
        <Html position={[0, 1.3, 0]} center distanceFactor={20}>
          <div className="pointer-events-none px-2.5 py-1 rounded bg-slate-900/90 border border-cyan-500/60 text-[10px] font-mono font-bold text-cyan-300 whitespace-nowrap shadow-xl backdrop-blur-md">
            ⚡ EDGE-AI KIOSK [ESP32-S3]
          </div>
        </Html>
      </group>

      {/* 3. 6-Way Latching Manifold Hub on Ground */}
      <group position={[0, 0.35, 6.0]}>
        {/* Main Distribution Header Manifold */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.22, 0.22, 4.8, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.25} />
        </mesh>

        {/* 6 Latching Solenoid Valves */}
        {[-2.0, -1.2, -0.4, 0.4, 1.2, 2.0].map((x, idx) => {
          const isThisActive = (idx + 1) === activePlotId && isPumpRunning;
          return (
            <group key={`valve-${idx}`} position={[x, 0, 0]}>
              <mesh position={[0, 0.25, 0]} castShadow>
                <cylinderGeometry args={[0.12, 0.12, 0.4]} />
                <meshStandardMaterial
                  color={isThisActive ? "#00f0ff" : "#64748b"}
                  emissive={isThisActive ? "#00f0ff" : "#000000"}
                  emissiveIntensity={isThisActive ? 0.7 : 0}
                />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
}
