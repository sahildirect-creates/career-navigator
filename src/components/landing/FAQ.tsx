"use client";

import { useState } from "react";
import { FAQ_ITEMS } from "./faq-data";

export default function FAQ() {
  const [open, setOpen] = useState<number>(0);

  return (
    <section id="faq" className="mx-auto max-w-7xl px-6 md:px-14 py-20 md:py-28">
      <div className="grid gap-10 md:gap-20 grid-cols-1 md:grid-cols-[0.8fr_1.2fr]">
        <div>
          <div className="uppercase text-xs tracking-[0.18em] text-gold/80 font-body mb-4">
            Questions
          </div>
          <h2 className="font-heading text-4xl md:text-5xl text-foreground leading-tight">
            Things students<br />ask us.
          </h2>
          <p className="font-body text-foreground/50 mt-5 text-sm md:text-base">
            Still curious? Sign in and try it — it takes about a minute.
          </p>
        </div>

        <div>
          {FAQ_ITEMS.map((it, i) => {
            const isOpen = open === i;
            return (
              <button
                type="button"
                key={i}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className={`w-full text-left cursor-pointer ${i === 0 ? "border-t" : ""} border-b border-white/5 py-5 md:py-6`}
                aria-expanded={isOpen}
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="font-heading text-lg md:text-xl text-foreground leading-snug">
                    {it.q}
                  </div>
                  <div
                    className="shrink-0 text-gold font-heading text-2xl leading-none transition-transform duration-200"
                    style={{ transform: isOpen ? "rotate(45deg)" : "none" }}
                    aria-hidden
                  >
                    +
                  </div>
                </div>
                <div
                  className="overflow-hidden font-body text-foreground/55 text-sm md:text-[15px] leading-relaxed"
                  style={{
                    maxHeight: isOpen ? 220 : 0,
                    paddingTop: isOpen ? 14 : 0,
                    paddingRight: 60,
                    transition: "max-height 280ms ease, padding 280ms ease",
                  }}
                >
                  {it.a}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
