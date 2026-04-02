'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  User, Mail, Shield, Smartphone, Bell, ChevronRight, Zap, 
  Camera, Loader2, Plus, Edit2, Save, X, Lock, Check,
  ShieldCheck, AlertCircle, Star
} from 'lucide-react';
import { createClient } from '@/lib/supabase';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';

export default function SettingsPage() {
  const { user, profile, updateProfile, updateEmail, updatePassword, isWriter } = useAuth();
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(null); // 'name', 'email', 'pass', 'role'
  const [isChangingRole, setIsChangingRole] = useState(false);
  const fileInputRef = useRef(null);
  const supabase = createClient();

  // Edit States
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(profile?.name || '');
  
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState(user?.email || '');
  
  const [isEditingPass, setIsEditingPass] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });

  // Preference States
  const [notifications, setNotifications] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  useEffect(() => {
    if (profile?.name) setNewName(profile.name);
    if (user?.email) setNewEmail(user.email);
  }, [profile, user]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) return toast.error('Please upload an image file');
    if (file.size > 2 * 1024 * 1024) return toast.error('Image must be less than 2MB');

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      await updateProfile({ avatar_url: publicUrl });
      toast.success('Profile picture updated!');
    } catch (err) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateName = async () => {
    if (!newName.trim()) return toast.error('Name cannot be empty');
    setSaving('name');
    await updateProfile({ name: newName });
    setIsEditingName(false);
    setSaving(null);
  };

  const handleUpdateEmail = async () => {
    if (!newEmail.trim() || newEmail === user?.email) return setIsEditingEmail(false);
    setSaving('email');
    await updateEmail(newEmail);
    setIsEditingEmail(false);
    setSaving(null);
  };

  const handleUpdatePassword = async () => {
    if (passwords.next !== passwords.confirm) return toast.error('Passwords do not match');
    if (passwords.next.length < 6) return toast.error('Password must be at least 6 characters');
    
    setSaving('pass');
    await updatePassword(passwords.next);
    setIsEditingPass(false);
    setPasswords({ current: '', next: '', confirm: '' });
    setSaving(null);
  };

  const handleSwitchRole = async () => {
    const newRole = isWriter ? 'customer' : 'writer';
    setSaving('role');
    
    // 1. Optimistic Update (UI changes instantly)
    updateProfile({ role: newRole });
    
    // 2. Close Modal & Redirect Instantly
    setIsChangingRole(false);
    toast.success(`Switching to ${newRole} mode...`);
    router.push('/dashboard');
    
    setSaving(null);
  };

  const initials = profile?.name
    ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-display text-3xl font-800 text-ink mb-2">Account Settings</h1>
          <p className="text-ink-muted">Manage your profile, security, and preferences.</p>
        </div>

        {/* Profile Picture */}
        <div className="relative group">
          <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} accept="image/*" className="hidden" />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="relative w-24 h-24 rounded-[2rem] bg-gradient-to-br from-violet-600 to-violet-900 flex items-center justify-center p-1.5 shadow-glow-violet transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <div className="w-full h-full rounded-[1.7rem] bg-surface flex items-center justify-center overflow-hidden border-2 border-glass-border">
              {uploading ? (
                <Loader2 className="animate-spin text-violet-400" />
              ) : profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-black text-ink">{initials}</span>
              )}
            </div>
            <div className="absolute inset-0 bg-void/60 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-[2rem] transition-opacity">
              <Camera size={24} className="text-white" />
            </div>
          </button>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center border-4 border-void shadow-lg">
            <Plus size={14} className="text-white" />
          </div>
        </div>
      </div>

      <div className="grid gap-8">
        {/* Profile Section */}
        <div className="glass-card rounded-[2.5rem] border border-glass-border overflow-hidden">
          <div className="px-8 py-6 border-b border-glass-border flex items-center justify-between">
            <h2 className="font-display font-700 text-lg text-ink">Profile Information</h2>
            <ShieldCheck size={20} className="text-emerald-500/50" />
          </div>
          <div className="divide-y divide-glass-border">
            {/* Name Item */}
            <div className="px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-glass/30 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
                  <User size={18} className="text-violet-400" />
                </div>
                {isEditingName ? (
                  <input
                    type="text"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    className="bg-void border border-violet-500/30 rounded-lg px-3 py-1.5 text-sm text-ink focus:outline-none focus:border-violet-500"
                    autoFocus
                  />
                ) : (
                  <div>
                    <p className="text-xs font-semibold text-ink-subtle uppercase tracking-widest mb-0.5">Full Name</p>
                    <p className="text-sm font-medium text-ink">{profile?.name || 'Not set'}</p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {isEditingName ? (
                  <>
                    <button onClick={() => setIsEditingName(false)} className="p-2 text-ink-muted hover:text-ink transition-colors">
                      <X size={16} />
                    </button>
                    <button onClick={handleUpdateName} disabled={saving === 'name'} className="btn-primary py-1.5 px-3 text-xs flex items-center gap-2">
                      {saving === 'name' ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                      Save
                    </button>
                  </>
                ) : (
                  <button onClick={() => setIsEditingName(true)} className="p-2 text-ink-muted hover:text-violet-400 transition-all">
                    <Edit2 size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Email Item */}
            <div className="px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-glass/30 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
                  <Mail size={18} className="text-violet-400" />
                </div>
                {isEditingEmail ? (
                  <input
                    type="email"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    className="bg-void border border-violet-500/30 rounded-lg px-3 py-1.5 text-sm text-ink focus:outline-none focus:border-violet-500"
                    autoFocus
                  />
                ) : (
                  <div>
                    <p className="text-xs font-semibold text-ink-subtle uppercase tracking-widest mb-0.5">Email Address</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-ink">{user?.email}</p>
                      <span className="flex items-center gap-1 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded-full uppercase tracking-tighter border border-emerald-500/20">
                        Verified
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {isEditingEmail ? (
                  <>
                    <button onClick={() => setIsEditingEmail(false)} className="p-2 text-ink-muted hover:text-ink transition-colors">
                      <X size={16} />
                    </button>
                    <button onClick={handleUpdateEmail} disabled={saving === 'email'} className="btn-primary py-1.5 px-3 text-xs flex items-center gap-2">
                      {saving === 'email' ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                      Update
                    </button>
                  </>
                ) : (
                  <button onClick={() => setIsEditingEmail(true)} className="p-2 text-ink-muted hover:text-violet-400 transition-all">
                    <Edit2 size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Role Item */}
            <div className="px-8 py-5 flex flex-col gap-4 hover:bg-glass/30 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-gold-500/10 flex items-center justify-center border border-gold-500/20">
                    <Shield size={18} className="text-gold-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink-subtle uppercase tracking-widest mb-0.5">Account Type</p>
                    <p className={isWriter ? 'text-sm font-bold text-gold-400 uppercase tracking-wider' : 'text-sm font-bold text-violet-400 uppercase tracking-wider'}>
                      {isWriter ? '✦ Writer' : '◈ Customer'}
                    </p>
                  </div>
                </div>
                {!isChangingRole && (
                  <button 
                    onClick={() => setIsChangingRole(true)}
                    className="btn-secondary py-1.5 px-4 text-xs font-bold border-gold-500/10 text-gold-400/80 hover:bg-gold-500/5 transition-all"
                  >
                    Switch Role
                  </button>
                )}
              </div>

              {isChangingRole && (
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="p-4 bg-void/50 rounded-2xl border border-gold-500/20 space-y-4">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center shrink-0">
                      <AlertCircle size={18} className="text-gold-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-ink">Change account type to {isWriter ? 'Customer' : 'Writer'}?</p>
                      <p className="text-xs text-ink-muted mt-1">This will change your dashboard view and sidebar links.</p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button onClick={() => setIsChangingRole(false)} className="px-4 py-2 text-xs font-semibold text-ink-muted">Cancel</button>
                    <button onClick={handleSwitchRole} disabled={saving === 'role'} className="btn-primary py-2 px-6 text-xs bg-gold-600 hover:bg-gold-500 border-none flex items-center gap-2">
                       {saving === 'role' ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
                       Confirm Switch
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="glass-card rounded-[2.5rem] border border-glass-border overflow-hidden">
          <div className="px-8 py-6 border-b border-glass-border">
            <h2 className="font-display font-700 text-lg text-ink">Security & Credentials</h2>
          </div>
          <div className="divide-y divide-glass-border">
            {/* Password Item */}
            <div className="px-8 py-5 flex flex-col gap-4 hover:bg-glass/30 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
                    <Zap size={18} className="text-violet-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink-subtle uppercase tracking-widest mb-0.5">Password</p>
                    <p className="text-sm font-medium text-ink">••••••••••••</p>
                  </div>
                </div>
                {!isEditingPass && (
                  <button onClick={() => setIsEditingPass(true)} className="btn-secondary py-1.5 px-4 text-xs font-bold">
                    Change Password
                  </button>
                )}
              </div>

              {isEditingPass && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-void/50 rounded-2xl border border-glass-border space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="password"
                      placeholder="New Password"
                      value={passwords.next}
                      onChange={e => setPasswords({...passwords, next: e.target.value})}
                      className="input-field text-sm"
                    />
                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      value={passwords.confirm}
                      onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                      className="input-field text-sm"
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button onClick={() => setIsEditingPass(false)} className="px-4 py-2 text-xs font-semibold text-ink-muted hover:text-ink">Cancel</button>
                    <button onClick={handleUpdatePassword} disabled={saving === 'pass'} className="btn-primary py-2 px-6 text-xs flex items-center gap-2">
                       {saving === 'pass' ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                       Confirm Reset
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Notification Toggle */}
            <div className="px-8 py-5 flex items-center justify-between hover:bg-glass/30 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
                  <Bell size={18} className="text-violet-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-ink-subtle uppercase tracking-widest mb-0.5">Push Notifications</p>
                  <p className="text-sm font-medium text-ink">{notifications ? 'Enabled' : 'Disabled'}</p>
                </div>
              </div>
              <button 
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 rounded-full transition-all duration-300 relative ${notifications ? 'bg-violet-600' : 'bg-void border border-glass-border'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${notifications ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
            
            {/* 2FA Toggle */}
            <div className="px-8 py-5 flex items-center justify-between hover:bg-glass/30 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
                  <Smartphone size={18} className="text-violet-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-ink-subtle uppercase tracking-widest mb-0.5">Two-Factor Authentication</p>
                  <p className="text-sm font-medium text-ink">{twoFactor ? 'Active' : 'Not setup'}</p>
                </div>
              </div>
              <button 
                onClick={() => setTwoFactor(!twoFactor)}
                className={`w-12 h-6 rounded-full transition-all duration-300 relative ${twoFactor ? 'bg-violet-600' : 'bg-void border border-glass-border'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${twoFactor ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Writer Specific Display */}
        {isWriter && (
          <div className="glass-card rounded-[2.5rem] border border-gold-500/10 bg-gold-500/[0.02] p-8 flex items-center justify-between">
            <div>
              <h3 className="font-display font-700 text-gold-400 mb-1 flex items-center gap-2">
                <Star size={18} fill="currentColor" /> Writer Account Verified
              </h3>
              <p className="text-sm text-ink-muted">Premium features and marketplace access are fully active.</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gold-400/60 uppercase tracking-widest font-bold mb-1">Writer Trust Score</p>
              <p className="text-2xl font-black text-gold-400">{profile?.rating || '5.0'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
