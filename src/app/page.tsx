'use client';

import { useState, useEffect } from 'react';
import { GeneratorForm } from '@/components/generator-form';
import { RoadmapCanvas } from '@/components/roadmap-canvas';
import { SavedRoadmaps } from '@/components/saved-roadmaps';
import type { RoadmapData } from '@/components/roadmap-canvas';
import { motion } from 'framer-motion';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ErrorBoundary } from '@/components/error-boundary';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { Sparkles, ArrowRight } from 'lucide-react';

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
        <SheetContent side="right" className="w-full sm:w-[400px] md:w-[540px] bg-surface border-outline-variant p-0">
          <SheetHeader className="p-6 pb-2 border-b border-outline-variant">
            <SheetTitle className="text-on-surface">My Roadmaps</SheetTitle>
          </SheetHeader>
          <div className="h-[calc(100svh-80px)] overflow-y-auto">
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
          <section className="w-full relative overflow-hidden bg-background">
            {/* Subtle M3 Grid Pattern Background */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(var(--color-on-surface) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
            
            <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-20 md:py-32 flex flex-col items-center text-center">
              {/* Pill badge */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative h-8 px-4 rounded-full bg-surface-container border border-outline-variant flex items-center gap-2 mb-8"
              >
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-medium text-on-surface-variant">AI-Powered Learning Paths</span>
              </motion.div>

              {/* H1 — Display type */}
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1] mb-6 max-w-4xl mx-auto text-on-surface"
              >
                EduSetu. <span className="text-primary">Every goal deserves a clear path.</span>
              </motion.h1>

              {/* Subhead */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-base md:text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed mb-16 text-balance"
              >
                Where do you want to learn next? Whether you&apos;re navigating a school syllabus, cracking a competitive exam, or mastering a new skill, we dynamically map the exact steps to get you there.
              </motion.p>
              
              {/* Generator Form */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="w-full relative"
              >
                <GeneratorForm onGenerate={handleGenerate} isLoading={isLoading} />
                {error && <p className="text-error mt-4 text-center text-sm font-medium">{error}</p>}
              </motion.div>
            </div>
          </section>

          {/* Target Audience Section */}
          <section className="w-full max-w-5xl px-6 py-20 border-t border-outline-variant">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-on-surface mb-4">Who is EduSetu for?</h2>
              <p className="text-on-surface-variant max-w-2xl mx-auto">Designed for learners aged 13 and above, EduSetu adapts to your specific educational needs.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'School Students', desc: 'Navigate complex syllabuses with step-by-step clarity. Perfect for breaking down large subjects into manageable daily goals.' },
                { title: 'Exam Aspirants', desc: 'Crack competitive exams like JEE, NEET, or UPSC with structured timelines and curated, high-quality resources.' },
                { title: 'Skill Builders', desc: 'Self-taught developers, designers, and professionals looking to master a new skill with industry-standard roadmaps.' },
              ].map((card) => (
                <SpotlightCard key={card.title} className="p-6">
                  <h3 className="text-xl font-semibold text-on-surface mb-3 relative z-10">{card.title}</h3>
                  <p className="text-on-surface-muted text-sm leading-relaxed relative z-10">{card.desc}</p>
                </SpotlightCard>
              ))}
            </div>
          </section>

          {/* About Us Section */}
          <section className="w-full max-w-5xl px-6 py-20 mb-20 border-t border-outline-variant">
            <SpotlightCard className="p-8 md:p-12 shadow-card" spotlightColor="rgba(255, 255, 255, 0.08)">
              <div className="relative z-10">
                <h2 className="text-3xl font-bold text-on-surface mb-6">Why EduSetu?</h2>
                <p className="text-on-surface-variant leading-relaxed mb-8 max-w-3xl text-lg">
                  A personal mission to make learning less overwhelming, built by a student who felt it firsthand. EduSetu bridges the gap between ambition and execution by giving you a clear, actionable map for any learning goal.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://krrish-portfolio-six.vercel.app/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-full h-11 px-6 font-medium text-on-primary bg-primary hover:bg-primary-hover shadow-e1 transition-all duration-150"
                  >
                    Creator Portfolio
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href="mailto:dewangankrrish50@gmail.com"
                    className="flex items-center gap-2 bg-surface-container border border-outline-variant rounded-full h-11 px-6 font-medium text-on-surface hover:bg-surface-high transition-all duration-150"
                  >
                    Contact via Email
                  </a>
                </div>
              </div>
            </SpotlightCard>
          </section>
        </div>
      ) : (
        <div className="w-full h-[calc(100svh-var(--header-h))] relative overflow-hidden">
          <motion.button 
            whileTap={{ scale: 0.98 }}
            onClick={() => setRoadmapData(null)}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-full h-11 px-6 font-medium text-on-primary bg-primary hover:bg-primary-hover shadow-e2 transition-all duration-150 tracking-[-0.01em]"
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
