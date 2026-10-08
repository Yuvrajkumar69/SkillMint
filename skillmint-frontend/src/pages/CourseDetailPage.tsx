import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Star, Clock, Users, BookOpen, Globe, Award,
  Check, ChevronDown, ChevronUp, Heart, ShoppingCart,
  Play, ExternalLink, Lock
} from 'lucide-react';
import { courseApi, enrollmentApi } from '../api/services';
import type { Course } from '../types';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import CoursePreviewModal from '../components/common/CoursePreviewModal';
import toast from 'react-hot-toast';
import ContextualBackground, { type BackgroundVariant } from '../components/motion/ContextualBackground';

const levelColors: Record<string, string> = {
  BEGINNER: 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20',
  INTERMEDIATE: 'text-amber-400 bg-amber-500/10 border border-amber-500/20',
  ADVANCED: 'text-red-400 bg-red-500/10 border border-red-500/20',
};

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [showAllLessons, setShowAllLessons] = useState(false);

  // Preview modal states
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedPreviewUrl, setSelectedPreviewUrl] = useState<string | undefined>(undefined);
  const [selectedPreviewTitle, setSelectedPreviewTitle] = useState<string | undefined>(undefined);

  const wishlisted = id ? isInWishlist(Number(id)) : false;

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    courseApi.getById(Number(id)).then((r) => {
      setCourse(r.data.data);
      document.title = `${r.data.data?.title} – SkillMint`;
    }).finally(() => setIsLoading(false));
  }, [id]);

  useEffect(() => {
    if (isAuthenticated && id) {
      enrollmentApi.check(Number(id)).then((r) => setIsEnrolled(r.data.data?.enrolled || false));
    }
  }, [isAuthenticated, id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) { navigate('/signin'); return; }
    if (isInCart(Number(id))) { navigate('/cart'); return; }
    try {
      setIsAddingToCart(true);
      await addToCart(Number(id));
      toast.success('Course added to cart');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      if (msg && msg.toLowerCase().includes('already in your cart')) {
        toast.success('Course is already in your cart');
      } else {
        toast.error(msg || 'Failed to add to cart');
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) { navigate('/signin'); return; }
    navigate(`/checkout?courseId=${id}`);
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) { toast.error('Please sign in first'); return; }
    try {
      const added = await toggleWishlist(Number(id));
      toast.success(added ? 'Course added to wishlist' : 'Course removed from wishlist');
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  const handleOpenCoursePreview = () => {
    if (!course) return;
    setSelectedPreviewUrl(course.previewVideoUrl);
    setSelectedPreviewTitle(course.title);
    setIsPreviewOpen(true);
  };

  const handleOpenLessonPreview = (lessonVideoUrl?: string, lessonTitle?: string) => {
    setSelectedPreviewUrl(lessonVideoUrl || course?.previewVideoUrl);
    setSelectedPreviewTitle(lessonTitle ? `${course?.title} – ${lessonTitle}` : course?.title);
    setIsPreviewOpen(true);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4 animate-pulse">
            <div className="h-8 bg-[#1e293b] rounded w-3/4" />
            <div className="h-4 bg-[#1e293b] rounded w-full" />
            <div className="h-4 bg-[#1e293b] rounded w-2/3" />
            <div className="aspect-video bg-[#1e293b] rounded-xl" />
          </div>
          <div className="animate-pulse">
            <div className="h-[400px] bg-[#1e293b] rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-[#e2e8f0] mb-2">Course not found</h2>
        <button onClick={() => navigate('/courses')} className="btn-primary mt-4">Browse Courses</button>
      </div>
    );
  }

  const effectivePrice = course.discountedPrice > 0 ? course.discountedPrice : course.originalPrice;
  const inCart = isInCart(course.id);

  // Group lessons by section
  const lessonsBySec: Record<string, typeof course.lessons> = {};
  (course.lessons || []).forEach((l) => {
    const sec = l.sectionName || 'Course Content';
    if (!lessonsBySec[sec]) lessonsBySec[sec] = [];
    lessonsBySec[sec].push(l);
  });
  const sections = Object.keys(lessonsBySec);

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <ContextualBackground
        variant={course?.category?.type as BackgroundVariant || 'GENERAL'}
        categoryName={course?.category?.name}
      />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Course Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-[#64748b]">
            <span className="hover:text-[#7B89D4] cursor-pointer" onClick={() => navigate('/courses')}>Courses</span>
            <span>/</span>
            <span className="text-[#7B89D4]">{course.category?.name}</span>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold text-[#e2e8f0] mb-3 leading-tight">{course.title}</h1>
            <p className="text-lg text-[#94a3b8] mb-4">{course.subtitle}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star size={15} className="text-amber-400 fill-amber-400" />
                <span className="font-semibold text-amber-400">{course.rating?.toFixed(1)}</span>
                <span className="text-[#64748b]">({course.totalReviews?.toLocaleString()} reviews)</span>
              </div>
              <div className="flex items-center gap-1 text-[#64748b]">
                <Users size={14} />
                <span>{course.totalStudents?.toLocaleString()} students</span>
              </div>
              <div className="flex items-center gap-1 text-[#64748b]">
                <Globe size={14} />
                <span>{course.language}</span>
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${levelColors[course.level]}`}>
                {course.level}
              </span>
            </div>
          </div>

          {/* Instructor */}
          {course.instructor && (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-[#1e293b] bg-[#111827]">
              <img
                src={course.instructor.profilePictureUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                alt={course.instructor.name}
                className="w-12 h-12 rounded-full bg-[#1e293b]"
              />
              <div>
                <p className="text-xs text-[#64748b]">Instructor</p>
                <p className="font-semibold text-[#e2e8f0]">{course.instructor.name}</p>
                <p className="text-xs text-[#94a3b8]">{course.instructor.designation}</p>
              </div>
              {course.instructor.linkedinUrl && (
                <a href={course.instructor.linkedinUrl} target="_blank" rel="noreferrer" className="ml-auto text-[#64748b] hover:text-[#5C6AC4]">
                  <ExternalLink size={18} />
                </a>
              )}
            </div>
          )}

          {/* Thumbnail */}
          <div className="relative rounded-xl overflow-hidden aspect-video bg-[#0A0F1E] group">
            <img
              src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200'}
              alt={course.title}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200';
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] flex items-center justify-center transition-all group-hover:bg-black/40">
              <button
                onClick={handleOpenCoursePreview}
                className="w-16 h-16 rounded-full bg-[#5C6AC4] hover:bg-[#00D4AA] flex items-center justify-center text-white shadow-2xl transition-all duration-300 hover:scale-110 border border-white/20"
                title="Watch Course Preview"
              >
                <Play size={26} className="fill-white ml-1" />
              </button>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: <Clock size={16} />, label: 'Duration', value: course.totalDuration },
              { icon: <BookOpen size={16} />, label: 'Lessons', value: `${course.totalLessons}` },
              { icon: <Award size={16} />, label: 'Level', value: course.level?.charAt(0) + course.level?.slice(1).toLowerCase() },
              { icon: <Globe size={16} />, label: 'Language', value: course.language },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-[#1e293b] bg-[#111827]">
                <span className="text-[#5C6AC4]">{s.icon}</span>
                <div>
                  <p className="text-[10px] text-[#64748b] uppercase tracking-wide">{s.label}</p>
                  <p className="text-sm font-medium text-[#e2e8f0]">{s.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* What you'll learn */}
          {course.whatYouWillLearn?.length > 0 && (
            <div className="p-6 rounded-xl border border-[#1e293b] bg-[#111827]">
              <h2 className="text-xl font-bold text-[#e2e8f0] mb-4">What You'll Learn</h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {course.whatYouWillLearn.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-[#94a3b8]">
                    <Check size={15} className="text-[#00D4AA] mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {course.description && (
            <div>
              <h2 className="text-xl font-bold text-[#e2e8f0] mb-3">Course Description</h2>
              <p className="text-[#94a3b8] leading-relaxed text-sm whitespace-pre-line">{course.description}</p>
            </div>
          )}

          {/* Requirements */}
          {course.requirements?.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-[#e2e8f0] mb-3">Requirements</h2>
              <ul className="space-y-2">
                {course.requirements.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#94a3b8]">
                    <span className="text-[#5C6AC4] mt-0.5">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Curriculum */}
          {sections.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-[#e2e8f0] mb-4">
                Curriculum
                <span className="ml-2 text-sm font-normal text-[#64748b]">{course.totalLessons} lessons · {course.totalDuration}</span>
              </h2>
              <div className="space-y-2">
                {sections.map((sec) => (
                  <div key={sec} className="border border-[#1e293b] rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedSection(expandedSection === sec ? null : sec)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-[#111827] hover:bg-[#1a2236] transition-colors text-left"
                    >
                      <span className="font-medium text-[#e2e8f0] text-sm">{sec}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#64748b]">{lessonsBySec[sec].length} lessons</span>
                        {expandedSection === sec ? <ChevronUp size={14} className="text-[#64748b]" /> : <ChevronDown size={14} className="text-[#64748b]" />}
                      </div>
                    </button>
                    {expandedSection === sec && (
                      <div className="divide-y divide-[#1e293b]">
                        {lessonsBySec[sec].map((lesson) => (
                          <div
                            key={lesson.id}
                            onClick={() => {
                              if (lesson.preview) {
                                handleOpenLessonPreview(lesson.videoUrl, lesson.title);
                              }
                            }}
                            className={`flex items-center justify-between px-4 py-2.5 bg-[#0A0F1E] ${
                              lesson.preview ? 'cursor-pointer hover:bg-[#111827]' : ''
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {lesson.preview
                                ? <Play size={14} className="text-[#00D4AA] flex-shrink-0 fill-current" />
                                : <Lock size={14} className="text-[#475569] flex-shrink-0" />}
                              <span className={`text-xs ${lesson.preview ? 'text-[#e2e8f0] font-medium' : 'text-[#64748b]'}`}>{lesson.title}</span>
                              {lesson.preview && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#00D4AA]/10 text-[#00D4AA] border border-[#00D4AA]/20 font-semibold">
                                  Preview
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-[#475569] flex-shrink-0 ml-3">{lesson.duration}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructor profile */}
          {course.instructor && (
            <div className="p-6 rounded-xl border border-[#1e293b] bg-[#111827]">
              <h2 className="text-xl font-bold text-[#e2e8f0] mb-4">About the Instructor</h2>
              <div className="flex items-start gap-4">
                <img
                  src={course.instructor.profilePictureUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                  alt={course.instructor.name}
                  className="w-16 h-16 rounded-full bg-[#1e293b] flex-shrink-0"
                />
                <div>
                  <h3 className="font-bold text-[#e2e8f0]">{course.instructor.name}</h3>
                  <p className="text-sm text-[#7B89D4] mb-1">{course.instructor.designation}</p>
                  <div className="flex gap-4 text-xs text-[#64748b] mb-3">
                    <span>{course.instructor.yearsOfExperience}+ years exp</span>
                    <span>{course.instructor.totalStudents?.toLocaleString()} students</span>
                    <span>{course.instructor.totalCourses} courses</span>
                    <span>⭐ {course.instructor.rating?.toFixed(1)}</span>
                  </div>
                  <p className="text-sm text-[#94a3b8] leading-relaxed">{course.instructor.bio}</p>
                </div>
              </div>
            </div>
          )}

          {/* Reviews */}
          {course.recentReviews?.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-[#e2e8f0] mb-4">Student Reviews</h2>
              <div className="space-y-4">
                {course.recentReviews.map((review) => (
                  <div key={review.id} className="p-4 rounded-xl border border-[#1e293b] bg-[#111827]">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #5C6AC4, #00D4AA)' }}>
                        {review.userName?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#e2e8f0]">{review.userName}</p>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={11} className={i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-[#2d3748]'} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-[#94a3b8]">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Price card (sticky) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl border border-[#1e293b] bg-[#111827] shadow-2xl"
            >
              {/* Course Thumbnail */}
              <div className="relative aspect-video rounded-xl overflow-hidden mb-6 bg-[#0A0F1E] border border-[#1e293b]">
                <img
                  src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format'}
                  alt={course.title}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.dataset.fallback) {
                      target.dataset.fallback = 'true';
                      target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format';
                    }
                  }}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={handleOpenCoursePreview}
                  className="absolute inset-0 bg-black/40 hover:bg-black/20 backdrop-blur-[1px] transition-all flex items-center justify-center group"
                >
                  <div className="w-12 h-12 rounded-full bg-[#5C6AC4] hover:bg-[#00D4AA] text-white flex items-center justify-center shadow-xl transition-transform group-hover:scale-110">
                    <Play size={20} className="fill-white ml-0.5" />
                  </div>
                </button>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-[#e2e8f0]">₹{effectivePrice?.toLocaleString('en-IN')}</span>
                  {course.discountedPrice > 0 && course.discountedPrice < course.originalPrice && (
                    <span className="text-lg text-[#64748b] line-through">₹{course.originalPrice?.toLocaleString('en-IN')}</span>
                  )}
                </div>
                {course.discountPercent > 0 && (
                  <span className="inline-block mt-1 text-sm font-semibold text-emerald-400">
                    {course.discountPercent}% off
                  </span>
                )}
              </div>

              {/* CTAs */}
              <button
                onClick={handleOpenCoursePreview}
                className="w-full py-3 mb-3 rounded-xl font-bold bg-[#5C6AC4]/15 hover:bg-[#5C6AC4]/25 text-[#00D4AA] border border-[#00D4AA]/30 transition-all flex items-center justify-center gap-2 text-sm shadow-md"
              >
                <Play size={16} className="fill-current" />
                <span>Watch Free Course Preview</span>
              </button>

              {isEnrolled ? (
                <button
                  onClick={() => navigate(`/learn/${course.id}`)}
                  className="btn-primary w-full py-3.5 mb-3"
                >
                  Start Learning
                </button>
              ) : (
                <>
                  <button onClick={handleBuyNow} className="btn-primary w-full py-3.5 mb-3">
                    Buy Now
                  </button>
                  <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className={`w-full py-3.5 mb-3 rounded-lg font-semibold border transition-all flex items-center justify-center gap-2 ${
                      inCart
                        ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10 cursor-default'
                        : 'btn-secondary'
                    }`}
                  >
                    <ShoppingCart size={16} />
                    {isAddingToCart ? 'Adding...' : inCart ? 'In Cart — View Cart' : 'Add to Cart'}
                  </button>
                </>
              )}

              <button
                onClick={handleWishlist}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-[#94a3b8] hover:text-[#e2e8f0] rounded-lg hover:bg-white/5 transition-all"
              >
                <Heart size={15} className={wishlisted ? 'text-red-400 fill-red-400' : ''} />
                {wishlisted ? 'Wishlisted' : 'Add to Wishlist'}
              </button>

              {/* Course includes */}
              <div className="mt-6 pt-6 border-t border-[#1e293b] space-y-3">
                <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wide">This course includes:</p>
                {[
                  { icon: <Clock size={14} />, label: `${course.totalDuration} on-demand content` },
                  { icon: <BookOpen size={14} />, label: `${course.totalLessons} lessons` },
                  { icon: <Globe size={14} />, label: course.language },
                  { icon: <Award size={14} />, label: 'Certificate of completion' },
                  { icon: <Check size={14} />, label: 'Lifetime access' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-[#64748b]">
                    <span className="text-[#5C6AC4]">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>

    {/* Course Preview Modal */}
    <CoursePreviewModal
      isOpen={isPreviewOpen}
      onClose={() => setIsPreviewOpen(false)}
      course={course}
      videoUrl={selectedPreviewUrl}
      title={selectedPreviewTitle}
    />
  </div>
  );
}
