"use client";

export function RoleCardSkeleton() {
  return (
    <div className="bg-card border border-white/5 rounded-xl p-6 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="h-6 w-40 bg-white/5 rounded" />
        <div className="h-5 w-16 bg-white/5 rounded-full" />
      </div>
      <div className="h-4 w-full bg-white/5 rounded mb-3" />
      <div className="h-4 w-3/4 bg-white/5 rounded mb-3" />
      <div className="h-4 w-2/3 bg-white/5 rounded mb-4" />
      <div className="flex gap-4">
        <div className="h-3 w-24 bg-white/5 rounded" />
        <div className="h-3 w-24 bg-white/5 rounded" />
      </div>
    </div>
  );
}

export function RoadmapSkeleton() {
  return (
    <div className="w-full h-[500px] bg-card border border-white/5 rounded-xl animate-pulse flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-foreground/40 font-body text-sm">
          Generating your career roadmap...
        </p>
      </div>
    </div>
  );
}

export function ResourceCardSkeleton() {
  return (
    <div className="bg-card border border-white/5 rounded-xl p-5 animate-pulse">
      <div className="h-4 w-3/4 bg-white/5 rounded mb-3" />
      <div className="flex items-center gap-2">
        <div className="h-5 w-14 bg-white/5 rounded-full" />
        <div className="h-3 w-20 bg-white/5 rounded" />
        <div className="h-5 w-10 bg-white/5 rounded-full" />
      </div>
    </div>
  );
}
