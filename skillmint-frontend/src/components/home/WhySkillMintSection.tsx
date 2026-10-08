import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Globe, Award, Users, TrendingUp, CheckCircle2 } from 'lucide-react';

const valueItems = [
  {
    icon: <Shield className="w-5 h-5 text-[#00D4AA]" />,
    title: 'Industry-Vetted Curriculum',
    desc: 'Curated by staff software engineers and corporate leaders to match current market demands.'
  },
  {
    icon: <Zap className="w-5 h-5 text-[#5C6AC4]" />,
    title: 'Hands-On Projects',
    desc: 'Build real production applications and business case studies that you showcase on your resume.'
  },
  {
    icon: <Globe className="w-5 h-5 text-cyan-400" />,
    title: 'Flexible Lifetime Learning',
    desc: 'Access your enrolled courses anytime across all devices with continuous updates.'
  },
  {
    icon: <Award className="w-5 h-5 text-amber-400" />,
    title: 'Verified Credentials',
    desc: 'Earn shareable certificates of achievement to highlight your technical and managerial proficiency.'
  },
  {
    icon: <Users className="w-5 h-5 text-indigo-400" />,
    title: 'Expert Mentorship',
    desc: 'Interact with experienced instructors and active peer communities for continuous feedback.'
  },
  {
    icon: <TrendingUp className="w-5 h-5 text-rose-400" />,
    title: 'Career Acceleration',
    desc: 'Gain practical confidence and strategic insights designed to help you land promotions or pivot careers.'
  }
];

export default function WhySkillMintSection() {
  return (
    <section className="py-24 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Anime Visual Student */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-[#5C6AC4]/40 bg-[#0A0F1E] shadow-2xl group">
              <img
                src="/assets/anime/student_learning.png"
                alt="SkillMint Student Learning Journey"
                className="w-full h-auto object-cover group-hover:scale-103 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070A14] via-transparent to-transparent opacity-80" />
              
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-[#0B1120]/90 border border-[#1e293b] backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#00D4AA]/20 border border-[#00D4AA]/40 flex items-center justify-center text-[#00D4AA]">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">100% Practical Mastery</div>
                    <div className="text-[11px] text-[#94a3b8]">Verified Projects & Real Code</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Value Grid */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <span className="badge-indigo mb-3 inline-block">WHY SKILLMINT</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Designed for Ambitious Engineers & Future Business Leaders
              </h2>
              <p className="text-[#94a3b8] text-base mt-3">
                We bridge the gap between academic theory and high-impact job execution with real-world project experience.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {valueItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="p-5 bg-[#0B1120]/80 border border-[#1e293b] rounded-2xl backdrop-blur-md hover:border-[#00D4AA]/40 transition-all duration-300 shadow-xl group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#111827] border border-[#1e293b] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-white text-sm mb-1 group-hover:text-[#00D4AA] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#94a3b8] leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
