'use client';

import { useState, useEffect } from 'react';
import { GeneratorForm } from '@/components/generator-form';
import { RoadmapCanvas } from '@/components/roadmap-canvas';
import { SavedRoadmaps } from '@/components/saved-roadmaps';
import type { RoadmapData } from '@/components/roadmap-canvas';
import { motion } from 'framer-motion';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ErrorBoundary } from '@/components/error-boundary';

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
    <>
      <Sheet open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <SheetContent side="right" className="w-full sm:w-[400px] md:w-[540px] bg-background border-white/[0.1] p-0">
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

      {!roadmapData ? (
        <div className="w-full flex flex-col items-center">
          {/* Hero Section */}
          <section className="w-full max-w-5xl px-6 py-20 md:py-32 flex flex-col items-center text-center">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              <span className="text-white">EduSetu.</span> <br className="md:hidden" />
              <span className="bg-gradient-to-r from-zinc-200 to-zinc-500 bg-clip-text text-transparent">Every goal deserves a clear path.</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-12">
              Where do you want to learn next? Whether you&apos;re navigating a school syllabus, cracking a competitive exam, or mastering a new skill, we dynamically map the exact steps to get you there.
            </p>
            
            <div className="w-full max-w-3xl">
              <GeneratorForm onGenerate={handleGenerate} isLoading={isLoading} />
              {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
            </div>
          </section>

          {/* Target Audience Section */}
          <section className="w-full max-w-5xl px-6 py-20 border-t border-white/[0.05]">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Who is EduSetu for?</h2>
              <p className="text-zinc-400 max-w-2xl mx-auto">Designed for learners aged 13 and above, EduSetu adapts to your specific educational needs.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl">
                <h3 className="text-xl font-semibold text-white mb-3">School Students</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">Navigate complex syllabuses with step-by-step clarity. Perfect for breaking down large subjects into manageable daily goals.</p>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl">
                <h3 className="text-xl font-semibold text-white mb-3">Exam Aspirants</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">Crack competitive exams like JEE, NEET, or UPSC with structured timelines and curated, high-quality resources.</p>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl">
                <h3 className="text-xl font-semibold text-white mb-3">Skill Builders</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">Self-taught developers, designers, and professionals looking to master a new skill with industry-standard roadmaps.</p>
              </div>
            </div>
          </section>

          {/* About Us Section */}
          <section className="w-full max-w-5xl px-6 py-20 mb-20 border-t border-white/[0.05]">
            <div className="bg-white/[0.02] border border-white/[0.05] p-8 md:p-12 rounded-3xl relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl font-bold text-white mb-6">Why EduSetu?</h2>
                <p className="text-zinc-300 leading-relaxed mb-8 max-w-3xl text-lg">
                  A personal mission to make learning less overwhelming, built by a student who felt it firsthand. EduSetu bridges the gap between ambition and execution by giving you a clear, actionable map for any learning goal.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a href="https://krrish-portfolio-six.vercel.app/" target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-lg font-medium hover:bg-zinc-200 transition-all">
                    Creator Portfolio
                  </a>
                  <a href="mailto:dewangankrrish50@gmail.com" className="flex items-center gap-2 bg-white/[0.05] text-white border border-white/[0.1] px-5 py-2.5 rounded-lg font-medium hover:bg-white/[0.1] transition-all">
                    Contact via Email
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div className="w-full h-[calc(100vh-73px)] relative overflow-hidden">
          <motion.button 
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setRoadmapData(null)}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white text-black px-6 py-2 rounded-lg shadow-sm font-medium hover:bg-white/90 transition-all duration-150 tracking-[-0.01em]"
          >
            Start New Roadmap
          </motion.button>
          <ErrorBoundary>
            <RoadmapCanvas data={roadmapData} />
          </ErrorBoundary>
        </div>
      )}
    </>
  );
}
