'use client';

import { useState } from 'react';
import { GeneratorForm } from '@/components/generator-form';
import { RoadmapCanvas } from '@/components/roadmap-canvas';
import { SavedRoadmaps } from '@/components/saved-roadmaps';
import type { RoadmapData } from '@/components/roadmap-canvas';
import { motion } from 'framer-motion';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useEffect } from 'react';

export default function Home() {
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    const handleOpenHistory = () => setIsHistoryOpen(true);
    document.addEventListener('open-history', handleOpenHistory);
    return () => document.removeEventListener('open-history', handleOpenHistory);
  }, []);

  const handleGenerate = async (formData: Record<string, unknown>) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (!res.ok) {
        throw new Error('Failed to generate roadmap');
      }
      
      const data = await res.json();
      setRoadmapData(data);
    } catch (err: unknown) {
      setError((err as Error).message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="w-full h-screen relative flex">
      <Sheet open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <SheetContent side="right" className="w-[400px] sm:w-[540px] bg-[#0a0a0a] border-white/[0.1] p-0">
          <SheetHeader className="p-6 pb-2 border-b border-white/[0.1]">
            <SheetTitle className="text-white">My Roadmaps</SheetTitle>
          </SheetHeader>
          <div className="h-[calc(100vh-80px)] overflow-y-auto">
            <SavedRoadmaps onSelectRoadmap={(data) => {
              setRoadmapData(data);
              setIsHistoryOpen(false);
            }} />
          </div>
        </SheetContent>
      </Sheet>

      <section className="flex-1 h-screen relative overflow-y-auto overflow-x-hidden">
        {!roadmapData ? (
          <div className="w-full px-4 flex flex-col items-center justify-center min-h-full py-12">
            <div className="text-center mt-20 mb-16">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                <span className="text-white">EduSetu.</span> <span className="bg-gradient-to-r from-zinc-200 to-zinc-500 bg-clip-text text-transparent">Every goal deserves a clear path.</span>
              </h1>
              <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                Where do you want to learn next? Whether you&apos;re navigating a school syllabus, cracking a competitive exam, or mastering a new skill, we dynamically map the exact steps to get you there.
              </p>
            </div>
            <GeneratorForm onGenerate={handleGenerate} isLoading={isLoading} />
            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
          </div>
        ) : (
          <div className="w-full h-full relative">
            <motion.button 
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setRoadmapData(null)}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white text-black px-6 py-2 rounded-lg shadow-sm font-medium hover:bg-white/90 transition-all duration-150 tracking-[-0.01em]"
            >
              Start New Roadmap
            </motion.button>
            <RoadmapCanvas data={roadmapData} />
          </div>
        )}
      </section>
    </main>
  );
}
