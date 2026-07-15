import { ZoomIn } from "lucide-react";
import { motion } from "motion/react";
import galleryGis from "@/assets/gallery-gis.jpg";
import galleryLand from "@/assets/gallery-land.jpg";
import bigbro from "@/assets/bigbro.jpg.asset.json";
import yiii from "@/assets/yiii.jpg.asset.json";
import hi from "@/assets/hi.jpg.asset.json";
import blood from "@/assets/blood.jpg.asset.json";
import { SectionHeading } from "./primitives";

const ITEMS = [
  { img: galleryLand, title: "Land Mapping", span: "sm:row-span-2" },
  { img: bigbro.url, title: "Road Survey", span: "" },
  { img: galleryGis, title: "GIS Mapping", span: "sm:row-span-2" },
  { img: yiii.url, title: "Construction Survey", span: "" },
  { img: hi.url, title: "Boundary Survey", span: "" },
  { img: blood.url, title: "Drone Survey", span: "" },
];

export function Gallery() {
  return (
    <section id="gallery" className="relative py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Project Gallery"
          title={<>Field work in <span className="text-gradient-gold">focus</span></>}
          subtitle="A glimpse into the diverse surveying and mapping projects we deliver across Nigeria."
        />
        <div className="mt-14 grid auto-rows-[180px] grid-cols-2 gap-3 sm:auto-rows-[220px] sm:gap-4 lg:grid-cols-3">
          {ITEMS.map((it, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className={`group relative overflow-hidden rounded-2xl ${it.span}`}
            >
              <img src={it.img} alt={it.title} loading={i < 2 ? "eager" : "lazy"} decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <figcaption className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-primary/90 via-primary/40 to-transparent p-4 opacity-100 transition-opacity duration-300 sm:from-primary/85 sm:via-primary/20 sm:opacity-0 sm:group-hover:opacity-100">
                <ZoomIn className="mb-2 hidden h-6 w-6 text-gold sm:block" />
                <span className="font-display text-sm font-semibold text-primary-foreground sm:text-lg">{it.title}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
