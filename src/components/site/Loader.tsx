import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

export function Loader() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col items-center gap-6">
            <div className="relative h-20 w-20">
              <motion.span
                className="absolute inset-0 rounded-full border-2 border-gold/30 border-t-gold"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              />
              <span className="absolute inset-3 rounded-full border border-royal/40" />
              <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold" />
            </div>
            <div className="text-center">
              <p className="font-display text-xl font-bold tracking-tight">
                ASTAD <span className="text-gradient-gold">Survey</span>
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Calibrating precision
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
