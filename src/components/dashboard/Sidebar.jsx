'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Briefcase, FileText, Globe,
  LogOut, Zap, PenTool, ShoppingBag, TrendingUp,
  Settings, ChevronRight, Star,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn, formatCurrency } from '@/lib/utils';

const WRITER_NAV = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Browse Gigs', href: '/dashboard/marketplace', icon: Briefcase },
  { label: 'My Wallet', href: '/dashboard/wallet', icon: TrendingUp },
  { label: 'Resume Builder', href: '/dashboard/resume', icon: FileText },
  { label: 'Portfolio', href: '/dashboard/portfolio', icon: Globe },
];

const CUSTOMER_NAV = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Post Assignment', href: '/dashboard/marketplace', icon: ShoppingBag },
  { label: 'Resume Builder', href: '/dashboard/resume', icon: FileText },
  { label: 'Portfolio', href: '/dashboard/portfolio', icon: Globe },
];

export default function DashboardSidebar() {
  const { user, signOut, isWriter } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const navLinks = isWriter ? WRITER_NAV : CUSTOMER_NAV;
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 border-r border-glass-border bg-surface/60 backdrop-blur-xl shrink-0">

      {/* Logo */}
      <div className="flex items-center gap-2.5 p-6 border-b border-glass-border">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center shadow-glow-sm">
          <Zap size={15} className="text-white" fill="white" />
        </div>
        <span className="font-display font-800 text-lg text-ink">
          Student<span className="gradient-text-violet">Hub</span>
        </span>
      </div>

      {/* User Card */}
      <div className="m-4 p-4 glass-card rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-violet-900 flex items-center justify-center text-sm font-bold text-white shrink-0 overflow-hidden border border-glass-border">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div className="min-w-0">
            <p className="font-display font-600 text-sm text-ink truncate">{user?.name}</p>
            <div className={cn('mt-0.5', isWriter ? 'badge-gold' : 'badge-violet')} style={{ fontSize: '10px', padding: '2px 8px' }}>
              {isWriter ? '✦ Writer' : '◈ Customer'}
            </div>
          </div>
        </div>

        {isWriter && (
          <div className="mt-3 pt-3 border-t border-glass-border flex items-center justify-between">
            <div>
              <p className="text-xs text-ink-muted">Earned</p>
              <p className="text-sm font-display font-600 gradient-text-gold">{formatCurrency(user?.totalEarnings || 0)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-ink-muted">Rating</p>
              <div className="flex items-center gap-1">
                <Star size={11} className="text-gold-400" fill="currentColor" />
                <p className="text-sm font-display font-600 text-ink">{user?.rating || '–'}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        <p className="px-3 py-2 text-xs font-semibold text-ink-subtle uppercase tracking-widest">Menu</p>
        {navLinks.map((link, i) => {
          const isActive = pathname === link.href;
          return (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                href={link.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                  isActive
                    ? 'bg-violet-500/15 text-violet-300 border border-violet-500/25'
                    : 'text-ink-muted hover:text-ink hover:bg-glass'
                )}
              >
                <link.icon size={16} className={isActive ? 'text-violet-400' : 'text-ink-subtle group-hover:text-ink-muted'} />
                {link.label}
                {isActive && (
                  <ChevronRight size={13} className="ml-auto text-violet-400/60" />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-6 space-y-1 border-t border-glass-border pt-4">
        <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-ink-muted hover:text-ink hover:bg-glass transition-all">
          <Settings size={16} className="text-ink-subtle" />
          Settings
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
