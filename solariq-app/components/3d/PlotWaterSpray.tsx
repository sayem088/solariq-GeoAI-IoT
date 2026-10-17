"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useNexusStore } from "@/lib/nexusStore";

export default function PlotWaterSpray() {
  const { isPumpRunning, activePlotId } = useNexusStore();
  const sprayRef = useRef<THREE.Points>(null);

  // Position of plots
  const plotXCoords: Record<number, number> = {
    1: -7.5,
    2: -4.5,
    3: -1.5,
    4: 1.5,
    5: 4.5,
    6: 7.5,
  };

  const sprayCount = 80;
  const [positions, angles] = useMemo(() => {
    const pos = new Float32Array(sprayCount * 3);
    const ang = new Float32Array(sprayCount);

    for (let i = 0; i < sprayCount; i++) {
      ang[i] = (i / sprayCount) * Math.PI * 2;
      pos[i * 3] = 0;
      pos[i * 3 + 1] = 0.2;
      pos[i * 3 + 2] = 0;
    }
    return [pos, ang];
  }, [sprayCount]);

  const activeX = plotXCoords[activePlotId] ?? 1.5;

  useFrame((state, delta) => {
    if (!sprayRef.current || !isPumpRunning) return;
    const posAttr = sprayRef.current.geometry.attributes.position;
    const array = posAttr.array as Float32Array;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < sprayCount; i++) {
      const radius = 0.3 + ((time * 1.5 + i * 0.05) % 1.2);
      const height = Math.sin((radius / 1.5) * Math.PI) * 0.8;
      array[i * 3] = Math.cos(angles[i] + time) * radius;
      array[i * 3 + 1] = 0.2 + height;
      array[i * 3 + 2] = Math.sin(angles[i] + time) * radius * 1.4;
    }
    posAttr.needsUpdate = true;
  });

  if (!isPumpRunning) return null;

  return (
    <group position={[activeX, 0, 9.5]}>
      <points ref={sprayRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.16}
          color="#38bdf8"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
