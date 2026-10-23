import { Link } from "@tanstack/react-router";

interface LogoProps {
  variant?: "full" | "mark" | "stacked";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  asLink?: boolean;
  inverted?: boolean;
  showSubtitle?: boolean;
}

const sizeMap = {
  xs: { height: "h-7", markDim: "h-7 w-7" },
  sm: { height: "h-9", markDim: "h-9 w-9" },
  md: { height: "h-11", markDim: "h-11 w-11" },
  lg: { height: "h-14", markDim: "h-14 w-14" },
  xl: { height: "h-20", markDim: "h-20 w-20" },
};

export function Logo({
  variant = "full",
  size = "md",
  className = "",
  asLink = true,
  inverted = false,
  showSubtitle = false,
}: LogoProps) {
  const currentSize = sizeMap[size];

  const content = (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {variant === "mark" ? (
        <img
          src="/logo-mark.png"
          alt="Unite Academy Mark"
          className={`${currentSize.markDim} object-contain transition-transform duration-200 group-hover:scale-105`}
          loading="eager"
        />
      ) : (
        <div className="flex flex-col">
          <div className="flex items-center">
            {inverted ? (
              <img
                src="/logo-dark.png"
                alt="Unite Academy"
                className={`${currentSize.height} w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]`}
                loading="eager"
              />
            ) : (
              <>
                {/* Light mode: crisp transparent logo with charcoal text */}
                <img
                  src="/logo.png"
                  alt="Unite Academy"
                  className={`${currentSize.height} w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02] dark:hidden`}
                  loading="eager"
                />
                {/* Dark mode: crisp transparent logo with white text */}
                <img
                  src="/logo-dark.png"
                  alt="Unite Academy"
                  className={`${currentSize.height} w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02] hidden dark:block`}
                  loading="eager"
                />
              </>
            )}
          </div>
          {showSubtitle && (
            <span className="text-[10px] font-medium tracking-wide text-muted-foreground mt-0.5">
              ইউনাইট একাডেমি
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (asLink) {
    return (
      <Link to="/" className="group inline-flex items-center outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
}
