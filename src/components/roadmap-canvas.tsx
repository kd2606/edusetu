'use client';

import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  Position,
  Panel,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import { RoadmapNode, RoadmapNodeData, CachedYouTubeVideo } from './RoadmapNode';
import { NodeDetailsSheet } from './node-details-sheet';
import { updateRoadmapNodes } from '@/app/actions';
import { toPng } from 'html-to-image';
import { Download } from 'lucide-react';

const nodeTypes = {
  roadmapNode: RoadmapNode,
};

export type RoadmapData = {
  id?: string;
  title: string;
  domain?: string;
  created_at?: string;
  estimated_duration: string;
  nodes: Array<RoadmapNodeData & { id: string }>;
  edges: Array<{ source: string; target: string }>;
};

type RoadmapCanvasProps = {
  data: RoadmapData;
};

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 280;
const nodeHeight = 160;

function getLayoutedElements(nodes: Node[], edges: Edge[], direction = 'TB') {
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = Position.Top;
    node.sourcePosition = Position.Bottom;

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes, edges };
}

export function RoadmapCanvas({ data }: RoadmapCanvasProps) {
  const handleToggleComplete = useCallback((nodeId: string, completed: boolean) => {
    // Only update DB if it's a saved roadmap
    if (data.id) {
      // Create a shallow copy of nodes to send to backend (excluding functions)
      const nodesForDb = data.nodes.map(n => 
        n.id === nodeId ? { ...n, completed } : n
      );
      // Fire and forget
      updateRoadmapNodes(data.id, nodesForDb).catch(console.error);
    }
    
    // We update data.nodes by mutation or recreating it, but since React Flow uses the layouted nodes state, we should update the local setNodes directly.
  }, [data.id, data.nodes]);

  const initialNodes: Node[] = useMemo(() => {
    return data.nodes.map(n => ({
      id: n.id,
      type: 'roadmapNode',
      position: { x: 0, y: 0 },
      data: {
        id: n.id,
        label: n.label,
        description: n.description,
        category: n.category,
        priority: n.priority,
        time_allocation: n.time_allocation,
        resources: n.resources,
        completed: n.completed,
        onToggleComplete: handleToggleComplete,
      }
    }));
  }, [data.nodes, handleToggleComplete]);

  const initialEdges: Edge[] = useMemo(() => {
    return data.edges.map((e, index) => ({
      id: `e${e.source}-${e.target}-${index}`,
      source: e.source,
      target: e.target,
      animated: true,
    }));
  }, [data]);

  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(
    () => getLayoutedElements(initialNodes, initialEdges),
    [initialNodes, initialEdges]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, , onEdgesChange] = useEdgesState(layoutedEdges);

  const [selectedNode, setSelectedNode] = useState<RoadmapNodeData | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const syncTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (syncTimerRef.current) {
        clearTimeout(syncTimerRef.current);
      }
    };
  }, []);

  const handleDatabaseSync = async (updatedNodes: Node[]) => {
    if (!data.id) return;
    try {
      const rawNodes = updatedNodes.map(n => ({
        ...n.data,
        id: n.id,
      }));
      rawNodes.forEach(rn => delete (rn as Record<string, unknown>).onToggleComplete);
      await updateRoadmapNodes(data.id, rawNodes);
    } catch (err) {
      console.error('Failed to sync node updates to database:', err);
    }
  };

  // We need to override the initial handleToggleComplete so it can directly access setNodes.
  const handleToggleCompleteLocal = useCallback((nodeId: string, completed: boolean) => {
    setNodes((nds) => {
      const newNodes = nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: { ...node.data, completed }
          };
        }
        return node;
      });

      if (syncTimerRef.current) {
        clearTimeout(syncTimerRef.current);
      }
      
      syncTimerRef.current = setTimeout(() => {
        handleDatabaseSync(newNodes);
      }, 750);

      return newNodes;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.id, setNodes]);

  // Update initial nodes if we want them to use the local setter, but it's easier to just patch them
  // Actually, let's just let the useMemo recreate them or we can hook the onNodeClick.
  // Wait, if initialNodes are recreated, it wipes positions unless we are careful.
  // We already hooked the local setter correctly. Let's patch the initialNodes data array on mount to use the local setter.
  useMemo(() => {
    layoutedNodes.forEach(n => {
      n.data.onToggleComplete = handleToggleCompleteLocal;
    });
  }, [layoutedNodes, handleToggleCompleteLocal]);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node.data as unknown as RoadmapNodeData);
    setIsSheetOpen(true);
  }, []);

  const onDownload = useCallback(() => {
    const viewport = document.querySelector('.react-flow__viewport') as HTMLElement;
    if (viewport) {
      toPng(viewport, { backgroundColor: '#09090b' }) // match dark background
        .then((dataUrl) => {
          const a = document.createElement('a');
          a.setAttribute('download', `${data.title.replace(/\\s+/g, '_')}_roadmap.png`);
          a.setAttribute('href', dataUrl);
          a.click();
        })
        .catch(console.error);
    }
  }, [data.title]);

  const handleVideosFetched = useCallback(async (nodeId: string, videos: CachedYouTubeVideo[]) => {
    const updatedNodes = nodes.map(n => 
      n.id === nodeId 
        ? { 
            ...n, 
            data: { 
              ...n.data, 
              youtube_videos: { 
                videos, 
                fetched_at: new Date().toISOString() 
              } 
            } 
          } 
        : n
    );
    setNodes(updatedNodes);
    
    if (data.id) {
      const rawNodes = updatedNodes.map(n => ({
        ...n.data,
        id: n.id,
      }));
      rawNodes.forEach(rn => delete (rn as Record<string, unknown>).onToggleComplete);
      await updateRoadmapNodes(data.id, rawNodes);
    }
  }, [nodes, data.id, setNodes]);

  return (
    <div className="w-full h-full min-h-screen bg-background relative">
      <div className="absolute top-4 left-4 z-10 bg-card/80 backdrop-blur-sm border rounded-lg p-4 shadow-sm">
        <h2 className="font-bold text-xl">{data.title}</h2>
        <p className="text-muted-foreground text-sm">Estimated Duration: {data.estimated_duration}</p>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        colorMode="dark"
        defaultEdgeOptions={{ type: 'smoothstep', style: { stroke: 'rgba(255,255,255,0.12)', strokeWidth: 1 } }}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="rgba(255,255,255,0.04)" />
        <Controls />
        <Panel position="top-right">
          <button
            onClick={onDownload}
            className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg shadow-sm text-sm font-medium hover:bg-white/90 active:scale-[0.98] transition-all duration-150 tracking-[-0.01em]"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </Panel>
      </ReactFlow>
      
      <NodeDetailsSheet 
        isOpen={isSheetOpen} 
        onOpenChange={setIsSheetOpen} 
        node={selectedNode} 
        onVideosFetched={handleVideosFetched}
      />
    </div>
  );
}
