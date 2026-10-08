import React from 'react';
import { motion } from 'framer-motion';

interface FloatingCardProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  className?: string;
}

export default function FloatingCard({
  children,
  delay = 0,
  duration = 6,
  yOffset = 12,
  className = '',
}: FloatingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: [0, -yOffset, 0],
      }}
      transition={{
        opacity: { duration: 0.6, delay },
        y: {
          duration,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
          delay,
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
