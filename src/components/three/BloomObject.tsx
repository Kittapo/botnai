"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { QualityConfig } from "@/lib/quality";
import { rangeProgress, scrollState, smoothstep } from "@/lib/scroll";

interface BloomObjectProps {
  quality: QualityConfig;
  reducedMotion: boolean;
}

const PETAL_COUNT = 7;

export function BloomObject({ quality, reducedMotion }: BloomObjectProps) {
  const rootRef = useRef<THREE.Group>(null);
  const petalRefs = useRef<(THREE.Mesh | null)[]>([]);
  const pearlMatRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const petalMatRef = useRef<THREE.MeshPhysicalMaterial | null>(null);

  // Touch drag offset for gyro-free touch interaction in Scene 01
  const dragTarget = useRef({ x: 0, y: 0 });
  const dragCurrent = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (reducedMotion || typeof window === "undefined") return;
    let dragging = false;
    let startX = 0;
    let startY = 0;

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      if (scrollState.progress > 0.22) return;
      const target = e.target as Element | null;
      if (target?.closest("a, button, input")) return;
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = (e.clientX - startX) / Math.max(window.innerWidth, 320);
      const dy = (e.clientY - startY) / Math.max(window.innerHeight, 480);
      dragTarget.current.x = THREE.MathUtils.clamp(dx * 1.1, -0.45, 0.45);
      dragTarget.current.y = THREE.MathUtils.clamp(dy * 0.8, -0.3, 0.3);
    };

    const onPointerUp = () => {
      dragging = false;
      dragTarget.current.x = 0;
      dragTarget.current.y = 0;
    };

    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", onPointerUp, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, [reducedMotion]);

  const { petalGeometry, pearlGeometry, sharedPetalMaterial } = useMemo(() => {
    const [segW, segH] = quality.petalSegments;

    // Sculpted cupped petal shell with soft cream-to-rose vertex color gradient
    const geom = new THREE.SphereGeometry(
      1.05,
      segW,
      segH,
      -Math.PI * 0.28,
      Math.PI * 0.56,
      0.16,
      Math.PI * 0.72
    );

    const pos = geom.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const cBase = new THREE.Color("#FFF5EC");
    const cMid = new THREE.Color("#F8D4E5");
    const cTip = new THREE.Color("#E892BA");
    const tmpColor = new THREE.Color();

    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);

      // Normalized vertical coordinate from bottom [-0.85] to top [+0.95]
      const vNorm = THREE.MathUtils.clamp((y + 0.85) / 1.8, 0, 1);
      // Taper base and tip gently into an organic petal silhouette
      const widthEnvelope = Math.sin(Math.pow(vNorm, 0.78) * Math.PI * 0.94);
      x *= 0.58 + widthEnvelope * 0.52;
      // Slight graceful outward curl near the petal tip
      z += Math.pow(vNorm, 2.2) * 0.18;
      // Shift pivot to base of the petal so unfurl rotation hinges organically
      y += 0.78;

      pos.setXYZ(i, x, y, z);

      if (vNorm < 0.55) {
        tmpColor.copy(cBase).lerp(cMid, vNorm / 0.55);
      } else {
        tmpColor.copy(cMid).lerp(cTip, (vNorm - 0.55) / 0.45);
      }
      colors[i * 3] = tmpColor.r;
      colors[i * 3 + 1] = tmpColor.g;
      colors[i * 3 + 2] = tmpColor.b;
    }

    geom.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geom.computeVertexNormals();

    const pearlSegs =
      quality.tier === "high" ? 48 : quality.tier === "mid" ? 32 : 22;
    const pGeom = new THREE.SphereGeometry(0.68, pearlSegs, pearlSegs);

    const pMat = new THREE.MeshPhysicalMaterial({
      vertexColors: true,
      roughness: 0.3,
      metalness: 0.01,
      clearcoat: 0.45,
      clearcoatRoughness: 0.22,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.94,
    });

    return {
      petalGeometry: geom,
      pearlGeometry: pGeom,
      sharedPetalMaterial: pMat,
    };
  }, [quality.petalSegments, quality.tier]);

  useEffect(() => {
    petalMatRef.current = sharedPetalMaterial;
    return () => {
      petalMatRef.current = null;
      petalGeometry.dispose();
      pearlGeometry.dispose();
      sharedPetalMaterial.dispose();
    };
  }, [petalGeometry, pearlGeometry, sharedPetalMaterial]);

  useFrame((state, delta) => {
    const group = rootRef.current;
    if (!group) return;

    const p = reducedMotion ? 0.04 : scrollState.smoothed;
    const fadeOut = 1 - smoothstep(0.22, 0.36, p);
    // Hide in Scene 01 Hero so it does not obstruct the Celestial Sanctuary Core & Lumi Mascot
    group.visible = p > 0.14 && fadeOut > 0.01;
    if (!group.visible) return;

    const isMobile = state.size.width < 768;
    group.position.y = isMobile ? 0.42 : 0.08;
    const baseScale = isMobile ? 0.82 : 1.0;
    group.scale.setScalar(baseScale * (0.94 + scrollState.introUnfurl * 0.06));

    if (!reducedMotion) {
      const t = state.clock.elapsedTime;
      dragCurrent.current.x = THREE.MathUtils.damp(
        dragCurrent.current.x,
        dragTarget.current.x,
        5,
        delta
      );
      dragCurrent.current.y = THREE.MathUtils.damp(
        dragCurrent.current.y,
        dragTarget.current.y,
        5,
        delta
      );

      const targetYaw =
        t * 0.11 + scrollState.pointerX * 0.22 + dragCurrent.current.x;
      const targetPitch =
        Math.sin(t * 0.45) * 0.05 +
        scrollState.pointerY * 0.14 +
        dragCurrent.current.y;

      group.rotation.y = THREE.MathUtils.damp(
        group.rotation.y,
        targetYaw,
        4,
        delta
      );
      group.rotation.x = THREE.MathUtils.damp(
        group.rotation.x,
        targetPitch,
        4,
        delta
      );
    } else {
      group.rotation.set(0.08, 0.35, 0);
    }

    // Petals unfurl during load sequence, then open wider as scroll rises (0..0.24)
    const scrubOpen = rangeProgress(p, 0.0, 0.24);
    const introOpen = reducedMotion ? 1 : scrollState.introUnfurl;

    for (let i = 0; i < PETAL_COUNT; i++) {
      const mesh = petalRefs.current[i];
      if (!mesh) continue;
      const layerOffset = (i % 2) * 0.09;
      const staggeredIntro = THREE.MathUtils.clamp(
        (introOpen - i * 0.06) / (1 - PETAL_COUNT * 0.06),
        0,
        1
      );
      const easedIntro = 1 - Math.pow(1 - staggeredIntro, 3);
      const tiltOut =
        0.16 +
        easedIntro * (0.42 + layerOffset) +
        scrubOpen * 0.58 +
        (reducedMotion
          ? 0
          : Math.sin(state.clock.elapsedTime * 0.7 + i) * 0.02);

      mesh.rotation.x = tiltOut;
    }

    if (pearlMatRef.current) {
      pearlMatRef.current.opacity = fadeOut;
    }
    if (petalMatRef.current) {
      petalMatRef.current.opacity = fadeOut * 0.94;
    }
  });

  return (
    <group ref={rootRef} position={[0, 0.08, 0]}>
      {/* Central Luminous Hero Pearl */}
      <mesh geometry={pearlGeometry} position={[0, 0.12, 0]}>
        <meshPhysicalMaterial
          ref={pearlMatRef}
          color="#FFF7FB"
          emissive="#F5C6DE"
          emissiveIntensity={0.16}
          roughness={0.13}
          metalness={0.03}
          clearcoat={1}
          clearcoatRoughness={0.07}
          iridescence={0.38}
          iridescenceIOR={1.3}
          transmission={quality.enableTransmission ? 0.34 : 0}
          thickness={quality.enableTransmission ? 1.35 : 0}
          ior={1.42}
          transparent
        />
      </mesh>

      {Array.from({ length: PETAL_COUNT }).map((_, i) => {
        const angle = (i / PETAL_COUNT) * Math.PI * 2;
        const radius = i % 2 === 0 ? 0.24 : 0.29;
        return (
          <group key={i} rotation={[0, angle, 0]}>
            <mesh
              ref={(el) => {
                petalRefs.current[i] = el;
              }}
              geometry={petalGeometry}
              material={sharedPetalMaterial}
              position={[0, -0.52, radius]}
            />
          </group>
        );
      })}
    </group>
  );
}
