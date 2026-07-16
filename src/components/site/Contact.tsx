import { Mail, MapPin, MessageCircle, Phone, Send, Sparkles } from "lucide-react";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CONTACT } from "@/lib/site-data";
import { submitContact } from "@/lib/contact.functions";
import { Reveal, SectionHeading } from "./primitives";
import { toast } from "sonner";

export function Contact() {
  const submit = useServerFn(submitContact);
  const [sending, setSending] = useState(false);
  const [reply, setReply] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", service: "Land Survey", message: "" });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    try {
      const res = await submit({ data: form });
      setReply(res.reply);
      setForm({ name: "", phone: "", email: "", service: "Land Survey", message: "" });
      toast.success("Message sent");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send message");
    } finally {
      setSending(false);
    }
  }
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
                    <p className="mt-1 text-sm font-medium">Ojodu Berger, Lagos</p>
                    <p className="text-xs text-muted-foreground">Google Map integration</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} center={false}>
            <form onSubmit={onSubmit} className="glass flex h-full flex-col gap-4 rounded-3xl p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full Name" name="name" placeholder="John Doe" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} required />
                <Field label="Phone" name="phone" placeholder="0700 000 0000" value={form.phone} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} />
              </div>
              <Field label="Email" name="email" type="email" placeholder="you@email.com" value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} required />
              <div>
                <label className="mb-1.5 block text-sm font-medium" htmlFor="service">Service Needed</label>
                <select id="service" name="service" value={form.service} onChange={(e) => setForm((f) => ({ ...f, service: e.target.value }))}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-gold">
                  <option>Land Survey</option>
                  <option>Engineering Survey</option>
                  <option>GIS Mapping</option>
                  <option>Drone Survey</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium" htmlFor="message">Message</label>
                <textarea id="message" name="message" rows={4} required value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="Tell us about your project..."
                  className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-gold" />
              </div>
              <button type="submit" disabled={sending}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-primary shadow-lg shadow-gold/20 transition-transform hover:scale-[1.02] disabled:opacity-60">
                <Send className="h-4 w-4" /> {sending ? "Sending…" : "Send Message"}
              </button>
              {reply && (
                <div className="rounded-2xl border border-gold/30 bg-gold/5 p-4">
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase text-gold">
                    <Sparkles className="h-3.5 w-3.5" /> AI reply from ASTAD
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm">{reply}</p>
                </div>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({ label, name, type = "text", placeholder, value, onChange, required }: {
  label: string; name: string; type?: string; placeholder?: string;
  value: string; onChange: (v: string) => void; required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium" htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} placeholder={placeholder} value={value} required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-gold" />
    </div>
  );
}
