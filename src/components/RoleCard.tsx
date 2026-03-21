"use client";

interface Role {
  title: string;
  description: string;
  fitReason: string;
  salary: {
    india: string;
    global: string;
  };
  growth: string;
}

interface RoleCardProps {
  role: Role;
  onSelect: (role: Role) => void;
  index: number;
}

function GrowthBadge({ growth }: { growth: string }) {
  const colors: Record<string, string> = {
    Explosive: "bg-red-500/20 text-red-400 border-red-500/30",
    High: "bg-green-500/20 text-green-400 border-green-500/30",
    Medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  };

  return (
    <span
      className={`px-2 py-0.5 text-xs font-body font-medium rounded-full border ${colors[growth] || colors.Medium}`}
    >
      {growth}
    </span>
  );
}

export default function RoleCard({ role, onSelect, index }: RoleCardProps) {
  return (
    <button
      onClick={() => onSelect(role)}
      className="group text-left w-full bg-card border border-white/5 rounded-xl p-6 hover:border-gold/30 hover:bg-card-hover transition-all duration-300 animate-slide-up"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: "both" }}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-heading text-xl text-foreground group-hover:text-gold transition-colors">
          {role.title}
        </h3>
        <GrowthBadge growth={role.growth} />
      </div>

      <p className="text-foreground/60 text-sm font-body mb-3">
        {role.description}
      </p>

      <p className="text-foreground/80 text-sm font-body mb-4">
        {role.fitReason}
      </p>

      <div className="flex items-center gap-4 text-xs font-body text-foreground/50">
        <span>
          <span className="text-foreground/70">India:</span> {role.salary.india}
        </span>
        <span>
          <span className="text-foreground/70">Global:</span>{" "}
          {role.salary.global}
        </span>
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
        <span className="text-xs text-foreground/40 font-body">
          Click to explore this path
        </span>
        <svg
          className="w-4 h-4 text-foreground/30 group-hover:text-gold group-hover:translate-x-1 transition-all"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </button>
  );
}
