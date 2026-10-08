import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  CheckCircle2,
  Circle,
  ArrowLeft,
  ArrowRight,
  Menu,
  X,
  Award,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Loader2,
  FileText,
  Video,
  AlertTriangle,
  RotateCcw,
  Settings
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axiosInstance';
import type { CourseDTO, LessonDTO, CourseProgressDTO } from '../types';

export default function LearnPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<CourseDTO | null>(null);
  const [activeLesson, setActiveLesson] = useState<LessonDTO | null>(null);
  const [progress, setProgress] = useState<CourseProgressDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  // Video player state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  useEffect(() => {
    if (!courseId) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [courseRes, progressRes] = await Promise.all([
          api.get(`/courses/${courseId}`),
          api.get(`/courses/${courseId}/progress`).catch(() => null)
        ]);

        const fetchedCourse: CourseDTO = courseRes.data.data;
        setCourse(fetchedCourse);

        if (progressRes?.data?.data) {
          setProgress(progressRes.data.data);
        }

        if (fetchedCourse.lessons && fetchedCourse.lessons.length > 0) {
          setActiveLesson(fetchedCourse.lessons[0]);
          // Expand all sections by default
          const initialExpanded: Record<string, boolean> = {};
          fetchedCourse.lessons.forEach((l) => {
            const sec = l.sectionName || 'Curriculum Content';
            initialExpanded[sec] = true;
          });
          setExpandedSections(initialExpanded);
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to load course content.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  // Reset video state when active lesson changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setVideoError(null);
    setIsVideoLoading(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.playbackRate = playbackRate;
    }
  }, [activeLesson]);

  const handleToggleComplete = async (lessonId: number) => {
    if (!courseId) return;
    setIsToggling(true);
    try {
      const res = await api.post(`/courses/${courseId}/lessons/${lessonId}/complete`);
      const updatedProgress: CourseProgressDTO = res.data.data;
      setProgress(updatedProgress);

      if (updatedProgress.isCompleted) {
        toast.success('🎉 Congratulations! You have completed all lessons in this course!', { duration: 5000 });
      } else {
        const isNowCompleted = updatedProgress.completedLessonIds.includes(Number(lessonId));
        toast.success(isNowCompleted ? 'Lesson marked as complete!' : 'Lesson status updated');
      }
    } catch (err: any) {
      toast.error('Failed to update lesson progress.');
    } finally {
      setIsToggling(false);
    }
  };

  // Video Controls Handlers
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Playback error:', err);
        setVideoError('Click play to start video playback.');
      });
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    videoRef.current.muted = nextMuted;
  };

  const handleSpeedChange = (rate: number) => {
    setPlaybackRate(rate);
    setShowSpeedMenu(false);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds === 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Lesson Index Navigation Helpers
  const lessons = course?.lessons || [];
  const currentIndex = activeLesson ? lessons.findIndex((l) => l.id === activeLesson.id) : -1;
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < lessons.length - 1;

  const handlePreviousLesson = () => {
    if (hasPrevious) {
      setActiveLesson(lessons[currentIndex - 1]);
    }
  };

  const handleNextLesson = () => {
    if (hasNext) {
      setActiveLesson(lessons[currentIndex + 1]);
    }
  };

  // Group lessons by section
  const sectionsMap: Record<string, LessonDTO[]> = {};
  lessons.forEach((l) => {
    const sec = l.sectionName || 'Curriculum Content';
    if (!sectionsMap[sec]) sectionsMap[sec] = [];
    sectionsMap[sec].push(l);
  });
  const sectionNames = Object.keys(sectionsMap);

  const toggleSection = (secName: string) => {
    setExpandedSections((prev) => ({ ...prev, [secName]: !prev[secName] }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-[#5C6AC4] animate-spin" />
          <span className="text-[#94a3b8] text-sm font-medium">Loading course workspace...</span>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#0A0F1E] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Course Not Found</h2>
        <p className="text-[#94a3b8] mb-6">The requested course is not available or accessible.</p>
        <Link to="/my-courses" className="btn-primary">Back to My Courses</Link>
      </div>
    );
  }

  const completedIds = progress?.completedLessonIds || [];
  const pct = progress?.progressPercentage || 0;
  const isLessonCompleted = activeLesson ? completedIds.includes(activeLesson.id) : false;

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-white flex flex-col select-none">
      {/* Top Header */}
      <header className="h-16 bg-[#111827] border-b border-[#1e293b] px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-[#94a3b8] hover:text-white hover:bg-white/5 rounded-lg transition-colors md:hidden"
            title="Toggle Curriculum"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Link
            to="/my-courses"
            className="flex items-center gap-2 text-sm font-medium text-[#94a3b8] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">My Courses</span>
          </Link>
          <div className="h-4 w-px bg-[#1e293b] hidden sm:block" />
          <h1 className="text-sm md:text-base font-semibold text-white truncate max-w-xs md:max-w-md">
            {course.title}
          </h1>
        </div>

        {/* Course Progress Header Metric */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <div className="flex items-center gap-2 text-xs font-medium text-[#94a3b8]">
              <span>Progress</span>
              <span className="text-[#00D4AA] font-bold">{pct}%</span>
            </div>
            <div className="w-32 h-1.5 bg-[#1e293b] rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-gradient-to-r from-[#5C6AC4] to-[#00D4AA] transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {progress?.isCompleted && (
            <div className="badge-mint px-3 py-1 text-xs flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#00D4AA]" />
              <span className="hidden md:inline font-semibold text-[#00D4AA]">Completed</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Main Video & Lesson Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
          {/* Video Player Box */}
          <div
            ref={playerContainerRef}
            className="relative aspect-video w-full bg-black rounded-2xl overflow-hidden border border-[#1e293b] shadow-2xl group flex flex-col justify-between"
          >
            {/* Video Player (YouTube or HTML5) */}
            {activeLesson?.youtubeVideoId ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(activeLesson.youtubeVideoId)}?rel=0&autoplay=1&enablejsapi=1`}
                title={activeLesson.title}
                className="w-full h-full border-0 rounded-2xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                onError={() => setVideoError('YouTube embedded video player unavailable.')}
              />
            ) : activeLesson?.videoUrl && !videoError ? (
              <video
                ref={videoRef}
                src={activeLesson.videoUrl}
                className="w-full h-full object-contain bg-black cursor-pointer"
                onClick={togglePlay}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onWaiting={() => setIsVideoLoading(true)}
                onCanPlay={() => setIsVideoLoading(false)}
                onLoadStart={() => {
                  setIsVideoLoading(true);
                  setVideoError(null);
                }}
                onLoadedData={() => setIsVideoLoading(false)}
                onError={() => {
                  setIsVideoLoading(false);
                  setVideoError('Unable to load video stream for this lesson.');
                }}
                onEnded={() => setIsPlaying(false)}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#111827] to-[#0A0F1E]">
                <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center mb-4">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {videoError || 'Video content unavailable'}
                </h3>
                <p className="text-xs md:text-sm text-[#94a3b8] max-w-md mb-4">
                  The video preview stream could not be loaded. You can review the lesson overview notes below or proceed to the next lesson.
                </p>
                {activeLesson?.videoUrl && (
                  <button
                    onClick={() => {
                      setVideoError(null);
                      if (videoRef.current) videoRef.current.load();
                    }}
                    className="px-4 py-2 bg-[#5C6AC4] hover:bg-[#4C5AB4] text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retry Video Stream</span>
                  </button>
                )}
              </div>
            )}

            {/* Video Buffer Spinner Overlay (HTML5 Video Only) */}
            {!activeLesson?.youtubeVideoId && isVideoLoading && !videoError && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-none z-10">
                <Loader2 className="w-10 h-10 text-[#00D4AA] animate-spin mb-2" />
                <span className="text-xs text-white/80 font-medium">Loading video stream...</span>
              </div>
            )}

            {/* Video Controls Overlay (HTML5 Video Only) */}
            {!activeLesson?.youtubeVideoId && activeLesson?.videoUrl && !videoError && (
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 space-y-3">
                {/* Seek Bar */}
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#00D4AA] hover:h-2.5 transition-all"
                  />
                </div>

                {/* Controls Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Play/Pause */}
                    <button
                      onClick={togglePlay}
                      className="p-2 text-white hover:text-[#00D4AA] transition-colors focus:outline-none"
                      title={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                    </button>

                    {/* Volume / Mute */}
                    <div className="flex items-center gap-2 group/vol">
                      <button
                        onClick={toggleMute}
                        className="p-1.5 text-white hover:text-[#00D4AA] transition-colors"
                        title={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeX className="w-5 h-5" />
                        ) : (
                          <Volume2 className="w-5 h-5" />
                        )}
                      </button>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-16 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-[#00D4AA]"
                      />
                    </div>

                    {/* Time Counter */}
                    <div className="text-xs text-white/90 font-mono">
                      <span>{formatTime(currentTime)}</span> / <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 relative">
                    {/* Playback Speed Menu */}
                    <div className="relative">
                      <button
                        onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                        className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center gap-1 transition-colors"
                        title="Playback Speed"
                      >
                        <span>{playbackRate}x</span>
                      </button>

                      {showSpeedMenu && (
                        <div className="absolute bottom-8 right-0 bg-[#111827] border border-[#1e293b] rounded-lg p-1 shadow-xl z-30 flex flex-col gap-0.5 min-w-[80px]">
                          {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                            <button
                              key={rate}
                              onClick={() => handleSpeedChange(rate)}
                              className={`px-3 py-1.5 text-xs text-left rounded hover:bg-white/10 transition-colors ${
                                playbackRate === rate ? 'text-[#00D4AA] font-bold bg-[#00D4AA]/10' : 'text-white'
                              }`}
                            >
                              {rate === 1 ? '1.0x Normal' : `${rate}x`}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Fullscreen */}
                    <button
                      onClick={toggleFullscreen}
                      className="p-2 text-white hover:text-[#00D4AA] transition-colors"
                      title="Toggle Fullscreen"
                    >
                      {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Lesson Actions & Navigation Bar */}
          {activeLesson && (
            <div className="bg-[#111827] border border-[#1e293b] rounded-2xl p-6 space-y-6 shadow-lg">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#1e293b] pb-6">
                <div>
                  <div className="text-xs font-bold text-[#00D4AA] uppercase tracking-wider mb-1">
                    {activeLesson.sectionName || 'Curriculum Module'}
                  </div>
                  <h2 className="text-2xl font-bold text-white">{activeLesson.title}</h2>
                  <div className="flex items-center gap-3 mt-2 text-xs text-[#94a3b8]">
                    <span>Duration: {activeLesson.duration || '15 mins'}</span>
                    <span>•</span>
                    <span>Lesson #{activeLesson.displayOrder}</span>
                  </div>
                </div>

                {/* Actions: Prev / Next / Mark Complete */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handlePreviousLesson}
                    disabled={!hasPrevious}
                    className={`px-4 py-2.5 rounded-xl font-medium text-xs flex items-center gap-2 border transition-all ${
                      hasPrevious
                        ? 'border-[#1e293b] bg-[#0A0F1E] hover:bg-white/5 text-white'
                        : 'border-[#1e293b]/50 text-[#64748b] bg-[#0A0F1E]/50 cursor-not-allowed'
                    }`}
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>

                  <button
                    onClick={handleNextLesson}
                    disabled={!hasNext}
                    className={`px-4 py-2.5 rounded-xl font-medium text-xs flex items-center gap-2 border transition-all ${
                      hasNext
                        ? 'border-[#1e293b] bg-[#0A0F1E] hover:bg-white/5 text-white'
                        : 'border-[#1e293b]/50 text-[#64748b] bg-[#0A0F1E]/50 cursor-not-allowed'
                    }`}
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleToggleComplete(activeLesson.id)}
                    disabled={isToggling}
                    className={`px-5 py-2.5 rounded-xl font-semibold text-xs transition-all duration-200 flex items-center justify-center gap-2 ${
                      isLessonCompleted
                        ? 'bg-[#00D4AA]/15 text-[#00D4AA] border border-[#00D4AA]/40 hover:bg-[#00D4AA]/25'
                        : 'btn-primary'
                    }`}
                  >
                    {isToggling ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isLessonCompleted ? (
                      <CheckCircle2 className="w-4 h-4 fill-[#00D4AA] text-[#111827]" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                    <span>{isLessonCompleted ? 'Completed' : 'Mark Complete'}</span>
                  </button>
                </div>
              </div>

              {/* Lesson Description */}
              <div>
                <h4 className="text-sm font-semibold text-[#e2e8f0] mb-2">Lesson Overview</h4>
                <p className="text-sm text-[#94a3b8] leading-relaxed">
                  {activeLesson.description ||
                    'In this lesson, you will master key technical concepts, review real-world examples, and work through guided code walkthroughs.'}
                </p>
              </div>

              {/* Course Resources */}
              <div className="border-t border-[#1e293b] pt-6">
                <h4 className="text-sm font-semibold text-[#e2e8f0] mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#5C6AC4]" />
                  <span>Lesson Resources</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-[#0A0F1E] border border-[#1e293b] rounded-xl flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#5C6AC4]/10 text-[#5C6AC4] flex items-center justify-center">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-white">Source Code & Documentation</div>
                      <div className="text-[11px] text-[#64748b]">Includes guided PDF workbook</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Curriculum Navigation */}
        <aside
          className={`w-full md:w-80 lg:w-96 bg-[#111827] border-l border-[#1e293b] flex flex-col ${
            isSidebarOpen ? 'block' : 'hidden md:block'
          }`}
        >
          <div className="p-4 border-b border-[#1e293b] flex items-center justify-between bg-[#111827]/80 backdrop-blur-sm sticky top-0 z-10">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#00D4AA]" />
              <span>Course Content</span>
            </h3>
            <span className="text-xs text-[#94a3b8] font-mono">
              {completedIds.length} / {lessons.length} Completed
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#1e293b]">
            {sectionNames.length > 0 ? (
              sectionNames.map((secName) => {
                const secLessons = sectionsMap[secName];
                const isExpanded = expandedSections[secName] !== false;

                return (
                  <div key={secName} className="bg-[#111827]">
                    {/* Section Header */}
                    <button
                      onClick={() => toggleSection(secName)}
                      className="w-full p-3.5 bg-[#0A0F1E]/60 hover:bg-[#0A0F1E] border-b border-[#1e293b] flex items-center justify-between text-left transition-colors"
                    >
                      <span className="text-xs font-bold text-[#e2e8f0] tracking-wide truncate max-w-[200px]">
                        {secName}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-[#64748b]">{secLessons.length} lessons</span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-[#64748b]" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-[#64748b]" />
                        )}
                      </div>
                    </button>

                    {/* Section Lessons List */}
                    {isExpanded && (
                      <div className="divide-y divide-[#1e293b]/40">
                        {secLessons.map((lesson) => {
                          const isCompleted = completedIds.includes(lesson.id);
                          const isActive = activeLesson?.id === lesson.id;

                          return (
                            <button
                              key={lesson.id}
                              onClick={() => setActiveLesson(lesson)}
                              className={`w-full p-3.5 text-left flex items-start gap-3 transition-colors ${
                                isActive ? 'bg-[#5C6AC4]/20 border-l-4 border-[#5C6AC4]' : 'hover:bg-white/5'
                              }`}
                            >
                              <div className="mt-0.5 flex-shrink-0">
                                {isCompleted ? (
                                  <CheckCircle2 className="w-4 h-4 text-[#00D4AA]" />
                                ) : (
                                  <Circle className="w-4 h-4 text-[#64748b]" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-0.5">
                                  <span className="text-[10px] text-[#64748b] font-medium">
                                    Lesson {lesson.displayOrder}
                                  </span>
                                  <span className="text-[10px] text-[#64748b] font-mono">
                                    {lesson.duration || '10m'}
                                  </span>
                                </div>
                                <h4
                                  className={`text-xs font-medium line-clamp-2 ${
                                    isActive ? 'text-white font-bold' : 'text-[#e2e8f0]'
                                  }`}
                                >
                                  {lesson.title}
                                </h4>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-6 text-center text-[#64748b] text-sm">No lessons uploaded for this course yet.</div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
