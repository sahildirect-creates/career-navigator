const STEPS = [
  {
    n: "01",
    title: "Sign in with Google",
    body: "One click. No forms, no card.",
    icon: <GoogleMark />,
  },
  {
    n: "02",
    title: "Pick your starting point",
    body: "Describe what you love (Ikigai) or enter a job title (Title).",
    icon: <CompassIcon />,
  },
  {
    n: "03",
    title: "Get your roadmap",
    body: "Ten ordered steps with a free learning resource for each.",
    icon: <BookIcon />,
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="mx-auto max-w-7xl px-6 md:px-14 py-20 md:py-28"
    >
      <div className="mb-14 md:mb-16">
        <div className="uppercase text-xs tracking-[0.18em] text-gold/80 font-body mb-4">
          How it works
        </div>
        <h2 className="font-heading text-4xl md:text-5xl text-foreground leading-tight max-w-2xl">
          From sign-in to roadmap, in three.
        </h2>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-0">
        {/* Dashed connector line on desktop */}
        <div
          aria-hidden
          className="hidden md:block absolute top-[18px] left-[16%] right-[16%] border-t border-dashed border-white/10"
        />
        {STEPS.map((s) => (
          <div key={s.n} className="relative md:pr-8 bg-background">
            <div className="flex items-center justify-center mb-4 rounded-full w-9 h-9 border border-gold text-gold font-body text-[13px]">
              {s.n}
            </div>
            <div className="flex items-center gap-2.5 mb-2.5">
              {s.icon}
              <h3 className="font-heading font-medium text-xl text-foreground leading-tight">
                {s.title}
              </h3>
            </div>
            <p className="font-body text-foreground/55 text-sm md:text-[15px] leading-relaxed max-w-[260px]">
              {s.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function GoogleMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" className="shrink-0" aria-hidden>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold shrink-0" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold shrink-0" aria-hidden>
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5A2.5 2.5 0 0 0 4 22.5V4.5z" />
      <path d="M4 4.5A2.5 2.5 0 0 0 6.5 7H20" />
    </svg>
  );
}
