import React from 'react';
import { motion } from 'framer-motion';
import { Star, Award, BookOpen, Users } from 'lucide-react';
import type { Instructor } from '../../types';

interface InstructorSectionProps {
  instructors?: Instructor[];
}

// Fallback demo instructors matching realistic platform profiles
const fallbackInstructors: Instructor[] = [
  {
    id: 1,
    name: 'Ashwani Kumar',
    designation: 'Senior Java Architect & Backend Educator',
    bio: 'Senior Java developer and instructor specializing in enterprise backend architecture, Spring Boot, microservices, and distributed cloud systems.',
    profilePictureUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    yearsOfExperience: 10,
    rating: 4.8,
    totalStudents: 18500,
    totalCourses: 4,
  },
  {
    id: 2,
    name: 'Priya Sharma',
    designation: 'Data Scientist & AI Specialist',
    bio: 'Data scientist and ML educator focused on Python, machine learning algorithms, deep learning models, and practical data workflows.',
    profilePictureUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    yearsOfExperience: 8,
    rating: 4.9,
    totalStudents: 15200,
    totalCourses: 3,
  },
  {
    id: 3,
    name: 'Rajesh Mehta',
    designation: 'Management Consultant & Business Educator',
    bio: 'Business and management educator specializing in leadership development, corporate strategy, agile project execution, and organizational design.',
    profilePictureUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    yearsOfExperience: 12,
    rating: 4.7,
    totalStudents: 11800,
    totalCourses: 4,
  }
];

export default function InstructorSection({ instructors }: InstructorSectionProps) {
  const displayList = instructors && instructors.length > 0 ? instructors : fallbackInstructors;

  return (
    <section className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="badge-mint mb-3">Industry Leadership</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Learn from Industry Experts
          </h2>
          <p className="text-[#94a3b8] text-base mt-3">
            Our instructors are active practitioners, engineering leads, and business executives with proven track records.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayList.slice(0, 3).map((inst, index) => (
            <motion.div
              key={inst.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-[#111827]/90 border border-[#1e293b] rounded-2xl p-6 backdrop-blur-md hover:border-[#5C6AC4]/40 transition-all duration-300 shadow-xl flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center gap-4 mb-5">
                  <img
                    src={inst.profilePictureUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
                    alt={inst.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-[#2d3748] group-hover:scale-105 transition-transform"
                  />
                  <div>
                    <h3 className="font-bold text-white text-lg group-hover:text-[#00D4AA] transition-colors">
                      {inst.name}
                    </h3>
                    <p className="text-xs text-[#5C6AC4] font-medium leading-snug">
                      {inst.designation}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-[#94a3b8] leading-relaxed mb-6">
                  "{inst.bio}"
                </p>
              </div>

              <div className="border-t border-[#1e293b] pt-4 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <div className="font-bold text-white">{inst.yearsOfExperience}+ Yrs</div>
                  <div className="text-[11px] text-[#64748b]">Experience</div>
                </div>
                <div>
                  <div className="font-bold text-amber-400 flex items-center justify-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-current" /> {inst.rating}
                  </div>
                  <div className="text-[11px] text-[#64748b]">Rating</div>
                </div>
                <div>
                  <div className="font-bold text-white">{inst.totalCourses || 4}</div>
                  <div className="text-[11px] text-[#64748b]">Courses</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
