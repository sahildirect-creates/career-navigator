import type { Metadata } from "next";
import LandingHeader from "@/components/landing/LandingHeader";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import ExamplesCarousel from "@/components/landing/ExamplesCarousel";
import FAQ from "@/components/landing/FAQ";
import ClosingCTA from "@/components/landing/ClosingCTA";
import Footer from "@/components/Footer";
import RedirectIfAuthed from "@/components/landing/RedirectIfAuthed";
import { getAllShowcases } from "@/lib/showcase";
import { FAQ_ITEMS } from "@/components/landing/faq-data";

export const metadata: Metadata = {
  title:
    "Career Navigator — Your free 10-step career roadmap | Novare Talent",
  description:
    "A personalized 10-step career roadmap with free learning resources for every step. Describe what you love, or pick a job title — we'll map the rest. Free, no card required.",
  openGraph: {
    title: "Career Navigator by Novare Talent",
    description:
      "Your free 10-step career roadmap with curated free learning resources.",
    type: "website",
    siteName: "Career Navigator by Novare Talent",
  },
  twitter: {
    card: "summary_large_image",
    title: "Career Navigator by Novare Talent",
    description:
      "Your free 10-step career roadmap with curated free learning resources.",
  },
};

const Rule = () => (
  <div
    aria-hidden
    className="h-px"
    style={{
      background:
        "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)",
    }}
  />
);

export default async function LandingPage() {
  const showcases = await getAllShowcases();
  const heroPreview = showcases[0];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Grain overlay */}
      <div
        aria-hidden
        className="fixed inset-0 opacity-[0.03] pointer-events-none z-[5]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      <RedirectIfAuthed />

      <div className="relative z-10 flex-1 flex flex-col">
        <LandingHeader />

        <main className="flex-1">
          <Hero preview={heroPreview} />
          <Rule />
          <HowItWorks />
          <Rule />
          <ExamplesCarousel showcases={showcases} />
          <Rule />
          <FAQ />
          <Rule />
          <ClosingCTA />
        </main>

        <Footer />
      </div>

      {/* FAQPage structured data */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </div>
  );
}
