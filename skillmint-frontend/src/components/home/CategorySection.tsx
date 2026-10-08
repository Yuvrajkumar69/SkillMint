import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Code2,
  Brain,
  Globe,
  Database,
  Shield,
  Cloud,
  TrendingUp,
  Award,
  Users,
  DollarSign,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import type { Category } from '../../types';

interface CategorySectionProps {
  categories: Category[];
}

export default function CategorySection({ categories }: CategorySectionProps) {
  const getCategoryIcon = (slug: string, name: string) => {
    const key = (slug || name).toLowerCase();
    if (key.includes('java') || key.includes('code') || key.includes('react') || key.includes('web')) return <Code2 className="w-5 h-5 text-[#5C6AC4]" />;
    if (key.includes('ai') || key.includes('machine') || key.includes('data')) return <Brain className="w-5 h-5 text-[#00D4AA]" />;
    if (key.includes('cloud') || key.includes('aws') || key.includes('devops')) return <Cloud className="w-5 h-5 text-cyan-400" />;
    if (key.includes('sql') || key.includes('db') || key.includes('database')) return <Database className="w-5 h-5 text-amber-400" />;
    if (key.includes('security') || key.includes('cyber')) return <Shield className="w-5 h-5 text-rose-400" />;
    if (key.includes('business') || key.includes('management') || key.includes('leadership')) return <TrendingUp className="w-5 h-5 text-[#00D4AA]" />;
    if (key.includes('finance')) return <DollarSign className="w-5 h-5 text-emerald-400" />;
    if (key.includes('hr') || key.includes('team')) return <Users className="w-5 h-5 text-indigo-400" />;
    return <Award className="w-5 h-5 text-[#7B89D4]" />;
  };

  return (
    <section className="py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="badge-mint mb-2">Category Discovery</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Explore Popular Categories
            </h2>
            <p className="text-[#94a3b8] text-base mt-2 max-w-xl">
              Discover industry-focused curricula designed for modern Technology and Management professionals.
            </p>
          </div>
          <Link
            to="/courses"
            className="btn-ghost text-sm hidden md:flex items-center gap-1 mt-4 md:mt-0 font-semibold"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Link
                to={`/courses?categoryId=${cat.id}`}
                className="group relative block p-5 bg-[#111827]/80 border border-[#1e293b] rounded-2xl backdrop-blur-md hover:border-[#5C6AC4]/50 hover:bg-[#1e293b]/60 transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1 overflow-hidden"
              >
                {/* Accent Top Border Highlight on Hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#5C6AC4] to-[#00D4AA] opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-center justify-between mb-3">
                  <div className="w-11 h-11 rounded-xl bg-[#1e293b] border border-[#2d3748] flex items-center justify-center group-hover:scale-110 transition-transform">
                    {getCategoryIcon(cat.slug, cat.name)}
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#64748b] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </div>

                <h3 className="font-bold text-white text-base group-hover:text-[#00D4AA] transition-colors line-clamp-1">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#64748b] mt-1">
                  {cat.courseCount ? `${cat.courseCount} Courses` : 'Explore Courses'}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link to="/courses" className="btn-secondary w-full py-3">
            <span>Browse All Categories</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
