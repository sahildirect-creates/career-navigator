"use client";

interface NodeData {
  id: string;
  label: string;
  description: string;
  type: string;
  estimatedTime: string;
}

interface NodeDrawerProps {
  node: NodeData | null;
  onClose: () => void;
}

const typeLabels: Record<string, { label: string; color: string }> = {
  foundation: { label: "Foundation", color: "text-purple-400" },
  skill: { label: "Skill", color: "text-blue-400" },
  milestone: { label: "Milestone", color: "text-green-400" },
  goal: { label: "Goal", color: "text-purple-300" },
};

export default function NodeDrawer({ node, onClose }: NodeDrawerProps) {
  if (!node) return null;

  const typeInfo = typeLabels[node.type] || typeLabels.skill;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-white/10 z-50 p-8 animate-slide-in-right overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-foreground/40 hover:text-foreground transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="mt-4">
          <span
            className={`text-xs font-body font-medium uppercase tracking-wider ${typeInfo.color}`}
          >
            {typeInfo.label}
          </span>

          <h2 className="font-heading text-2xl text-foreground mt-2 mb-4">
            {node.label}
          </h2>

          <div className="flex items-center gap-2 mb-6">
            <svg
              className="w-4 h-4 text-foreground/40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-body text-foreground/60">
              {node.estimatedTime}
            </span>
          </div>

          <div className="bg-background rounded-lg p-4 border border-white/5">
            <p className="text-foreground/80 font-body leading-relaxed">
              {node.description}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
