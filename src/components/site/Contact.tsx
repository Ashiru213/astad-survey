import { Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { useState } from "react";
import { CONTACT } from "@/lib/site-data";
import { Reveal, SectionHeading } from "./primitives";

export function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <section id="contact" className="relative py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Contact Us"
          title={<>Let's map your <span className="text-gradient-gold">next project</span></>}
          subtitle="Reach out for a free consultation. Our team responds fast and works nationwide."
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <Reveal center={false}>
            <div className="glass flex h-full flex-col gap-5 rounded-3xl p-8">
              <div>
                <h3 className="font-display text-2xl font-bold">{CONTACT.name}</h3>
                <p className="text-sm text-muted-foreground">Surveying & Geoinformatics</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold/15 text-gold"><MapPin className="h-5 w-5" /></span>
                  <div>
                    <p className="text-sm font-semibold">Locations</p>
                    {CONTACT.locations.map((l) => (
                      <p key={l} className="text-sm text-muted-foreground">{l}</p>
                    ))}
                  </div>
                </div>
                <a href={`tel:${CONTACT.phone}`} className="flex items-start gap-4 transition-colors hover:text-gold">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold/15 text-gold"><Phone className="h-5 w-5" /></span>
                  <div>
                    <p className="text-sm font-semibold">Phone</p>
                    <p className="text-sm text-muted-foreground">{CONTACT.phone}</p>
                  </div>
                </a>
                <a href={`mailto:${CONTACT.email}`} className="flex items-start gap-4 transition-colors hover:text-gold">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold/15 text-gold"><Mail className="h-5 w-5" /></span>
                  <div>
                    <p className="text-sm font-semibold">Email</p>
                    <p className="text-sm text-muted-foreground">{CONTACT.email}</p>
                  </div>
                </a>
              </div>
              <div className="mt-2 flex flex-wrap gap-3">
                <a href={`https://wa.me/${CONTACT.phoneIntl}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105">
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
                <a href={`tel:${CONTACT.phone}`} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105">
                  <Phone className="h-4 w-4" /> Call Now
                </a>
              </div>
              <div className="mt-2 overflow-hidden rounded-2xl border border-border/60">
                <div className="relative flex aspect-[16/9] items-center justify-center bg-secondary">
                  <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(to right, oklch(0.78 0.13 85 / 0.3) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.78 0.13 85 / 0.3) 1px, transparent 1px)", backgroundSize: "26px 26px" }} />
                  <div className="relative text-center">
                    <MapPin className="mx-auto h-8 w-8 text-gold" />
                    <p className="mt-1 text-sm font-medium">Oshodi Berger, Lagos</p>
                    <p className="text-xs text-muted-foreground">Google Map integration</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} center={false}>
            <form
              onSubmit={(e) => { e.preventDefault(); setSent(true); }}
              className="glass flex h-full flex-col gap-4 rounded-3xl p-8"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full Name" name="name" placeholder="John Doe" />
                <Field label="Phone" name="phone" placeholder="0700 000 0000" />
              </div>
              <Field label="Email" name="email" type="email" placeholder="you@email.com" />
              <div>
                <label className="mb-1.5 block text-sm font-medium" htmlFor="service">Service Needed</label>
                <select id="service" name="service" className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-gold">
                  <option>Land Survey</option>
                  <option>Engineering Survey</option>
                  <option>GIS Mapping</option>
                  <option>Drone Survey</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium" htmlFor="message">Message</label>
                <textarea id="message" name="message" rows={4} placeholder="Tell us about your project..." className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-gold" />
              </div>
              <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-primary shadow-lg shadow-gold/20 transition-transform hover:scale-[1.02]">
                <Send className="h-4 w-4" /> {sent ? "Message Sent!" : "Send Message"}
              </button>
              {sent && <p className="text-center text-sm text-gold">Thank you! We'll be in touch shortly.</p>}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({ label, name, type = "text", placeholder }: { label: string; name: string; type?: string; placeholder?: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium" htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} placeholder={placeholder} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-gold" />
    </div>
  );
}
