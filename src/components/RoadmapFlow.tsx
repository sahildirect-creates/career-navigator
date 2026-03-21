"use client";

import { useCallback, useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Position,
  Handle,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import NodeDrawer from "./NodeDrawer";

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

interface RoadmapFlowProps {
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
}

const typeColors: Record<string, { bg: string; border: string; text: string }> =
  {
    foundation: {
      bg: "#1a0a2e",
      border: "#7C3AED",
      text: "#8B5CF6",
    },
    skill: {
      bg: "#0a1a2a",
      border: "#4A9BD9",
      text: "#4A9BD9",
    },
    milestone: {
      bg: "#0a2a1a",
      border: "#4AD98A",
      text: "#4AD98A",
    },
    goal: {
      bg: "#1a0a2e",
      border: "#A78BFA",
      text: "#A78BFA",
    },
  };

function CustomNode({ data }: { data: Record<string, unknown> }) {
  const colors = typeColors[(data.nodeType as string) || "skill"];

  return (
    <>
      <Handle type="target" position={Position.Top} className="!bg-purple-500/50 !w-2 !h-2 !border-0" />
      <div
        className="px-4 py-3 rounded-xl border-2 min-w-[180px] max-w-[220px] cursor-pointer transition-all hover:scale-105"
        style={{
          backgroundColor: colors.bg,
          borderColor: colors.border,
        }}
      >
        <div
          className="text-xs font-body uppercase tracking-wider mb-1 opacity-70"
          style={{ color: colors.text }}
        >
          {data.nodeType as string}
        </div>
        <div className="font-body font-medium text-sm text-foreground">
          {data.label as string}
        </div>
        <div className="text-xs font-body text-foreground/50 mt-1">
          {data.estimatedTime as string}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-purple-500/50 !w-2 !h-2 !border-0" />
    </>
  );
}

const nodeTypes = { custom: CustomNode };

export default function RoadmapFlow({ nodes, edges }: RoadmapFlowProps) {
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);

  const flowNodes: Node[] = useMemo(() => {
    const nodesPerRow = 3;
    const xSpacing = 280;
    const ySpacing = 160;

    return nodes.map((node, i) => {
      const row = Math.floor(i / nodesPerRow);
      const col = i % nodesPerRow;
      // Alternate row direction for a snake-like layout
      const x = row % 2 === 0 ? col * xSpacing : (nodesPerRow - 1 - col) * xSpacing;
      const y = row * ySpacing;

      return {
        id: node.id,
        type: "custom",
        position: { x: x + 50, y: y + 50 },
        data: {
          label: node.label,
          description: node.description,
          nodeType: node.type,
          estimatedTime: node.estimatedTime,
        },
        draggable: false,
      };
    });
  }, [nodes]);

  const flowEdges: Edge[] = useMemo(() => {
    return edges.map((edge, i) => ({
      id: `e-${i}`,
      source: edge.source,
      target: edge.target,
      animated: true,
      style: { stroke: "#7C3AED", strokeWidth: 2 },
    }));
  }, [edges]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const original = nodes.find((n) => n.id === node.id);
      if (original) {
        setSelectedNode(original);
      }
    },
    [nodes]
  );

  return (
    <div className="w-full h-[500px] bg-background rounded-xl border border-white/5 overflow-hidden">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        minZoom={0.3}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#333" gap={20} />
        <Controls
          className="!bg-card !border-white/10 !rounded-lg [&>button]:!bg-card [&>button]:!border-white/10 [&>button]:!text-foreground/60 [&>button:hover]:!bg-card-hover"
        />
        <MiniMap
          nodeColor={(node) => {
            const colors = typeColors[(node.data?.nodeType as string) || "skill"];
            return colors.border;
          }}
          maskColor="rgba(0,0,0,0.7)"
          className="!bg-card !border-white/10 !rounded-lg"
        />
      </ReactFlow>

      <NodeDrawer
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
      />
    </div>
  );
}
