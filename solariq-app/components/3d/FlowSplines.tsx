"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { useNexusStore } from "@/lib/nexusStore";

export default function FlowSplines() {
  const { isPumpRunning, step, gridWatts, solarWatts, activePlotId } = useNexusStore();

  const waterParticlesRef = useRef<THREE.Points>(null);
  const greenGridRef = useRef<THREE.Points>(null);

  // X coordinate of active plot
  const plotXCoords: Record<number, number> = {
    1: -8.0,
    2: -4.8,
    3: -1.6,
    4: 1.6,
    5: 4.8,
    6: 8.0,
  };
  const targetX = plotXCoords[activePlotId] ?? 1.6;

  // 1. Water Spline Curve (Pump in canal -> Embankment -> Manifold -> Active Plot)
  const waterCount = 80;
  const [waterCurve, waterProgress] = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-6, -0.4, 0),    // Canal Pump
      new THREE.Vector3(-6, 0.4, 4.0),   // Lift over embankment
      new THREE.Vector3(0, 0.35, 6.0),   // Manifold Header
      new THREE.Vector3(targetX * 0.5, 0.25, 7.5),
      new THREE.Vector3(targetX, 0.2, 9.5), // Active Paddy Field
    ]);
    const prog = new Float32Array(waterCount);
    for (let i = 0; i < waterCount; i++) {
      prog[i] = i / waterCount;
    }
    return [curve, prog];
  }, [targetX]);

  const waterPositions = useMemo(() => new Float32Array(waterCount * 3), [waterCount]);

  // 2. High-Voltage Grid Spline (Solar Canopy Inverter -> Pylon at [14, 0, -6])
  const gridCount = 90;
  const [gridCurve, gridProgress] = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 4.4, 0),     // PV Canopy Busbar
      new THREE.Vector3(0, 1.4, 4.6),   // Kiosk Inverter
      new THREE.Vector3(8, 3.5, 0),     // Overhead Transmission Span
      new THREE.Vector3(14, 5.8, -6),   // 33kV Pylon Insulators
    ]);
    const prog = new Float32Array(gridCount);
    for (let i = 0; i < gridCount; i++) {
      prog[i] = i / gridCount;
    }
    return [curve, prog];
  }, []);

  const gridPositions = useMemo(() => new Float32Array(gridCount * 3), [gridCount]);

  // Animation Loop
  useFrame((state, delta) => {
    // Water pulse
    if (waterParticlesRef.current && isPumpRunning) {
      const posAttr = waterParticlesRef.current.geometry.attributes.position;
      const array = posAttr.array as Float32Array;

      for (let i = 0; i < waterCount; i++) {
        waterProgress[i] = (waterProgress[i] + delta * 0.7) % 1.0;
        const pt = waterCurve.getPoint(waterProgress[i]);
        array[i * 3] = pt.x;
        array[i * 3 + 1] = pt.y;
        array[i * 3 + 2] = pt.z;
      }
      posAttr.needsUpdate = true;
    }

    // Grid energy pulse (accelerated on Step 5 / Rain)
    if (greenGridRef.current && solarWatts > 0) {
      const posAttr = greenGridRef.current.geometry.attributes.position;
      const array = posAttr.array as Float32Array;
      const speed = step === 5 ? 1.5 : 0.8;

      for (let i = 0; i < gridCount; i++) {
        gridProgress[i] = (gridProgress[i] + delta * speed) % 1.0;
        const pt = gridCurve.getPoint(gridProgress[i]);
        array[i * 3] = pt.x;
        array[i * 3 + 1] = pt.y;
        array[i * 3 + 2] = pt.z;
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* 1. Physical Irrigation Piping (PVC Tube along curve) */}
      <mesh>
        <tubeGeometry args={[waterCurve, 32, 0.08, 8, false]} />
        <meshStandardMaterial
          color={isPumpRunning ? "#0284c7" : "#475569"}
          emissive={isPumpRunning ? "#00f0ff" : "#000000"}
          emissiveIntensity={isPumpRunning ? 0.35 : 0}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Rushing Water Particles inside/along tube */}
      {isPumpRunning && (
        <points ref={waterParticlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[waterPositions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.24}
            color="#00f0ff"
            transparent
            opacity={0.95}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      )}

      {/* 2. Grid Power Transmission Line (Overhead Cable Tube) */}
      <mesh>
        <tubeGeometry args={[gridCurve, 32, 0.06, 6, false]} />
        <meshStandardMaterial
          color="#10b981"
          emissive="#10b981"
          emissiveIntensity={step === 5 ? 0.8 : 0.4}
          transparent
          opacity={0.75}
        />
      </mesh>

      {/* Grid Export Energy Particles (Emerald Surge) */}
      {solarWatts > 0 && (
        <points ref={greenGridRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[gridPositions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={step === 5 ? 0.32 : 0.22}
            color="#34d399"
            transparent
            opacity={0.9}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      )}

      {/* 3. 33kV Rural Grid Transmission Tower */}
      <group position={[14, 0, -6]}>
        {/* Steel Lattice Mast */}
        <mesh position={[0, 3.6, 0]} castShadow>
          <cylinderGeometry args={[0.25, 1.0, 7.2, 4]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Crossarm 1 */}
        <mesh position={[0, 5.8, 0]} castShadow>
          <boxGeometry args={[3.8, 0.16, 0.16]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} />
        </mesh>
        {/* Crossarm 2 */}
        <mesh position={[0, 4.6, 0]} castShadow>
          <boxGeometry args={[4.8, 0.16, 0.16]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} />
        </mesh>
        {/* Ceramic Insulators */}
        {[-1.6, 1.6].map((ix) => (
          <mesh key={`ins-${ix}`} position={[ix, 5.5, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.5, 8]} />
            <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.6} />
          </mesh>
        ))}

        {/* Floating 3D Badge: National Grid Export */}
        <Html position={[0, 7.4, 0]} center distanceFactor={22}>
          <div className="pointer-events-none px-2.5 py-1 rounded-md bg-emerald-950/90 border border-emerald-400/60 text-[10px] font-mono font-bold text-emerald-200 shadow-xl whitespace-nowrap backdrop-blur-md flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            ⚡ 33kV RURAL GRID [{gridWatts}W EXPORT]
          </div>
        </Html>
      </group>
    </group>
  );
}
