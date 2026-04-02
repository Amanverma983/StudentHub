'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Shield, Smartphone, Bell, ChevronRight, Zap, Camera, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user, profile, updateProfile, isWriter } = useAuth();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const supabase = createClient();

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith('image/')) return toast.error('Please upload an image file');
    if (file.size > 2 * 1024 * 1024) return toast.error('Image must be less than 2MB');

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // 1. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // 3. Update Profile in DB
      await updateProfile({ avatar_url: publicUrl });
      
      // Update local storage cache if it exists
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('sh_profile');
        if (cached) {
          const parsed = JSON.parse(cached);
          localStorage.setItem('sh_profile', JSON.stringify({ ...parsed, avatar_url: publicUrl }));
        }
      }

      toast.success('Profile picture updated!');
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('Failed to upload image. Make sure "avatars" bucket exists.');
    } finally {
      setUploading(false);
    }
  };

  const sections = [
    {
      title: 'Profile Information',
      items: [
        { label: 'Full Name', value: profile?.name, icon: User },
        { label: 'Email Address', value: user?.email, icon: Mail },
        { label: 'Account Type', value: isWriter ? 'Writer' : 'Customer', icon: Shield },
      ]
    },
    {
      title: 'Security & Preferences',
      items: [
        { label: 'Login Method', value: 'Email & Password', icon: Zap },
        { label: 'Two-Factor Auth', value: 'Disabled', icon: Shield },
        { label: 'Notifications', value: 'On', icon: Bell },
      ]
    }
  ];

  const initials = profile?.name
    ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-display text-3xl font-800 text-ink mb-2">Account Settings</h1>
          <p className="text-ink-muted">View and manage your account details below.</p>
        </div>

        {/* Profile Picture Upload */}
        <div className="relative group">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarUpload}
            accept="image/*"
            className="hidden"
          />
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
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center border-4 border-void shadow-lg">
            <Plus size={16} className="text-white" />
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {sections.map(section => (
          <div key={section.title} className="glass-card rounded-[2.5rem] border border-glass-border overflow-hidden">
            <div className="px-8 py-6 border-b border-glass-border">
              <h2 className="font-display font-700 text-lg text-ink">{section.title}</h2>
            </div>
            <div className="divide-y divide-glass-border">
              {section.items.map(item => (
                <div key={item.label} className="px-8 py-5 flex items-center justify-between hover:bg-glass/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-surface flex items-center justify-center border border-glass-border">
                      <item.icon size={18} className="text-violet-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-ink-subtle uppercase tracking-widest mb-0.5">{item.label}</p>
                      <p className="text-sm font-medium text-ink">{item.value || 'Not set'}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-ink-subtle" />
                </div>
              ))}
            </div>
          </div>
        ))}

        {isWriter && (
          <div className="glass-card rounded-[2.5rem] border border-gold-500/10 bg-gold-500/[0.02] p-8 flex items-center justify-between">
            <div>
              <h3 className="font-display font-700 text-gold-400 mb-1">Writer Benefits</h3>
              <p className="text-sm text-ink-muted">Keep your profile updated to increase your rating and get more gigs.</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gold-400/60 uppercase tracking-widest font-bold mb-1">Current Rating</p>
              <p className="text-2xl font-black text-gold-400">{profile?.rating || '5.0'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
