import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { TESTIMONIALS } from "@/lib/site-data";
import { SectionHeading } from "./primitives";

export function Testimonials() {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);

  const go = useCallback((d: number) => {
    setDir(d);
    setI((p) => (p + d + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, []);

  useEffect(() => {
    const t = setInterval(() => go(1), 6000);
    return () => clearInterval(t);
  }, [go]);

  const t = TESTIMONIALS[i];

  return (
    <section id="testimonials" className="relative overflow-hidden bg-secondary/40 py-24">
      <div className="mx-auto max-w-4xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Testimonials"
          title={<>What our <span className="text-gradient-gold">clients say</span></>}
        />
        <div className="relative mt-14 min-h-[320px]">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.blockquote
              key={i}
              custom={dir}
              initial={{ opacity: 0, x: dir * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -60 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
              className="glass rounded-3xl p-8 text-center sm:p-12"
            >
              <Quote className="mx-auto h-10 w-10 text-gold/40" />
              <div className="mt-4 flex justify-center gap-1">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="h-5 w-5 fill-gold text-gold" />
                ))}
              </div>
              <p className="mt-6 font-display text-xl leading-relaxed sm:text-2xl">"{t.quote}"</p>
              <footer className="mt-6">
                <p className="font-semibold text-gold">{t.name}</p>
                <p className="text-sm text-muted-foreground">{t.role}</p>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>
        <div className="mt-8 flex items-center justify-center gap-4">
          <button onClick={() => go(-1)} aria-label="Previous testimonial" className="grid h-11 w-11 place-items-center rounded-full border border-border bg-card transition-colors hover:border-gold hover:text-gold">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex gap-2">
            {TESTIMONIALS.map((_, d) => (
              <button
                key={d}
                aria-label={`Go to testimonial ${d + 1}`}
                onClick={() => { setDir(d > i ? 1 : -1); setI(d); }}
                className={`h-2 rounded-full transition-all ${d === i ? "w-6 bg-gold" : "w-2 bg-border"}`}
              />
            ))}
          </div>
          <button onClick={() => go(1)} aria-label="Next testimonial" className="grid h-11 w-11 place-items-center rounded-full border border-border bg-card transition-colors hover:border-gold hover:text-gold">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
