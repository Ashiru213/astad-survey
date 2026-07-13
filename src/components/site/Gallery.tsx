import { ZoomIn } from "lucide-react";
import { motion } from "motion/react";
import galleryConstruction from "@/assets/gallery-construction.jpg";
import galleryGis from "@/assets/gallery-gis.jpg";
import galleryLand from "@/assets/gallery-land.jpg";
import galleryRoad from "@/assets/gallery-road.jpg";
import { SectionHeading } from "./primitives";

const ITEMS = [
  { img: galleryLand, title: "Land Mapping", span: "row-span-2" },
  { img: galleryRoad, title: "Road Survey", span: "" },
  { img: galleryGis, title: "GIS Mapping", span: "row-span-2" },
  { img: galleryConstruction, title: "Construction Survey", span: "" },
  { img: galleryRoad, title: "Boundary Survey", span: "" },
  { img: galleryLand, title: "Drone Survey", span: "" },
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
        <div className="mt-14 grid auto-rows-[220px] grid-cols-2 gap-4 lg:grid-cols-3">
          {ITEMS.map((it, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className={`group relative overflow-hidden rounded-2xl ${it.span}`}
            >
              <img src={it.img} alt={it.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <figcaption className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-primary/85 via-primary/20 to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <ZoomIn className="mb-2 h-6 w-6 text-gold" />
                <span className="font-display text-lg font-semibold text-primary-foreground">{it.title}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
