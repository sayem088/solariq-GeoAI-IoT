"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useNexusStore } from "@/lib/nexusStore";

export default function MicroclimateMist() {
  const { isPumpRunning, scenarioMode } = useNexusStore();
  const pointsRef = useRef<THREE.Points>(null);

  const particleCount = 120;
  const [positions, initialY] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const initY = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 26; // X span across canal
      pos[i * 3 + 1] = -0.4 + Math.random() * 3.8; // Y between water and canopy
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6; // Z width across canal

      initY[i] = pos[i * 3 + 1];
    }
    return [pos, initY];
  }, []);

  // Rising mist animation
  useFrame((state, delta) => {
    if (!pointsRef.current || scenarioMode === "night-standby") return;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      array[i * 3 + 1] += delta * 0.8; // rise upward
      if (array[i * 3 + 1] > 3.8) {
        array[i * 3 + 1] = -0.4; // reset to canal water level
      }
    }
    posAttr.needsUpdate = true;
  });

  if (scenarioMode === "night-standby") return null;

  return (
    <points ref={pointsRef}>
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
        opacity={0.45}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
