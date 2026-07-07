import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function GlassCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-card/85 p-5 shadow-sm backdrop-blur",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function ProgressRing({
  value,
  size = 128,
  strokeWidth = 12,
  label,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: ReactNode;
}) {
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const dash = (Math.min(100, Math.max(0, value)) / 100) * c;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-muted/40" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
        />
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--primary)" />
            <stop offset="1" stopColor="var(--primary-glow)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
        {label ?? <span className="text-xl font-bold">{value}%</span>}
      </div>
    </div>
  );
}

export function MiniProgress({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-muted", className)}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow transition-all"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function StatRow({
  icon: Icon,
  label,
  value,
  tone = "default",
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: number | string;
  tone?: "default" | "accent" | "success";
}) {
  const toneCls =
    tone === "accent"
      ? "text-accent ring-accent/30 bg-accent/10"
      : tone === "success"
      ? "text-primary ring-primary/30 bg-primary/10"
      : "text-primary ring-primary/20 bg-primary/10";
  return (
    <div className="flex items-center gap-3">
      <span className={cn("grid h-9 w-9 place-items-center rounded-lg ring-1", toneCls)}>
        <Icon className="h-4 w-4" strokeWidth={2.4} />
      </span>
      <span className="flex-1 text-sm font-medium text-foreground/80">{label}</span>
      <span className="grid h-8 min-w-8 place-items-center rounded-full bg-muted px-2 text-xs font-bold">
        {value}
      </span>
    </div>
  );
}

export function CoverThumb({
  title,
  src,
  className,
}: {
  title: string;
  src?: string | null;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/25 via-primary-glow/15 to-accent/25",
        className,
      )}
    >
      {src ? (
        <img src={src} alt={title} className="h-full w-full object-cover" />
      ) : (
        <div className="grid h-full w-full place-items-center p-3 text-center">
          <span className="line-clamp-3 text-sm font-bold text-foreground/85">{title}</span>
        </div>
      )}
    </div>
  );
}
