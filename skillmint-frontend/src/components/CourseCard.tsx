import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Clock, Users, BookOpen, Heart, TrendingUp, Sparkles, Play } from 'lucide-react';
import type { CourseCard } from '../types';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import CoursePreviewModal from './common/CoursePreviewModal';
import toast from 'react-hot-toast';

interface CourseCardProps {
  course: CourseCard;
  index?: number;
}

const levelColors: Record<string, string> = {
  BEGINNER: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  INTERMEDIATE: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  ADVANCED: 'text-red-400 bg-red-500/10 border-red-500/20',
};

function formatPrice(price: number) {
  return `₹${price.toLocaleString('en-IN')}`;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={12}
          className={star <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-[#2d3748] fill-[#2d3748]'}
        />
      ))}
    </div>
  );
}

export default function CourseCardComponent({ course, index = 0 }: CourseCardProps) {
  const { isAuthenticated } = useAuth();
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const inCart = isInCart(course.id);
  const wishlisted = isInWishlist(course.id);

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please sign in to add to wishlist');
      return;
    }
    try {
      const added = await toggleWishlist(course.id);
      toast.success(added ? 'Added to wishlist' : 'Removed from wishlist');
    } catch {
      toast.error('Something went wrong');
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please sign in to add to cart');
      return;
    }
    if (inCart) return;
    try {
      setIsAddingToCart(true);
      await addToCart(course.id);
      toast.success('Added to cart!');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleOpenPreview = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPreviewOpen(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
      >
        <Link to={`/courses/${course.id}`} className="block group">
          <div className="card overflow-hidden h-full flex flex-col">
            {/* Thumbnail */}
            <div className="relative overflow-hidden aspect-video bg-[#0A0F1E]">
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
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              {/* Overlay Hover Preview Button */}
              <button
                onClick={handleOpenPreview}
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 text-white font-bold text-xs"
              >
                <div className="w-10 h-10 rounded-full bg-[#5C6AC4] hover:bg-[#00D4AA] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110">
                  <Play size={18} className="fill-white ml-0.5" />
                </div>
                <span className="bg-black/70 px-3 py-1 rounded-full border border-white/20 text-[11px]">
                  Preview Course
                </span>
              </button>

              {/* Badges */}
              <div className="absolute top-2 left-2 flex items-center gap-1.5 pointer-events-none">
                {course.featured && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-[#0A0F1E]"
                    style={{ background: 'linear-gradient(135deg, #5C6AC4, #00D4AA)' }}>
                    <Sparkles size={9} />
                    FEATURED
                  </span>
                )}
                {course.trending && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/90 text-white">
                    <TrendingUp size={9} />
                    TRENDING
                  </span>
                )}
              </div>
              {/* Discount badge */}
              {course.discountPercent > 0 && (
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white pointer-events-none">
                  -{course.discountPercent}%
                </div>
              )}
              {/* Wishlist button */}
              <button
                onClick={handleWishlist}
                className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-black/70 hover:scale-110 z-10"
              >
                <Heart
                  size={14}
                  className={wishlisted ? 'text-red-400 fill-red-400' : 'text-white'}
                />
              </button>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-4">
              {/* Category + Level */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#5C6AC4] font-medium truncate">
                  {course.category?.name}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${levelColors[course.level] || 'text-[#94a3b8] bg-white/5 border-white/10'}`}>
                  {course.level}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-sm font-semibold text-[#e2e8f0] leading-snug mb-1 line-clamp-2 group-hover:text-white transition-colors">
                {course.title}
              </h3>

              {/* Subtitle */}
              <p className="text-xs text-[#64748b] line-clamp-1 mb-3">
                {course.subtitle}
              </p>

              {/* Instructor */}
              <p className="text-xs text-[#94a3b8] mb-3">
                by <span className="text-[#7B89D4]">{course.instructor?.name}</span>
              </p>

              {/* Stats */}
              <div className="flex items-center gap-3 text-xs text-[#64748b] mb-3">
                <div className="flex items-center gap-1">
                  <Clock size={11} />
                  <span>{course.totalDuration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen size={11} />
                  <span>{course.totalLessons} lessons</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={11} />
                  <span>{course.totalStudents?.toLocaleString()}</span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-bold text-amber-400">{course.rating?.toFixed(1)}</span>
                <StarRating rating={course.rating} />
                <span className="text-xs text-[#64748b]">({course.totalReviews?.toLocaleString()})</span>
              </div>

              {/* Price + CTA */}
              <div className="mt-auto flex items-center justify-between gap-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-[#e2e8f0]">
                    {formatPrice(course.discountedPrice || course.originalPrice)}
                  </span>
                  {course.discountedPrice > 0 && course.discountedPrice < course.originalPrice && (
                    <span className="text-xs text-[#64748b] line-through">
                      {formatPrice(course.originalPrice)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleOpenPreview}
                    className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-[#5C6AC4]/40 bg-[#5C6AC4]/10 hover:bg-[#5C6AC4]/20 text-[#00D4AA] transition-all flex items-center gap-1"
                    title="Preview Course"
                  >
                    <Play size={11} className="fill-current" />
                    <span>Preview</span>
                  </button>
                  <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || inCart}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                      inCart
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 cursor-default'
                        : 'btn-primary text-xs px-3 py-1.5'
                    }`}
                  >
                    {isAddingToCart ? '...' : inCart ? '✓ In Cart' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Course Preview Modal */}
      <CoursePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        course={course}
      />
    </>
  );
}
