"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useNexusStore } from "@/lib/nexusStore";

export default function RainStorm() {
  const { scenarioMode } = useNexusStore();
  const rainRef = useRef<THREE.Points>(null);

  const dropCount = 450;
  const [positions, initialY] = useMemo(() => {
    const pos = new Float32Array(dropCount * 3);
    const initY = new Float32Array(dropCount);

    for (let i = 0; i < dropCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 45; // X
      pos[i * 3 + 1] = Math.random() * 25;    // Y height
      pos[i * 3 + 2] = (Math.random() - 0.5) * 35; // Z

      initY[i] = pos[i * 3 + 1];
    }
    return [pos, initY];
  }, []);

  useFrame((state, delta) => {
    if (!rainRef.current || scenarioMode !== "monsoon-rain") return;
    const posAttr = rainRef.current.geometry.attributes.position;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < dropCount; i++) {
      array[i * 3 + 1] -= delta * 24; // fall velocity
      array[i * 3] -= delta * 3;     // slight wind drift

      if (array[i * 3 + 1] < 0) {
        array[i * 3 + 1] = 22 + Math.random() * 3;
        array[i * 3] = (Math.random() - 0.5) * 45;
      }
    }
    posAttr.needsUpdate = true;
  });

  if (scenarioMode !== "monsoon-rain") return null;

  return (
    <points ref={rainRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.18}
        color="#7dd3fc"
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
