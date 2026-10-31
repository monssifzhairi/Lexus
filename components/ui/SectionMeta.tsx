import { jetbrains } from "@/app/fonts";

type SectionMetaProps = {
  index: string;
  label: string;
  right?: string;
  tone?: "dark" | "light";
  className?: string;
};

/** The recurring editorial masthead for each section. */
export function SectionMeta({
  index,
  label,
  right,
  tone = "dark",
  className = "",
}: SectionMetaProps) {
  const isLight = tone === "light";
  return (
    <div
      className={`flex items-center gap-4 ${className}`}
      data-section-meta
    >
      <span
        className={`${jetbrains.className} text-[0.5625rem] tracking-[0.24em] ${
          isLight ? "text-[#B51224]" : "text-crimson"
        }`}
      >
        {index}
      </span>
      <span
        className={`${jetbrains.className} text-[0.5625rem] uppercase tracking-[0.32em] ${
          isLight ? "text-[#0A0A0A]" : "text-bone"
        }`}
      >
        {label}
      </span>
      <span
        aria-hidden="true"
        data-section-rule
        className={`h-px flex-1 origin-left ${
          isLight ? "bg-[rgba(10,10,10,0.16)]" : "bg-hairline"
        }`}
      />
      {right && (
        <span
          className={`${jetbrains.className} hidden text-[0.5rem] uppercase tracking-[0.28em] sm:block ${
            isLight ? "text-[#6B6B6B]" : "text-ash"
          }`}
        >
          {right}
        </span>
      )}
    </div>
  );
}
