'use client';

import { cn } from '@/lib/utils';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';

interface HorizonGlowProps {
  intensity?: 'full' | 'subtle';
  className?: string;
}

export function HorizonGlow({ intensity = 'full', className }: HorizonGlowProps) {
  const isFull = intensity === 'full';
  const mouseX = useSpring(0, { stiffness: 100, damping: 50 });
  
  // Create reactive transforms for parallax layers
  const parallaxTilt = useTransform(mouseX, [-1, 1], [-20, 20]);
  const parallaxBloom = useTransform(mouseX, [-1, 1], [-40, 40]);
  const parallaxShaft = useTransform(mouseX, [-1, 1], [-80, 80]);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseX.set(normalizedX);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX]);

  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden select-none',
        className
      )}
      data-horizon-glow
    >
      {/* Layer 1 — Vignette base (very dark) */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% -20%, hsl(222 40% 6%), hsl(var(--bg-base)) 70%)',
        }}
      />

      {/* Layer 2 — The Horizon Arc (Flat ellipse instead of a giant sphere) */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          width: '200vw',
          height: '40vh',
          top: isFull ? '60%' : '75%',
          borderRadius: '100% 100% 0 0',
          background: 'hsl(var(--bg-base))',
          boxShadow: `
            inset 0 4px 15px hsl(var(--accent-bright) / 0.8),
            0 -10px 100px 20px hsl(var(--accent) / ${isFull ? '0.5' : '0.2'}),
            0 -40px 300px 80px hsl(var(--accent-deep) / ${isFull ? '0.3' : '0.1'})
          `,
          x: parallaxTilt,
        }}
      />

      {/* Layer 3 — Atmospheric bloom (Wide soft wash of light) */}
      <motion.div
        className={cn(
          'absolute left-1/2 -translate-x-1/2 mix-blend-screen motion-safe:animate-breathe',
          isFull ? 'blur-[100px] opacity-100' : 'blur-[60px] opacity-50'
        )}
        style={{
          width: '80vw',
          height: '25vh',
          top: isFull ? '55%' : '70%',
          background: `radial-gradient(ellipse at top, hsl(var(--accent-bright) / ${isFull ? '0.6' : '0.2'}), transparent 70%)`,
          x: parallaxBloom,
        }}
      />

      {/* Layer 4 — Volumetric Light Shaft (Soft conic gradient instead of sharp polygon) */}
      {isFull && (
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 mix-blend-screen motion-safe:animate-breathe"
          style={{
            width: '100vw',
            height: '100vh',
            top: '0%',
            background: 'conic-gradient(from 180deg at 50% 100%, transparent 40%, hsl(var(--accent-bright) / 0.15) 50%, transparent 60%)',
            maskImage: 'linear-gradient(to top, black 20%, transparent 80%)',
            x: parallaxShaft,
          }}
        />
      )}

      {/* Layer 5 — Starfield */}
      <div
        className={cn(
          'absolute inset-0',
          isFull ? 'opacity-[0.3]' : 'opacity-[0.15]'
        )}
        style={{
          backgroundImage: `
            radial-gradient(1.5px 1.5px at 20% 30%, hsl(var(--text-primary)) 0.5px, transparent 0),
            radial-gradient(1px 1px at 70% 15%, hsl(var(--text-primary)) 0.4px, transparent 0),
            radial-gradient(1px 1px at 40% 60%, hsl(var(--text-primary)) 0.3px, transparent 0),
            radial-gradient(1.2px 1.2px at 85% 45%, hsl(var(--text-primary)) 0.4px, transparent 0),
            radial-gradient(0.8px 0.8px at 15% 80%, hsl(var(--text-primary)) 0.3px, transparent 0),
            radial-gradient(1px 1px at 55% 85%, hsl(var(--text-primary)) 0.4px, transparent 0)
          `,
          backgroundSize: '350px 350px, 250px 250px, 400px 400px, 300px 300px, 450px 450px, 320px 320px',
          maskImage: 'radial-gradient(circle at 50% 50%, black 20%, transparent 80%)',
        }}
      />
    </div>
  );
}
