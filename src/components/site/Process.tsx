import { motion } from "motion/react";
import { PROCESS } from "@/lib/site-data";
import { SectionHeading } from "./primitives";

export function Process() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Survey Process"
          title={<>From consultation to <span className="text-gradient-gold">delivery</span></>}
          subtitle="A proven eight-step workflow that guarantees precision, quality and on-time delivery."
        />
        <div className="relative mt-16">
          <div className="absolute left-6 top-0 h-full w-px bg-gradient-to-b from-gold via-royal/40 to-transparent md:left-1/2" />
          <div className="space-y-8">
            {PROCESS.map((p, i) => (
              <motion.div
                key={p.step}
                initial={{ opacity: 0, x: i % 2 ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-70px" }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className={`relative flex items-center gap-6 md:w-1/2 ${i % 2 ? "md:ml-auto md:flex-row" : "md:flex-row-reverse md:text-right"}`}
              >
                <span className="absolute left-6 z-10 grid h-12 w-12 -translate-x-1/2 place-items-center rounded-full border-4 border-background bg-gradient-to-br from-gold to-[oklch(0.62_0.12_80)] font-display text-sm font-bold text-primary-foreground md:left-0 md:right-0 md:mx-auto"
                  style={{ [i % 2 ? "left" : "right"]: "auto" }}>
                  {p.step}
                </span>
                <div className="glass ml-16 flex-1 rounded-2xl p-5 md:ml-0 md:mx-8">
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
