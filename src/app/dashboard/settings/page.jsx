'use client';

import { useAuth } from '@/context/AuthContext';
import { User, Mail, Shield, Smartphone, Bell, ChevronRight, Zap } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function SettingsPage() {
  const { user, isWriter } = useAuth();

  const sections = [
    {
      title: 'Profile Information',
      items: [
        { label: 'Full Name', value: user?.name, icon: User },
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

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-3xl font-800 text-ink mb-2">Account Settings</h1>
        <p className="text-ink-muted">View and manage your account details below.</p>
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
              <p className="text-2xl font-black text-gold-400">{user?.rating || '5.0'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
