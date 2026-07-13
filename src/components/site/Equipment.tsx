import { motion } from "motion/react";
import equipDrone from "@/assets/equip-drone.jpg";
import equipGnss from "@/assets/equip-gnss.jpg";
import equipTotalStation from "@/assets/equip-total-station.jpg";
import { SectionHeading } from "./primitives";

const EQUIPMENT = [
  { name: "Leica Robotic Total Station", img: equipTotalStation, tag: "Robotic" },
  { name: "Trimble GNSS Receiver", img: equipGnss, tag: "GNSS RTK" },
  { name: "Survey Drone / UAV", img: equipDrone, tag: "Aerial" },
  { name: "Topcon Total Station", img: equipTotalStation, tag: "Optical" },
  { name: "RTK GPS Receiver", img: equipGnss, tag: "GPS" },
  { name: "Digital & Auto Level", img: equipTotalStation, tag: "Levelling" },
  { name: "Field Controller", img: equipGnss, tag: "Data" },
  { name: "Laser Distance Meter", img: equipDrone, tag: "Laser" },
];

export function Equipment() {
  return (
    <section id="equipment" className="relative py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Our Equipment"
          title={<>Industry-leading <span className="text-gradient-gold">survey instruments</span></>}
          subtitle="We invest in the world's most trusted precision hardware to guarantee accuracy on every project."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {EQUIPMENT.map((e, i) => (
            <motion.div
              key={e.name}
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.07 }}
              className="group overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-gold/10"
            >
              <div className="relative aspect-square overflow-hidden bg-primary">
                <img src={e.img} alt={e.name} width={800} height={800} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <span className="absolute left-3 top-3 rounded-full bg-gold px-3 py-1 text-[11px] font-semibold text-primary">{e.tag}</span>
                <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <div className="p-4">
                <h3 className="font-display text-sm font-semibold leading-snug">{e.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
