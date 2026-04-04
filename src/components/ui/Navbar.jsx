'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Zap, ChevronDown, Bell, User,
  LogOut, LayoutDashboard, BookOpen, Briefcase,
  FileText, Globe, Settings
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'Marketplace', href: '/dashboard/marketplace' },
  { label: 'Resume Builder', href: '/dashboard/resume' },
  { label: 'Portfolio', href: '/dashboard/portfolio' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, profile, isAuthenticated, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  const initials = profile?.name
    ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled || mobileOpen
          ? 'glass border-b border-glass-border'
          : 'bg-transparent border-b border-transparent'
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center shadow-glow-sm group-hover:shadow-glow-violet transition-all duration-300">
              <Zap size={16} className="text-white" fill="white" />
            </div>
            <span className="font-display font-800 text-lg text-ink">
              Student<span className="gradient-text-violet">Hub</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    pathname === link.href
                      ? 'text-violet-400 bg-violet-500/10'
                      : 'text-ink-muted hover:text-ink hover:bg-glass'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Role Badge */}
                <div className={cn(
                  'text-xs font-semibold px-2.5 py-1 rounded-full border uppercase tracking-wider',
                  user.role === 'writer'
                    ? 'badge-gold'
                    : 'badge-violet'
                )}>
                  {user.role}
                </div>

                {/* Dashboard */}
                <Link
                  href="/dashboard"
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    pathname === '/dashboard'
                      ? 'text-violet-400 bg-violet-500/10'
                      : 'text-ink-muted hover:text-ink hover:bg-glass'
                  )}
                >
                  Dashboard
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-glass transition-all duration-200 border border-transparent hover:border-glass-border"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center text-xs font-bold text-white overflow-hidden">
                      {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" />
                      ) : (
                        initials
                      )}
                    </div>
                    <ChevronDown
                      size={14}
                      className={cn('text-ink-muted transition-transform', userMenuOpen && 'rotate-180')}
                    />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-52 glass-card rounded-2xl overflow-hidden border border-glass-border shadow-premium"
                      >
                        <div className="px-4 py-3 border-b border-glass-border">
                          <p className="text-sm font-semibold text-ink font-display">{user.name}</p>
                          <p className="text-xs text-ink-muted">{user.email}</p>
                        </div>
                        <div className="p-2">
                          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-ink-muted hover:text-ink hover:bg-glass transition-all">
                            <LayoutDashboard size={15} />
                            Dashboard
                          </Link>
                          <Link href="/dashboard/marketplace" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-ink-muted hover:text-ink hover:bg-glass transition-all">
                            <Briefcase size={15} />
                            Marketplace
                          </Link>
                          <Link href="/dashboard/resume" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-ink-muted hover:text-ink hover:bg-glass transition-all">
                            <FileText size={15} />
                            Resume Builder
                          </Link>
                          <Link href="/dashboard/portfolio" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-ink-muted hover:text-ink hover:bg-glass transition-all border-b border-glass-border">
                            <Globe size={15} />
                            Portfolio
                          </Link>
                          <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-ink-muted hover:text-ink hover:bg-glass transition-all">
                             <Settings size={15} />
                             Settings
                           </Link>
                        </div>
                        <div className="p-2 border-t border-glass-border">
                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all"
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
              <>
                <Link href="/auth/login" className="btn-secondary text-sm py-2 px-4">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="btn-primary text-sm py-2 px-4">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-glass transition-colors"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-glass-border overflow-hidden"
            >
              <div className="py-4 space-y-1">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center text-sm font-bold text-white overflow-hidden">
                        {profile?.avatar_url ? (
                          <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" />
                        ) : (
                          initials
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold font-display">{user.name}</p>
                        <p className="text-xs text-ink-muted">{user.email}</p>
                      </div>
                    </div>
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm text-ink-muted hover:text-ink hover:bg-glass rounded-xl mx-2 transition-all">
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                    {NAV_LINKS.map(link => (
                      <Link key={link.href} href={link.href} className="flex items-center gap-3 px-4 py-3 text-sm text-ink-muted hover:text-ink hover:bg-glass rounded-xl mx-2 transition-all">
                        {link.label}
                      </Link>
                    ))}
                    <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-xl mx-2 transition-all mt-2">
                      <LogOut size={16} /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" className="block px-4 py-3 text-sm text-ink-muted hover:text-ink">Sign In</Link>
                    <Link href="/auth/signup" className="block mx-4 my-2 btn-primary text-center text-sm py-2.5">Get Started</Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
