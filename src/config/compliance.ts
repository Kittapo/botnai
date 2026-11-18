import { COPY_TH } from "@/content/copy.th";

/**
 * Legal purchase age threshold.
 * Must remain null until the project owner confirms the legal requirement.
 * Never invent or display a specific legal age when null.
 */
export const MIN_PURCHASE_AGE: number | null = null;

/**
 * Controls visibility of the clearly badged UI-only demo rating.
 * Defaults to true unless explicitly set to "false".
 */
export const SHOW_DEMO_RATING: boolean =
  process.env.NEXT_PUBLIC_SHOW_DEMO_RATING !== "false";

export const COMPLIANCE_COPY = COPY_TH.compliance;
