'use client';

import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);
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
            className="flex flex-col sm:flex-row items-center gap-4 mb-24 min-h-[48px]"
          >
            {loading ? (
              <div className="h-12 w-48 animate-pulse bg-surface-container rounded-full" />
            ) : session ? (
              <Link 
                href="/dashboard"
                className="flex items-center justify-center gap-2 rounded-full h-12 px-8 font-semibold text-on-primary bg-primary hover:bg-primary-hover shadow-e2 transition-all duration-150"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/login"
                  className="flex items-center justify-center gap-2 rounded-full h-12 px-8 font-semibold text-primary bg-transparent border border-outline-variant hover:bg-surface-container transition-all duration-150"
                >
                  Log In
                </Link>
                <Link 
                  href="/login"
                  className="flex items-center justify-center gap-2 rounded-full h-12 px-8 font-semibold text-on-primary bg-primary hover:bg-primary-hover shadow-e2 transition-all duration-150"
                >
                  Sign Up
                  <UserPlus className="w-4 h-4" />
                </Link>
              </div>
            )}
          </motion.div>

          {/* About Section - Integrated into Hero */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
              hidden: { opacity: 0 }
            }}
            className="w-full max-w-5xl mx-auto flex flex-col items-center mt-8 pt-8"
          >
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-on-surface mb-4 tracking-tight">
                About EduSetu
              </h2>
              <h3 className="text-lg md:text-xl font-medium text-primary">
                Every Indian student deserves a clear path to their goals.
              </h3>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left mb-8">
              <motion.div 
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-surface-container-lowest border border-outline-variant/50 p-8 rounded-3xl shadow-sm"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-xl font-bold text-on-surface mb-3">Built for India</h4>
                <p className="text-on-surface-variant leading-relaxed">
                  EduSetu is an AI-powered learning roadmap generator built for India, by Indians. Whether you&apos;re preparing for CBSE Boards, JEE, NEET, UPSC, or building tech skills like React Native, EduSetu creates a <strong className="text-on-surface font-semibold">personalized, day-by-day learning plan</strong> tailored to your goals.
                </p>
              </motion.div>

              <motion.div 
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-surface-container-lowest border border-outline-variant/50 p-8 rounded-3xl shadow-sm"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-xl font-bold text-on-surface mb-3">Curated Resources</h4>
                <p className="text-on-surface-variant leading-relaxed">
                  EduSetu curates resources from <strong className="text-on-surface font-semibold">trusted Indian textbooks and top educational creators</strong> aligned with NCERT, state boards, and competitive exam patterns.
                </p>
              </motion.div>

              <motion.div 
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-surface-container-lowest border border-outline-variant/50 p-8 rounded-3xl shadow-sm"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-xl font-bold text-on-surface mb-3">Gamified & AI-Assisted</h4>
                <p className="text-on-surface-variant leading-relaxed">
                  Earn <strong className="text-on-surface font-semibold">XP &amp; Streaks</strong> to stay consistent and beat procrastination. Stuck on a topic? Our <strong className="text-on-surface font-semibold">&quot;Explain like I&apos;m 5&quot; AI Assistant</strong> breaks down complex concepts instantly.
                </p>
              </motion.div>
            </div>

            <motion.div 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              className="w-full bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 p-8 rounded-3xl shadow-sm text-center mb-12 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Sparkles className="w-24 h-24 text-primary" />
              </div>
              <h4 className="text-xl font-bold text-on-surface mb-3 relative z-10">Our Mission</h4>
              <p className="text-lg text-on-surface-variant max-w-2xl mx-auto relative z-10">
                Bridge the gap between ambition and achievement for <strong className="text-primary font-bold">200M+ Indian learners.</strong>
              </p>
            </motion.div>

            <motion.p 
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              className="text-xs text-on-surface-variant/50 italic text-center max-w-2xl"
            >
              Disclaimer: EduSetu is not affiliated with any educational institute or brand. All trademarks belong to their respective owners.
            </motion.p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
