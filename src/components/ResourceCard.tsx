"use client";

interface Resource {
  title: string;
  url: string;
  type: string;
  platform: string;
  free: boolean;
}

interface ResourceCardProps {
  resource: Resource;
  index: number;
}

const typeColors: Record<string, string> = {
  course: "bg-blue-500/20 text-blue-400",
  book: "bg-purple-500/20 text-purple-400",
  community: "bg-green-500/20 text-green-400",
  tool: "bg-orange-500/20 text-orange-400",
  video: "bg-red-500/20 text-red-400",
};

export default function ResourceCard({ resource, index }: ResourceCardProps) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-card border border-white/5 rounded-xl p-5 hover:border-gold/30 hover:bg-card-hover transition-all duration-300 animate-slide-up"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: "both" }}
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-body font-medium text-foreground group-hover:text-gold transition-colors text-sm leading-tight pr-2">
          {resource.title}
        </h4>
        <svg
          className="w-4 h-4 text-foreground/30 group-hover:text-gold shrink-0 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={`px-2 py-0.5 text-xs font-body rounded-full ${typeColors[resource.type] || "bg-gray-500/20 text-gray-400"}`}
        >
          {resource.type}
        </span>
        <span className="text-xs font-body text-foreground/40">
          {resource.platform}
        </span>
        <span
          className={`px-2 py-0.5 text-xs font-body rounded-full ${
            resource.free
              ? "bg-green-500/20 text-green-400"
              : "bg-purple-500/20 text-purple-400"
          }`}
        >
          {resource.free ? "Free" : "Paid"}
        </span>
      </div>
    </a>
  );
}
