import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, AlertCircle, VideoOff, BookOpen, Clock, User, Sparkles } from 'lucide-react';
import type { CourseCard, Course } from '../../types';

interface CoursePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  course?: CourseCard | Course | null;
  videoUrl?: string;
  title?: string;
}

export default function CoursePreviewModal({
  isOpen,
  onClose,
  course,
  videoUrl,
  title,
}: CoursePreviewModalProps) {
  const [hasError, setHasError] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const effectiveTitle = title || course?.title || 'Course Preview';
  const effectiveUrl = videoUrl || course?.previewVideoUrl;

  // Reset state on open/change
  useEffect(() => {
    if (isOpen) {
      setHasError(false);
      setPlaybackSpeed(1);
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
  }, [isOpen, effectiveUrl]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle Speed Change
  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative w-full max-w-4xl bg-[#0A0F1E] border border-[#1e293b] rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-[#1e293b] flex items-center justify-between bg-[#060B14] flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#5C6AC4] to-[#00D4AA] flex items-center justify-center text-white font-bold text-xs shadow-md">
                <Play className="w-4 h-4 fill-white ml-0.5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold tracking-wider text-[#00D4AA] bg-[#00D4AA]/10 px-2 py-0.5 rounded-full border border-[#00D4AA]/20 uppercase">
                    COURSE PREVIEW
                  </span>
                  {course?.category?.name && (
                    <span className="text-[10px] text-[#94a3b8] hidden sm:inline">
                      • {course.category.name}
                    </span>
                  )}
                </div>
                <h3 className="font-extrabold text-white text-sm sm:text-base truncate max-w-lg mt-0.5">
                  {effectiveTitle}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-[#94a3b8] hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              aria-label="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Content Area */}
          <div className="relative flex-1 p-4 sm:p-6 bg-[#070A14] flex flex-col justify-center items-center overflow-y-auto min-h-[320px]">
            {!effectiveUrl ? (
              /* Missing Preview URL state */
              <div className="text-center p-8 max-w-md space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                  <VideoOff className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">Preview Not Available</h4>
                  <p className="text-xs text-[#94a3b8] leading-relaxed">
                    Preview not available for this course. You can view the complete curriculum and course details on the course page.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="btn-secondary text-xs px-5 py-2.5 rounded-xl font-semibold"
                >
                  Close Preview
                </button>
              </div>
            ) : hasError ? (
              /* Video Load Error state */
              <div className="text-center p-8 max-w-md space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">Unable to load preview video</h4>
                  <p className="text-xs text-[#94a3b8] leading-relaxed">
                    The video preview stream could not be loaded. Please check your network connection or try again later.
                  </p>
                </div>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setHasError(false)}
                    className="btn-primary text-xs px-4 py-2 rounded-xl font-semibold"
                  >
                    Retry Loading
                  </button>
                  <button
                    onClick={onClose}
                    className="btn-secondary text-xs px-4 py-2 rounded-xl font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              /* Video Player Display */
              <div className="w-full space-y-4">
                <div className="relative aspect-video w-full bg-black rounded-2xl overflow-hidden border border-[#1e293b] shadow-2xl group">
                  <video
                    ref={videoRef}
                    src={effectiveUrl}
                    controls
                    autoPlay={false}
                    preload="metadata"
                    onError={() => setHasError(true)}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Speed Controls & Details Footer */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-[#0A0F1E] p-3 rounded-xl border border-[#1e293b]">
                  <div className="flex items-center gap-4 text-[#94a3b8]">
                    {course?.instructor?.name && (
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#5C6AC4]" />
                        <strong className="text-white">{course.instructor.name}</strong>
                      </span>
                    )}
                    {course?.totalDuration && (
                      <span className="flex items-center gap-1.5 hidden sm:flex">
                        <Clock className="w-3.5 h-3.5 text-[#00D4AA]" />
                        <span>{course.totalDuration} Total Course</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#64748b]">Speed:</span>
                    {[0.75, 1, 1.25, 1.5, 2].map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSpeedChange(s)}
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                          playbackSpeed === s
                            ? 'bg-[#5C6AC4] text-white'
                            : 'bg-[#111827] text-[#94a3b8] hover:text-white border border-[#1e293b]'
                        }`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
