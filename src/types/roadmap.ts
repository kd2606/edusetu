import { Node } from '@xyflow/react';

export type CachedYouTubeVideo = {
  videoId: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
};

export type RoadmapNodeData = {
  label: string;
  description: string;
  category: 'prerequisite' | 'core' | 'practice' | 'project';
  priority: 'critical' | 'high' | 'medium';
  time_allocation: string;
  completed?: boolean;
  resources?: Array<{ type: string; title: string; url: string; }>;
  id: string;
  onToggleComplete?: (id: string, completed: boolean) => void;
  youtube_videos?: {
    videos: CachedYouTubeVideo[];
    fetched_at: string;
  };
};

export type RoadmapNodeType = Node<RoadmapNodeData, 'roadmapNode'>;
