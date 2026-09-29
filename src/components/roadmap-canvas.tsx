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
import { RoadmapNodeData, CachedYouTubeVideo } from '@/types/roadmap';
import { TopicNode } from './roadmap/topic-node';
import { NodeDetailsSheet } from './node-details-sheet';
import { updateRoadmapNodes, updateRoadmapGraph, grantNodeCompletionXP } from '@/app/actions';
import { toPng } from 'html-to-image';
import { Download } from 'lucide-react';

const nodeTypes = {
  roadmapNode: TopicNode,
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

const nodeWidth = 280;
const nodeHeight = 160;

function getLayoutedElements(nodes: Node[], edges: Edge[], direction = 'TB') {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
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
      // Fire and forget update
      updateRoadmapNodes(data.id, nodesForDb).catch(console.error);

      // If it was marked as completed (not unchecked), grant XP
      if (completed) {
        grantNodeCompletionXP().catch(console.error);
      }
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
        title: n.label,
        module: n.category,
        status: n.completed ? 'completed' : 'available',
        estMinutes: n.time_allocation,
        videoCount: n.resources ? n.resources.length : 0,
        
        // Pass original data properties so the node sheet still works
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
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

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

  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);
  useEffect(() => {
    nodesRef.current = nodes;
    edgesRef.current = edges;
  }, [nodes, edges]);

  const handleStuck = useCallback(async (nodeId: string) => {
    setNodes(nds => nds.map(n => n.id === nodeId ? { ...n, data: { ...n.data, isBreakingDown: true } } : n));

    try {
      const currentNodes = nodesRef.current;
      const currentEdges = edgesRef.current;

      const clickedNode = currentNodes.find(n => n.id === nodeId);
      if (!clickedNode) throw new Error("Node not found");

      // 1. Call the real Gemini API
      const res = await fetch('/api/breakdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nodeTitle: clickedNode.data.title,
          courseContext: data.title // Pass the roadmap title as context
        })
      });

      if (!res.ok) {
        throw new Error("Failed to breakdown node");
      }

      const breakdownData = await res.json();
      if (!Array.isArray(breakdownData) || breakdownData.length === 0) {
        throw new Error("Invalid breakdown data format");
      }

      // 2. Map API response to React Flow nodes
      const newSubNodes = breakdownData.map((item, index) => ({
        id: item.id || `${nodeId}-sub-${index}`,
        type: 'roadmapNode' as const,
        position: { x: 0, y: 0 },
        data: {
          id: item.id || `${nodeId}-sub-${index}`,
          title: item.title,
          module: clickedNode.data.module,
          status: 'available',
          estMinutes: Math.floor((Number(clickedNode.data.estMinutes) || 45) / breakdownData.length),
          videoCount: 1,
          label: item.title,
          description: item.description,
          difficulty_level: item.difficulty_level,
          is_boss_node: item.is_boss_node || false,
          category: clickedNode.data.category,
          priority: clickedNode.data.priority,
          time_allocation: '15 mins',
          resources: [],
          completed: false,
          onToggleComplete: handleToggleCompleteLocal,
          onStuck: handleStuck,
          isBreakingDown: false,
        }
      }));

      // 3. Rewire edges
      const outgoingEdges = currentEdges.filter(e => e.source === nodeId);
      
      const newEdgesList = [];
      // Edge from parent to first subnode
      newEdgesList.push({ id: `e${nodeId}-${newSubNodes[0].id}`, source: nodeId, target: newSubNodes[0].id, animated: true });
      
      // Edges between subnodes
      for (let i = 0; i < newSubNodes.length - 1; i++) {
        newEdgesList.push({
          id: `e${newSubNodes[i].id}-${newSubNodes[i+1].id}`,
          source: newSubNodes[i].id,
          target: newSubNodes[i+1].id,
          animated: true
        });
      }

      // Remap original outgoing edges from the last subnode
      const lastSubNodeId = newSubNodes[newSubNodes.length - 1].id;
      const remappedOutgoingEdges = outgoingEdges.map(e => ({
        ...e,
        id: `e${lastSubNodeId}-${e.target}`,
        source: lastSubNodeId
      }));

      const filteredEdges = currentEdges.filter(e => e.source !== nodeId);
      const finalEdges = [...filteredEdges, ...newEdgesList, ...remappedOutgoingEdges];

      const updatedNodes = currentNodes.map(n => n.id === nodeId ? { ...n, data: { ...n.data, isBreakingDown: false } } : n);
      const finalNodes = [...updatedNodes, ...newSubNodes];

      // 4. Run Dagre Layout
      const { nodes: layoutedNds, edges: layoutedEds } = getLayoutedElements(finalNodes, finalEdges);

      setNodes(layoutedNds);
      setEdges(layoutedEds);

      // 5. Persist to Supabase
      if (data.id) {
        // We strip non-serializable functions before saving
        const serializableNodes = layoutedNds.map(n => {
          const restData = { ...n.data } as Record<string, unknown>;
          delete restData.onToggleComplete;
          delete restData.onStuck;
          return { ...n, data: restData };
        });
        await updateRoadmapGraph(data.id, serializableNodes, layoutedEds);
      }

    } catch (err) {
      console.error(err);
      // Revert the loading state on error
      setNodes(nds => nds.map(n => n.id === nodeId ? { ...n, data: { ...n.data, isBreakingDown: false } } : n));
    }
  }, [setNodes, setEdges, handleToggleCompleteLocal, data.title, data.id]);


  // Update initial nodes if we want them to use the local setter, but it's easier to just patch them
  // Actually, let's just let the useMemo recreate them or we can hook the onNodeClick.
  // Wait, if initialNodes are recreated, it wipes positions unless we are careful.
  // We already hooked the local setter correctly. Let's patch the initialNodes data array on mount to use the local setter.
  useMemo(() => {
    layoutedNodes.forEach(n => {
      n.data.onToggleComplete = handleToggleCompleteLocal;
      n.data.onStuck = handleStuck;
    });
  }, [layoutedNodes, handleToggleCompleteLocal, handleStuck]);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node.data as unknown as RoadmapNodeData);
    setIsSheetOpen(true);
  }, []);

  const onDownload = useCallback(() => {
    const container = document.querySelector('.react-flow') as HTMLElement;
    const viewport = document.querySelector('.react-flow__viewport') as HTMLElement;
    if (viewport && container) {
      // Enable export-safe mode: swap glass to opaque, hide glow
      container.classList.add('export-mode');
      const glowEls = container.querySelectorAll('[data-horizon-glow]');
      glowEls.forEach(el => (el as HTMLElement).style.display = 'none');

      toPng(viewport, { backgroundColor: '#04060C' })
        .then((dataUrl) => {
          const a = document.createElement('a');
          a.setAttribute('download', `${data.title.replace(/\s+/g, '_')}_roadmap.png`);
          a.setAttribute('href', dataUrl);
          a.click();
        })
        .catch(console.error)
        .finally(() => {
          container.classList.remove('export-mode');
          glowEls.forEach(el => (el as HTMLElement).style.display = '');
        });
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
    <div className="w-full h-full relative">
      <div className="absolute top-4 left-4 z-10 bg-surface border border-outline-variant rounded-xl p-4 shadow-e2">
        <h2 className="font-bold text-xl text-on-surface">{data.title}</h2>
        <p className="text-on-surface-muted text-sm mt-1">Estimated Duration: {data.estimated_duration}</p>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.35 }}
        minZoom={0.25}
        maxZoom={1.5}
        defaultEdgeOptions={{ type: 'smoothstep', animated: false }}
      >
        <Background variant={BackgroundVariant.Dots} gap={22} size={1.4} />
        <Controls showInteractive={false} position="bottom-right" />
        <Panel position="top-right">
          <button
            onClick={onDownload}
            className="flex items-center gap-2 rounded-full h-10 px-4 bg-surface text-on-surface-variant font-medium shadow-e1 hover:shadow-e2 hover:-translate-y-px active:scale-[0.98] border border-outline-variant transition-all duration-150"
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
