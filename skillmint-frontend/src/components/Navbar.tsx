import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ShoppingCart, Heart, User, LogOut, BookOpen,
  Menu, X, ChevronDown, GraduationCap, Package, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/');
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'glass border-b border-white/5 shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #5C6AC4, #00D4AA)' }}>
                <GraduationCap size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight gradient-text">SkillMint</span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              <Link to="/courses" className="btn-ghost text-sm">Courses</Link>
              <Link to="/courses?type=TECHNOLOGY" className="btn-ghost text-sm">Technology</Link>
              <Link to="/courses?type=MANAGEMENT" className="btn-ghost text-sm">Management</Link>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="hidden lg:flex items-center flex-1 max-w-xs mx-4">
              <div className="relative w-full">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search courses..."
                  className="w-full pl-9 pr-4 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-[#e2e8f0] placeholder-[#64748b] focus:outline-none focus:border-[#5C6AC4]/60 focus:bg-white/8 transition-all"
                />
              </div>
            </form>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  {/* Cart */}
                  <Link to="/cart" className="relative btn-ghost p-2">
                    <ShoppingCart size={20} />
                    {cartCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold text-white rounded-full px-1"
                        style={{ background: 'linear-gradient(135deg, #5C6AC4, #00D4AA)' }}>
                        {cartCount > 9 ? '9+' : cartCount}
                      </span>
                    )}
                  </Link>

                  {/* Wishlist */}
                  <Link to="/wishlist" className="relative btn-ghost p-2 hidden sm:flex">
                    <Heart size={20} />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold text-white rounded-full px-1 bg-red-500">
                        {wishlistCount > 9 ? '9+' : wishlistCount}
                      </span>
                    )}
                  </Link>

                  {/* Profile dropdown */}
                  <div className="relative" ref={profileRef}>
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #5C6AC4, #00D4AA)' }}>
                        {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <ChevronDown size={14} className={`text-[#94a3b8] transition-transform hidden sm:block ${profileOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {profileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-56 bg-[#111827] border border-[#1e293b] rounded-xl shadow-2xl overflow-hidden"
                        >
                          <div className="px-4 py-3 border-b border-[#1e293b]">
                            <p className="text-sm font-semibold text-[#e2e8f0] truncate">{user?.fullName}</p>
                            <p className="text-xs text-[#64748b] truncate">{user?.email}</p>
                          </div>
                          <div className="py-1">
                            {user?.role === 'ADMIN' && (
                              <DropdownLink to="/admin" icon={<ShieldCheck size={15} className="text-[#00D4AA]" />} label="Admin Console" onClick={() => setProfileOpen(false)} />
                            )}
                            <DropdownLink to="/my-courses" icon={<BookOpen size={15} />} label="My Courses" onClick={() => setProfileOpen(false)} />
                            <DropdownLink to="/wishlist" icon={<Heart size={15} />} label="Wishlist" onClick={() => setProfileOpen(false)} />
                            <DropdownLink to="/orders" icon={<Package size={15} />} label="Orders" onClick={() => setProfileOpen(false)} />
                            <DropdownLink to="/profile" icon={<User size={15} />} label="Profile" onClick={() => setProfileOpen(false)} />
                          </div>
                          <div className="py-1 border-t border-[#1e293b]">
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                              <LogOut size={15} />
                              Sign Out
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/signin" className="btn-ghost text-sm hidden sm:flex">Sign In</Link>
                  <Link to="/signup" className="btn-primary text-sm px-4 py-2">Get Started</Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="btn-ghost p-2 md:hidden"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/5 glass"
            >
              <div className="px-4 py-3 space-y-1">
                {/* Mobile search */}
                <form onSubmit={handleSearch} className="relative mb-3">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search courses..."
                    className="w-full pl-9 pr-4 py-2.5 text-sm bg-white/5 border border-white/10 rounded-lg text-[#e2e8f0] placeholder-[#64748b] focus:outline-none focus:border-[#5C6AC4]/60"
                  />
                </form>
                <MobileLink to="/courses" label="All Courses" />
                <MobileLink to="/courses?type=TECHNOLOGY" label="Technology" />
                <MobileLink to="/courses?type=MANAGEMENT" label="Management" />
                {isAuthenticated ? (
                  <>
                    <MobileLink to="/my-courses" label="My Courses" />
                    <MobileLink to="/wishlist" label="Wishlist" />
                    <MobileLink to="/cart" label={`Cart (${cartCount})`} />
                    <MobileLink to="/orders" label="Orders" />
                    <MobileLink to="/profile" label="Profile" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2 pt-2">
                    <Link to="/signin" className="btn-secondary flex-1 text-sm text-center py-2.5">Sign In</Link>
                    <Link to="/signup" className="btn-primary flex-1 text-sm text-center py-2.5">Get Started</Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}

function DropdownLink({ to, icon, label, onClick }: { to: string; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2 text-sm text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-white/5 transition-colors"
    >
      {icon}
      {label}
    </Link>
  );
}

function MobileLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="block px-4 py-2.5 text-sm text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-white/5 rounded-lg transition-colors"
    >
      {label}
    </Link>
  );
}
