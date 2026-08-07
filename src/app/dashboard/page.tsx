'use client';

import { SavedRoadmaps } from '@/components/saved-roadmaps';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Trophy, Flame } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[hsl(var(--text-primary))]">Dashboard</h1>
        <p className="text-[hsl(var(--text-secondary))] mt-2">Welcome back! Here is your learning progress.</p>
      </div>

      {/* Analytics Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-[hsl(var(--bg-glass)/0.4)] backdrop-blur-md border-[hsl(var(--stroke-subtle))] shadow-rim">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[hsl(var(--text-secondary))]">Current Streak</CardTitle>
            <Flame className="w-4 h-4 text-[hsl(var(--warning))]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[hsl(var(--text-primary))]">3 Days</div>
          </CardContent>
        </Card>
        
        <Card className="bg-[hsl(var(--bg-glass)/0.4)] backdrop-blur-md border-[hsl(var(--stroke-subtle))] shadow-rim">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[hsl(var(--text-secondary))]">Total XP</CardTitle>
            <Trophy className="w-4 h-4 text-[hsl(var(--accent-bright))]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[hsl(var(--text-primary))]">1,250</div>
            <p className="text-xs text-[hsl(var(--text-muted))] mt-1">Level 2: Scholar</p>
          </CardContent>
        </Card>

        <Card className="bg-[hsl(var(--bg-glass)/0.4)] backdrop-blur-md border-[hsl(var(--stroke-subtle))] shadow-rim">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[hsl(var(--text-secondary))]">Nodes Completed</CardTitle>
            <Target className="w-4 h-4 text-[hsl(var(--success))]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[hsl(var(--text-primary))]">12</div>
          </CardContent>
        </Card>
      </div>

      {/* Roadmaps */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight text-[hsl(var(--text-primary))] mb-6">Your Roadmaps</h2>
        <SavedRoadmaps onSelectRoadmap={(data) => {
          // Open roadmap in main view (will be handled by a link or state later)
          window.location.href = `/?roadmap=${data.id}`;
        }} />
      </div>
    </div>
  );
}
