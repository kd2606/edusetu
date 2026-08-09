'use client';

import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full relative overflow-hidden bg-background min-h-[calc(100svh-80px)] flex flex-col justify-center">
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
            className="text-base md:text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed mb-12 text-balance"
          >
            A personal mission to make learning less overwhelming, built for Indian students and professionals. Whether you&apos;re navigating CBSE, cracking JEE/UPSC, or mastering a new skill, we dynamically map the exact steps and curate the best local resources (NCERT, YouTube) to get you there.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center gap-4 mb-24"
          >
            <Link 
              href="/dashboard"
              className="flex items-center justify-center gap-2 rounded-full h-12 px-8 font-semibold text-on-primary bg-primary hover:bg-primary-hover shadow-e2 transition-all duration-150"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* About Section - Integrated into Hero */}
          <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center mt-12 pt-12 border-t border-outline-variant/50">
            <motion.h2 
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-on-surface mb-6"
            >
              About EduSetu
            </motion.h2>
          
          <motion.h3 
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl md:text-2xl font-semibold text-primary mb-8"
          >
            Every Indian student deserves a clear path to their goals.
          </motion.h3>

          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6 text-base md:text-lg text-on-surface-variant leading-relaxed text-left max-w-3xl"
          >
            <p>
              EduSetu is an AI-powered learning roadmap generator built for India, by Indians. Whether you&apos;re preparing for CBSE Boards, JEE, NEET, UPSC, or building tech skills like React Native, EduSetu creates a <strong className="text-on-surface">personalized, day-by-day learning plan</strong> tailored to your goals.
            </p>
            <p>
              EduSetu curates resources from <strong className="text-on-surface">trusted Indian textbooks and top educational creators</strong> aligned with NCERT, state boards, and competitive exam patterns. Our platform integrates <strong className="text-on-surface">free gamification</strong> (XP, streaks) to keep you motivated, and our <strong className="text-on-surface">&quot;I&apos;m Stuck&quot; AI Assistant</strong> breaks down complex concepts into bite-sized analogies—right inside your roadmap, no switching apps needed.
            </p>
            <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant mt-8">
              <p className="font-semibold text-on-surface mb-2">Mission:</p>
              <p>Bridge the gap between ambition and achievement for 200M+ Indian learners.</p>
            </div>
            <p className="text-sm text-on-surface-variant/70 italic mt-8 text-center">
              Disclaimer: EduSetu is not affiliated with any educational institute or brand. All trademarks belong to their respective owners.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
