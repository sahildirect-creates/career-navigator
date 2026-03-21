"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RoleCard from "@/components/RoleCard";
import { RoleCardSkeleton } from "@/components/LoadingSkeleton";

interface Role {
  title: string;
  description: string;
  fitReason: string;
  salary: { india: string; global: string };
  growth: string;
}

type Mode = null | "ikigai" | "title";

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(null);
  const [ikigaiInput, setIkigaiInput] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const firstName = session?.user?.name?.split(" ")[0] || "there";

  async function handleIkigaiSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ikigaiInput.trim()) return;

    setLoading(true);
    setError("");
    setRoles([]);

    try {
      const res = await fetch("/api/gemini/ikigai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: ikigaiInput }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setRoles(data.roles);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleTitleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!titleInput.trim()) return;
    // Navigate directly to navigator with the title
    const params = new URLSearchParams({
      role: titleInput.trim(),
      mode: "title",
    });
    router.push(`/navigator/new?${params}`);
  }

  function handleRoleSelect(role: Role) {
    const params = new URLSearchParams({
      role: role.title,
      mode: "ikigai",
      ikigaiInput: ikigaiInput,
    });
    router.push(`/navigator/new?${params}`);
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Grain overlay */}
        <div
          className="fixed inset-0 opacity-[0.03] pointer-events-none z-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />

        <Header />

        <main className="flex-1 pt-24 pb-12 px-6 relative z-20">
          <div className="max-w-4xl mx-auto">
            {/* Greeting */}
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="font-heading text-4xl md:text-5xl text-foreground mb-3">
                Welcome, <span className="text-gold">{firstName}</span>
              </h1>
              <p className="font-body text-foreground/50 text-lg">
                Choose how you want to explore your career path
              </p>
            </div>

            {/* Mode Selection */}
            {!mode && (
              <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto animate-slide-up">
                <button
                  onClick={() => setMode("ikigai")}
                  className="group text-left bg-card border border-white/5 rounded-2xl p-8 hover:border-gold/30 hover:bg-card-hover transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                    <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h2 className="font-heading text-2xl text-foreground mb-2 group-hover:text-gold transition-colors">
                    Ikigai Mode
                  </h2>
                  <p className="font-body text-lg text-foreground/70 mb-1">
                    &ldquo;Tell us what feels like you&rdquo;
                  </p>
                  <p className="font-body text-sm text-foreground/40">
                    Describe what you love, what you&apos;re good at, or what kind of
                    life you want to build
                  </p>
                </button>

                <button
                  onClick={() => setMode("title")}
                  className="group text-left bg-card border border-white/5 rounded-2xl p-8 hover:border-gold/30 hover:bg-card-hover transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                    <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h2 className="font-heading text-2xl text-foreground mb-2 group-hover:text-gold transition-colors">
                    Title Mode
                  </h2>
                  <p className="font-body text-lg text-foreground/70 mb-1">
                    &ldquo;I know what I want&rdquo;
                  </p>
                  <p className="font-body text-sm text-foreground/40">
                    Type a job title and we&apos;ll build your path
                  </p>
                </button>
              </div>
            )}

            {/* Ikigai Mode */}
            {mode === "ikigai" && roles.length === 0 && (
              <div className="max-w-2xl mx-auto animate-slide-up">
                <button
                  onClick={() => setMode(null)}
                  className="flex items-center gap-2 text-sm font-body text-foreground/40 hover:text-foreground/70 transition-colors mb-6"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to modes
                </button>

                <form onSubmit={handleIkigaiSubmit}>
                  <textarea
                    value={ikigaiInput}
                    onChange={(e) => setIkigaiInput(e.target.value)}
                    placeholder="What feels like you? Describe your passions, strengths, or the life you want..."
                    className="w-full h-48 bg-card border border-white/10 rounded-xl p-6 text-foreground font-body text-base placeholder:text-foreground/30 focus:outline-none focus:border-gold/50 resize-none transition-colors"
                    disabled={loading}
                  />
                  {error && (
                    <p className="text-red-400 text-sm font-body mt-3">{error}</p>
                  )}
                  <button
                    type="submit"
                    disabled={loading || !ikigaiInput.trim()}
                    className="mt-4 w-full bg-gold text-background font-body font-medium py-3 rounded-xl hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Finding your paths..." : "Discover My Paths"}
                  </button>
                </form>

                {loading && (
                  <div className="grid md:grid-cols-2 gap-4 mt-8">
                    {[...Array(4)].map((_, i) => (
                      <RoleCardSkeleton key={i} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Role Cards */}
            {mode === "ikigai" && roles.length > 0 && (
              <div className="animate-fade-in">
                <button
                  onClick={() => { setRoles([]); setError(""); }}
                  className="flex items-center gap-2 text-sm font-body text-foreground/40 hover:text-foreground/70 transition-colors mb-6"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Try different input
                </button>

                <h2 className="font-heading text-2xl text-foreground mb-2">
                  Your Career Paths
                </h2>
                <p className="font-body text-foreground/50 mb-8">
                  Select a role to generate your personalized roadmap
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {roles.map((role, i) => (
                    <RoleCard
                      key={i}
                      role={role}
                      onSelect={handleRoleSelect}
                      index={i}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Title Mode */}
            {mode === "title" && (
              <div className="max-w-lg mx-auto animate-slide-up">
                <button
                  onClick={() => setMode(null)}
                  className="flex items-center gap-2 text-sm font-body text-foreground/40 hover:text-foreground/70 transition-colors mb-6"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to modes
                </button>

                <form onSubmit={handleTitleSubmit}>
                  <input
                    type="text"
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    placeholder="Enter a job title..."
                    className="w-full bg-card border border-white/10 rounded-xl px-6 py-4 text-foreground font-body text-lg placeholder:text-foreground/30 focus:outline-none focus:border-gold/50 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!titleInput.trim()}
                    className="mt-4 w-full bg-gold text-background font-body font-medium py-3 rounded-xl hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Build My Roadmap
                  </button>
                </form>
              </div>
            )}
          </div>
        </main>

        <div className="relative z-20">
          <Footer />
        </div>
      </div>
    </AuthGuard>
  );
}
