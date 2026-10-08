import React from 'react';
import { motion } from 'framer-motion';
import {
  Code2,
  Cpu,
  Brain,
  TrendingUp,
  BarChart3,
  ShieldCheck,
  BookOpen,
  Lock,
  Sparkles,
  Zap,
  Globe,
  Cloud
} from 'lucide-react';

export type BackgroundVariant =
  | 'TECHNOLOGY'
  | 'MANAGEMENT'
  | 'GENERAL'
  | 'LEARNING'
  | 'AUTH'
  | 'ADMIN';

interface ContextualBackgroundProps {
  variant?: BackgroundVariant;
  categoryName?: string;
}

export default function ContextualBackground({
  variant = 'GENERAL',
  categoryName,
}: ContextualBackgroundProps) {
  // Normalize category if provided
  const categoryUpper = categoryName?.toUpperCase() || '';
  let activeVariant = variant;
  if (categoryUpper.includes('JAVA') || categoryUpper.includes('REACT') || categoryUpper.includes('PYTHON') || categoryUpper.includes('TECH') || categoryUpper.includes('CLOUD') || categoryUpper.includes('DEVOPS')) {
    activeVariant = 'TECHNOLOGY';
  } else if (categoryUpper.includes('LEADERSHIP') || categoryUpper.includes('BUSINESS') || categoryUpper.includes('FINANCE') || categoryUpper.includes('MANAGEMENT') || categoryUpper.includes('MARKETING')) {
    activeVariant = 'MANAGEMENT';
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Base Dark Theme Background */}
      <div className="absolute inset-0 bg-[#070A14]" />

      {/* VARIANT 1: TECHNOLOGY BACKGROUND */}
      {activeVariant === 'TECHNOLOGY' && (
        <>
          {/* Cyan / Electric Indigo Ambient Orbs */}
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.25, 0.35, 0.25],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-32 -left-32 w-[550px] h-[550px] bg-gradient-to-tr from-[#5C6AC4]/40 to-[#00D4AA]/30 rounded-full blur-[130px]"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute top-1/3 -right-32 w-[500px] h-[500px] bg-gradient-to-br from-[#3B82F6]/30 to-[#00D4AA]/20 rounded-full blur-[120px]"
          />

          {/* Technology Anime Visual Backdrop Accent */}
          <div className="absolute inset-0 opacity-15 mix-blend-screen bg-cover bg-center" style={{ backgroundImage: "url('/assets/anime/tech_engineer.png')" }}>
            <div className="absolute inset-0 bg-gradient-to-t from-[#070A14] via-transparent to-[#070A14]" />
          </div>

          {/* Floating Tech Icons & Circuit Nodes */}
          <div className="absolute inset-0">
            <motion.div
              animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-24 left-[10%] p-3 rounded-2xl bg-[#0B1120]/80 border border-[#5C6AC4]/30 text-[#00D4AA] shadow-xl backdrop-blur-md hidden md:flex items-center gap-2 text-xs font-mono"
            >
              <Code2 className="w-4 h-4" />
              <span>class SkillMintApp {}</span>
            </motion.div>

            <motion.div
              animate={{ y: [0, 18, 0], rotate: [0, -4, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute top-1/2 right-[8%] p-3 rounded-2xl bg-[#0B1120]/80 border border-[#00D4AA]/30 text-[#3B82F6] shadow-xl backdrop-blur-md hidden md:flex items-center gap-2 text-xs font-mono"
            >
              <Cpu className="w-4 h-4 text-[#00D4AA]" />
              <span>const [state] = useState()</span>
            </motion.div>

            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              className="absolute bottom-28 left-[15%] p-3 rounded-2xl bg-[#0B1120]/80 border border-[#8B5CF6]/30 text-[#8B5CF6] shadow-xl backdrop-blur-md hidden md:flex items-center gap-2 text-xs font-mono"
            >
              <Brain className="w-4 h-4" />
              <span>AI Neural Model v2.4</span>
            </motion.div>
          </div>
        </>
      )}

      {/* VARIANT 2: MANAGEMENT BACKGROUND */}
      {activeVariant === 'MANAGEMENT' && (
        <>
          {/* Executive Violet / Indigo Orbs */}
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.25, 0.35, 0.25],
            }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-32 -right-32 w-[550px] h-[550px] bg-gradient-to-tr from-[#8B5CF6]/40 to-[#EC4899]/30 rounded-full blur-[130px]"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute top-1/2 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-[#5C6AC4]/30 to-[#F59E0B]/20 rounded-full blur-[120px]"
          />

          {/* Management Anime Visual Backdrop Accent */}
          <div className="absolute inset-0 opacity-15 mix-blend-screen bg-cover bg-center" style={{ backgroundImage: "url('/assets/anime/management_leader.png')" }}>
            <div className="absolute inset-0 bg-gradient-to-t from-[#070A14] via-transparent to-[#070A14]" />
          </div>

          {/* Floating Strategy & Analytics Cards */}
          <div className="absolute inset-0">
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-28 right-[12%] p-3 rounded-2xl bg-[#0B1120]/80 border border-[#8B5CF6]/30 text-[#EC4899] shadow-xl backdrop-blur-md hidden md:flex items-center gap-2 text-xs font-semibold"
            >
              <TrendingUp className="w-4 h-4 text-[#F59E0B]" />
              <span>Strategy & Revenue +42%</span>
            </motion.div>

            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
              className="absolute top-2/3 left-[7%] p-3 rounded-2xl bg-[#0B1120]/80 border border-[#EC4899]/30 text-white shadow-xl backdrop-blur-md hidden md:flex items-center gap-2 text-xs font-semibold"
            >
              <BarChart3 className="w-4 h-4 text-[#8B5CF6]" />
              <span>Marketplace Growth Analytics</span>
            </motion.div>
          </div>
        </>
      )}

      {/* VARIANT 3: GENERAL / CATALOG BACKGROUND */}
      {activeVariant === 'GENERAL' && (
        <>
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#5C6AC4]/20 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#00D4AA]/15 rounded-full blur-[140px]" />

          <div className="absolute inset-0 opacity-10 mix-blend-screen bg-cover bg-center" style={{ backgroundImage: "url('/assets/anime/student_learning.png')" }}>
            <div className="absolute inset-0 bg-gradient-to-t from-[#070A14] via-transparent to-[#070A14]" />
          </div>
        </>
      )}

      {/* VARIANT 4: LEARNING WORKSPACE BACKGROUND */}
      {activeVariant === 'LEARNING' && (
        <>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#5C6AC4]/15 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-[#00D4AA]/10 rounded-full blur-[150px]" />
        </>
      )}

      {/* VARIANT 5: AUTHENTICATION BACKGROUND */}
      {activeVariant === 'AUTH' && (
        <>
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-24 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-[#5C6AC4]/35 to-[#00D4AA]/25 rounded-full blur-[130px]"
          />
          <div className="absolute inset-0 opacity-12 mix-blend-screen bg-cover bg-center" style={{ backgroundImage: "url('/assets/anime/hero_learner.png')" }}>
            <div className="absolute inset-0 bg-gradient-to-t from-[#070A14] via-transparent to-[#070A14]" />
          </div>
        </>
      )}

      {/* VARIANT 6: ADMIN DASHBOARD BACKGROUND */}
      {activeVariant === 'ADMIN' && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F1E] via-[#070A14] to-[#070A14]" />
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]" />
        </>
      )}

      {/* Global Tech Grid Overlay Pattern */}
      {activeVariant !== 'ADMIN' && (
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#5C6AC4_1px,transparent_1px)] [background-size:32px_32px]" />
      )}
    </div>
  );
}
