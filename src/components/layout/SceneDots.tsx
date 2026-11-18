"use client";

import { COPY_TH } from "@/content/copy.th";
import { SCENE_ANCHOR_IDS, scrollToSceneId } from "@/lib/scroll";
import { useReducedMotion } from "@/lib/reducedMotion";
import { useUiStore } from "@/store/ui";

export function SceneDots() {
  const activeSceneIndex = useUiStore((s) => s.activeSceneIndex);
  const setActiveSceneIndex = useUiStore((s) => s.setActiveSceneIndex);
  const reducedMotion = useReducedMotion();

  return (
    <nav
      aria-label={COPY_TH.a11y.sceneNav}
      className="fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-1 xl:flex"
    >
      {SCENE_ANCHOR_IDS.map((anchorId, idx) => {
        const isActive = activeSceneIndex === idx;
        const label = COPY_TH.sceneNames[idx];

        return (
          <button
            key={anchorId}
            type="button"
            data-cursor="interactive"
            aria-label={label}
            aria-current={isActive ? "step" : undefined}
            onClick={() => {
              setActiveSceneIndex(idx);
              scrollToSceneId(anchorId, reducedMotion);
            }}
            className="group relative flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-strong"
          >
            <span className="pointer-events-none absolute right-12 whitespace-nowrap rounded-full border border-border bg-surface/95 px-3 py-1 text-[0.8125rem] font-medium leading-[1.4] text-text opacity-0 shadow-sm transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">
              {label}
            </span>
            <span
              aria-hidden="true"
              className={[
                "block rounded-full transition-[transform,background-color] duration-200",
                isActive
                  ? "h-3 w-3 scale-110 bg-primary-strong ring-4 ring-secondary"
                  : "h-2 w-2 bg-[#9A8E96] group-hover:scale-125 group-hover:bg-primary-strong",
              ].join(" ")}
            />
          </button>
        );
      })}
    </nav>
  );
}
