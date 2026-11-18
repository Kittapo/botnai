import { COPY_TH } from "@/content/copy.th";

interface PriceTagProps {
  price: number | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const thbFormatter = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function PriceTag({
  price,
  size = "md",
  className = "",
}: PriceTagProps) {
  if (price === null) {
    const sizeClasses =
      size === "lg"
        ? "px-3.5 py-1.5 text-[0.95rem]"
        : size === "sm"
          ? "px-2.5 py-1 text-[0.8125rem]"
          : "px-3 py-1 text-[0.875rem]";

    return (
      <span
        className={`inline-flex items-center rounded-full bg-accent-cream border border-[#E8D5C5] text-[#4C4757] font-medium leading-[1.45] ${sizeClasses} ${className}`}
      >
        {COPY_TH.productFallbacks.pricePending}
      </span>
    );
  }

  const numericClasses =
    size === "lg"
      ? "text-[1.25rem] font-semibold text-text"
      : size === "sm"
        ? "text-[0.9rem] font-medium text-text"
        : "text-[1.05rem] font-semibold text-text";

  return (
    <span className={`${numericClasses} leading-[1.4] ${className}`}>
      {thbFormatter.format(price)}
    </span>
  );
}
