"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { QualityConfig } from "@/lib/quality";
import { scrollState, smoothstep } from "@/lib/scroll";

interface FloatFieldProps {
  quality: QualityConfig;
  reducedMotion: boolean;
}

interface InstanceSeed {
  x: number;
  y: number;
  z: number;
  scale: number;
  phase: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  colorHex: string;
}

function seededRandom(seed: number): number {
  const s = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
  return s - Math.floor(s);
}

const PALETTE = ["#FFFFFF", "#F8D7E7", "#FFF3E6", "#F3C6DD", "#F5E2EC"];

export function FloatField({ quality, reducedMotion }: FloatFieldProps) {
  const pearlMeshRef = useRef<THREE.InstancedMesh>(null);
  const petalMeshRef = useRef<THREE.InstancedMesh>(null);
  const pearlMatRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const petalMatRef = useRef<THREE.MeshStandardMaterial>(null);

  const sphereCount = Math.max(4, Math.round(quality.instanceCount * 0.6));
  const petalCount = Math.max(3, quality.instanceCount - sphereCount);

  const { sphereGeom, petalGeom, sphereSeeds, petalSeeds, dummy } =
    useMemo(() => {
      const segs = quality.tier === "high" ? 24 : quality.tier === "mid" ? 16 : 12;
      const sGeom = new THREE.SphereGeometry(0.24, segs, segs);

      // Loose organic petal flake
      const pGeom = new THREE.SphereGeometry(
        0.28,
        12,
        12,
        0,
        Math.PI * 0.55,
        0.2,
        Math.PI * 0.65
      );
      pGeom.scale(0.85, 1.35, 0.45);
      pGeom.computeVertexNormals();

      const makeSeeds = (count: number, offset: number): InstanceSeed[] => {
        const list: InstanceSeed[] = [];
        for (let i = 0; i < count; i++) {
          const r1 = seededRandom(i + offset * 17 + 1);
          const r2 = seededRandom(i + offset * 31 + 2);
          const r3 = seededRandom(i + offset * 47 + 3);
          const r4 = seededRandom(i + offset * 61 + 4);

          const angle = r1 * Math.PI * 2;
          // Keep central reading channel open while placing elements at multiple depths
          const radialDist = 1.25 + r2 * 4.2;
          const x = Math.cos(angle) * radialDist;
          const y = Math.sin(angle) * (radialDist * 0.68);
          const z = -1.5 - (i / Math.max(1, count - 1)) * 20.5 - r3 * 1.4;

          list.push({
            x,
            y,
            z,
            scale: 0.45 + r4 * 1.05,
            phase: r1 * Math.PI * 2,
            rotX: r2 * Math.PI,
            rotY: r3 * Math.PI,
            rotZ: r4 * Math.PI,
            colorHex: PALETTE[i % PALETTE.length],
          });
        }
        return list;
      };

      return {
        sphereGeom: sGeom,
        petalGeom: pGeom,
        sphereSeeds: makeSeeds(sphereCount, 1),
        petalSeeds: makeSeeds(petalCount, 5),
        dummy: new THREE.Object3D(),
      };
    }, [petalCount, quality.tier, sphereCount]);

  useEffect(() => {
    const color = new THREE.Color();
    if (pearlMeshRef.current) {
      sphereSeeds.forEach((seed, idx) => {
        color.set(seed.colorHex);
        pearlMeshRef.current?.setColorAt(idx, color);
      });
      if (pearlMeshRef.current.instanceColor) {
        pearlMeshRef.current.instanceColor.needsUpdate = true;
      }
    }
    if (petalMeshRef.current) {
      petalSeeds.forEach((seed, idx) => {
        color.set(seed.colorHex);
        petalMeshRef.current?.setColorAt(idx, color);
      });
      if (petalMeshRef.current.instanceColor) {
        petalMeshRef.current.instanceColor.needsUpdate = true;
      }
    }
  }, [petalSeeds, sphereSeeds]);

  useEffect(() => {
    return () => {
      sphereGeom.dispose();
      petalGeom.dispose();
    };
  }, [petalGeom, sphereGeom]);

  useFrame((state) => {
    const p = reducedMotion ? 0.25 : scrollState.smoothed;
    // Fade in softly during Scene 01->02 and fade down before Scene 04 pedestal focus
    const fadeIn = smoothstep(0.05, 0.18, p);
    const fadeOut = 1 - smoothstep(0.54, 0.66, p);
    const visibility = reducedMotion ? 0.45 : Math.max(0.18, fadeIn) * fadeOut;

    const visible = visibility > 0.02;
    if (pearlMeshRef.current) pearlMeshRef.current.visible = visible;
    if (petalMeshRef.current) petalMeshRef.current.visible = visible;
    if (!visible) return;

    const t = reducedMotion ? 0 : state.clock.elapsedTime;
    const parallaxX = reducedMotion ? 0 : scrollState.pointerX * 0.18;
    const parallaxY = reducedMotion ? 0 : scrollState.pointerY * 0.12;

    if (pearlMeshRef.current) {
      for (let i = 0; i < sphereSeeds.length; i++) {
        const s = sphereSeeds[i];
        // Subtle <15% ambient float amplitude (Rule A4)
        const driftY = reducedMotion ? 0 : Math.sin(t * 0.55 + s.phase) * 0.11;
        const driftX = reducedMotion ? 0 : Math.cos(t * 0.42 + s.phase) * 0.08;
        dummy.position.set(
          s.x + driftX + parallaxX * (1 / Math.max(1, Math.abs(s.z) * 0.15)),
          s.y + driftY + parallaxY,
          s.z
        );
        dummy.rotation.set(s.rotX, s.rotY + t * 0.08, s.rotZ);
        dummy.scale.setScalar(s.scale);
        dummy.updateMatrix();
        pearlMeshRef.current.setMatrixAt(i, dummy.matrix);
      }
      pearlMeshRef.current.instanceMatrix.needsUpdate = true;
    }

    if (petalMeshRef.current) {
      for (let i = 0; i < petalSeeds.length; i++) {
        const s = petalSeeds[i];
        const driftY = reducedMotion ? 0 : Math.sin(t * 0.48 + s.phase) * 0.13;
        dummy.position.set(s.x + parallaxX * 0.5, s.y + driftY, s.z);
        dummy.rotation.set(
          s.rotX + t * 0.12,
          s.rotY + t * 0.15,
          s.rotZ + Math.sin(t * 0.4 + s.phase) * 0.1
        );
        dummy.scale.setScalar(s.scale);
        dummy.updateMatrix();
        petalMeshRef.current.setMatrixAt(i, dummy.matrix);
      }
      petalMeshRef.current.instanceMatrix.needsUpdate = true;
    }

    if (pearlMatRef.current) pearlMatRef.current.opacity = visibility * 0.92;
    if (petalMatRef.current) petalMatRef.current.opacity = visibility * 0.82;
  });

  return (
    <group>
      <instancedMesh
        ref={pearlMeshRef}
        args={[sphereGeom, undefined, sphereCount]}
        frustumCulled={false}
      >
        <meshPhysicalMaterial
          ref={pearlMatRef}
          color="#FFF7FB"
          roughness={0.18}
          metalness={0.02}
          clearcoat={0.85}
          clearcoatRoughness={0.12}
          transparent
          opacity={0.88}
        />
      </instancedMesh>

      <instancedMesh
        ref={petalMeshRef}
        args={[petalGeom, undefined, petalCount]}
        frustumCulled={false}
      >
        <meshStandardMaterial
          ref={petalMatRef}
          color="#F8DCEB"
          roughness={0.38}
          metalness={0.01}
          side={THREE.DoubleSide}
          transparent
          opacity={0.8}
        />
      </instancedMesh>
    </group>
  );
}
