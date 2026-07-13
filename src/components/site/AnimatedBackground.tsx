export function AnimatedBackground({ variant = "hero" }: { variant?: "hero" | "map" }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0 animate-pan-grid opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in oklab, var(--gold) 45%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--gold) 45%, transparent) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(circle at 50% 40%, black, transparent 78%)",
        }}
      />
      <svg className="absolute inset-0 h-full w-full opacity-40" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="contour" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--royal)" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d={`M -50 ${120 + i * 90} C 300 ${40 + i * 90}, 700 ${240 + i * 90}, 1600 ${90 + i * 90}`}
            fill="none"
            stroke="url(#contour)"
            strokeWidth="1.2"
            strokeDasharray="6 10"
            className="animate-dash"
            style={{ animationDuration: `${8 + i * 2}s` }}
          />
        ))}
      </svg>
      {[
        { top: "22%", left: "16%", d: "0s" },
        { top: "62%", left: "28%", d: "0.8s" },
        { top: "34%", left: "76%", d: "1.6s" },
        { top: "70%", left: "68%", d: "2.4s" },
        { top: "48%", left: "50%", d: "1.2s" },
      ].map((p, i) => (
        <span key={i} className="absolute" style={{ top: p.top, left: p.left }}>
          <span className="relative flex h-3 w-3">
            <span
              className="absolute inline-flex h-full w-full rounded-full bg-gold animate-ping-slow"
              style={{ animationDelay: p.d }}
            />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-gold ring-2 ring-gold/40" />
          </span>
        </span>
      ))}
      {variant === "hero" && (
        <>
          <div className="absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-gold/20 blur-[100px]" />
          <div className="absolute -right-24 bottom-1/4 h-80 w-80 rounded-full bg-royal/25 blur-[110px]" />
        </>
      )}
    </div>
  );
}
