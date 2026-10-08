import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import CourseCardComponent from '../components/CourseCard';

export default function WishlistPage() {
  const { wishlist, isLoading, error, refetchWishlist } = useWishlist();

  useEffect(() => {
    document.title = 'Wishlist – SkillMint';
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-[#e2e8f0] mb-2">My Wishlist</h1>
        <p className="text-[#64748b] mb-8">Loading your saved courses...</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => <div key={i} className="h-80 bg-[#111827] rounded-xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-[#e2e8f0] mb-2">My Wishlist</h1>
        <div className="flex flex-col items-center justify-center py-16 text-center bg-[#111827] border border-red-500/20 rounded-2xl p-8 mt-6">
          <h2 className="text-xl font-bold text-red-400 mb-2">Unable to load wishlist</h2>
          <p className="text-[#94a3b8] mb-6 text-sm max-w-md">{error}</p>
          <button onClick={() => refetchWishlist()} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-[#e2e8f0] mb-2">My Wishlist</h1>
      <p className="text-[#64748b] mb-8">{wishlist.length} saved course{wishlist.length !== 1 ? 's' : ''}</p>

      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 border border-[#1e293b] bg-[#111827]">
            <Heart size={32} className="text-[#2d3748]" />
          </div>
          <h2 className="text-xl font-bold text-[#94a3b8] mb-2">Your wishlist is empty</h2>
          <p className="text-[#64748b] mb-6 text-sm">Save courses you're interested in</p>
          <Link to="/courses" className="btn-primary">Browse Courses</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {wishlist.map((course, i) => (
            <CourseCardComponent key={course.id} course={course} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
