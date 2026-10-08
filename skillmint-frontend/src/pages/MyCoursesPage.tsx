import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Play, Clock, Sparkles } from 'lucide-react';
import { enrollmentApi } from '../api/services';
import type { CourseCard } from '../types';
import ContextualBackground from '../components/motion/ContextualBackground';

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<CourseCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = 'My Courses – SkillMint';
    enrollmentApi.getMyCourses().then((r) => setCourses(r.data.data || [])).finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* Contextual Learning Background */}
      <ContextualBackground variant="LEARNING" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="badge-mint uppercase tracking-wider text-xs">STUDENT DASHBOARD</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">My Enrolled Courses</h1>
        <p className="text-[#94a3b8] mb-8 text-sm">{courses.length} enrolled course{courses.length !== 1 ? 's' : ''}</p>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-[#0A0F1E] border border-[#1e293b] rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-[#0A0F1E]/80 border border-[#1e293b] rounded-3xl backdrop-blur-md">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 border border-[#1e293b] bg-[#111827] text-[#00D4AA]">
              <BookOpen size={32} />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">No courses enrolled yet</h2>
            <p className="text-[#94a3b8] mb-6 text-sm">Discover and enroll in top Technology and Business courses</p>
            <Link to="/courses" className="btn-primary py-2.5 px-6 text-sm">Explore Courses</Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-[#0A0F1E]/90 border border-[#1e293b] rounded-2xl flex flex-col overflow-hidden shadow-xl backdrop-blur-md hover:border-[#5C6AC4]/40 transition-all group">
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600'}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      to={`/learn/${course.id}`}
                      className="w-12 h-12 rounded-full bg-[#00D4AA] text-black flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                    >
                      <Play size={20} className="fill-current ml-0.5" />
                    </Link>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <span className="text-xs font-semibold text-[#00D4AA] mb-1">{course.category?.name || 'Course'}</span>
                  <Link to={`/learn/${course.id}`} className="font-bold text-white hover:text-[#00D4AA] text-base line-clamp-2 mb-2 transition-colors">
                    {course.title}
                  </Link>
                  <p className="text-xs text-[#94a3b8] mb-4">by {course.instructor?.name}</p>
                  
                  <div className="mt-auto pt-3 border-t border-[#1e293b] flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-[#94a3b8]">
                      <span className="flex items-center gap-1"><Clock size={12} /> {course.totalDuration}</span>
                      <span className="flex items-center gap-1"><BookOpen size={12} /> {course.totalLessons} lessons</span>
                    </div>
                    <Link
                      to={`/learn/${course.id}`}
                      className="btn-secondary py-1.5 px-3 text-xs font-bold rounded-lg text-[#00D4AA] border border-[#00D4AA]/30 hover:bg-[#00D4AA]/10"
                    >
                      Continue
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
