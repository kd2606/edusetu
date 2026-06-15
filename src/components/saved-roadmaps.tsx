'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Card } from '@/components/ui/card';
import { Loader2, Route } from 'lucide-react';

type SavedRoadmapsProps = {
  onSelectRoadmap: (data: any) => void;
  onRoadmapsLoaded?: (count: number) => void;
};

export function SavedRoadmaps({ onSelectRoadmap, onRoadmapsLoaded }: SavedRoadmapsProps) {
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const supabase = createClient();
    
    const fetchRoadmaps = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }
      setIsAuthenticated(true);

      const { data, error } = await supabase
        .from('roadmaps')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setRoadmaps(data);
        if (onRoadmapsLoaded) onRoadmapsLoaded(data.length);
      } else {
        if (onRoadmapsLoaded) onRoadmapsLoaded(0);
      }
      setIsLoading(false);
    };

    fetchRoadmaps();
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;
  }

  if (!isAuthenticated) {
    return null; // Don't show the sidebar at all if not logged in
  }

  if (roadmaps.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground border-dashed border rounded-xl m-4">
        No saved roadmaps yet.
      </div>
    );
  }

  return (
    <div className="w-full space-y-2 p-4 max-h-screen overflow-y-auto">
      <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wider mb-4 px-2">Your Roadmaps</h3>
      {roadmaps.map((rm) => (
        <Card 
          key={rm.id} 
          className="p-4 cursor-pointer bg-white/[0.03] hover:bg-white/[0.08] transition-all duration-300 border border-white/[0.1] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-2xl rounded-2xl group"
          onClick={() => onSelectRoadmap({ id: rm.id, title: rm.title, estimated_duration: "From Library", nodes: rm.nodes, edges: rm.edges })}
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-md bg-primary/10 text-primary">
              <Route className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm text-foreground truncate">{rm.title}</h4>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-muted-foreground capitalize">{rm.domain}</span>
                <span className="text-[10px] text-muted-foreground/70">
                  {new Date(rm.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
