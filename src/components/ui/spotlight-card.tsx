'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion, useMotionTemplate, useSpring } from 'framer-motion';

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  spotlightColor?: string;
  className?: string;
}

export function SpotlightCard({
  children,
  spotlightColor = 'rgba(124, 178, 253, 0.15)', // --accent-bright
  className,
  ...props
}: SpotlightCardProps) {
  const mouseX = useSpring(0, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(0, { stiffness: 500, damping: 100 });

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent<HTMLDivElement>) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl bg-[hsl(var(--bg-surface))] border border-[hsl(var(--stroke-subtle))] shadow-rim transition-colors duration-300',
        className
      )}
      onMouseMove={handleMouseMove}
      {...props}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              ${spotlightColor},
              transparent 40%
            )
          `,
          zIndex: 1,
        }}
      />
      
      {/* 3D tilt effect on children container */}
      <motion.div 
        className="relative z-10 h-full w-full bg-[hsl(var(--bg-surface))] rounded-[15px]"
        whileHover={{ scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <div className="absolute inset-0 rounded-[15px] bg-[hsl(var(--bg-glass)/0.2)] pointer-events-none" />
        {children}
      </motion.div>
    </div>
  );
}
