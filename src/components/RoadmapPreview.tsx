"use client";

import RoadmapFlow from "./RoadmapFlow";

interface RoadmapNode {
  id: string;
  label: string;
  description: string;
  type: string;
  estimatedTime: string;
}

interface RoadmapEdge {
  source: string;
  target: string;
}

export default function RoadmapPreview({
  nodes,
  edges,
  height = 360,
}: {
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
  height?: number;
}) {
  return <RoadmapFlow nodes={nodes} edges={edges} embed height={height} />;
}
