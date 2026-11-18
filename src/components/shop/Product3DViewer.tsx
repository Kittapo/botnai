"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { Product } from "@/data/products";
import { PRODUCT_THEMES, PRODUCTS } from "@/data/products";
import { isWebGLAvailable } from "@/lib/quality";
import { useReducedMotion } from "@/lib/reducedMotion";

interface Product3DViewerProps {
  product: Product;
  className?: string;
  height?: number | string;
  showHint?: boolean;
}

const BOX_WIDTH = 1.82;
const BOX_HEIGHT = 1.88;
const BOX_DEPTH = 0.44;

function ViewerScene({
  product,
  reducedMotion,
}: {
  product: Product;
  reducedMotion: boolean;
}) {
  const boxGroupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const { gl } = useThree();

  const rotTarget = useRef({ yaw: 0, pitch: 0 });
  const rotCurrent = useRef({ yaw: 0, pitch: 0 });
  const isDragging = useRef(false);

  const theme =
    PRODUCT_THEMES[product.id] ?? PRODUCT_THEMES[PRODUCTS[0].id];
  const isComfort = product.id === "durex-comfort";
  const sideColor = useMemo(
    () => (isComfort ? "#0D2A72" : "#121316"),
    [isComfort]
  );

  // Create persistent materials array once
  const materials = useMemo(() => {
    const sideMat = new THREE.MeshPhysicalMaterial({
      color: sideColor,
      roughness: 0.22,
      metalness: 0.06,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 0.75,
    });

    const frontMat = new THREE.MeshPhysicalMaterial({
      color: "#FFFFFF",
      roughness: 0.18,
      metalness: 0.04,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 0.85,
    });

    const backMat = new THREE.MeshPhysicalMaterial({
      color: "#FFFFFF",
      roughness: 0.18,
      metalness: 0.04,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 0.85,
    });

    return [sideMat, sideMat, sideMat, sideMat, frontMat, backMat];
  }, [sideColor]);

  // Load and apply front and back textures directly into materials
  useEffect(() => {
    let active = true;
    const loader = new THREE.TextureLoader();

    const frontUrl = product.imageCutout || product.image;
    const backUrl = product.imageBackCutout || product.imageBack;

    loader.load(frontUrl, (tex) => {
      if (!active) return;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
      materials[4].map = tex;
      materials[4].needsUpdate = true;
    });

    if (backUrl) {
      loader.load(backUrl, (tex) => {
        if (!active) return;
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
        tex.wrapS = THREE.RepeatWrapping;
        tex.repeat.x = -1;
        materials[5].map = tex;
        materials[5].needsUpdate = true;
      });
    }

    return () => {
      active = false;
    };
  }, [gl, materials, product.image, product.imageBack, product.imageBackCutout, product.imageCutout]);

  // Clean up materials on component unmount
  useEffect(() => {
    return () => {
      materials.forEach((m) => {
        m.map?.dispose();
        m.dispose();
      });
    };
  }, [materials]);

  // Touch and pointer interaction: 360° turntable spin
  useEffect(() => {
    if (reducedMotion || typeof window === "undefined") return;
    let startX = 0;
    let startY = 0;
    let startYaw = 0;
    let startPitch = 0;

    const onDown = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (target?.closest("button, a")) return;
      isDragging.current = true;
      startX = e.clientX;
      startY = e.clientY;
      startYaw = rotTarget.current.yaw;
      startPitch = rotTarget.current.pitch;
    };

    const onMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const dx = (e.clientX - startX) / 90;
      const dy = (e.clientY - startY) / 90;
      rotTarget.current.yaw = startYaw + dx * 2.2;
      rotTarget.current.pitch = THREE.MathUtils.clamp(
        startPitch + dy * 0.75,
        -0.45,
        0.45
      );
    };

    const onUp = () => {
      isDragging.current = false;
    };

    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [reducedMotion]);

  useFrame((state, delta) => {
    if (!boxGroupRef.current) return;

    if (!isDragging.current && !reducedMotion) {
      rotTarget.current.yaw += delta * 0.22;
    }

    rotCurrent.current.yaw = THREE.MathUtils.damp(
      rotCurrent.current.yaw,
      reducedMotion ? 0 : rotTarget.current.yaw,
      6.5,
      delta
    );
    rotCurrent.current.pitch = THREE.MathUtils.damp(
      rotCurrent.current.pitch,
      reducedMotion ? 0 : rotTarget.current.pitch,
      6.5,
      delta
    );

    const t = state.clock.elapsedTime;
    const floatY = reducedMotion ? 0 : Math.sin(t * 1.5) * 0.05;
    const floatRoll = reducedMotion ? 0 : Math.sin(t * 1.1) * 0.02;

    boxGroupRef.current.position.y = 0.28 + floatY;
    boxGroupRef.current.rotation.set(
      rotCurrent.current.pitch,
      rotCurrent.current.yaw,
      floatRoll
    );
  });

  return (
    <>
      <ambientLight intensity={0.92} color="#FFF5F8" />
      <directionalLight position={[3, 5, 4]} intensity={1.25} color="#FFF8F4" />
      <directionalLight position={[-3, -1, -2]} intensity={0.4} color="#E8D4FF" />
      <spotLight
        position={[0, 4.8, 2.8]}
        intensity={2.4}
        angle={0.65}
        penumbra={0.8}
        color={theme.spotlightTint}
      />

      {/* Pedestal Structure with Glowing Halo Ring */}
      <group position={[0, -1.35, 0]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[1.4, 1.5, 1.4, 48]} />
          <meshPhysicalMaterial
            color="#FFF7FA"
            roughness={0.28}
            metalness={0.02}
            clearcoat={0.4}
            clearcoatRoughness={0.2}
          />
        </mesh>
        <mesh position={[0, 0.72, 0]}>
          <cylinderGeometry args={[1.45, 1.45, 0.08, 48]} />
          <meshPhysicalMaterial
            color="#FFFFFF"
            roughness={0.18}
            metalness={0.02}
            clearcoat={0.65}
            clearcoatRoughness={0.12}
          />
        </mesh>
        <mesh position={[0, 0.765, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.25, 1.42, 48]} />
          <meshBasicMaterial
            color={theme.badgeRing}
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* 3D Box Packaging */}
      <group ref={boxGroupRef} position={[0, 0.28, 0]}>
        <mesh ref={meshRef} material={materials}>
          <boxGeometry args={[BOX_WIDTH, BOX_HEIGHT, BOX_DEPTH]} />
        </mesh>

        {/* Orbiting Luminous Embers */}
        {!reducedMotion && (
          <group>
            {[0, 1, 2, 3, 4].map((i) => {
              const angle = (i / 5) * Math.PI * 2;
              const r = 1.55 + (i % 2) * 0.25;
              const px = Math.cos(angle) * r;
              const pz = Math.sin(angle) * r;
              const py = (i - 2) * 0.32;
              return (
                <mesh key={i} position={[px, py, pz]}>
                  <sphereGeometry args={[0.035, 12, 12]} />
                  <meshStandardMaterial
                    color="#FFF8FC"
                    emissive={theme.badgeRing}
                    emissiveIntensity={0.65}
                  />
                </mesh>
              );
            })}
          </group>
        )}
      </group>
    </>
  );
}

