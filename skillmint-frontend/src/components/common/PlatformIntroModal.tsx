import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
  CreditCard,
  Award,
  CheckCircle2,
  Users,
  ShieldCheck,
  Code2,
  TrendingUp,
  Laptop
} from 'lucide-react';

interface PlatformIntroModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

const SCENES = [
  {
    id: 'overview',
    title: '1. SkillMint Overview',
    subtitle: 'Next-Gen Technology & Business Learning Platform',
    icon: Sparkles,
    badge: 'LEARN & GROW',
    color: 'from-[#5C6AC4] to-[#00D4AA]',
  },
  {
    id: 'learning-experience',
    title: '2. Course Workspace',
    subtitle: 'Interactive Video Player, Lessons & Progress Tracking',
    icon: BookOpen,
    badge: 'STUDENT DASHBOARD',
    color: 'from-[#3B82F6] to-[#00D4AA]',
  },
  {
    id: 'payment-checkout',
    title: '3. Instant Enrollment',
    subtitle: 'Razorpay Test Checkout & Instant Course Unlocking',
    icon: CreditCard,
    badge: 'RAZORPAY TEST MODE',
    color: 'from-[#10B981] to-[#00D4AA]',
  },
  {
    id: 'instructors',
    title: '4. Mentorship',
    subtitle: 'Learn from Industry Engineers & Management Leaders',
    icon: Users,
    badge: 'EXPERT INSTRUCTORS',
    color: 'from-[#8B5CF6] to-[#EC4899]',
  },
  {
    id: 'credentials',
    title: '5. Verified Credentials',
    subtitle: 'Cryptographic Completion Badges & Certificates',
    icon: Award,
    badge: 'CERTIFICATION',
    color: 'from-[#F59E0B] to-[#10B981]',
  },
];

