import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import galleryGis from "@/assets/gallery-gis.jpg";
import galleryLand from "@/assets/gallery-land.jpg";
import bigbro from "@/assets/bigbro.jpg.asset.json";
import yiii from "@/assets/yiii.jpg.asset.json";
import hi from "@/assets/hi.jpg.asset.json";
import blood from "@/assets/blood.jpg.asset.json";
import { SectionHeading } from "./primitives";

type GalleryItem = { img: string; title: string; desc: string };

const DEFAULT_ITEMS: GalleryItem[] = [
  { img: galleryLand, title: "Land Mapping", desc: "Cadastral parcel measurement and boundary demarcation." },
  { img: bigbro.url, title: "Road Survey", desc: "Corridor alignment and route mapping for highway design." },
  { img: galleryGis, title: "GIS Mapping", desc: "Spatial data layers powering informed decisions." },
  { img: yiii.url, title: "Construction Survey", desc: "Precision setting-out for civil and structural works." },
  { img: hi.url, title: "Boundary Survey", desc: "Certified property boundary verification." },
  { img: blood.url, title: "Drone Survey", desc: "UAV aerial capture, orthophotos and 3D point clouds." },
];

export function Gallery() {
  const [active, setActive] = useState<number | null>(null);
  const uploadsQ = useQuery({
    queryKey: ["gallery-public"],
    queryFn: async (): Promise<GalleryItem[]> => {
      const { data, error } = await supabase
        .from("gallery_images")
        .select("id, title, description, storage_path")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) return [];
      const rows = await Promise.all(
        (data ?? []).map(async (r) => {
          const { data: signed } = await supabase.storage
            .from("gallery")
            .createSignedUrl(r.storage_path, 60 * 60);
          return signed?.signedUrl
            ? { img: signed.signedUrl, title: r.title, desc: r.description ?? "" }
            : null;
        }),
      );
      return rows.filter((r): r is GalleryItem => !!r);
    },
    staleTime: 60_000,
  });
  const ITEMS: GalleryItem[] = [...(uploadsQ.data ?? []), ...DEFAULT_ITEMS];

  const close = useCallback(() => setActive(null), []);
  const next = useCallback(() => setActive((i) => (i === null ? i : (i + 1) % ITEMS.length)), []);
  const prev = useCallback(() => setActive((i) => (i === null ? i : (i - 1 + ITEMS.length) % ITEMS.length)), []);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active, close, next, prev]);

  return (
    <section id="gallery" className="relative py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Project Gallery"
          title={<>Field work in <span className="text-gradient-gold">focus</span></>}
          subtitle="A glimpse into the diverse surveying and mapping projects we deliver across Nigeria."
        />
        <div className="mt-14 grid auto-rows-[280px] grid-cols-1 gap-4 sm:auto-rows-[220px] sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {ITEMS.map((it, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              onClick={() => setActive(i)}
              className="group relative cursor-zoom-in overflow-hidden rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setActive(i)}
              role="button"
              aria-label={`View ${it.title}`}
            >
              <img
                src={it.img}
                alt={`${it.title} — ${it.desc}`}
                loading={i < 2 ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={i < 2 ? "high" : "low"}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <figcaption className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-primary/90 via-primary/40 to-transparent p-4 opacity-100 transition-opacity duration-300 sm:from-primary/85 sm:via-primary/20 sm:opacity-0 sm:group-hover:opacity-100">
                <ZoomIn className="mb-2 h-5 w-5 text-gold sm:h-6 sm:w-6" />
                <span className="font-display text-sm font-semibold text-primary-foreground sm:text-lg">{it.title}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={ITEMS[active].title}
          >
            <button
              onClick={(e) => { e.stopPropagation(); close(); }}
              aria-label="Close"
              className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-6 sm:h-14 sm:w-14"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Next image"
              className="absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-6 sm:h-14 sm:w-14"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            <motion.figure
              key={active}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="relative max-h-[85vh] w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={ITEMS[active].img}
                alt={`${ITEMS[active].title} — ${ITEMS[active].desc}`}
                className="mx-auto max-h-[75vh] w-auto rounded-2xl object-contain shadow-2xl"
              />
              <figcaption className="mt-4 text-center">
                <p className="font-display text-lg font-semibold text-gold sm:text-xl">{ITEMS[active].title}</p>
                <p className="mt-1 text-sm text-white/80">{ITEMS[active].desc}</p>
                <p className="mt-2 text-xs text-white/50">{active + 1} / {ITEMS.length}</p>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
