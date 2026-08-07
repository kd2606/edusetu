'use client';

import { SavedRoadmaps } from '@/components/saved-roadmaps';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Trophy, Flame } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getProfile } from '@/app/actions';
import { getLevelFromXP } from '@/lib/utils';
import { RoadmapCanvas } from '@/components/roadmap-canvas';
import type { RoadmapData } from '@/components/roadmap-canvas';
import { ErrorBoundary } from '@/components/error-boundary';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const [profile, setProfile] = useState<{ xp: number, current_streak: number, nodes_completed: number } | null>(null);
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);

  useEffect(() => {
    getProfile().then(data => {
      if (data) setProfile(data);
    });
  }, []);

  const levelInfo = profile ? getLevelFromXP(profile.xp) : { level: 1, title: 'Novice' };

  if (roadmapData) {
    return (
      <div className="w-full h-[calc(100svh-var(--header-h))] relative overflow-hidden -mt-8">
        <motion.button 
          whileTap={{ scale: 0.98 }}
          onClick={() => setRoadmapData(null)}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-full h-11 px-6 font-medium text-on-primary bg-primary hover:bg-primary-hover shadow-e2 transition-all duration-150 tracking-[-0.01em]"
        >
          Back to Dashboard
        </motion.button>
        <ErrorBoundary>
          <RoadmapCanvas data={roadmapData} />
        </ErrorBoundary>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-12 max-w-6xl mx-auto w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-on-surface">Dashboard</h1>
        <p className="text-on-surface-variant mt-2">Welcome back! Here is your learning progress.</p>
      </div>

      {/* Analytics Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-surface border border-outline-variant shadow-e1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-on-surface-variant">Current Streak</CardTitle>
            <Flame className="w-4 h-4 text-progress" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-on-surface">{profile ? profile.current_streak : 0} Days</div>
          </CardContent>
        </Card>
        
        <Card className="bg-surface border border-outline-variant shadow-e1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-on-surface-variant">Total XP</CardTitle>
            <Trophy className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-on-surface">{profile ? profile.xp.toLocaleString() : 0}</div>
            <p className="text-xs text-on-surface-muted mt-1">Level {levelInfo.level}: {levelInfo.title}</p>
          </CardContent>
        </Card>

        <Card className="bg-surface border border-outline-variant shadow-e1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-on-surface-variant">Nodes Completed</CardTitle>
            <Target className="w-4 h-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-on-surface">{profile ? profile.nodes_completed : 0}</div>
          </CardContent>
        </Card>
      </div>



      {/* Roadmaps */}
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-on-surface mb-6">Your Roadmaps</h2>
        <div className="bg-surface border border-outline-variant rounded-xl max-h-[400px] overflow-y-auto">
          <SavedRoadmaps onSelectRoadmap={(data) => {
            setRoadmapData(data);
          }} />
        </div>
      </div>
    </div>
  );
}
