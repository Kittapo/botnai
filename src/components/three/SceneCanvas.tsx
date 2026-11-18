"use client";

import { useEffect, useMemo, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { getProductById, PRODUCTS } from "@/data/products";
import {
  detectInitialQualityTier,
  isWebGLAvailable,
  probeFrameTimeTier,
  QUALITY_CONFIGS,
  type QualityTier,
  stepDownQualityTier,
} from "@/lib/quality";
import { useReducedMotion } from "@/lib/reducedMotion";
import { useUiStore } from "@/store/ui";
import {
  CssFallbackScene,
  WebGLErrorBoundary,
} from "@/components/fallback/CssFallbackScene";
import { BloomObject } from "@/components/three/BloomObject";
import { FloatField } from "@/components/three/FloatField";
import { Pedestal } from "@/components/three/Pedestal";
import { ProductBillboard } from "@/components/three/ProductBillboard";
import { CameraRig } from "@/components/three/CameraRig";

/**
 * Generates a procedural studio lighting environment via PMREM + RoomEnvironment
 * so there are zero external network HDRI downloads (Rule A6).
 */
function ProceduralLighting() {
  const gl = useThree((s) => s.gl);

  const envBundle = useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    pmrem.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    const envRT = pmrem.fromScene(roomEnv, 0.04);
    roomEnv.dispose();
    pmrem.dispose();
    return envRT;
  }, [gl]);

  useEffect(() => {
    return () => {
      envBundle.dispose();
    };
  }, [envBundle]);

  return (
    <>
      <primitive object={envBundle.texture} attach="environment" />
      <ambientLight intensity={0.7} color="#DDD6FE" />
      <directionalLight
        position={[3.5, 5.5, 4.5]}
        intensity={1.2}
        color="#FFFFFF"
      />
      <directionalLight
        position={[-4.0, -2.0, 2.0]}
        intensity={0.6}
        color="#A855F7"
      />
    </>
  );
}

export default function SceneCanvas() {
  const reducedMotion = useReducedMotion();
  const activeProductId = useUiStore((s) => s.activeProductId);
  const webglFallback = useUiStore((s) => s.webglFallback);
  const setWebglFallback = useUiStore((s) => s.setWebglFallback);

  const [webglSupported] = useState<boolean>(() => isWebGLAvailable());
  const [tier, setTier] = useState<QualityTier>(() => detectInitialQualityTier());
  const [productHovered, setProductHovered] = useState(false);

  useEffect(() => {
    if (!webglSupported) {
      setWebglFallback(true);
      return;
    }

    const cancelProbe = probeFrameTimeTier(tier, (probedTier) => {
      setTier(probedTier);
    });

    return cancelProbe;
    // Run frame-time probe once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webglSupported, setWebglFallback]);

  const activeProduct = getProductById(activeProductId) ?? PRODUCTS[0];
  const quality = QUALITY_CONFIGS[tier];

  if (!webglSupported || webglFallback) {
    return <CssFallbackScene />;
  }

  return (
    <WebGLErrorBoundary fallback={<CssFallbackScene />}>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 h-[100svh] w-full overflow-hidden"
      >
        <Canvas
          dpr={quality.dpr}
          gl={{
            antialias: quality.tier !== "low",
            alpha: true,
            powerPreference: "high-performance",
          }}
          camera={{ fov: 42, near: 0.1, far: 48, position: [0, 0.1, 5.2] }}
          onCreated={({ gl }) => {
            const dom = gl.domElement;
            const handleContextLost = (e: Event) => {
              e.preventDefault();
              setWebglFallback(true);
            };
            dom.addEventListener("webglcontextlost", handleContextLost, false);
          }}
        >
          <PerformanceMonitor
            onDecline={() => setTier((prev) => stepDownQualityTier(prev))}
          />
          <ProceduralLighting />
          <CameraRig
            activeProductId={activeProduct.id}
            reducedMotion={reducedMotion}
          />
          <BloomObject quality={quality} reducedMotion={reducedMotion} />
          <FloatField quality={quality} reducedMotion={reducedMotion} />
          <Pedestal
            activeProductId={activeProduct.id}
            productHovered={productHovered}
            quality={quality}
            reducedMotion={reducedMotion}
          />
          <ProductBillboard
            productId={activeProduct.id}
            cutoutUrl={activeProduct.imageCutout}
            fallbackImageUrl={activeProduct.image}
            modelUrl={activeProduct.modelUrl}
            reducedMotion={reducedMotion}
            onHoverChange={setProductHovered}
          />
        </Canvas>
      </div>
    </WebGLErrorBoundary>
  );
}
