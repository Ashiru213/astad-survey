import { ArrowRight, Phone, Star } from "lucide-react";
import { motion } from "motion/react";
import heroImg from "@/assets/hero.jpg";
import { AnimatedBackground } from "./AnimatedBackground";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

export function Hero() {
  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden bg-primary text-primary-foreground">
      <div className="absolute inset-0">
        <img src={heroImg} alt="Survey engineer operating a robotic total station on a construction site" width={1920} height={1280} className="h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/85 to-royal/50" />
      </div>
      <AnimatedBackground variant="hero" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 px-5 pt-28 pb-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.span variants={item} className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            <Star className="h-3.5 w-3.5 fill-gold text-gold" /> Trusted Geospatial Experts in Nigeria
          </motion.span>
          <motion.h1 variants={item} className="mt-6 font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Precision Surveying.
            <br />
            <span className="text-gradient-gold">Accurate Mapping.</span>
            <br />
            Trusted Geospatial Solutions.
          </motion.h1>
          <motion.p variants={item} className="mt-6 max-w-xl text-base leading-relaxed text-primary-foreground/80 sm:text-lg">
            Providing professional land surveying, engineering surveying, GIS mapping, geospatial analysis, property mapping, construction layout and modern surveying solutions across Nigeria.
          </motion.p>
          <motion.div variants={item} className="mt-9 flex flex-wrap gap-4">
            <a href="#contact" className="group inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-primary shadow-lg shadow-gold/20 transition-transform hover:scale-105">
              Get Free Consultation
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a href="#contact" className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-7 py-3.5 text-sm font-semibold text-primary-foreground backdrop-blur transition-colors hover:border-gold/60 hover:text-gold">
              <Phone className="h-4 w-4" /> Contact Us
            </a>
          </motion.div>
        </motion.div>

        <motion.div variants={item} initial="hidden" animate="show" className="hidden lg:block">
          <div className="glass-dark relative rounded-3xl p-6">
            <div className="grid grid-cols-2 gap-4">
              {[
                { k: "Coordinates", v: "6.6194 N, 3.3211 E" },
                { k: "Accuracy", v: "± 2mm precision" },
                { k: "Instruments", v: "Leica / Trimble" },
                { k: "Coverage", v: "Nationwide" },
              ].map((s) => (
                <div key={s.k} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-[11px] uppercase tracking-widest text-gold/80">{s.k}</p>
                  <p className="mt-1 font-display text-lg font-semibold">{s.v}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <span className="text-sm text-primary-foreground/70">Live GPS Signal</span>
              <span className="flex items-center gap-1.5 text-sm font-semibold text-survey">
                <span className="h-2 w-2 animate-pulse rounded-full bg-survey" /> Locked
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
        <div className="flex h-9 w-5 items-start justify-center rounded-full border-2 border-white/30 p-1">
          <span className="h-2 w-1 animate-bounce rounded-full bg-gold" />
        </div>
      </div>
    </section>
  );
}
