import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { courseApi, categoryApi } from '../api/services';
import type { CourseCard, Category, PagedResponse } from '../types';
import CourseCardComponent from '../components/CourseCard';
import ContextualBackground, { type BackgroundVariant } from '../components/motion/ContextualBackground';

const LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
const SORTS = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

export default function CoursesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState<CourseCard[]>([]);
  const [paged, setPaged] = useState<PagedResponse<CourseCard> | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Filter state from URL
  const q = searchParams.get('q') || '';
  const typeParam = searchParams.get('type') || '';
  const categoryId = searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : undefined;
  const level = searchParams.get('level') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = Number(searchParams.get('page') || 0);

  const [searchInput, setSearchInput] = useState(q);

  // Selected Category Object
  const selectedCategory = categories.find((c) => c.id === categoryId);

  // Determine Background Theme Variant
  let backgroundVariant: BackgroundVariant = 'GENERAL';
  if (typeParam === 'TECHNOLOGY') {
    backgroundVariant = 'TECHNOLOGY';
  } else if (typeParam === 'MANAGEMENT') {
    backgroundVariant = 'MANAGEMENT';
  }

  useEffect(() => {
    document.title = 'Browse Courses – SkillMint';
    if (typeParam === 'TECHNOLOGY' || typeParam === 'MANAGEMENT') {
      categoryApi.getByType(typeParam as 'TECHNOLOGY' | 'MANAGEMENT')
        .then((r) => setCategories(r.data.data || []));
    } else {
      categoryApi.getAll().then((r) => setCategories(r.data.data || []));
    }
  }, [typeParam]);

  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await courseApi.getAll({
        q: q || undefined,
        type: typeParam || undefined,
        categoryId,
        level: level || undefined,
        sort,
        page,
        size: 12
      });
      const data = res.data.data;
      setCourses(data?.content || []);
      setPaged(data || null);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to load courses';
      setError(msg);
      setCourses([]);
      setPaged(null);
    } finally {
      setIsLoading(false);
    }
  }, [q, typeParam, categoryId, level, sort, page]);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);
  useEffect(() => { setSearchInput(q); }, [q]);

  const updateParam = (key: string, value: string | undefined) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    // Reset page to 0 whenever filters, search, or sorting change
    next.delete('page');
    setSearchParams(next);
  };

  const changePage = (newPage: number) => {
    const next = new URLSearchParams(searchParams);
    if (newPage > 0) {
      next.set('page', String(newPage));
    } else {
      next.delete('page');
    }
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam('q', searchInput.trim() || undefined);
  };

  const clearFilters = () => {
    setSearchParams({});
    setSearchInput('');
  };

  const hasFilters = !!(q || typeParam || categoryId || level);

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* Contextual Animated Background */}
      <ContextualBackground
        variant={backgroundVariant}
        categoryName={selectedCategory?.name}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="badge-indigo uppercase tracking-wider text-xs">
              {typeParam ? `${typeParam} MARKETPLACE` : 'EXPLORE MARKETPLACE'}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {typeParam === 'TECHNOLOGY'
              ? 'Technology & Engineering Courses'
              : typeParam === 'MANAGEMENT'
              ? 'Management & Business Courses'
              : selectedCategory
              ? `${selectedCategory.name} Courses`
              : 'Browse All Courses'}
          </h1>
          <p className="text-[#94a3b8] text-sm mt-1">
            {paged ? `${paged.totalElements.toLocaleString()} courses available` : 'Discover practical skills that accelerate your career'}
          </p>
        </div>

        {/* Search + Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search courses..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#0A0F1E]/90 border border-[#1e293b] rounded-xl text-white placeholder-[#64748b] text-sm focus:outline-none focus:border-[#00D4AA]"
            />
          </form>
          <div className="flex gap-2">
            <select
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="bg-[#0A0F1E]/90 border border-[#1e293b] rounded-xl px-4 py-2 text-sm text-white cursor-pointer focus:outline-none focus:border-[#00D4AA]"
            >
              {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`btn-secondary flex items-center gap-2 px-4 py-2 rounded-xl text-sm ${sidebarOpen ? 'border-[#00D4AA] text-[#00D4AA]' : ''}`}
            >
              <SlidersHorizontal size={16} />
              <span className="hidden sm:inline">Filters</span>
              {hasFilters && <span className="w-2 h-2 bg-[#00D4AA] rounded-full" />}
            </button>
            {hasFilters && (
              <button onClick={clearFilters} className="btn-ghost p-2 text-red-400 hover:text-red-300">
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.aside
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 260 }}
                exit={{ opacity: 0, width: 0 }}
                className="flex-shrink-0 overflow-hidden"
              >
                <div className="w-[260px] space-y-6">
                  {/* Category */}
                  <FilterSection title="Category">
                    <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                      <button
                        onClick={() => updateParam('categoryId', undefined)}
                        className={`w-full text-left px-3 py-1.5 text-sm rounded-lg transition-colors ${!categoryId ? 'bg-[#5C6AC4]/20 text-[#00D4AA] font-bold' : 'text-[#94a3b8] hover:text-white hover:bg-white/5'}`}
                      >
                        All Categories
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => updateParam('categoryId', String(cat.id))}
                          className={`w-full text-left px-3 py-1.5 text-sm rounded-lg transition-colors ${categoryId === cat.id ? 'bg-[#5C6AC4]/20 text-[#00D4AA] font-bold' : 'text-[#94a3b8] hover:text-white hover:bg-white/5'}`}
                        >
                          {cat.name}
                          <span className="text-xs text-[#64748b] ml-1">({cat.courseCount})</span>
                        </button>
                      ))}
                    </div>
                  </FilterSection>

                  {/* Level */}
                  <FilterSection title="Level">
                    <div className="space-y-1.5">
                      <button
                        onClick={() => updateParam('level', undefined)}
                        className={`w-full text-left px-3 py-1.5 text-sm rounded-lg transition-colors ${!level ? 'bg-[#5C6AC4]/20 text-[#00D4AA] font-bold' : 'text-[#94a3b8] hover:text-white hover:bg-white/5'}`}
                      >
                        All Levels
                      </button>
                      {LEVELS.map((l) => (
                        <button
                          key={l}
                          onClick={() => updateParam('level', l)}
                          className={`w-full text-left px-3 py-1.5 text-sm rounded-lg transition-colors capitalize ${level === l ? 'bg-[#5C6AC4]/20 text-[#00D4AA] font-bold' : 'text-[#94a3b8] hover:text-white hover:bg-white/5'}`}
                        >
                          {l.charAt(0) + l.slice(1).toLowerCase()}
                        </button>
                      ))}
                    </div>
                  </FilterSection>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Course Grid */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-2xl bg-[#0A0F1E] border border-[#1e293b] overflow-hidden animate-pulse">
                    <div className="aspect-video bg-[#1e293b]" />
                    <div className="p-4 space-y-3">
                      <div className="h-3 bg-[#1e293b] rounded w-1/3" />
                      <div className="h-4 bg-[#1e293b] rounded w-full" />
                      <div className="h-3 bg-[#1e293b] rounded w-3/4" />
                      <div className="h-6 bg-[#1e293b] rounded w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-24 text-center bg-[#0A0F1E]/80 border border-red-500/20 rounded-3xl backdrop-blur-md">
                <h3 className="text-xl font-bold text-red-400 mb-2">Unable to load courses</h3>
                <p className="text-[#94a3b8] mb-6 text-sm max-w-md">{error}</p>
                <button onClick={() => fetchCourses()} className="btn-primary py-2.5 px-6 text-sm">Try Again</button>
              </div>
            ) : courses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center bg-[#0A0F1E]/80 border border-[#1e293b] rounded-3xl backdrop-blur-md">
                <Search size={48} className="text-[#64748b] mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No courses found</h3>
                <p className="text-[#94a3b8] mb-6 text-sm">Try adjusting your filters or search query</p>
                <button onClick={clearFilters} className="btn-primary py-2.5 px-6 text-sm">Clear Filters</button>
              </div>
            ) : (
              <>
                <div className={`grid gap-5 ${sidebarOpen ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
                  {courses.map((course, i) => (
                    <CourseCardComponent key={course.id} course={course} index={i} />
                  ))}
                </div>

                {/* Pagination */}
                {paged && paged.totalPages > 1 && (
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-12">
                    <button
                      disabled={paged.first}
                      onClick={() => changePage(page - 1)}
                      className="btn-secondary px-4 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
                    >
                      Previous
                    </button>
                    <div className="flex items-center gap-1 overflow-x-auto py-1">
                      {[...Array(paged.totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => changePage(i)}
                          className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                            i === paged.number
                              ? 'bg-[#5C6AC4] text-white font-bold shadow-md shadow-[#5C6AC4]/30'
                              : 'text-[#94a3b8] hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <button
                      disabled={paged.last}
                      onClick={() => changePage(page + 1)}
                      className="btn-secondary px-4 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-[#0A0F1E]/90 border border-[#1e293b] rounded-xl overflow-hidden backdrop-blur-md">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold text-white hover:bg-white/5 transition-colors"
      >
        {title}
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-3 pb-3">{children}</div>}
    </div>
  );
}
