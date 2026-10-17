"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";

export default function CanalWater() {
  const waterMeshRef = useRef<THREE.Mesh>(null);

  // Smooth undulating water surface ripple motion
  useFrame((state) => {
    if (waterMeshRef.current) {
      const time = state.clock.getElapsedTime();
      waterMeshRef.current.position.y = -0.35 + Math.sin(time * 2.5) * 0.03;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Canal Concrete Bed & Silt Channel */}
      <mesh position={[0, -1.0, 0]} receiveShadow>
        <boxGeometry args={[34, 1.4, 7.6]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* 2. Flowing Canal Water Surface with Bioluminescent Aqua Glow */}
      <mesh ref={waterMeshRef} position={[0, -0.35, 0]} receiveShadow>
        <boxGeometry args={[33.8, 0.25, 7.0]} />
        <meshStandardMaterial
          color="#0284c7"
          emissive="#0369a1"
          emissiveIntensity={0.45}
          roughness={0.1}
          metalness={0.85}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* 3. North Concrete Canal Embankment & Coping Wall */}
      <mesh position={[0, 0.4, 3.8]} castShadow receiveShadow>
        <boxGeometry args={[34, 1.4, 0.8]} />
        <meshStandardMaterial color="#475569" roughness={0.6} metalness={0.2} />
      </mesh>
      {/* North Embankment Top Curb Warning Line */}
      <mesh position={[0, 1.12, 3.8]}>
        <boxGeometry args={[34, 0.05, 0.85]} />
        <meshStandardMaterial color="#64748b" roughness={0.4} />
      </mesh>

      {/* 4. South Concrete Canal Embankment & Coping Wall */}
      <mesh position={[0, 0.4, -3.8]} castShadow receiveShadow>
        <boxGeometry args={[34, 1.4, 0.8]} />
        <meshStandardMaterial color="#475569" roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh position={[0, 1.12, -3.8]}>
        <boxGeometry args={[34, 0.05, 0.85]} />
        <meshStandardMaterial color="#64748b" roughness={0.4} />
      </mesh>

      {/* Floating 3D Badge: Canal Waterway */}
      <Html position={[-8, 1.5, 0]} center distanceFactor={22}>
        <div className="pointer-events-none px-2.5 py-1 rounded-md bg-sky-950/90 border border-sky-400/50 text-[10px] font-mono font-bold text-sky-200 shadow-lg whitespace-nowrap backdrop-blur-md">
          💧 BWDB CANAL REACH [1.85m STAGE]
        </div>
      </Html>
    </group>
  );
}
