"use client";

import { useState } from "react";
import RoadmapPreview from "@/components/RoadmapPreview";
import ResourceCard from "@/components/ResourceCard";
import type { ShowcaseNavigator } from "@/lib/showcase";

export default function ExamplesCarousel({
  showcases,
}: {
  showcases: ShowcaseNavigator[];
}) {
  const [active, setActive] = useState(0);
  const count = showcases.length;
  const prev = () => setActive((active - 1 + count) % count);
  const next = () => setActive((active + 1) % count);

  return (
    <section
      id="examples"
      className="mx-auto max-w-7xl px-6 md:px-14 py-20 md:py-28"
    >
      <div className="flex flex-wrap items-end justify-between gap-6 mb-10 md:mb-14">
        <div>
          <div className="uppercase text-xs tracking-[0.18em] text-gold/80 font-body mb-4">
            Pinned examples
          </div>
          <h2 className="font-heading text-4xl md:text-5xl text-foreground leading-tight">
            Read a real navigator.
          </h2>
          <p className="font-body text-foreground/50 mt-4 max-w-xl text-sm md:text-base leading-relaxed">
            Career Navigator is a free career planning tool for students and
            early-career explorers. Flip through three real roadmaps to see what
            yours could look like.
          </p>
        </div>
        <div className="hidden md:flex gap-2">
          <CarouselBtn onClick={prev} ariaLabel="Previous example">
            <ChevronLeft />
          </CarouselBtn>
          <CarouselBtn onClick={next} primary ariaLabel="Next example">
            <ChevronRight />
          </CarouselBtn>
        </div>
      </div>

      {/* Mobile: single in-flow card */}
      <div className="md:hidden">
        <ExampleCard show={showcases[active]} index={active} count={count} />
      </div>

      {/* Desktop: stacked deck */}
      <div className="relative hidden md:block min-h-[520px]">
        {showcases.map((s, i) => {
          const offset = i - active;
          const isActive = offset === 0;
          const visible = Math.abs(offset) <= 1;
          return (
            <div
              key={i}
              onClick={() => !isActive && setActive(i)}
              className={`absolute inset-0 ${isActive ? "" : "cursor-pointer"}`}
              style={{
                transform: `translateX(${offset * 32}px) scale(${1 - Math.abs(offset) * 0.04})`,
                opacity: visible ? (isActive ? 1 : 0.45) : 0,
                zIndex: 10 - Math.abs(offset),
                transition: "all 320ms cubic-bezier(0.2,0.8,0.2,1)",
                pointerEvents: visible ? "auto" : "none",
              }}
            >
              <ExampleCard show={s} index={i} count={count} active={isActive} />
            </div>
          );
        })}
      </div>

      <div className="mt-6 md:mt-10 flex justify-center gap-2.5">
        {showcases.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Show example ${i + 1}`}
            className="rounded-full border-0 transition-all duration-200"
            style={{
              width: i === active ? 28 : 8,
              height: 8,
              background: i === active ? "#7C3AED" : "rgba(255,255,255,0.14)",
              cursor: "pointer",
            }}
          />
        ))}
      </div>
    </section>
  );
}

function ExampleCard({
  show,
  index,
  count,
  active = true,
}: {
  show: ShowcaseNavigator;
  index: number;
  count: number;
  active?: boolean;
}) {
  const featured = show.resources_json.slice(0, 3);
  const fullExampleHref = show.public_slug
    ? `/share/${show.public_slug}`
    : null;

  return (
    <div
      className={`rounded-2xl p-5 md:p-6 bg-card border ${active ? "border-gold/40" : "border-white/5"}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <div className="uppercase text-[11px] tracking-[0.18em] text-gold font-body mb-2">
            Example navigator · {String(index + 1).padStart(2, "0")}/{String(count).padStart(2, "0")}
          </div>
          <h3 className="font-heading font-medium text-2xl md:text-3xl text-foreground">
            {show.role_title}
          </h3>
          <div className="text-xs text-foreground/40 font-body mt-1.5">
            {show.roadmap_json.nodes[0]?.label} → {show.roadmap_json.nodes.at(-1)?.label}
          </div>
        </div>
        {fullExampleHref ? (
          <a
            href={fullExampleHref}
            className="inline-flex items-center gap-1.5 text-gold font-body text-sm font-medium hover:opacity-80 transition-opacity"
          >
            See full example
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-foreground/30 font-body text-sm">
            Live example coming soon
          </span>
        )}
      </div>

      <RoadmapPreview
        nodes={show.roadmap_json.nodes}
        edges={show.roadmap_json.edges}
        height={300}
      />

      <div className="mt-5 grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((r, i) => (
          <ResourceCard key={`${index}-${i}`} resource={r} index={i} />
        ))}
      </div>
    </div>
  );
}

function CarouselBtn({
  children,
  onClick,
  primary,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  primary?: boolean;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
        primary
          ? "border border-gold/60 bg-gold/5 text-gold hover:bg-gold/10"
          : "border border-white/10 text-foreground/70 hover:text-foreground hover:bg-white/5"
      }`}
    >
      {children}
    </button>
  );
}

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
