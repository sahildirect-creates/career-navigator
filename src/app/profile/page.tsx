"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

interface Navigator {
  id: string;
  role_title: string;
  mode: string;
  created_at: string;
  public_slug: string;
  is_public: boolean;
  roadmap_json: unknown;
  resources_json: unknown;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [navigators, setNavigators] = useState<Navigator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNavigators() {
      if (!session?.user?.googleId) return;

      try {
        const res = await fetch(
          `/api/profile/navigators?googleId=${session.user.googleId}`
        );
        const data = await res.json();
        if (res.ok) {
          setNavigators(data.navigators || []);
        }
      } catch (err) {
        console.error("Failed to fetch navigators:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchNavigators();
  }, [session]);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background flex flex-col">
        <div
          className="fixed inset-0 opacity-[0.03] pointer-events-none z-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />

        <Header />

        <main className="flex-1 pt-24 pb-12 px-6 relative z-20">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 animate-fade-in">
              <h1 className="font-heading text-3xl md:text-4xl text-foreground mb-2">
                My <span className="text-gold">Navigators</span>
              </h1>
              <p className="font-body text-foreground/50">
                Your saved career roadmaps
              </p>
            </div>

            {loading && (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-card border border-white/5 rounded-xl p-6 animate-pulse"
                  >
                    <div className="h-6 w-48 bg-white/5 rounded mb-3" />
                    <div className="h-4 w-32 bg-white/5 rounded" />
                  </div>
                ))}
              </div>
            )}

            {!loading && navigators.length === 0 && (
              <div className="text-center py-20 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-card border border-white/5 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-foreground/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <p className="font-body text-foreground/40 mb-4">
                  No saved navigators yet
                </p>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-background rounded-lg font-body font-medium hover:bg-gold-light transition-colors"
                >
                  Create your first navigator
                </Link>
              </div>
            )}

            {!loading && navigators.length > 0 && (
              <div className="space-y-4">
                {navigators.map((nav, i) => (
                  <div
                    key={nav.id}
                    className="group bg-card border border-white/5 rounded-xl p-6 hover:border-gold/20 transition-all duration-300 animate-slide-up"
                    style={{
                      animationDelay: `${i * 80}ms`,
                      animationFillMode: "both",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-heading text-xl text-foreground group-hover:text-gold transition-colors">
                          {nav.role_title}
                        </h3>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs font-body text-foreground/40">
                            {new Date(nav.created_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </span>
                          <span
                            className={`px-2 py-0.5 text-xs font-body rounded-full ${
                              nav.mode === "ikigai"
                                ? "bg-gold/10 text-gold"
                                : "bg-blue-500/10 text-blue-400"
                            }`}
                          >
                            {nav.mode}
                          </span>
                          {nav.is_public && (
                            <span className="px-2 py-0.5 text-xs font-body rounded-full bg-green-500/10 text-green-400">
                              Public
                            </span>
                          )}
                        </div>
                      </div>
                      <Link
                        href={`/share/${nav.public_slug}`}
                        className="px-4 py-2 bg-card-hover border border-white/10 rounded-lg text-sm font-body text-foreground/70 hover:text-gold hover:border-gold/30 transition-colors"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
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
