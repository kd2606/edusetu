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
import { RoadmapNodeData, CachedYouTubeVideo } from '@/types/roadmap';
import { BookOpen, Target, Dumbbell, Rocket, Video, FileText, Link as LinkIcon, ArrowUp, MessageSquare, ExternalLink, ChevronDown, Check, BadgeCheck, Share2 } from 'lucide-react';
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
  critical: 'bg-error-container text-error hover:bg-error-container',
  high: 'bg-progress-container text-progress hover:bg-progress-container',
  medium: 'bg-primary-container text-primary hover:bg-primary-container',
};

const getResourceIcon = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes('video') || t.includes('youtube')) return <Video className="w-5 h-5 text-error" />;
  if (t.includes('article') || t.includes('doc') || t.includes('book')) return <FileText className="w-5 h-5 text-primary" />;
  return <LinkIcon className="w-5 h-5 text-on-surface-muted" />;
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
      <SheetContent side="right" className="w-[400px] sm:w-[540px] overflow-y-auto bg-surface backdrop-blur-2xl border-l border-outline-variant">
        <SheetHeader className="mb-6 mt-4">
          <SheetTitle className="text-2xl font-bold tracking-[-0.02em] text-foreground flex flex-wrap items-center gap-3">
            {node.label}
            <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full whitespace-nowrap uppercase">
              <BadgeCheck className="w-3.5 h-3.5" />
              Industry Verified
            </div>
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

        {node.is_boss_node ? (
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-foreground">
                Capstone Project: {node.proof_project?.title || "Project"}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {node.proof_project?.description || node.description}
              </p>
            </div>
            
            <div className="p-5 bg-surface-container border border-outline-variant rounded-xl shadow-sm space-y-4">
              <h4 className="font-semibold text-sm">Submit your solution</h4>
              <input 
                type="url"
                placeholder="https://github.com/username/project"
                className="w-full bg-background border border-outline-variant rounded-lg h-10 px-3 text-sm focus:outline-none focus:border-primary"
              />
              <button 
                onClick={() => {
                  node.onToggleComplete?.(node.id, !node.completed);
                  onOpenChange(false);
                }}
                className="w-full flex justify-center items-center gap-2 h-10 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                <Check className="w-4 h-4" />
                {node.completed ? "Mark as Incomplete" : "Mark as Completed"}
              </button>

              <button
                onClick={() => {
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I just crushed the ${node.proof_project?.title || node.label} capstone project on EduSetu! 🚀`)}`, '_blank');
                }}
                className="w-full flex justify-center items-center gap-2 h-10 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 hover:from-blue-500/20 hover:to-indigo-500/20 rounded-lg font-medium transition-all"
              >
                <Share2 className="w-4 h-4" />
                Share Milestone to Reddit/X
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* TL;DR Overview */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold tracking-[-0.02em] text-foreground">TL;DR Overview</h3>
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
                <p className="text-on-surface leading-relaxed text-sm">
                  {node.description}
                </p>
              </div>
              
              <button 
                onClick={handleExplain}
                disabled={isStreaming}
                className="mt-4 flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface bg-surface-container border border-outline-variant hover:bg-surface-high px-3 py-1.5 rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-rim"
              >
                ✨ Explain Concept
              </button>
              
              {(isStreaming || aiExplanation) && (
                <div className="mt-3 p-4 bg-surface border border-outline rounded-xl text-[13px] leading-relaxed text-on-surface-variant shadow-rim">
                  {aiExplanation}
                  {isStreaming && !aiExplanation && (
                    <span className="animate-pulse">Thinking...</span>
                  )}
                  {isStreaming && aiExplanation && (
                    <span className="inline-block w-1.5 h-4 ml-1 bg-accent/60 animate-pulse align-middle" />
                  )}
                </div>
              )}
            </div>

            {/* Flashcards */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold tracking-[-0.02em] text-foreground">Flashcards</h3>
              <div className="border border-outline-variant rounded-xl overflow-hidden bg-surface shadow-sm">
                <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-surface-high transition-colors">
                  <p className="text-sm font-medium">What is the primary use case of {node.label}?</p>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Community Consensus / Reddit Threads */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold tracking-[-0.02em] text-foreground">Community Consensus</h3>
              <div className="grid gap-3">
                {[
                  { id: 1, title: `Is learning ${node.label} still worth it in 2026?`, upvotes: "1.4k", sub: "r/learnprogramming" },
                  { id: 2, title: `The 'Aha' moment when ${node.label} finally clicked for me`, upvotes: "850", sub: "r/reactjs" }
                ].map(thread => (
                  <div key={thread.id} className="flex gap-3 p-4 bg-surface border border-outline-variant rounded-xl shadow-rim hover:border-outline transition-colors cursor-pointer group">
                    <div className="flex flex-col items-center justify-center gap-1 text-on-surface-variant min-w-[40px]">
                      <ArrowUp className="w-5 h-5 group-hover:text-primary transition-colors" />
                      <span className="text-xs font-bold">{thread.upvotes}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground mb-1 group-hover:text-primary transition-colors">
                        {thread.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-medium">{thread.sub}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> 42</span>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors opacity-50 group-hover:opacity-100" />
                  </div>
                ))}
              </div>
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
                      className="flex items-center gap-4 p-4 bg-surface border border-outline-variant hover:border-outline transition-all rounded-lg shadow-rim"
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
                      className="overflow-hidden bg-surface border border-outline-variant hover:border-outline transition-all rounded-lg shadow-rim"
                    >
                      <div className="relative w-full aspect-video rounded-t-lg overflow-hidden bg-background">
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
        )}
      </SheetContent>
    </Sheet>
  );
}
