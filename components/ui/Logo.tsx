import { archivo, cormorant, jetbrains } from "@/app/fonts";

type LogoProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  as?: "div" | "span";
};

const sizes = {
  sm: "text-[1.2rem] tracking-[0.4em]",
  md: "text-[1.35rem] tracking-[0.44em]",
  lg: "text-[2rem] sm:text-[2.75rem] tracking-[0.4em]",
};

const taglineSizes = {
  sm: "text-[0.4375rem] tracking-[0.44em]",
  md: "text-[0.4375rem] tracking-[0.5em]",
  lg: "text-[0.5rem] sm:text-[0.5625rem] tracking-[0.52em]",
};

/**
 * The NOIR wordmark: compressed geometric caps, crimson full stop,
 * and an optional micro tagline set in mono.
 */
export function Logo({
  className = "",
  size = "md",
  showTagline = true,
  as: Tag = "div",
}: LogoProps) {
  return (
    <Tag className={`flex flex-col gap-1.5 select-none ${className}`}>
      <span
        className={`${archivo.variable} flex items-start leading-none text-bone ${sizes[size]}`}
        style={{ fontFamily: "var(--font-archivo)", fontStretch: "84%", fontWeight: 500 }}
      >
        NOIR
        <span
          aria-hidden="true"
          className="ml-[0.14em] mt-[0.12em] inline-block h-[0.19em] w-[0.19em] bg-crimson"
        />
      </span>
      {showTagline && (
        <span
          className={`${jetbrains.variable} ${cormorant.variable} flex items-center gap-2 text-ash uppercase`}
        >
          <span
            className={`${taglineSizes[size]} font-medium`}
            style={{ fontFamily: "var(--font-mono-data)", letterSpacing: "0.5em" }}
          >
            Beyond Luxury
          </span>
        </span>
      )}
    </Tag>
  );
}
