import { MapPin, Navigation, Satellite } from "lucide-react";
import { AnimatedBackground } from "./AnimatedBackground";
import { Reveal } from "./primitives";

const PINS = [
  { top: "28%", left: "24%", label: "Lagos" },
  { top: "54%", left: "46%", label: "Oyo" },
  { top: "38%", left: "68%", label: "Abuja" },
  { top: "68%", left: "72%", label: "Ibadan" },
];

export function MapSection() {
  return (
    <section id="projects" className="relative overflow-hidden bg-primary py-24 text-primary-foreground">
      <AnimatedBackground variant="map" />
      <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-2 lg:items-center lg:px-8">
        <Reveal center={false}>
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            <Satellite className="h-3.5 w-3.5" /> Geospatial Coverage
          </span>
          <h2 className="mt-5 font-display text-3xl font-bold sm:text-4xl md:text-5xl">
            Mapping Nigeria with <span className="text-gradient-gold">pinpoint accuracy</span>
          </h2>
          <p className="mt-4 max-w-lg text-primary-foreground/75">
            Our GIS-driven operations span the nation. From dense urban corridors to remote terrain, we deploy real-time GNSS positioning and satellite mapping to capture every coordinate.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { icon: Navigation, k: "Live RTK", v: "Real-time" },
              { icon: MapPin, k: "Survey Pins", v: "10k+ set" },
              { icon: Satellite, k: "Satellites", v: "24 linked" },
            ].map((x) => (
              <div key={x.k} className="glass-dark rounded-2xl p-4 text-center">
                <x.icon className="mx-auto h-6 w-6 text-gold" />
                <p className="mt-2 font-display text-sm font-semibold">{x.v}</p>
                <p className="text-[11px] text-primary-foreground/60">{x.k}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1} center={false}>
          <div className="glass-dark relative aspect-[4/3] overflow-hidden rounded-3xl">
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "linear-gradient(to right, oklch(0.78 0.13 85 / 0.4) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.78 0.13 85 / 0.4) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <svg className="absolute inset-0 h-full w-full">
              <path d="M 90 130 L 200 240 L 300 190 L 360 300" fill="none" stroke="oklch(0.78 0.13 85 / 0.7)" strokeWidth="2" strokeDasharray="5 6" className="animate-dash" />
            </svg>
            {PINS.map((p, i) => (
              <div key={p.label} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ top: p.top, left: p.left }}>
                <span className="relative flex flex-col items-center">
                  <span className="absolute -top-1 flex h-8 w-8 items-center justify-center">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-gold/50 animate-ping-slow" style={{ animationDelay: `${i * 0.6}s` }} />
                  </span>
                  <MapPin className="relative h-7 w-7 fill-gold/20 text-gold drop-shadow" />
                  <span className="mt-0.5 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-medium text-primary-foreground">{p.label}</span>
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
