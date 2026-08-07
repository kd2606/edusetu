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
      // Normalize mouse X position to a range between -1 and 1
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
      {/* Layer 1 — Vignette base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 80% at 50% 0%, hsl(222 50% 8%) 0%, hsl(var(--bg-base)) 60%)',
        }}
      />

      {/* Layer 2 — The planet (only top ~8% visible) */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 rounded-full"
        style={{
          width: 'min(1900px, 210vw)',
          aspectRatio: '1 / 1',
          top: isFull ? '38%' : '55%',
          background: 'hsl(var(--bg-base))',
          boxShadow: `
            inset 0 2px 12px hsl(var(--accent-bright) / 0.55),
            0 0 140px 24px hsl(var(--accent) / ${isFull ? '0.40' : '0.15'}),
            0 0 400px 80px hsl(var(--accent-deep) / ${isFull ? '0.22' : '0.08'})
          `,
          x: parallaxTilt, // very slight tilt
        }}
      />

      {/* Layer 3 — Atmospheric bloom */}
      <motion.div
        className={cn(
          'absolute left-1/2 -translate-x-1/2 mix-blend-screen motion-safe:animate-breathe',
          isFull ? 'blur-[120px] opacity-100' : 'blur-[80px] opacity-50'
        )}
        style={{
          width: '60vw',
          height: '22vh',
          top: isFull ? '34%' : '51%',
          background: `hsl(var(--accent) / ${isFull ? '0.35' : '0.15'})`,
          borderRadius: '50%',
          // Parallax effect on bloom
          x: parallaxBloom,
        }}
      />

      {/* Layer 4 — Light shaft (vertical cone above arc apex) */}
      {isFull && (
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 mix-blend-screen blur-[48px] opacity-50 motion-safe:animate-breathe"
          style={{
            width: '12vw',
            height: '35vh',
            top: '5%',
            clipPath: 'polygon(35% 100%, 50% 0%, 65% 100%)',
            background:
              'linear-gradient(to top, hsl(var(--accent-bright) / 0.28), transparent 70%)',
            // Parallax effect on shaft (moves slightly opposite/more to give 3D depth)
            x: parallaxShaft,
          }}
        />
      )}

      {/* Layer 5 — Starfield */}
      <div
        className={cn(
          'absolute inset-0',
          isFull ? 'opacity-[0.22]' : 'opacity-[0.10]'
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
          maskImage: isFull
            ? 'linear-gradient(to bottom, black 0%, black 35%, transparent 65%)'
            : 'linear-gradient(to bottom, black 0%, transparent 40%)',
        }}
      />
    </div>
  );
}
