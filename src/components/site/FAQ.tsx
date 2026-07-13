import { Minus, Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { FAQS } from "@/lib/site-data";
import { Reveal, SectionHeading } from "./primitives";

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative py-24">
      <div className="mx-auto max-w-3xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="FAQ"
          title={<>Frequently asked <span className="text-gradient-gold">questions</span></>}
          subtitle="Everything you need to know about working with ASTAD Survey."
        />
        <div className="mt-12 space-y-3">
          {FAQS.map((f, i) => {
            const active = open === i;
            return (
              <Reveal key={f.q} delay={i * 0.05} center={false}>
                <div className={`overflow-hidden rounded-2xl border transition-colors ${active ? "border-gold/50 bg-card" : "border-border/60 bg-card/60"}`}>
                  <button
                    onClick={() => setOpen(active ? null : i)}
                    aria-expanded={active}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left"
                  >
                    <span className="font-display text-base font-semibold">{f.q}</span>
                    <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition-colors ${active ? "bg-gold text-primary" : "bg-secondary text-foreground"}`}>
                      {active ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {active && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
