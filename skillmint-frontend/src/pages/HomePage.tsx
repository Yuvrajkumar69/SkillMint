import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Sparkles, ChevronRight, Play } from 'lucide-react';
import { courseApi, categoryApi, instructorApi } from '../api/services';
import type { CourseCard, Category, Instructor } from '../types';
import { useAuth } from '../context/AuthContext';

import AnimatedBackground from '../components/motion/AnimatedBackground';
import HeroSection from '../components/hero/HeroSection';
import CategorySection from '../components/home/CategorySection';
import WhySkillMintSection from '../components/home/WhySkillMintSection';
import InstructorSection from '../components/home/InstructorSection';
import TestimonialSection from '../components/home/TestimonialSection';
import HomeCtaSection from '../components/home/HomeCtaSection';
import CourseCardComponent from '../components/CourseCard';
import TrailerModal from '../components/common/TrailerModal';

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const [featured, setFeatured] = useState<CourseCard[]>([]);
  const [trending, setTrending] = useState<CourseCard[]>([]);
  const [techCourses, setTechCourses] = useState<CourseCard[]>([]);
  const [mgmtCourses, setMgmtCourses] = useState<CourseCard[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  useEffect(() => {
    document.title = 'SkillMint — Modern Ed-Tech & Course Marketplace';
    Promise.allSettled([
      courseApi.getFeatured().then((r) => setFeatured(r.data.data || [])),
      courseApi.getTrending().then((r) => setTrending(r.data.data || [])),
      courseApi.getByType('TECHNOLOGY').then((r) => setTechCourses(r.data.data || [])),
      courseApi.getByType('MANAGEMENT').then((r) => setMgmtCourses(r.data.data || [])),
      categoryApi.getAll().then((r) => setCategories(r.data.data || [])),
      instructorApi.getAll().then((r) => setInstructors(r.data.data || [])),
    ]);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#070A14] text-white overflow-hidden">
      {/* Background Animated Atmosphere */}
      <AnimatedBackground />

      <div className="relative z-10 space-y-12">
        {/* Logged-In Personalized Welcome Banner */}
        {isAuthenticated && user && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0A0F1E]/90 border border-[#5C6AC4]/40 rounded-2xl p-4 sm:p-6 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#5C6AC4] to-[#00D4AA] flex items-center justify-center font-bold text-lg text-white">
                  {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">
                    Welcome back, {user.fullName}! 👋
                  </h3>
                  <p className="text-xs text-[#94a3b8]">
                    Ready to resume your courses and track your progress today?
                  </p>
                </div>
              </div>
              <Link
                to="/my-courses"
                className="btn-primary py-2.5 px-5 text-xs sm:text-sm rounded-xl font-semibold flex items-center gap-2 flex-shrink-0 shadow-lg shadow-[#5C6AC4]/30"
              >
                <BookOpen className="w-4 h-4" />
                <span>Go to My Courses</span>
              </Link>
            </motion.div>
          </div>
        )}

        {/* Hero Section */}
        <HeroSection onPlayTrailer={() => setIsTrailerOpen(true)} />

        {/* Categories Section */}
        {categories.length > 0 && <CategorySection categories={categories} />}

        {/* Featured Courses Section */}
        {featured.length > 0 && (
          <CourseSectionContainer
            title="Featured Masterclasses"
            subtitle="Handpicked by our technical team for maximum career impact"
            badge="FEATURED"
            courses={featured}
            viewAllTo="/courses?featured=true"
          />
        )}

        {/* Trending Courses Section */}
        {trending.length > 0 && (
          <CourseSectionContainer
            title="Trending Right Now"
            subtitle="Most popular courses across Technology and Business"
            badge="TRENDING"
            courses={trending}
            viewAllTo="/courses?sort=popular"
            accent
          />
        )}

        {/* Popular Technology Courses */}
        {techCourses.length > 0 && (
          <CourseSectionContainer
            title="Popular Technology Courses"
            subtitle="Master in-demand Java, React, Python, Data Science & DevOps skills"
            badge="TECHNOLOGY"
            courses={techCourses}
            viewAllTo="/courses?type=TECHNOLOGY"
            bgImage="/assets/anime/tech_engineer.png"
          />
        )}

        {/* Popular Management & Business Courses */}
        {mgmtCourses.length > 0 && (
          <CourseSectionContainer
            title="Popular Management & Business Courses"
            subtitle="Develop leadership, product strategy, marketing, and financial acumen"
            badge="MANAGEMENT"
            courses={mgmtCourses}
            viewAllTo="/courses?type=MANAGEMENT"
            accent
            bgImage="/assets/anime/management_leader.png"
          />
        )}

        {/* Why SkillMint Value Section */}
        <WhySkillMintSection />

        {/* Industry Expert Instructors */}
        <InstructorSection instructors={instructors} />

        {/* Student Testimonials */}
        <TestimonialSection />

        {/* Career Call-To-Action Banner */}
        <HomeCtaSection />
      </div>

      {/* Video Trailer Modal */}
      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
      />
    </div>
  );
}

// Reusable Course Section Grid Component with Optional Background Anime Blend
function CourseSectionContainer({
  title,
  subtitle,
  badge,
  courses,
  viewAllTo,
  accent = false,
  bgImage,
}: {
  title: string;
  subtitle: string;
  badge: string;
  courses: CourseCard[];
  viewAllTo: string;
  accent?: boolean;
  bgImage?: string;
}) {
  return (
    <section className={`py-16 relative overflow-hidden ${accent ? 'bg-[#060B14]/60 border-y border-[#1e293b]' : ''}`}>
      {/* Background Anime Artwork Accent */}
      {bgImage && (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-15 mix-blend-screen">
          <img
            src={bgImage}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070A14] via-transparent to-[#070A14]" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="badge-indigo mb-2 inline-block">{badge}</div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">{title}</h2>
            <p className="text-[#94a3b8] text-sm mt-1">{subtitle}</p>
          </div>
          <Link
            to={viewAllTo}
            className="btn-ghost text-sm hidden md:flex items-center gap-1 font-semibold text-[#00D4AA] hover:text-white"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.slice(0, 4).map((course, i) => (
            <CourseCardComponent key={course.id} course={course} index={i} />
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link to={viewAllTo} className="btn-secondary w-full py-3">
            <span>View All Courses</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
