'use client';

import { SavedRoadmaps } from '@/components/saved-roadmaps';
export default function RoadmapsPage() {
  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto w-full space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-on-surface">My Roadmaps</h1>
        <p className="text-on-surface-variant mt-2">View all your saved learning paths.</p>
      </div>

      <div className="bg-surface border border-outline-variant rounded-xl min-h-[500px]">
        <SavedRoadmaps />
      </div>
    </div>
  );
}
