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
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link 
              href="/dashboard"
              className="flex items-center justify-center gap-2 rounded-full h-12 px-8 font-semibold text-on-primary bg-primary hover:bg-primary-hover shadow-e2 transition-all duration-150"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
