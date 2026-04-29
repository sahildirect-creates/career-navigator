import RoadmapPreview from "@/components/RoadmapPreview";
import GoogleSignInButton from "./GoogleSignInButton";
import type { ShowcaseNavigator } from "@/lib/showcase";

export default function Hero({ preview }: { preview: ShowcaseNavigator }) {
  return (
    <section className="relative overflow-hidden">
      {/* Soft purple glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-[10%] w-[700px] h-[500px] -translate-x-1/2 blur-3xl z-0"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(124,58,237,0.18) 0%, rgba(124,58,237,0.05) 45%, transparent 75%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-6 md:px-14 pt-12 md:pt-20 pb-14 md:pb-24 relative z-10">
        <div className="grid gap-12 md:gap-16 grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] items-start">
          {/* LEFT */}
          <div>
            <div className="uppercase text-[11px] tracking-[0.18em] text-foreground/40 font-body mb-6">
              By Novare Talent · Career Navigator
            </div>

            <h1 className="font-heading text-foreground leading-[1.05] tracking-tight m-0 text-5xl md:text-6xl lg:text-7xl">
              Your career.
              <br />
              <span className="italic text-gold">Navigated with intention.</span>
            </h1>

            <p className="font-body text-foreground/55 text-base md:text-lg mt-6 max-w-xl leading-relaxed">
              A personalized 10-step career roadmap with free learning resources for every step.
              Describe what you love, or pick a job title — we&apos;ll map the rest.
            </p>

            <div className="uppercase text-[11px] tracking-[0.18em] text-foreground/40 font-body mt-10 mb-3">
              Two ways to start
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ModeInfoCard
                title="Ikigai Mode"
                body="Tell us what you love — get five role suggestions."
                icon={<HeartIcon />}
              />
              <ModeInfoCard
                title="Title Mode"
                body="Already know the role? Enter it directly."
                icon={<BriefcaseIcon />}
              />
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-5">
              <GoogleSignInButton />
              <span className="text-xs md:text-sm text-foreground/35 font-body">
                Free · No card · ~60s to your roadmap
              </span>
            </div>
          </div>

          {/* RIGHT — preview card */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.015] p-5 md:p-6">
            <div className="flex items-center justify-between mb-3.5">
              <div className="uppercase text-[11px] tracking-[0.18em] text-gold font-body">
                Real navigator · preview
              </div>
              <div className="uppercase rounded-full px-2.5 py-1 text-[10px] tracking-[0.16em] font-body text-foreground/50 border border-white/5">
                10 Steps
              </div>
            </div>

            <RoadmapPreview
              nodes={preview.roadmap_json.nodes}
              edges={preview.roadmap_json.edges}
              height={380}
            />

            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="uppercase text-[10px] tracking-[0.18em] text-gold font-body">
                Free Resource · {preview.role_title}
              </div>
              <div className="font-body text-foreground font-medium text-sm mt-2">
                {preview.resources_json[0]?.title || "Curated free learning material"}
              </div>
              <div className="text-xs text-foreground/40 font-body mt-1">
                {preview.resources_json[0]?.platform || "Free"} ·
                {" "}
                {preview.resources_json[0]?.free === false ? "Paid" : "Free"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ModeInfoCard({
  title,
  body,
  icon,
}: {
  title: string;
  body: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 p-5 md:p-6 rounded-2xl border border-white/10 bg-white/[0.015]">
      <div className="flex items-center gap-2.5 text-foreground/80">
        {icon}
        <span className="font-heading text-lg text-foreground">{title}</span>
      </div>
      <div className="text-[13px] text-foreground/50 font-body leading-relaxed">{body}</div>
    </div>
  );
}

function HeartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold shrink-0">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold shrink-0">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}
