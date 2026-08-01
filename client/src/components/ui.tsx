import {
  useState,
  type ButtonHTMLAttributes,
  type ComponentType,
  type CSSProperties,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";
import clsx from "clsx";

export function Card({
  className,
  style,
  children,
}: {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div
      style={style}
      className={clsx(
        "rounded-3xl border border-[var(--color-glass-border)] bg-[var(--color-surface)] backdrop-blur-xl [box-shadow:var(--shadow-soft)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "outline" }) {
  const styles = {
    primary:
      "text-white [background:linear-gradient(135deg,var(--color-brand),var(--color-brand-2))] hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed [box-shadow:var(--shadow-glow)]",
    outline:
      "border border-[var(--color-glass-border)] bg-[var(--color-surface)] backdrop-blur-xl text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] disabled:opacity-40",
    ghost: "text-[var(--color-text-dim)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)] disabled:opacity-40",
  };
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-150 cursor-pointer active:scale-[0.98]",
        styles[variant],
        className
      )}
      {...props}
    />
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={clsx(
        "w-full rounded-xl border border-[var(--color-glass-border)] bg-[var(--color-surface-2)] backdrop-blur-xl px-3.5 py-2.5 text-sm text-[var(--color-text)] outline-none transition-shadow placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-brand)] focus:bg-[var(--color-surface-hover)] focus:ring-4 focus:ring-[var(--color-brand)]/15",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={clsx(
        "w-full rounded-xl border border-[var(--color-glass-border)] bg-[var(--color-surface-2)] backdrop-blur-xl px-3.5 py-2.5 text-sm text-[var(--color-text)] outline-none transition-shadow placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-brand)] focus:bg-[var(--color-surface-hover)] focus:ring-4 focus:ring-[var(--color-brand)]/15",
        className
      )}
      {...props}
    />
  );
}

export function Label({ children }: { children: ReactNode }) {
  return <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-faint)]">{children}</label>;
}

export function Tag({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "brand" | "warn" | "good" | "bad" }) {
  const tones = {
    default: "bg-[var(--color-surface-2)] text-[var(--color-text-dim)] border-[var(--color-glass-border)]",
    brand: "bg-[var(--color-brand-soft)] text-[var(--color-brand)] border-transparent",
    warn: "bg-[var(--color-finance-soft)] text-[var(--color-finance)] border-transparent",
    good: "bg-[var(--color-recipe-soft)] text-[var(--color-recipe)] border-transparent",
    bad: "bg-rose-50 text-rose-600 border-transparent",
  };
  return (
    <span className={clsx("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium backdrop-blur-xl", tones[tone])}>
      {children}
    </span>
  );
}

export function IconBadge({
  icon: Icon,
  from,
  to,
  size = 44,
  iconSize = 20,
  className,
}: {
  icon: ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  from: string;
  to: string;
  size?: number;
  iconSize?: number;
  className?: string;
}) {
  return (
    <div
      className={clsx("flex shrink-0 items-center justify-center rounded-2xl", className)}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${from}, ${to})`,
        boxShadow: `0 6px 16px -4px color-mix(in srgb, ${from} 55%, transparent)`,
      }}
    >
      <Icon size={iconSize} strokeWidth={1.8} className="text-white" />
    </div>
  );
}

export function ProgressBar({ value, max, colorVar = "--color-brand" }: { value: number; max: number; colorVar?: string }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-surface-2)]">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, background: `var(${colorVar})` }}
      />
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={clsx(
        "inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent",
        className
      )}
    />
  );
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50/90 backdrop-blur-xl px-4 py-3 text-sm text-rose-700">{message}</div>
  );
}

export function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5 rounded-3xl border border-dashed border-[var(--color-glass-border)] bg-[var(--color-surface)]/40 backdrop-blur-xl py-16 text-center">
      <p className="text-sm font-medium text-[var(--color-text)]">{title}</p>
      <p className="max-w-sm text-sm text-[var(--color-text-dim)]">{detail}</p>
    </div>
  );
}

export function Tabs({
  tabs,
  defaultTab,
}: {
  tabs: { id: string; label: string; content: ReactNode }[];
  defaultTab?: string;
}) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id);
  const activeTab = tabs.find((t) => t.id === active) ?? tabs[0];
  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-1 rounded-xl border border-[var(--color-glass-border)] bg-[var(--color-surface-2)] backdrop-blur-xl p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={clsx(
              "flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
              active === t.id
                ? "bg-[var(--color-surface-solid)] text-[var(--color-text)] [box-shadow:var(--shadow-soft)]"
                : "text-[var(--color-text-dim)] hover:text-[var(--color-text)]"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      {activeTab?.content}
    </div>
  );
}

export function Details({ summary, children }: { summary: string; children: ReactNode }) {
  return (
    <details className="group rounded-2xl border border-[var(--color-glass-border)] bg-[var(--color-surface)] backdrop-blur-xl p-4 text-sm [box-shadow:var(--shadow-soft)] [&_summary]:cursor-pointer [&_summary]:font-semibold [&_summary]:text-[var(--color-text)] [&_summary]:marker:text-[var(--color-text-faint)]">
      <summary>{summary}</summary>
      <div className="mt-3 flex flex-col gap-2.5 border-t border-[var(--color-border-soft)] pt-3">{children}</div>
    </details>
  );
}
