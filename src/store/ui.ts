import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { PRODUCTS } from "@/data/products";

export type ShopMode = "grid" | "3d";

interface UiState {
  /** User-forced reduced motion toggle ("ลดแอนิเมชัน") */
  forceReducedMotion: boolean;
  /** OS-level prefers-reduced-motion media query value */
  systemReducedMotion: boolean;
  /** Currently active Scene 04 product ID */
  activeProductId: string;
  /** Active scene index (0..3) for desktop right-edge SceneDots */
  activeSceneIndex: number;
  /** Intro sequence state (true once completed or skipped) */
  introComplete: boolean;
  /** Mobile navigation drawer state */
  mobileMenuOpen: boolean;
  /** Persisted shop view mode for Phase 2+ */
  shopMode: ShopMode;
  /** Flag set if WebGL is unavailable, errors, or loses context */
  webglFallback: boolean;
  /** Global Lumi Thai voice narration toggle */
  voiceEnabled: boolean;

  setForceReducedMotion: (enabled: boolean) => void;
  toggleForceReducedMotion: () => void;
  setSystemReducedMotion: (enabled: boolean) => void;
  setActiveProductId: (id: string) => void;
  cycleProduct: (direction: 1 | -1) => void;
  setActiveSceneIndex: (index: number) => void;
  setIntroComplete: (complete: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setShopMode: (mode: ShopMode) => void;
  setWebglFallback: (fallback: boolean) => void;
  toggleVoice: () => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set, get) => ({
      forceReducedMotion: false,
      systemReducedMotion: false,
      activeProductId: PRODUCTS[0].id,
      activeSceneIndex: 0,
      introComplete: false,
      mobileMenuOpen: false,
      shopMode: "grid",
      webglFallback: false,
      voiceEnabled: true,

      setForceReducedMotion: (enabled) =>
        set({
          forceReducedMotion: enabled,
          ...(enabled ? { introComplete: true } : {}),
        }),
      toggleForceReducedMotion: () => {
        const next = !get().forceReducedMotion;
        set({
          forceReducedMotion: next,
          ...(next ? { introComplete: true } : {}),
        });
      },
      setSystemReducedMotion: (enabled) =>
        set({
          systemReducedMotion: enabled,
          ...(enabled ? { introComplete: true } : {}),
        }),
      setActiveProductId: (id) => {
        if (PRODUCTS.some((p) => p.id === id)) {
          set({ activeProductId: id });
        }
      },
      cycleProduct: (direction) => {
        const currentId = get().activeProductId;
        const idx = PRODUCTS.findIndex((p) => p.id === currentId);
        const nextIdx =
          (idx + direction + PRODUCTS.length) % PRODUCTS.length;
        set({ activeProductId: PRODUCTS[nextIdx].id });
      },
      setActiveSceneIndex: (index) => {
        if (get().activeSceneIndex !== index) {
          set({ activeSceneIndex: index });
        }
      },
      setIntroComplete: (complete) => set({ introComplete: complete }),
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
      setShopMode: (mode) => set({ shopMode: mode }),
      setWebglFallback: (fallback) => set({ webglFallback: fallback }),
      toggleVoice: () => {
        const next = !get().voiceEnabled;
        set({ voiceEnabled: next });
        if (!next && typeof window !== "undefined" && "speechSynthesis" in window) {
          window.speechSynthesis.cancel();
        }
      },
    }),
    {
      name: "bloomcare-ui-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        forceReducedMotion: state.forceReducedMotion,
        shopMode: state.shopMode,
      }),
    }
  )
);
