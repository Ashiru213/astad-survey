import { CheckCircle2 } from "lucide-react";
import bigbro from "@/assets/bigbro.jpg.asset.json";
import mybro from "@/assets/mybro.jpg.asset.json";
import { STATS } from "@/lib/site-data";
import { Counter, Reveal, SectionHeading } from "./primitives";

const points = [
  "Licensed & certified professional surveyors",
  "Cutting-edge GNSS, robotic total stations & UAV technology",
  "End-to-end field-to-finish geospatial workflows",
  "Certified, dispute-proof survey documentation",
];

export function About() {
  return (
    <section id="about" className="relative py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="About ASTAD Survey"
          title={<>Modern surveying, <span className="text-gradient-gold">measured to perfection</span></>}
          subtitle="ASTAD Survey delivers modern surveying and geospatial services powered by advanced technology, blending decades of engineering expertise with precision instrumentation."
        />

        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal className="relative">
            <div className="relative overflow-hidden rounded-3xl">
              <img src={bigbro.url} alt="ASTAD surveyor operating a total station on-site" width={900} height={700} loading="lazy" className="w-full object-cover" />
            </div>
            <div className="absolute -bottom-8 -right-4 hidden w-56 overflow-hidden rounded-2xl border-4 border-background shadow-xl sm:block">
              <img src={mybro.url} alt="ASTAD surveyor performing field data collection" width={900} height={800} loading="lazy" className="w-full object-cover" />
            </div>
            <div className="glass absolute -left-4 top-8 rounded-2xl px-5 py-3 shadow-lg">
              <p className="font-display text-2xl font-bold text-gold">10+ yrs</p>
              <p className="text-xs text-muted-foreground">Field experience</p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h3 className="font-display text-2xl font-semibold sm:text-3xl">
              Turning complex ground realities into reliable spatial intelligence.
            </h3>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              From land and cadastral surveys to GIS mapping and construction layout, we equip developers, engineers, governments and property owners with accurate data they can build on with confidence.
            </p>
            <ul className="mt-6 space-y-3">
              {points.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                  <span className="text-sm text-foreground/85">{p}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="glass group rounded-3xl p-6 text-center transition-transform duration-300 hover:-translate-y-1.5">
                <p className="font-display text-4xl font-bold text-gradient-gold sm:text-5xl">
                  <Counter to={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-2 text-sm font-medium text-muted-foreground">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