export function Product3DViewer({
  product,
  className = "",
  height = "360px",
  showHint = true,
}: Product3DViewerProps) {
  const reducedMotion = useReducedMotion();
  const [hasWebgl] = useState<boolean>(() => isWebGLAvailable());
  const theme =
    PRODUCT_THEMES[product.id] ?? PRODUCT_THEMES[PRODUCTS[0].id];

  const heightStyle = typeof height === "number" ? `${height}px` : height;

  if (reducedMotion || !hasWebgl) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-border p-6 ${className}`}
        style={{ height: heightStyle, backgroundColor: theme.ambientTint }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageCutout}
          alt={product.nameTh}
          width={240}
          height={280}
          className="max-h-[80%] w-auto object-contain drop-shadow-md"
        />
        <div className="mt-3 h-3 w-36 rounded-full bg-surface/90 shadow-xs" />
      </div>
    );
  }

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      <div
        className="relative w-full overflow-hidden rounded-3xl border border-border"
        style={{ height: heightStyle, backgroundColor: theme.ambientTint }}
      >
        <Canvas
          camera={{ fov: 40, position: [0, 0.4, 5.2] }}
          gl={{ antialias: true, alpha: true }}
        >
          <ViewerScene product={product} reducedMotion={reducedMotion} />
        </Canvas>

        {showHint && (
          <div className="pointer-events-none absolute bottom-3 inset-x-0 flex justify-center">
            <span className="rounded-full bg-surface/90 px-3 py-1 text-[0.75rem] font-medium text-[#555261] shadow-xs backdrop-blur-xs">
              คลิกลากหรือแตะเพื่อหมุนสำรวจกล่อง 360°
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
