"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PRODUCT_THEMES, PRODUCTS } from "@/data/products";
import type { QualityConfig } from "@/lib/quality";
import { scrollState, smoothstep } from "@/lib/scroll";

export const PEDESTAL_POSITION: [number, number, number] = [0, -1.55, -26];

interface PedestalProps {
  activeProductId: string;
  productHovered: boolean;
  quality: QualityConfig;
  reducedMotion: boolean;
}

export function Pedestal({
  activeProductId,
  productHovered,
  quality,
  reducedMotion,
}: PedestalProps) {
  const groupRef = useRef<THREE.Group>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);
  const shadowMeshRef = useRef<THREE.Mesh>(null);
  const shadowMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const bodyMatRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const capMatRef = useRef<THREE.MeshPhysicalMaterial>(null);

  const targetSpotColor = useMemo(() => new THREE.Color("#FFE3EE"), []);

  // Procedural soft contact shadow radial texture (no external image fetch)
  const shadowTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createRadialGradient(
        size / 2,
        size / 2,
        size * 0.06,
        size / 2,
        size / 2,
        size * 0.48
      );
      grad.addColorStop(0, "rgba(58, 34, 48, 0.42)");
      grad.addColorStop(0.5, "rgba(58, 34, 48, 0.16)");
      grad.addColorStop(1, "rgba(58, 34, 48, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  const { mainGeom, rimGeom, shadowGeom } = useMemo(() => {
    const segs = quality.tier === "high" ? 56 : quality.tier === "mid" ? 40 : 28;
    return {
      mainGeom: new THREE.CylinderGeometry(1.38, 1.5, 1.8, segs),
      rimGeom: new THREE.CylinderGeometry(1.42, 1.42, 0.09, segs),
      shadowGeom: new THREE.PlaneGeometry(1.85, 1.15),
    };
  }, [quality.tier]);

  useEffect(() => {
    return () => {
      mainGeom.dispose();
      rimGeom.dispose();
      shadowGeom.dispose();
      shadowTexture?.dispose();
    };
  }, [mainGeom, rimGeom, shadowGeom, shadowTexture]);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const p = reducedMotion ? 0 : scrollState.smoothed;
    const reveal = reducedMotion ? 0 : smoothstep(0.53, 0.64, p);
    const settleOut = reducedMotion ? 0 : 1 - smoothstep(0.86, 0.96, p);
    const visibility = reveal * settleOut;

    group.visible = visibility > 0.01;
    if (!group.visible) return;

    const isDesktop = state.size.width >= 1024;
    // Offset pedestal slightly left on wide desktop so the right-hand editorial info column breathes
    const targetX = isDesktop ? -1.15 : 0;
    const targetY = isDesktop ? -1.48 : -1.32;
    group.position.set(
      targetX,
      targetY - (1 - reveal) * 0.55,
      PEDESTAL_POSITION[2]
    );

    const theme =
      PRODUCT_THEMES[activeProductId] ?? PRODUCT_THEMES[PRODUCTS[0].id];
    targetSpotColor.set(theme.spotlightTint);

    if (spotLightRef.current) {
      spotLightRef.current.color.lerp(targetSpotColor, Math.min(1, delta * 4));
      spotLightRef.current.intensity = visibility * 2.6;
      spotLightRef.current.target.position.set(
        targetX,
        targetY + 1.2,
        PEDESTAL_POSITION[2]
      );
      spotLightRef.current.target.updateMatrixWorld();
    }

    if (bodyMatRef.current) bodyMatRef.current.opacity = visibility;
    if (capMatRef.current) capMatRef.current.opacity = visibility;

    // Contact shadow tightens subtly on hover (Rule B6)
    if (shadowMeshRef.current && shadowMatRef.current) {
      const targetScale = productHovered ? 0.86 : 1.0;
      const nextScale = THREE.MathUtils.damp(
        shadowMeshRef.current.scale.x,
        targetScale,
        8,
        delta
      );
      shadowMeshRef.current.scale.set(nextScale, nextScale, 1);
      shadowMatRef.current.opacity =
        visibility * (productHovered ? 0.88 : 0.68);
    }
  });

  return (
    <group ref={groupRef} position={PEDESTAL_POSITION}>
      {/* Warm overhead key spotlight */}
      <spotLight
        ref={spotLightRef}
        position={[0.6, 5.2, 2.4]}
        angle={0.55}
        penumbra={0.85}
        intensity={2.4}
        distance={14}
      />

      {/* Sculpted Pedestal Column */}
      <mesh geometry={mainGeom} position={[0, 0, 0]}>
        <meshPhysicalMaterial
          ref={bodyMatRef}
          color="#FFF7FA"
          roughness={0.34}
          metalness={0.02}
          clearcoat={0.35}
          clearcoatRoughness={0.25}
          transparent
        />
      </mesh>

      {/* Top Bevel Plinth Cap */}
      <mesh geometry={rimGeom} position={[0, 0.91, 0]}>
        <meshPhysicalMaterial
          ref={capMatRef}
          color="#FFFFFF"
          roughness={0.22}
          metalness={0.02}
          clearcoat={0.6}
          clearcoatRoughness={0.15}
          transparent
        />
      </mesh>

      {/* Luminous Glowing Halo Ring at Plinth Edge */}
      <mesh position={[0, 0.956, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.28, 1.41, 48]} />
        <meshBasicMaterial
          color={PRODUCT_THEMES[activeProductId]?.badgeRing ?? "#E24C91"}
          transparent
          opacity={0.38}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Soft Contact Shadow on Plinth Surface */}
      {quality.enableShadows && shadowTexture && (
        <mesh
          ref={shadowMeshRef}
          geometry={shadowGeom}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.962, 0.05]}
        >
          <meshBasicMaterial
            ref={shadowMatRef}
            map={shadowTexture}
            transparent
            depthWrite={false}
            opacity={0.68}
          />
        </mesh>
      )}
    </group>
  );
}
