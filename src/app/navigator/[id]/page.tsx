"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import AuthGuard from "@/components/AuthGuard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RoadmapFlow from "@/components/RoadmapFlow";
import ResourceCard from "@/components/ResourceCard";
import {
  RoadmapSkeleton,
  ResourceCardSkeleton,
} from "@/components/LoadingSkeleton";
import Link from "next/link";

interface RoadmapNode {
  id: string;
  label: string;
  description: string;
  type: string;
  estimatedTime: string;
}

interface Resource {
  title: string;
  url: string;
  type: string;
  platform: string;
  free: boolean;
  forNodes?: string[];
}

interface NavigatorData {
  nodes: RoadmapNode[];
  edges: { source: string; target: string }[];
  resources: Resource[];
}

export default function NavigatorPage() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const role = searchParams.get("role") || "";
  const mode = searchParams.get("mode") || "title";
  const ikigaiInput = searchParams.get("ikigaiInput") || "";

  const [data, setData] = useState<NavigatorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [sharing, setSharing] = useState(false);

  const generateRoadmap = useCallback(async () => {
    if (!role) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/gemini/navigator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate roadmap. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    generateRoadmap();
  }, [generateRoadmap]);

  async function handleSave() {
    if (!data || !session) return;
    setSaving(true);

    try {
      const res = await fetch("/api/navigator/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roleTitle: role,
          mode,
          ikigaiInput: ikigaiInput || null,
          roadmapJson: { nodes: data.nodes, edges: data.edges },
          resourcesJson: data.resources,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      setSaved(true);

      // Store the slug for sharing
      if (result.navigator?.public_slug) {
        setShareUrl(result.navigator.public_slug);
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleShare() {
    if (!shareUrl) {
      alert("Please save the navigator first.");
      return;
    }
    setSharing(true);

    try {
      // Make it public
      await fetch(`/api/navigator/${shareUrl}`, { method: "PATCH" });

      const fullUrl = `${window.location.origin}/share/${shareUrl}`;
      await navigator.clipboard.writeText(fullUrl);
      alert("Share link copied to clipboard!");
    } catch {
      alert("Failed to generate share link.");
    } finally {
      setSharing(false);
    }
  }

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
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-fade-in">
              <div>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-sm font-body text-foreground/40 hover:text-foreground/70 transition-colors mb-3"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to dashboard
                </Link>
                <h1 className="font-heading text-3xl md:text-4xl text-foreground">
                  <span className="text-gold">{role}</span>
                  <span className="text-foreground/40"> — Your Roadmap</span>
                </h1>
              </div>

              {data && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSave}
                    disabled={saving || saved}
                    className="flex items-center gap-2 px-5 py-2.5 bg-card border border-white/10 rounded-lg font-body text-sm text-foreground hover:border-gold/30 transition-colors disabled:opacity-50"
                  >
                    {saved ? (
                      <>
                        <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Saved
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        {saving ? "Saving..." : "Save"}
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleShare}
                    disabled={sharing || !saved}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gold text-background rounded-lg font-body text-sm font-medium hover:bg-gold-light transition-colors disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    {sharing ? "Sharing..." : "Share"}
                  </button>
                </div>
              )}
            </div>

            {/* Error state */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center animate-fade-in">
                <p className="text-red-400 font-body mb-4">{error}</p>
                <button
                  onClick={generateRoadmap}
                  className="px-6 py-2 bg-red-500/20 text-red-400 rounded-lg font-body text-sm hover:bg-red-500/30 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Loading state */}
            {loading && (
              <div>
                <RoadmapSkeleton />
                <div className="mt-12">
                  <div className="h-8 w-64 bg-white/5 rounded mb-6 animate-pulse" />
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                      <ResourceCardSkeleton key={i} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Roadmap */}
            {data && !loading && (
              <div className="animate-fade-in">
                <RoadmapFlow nodes={data.nodes} edges={data.edges} />

                {/* Resources grouped by roadmap step */}
                <div className="mt-12">
                  <h2 className="font-heading text-2xl text-foreground mb-2">
                    Resources to get you there
                  </h2>
                  <p className="font-body text-foreground/50 mb-8">
                    Curated learning materials mapped to each step of your roadmap
                  </p>

                  {(() => {
                    const grouped = new Map<string, Resource[]>();
                    const ungrouped: Resource[] = [];

                    data.resources.forEach(r => {
                      if (r.forNodes && r.forNodes.length > 0) {
                        r.forNodes.forEach(nid => {
                          if (!grouped.has(nid)) grouped.set(nid, []);
                          grouped.get(nid)!.push(r);
                        });
                      } else {
                        ungrouped.push(r);
                      }
                    });

                    const nodeTypeColors: Record<string, string> = {
                      foundation: "border-purple-500/30 bg-purple-500/5",
                      skill: "border-blue-500/30 bg-blue-500/5",
                      milestone: "border-green-500/30 bg-green-500/5",
                      goal: "border-purple-400/30 bg-purple-400/5",
                    };
                    const nodeTypeDot: Record<string, string> = {
                      foundation: "bg-purple-500",
                      skill: "bg-blue-500",
                      milestone: "bg-green-500",
                      goal: "bg-purple-400",
                    };

                    return (
                      <div className="space-y-8">
                        {data.nodes.map((node) => {
                          const resources = grouped.get(node.id);
                          if (!resources || resources.length === 0) return null;
                          return (
                            <div
                              key={node.id}
                              className={`rounded-xl border p-6 ${nodeTypeColors[node.type] || "border-white/10 bg-white/[0.02]"}`}
                            >
                              <div className="flex items-center gap-3 mb-4">
                                <span className={`w-2.5 h-2.5 rounded-full ${nodeTypeDot[node.type] || "bg-gray-500"}`} />
                                <h3 className="font-heading text-lg text-foreground">
                                  {node.label}
                                </h3>
                                <span className="text-xs font-body text-foreground/40 ml-auto">
                                  {node.estimatedTime}
                                </span>
                              </div>
                              <p className="font-body text-sm text-foreground/50 mb-4">
                                {node.description}
                              </p>
                              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {resources.map((resource, i) => (
                                  <ResourceCard key={`${node.id}-${i}`} resource={resource} index={i} />
                                ))}
                              </div>
                            </div>
                          );
                        })}
                        {ungrouped.length > 0 && (
                          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
                            <div className="flex items-center gap-3 mb-4">
                              <span className="w-2.5 h-2.5 rounded-full bg-gray-500" />
                              <h3 className="font-heading text-lg text-foreground">
                                General Resources
                              </h3>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {ungrouped.map((resource, i) => (
                                <ResourceCard key={`ungrouped-${i}`} resource={resource} index={i} />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
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
