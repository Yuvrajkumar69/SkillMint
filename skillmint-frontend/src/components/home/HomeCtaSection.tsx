import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Rocket } from 'lucide-react';

export default function HomeCtaSection() {
  return (
    <section className="py-24 relative z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl p-10 sm:p-16 border border-[#5C6AC4]/40 overflow-hidden shadow-2xl text-center group"
        >
          {/* Anime Futuristic Cityscape Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="/assets/anime/cta_bg.png"
              alt="SkillMint Futuristic Anime Skyline"
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-1000 opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070A14] via-[#0A0F1E]/85 to-[#070A14]" />
          </div>

          {/* Glowing Background Accents */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#5C6AC4]/30 blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#00D4AA]/25 blur-[100px] pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00D4AA]/20 border border-[#00D4AA]/40 text-[#00D4AA] text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Rocket className="w-4 h-4" /> Start Learning Today
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-2xl mx-auto">
              Your Next Skill Could Change Your Career
            </h2>

            <p className="text-base sm:text-lg text-[#94a3b8] max-w-xl mx-auto leading-relaxed">
              Join thousands of tech developers and business leaders building practical expertise on SkillMint.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/courses"
                className="btn-primary py-4 px-8 text-base rounded-xl font-bold flex items-center justify-center gap-2 w-full sm:w-auto shadow-xl shadow-[#5C6AC4]/30"
              >
                <span>Explore All Courses</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/signup"
                className="btn-secondary py-4 px-8 text-base rounded-xl font-semibold w-full sm:w-auto border border-[#1e293b] hover:border-[#00D4AA]/50"
              >
                <span>Create Free Account</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