export default function PlatformIntroModal({
  isOpen,
  onClose,
  title = 'SkillMint Platform Tour & Experience Overview',
}: PlatformIntroModalProps) {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [demoProgress, setDemoProgress] = useState(35);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Auto-advance scene timer
  useEffect(() => {
    if (!isOpen || !isPlaying) return;
    const timer = setInterval(() => {
      setActiveSceneIndex((prev) => (prev + 1) % SCENES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isOpen, isPlaying]);

  if (!isOpen) return null;

  const currentScene = SCENES[activeSceneIndex];

  const handleNext = () => {
    setActiveSceneIndex((prev) => (prev + 1) % SCENES.length);
  };

  const handlePrev = () => {
    setActiveSceneIndex((prev) => (prev - 1 + SCENES.length) % SCENES.length);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-lg"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative w-full max-w-5xl bg-[#0A0F1E] border border-[#1e293b] rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh]"
        >
          {/* Top Bar Header */}
          <div className="px-5 py-4 border-b border-[#1e293b] flex items-center justify-between bg-[#060B14] flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#5C6AC4] to-[#00D4AA] flex items-center justify-center text-white font-bold text-sm shadow-md">
                SM
              </div>
              <div>
                <h3 className="font-extrabold text-white text-sm sm:text-base flex items-center gap-2">
                  <span>{title}</span>
                </h3>
                <p className="text-xs text-[#94a3b8]">
                  Interactive Multi-Scene SkillMint Platform Tour
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 text-[#94a3b8] hover:text-white bg-[#111827] border border-[#1e293b] rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold px-3"
                title={isPlaying ? 'Pause auto-play' : 'Start auto-play'}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-[#00D4AA]" />
                    <span className="hidden sm:inline">Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-[#00D4AA]" />
                    <span className="hidden sm:inline">Auto-Play</span>
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                className="p-2 text-[#94a3b8] hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scene Navigation Tabs */}
          <div className="bg-[#0B1120] border-b border-[#1e293b] px-4 py-2 flex items-center overflow-x-auto no-scrollbar gap-2 flex-shrink-0">
            {SCENES.map((scene, idx) => {
              const Icon = scene.icon;
              const isActive = idx === activeSceneIndex;
              return (
                <button
                  key={scene.id}
                  onClick={() => {
                    setActiveSceneIndex(idx);
                    setIsPlaying(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#5C6AC4]/20 to-[#00D4AA]/20 border border-[#00D4AA]/40 text-white shadow-md'
                      : 'text-[#94a3b8] hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#00D4AA]' : ''}`} />
                  <span>{scene.title}</span>
                </button>
              );
            })}
          </div>

          {/* Main Visual Display Stage */}
          <div className="relative flex-1 p-4 sm:p-8 overflow-y-auto bg-[#070A14] flex flex-col justify-center min-h-[380px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentScene.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-4xl mx-auto"
              >
                {/* Scene Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#5C6AC4]/20 text-[#00D4AA] border border-[#00D4AA]/30 mb-2">
                      <Sparkles className="w-3 h-3" /> {currentScene.badge}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                      {currentScene.subtitle}
                    </h2>
                  </div>
                  <div className="text-xs font-semibold text-[#94a3b8] bg-[#111827] px-3 py-1.5 rounded-lg border border-[#1e293b] self-start sm:self-auto">
                    Scene {activeSceneIndex + 1} / {SCENES.length}
                  </div>
                </div>

                {/* SCENE 1: OVERVIEW */}
                {currentScene.id === 'overview' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="space-y-4">
                      <p className="text-sm text-[#94a3b8] leading-relaxed">
                        SkillMint bridges modern tech stacks (Java, React, Data Science) with corporate management strategies (Product Management, Agile Leadership, Financial Analysis).
                      </p>
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="bg-[#111827] p-3.5 rounded-2xl border border-[#1e293b] flex items-center gap-3">
                          <Code2 className="w-6 h-6 text-[#5C6AC4]" />
                          <div>
                            <div className="text-sm font-bold text-white">Technology</div>
                            <div className="text-xs text-[#94a3b8]">Full-Stack & Cloud</div>
                          </div>
                        </div>
                        <div className="bg-[#111827] p-3.5 rounded-2xl border border-[#1e293b] flex items-center gap-3">
                          <TrendingUp className="w-6 h-6 text-[#00D4AA]" />
                          <div>
                            <div className="text-sm font-bold text-white">Management</div>
                            <div className="text-xs text-[#94a3b8]">Leadership & Product</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#0F172A] border border-[#1e293b] rounded-2xl p-5 shadow-2xl relative overflow-hidden">
                      <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#00D4AA]/20 rounded-full blur-2xl pointer-events-none" />
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1e293b]">
                        <span className="text-xs font-bold text-white flex items-center gap-2">
                          <Laptop className="w-4 h-4 text-[#00D4AA]" /> SkillMint Platform Metrics
                        </span>
                        <span className="text-[10px] text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-full font-bold">
                          LIVE PLATFORM
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-[#1E293B]/50 p-3 rounded-xl border border-[#334155]">
                          <div className="text-lg font-black text-white">10K+</div>
                          <div className="text-[10px] text-[#94a3b8]">Active Learners</div>
                        </div>
                        <div className="bg-[#1E293B]/50 p-3 rounded-xl border border-[#334155]">
                          <div className="text-lg font-black text-[#00D4AA]">98.4%</div>
                          <div className="text-[10px] text-[#94a3b8]">Satisfaction</div>
                        </div>
                        <div className="bg-[#1E293B]/50 p-3 rounded-xl border border-[#334155]">
                          <div className="text-lg font-black text-[#5C6AC4]">25+</div>
                          <div className="text-[10px] text-[#94a3b8]">Pro Courses</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SCENE 2: COURSE WORKSPACE */}
                {currentScene.id === 'learning-experience' && (
                  <div className="bg-[#0F172A] border border-[#1e293b] rounded-2xl p-4 sm:p-5 shadow-2xl">
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1e293b]">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                        <span className="text-xs font-semibold text-[#94a3b8] ml-2">
                          SkillMint Interactive Workspace — Spring Boot & Microservices
                        </span>
                      </div>
                      <span className="text-xs text-[#00D4AA] font-bold">
                        {demoProgress}% Complete
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Sidebar Modules */}
                      <div className="bg-[#0A0F1E] border border-[#1e293b] rounded-xl p-3 space-y-2 text-xs">
                        <div className="font-bold text-white mb-2">Course Modules</div>
                        <div className="p-2 rounded-lg bg-[#5C6AC4]/20 border border-[#5C6AC4]/40 text-white flex items-center justify-between">
                          <span className="truncate">1. Spring Boot & REST APIs</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#00D4AA]" />
                        </div>
                        <div className="p-2 rounded-lg bg-[#111827] border border-[#1e293b] text-[#94a3b8] flex items-center justify-between">
                          <span className="truncate">2. Razorpay Webhooks</span>
                          <Play className="w-3.5 h-3.5 text-[#5C6AC4]" />
                        </div>
                        <div className="p-2 rounded-lg bg-[#111827] border border-[#1e293b] text-[#94a3b8]">
                          <span className="truncate">3. MySQL Migrations</span>
                        </div>
                      </div>

                      {/* Video Player Demo Screen */}
                      <div className="md:col-span-2 bg-[#060B14] border border-[#1e293b] rounded-xl p-4 flex flex-col justify-between aspect-video relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#5C6AC4]/10 via-transparent to-[#00D4AA]/10" />
                        <div className="relative z-10 flex items-center justify-between">
                          <span className="text-xs font-bold text-white bg-black/60 px-2.5 py-1 rounded-md">
                            Lesson 2.1 — Integrating Razorpay Webhooks
                          </span>
                          <span className="text-[10px] text-[#00D4AA] bg-[#00D4AA]/10 px-2 py-0.5 rounded-full font-bold">
                            HD 1080p
                          </span>
                        </div>
                        <div className="relative z-10 flex flex-col items-center justify-center my-auto">
                          <div className="w-14 h-14 rounded-full bg-[#00D4AA]/20 border border-[#00D4AA] flex items-center justify-center text-[#00D4AA] shadow-lg mb-2">
                            <Play className="w-6 h-6 fill-current ml-1" />
                          </div>
                          <span className="text-xs font-semibold text-white">
                            Interactive HD Video Player & Code Walkthrough
                          </span>
                        </div>
                        <div className="relative z-10 space-y-1">
                          <div className="flex justify-between text-[10px] text-[#94a3b8]">
                            <span>04:12 / 12:45</span>
                            <span>Interactive Notes & Quiz</span>
                          </div>
                          <div className="w-full bg-[#1E293B] h-1.5 rounded-full overflow-hidden">
                            <div className="bg-gradient-to-r from-[#5C6AC4] to-[#00D4AA] h-full w-[35%]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SCENE 3: RAZORPAY CHECKOUT */}
                {currentScene.id === 'payment-checkout' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="space-y-4">
                      <h4 className="text-xl font-bold text-white">
                        Seamless & Secure Razorpay Test Payments
                      </h4>
                      <p className="text-sm text-[#94a3b8] leading-relaxed">
                        Experience real-time payment idempotency, instant order verification, and automatic email receipt notifications right in Razorpay Test Mode.
                      </p>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2 text-white">
                          <CheckCircle2 className="w-4 h-4 text-[#00D4AA]" />
                          <span>Test Cards & Netbanking Supported</span>
                        </div>
                        <div className="flex items-center gap-2 text-white">
                          <CheckCircle2 className="w-4 h-4 text-[#00D4AA]" />
                          <span>Instant Webhook Idempotency Validation</span>
                        </div>
                        <div className="flex items-center gap-2 text-white">
                          <CheckCircle2 className="w-4 h-4 text-[#00D4AA]" />
                          <span>Immediate Course Access Unlocked</span>
                        </div>
                      </div>
                    </div>

                    {/* Razorpay Test Modal Simulation */}
                    <div className="bg-[#0F172A] border border-[#10B981]/40 rounded-2xl p-5 shadow-2xl relative">
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1e293b]">
                        <div className="flex items-center gap-2 text-xs font-bold text-white">
                          <CreditCard className="w-4 h-4 text-[#10B981]" />
                          <span>Razorpay Checkout (Test Mode)</span>
                        </div>
                        <span className="text-[10px] bg-[#10B981]/20 text-[#10B981] px-2 py-0.5 rounded font-bold">
                          SECURE
                        </span>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div className="bg-[#111827] p-3 rounded-xl border border-[#1e293b] flex justify-between items-center">
                          <div>
                            <div className="font-semibold text-white">
                              Full-Stack Java & Microservices
                            </div>
                            <div className="text-[10px] text-[#94a3b8]">Order ID: order_N91xKz3m4P</div>
                          </div>
                          <div className="text-sm font-black text-[#00D4AA]">₹4,999.00</div>
                        </div>

                        <button
                          onClick={() => setPaymentSuccess(!paymentSuccess)}
                          className={`w-full py-2.5 rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-2 ${
                            paymentSuccess
                              ? 'bg-[#10B981] text-black shadow-lg shadow-[#10B981]/30'
                              : 'bg-gradient-to-r from-[#5C6AC4] to-[#00D4AA] text-white hover:opacity-90'
                          }`}
                        >
                          {paymentSuccess ? (
                            <>
                              <ShieldCheck className="w-4 h-4" />
                              <span>Payment Verified — Course Unlocked!</span>
                            </>
                          ) : (
                            <>
                              <CreditCard className="w-4 h-4" />
                              <span>Simulate Successful Razorpay Payment</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* SCENE 4: MENTORSHIP */}
                {currentScene.id === 'instructors' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-[#0F172A] border border-[#1e293b] rounded-2xl p-5 flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#5C6AC4] to-[#00D4AA] flex items-center justify-center font-bold text-white text-lg flex-shrink-0">
                        DR
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-base">Dr. Alex Rivera</h4>
                          <span className="bg-[#5C6AC4]/20 text-[#00D4AA] text-[10px] font-bold px-2 py-0.5 rounded-full">
                            VERIFIED MENTOR
                          </span>
                        </div>
                        <p className="text-xs text-[#5C6AC4] font-medium mt-0.5">
                          Ex-Google Staff Engineer & Microservices Architect
                        </p>
                        <p className="text-xs text-[#94a3b8] mt-2">
                          12+ years of enterprise Java, Spring Boot, Distributed Systems, and Cloud Native deployment experience.
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#0F172A] border border-[#1e293b] rounded-2xl p-5 flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#8B5CF6] to-[#EC4899] flex items-center justify-center font-bold text-white text-lg flex-shrink-0">
                        SM
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-base">Sarah Chen, MBA</h4>
                          <span className="bg-[#8B5CF6]/20 text-[#EC4899] text-[10px] font-bold px-2 py-0.5 rounded-full">
                            VERIFIED MENTOR
                          </span>
                        </div>
                        <p className="text-xs text-[#EC4899] font-medium mt-0.5">
                          Ex-McKinsey Principal & Tech Lead
                        </p>
                        <p className="text-xs text-[#94a3b8] mt-2">
                          Specializes in Agile Leadership, Product Strategy, Product Operations, and Corporate Financial Analysis.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* SCENE 5: CERTIFICATE */}
                {currentScene.id === 'credentials' && (
                  <div className="bg-gradient-to-br from-[#0F172A] via-[#111827] to-[#0A0F1E] border border-[#F59E0B]/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden max-w-2xl mx-auto">
                    <div className="text-center space-y-3">
                      <div className="inline-flex p-3 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30">
                        <Award className="w-8 h-8" />
                      </div>
                      <div className="text-xs font-bold text-[#F59E0B] tracking-widest uppercase">
                        Official SkillMint Certificate of Completion
                      </div>
                      <h3 className="text-xl font-black text-white">
                        Mastery in Full-Stack Java & Microservices Architecture
                      </h3>
                      <p className="text-xs text-[#94a3b8]">
                        Issued to <span className="text-white font-bold">Verified SkillMint Graduate</span> upon completing all course lessons, assignments, and capstone project.
                      </p>
                      <div className="pt-4 border-t border-[#1e293b] flex items-center justify-between text-[11px] text-[#94a3b8]">
                        <span>Verification ID: <strong className="text-white">SKM-2026-88F9A</strong></span>
                        <span className="text-[#10B981] font-bold flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> Cryptographically Verified
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Bar Navigation Controls */}
          <div className="px-5 py-4 border-t border-[#1e293b] bg-[#060B14] flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="btn-ghost p-2 text-xs font-semibold flex items-center gap-1 text-[#94a3b8] hover:text-white"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
              <button
                onClick={handleNext}
                className="btn-secondary px-4 py-2 text-xs font-semibold flex items-center gap-1"
              >
                <span>Next Scene</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              {activeSceneIndex === SCENES.length - 1 ? (
                <button
                  onClick={onClose}
                  className="btn-primary py-2 px-5 text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-[#5C6AC4]/30"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start Learning on SkillMint</span>
                </button>
              ) : (
                <button
                  onClick={() => setActiveSceneIndex(SCENES.length - 1)}
                  className="text-xs text-[#94a3b8] hover:text-white underline font-medium"
                >
                  Skip to Certificate
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
