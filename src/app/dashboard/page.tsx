'use client';

import { SavedRoadmaps } from '@/components/saved-roadmaps';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Trophy, Flame } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
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
            <div className="text-2xl font-bold text-on-surface">3 Days</div>
          </CardContent>
        </Card>
        
        <Card className="bg-surface border border-outline-variant shadow-e1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-on-surface-variant">Total XP</CardTitle>
            <Trophy className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-on-surface">1,250</div>
            <p className="text-xs text-on-surface-muted mt-1">Level 2: Scholar</p>
          </CardContent>
        </Card>

        <Card className="bg-surface border border-outline-variant shadow-e1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-on-surface-variant">Nodes Completed</CardTitle>
            <Target className="w-4 h-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-on-surface">12</div>
          </CardContent>
        </Card>
      </div>

      {/* Roadmaps */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight text-on-surface mb-6">Your Roadmaps</h2>
        <SavedRoadmaps onSelectRoadmap={(data) => {
          // Open roadmap in main view (will be handled by a link or state later)
          window.location.href = `/?roadmap=${data.id}`;
        }} />
      </div>
    </div>
  );
}
