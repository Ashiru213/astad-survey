import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { SERVICES } from "@/lib/site-data";
import { ICONS } from "./icon-map";
import { SectionHeading } from "./primitives";

export function Services() {
  return (
    <section id="services" className="relative overflow-hidden bg-secondary/40 py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Our Services"
          title={<>Comprehensive <span className="text-gradient-gold">surveying solutions</span></>}
          subtitle="A full spectrum of professional surveying, mapping and geospatial services tailored to every project scale."
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s, i) => {
            const Icon = ICONS[s.icon] ?? ICONS.Map;
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
                className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-xl hover:shadow-gold/10"
              >
                <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="flex items-start justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-gold/20 to-royal/10 text-gold transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <Icon className="h-6 w-6" />
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all group-hover:text-gold group-hover:rotate-45" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-1 max-h-0 overflow-hidden text-sm leading-relaxed text-muted-foreground opacity-0 transition-all duration-500 group-hover:mt-2 group-hover:max-h-40 group-hover:opacity-100">
                  {s.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
