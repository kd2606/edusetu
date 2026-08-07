'use client';

import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Compass, Sparkles, BookOpen, Terminal, GraduationCap } from 'lucide-react';

const SUGGESTIONS = [
  { id: 1, title: 'JEE Main - Physics', desc: 'Complete 11th & 12th physics roadmap with HC Verma refs.', icon: BookOpen },
  { id: 2, title: 'UPSC Prelims', desc: 'History, Geography, Polity map with NCERT mappings.', icon: GraduationCap },
  { id: 3, title: 'Full Stack React', desc: 'React, Next.js, and Supabase for modern web dev.', icon: Terminal },
  { id: 4, title: 'Class 10th Math', desc: 'CBSE Chapter-wise breakdown with NCERT formulas.', icon: BookOpen },
  { id: 5, title: 'Data Structures & Algos', desc: 'Master arrays, trees, and dynamic programming for interviews.', icon: Terminal },
];

export default function ExplorePage() {
  const router = useRouter();

  const handleSelect = (title: string) => {
    // Navigate to dashboard and pass the prompt via query param
    router.push(`/dashboard?domain=${encodeURIComponent(title)}`);
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto w-full space-y-8 h-full">
      <div className="flex items-center gap-3">
        <Compass className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-on-surface">Explore</h1>
          <p className="text-on-surface-variant mt-1">Start your next journey with highly-optimized AI prompts.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SUGGESTIONS.map((s) => {
          const Icon = s.icon;
          return (
            <Card 
              key={s.id} 
              onClick={() => handleSelect(s.title)}
              className="p-6 cursor-pointer hover:bg-surface-high transition-all duration-200 border-outline-variant shadow-sm hover:shadow-e2 group flex flex-col items-start text-left"
            >
              <div className="p-3 bg-primary-container text-on-primary-container rounded-xl mb-4 group-hover:scale-110 transition-transform">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg text-on-surface mb-2 flex items-center gap-2">
                {s.title}
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-6 flex-1">
                {s.desc}
              </p>
              <div className="flex items-center text-xs font-medium text-primary mt-auto">
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                Generate Roadmap
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
