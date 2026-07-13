import { motion } from "motion/react";
import { PROCESS } from "@/lib/site-data";
import { SectionHeading } from "./primitives";

export function Process() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-3xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Survey Process"
          title={<>From consultation to <span className="text-gradient-gold">delivery</span></>}
          subtitle="A proven eight-step workflow that guarantees precision, quality and on-time delivery."
        />
        <div className="relative mt-16 pl-16">
          <div className="absolute left-6 top-2 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-gold via-royal/40 to-transparent" />
          <div className="space-y-6">
            {PROCESS.map((p, i) => (
              <motion.div
                key={p.step}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-70px" }}
                transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] as const }}
                className="relative"
              >
                <span className="absolute -left-16 top-1 grid h-12 w-12 place-items-center rounded-full border-4 border-background bg-gradient-to-br from-gold to-[oklch(0.62_0.12_80)] font-display text-sm font-bold text-primary-foreground shadow-md">
                  {p.step}
                </span>
                <div className="glass rounded-2xl p-5 transition-transform duration-300 hover:translate-x-1.5">
                  <h3 className="font-display text-lg font-semibold">{p.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
