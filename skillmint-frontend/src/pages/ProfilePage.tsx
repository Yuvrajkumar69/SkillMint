import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { User, Lock, Save, CheckCircle2, GraduationCap } from 'lucide-react';
import { userApi } from '../api/services';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  bio: z.string().max(500).optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPass, setIsSavingPass] = useState(false);

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullName: user?.fullName || '', phone: user?.phone || '', bio: user?.bio || '' },
  });

  const passForm = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) });

  useEffect(() => {
    document.title = 'Profile – SkillMint';
    if (user) {
      profileForm.reset({ fullName: user.fullName, phone: user.phone || '', bio: user.bio || '' });
    }
  }, [user]);

  const onSaveProfile = async (data: ProfileForm) => {
    setIsSavingProfile(true);
    try {
      await userApi.updateProfile(data);
      updateUser(data);
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const onChangePassword = async (data: PasswordForm) => {
    setIsSavingPass(true);
    try {
      await userApi.changePassword(data);
      passForm.reset();
      toast.success('Password changed successfully');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Failed to change password');
    } finally {
      setIsSavingPass(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-[#e2e8f0] mb-8">Account Settings</h1>

      <div className="grid md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          {/* Avatar */}
          <div className="flex flex-col items-center p-6 bg-[#111827] border border-[#1e293b] rounded-2xl mb-4">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-3"
              style={{ background: 'linear-gradient(135deg, #5C6AC4, #00D4AA)' }}>
              {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <p className="font-semibold text-[#e2e8f0] text-center truncate w-full text-center">{user?.fullName}</p>
            <p className="text-xs text-[#64748b] text-center truncate w-full mt-0.5">{user?.email}</p>
            <span className="mt-3 badge badge-indigo">
              <GraduationCap size={10} />
              {user?.role}
            </span>
          </div>

          {/* Tabs */}
          <nav className="space-y-1">
            {[
              { id: 'profile', icon: <User size={15} />, label: 'Profile Info' },
              { id: 'security', icon: <Lock size={15} />, label: 'Security' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'profile' | 'security')}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#5C6AC4]/15 text-[#7B89D4] font-medium'
                    : 'text-[#64748b] hover:text-[#94a3b8] hover:bg-white/5'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#111827] border border-[#1e293b] rounded-2xl p-6"
            >
              <h2 className="text-lg font-bold text-[#e2e8f0] mb-6">Profile Information</h2>
              <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className="space-y-4">
                <div>
                  <label className="label">Full Name</label>
                  <input {...profileForm.register('fullName')} className={`input ${profileForm.formState.errors.fullName ? 'border-red-500' : ''}`} />
                  {profileForm.formState.errors.fullName && <p className="text-xs text-red-400 mt-1">{profileForm.formState.errors.fullName.message}</p>}
                </div>
                <div>
                  <label className="label">Email <span className="text-[#475569] text-xs">(cannot be changed)</span></label>
                  <input value={user?.email} disabled className="input opacity-50 cursor-not-allowed" />
                </div>
                <div>
                  <label className="label">Phone Number</label>
                  <input {...profileForm.register('phone')} type="tel" placeholder="+91 9876543210" className="input" />
                </div>
                <div>
                  <label className="label">Bio</label>
                  <textarea
                    {...profileForm.register('bio')}
                    rows={4}
                    placeholder="Tell us about yourself..."
                    className="input resize-none"
                  />
                </div>
                <div className="flex justify-end">
                  <button type="submit" disabled={isSavingProfile} className="btn-primary px-6">
                    {isSavingProfile ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2"><Save size={15} /> Save Changes</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#111827] border border-[#1e293b] rounded-2xl p-6"
            >
              <h2 className="text-lg font-bold text-[#e2e8f0] mb-6">Change Password</h2>
              <form onSubmit={passForm.handleSubmit(onChangePassword)} className="space-y-4">
                {[
                  { id: 'currentPassword', label: 'Current Password', placeholder: '••••••••' },
                  { id: 'newPassword', label: 'New Password', placeholder: 'Create a strong password' },
                  { id: 'confirmPassword', label: 'Confirm New Password', placeholder: 'Repeat new password' },
                ].map((field) => (
                  <div key={field.id}>
                    <label className="label">{field.label}</label>
                    <input
                      {...passForm.register(field.id as 'currentPassword' | 'newPassword' | 'confirmPassword')}
                      type="password"
                      placeholder={field.placeholder}
                      className={`input ${passForm.formState.errors[field.id as keyof PasswordForm] ? 'border-red-500' : ''}`}
                    />
                    {passForm.formState.errors[field.id as keyof PasswordForm] && (
                      <p className="text-xs text-red-400 mt-1">
                        {passForm.formState.errors[field.id as keyof PasswordForm]?.message}
                      </p>
                    )}
                  </div>
                ))}
                <div className="flex justify-end">
                  <button type="submit" disabled={isSavingPass} className="btn-primary px-6">
                    {isSavingPass ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Changing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2"><CheckCircle2 size={15} /> Change Password</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
