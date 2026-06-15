'use client';

import { useState, useEffect } from 'react';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { RoadmapNodeData, CachedYouTubeVideo } from './RoadmapNode';
import { BookOpen, Target, Dumbbell, Rocket, Video, FileText, Link as LinkIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { isCacheValid } from '@/lib/youtube-cache';

type NodeDetailsSheetProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  node: RoadmapNodeData | null;
  onVideosFetched?: (nodeId: string, videos: CachedYouTubeVideo[]) => void;
};

const categoryIcons = {
  prerequisite: BookOpen,
  core: Target,
  practice: Dumbbell,
  project: Rocket,
};

const priorityColors = {
  critical: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
  high: 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20',
  medium: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20',
};

const getResourceIcon = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes('video') || t.includes('youtube')) return <Video className="w-5 h-5 text-red-500" />;
  if (t.includes('article') || t.includes('doc') || t.includes('book')) return <FileText className="w-5 h-5 text-blue-500" />;
  return <LinkIcon className="w-5 h-5 text-zinc-400" />;
};

export function NodeDetailsSheet({ isOpen, onOpenChange, node, onVideosFetched }: NodeDetailsSheetProps) {
  const [videos, setVideos] = useState<CachedYouTubeVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [aiExplanation, setAiExplanation] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    setVideos([]);
    setLoading(false);
    setError(null);
    setAiExplanation('');
    setIsStreaming(false);

    if (!node) return;

    if (isCacheValid(node.youtube_videos)) {
      setVideos(node.youtube_videos!.videos);
      return;
    }

    setLoading(true);
    fetch('/api/youtube/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: node.label })
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) {
          if (res.status === 429) {
            throw new Error('Too many requests. Please wait a few minutes.');
          }
          throw new Error(data.error || 'Failed to fetch videos');
        }
        setVideos(data.videos);
        if (data.videos && onVideosFetched) {
          onVideosFetched(node.id, data.videos);
        }
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node?.id]);

  const handleExplain = async () => {
    if (!node) return;
    setIsStreaming(true);
    setAiExplanation('');

    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `${node.label}: ${node.description}` })
      });

      if (!res.ok) throw new Error('Failed to fetch explanation');
      
      const reader = res.body?.getReader();
      if (!reader) throw new Error('No reader available');

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setAiExplanation(prev => prev + decoder.decode(value, { stream: true }));
      }
    } catch (err) {
      console.error(err);
      setAiExplanation('Failed to load explanation. Please try again.');
    } finally {
      setIsStreaming(false);
    }
  };

  if (!node) return null;

  const CategoryIcon = categoryIcons[node.category] || BookOpen;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] overflow-y-auto bg-black/60 backdrop-blur-2xl border-l border-white/[0.06]">
        <SheetHeader className="mb-6 mt-4">
          <SheetTitle className="text-2xl font-bold tracking-[-0.02em] text-foreground">
            {node.label}
          </SheetTitle>
          <SheetDescription className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge variant="secondary" className="flex items-center gap-1 bg-secondary text-secondary-foreground">
              <CategoryIcon className="w-3 h-3" />
              <span className="capitalize">{node.category}</span>
            </Badge>
            <Badge variant="outline" className={priorityColors[node.priority] || priorityColors.medium}>
              <span className="capitalize">{node.priority}</span> Priority
            </Badge>
            <Badge variant="outline" className="text-muted-foreground border-border">
              {node.time_allocation}
            </Badge>
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold tracking-[-0.02em] text-foreground">Overview</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              {node.description}
            </p>
            
            <button 
              onClick={handleExplain}
              disabled={isStreaming}
              className="mt-4 flex items-center gap-2 text-sm text-white/80 hover:text-white bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] px-3 py-1.5 rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ✨ Explain Concept
            </button>
            
            {(isStreaming || aiExplanation) && (
              <div className="mt-3 p-4 bg-white/[0.02] border border-white/[0.08] rounded-xl text-[13px] leading-relaxed text-zinc-300">
                {aiExplanation}
                {isStreaming && !aiExplanation && (
                  <span className="animate-pulse">Thinking...</span>
                )}
                {isStreaming && aiExplanation && (
                  <span className="inline-block w-1.5 h-4 ml-1 bg-white/60 animate-pulse align-middle" />
                )}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold tracking-[-0.02em] text-foreground">Curated Resources</h3>
            {node.resources && node.resources.length > 0 ? (
              <div className="grid gap-3">
                {node.resources.map((resource, idx) => (
                  <motion.a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={idx}
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all rounded-2xl shadow-sm"
                  >
                    <div className="p-2 rounded-lg bg-background border shadow-sm flex-shrink-0">
                      {getResourceIcon(resource.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground truncate block">
                        {resource.title}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize mt-0.5">
                        {resource.type}
                      </p>
                    </div>
                  </motion.a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic bg-muted/30 p-4 rounded-lg text-center border border-dashed">
                No curated resources provided for this node.
              </p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold tracking-[-0.02em] text-foreground">Video Tutorials</h3>
              {node.youtube_videos && (
                <Badge variant="outline" className="text-[10px] text-muted-foreground">
                  Cached
                </Badge>
              )}
            </div>

            {loading && (
              <div className="grid gap-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="aspect-video w-full rounded-xl bg-muted/40 animate-pulse" />
                ))}
              </div>
            )}

            {!loading && error && (
              <div className="p-4 rounded-xl border border-dashed border-border bg-muted/30 text-center space-y-2">
                <p className="text-sm text-muted-foreground">{error}</p>
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(node.label + ' tutorial')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <Video className="w-4 h-4" /> Search on YouTube
                </a>
              </div>
            )}

            {!loading && !error && videos.length > 0 && (
              <div className="grid gap-4">
              {videos.filter((v) => /^[a-zA-Z0-9_-]{11}$/.test(v.videoId)).map((v) => (
                  <motion.div
                    key={v.videoId}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="overflow-hidden bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all rounded-2xl shadow-sm"
                  >
                    <div className="relative w-full aspect-video rounded-t-2xl overflow-hidden bg-black/20">
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${v.videoId}?rel=0`}
                        title={v.title}
                        loading="lazy"
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full border-0"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium line-clamp-2 text-foreground">{v.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{v.channelTitle}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {!loading && !error && videos.length === 0 && (
              <p className="text-sm text-muted-foreground italic bg-muted/30 p-4 rounded-lg text-center border border-dashed">
                No video tutorials found.
              </p>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
