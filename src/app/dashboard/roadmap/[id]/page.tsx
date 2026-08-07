'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { RoadmapCanvas } from '@/components/roadmap-canvas';
import type { RoadmapData } from '@/components/roadmap-canvas';
import { ErrorBoundary } from '@/components/error-boundary';
import { Loader2 } from 'lucide-react';

export default function RoadmapViewerPage({ params }: { params: { id: string } }) {
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoadmap = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('roadmaps')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error || !data) {
        setError('Roadmap not found or you do not have permission to view it.');
      } else {
        setRoadmapData({
          id: data.id,
          title: data.title,
          estimated_duration: "From Library",
          nodes: data.nodes,
          edges: data.edges
        });
      }
      setIsLoading(false);
    };

    fetchRoadmap();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100svh-var(--header-h))] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !roadmapData) {
    return (
      <div className="flex h-[calc(100svh-var(--header-h))] items-center justify-center">
        <p className="text-error font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[calc(100svh-var(--header-h))] relative overflow-hidden -mt-8">
      <ErrorBoundary>
        <RoadmapCanvas data={roadmapData} />
      </ErrorBoundary>
    </div>
  );
}
