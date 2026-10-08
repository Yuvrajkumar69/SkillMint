import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  FolderTree,
  UserCheck,
  Video,
  Users,
  ShoppingBag,
  CreditCard,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  TrendingUp,
  Award,
  DollarSign,
  Loader2,
  Search,
  Eye
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axiosInstance';
import type { CourseCardDTO, CategoryDTO, InstructorDTO } from '../types';
import ContextualBackground from '../components/motion/ContextualBackground';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'categories' | 'instructors' | 'users' | 'orders'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [courses, setCourses] = useState<CourseCardDTO[]>([]);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    subtitle: '',
    description: '',
    originalPrice: 1999,
    discountedPrice: 499,
    level: 'BEGINNER',
    type: 'TECHNOLOGY',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    previewVideoUrl: '/assets/videos/sample-course-preview.mp4'
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, coursesRes, categoriesRes, usersRes, ordersRes] = await Promise.all([
        api.get('/admin/stats').catch(() => null),
        api.get('/courses?size=50'),
        api.get('/categories'),
        api.get('/admin/users').catch(() => null),
        api.get('/admin/orders').catch(() => null)
      ]);

      if (statsRes?.data?.data) setStats(statsRes.data.data);
      if (coursesRes?.data?.data?.content) setCourses(coursesRes.data.data.content);
      if (categoriesRes?.data?.data) setCategories(categoriesRes.data.data);
      if (usersRes?.data?.data?.content) setUsers(usersRes.data.data.content);
      if (ordersRes?.data?.data?.content) setOrders(ordersRes.data.data.content);
    } catch (err: any) {
      toast.error('Failed to load admin dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/courses', newCourse);
      toast.success('Course created successfully!');
      setShowCourseModal(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create course');
    }
  };

  const handleDeleteCourse = async (id: number) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      await api.delete(`/admin/courses/${id}`);
      toast.success('Course deleted');
      fetchData();
    } catch (err: any) {
      toast.error('Failed to delete course');
    }
  };

  const handleToggleUser = async (userId: number) => {
    try {
      await api.put(`/admin/users/${userId}/toggle-status`);
      toast.success('User status updated');
      fetchData();
    } catch (err: any) {
      toast.error('Failed to update user status');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-[#5C6AC4] animate-spin" />
          <span className="text-[#94a3b8] text-sm">Loading Admin Console...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <ContextualBackground variant="ADMIN" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1e293b] pb-6">
        <div>
          <div className="badge-indigo mb-2">Admin Control Center</div>
          <h1 className="text-3xl font-bold text-white">SkillMint Dashboard</h1>
        </div>
        <button
          onClick={() => setShowCourseModal(true)}
          className="btn-primary py-3 px-5 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Course</span>
        </button>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-[#111827] border border-[#1e293b] rounded-2xl p-5">
          <div className="flex items-center justify-between text-[#94a3b8] mb-2 text-xs font-medium uppercase tracking-wider">
            <span>Total Revenue</span>
            <DollarSign className="w-4 h-4 text-[#00D4AA]" />
          </div>
          <div className="text-2xl font-bold text-white">₹{stats?.totalRevenue?.toLocaleString('en-IN') || 0}</div>
        </div>
        <div className="bg-[#111827] border border-[#1e293b] rounded-2xl p-5">
          <div className="flex items-center justify-between text-[#94a3b8] mb-2 text-xs font-medium uppercase tracking-wider">
            <span>Total Courses</span>
            <BookOpen className="w-4 h-4 text-[#5C6AC4]" />
          </div>
          <div className="text-2xl font-bold text-white">{stats?.totalCourses || courses.length}</div>
        </div>
        <div className="bg-[#111827] border border-[#1e293b] rounded-2xl p-5">
          <div className="flex items-center justify-between text-[#94a3b8] mb-2 text-xs font-medium uppercase tracking-wider">
            <span>Active Users</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats?.totalUsers || users.length}</div>
        </div>
        <div className="bg-[#111827] border border-[#1e293b] rounded-2xl p-5">
          <div className="flex items-center justify-between text-[#94a3b8] mb-2 text-xs font-medium uppercase tracking-wider">
            <span>Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats?.totalOrders || orders.length}</div>
        </div>
        <div className="bg-[#111827] border border-[#1e293b] rounded-2xl p-5">
          <div className="flex items-center justify-between text-[#94a3b8] mb-2 text-xs font-medium uppercase tracking-wider">
            <span>Enrollments</span>
            <Award className="w-4 h-4 text-[#00D4AA]" />
          </div>
          <div className="text-2xl font-bold text-white">{stats?.totalEnrollments || 0}</div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1e293b] overflow-x-auto pb-2">
        {[
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'courses', label: 'Course Catalog', icon: BookOpen },
          { id: 'categories', label: 'Categories', icon: FolderTree },
          { id: 'users', label: 'Users', icon: Users },
          { id: 'orders', label: 'Orders & Payments', icon: ShoppingBag }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-[#5C6AC4] text-white shadow-lg shadow-[#5C6AC4]/25'
                  : 'text-[#94a3b8] hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Platform Overview</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#111827] border border-[#1e293b] rounded-2xl p-6">
              <h3 className="font-bold text-white mb-4">Quick Stats Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-[#1e293b]">
                  <span className="text-[#94a3b8]">System Status</span>
                  <span className="text-[#00D4AA] font-semibold flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Operational
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#1e293b]">
                  <span className="text-[#94a3b8]">Payment Gateway</span>
                  <span className="text-white font-semibold">Razorpay Test Mode</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#1e293b]">
                  <span className="text-[#94a3b8]">Transactional Email</span>
                  <span className="text-white font-semibold">Gmail SMTP Active</span>
                </div>
              </div>
            </div>

            <div className="bg-[#111827] border border-[#1e293b] rounded-2xl p-6">
              <h3 className="font-bold text-white mb-4">Recent System Activity</h3>
              <p className="text-sm text-[#94a3b8]">
                All database migrations, authorization filters, and webhook reconciliation services are active and running.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'courses' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Course Management</h2>
            <span className="text-sm text-[#94a3b8]">{courses.length} courses loaded</span>
          </div>

          <div className="bg-[#111827] border border-[#1e293b] rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[#e2e8f0]">
                <thead className="bg-[#1e293b]/60 uppercase text-xs text-[#94a3b8] border-b border-[#1e293b]">
                  <tr>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Level</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Rating</th>
                    <th className="px-6 py-4">Students</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e293b]">
                  {courses.map((c) => (
                    <tr key={c.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-semibold text-white flex items-center gap-3">
                        <img src={c.thumbnailUrl} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <div>{c.title}</div>
                          <div className="text-xs text-[#64748b]">{c.subtitle}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="badge-indigo">{c.level}</span>
                      </td>
                      <td className="px-6 py-4 font-bold text-[#00D4AA]">
                        ₹{c.discountedPrice || c.originalPrice}
                      </td>
                      <td className="px-6 py-4 font-medium">{c.rating} ★</td>
                      <td className="px-6 py-4">{c.totalStudents}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleDeleteCourse(c.id)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete Course"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Course Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-[#111827] border border-[#1e293b] rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white">{cat.name}</h4>
                  <span className="text-xs text-[#64748b]">{cat.type}</span>
                </div>
                <span className="badge-mint text-xs">{cat.slug}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">User Accounts</h2>
          <div className="bg-[#111827] border border-[#1e293b] rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm text-[#e2e8f0]">
              <thead className="bg-[#1e293b]/60 uppercase text-xs text-[#94a3b8] border-b border-[#1e293b]">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5">
                    <td className="px-6 py-4 font-semibold text-white">{u.fullName}</td>
                    <td className="px-6 py-4 text-[#94a3b8]">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={u.role === 'ADMIN' ? 'badge-indigo' : 'badge'}>{u.role}</span>
                    </td>
                    <td className="px-6 py-4">
                      {u.enabled ? (
                        <span className="text-emerald-400 text-xs font-semibold">Active</span>
                      ) : (
                        <span className="text-red-400 text-xs font-semibold">Disabled</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleUser(u.id)}
                        className="btn-secondary py-1 px-3 text-xs"
                      >
                        {u.enabled ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Orders & Transaction Logs</h2>
          <div className="bg-[#111827] border border-[#1e293b] rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm text-[#e2e8f0]">
              <thead className="bg-[#1e293b]/60 uppercase text-xs text-[#94a3b8] border-b border-[#1e293b]">
                <tr>
                  <th className="px-6 py-4">Order #</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-white/5">
                    <td className="px-6 py-4 font-mono text-xs text-[#00D4AA]">{o.orderNumber}</td>
                    <td className="px-6 py-4">{o.user?.fullName || o.user?.email || 'Customer'}</td>
                    <td className="px-6 py-4 font-bold">₹{o.totalAmount}</td>
                    <td className="px-6 py-4">
                      <span className={o.status === 'COMPLETED' ? 'badge-mint' : 'badge-amber'}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-[#94a3b8]">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal for Creating Course */}
      {showCourseModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-[#1e293b] rounded-2xl p-6 w-full max-w-xl shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-[#1e293b] pb-4">
              <h3 className="text-xl font-bold text-white">Add New Course</h3>
              <button onClick={() => setShowCourseModal(false)} className="text-[#94a3b8] hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="label">Course Title</label>
                <input
                  type="text"
                  required
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Subtitle</label>
                <input
                  type="text"
                  required
                  value={newCourse.subtitle}
                  onChange={(e) => setNewCourse({ ...newCourse, subtitle: e.target.value })}
                  className="input"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Original Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newCourse.originalPrice}
                    onChange={(e) => setNewCourse({ ...newCourse, originalPrice: Number(e.target.value) })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Discounted Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newCourse.discountedPrice}
                    onChange={(e) => setNewCourse({ ...newCourse, discountedPrice: Number(e.target.value) })}
                    className="input"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 border-t border-[#1e293b] pt-4">
                <button type="button" onClick={() => setShowCourseModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Course</button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
