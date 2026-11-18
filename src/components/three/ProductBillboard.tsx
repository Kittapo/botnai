"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { COPY_TH } from "@/content/copy.th";
import { getProductById, PRODUCT_THEMES, PRODUCTS } from "@/data/products";
import { scrollState, smoothstep } from "@/lib/scroll";
import { PEDESTAL_POSITION } from "@/components/three/Pedestal";

export interface ProductBillboardProps {
  productId: string;
  cutoutUrl: string;
  fallbackImageUrl: string;
  modelUrl?: string | null;
  reducedMotion: boolean;
  onHoverChange?: (hovered: boolean) => void;
}

// 3D Box Dimensions (Standard 3-pack condom box proportion: ~58mm x ~60mm x ~14mm)
const BOX_WIDTH = 1.82;
const BOX_HEIGHT = 1.88;
const BOX_DEPTH = 0.44;

function createPlaceholderTexture(
  nameTh: string,
  packCount: number,
  sizeMm: number | null,
  isComfort: boolean
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 660;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.clearRect(0, 0, 640, 660);
    const grad = ctx.createLinearGradient(0, 0, 640, 660);
    if (isComfort) {
      grad.addColorStop(0, "#123899");
      grad.addColorStop(1, "#0A205A");
    } else {
      grad.addColorStop(0, "#22242B");
      grad.addColorStop(1, "#111216");
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 640, 660);

    ctx.strokeStyle = isComfort ? "#5E85F0" : "#E2B868";
    ctx.lineWidth = 6;
    ctx.strokeRect(16, 16, 608, 628);

    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";
    ctx.font = "bold 34px sans-serif";
    ctx.fillText("durex", 320, 240);

    ctx.font = "600 28px sans-serif";
    ctx.fillText(nameTh, 320, 340);

    ctx.fillStyle = isComfort ? "#D4E0FF" : "#F2D8A7";
    ctx.font = "500 24px sans-serif";
    ctx.fillText(COPY_TH.scene04.packFormat(packCount), 320, 400);

    if (sizeMm !== null) {
      ctx.fillText(
        `${COPY_TH.scene04.sizeLabel} ${COPY_TH.scene04.sizeFormat(sizeMm)}`,
        320,
        448
      );
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export function ProductBillboard({
  productId,
  cutoutUrl,
  fallbackImageUrl,
  modelUrl,
  reducedMotion,
  onHoverChange,
}: ProductBillboardProps) {
  const groupRef = useRef<THREE.Group>(null);
  const boxMeshRef = useRef<THREE.Mesh>(null);
  const { gl } = useThree();

  const [hovered, setHovered] = useState(false);

  // Rotation state for interactive 360° turntable spin
  const rotTarget = useRef({ yaw: 0, pitch: 0 });
  const rotCurrent = useRef({ yaw: 0, pitch: 0 });
  const isDragging = useRef(false);

  const activeProduct = getProductById(productId) ?? PRODUCTS[0];
  const theme =
    PRODUCT_THEMES[activeProduct.id] ?? PRODUCT_THEMES[PRODUCTS[0].id];

  // Create persistent materials array for this product
  const boxMaterials = useMemo(() => {
    const isComfort = activeProduct.id === "durex-comfort";
    const sideColor = isComfort ? "#0D2A72" : "#121316";
    const sideEdge = isComfort ? "#3B66D6" : "#4A4638";

    const sideMat = new THREE.MeshPhysicalMaterial({
      color: sideColor,
      emissive: sideEdge,
      emissiveIntensity: 0.08,
      roughness: 0.22,
      metalness: 0.06,
      clearcoat: 1.0,
      clearcoatRoughness: 0.12,
      reflectivity: 0.75,
      transparent: true,
      opacity: 1,
    });

    const topMat = new THREE.MeshPhysicalMaterial({
      color: sideColor,
      roughness: 0.22,
      metalness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 0.7,
      transparent: true,
      opacity: 1,
    });

    const frontMat = new THREE.MeshPhysicalMaterial({
      color: "#FFFFFF",
      roughness: 0.18,
      metalness: 0.04,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 0.85,
      transparent: true,
      opacity: 1,
    });

    const backMat = new THREE.MeshPhysicalMaterial({
      color: "#FFFFFF",
      roughness: 0.18,
      metalness: 0.04,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 0.85,
      transparent: true,
      opacity: 1,
    });

    return [
      sideMat, // 0: +X Right
      sideMat, // 1: -X Left
      topMat,  // 2: +Y Top
      topMat,  // 3: -Y Bottom
      frontMat,// 4: +Z Front
      backMat, // 5: -Z Back
    ];
  }, [activeProduct.id]);

  // Load and apply front and back textures directly into boxMaterials
  useEffect(() => {
    let active = true;
    const loader = new THREE.TextureLoader();

    const loadTex = (url: string, isBack = false) => {
      return new Promise<THREE.Texture>((resolve, reject) => {
        loader.load(
          url,
          (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
            if (isBack) {
              tex.wrapS = THREE.RepeatWrapping;
              tex.repeat.x = -1;
            }
            resolve(tex);
          },
          undefined,
          reject
        );
      });
    };

    const frontUrl = activeProduct.imageCutout || cutoutUrl;
    const backUrl = activeProduct.imageBackCutout || activeProduct.imageBack;

    Promise.all([
      loadTex(frontUrl).catch(() => loadTex(fallbackImageUrl)),
      backUrl ? loadTex(backUrl, true).catch(() => null) : Promise.resolve(null),
    ]).then(([frontTex, backTex]) => {
      if (!active) return;
      const f =
        frontTex ??
        createPlaceholderTexture(
          activeProduct.nameTh,
          activeProduct.packCount,
          activeProduct.sizeMm,
          activeProduct.id === "durex-comfort"
        );
      const b =
        backTex ??
        createPlaceholderTexture(
          activeProduct.nameTh,
          activeProduct.packCount,
          activeProduct.sizeMm,
          activeProduct.id === "durex-comfort"
        );

      boxMaterials[4].map = f;
      boxMaterials[4].needsUpdate = true;
      boxMaterials[5].map = b;
      boxMaterials[5].needsUpdate = true;
    });

    return () => {
      active = false;
    };
  }, [
    activeProduct.id,
    activeProduct.imageBack,
    activeProduct.imageBackCutout,
    activeProduct.imageCutout,
    activeProduct.nameTh,
    activeProduct.packCount,
    activeProduct.sizeMm,
    boxMaterials,
    cutoutUrl,
    fallbackImageUrl,
    gl,
  ]);

  // Clean up materials on unmount
  useEffect(() => {
    return () => {
      boxMaterials.forEach((m) => {
        m.map?.dispose();
        m.dispose();
      });
    };
  }, [boxMaterials]);

  // Touch and pointer dragging: Full interactive 360° spin!
  useEffect(() => {
    if (reducedMotion || typeof window === "undefined") return;
    let startX = 0;
    let startY = 0;
    let startYaw = 0;
    let startPitch = 0;

    const onDown = (e: PointerEvent) => {
      if (scrollState.progress < 0.54 || scrollState.progress > 0.89) return;
      const target = e.target as Element | null;
      if (target?.closest("a, button, input")) return;
      isDragging.current = true;
      startX = e.clientX;
      startY = e.clientY;
      startYaw = rotTarget.current.yaw;
      startPitch = rotTarget.current.pitch;
    };

    const onMove = (e: PointerEvent) => {
      if (!isDragging.current) {
        if (scrollState.progress >= 0.56 && scrollState.progress <= 0.88) {
          rotTarget.current.yaw = scrollState.pointerX * 0.42;
          rotTarget.current.pitch = -scrollState.pointerY * 0.18;
        }
        return;
      }
      const dx = (e.clientX - startX) / 110;
      const dy = (e.clientY - startY) / 110;
      rotTarget.current.yaw = startYaw + dx * 2.2;
      rotTarget.current.pitch = THREE.MathUtils.clamp(
        startPitch + dy * 0.8,
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
    const group = groupRef.current;
    if (!group) return;

    const p = reducedMotion ? 0 : scrollState.smoothed;
    const rise = reducedMotion ? 0 : smoothstep(0.58, 0.68, p);
    const fadeEnd = reducedMotion ? 0 : 1 - smoothstep(0.86, 0.95, p);
    const visibility = rise * fadeEnd;

    group.visible = visibility > 0.01;
    if (!group.visible) return;

    const isDesktop = state.size.width >= 1024;
    const baseX = isDesktop ? -1.15 : 0;
    const settledY = isDesktop ? 0.62 : 0.72;
    const hoverLift = hovered && !reducedMotion ? 0.09 : 0;

    const t = state.clock.elapsedTime;
    const floatY = reducedMotion ? 0 : Math.sin(t * 1.5) * 0.05 * rise;
    const floatRoll = reducedMotion ? 0 : Math.sin(t * 1.1) * 0.025 * rise;

    if (!isDragging.current && !reducedMotion) {
      rotTarget.current.yaw += delta * 0.18;
    }

    const currentY =
      THREE.MathUtils.lerp(-0.42, settledY, rise) + floatY + hoverLift;
    group.position.set(baseX, currentY, PEDESTAL_POSITION[2]);

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

    group.rotation.set(
      rotCurrent.current.pitch,
      rotCurrent.current.yaw,
      floatRoll
    );

    boxMaterials.forEach((mat) => {
      mat.opacity = visibility;
    });
  });

  void modelUrl;

  return (
    <group ref={groupRef} position={[0, 0.5, PEDESTAL_POSITION[2]]}>
      {/* 3D Box Packaging with Real Depth and Clearcoat Specular */}
      <mesh
        ref={boxMeshRef}
        material={boxMaterials}
        onPointerOver={() => {
          setHovered(true);
          onHoverChange?.(true);
        }}
        onPointerOut={() => {
          setHovered(false);
          onHoverChange?.(false);
        }}
      >
        <boxGeometry args={[BOX_WIDTH, BOX_HEIGHT, BOX_DEPTH]} />
      </mesh>

      {/* Floating Luminous Embers Orbiting around Box */}
      {!reducedMotion && (
        <group>
          {[0, 1, 2, 3, 4].map((i) => {
            const angle = (i / 5) * Math.PI * 2;
            const r = 1.6 + (i % 2) * 0.3;
            const px = Math.cos(angle) * r;
            const pz = Math.sin(angle) * r;
            const py = (i - 2) * 0.35;
            return (
              <mesh key={i} position={[px, py, pz]}>
                <sphereGeometry args={[0.038, 12, 12]} />
                <meshStandardMaterial
                  color="#FFF4F8"
                  emissive={theme.badgeRing}
                  emissiveIntensity={0.65}
                  roughness={0.2}
                />
              </mesh>
            );
          })}
        </group>
      )}
    </group>
  );
}
