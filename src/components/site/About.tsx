import { Award, CheckCircle2, Compass, ShieldCheck, Target } from "lucide-react";
import bigbro from "@/assets/bigbro.jpg.asset.json";
import mybro from "@/assets/mybro.jpg.asset.json";
import { STATS } from "@/lib/site-data";
import { Counter, Reveal, SectionHeading } from "./primitives";

const points = [
  "Licensed & certified professional surveyors",
  "Cutting-edge GNSS, robotic total stations & UAV technology",
  "End-to-end field-to-finish geospatial workflows",
  "Certified, dispute-proof survey documentation",
  "Nationwide coverage with rapid on-site mobilisation",
  "Trusted by government, developers, engineers & private clients",
];

const pillars = [
  {
    icon: Target,
    title: "Our Mission",
    desc: "To deliver accurate, reliable geospatial data that empowers informed decisions and safeguards every investment on the ground.",
  },
  {
    icon: Compass,
    title: "Our Vision",
    desc: "To be Nigeria's most trusted surveying and consultancy firm, setting the benchmark for precision, integrity and modern practice.",
  },
  {
    icon: ShieldCheck,
    title: "Our Values",
    desc: "Integrity, precision, professionalism and a client-first mindset guide every project we take on — from small plots to national infrastructure.",
  },
  {
    icon: Award,
    title: "Our Expertise",
    desc: "A multidisciplinary team of licensed surveyors, GIS analysts and drone pilots backed by decades of combined field experience.",
  },
];

export function About() {
  return (
    <section id="about" className="relative py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="About ASTAD Survey"
          title={<>Modern surveying, <span className="text-gradient-gold">measured to perfection</span></>}
          subtitle="ASTAD Survey & Consultants delivers modern surveying and geospatial services powered by advanced technology, blending decades of engineering expertise with precision instrumentation to serve clients across Nigeria."
        />

        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal className="relative pb-10 pr-6 sm:pb-14 sm:pr-10">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <img src={bigbro.url} alt="ASTAD surveyor operating a total station on-site" width={900} height={700} loading="lazy" className="w-full object-cover" />
            </div>
            <div className="absolute bottom-0 right-0 w-32 overflow-hidden rounded-2xl border-4 border-background shadow-xl sm:w-56">
              <img src={mybro.url} alt="ASTAD surveyor performing field data collection" width={900} height={800} loading="lazy" className="w-full object-cover" />
            </div>
            <div className="glass absolute left-2 top-4 rounded-2xl px-4 py-3 shadow-lg sm:left-0 sm:top-8 sm:px-5">
              <p className="font-display text-2xl font-bold text-gold">10+ yrs</p>
              <p className="text-xs text-muted-foreground">Field experience</p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h3 className="font-display text-2xl font-semibold sm:text-3xl">
              Turning complex ground realities into reliable spatial intelligence.
            </h3>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Founded on a passion for precision, ASTAD Survey & Consultants combines qualified professionals, state-of-the-art instruments and rigorous quality assurance to produce survey deliverables that stand up to legal, engineering and regulatory scrutiny.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              From land and cadastral surveys to GIS mapping, drone-based aerial capture and construction layout, we equip developers, engineers, governments and property owners with accurate data they can build on with total confidence.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {points.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                  <span className="text-sm text-foreground/85">{p}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="mt-20 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06}>
              <div className="glass h-full rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-1.5">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gold/15 text-gold ring-1 ring-gold/30">
                  <p.icon className="h-5 w-5" />
                </div>
                <h4 className="mt-4 font-display text-lg font-semibold text-foreground">{p.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 lg:grid-cols-4">
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
