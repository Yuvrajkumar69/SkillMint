import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  ArrowRight,
  Play,
  Sparkles,
  Code2,
  Award,
  Zap,
  BookOpen,
  CheckCircle2,
  Cpu,
  Brain,
  TrendingUp,
  Cloud
} from 'lucide-react';
import FloatingCard from '../motion/FloatingCard';

interface HeroSectionProps {
  onPlayTrailer?: () => void;
}

const SKILL_BADGES = [
  { label: 'Java', icon: Code2, color: 'from-[#5C6AC4] to-[#3B82F6]' },
  { label: 'React', icon: Cpu, color: 'from-[#00D4AA] to-[#06B6D4]' },
  { label: 'Spring Boot', icon: Zap, color: 'from-[#10B981] to-[#00D4AA]' },
  { label: 'AI & ML', icon: Brain, color: 'from-[#8B5CF6] to-[#EC4899]' },
  { label: 'Cloud Computing', icon: Cloud, color: 'from-[#3B82F6] to-[#6366F1]' },
  { label: 'Leadership', icon: TrendingUp, color: 'from-[#F59E0B] to-[#10B981]' },
];

export default function HeroSection({ onPlayTrailer }: HeroSectionProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/courses?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const popularTags = ['Java', 'React', 'Spring Boot', 'Python', 'AI/ML', 'DevOps', 'Leadership'];

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-8">
            {/* Eyebrow Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#111827]/90 border border-[#5C6AC4]/40 backdrop-blur-md shadow-lg shadow-[#5C6AC4]/10"
            >
              <Sparkles className="w-4 h-4 text-[#00D4AA]" />
              <span className="text-xs sm:text-sm font-semibold text-white tracking-wide">
                Next-Gen Anime-Inspired EdTech Marketplace
              </span>
              <span className="w-2 h-2 rounded-full bg-[#00D4AA] animate-ping" />
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]"
            >
              Master In-Demand Skills That{' '}
              <span className="gradient-text">Level Up Your Career</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-[#94a3b8] max-w-2xl leading-relaxed font-normal"
            >
              Discover high-impact Technology and Business courses crafted by industry leaders. Learn through hands-on projects and earn cryptographically verified credentials.
            </motion.p>

            {/* Search Experience */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-3"
            >
              <form onSubmit={handleSearch} className="relative max-w-2xl group">
                <div className="relative flex items-center">
                  <Search className="w-5 h-5 absolute left-4 text-[#64748b] group-focus-within:text-[#00D4AA] transition-colors" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search courses, skills, or topics (e.g. Java, React)..."
                    className="w-full pl-12 pr-32 py-4 bg-[#0B1120]/90 border border-[#1e293b] rounded-2xl text-white placeholder-[#64748b] text-base focus:outline-none focus:border-[#00D4AA] focus:ring-2 focus:ring-[#00D4AA]/30 shadow-2xl transition-all"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 btn-primary py-2.5 px-5 text-sm rounded-xl font-bold flex items-center gap-1.5 shadow-lg shadow-[#5C6AC4]/30"
                  >
                    <span>Search</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Popular Tags */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="text-[#64748b] font-medium flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-[#5C6AC4]" /> Popular:
                </span>
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => navigate(`/courses?q=${encodeURIComponent(tag)}`)}
                    className="px-3 py-1 rounded-lg bg-[#111827]/70 border border-[#1e293b] text-[#94a3b8] hover:text-white hover:border-[#00D4AA] hover:bg-[#00D4AA]/10 transition-all font-medium"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <button
                onClick={() => navigate('/courses')}
                className="btn-primary py-3.5 px-7 text-base rounded-xl font-bold shadow-xl shadow-[#5C6AC4]/30 flex items-center gap-2"
              >
                <span>Explore Marketplace</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              {onPlayTrailer && (
                <button
                  onClick={onPlayTrailer}
                  className="btn-secondary py-3.5 px-6 text-base rounded-xl font-semibold flex items-center gap-2 border border-[#1e293b] hover:border-[#00D4AA]/50"
                >
                  <div className="w-6 h-6 rounded-full bg-[#00D4AA]/20 text-[#00D4AA] flex items-center justify-center">
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </div>
                  <span>Explore SkillMint Tour</span>
                </button>
              )}
            </motion.div>
          </div>

          {/* Right Cinematic Anime Visual Composition */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Ambient Multi-Layer Radial Glow */}
            <div className="absolute w-[420px] h-[420px] bg-gradient-to-tr from-[#5C6AC4]/35 via-[#00D4AA]/20 to-[#8B5CF6]/30 rounded-full blur-[110px] -z-10 animate-pulse" />

            {/* Main Anime Artwork Card Container */}
            <div className="relative w-full max-w-lg">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative rounded-3xl overflow-hidden border border-[#5C6AC4]/30 bg-[#0A0F1E]/80 shadow-2xl backdrop-blur-md group"
              >
                {/* Anime Hero Visual Asset */}
                <img
                  src="/assets/anime/hero_learner.png"
                  alt="SkillMint Anime Student Learner"
                  className="w-full h-auto object-cover rounded-3xl group-hover:scale-103 transition-transform duration-700"
                />

                {/* Subtle Gradient Blend Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#070A14] via-transparent to-black/20 pointer-events-none" />

                {/* Floating Bottom Card: Active Student Progress */}
                <div className="absolute bottom-4 left-4 right-4 bg-[#0B1120]/90 border border-[#1e293b] rounded-2xl p-3.5 shadow-2xl backdrop-blur-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#00D4AA]/20 border border-[#00D4AA]/40 flex items-center justify-center text-[#00D4AA] font-bold text-xs">
                      88%
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Spring Boot Microservices</div>
                      <div className="text-[10px] text-[#94a3b8]">14 / 16 Lessons Complete</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-[#10B981]/20 text-[#10B981] px-2.5 py-1 rounded-full border border-[#10B981]/30">
                    ACTIVE
                  </span>
                </div>
              </motion.div>

              {/* Floating Translucent Skill Card 1: Java & Microservices */}
              <FloatingCard duration={6} yOffset={12} className="absolute -left-6 top-8 z-20 hidden sm:block">
                <div className="bg-[#0B1120]/90 border border-[#5C6AC4]/50 px-3.5 py-2 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-[#5C6AC4]/20 text-[#5C6AC4]">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Java & Spring</div>
                    <div className="text-[10px] text-[#94a3b8]">Enterprise Backend</div>
                  </div>
                </div>
              </FloatingCard>

              {/* Floating Translucent Skill Card 2: AI & ML */}
              <FloatingCard delay={1.5} duration={7} yOffset={10} className="absolute -right-4 top-1/3 z-20 hidden sm:block">
                <div className="bg-[#0B1120]/90 border border-[#00D4AA]/50 px-3.5 py-2 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-[#00D4AA]/20 text-[#00D4AA]">
                    <Brain className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">AI & Machine Learning</div>
                    <div className="text-[10px] text-[#94a3b8]">Applied Models</div>
                  </div>
                </div>
              </FloatingCard>

              {/* Floating Status Pill: Certified Credential */}
              <FloatingCard delay={2.5} duration={5.5} yOffset={8} className="absolute -left-4 bottom-24 z-20 hidden sm:block">
                <div className="bg-[#0B1120]/90 border border-[#F59E0B]/40 px-3.5 py-2 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-[#F59E0B]" />
                  <div>
                    <div className="text-xs font-bold text-white">Verified Badge</div>
                    <div className="text-[10px] text-[#F59E0B]">★ 4.9 Rating</div>
                  </div>
                </div>
              </FloatingCard>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
