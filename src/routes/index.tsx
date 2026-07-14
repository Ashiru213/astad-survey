import { createFileRoute } from "@tanstack/react-router";
import { About } from "@/components/site/About";
import { Contact } from "@/components/site/Contact";
import { Equipment } from "@/components/site/Equipment";
import { FAQ } from "@/components/site/FAQ";
import { FloatingButtons } from "@/components/site/FloatingButtons";
import { Footer } from "@/components/site/Footer";
import { Gallery } from "@/components/site/Gallery";
import { Hero } from "@/components/site/Hero";
import { Loader } from "@/components/site/Loader";
import { MapSection } from "@/components/site/MapSection";
import { Navbar } from "@/components/site/Navbar";
import { Process } from "@/components/site/Process";
import { Services } from "@/components/site/Services";
import { Testimonials } from "@/components/site/Testimonials";
import { WhyChoose } from "@/components/site/WhyChoose";

export const Route = createFileRoute("/")({
  head: () => ({
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "ASTAD Survey",
          description:
            "Professional land surveying, engineering surveying, GIS mapping and geospatial solutions across Nigeria.",
          telephone: "+2347069320057",
          areaServed: "Nigeria",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Ojodu Berger",
            addressLocality: "Lagos",
            addressCountry: "NG",
          },
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="overflow-x-hidden">
      <Loader />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Equipment />
        <MapSection />
        <Gallery />
        <WhyChoose />
        <Process />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
}
