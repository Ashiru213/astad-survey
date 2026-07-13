import { motion } from "motion/react";
import { WHY } from "@/lib/site-data";
import { ICONS } from "./icon-map";
import { SectionHeading } from "./primitives";

export function WhyChoose() {
  return (
    <section id="why" className="relative overflow-hidden bg-secondary/40 py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Why Choose Us"
          title={<>The <span className="text-gradient-gold">ASTAD advantage</span></>}
          subtitle="Reasons clients across Nigeria trust us with their most critical surveying projects."
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WHY.map((w, i) => {
            const Icon = ICONS[w.icon] ?? ICONS.Target;
            return (
              <motion.div
                key={w.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
                className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-gold/10"
              >
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-gold to-[oklch(0.62_0.12_80)] text-primary-foreground shadow-md transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-7 w-7" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{w.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
