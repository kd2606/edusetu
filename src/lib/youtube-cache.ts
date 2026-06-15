import type { RoadmapNodeData } from '@/components/RoadmapNode';

const TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export function isCacheValid(cache: RoadmapNodeData['youtube_videos']): boolean {
  if (!cache || !cache.videos?.length) return false;
  const age = Date.now() - new Date(cache.fetched_at).getTime();
  return age < TTL_MS;
}
