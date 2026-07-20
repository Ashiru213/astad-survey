import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 10%, oklch(0.78 0.13 85 / 0.25), transparent 40%), radial-gradient(circle at 80% 90%, oklch(0.78 0.13 85 / 0.15), transparent 45%)",
        }}
      />
      <div className="relative w-full max-w-md">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-gold"
        >
          ← Back to ASTAD Survey
        </Link>
        <div className="rounded-3xl border border-border/60 bg-card/70 p-8 shadow-2xl backdrop-blur">
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold text-gold">{title}</h1>
            {subtitle && <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          {children}
          {footer && (
            <div className="mt-6 border-t border-border/60 pt-4 text-center text-sm text-muted-foreground">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const authFieldClass =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-gold";

export const authButtonClass =
  "inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-primary shadow-lg shadow-gold/20 transition-transform hover:scale-[1.02] disabled:opacity-60";