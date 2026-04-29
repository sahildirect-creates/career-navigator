import GoogleSignInButton from "./GoogleSignInButton";

export default function ClosingCTA() {
  return (
    <section className="relative text-center py-20 md:py-28 overflow-hidden">
      {/* Soft purple/gold-equivalent glow (gold token = purple #7C3AED) */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] blur-3xl"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(124,58,237,0.18) 0%, rgba(124,58,237,0.06) 45%, transparent 78%)",
        }}
      />
      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-14">
        <h2 className="font-heading text-foreground leading-[1.05] tracking-tight m-0 text-4xl md:text-5xl lg:text-6xl">
          Map it in a minute.
        </h2>
        <p className="font-body text-foreground/55 mt-5 mb-8 text-base md:text-lg">
          Free, personalized, and yours to keep.
        </p>
        <GoogleSignInButton />
      </div>
    </section>
  );
}
