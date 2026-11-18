import { COPY_TH } from "@/content/copy.th";

export type CategoryId =
  | "condoms"
  | "lubricants"
  | "hiv-test-kits"
  | "intimate-wash"
  | "sex-box-set";

export interface Category {
  id: CategoryId;
  slug: string;
  nameTh: string;
}

export const CATEGORIES: readonly Category[] = [
  {
    id: "condoms",
    slug: "condoms",
    nameTh: COPY_TH.categories.condoms,
  },
  {
    id: "lubricants",
    slug: "lubricants",
    nameTh: COPY_TH.categories.lubricants,
  },
  {
    id: "hiv-test-kits",
    slug: "hiv-test-kits",
    nameTh: COPY_TH.categories.hivTestKits,
  },
  {
    id: "intimate-wash",
    slug: "intimate-wash",
    nameTh: COPY_TH.categories.intimateWash,
  },
  {
    id: "sex-box-set",
    slug: "sex-box-set",
    nameTh: COPY_TH.categories.sexBoxSet,
  },
] as const;
