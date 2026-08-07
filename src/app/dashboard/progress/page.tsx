'use client';

import { useEffect, useState } from 'react';
import { getProfile } from '@/app/actions';
import { getLevelFromXP } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Flame, Target, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProgressPage() {
  const [profile, setProfile] = useState<{ xp: number, current_streak: number, nodes_completed: number, last_activity_date?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getProfile().then(data => {
      if (data) setProfile(data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!profile) return null;

  const levelInfo = getLevelFromXP(profile.xp);
  
  // Calculate progress to next level
  const baseXP = (levelInfo.level - 1) * 300; // rough formula from getLevelFromXP
  const nextLevelXP = levelInfo.level * 300;
  const xpInCurrentLevel = profile.xp - baseXP;
  const progressPercent = Math.min(100, Math.max(0, (xpInCurrentLevel / 300) * 100));

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto w-full space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-on-surface">Your Progress</h1>
        <p className="text-on-surface-variant mt-2">Track your learning journey and level up.</p>
      </div>

      {/* Main Level Card */}
      <Card className="bg-surface border-outline-variant shadow-e2 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
          <Trophy className="w-64 h-64" />
        </div>
        <CardContent className="p-8 md:p-12 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container text-on-primary-container text-sm font-medium">
                Level {levelInfo.level}
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-on-surface">{levelInfo.title}</h2>
              <p className="text-on-surface-variant text-lg">You are {300 - xpInCurrentLevel} XP away from the next level!</p>
            </div>
            
            <div className="w-full md:w-1/2">
              <div className="flex justify-between text-sm font-medium mb-2 text-on-surface-variant">
                <span>{profile.xp.toLocaleString()} XP</span>
                <span>{nextLevelXP.toLocaleString()} XP</span>
              </div>
              <div className="h-4 w-full bg-surface-highest rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-primary rounded-full relative"
                >
                  <div className="absolute inset-0 bg-white/20" style={{ backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent)', backgroundSize: '1rem 1rem' }} />
                </motion.div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-progress/10 text-progress rounded-xl">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Learning Streak</h3>
              <p className="text-sm text-on-surface-variant">Consistent days</p>
            </div>
          </div>
          <div className="text-5xl font-bold tracking-tighter text-on-surface mt-6">{profile.current_streak} <span className="text-2xl text-on-surface-muted font-normal tracking-normal">days</span></div>
          {profile.last_activity_date && (
            <p className="text-sm text-on-surface-variant mt-4">Last active: {new Date(profile.last_activity_date).toLocaleDateString()}</p>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-success/10 text-success rounded-xl">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Nodes Conquered</h3>
              <p className="text-sm text-on-surface-variant">Topics mastered</p>
            </div>
          </div>
          <div className="text-5xl font-bold tracking-tighter text-on-surface mt-6">{profile.nodes_completed} <span className="text-2xl text-on-surface-muted font-normal tracking-normal">nodes</span></div>
          <p className="text-sm text-on-surface-variant mt-4">+50 XP per node completion</p>
        </Card>
      </div>
    </div>
  );
}
