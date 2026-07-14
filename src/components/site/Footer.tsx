import { Compass, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { NAV_LINKS, SERVICES, CONTACT } from "@/lib/site-data";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-4 lg:px-8">
        <div>
          <a href="#home" className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-gold to-[oklch(0.62_0.12_80)] text-primary"><Compass className="h-5 w-5" /></span>
            <span className="font-display text-lg font-bold">ASTAD <span className="text-gradient-gold">Survey</span></span>
          </a>
          <p className="mt-4 text-sm leading-relaxed text-primary-foreground/70">
            Precision surveying, GIS mapping and geospatial solutions trusted across Nigeria.
          </p>
          <div className="mt-5 flex gap-3">
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
              <a key={i} href="#" aria-label="Social link" className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-primary-foreground/80 transition-colors hover:border-gold hover:text-gold">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-gold">Quick Links</h4>
          <ul className="mt-4 space-y-2">
            {NAV_LINKS.slice(0, 6).map((l) => (
              <li key={l.href}><a href={l.href} className="text-sm text-primary-foreground/70 transition-colors hover:text-gold">{l.label}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-gold">Services</h4>
          <ul className="mt-4 space-y-2">
            {SERVICES.slice(0, 6).map((s) => (
              <li key={s.title}><a href="#services" className="text-sm text-primary-foreground/70 transition-colors hover:text-gold">{s.title}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-gold">Business Hours</h4>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/70">
            <li>Mon – Fri: 8:00am – 6:00pm</li>
            <li>Saturday: 9:00am – 4:00pm</li>
            <li>Sunday: Closed</li>
          </ul>
          <h4 className="mt-6 font-display text-sm font-semibold uppercase tracking-wider text-gold">Contact</h4>
          <ul className="mt-3 space-y-1 text-sm text-primary-foreground/70">
            {CONTACT.locations.map((l) => <li key={l}>{l}</li>)}
            <li><a href={`tel:${CONTACT.phone}`} className="hover:text-gold">{CONTACT.phone}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-5 py-6 text-center text-xs text-primary-foreground/70 lg:px-8">
          © {new Date().getFullYear()} ASTAD Survey & Consultants. Delivering Accurate Geospatial Solutions.
        </p>
      </div>
    </footer>
  );
}
