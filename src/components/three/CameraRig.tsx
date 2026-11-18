"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PRODUCT_THEMES, PRODUCTS } from "@/data/products";
import { rangeProgress, scrollState, smoothstep } from "@/lib/scroll";
import { PEDESTAL_POSITION } from "@/components/three/Pedestal";

interface CameraRigProps {
  activeProductId: string;
  reducedMotion: boolean;
}

export function CameraRig({ activeProductId, reducedMotion }: CameraRigProps) {
  const helpers = useMemo(
    () => ({
      targetPos: new THREE.Vector3(),
      lookAtPos: new THREE.Vector3(),
      currentLookAt: new THREE.Vector3(0, 0, 0),
      cHero: new THREE.Color("#FFFAFC"),
      cDiscover: new THREE.Color("#F8D7E7"),
      cBeige: new THREE.Color("#F2E4D8"),
      cProduct: new THREE.Color("#F3DCE6"),
      cClosing: new THREE.Color("#FFFAFC"),
      outColor: new THREE.Color("#FFFAFC"),
    }),
    []
  );

  useFrame((state, delta) => {
    const { camera, scene, size } = state;

    // Update smoothed mutable scroll progress inside useFrame (Rule A4)
    if (reducedMotion) {
      scrollState.smoothed = 0.04;
    } else {
      scrollState.smoothed = THREE.MathUtils.damp(
        scrollState.smoothed,
        scrollState.progress,
        6.5,
        delta
      );
    }

    const p = scrollState.smoothed;
    const isMobile = size.width < 768;
    const isDesktop = size.width >= 1024;

    // Continuous background & fog color choreography across Scenes 01..04..Closing
    const theme =
      PRODUCT_THEMES[activeProductId] ?? PRODUCT_THEMES[PRODUCTS[0].id];
    helpers.cProduct.set(theme.ambientTint);

    if (p < 0.28) {
      const t = rangeProgress(p, 0.05, 0.28);
      helpers.outColor.copy(helpers.cHero).lerp(helpers.cDiscover, t);
    } else if (p < 0.56) {
      const t = rangeProgress(p, 0.28, 0.56);
      helpers.outColor.copy(helpers.cDiscover).lerp(helpers.cBeige, t);
    } else if (p < 0.86) {
      const t = smoothstep(0.56, 0.66, p);
      helpers.outColor.copy(helpers.cBeige).lerp(helpers.cProduct, t);
    } else {
      const t = smoothstep(0.86, 0.98, p);
      helpers.outColor.copy(helpers.cProduct).lerp(helpers.cClosing, t);
    }

    if (scene.background instanceof THREE.Color) {
      scene.background.lerp(helpers.outColor, Math.min(1, delta * 6));
      if (scene.fog instanceof THREE.Fog) {
        scene.fog.color.copy(scene.background);
      }
    }

    // Reduced motion holds a serene static hero composition
    if (reducedMotion) {
      camera.position.set(0, isMobile ? 0.35 : 0.1, isMobile ? 5.9 : 5.2);
      camera.lookAt(0, isMobile ? 0.15 : 0.05, 0);
      return;
    }

    // Scene-by-scene continuous camera path
    let camX = 0;
    let camY = isMobile ? 0.25 : 0.08;
    let camZ = isMobile ? 5.7 : 5.1;

    let lookX = 0;
    let lookY = isMobile ? 0.1 : 0.04;
    let lookZ = 0;

    if (p <= 0.18) {
      // Scene 01: Gentle pull-back as petals open wider
      const t = rangeProgress(p, 0, 0.18);
      camZ = THREE.MathUtils.lerp(isMobile ? 5.6 : 5.0, 6.3, t);
      lookZ = THREE.MathUtils.lerp(0, -1.2, t);
    } else if (p <= 0.4) {
      // Scene 02: Forward dolly through instanced pearly FloatField
      const t = rangeProgress(p, 0.18, 0.4);
      camZ = THREE.MathUtils.lerp(6.3, -13.5, t);
      camY = THREE.MathUtils.lerp(isMobile ? 0.25 : 0.08, 0.15, t);
      lookZ = camZ - 6.5;
      lookY = 0.08;
    } else if (p <= 0.62) {
      // Scene 03: Calm drift alongside pinned philosophy section
      const t = rangeProgress(p, 0.4, 0.62);
      camZ = THREE.MathUtils.lerp(-13.5, -19.6, t);
      camX = isDesktop ? Math.sin(t * Math.PI) * 0.45 : 0;
      lookZ = THREE.MathUtils.lerp(-20.0, PEDESTAL_POSITION[2], t);
      lookY = THREE.MathUtils.lerp(0.08, 0.0, t);
    } else if (p <= 0.85) {
      // Scene 04: Settle warmly at the pedestal & floating product billboard
      const t = smoothstep(0.62, 0.7, p);
      const settleZ = isMobile ? -20.5 : isDesktop ? -20.9 : -20.7;
      camZ = THREE.MathUtils.lerp(-19.6, settleZ, t);
      camX = THREE.MathUtils.lerp(
        isDesktop ? 0.15 : 0,
        isDesktop ? -0.15 : 0,
        t
      );
      camY = THREE.MathUtils.lerp(0.12, isMobile ? 0.18 : 0.22, t);

      lookX = isDesktop ? -0.15 : 0;
      lookY = isMobile ? -0.08 : 0.06;
      lookZ = PEDESTAL_POSITION[2];
    } else {
      // Closing + Footer: Quiet tonal settle
      const t = smoothstep(0.85, 1.0, p);
      const startZ = isMobile ? -20.5 : isDesktop ? -20.9 : -20.7;
      camZ = THREE.MathUtils.lerp(startZ, startZ - 1.4, t);
      camY = THREE.MathUtils.lerp(isMobile ? 0.18 : 0.22, 0.85, t);
      lookX = isDesktop ? -0.15 : 0;
      lookY = THREE.MathUtils.lerp(isMobile ? -0.08 : 0.06, 0.6, t);
      lookZ = PEDESTAL_POSITION[2];
    }

    // Subtle cursor-driven camera parallax on desktop only (Rule A5)
    const parallaxX = isDesktop ? scrollState.pointerX * 0.16 : 0;
    const parallaxY = isDesktop ? scrollState.pointerY * 0.1 : 0;

    helpers.targetPos.set(camX + parallaxX, camY + parallaxY, camZ);
    helpers.lookAtPos.set(lookX, lookY, lookZ);

    camera.position.lerp(helpers.targetPos, Math.min(1, delta * 6));
    helpers.currentLookAt.lerp(helpers.lookAtPos, Math.min(1, delta * 7));
    camera.lookAt(helpers.currentLookAt);
  });

  return null;
}
