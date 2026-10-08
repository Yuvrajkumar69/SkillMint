import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Dark Base Atmosphere */}
      <div className="absolute inset-0 bg-[#070A14]" />

      {/* Radial Glow Orb 1 - Deep Indigo */}
      <motion.div
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -50, 30, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full opacity-20 blur-[130px]"
        style={{ background: 'radial-gradient(circle, #5C6AC4 0%, rgba(92,106,196,0) 70%)' }}
      />

      {/* Radial Glow Orb 2 - Vivid Mint */}
      <motion.div
        animate={{
          x: [0, -50, 40, 0],
          y: [0, 60, -40, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/3 -right-32 w-[600px] h-[600px] rounded-full opacity-15 blur-[140px]"
        style={{ background: 'radial-gradient(circle, #00D4AA 0%, rgba(0,212,170,0) 70%)' }}
      />

      {/* Radial Glow Orb 3 - Ambient Violet Accent */}
      <motion.div
        animate={{
          x: [0, 30, -40, 0],
          y: [0, 40, -50, 0],
          scale: [0.9, 1.1, 1, 0.9],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-10 left-1/4 w-[700px] h-[700px] rounded-full opacity-10 blur-[160px]"
        style={{ background: 'radial-gradient(circle, #3B0764 0%, rgba(59,7,100,0) 70%)' }}
      />

      {/* Subtle Technological Grid Lines Overlay */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Micro Particle Dots Overlay */}
      <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(#5C6AC4_1px,transparent_1px)] [background-size:32px_32px]" />
    </div>
  );
}
