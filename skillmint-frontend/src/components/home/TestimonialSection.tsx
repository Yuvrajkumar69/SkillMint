import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Rohan Verma',
    role: 'Software Engineer at Wipro',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    text: 'SkillMint\'s Spring Boot & React Full Stack course transformed my technical capabilities. The hands-on project portfolio directly helped me crack my technical interviews.',
    rating: 5,
  },
  {
    name: 'Anjali Singh',
    role: 'Data Analyst at TCS',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    text: 'The Data Science & Machine Learning course is phenomenal. Real industry datasets, structured module progression, and responsive support throughout.',
    rating: 5,
  },
  {
    name: 'Karan Patel',
    role: 'Product Manager at Tech Startup',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    text: 'The Product & Business Leadership track gave me the clarity to transition smoothly from engineering into product management. Highly recommended!',
    rating: 5,
  },
];

export default function TestimonialSection() {
  return (
    <section className="py-24 relative z-10 bg-[#060B14]/60 border-y border-[#1e293b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="badge-indigo mb-3">Student Success Stories</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            What Our Learners Say
          </h2>
          <p className="text-[#94a3b8] text-base mt-3">
            Real feedback from professionals who accelerated their careers with SkillMint.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-7 bg-[#111827]/90 border border-[#1e293b] rounded-2xl backdrop-blur-md flex flex-col justify-between hover:border-[#5C6AC4]/40 transition-all duration-300 shadow-xl"
            >
              <div>
                <Quote className="w-8 h-8 text-[#5C6AC4]/30 mb-4" />
                <p className="text-sm text-[#e2e8f0] leading-relaxed mb-6 font-normal">
                  "{t.text}"
                </p>
              </div>

              <div>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-[#1e293b]">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#2d3748]"
                  />
                  <div>
                    <h4 className="font-bold text-white text-sm">{t.name}</h4>
                    <p className="text-xs text-[#94a3b8]">{t.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
