"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import RoadmapFlow from "@/components/RoadmapFlow";
import ResourceCard from "@/components/ResourceCard";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  RoadmapSkeleton,
  ResourceCardSkeleton,
} from "@/components/LoadingSkeleton";

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
  role_title: string;
  mode: string;
  roadmap_json: {
    nodes: RoadmapNode[];
    edges: { source: string; target: string }[];
  };
  resources_json: Resource[];
  created_at: string;
}

export default function SharePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [data, setData] = useState<NavigatorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchNavigator() {
      try {
        const res = await fetch(`/api/navigator/${slug}`);
        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.error || "Navigator not found");
        }

        setData(result.navigator);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load navigator"
        );
      } finally {
        setLoading(false);
      }
    }

    if (slug) fetchNavigator();
  }, [slug]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-background/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <svg viewBox="0 0 40 40" fill="none" className="h-7 w-auto">
              <path d="M8 32L20 8L32 32H24L20 22L16 32H8Z" fill="#7C3AED" />
              <path d="M8 32L20 20L14 32H8Z" fill="#6D28D9" />
              <path d="M32 32L20 20L26 32H32Z" fill="#9333EA" />
            </svg>
            <span className="font-body font-semibold text-lg tracking-tight text-foreground">
              Novare <span className="font-normal text-foreground/70">Talent</span>
            </span>
          </Link>
          <Link
            href="/"
            className="px-4 py-2 bg-gold text-background rounded-lg font-body text-sm font-medium hover:bg-gold-light transition-colors"
          >
            Create Your Own
          </Link>
        </div>
      </header>

      <main className="flex-1 pt-24 pb-12 px-6 relative z-20">
        <div className="max-w-6xl mx-auto">
          {loading && (
            <div>
              <div className="h-10 w-72 bg-white/5 rounded mb-8 animate-pulse" />
              <RoadmapSkeleton />
              <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <ResourceCardSkeleton key={i} />
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="text-center py-20 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <p className="font-body text-foreground/60 mb-4">{error}</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-background rounded-lg font-body font-medium hover:bg-gold-light transition-colors"
              >
                Go Home
              </Link>
            </div>
          )}

          {data && !loading && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`px-2 py-0.5 text-xs font-body rounded-full ${
                      data.mode === "ikigai"
                        ? "bg-gold/10 text-gold"
                        : "bg-blue-500/10 text-blue-400"
                    }`}
                  >
                    {data.mode} mode
                  </span>
                  <span className="text-xs font-body text-foreground/30">
                    {new Date(data.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <h1 className="font-heading text-3xl md:text-4xl text-foreground">
                  <span className="text-gold">{data.role_title}</span>
                  <span className="text-foreground/40"> — Career Roadmap</span>
                </h1>
              </div>

              <RoadmapFlow
                nodes={data.roadmap_json.nodes}
                edges={data.roadmap_json.edges}
              />

              <div className="mt-12">
                <h2 className="font-heading text-2xl text-foreground mb-2">
                  Resources to get you there
                </h2>
                <p className="font-body text-foreground/50 mb-8">
                  Curated learning materials mapped to each step of your roadmap
                </p>

                {(() => {
                  const nodes = data.roadmap_json.nodes;
                  const nodeMap = new Map(nodes.map(n => [n.id, n]));
                  const grouped = new Map<string, Resource[]>();
                  const ungrouped: Resource[] = [];

                  data.resources_json.forEach(r => {
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
                      {nodes.map((node) => {
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
  );
}
