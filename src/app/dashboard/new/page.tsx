'use client';

import { useState, Suspense } from 'react';
import { GeneratorForm } from '@/components/generator-form';
import { RoadmapCanvas } from '@/components/roadmap-canvas';
import type { RoadmapData } from '@/components/roadmap-canvas';
import { ErrorBoundary } from '@/components/error-boundary';
import { motion } from 'framer-motion';

export default function NewRoadmapPage() {
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (formData: Record<string, unknown>) => {
    setIsGenerating(true);
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
      setIsGenerating(false);
    }
  };

  if (roadmapData) {
    return (
      <div className="w-full h-[calc(100svh-var(--header-h))] relative overflow-hidden -mt-8">
        <motion.button 
          whileTap={{ scale: 0.98 }}
          onClick={() => setRoadmapData(null)}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-full h-11 px-6 font-medium text-on-primary bg-primary hover:bg-primary-hover shadow-e2 transition-all duration-150 tracking-[-0.01em]"
        >
          Create Another
        </motion.button>
        <ErrorBoundary>
          <RoadmapCanvas data={roadmapData} />
        </ErrorBoundary>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto w-full">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-on-surface">Create New Roadmap</h1>
        <p className="text-on-surface-variant mt-2">Let our AI build the perfect learning path for you.</p>
      </div>
      <Suspense fallback={null}>
        <GeneratorForm onGenerate={handleGenerate} isLoading={isGenerating} />
      </Suspense>
      {error && <p className="text-error mt-4 text-sm font-medium text-center">{error}</p>}
    </div>
  );
}
