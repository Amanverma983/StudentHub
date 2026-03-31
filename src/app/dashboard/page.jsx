'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  TrendingUp, Briefcase, Star, Clock, ArrowRight,
  Zap, PenTool, FileText, Globe, ChevronRight,
  IndianRupee, CheckCircle, Timer, Award,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useMarketplace } from '@/context/MarketplaceContext';
import { formatCurrency, timeAgo } from '@/lib/utils';

function WriterDashboard({ user }) {
  const { filteredGigs } = useMarketplace();
  const openGigs = filteredGigs.filter(g => g.status === 'open').slice(0, 3);

  const stats = [
    {
      label: 'Total Earned',
      value: formatCurrency(user.totalEarnings || 0),
      icon: IndianRupee,
      trend: '+₹2,400 this month',
      color: 'text-gold-400',
      bg: 'bg-gold-500/10',
      border: 'border-gold-500/20',
    },
    {
      label: 'Gigs Completed',
      value: user.completedGigs || 0,
      icon: CheckCircle,
      trend: '+5 this week',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
    },
    {
      label: 'Your Rating',
      value: user.rating || '–',
      icon: Star,
      trend: 'Top 10% writer',
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/20',
    },
    {
      label: 'Active Gigs',
      value: openGigs.length,
      icon: Timer,
      trend: 'Available now',
      color: 'text-sky-400',
      bg: 'bg-sky-500/10',
      border: 'border-sky-500/20',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-ink-muted mb-1"
          >
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, ✨
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-display text-3xl font-800 text-ink"
          >
            {user.name?.split(' ')[0]}
          </motion.h1>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Link href="/dashboard/marketplace" className="btn-gold text-sm px-5 py-2.5">
            <Briefcase size={15} />
            Browse Gigs
          </Link>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            className={`stat-card border ${stat.border} group`}
          >
            <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon size={17} className={stat.color} />
            </div>
            <div className={`font-display text-2xl font-800 mb-1 ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-ink-muted mb-1.5">{stat.label}</div>
            <div className="text-xs text-ink-subtle">{stat.trend}</div>
          </motion.div>
        ))}
      </div>

      {/* Earnings Chart Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-3xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display font-600 text-ink">Earnings Overview</h2>
            <p className="text-xs text-ink-muted mt-1">Last 7 days</p>
          </div>
          <div className="badge-gold">+22% vs last week</div>
        </div>
        {/* Visual bar chart */}
        <div className="flex items-end gap-3 h-32">
          {[40, 65, 45, 80, 55, 90, 75].map((h, i) => {
            const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.4 + i * 0.06, duration: 0.5, ease: 'easeOut' }}
                  className="w-full rounded-t-lg"
                  style={{
                    background: i === 5
                      ? 'linear-gradient(180deg, #F59E0B 0%, #D97706 100%)'
                      : 'linear-gradient(180deg, rgba(124,58,237,0.6) 0%, rgba(124,58,237,0.3) 100%)',
                  }}
                />
                <span className="text-[10px] text-ink-subtle">{days[i]}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Available Gigs */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-3xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-600 text-ink">Available Gigs</h2>
          <Link href="/dashboard/marketplace" className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors">
            View all <ChevronRight size={13} />
          </Link>
        </div>

        <div className="space-y-3">
          {openGigs.map((gig, i) => (
            <motion.div
              key={gig.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}
              className="flex items-center justify-between p-4 rounded-2xl border border-glass-border hover:border-violet-500/25 hover:bg-glass transition-all group"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink truncate mb-1">{gig.title}</p>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-ink-muted">{gig.pages} pages</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    gig.urgency === 'express' ? 'bg-red-500/15 text-red-400' :
                    gig.urgency === 'urgent' ? 'bg-gold-500/15 text-gold-400' :
                    'bg-emerald-500/15 text-emerald-400'
                  }`}>{gig.urgency}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <p className="font-display font-700 text-gold-400">₹{gig.price}</p>
                  <p className="text-xs text-ink-subtle">{gig.applicants} applied</p>
                </div>
                <ChevronRight size={16} className="text-ink-subtle group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Tools */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-2 gap-4"
      >
        {[
          { label: 'Resume Builder', desc: 'Create ATS resume', href: '/dashboard/resume', icon: FileText, gradient: 'from-violet-500/15 to-violet-700/5', border: 'border-violet-500/20' },
          { label: 'Portfolio Maker', desc: 'Build your site', href: '/dashboard/portfolio', icon: Globe, gradient: 'from-emerald-500/15 to-teal-700/5', border: 'border-emerald-500/20' },
        ].map((tool, i) => (
          <Link
            key={tool.href}
            href={tool.href}
            className={`glass-card rounded-2xl p-5 bg-gradient-to-br ${tool.gradient} border ${tool.border} group`}
          >
            <tool.icon size={20} className="text-ink-muted mb-3 group-hover:text-ink transition-colors" />
            <p className="font-display font-600 text-sm text-ink mb-1">{tool.label}</p>
            <p className="text-xs text-ink-muted">{tool.desc}</p>
          </Link>
        ))}
      </motion.div>
    </div>
  );
}

function CustomerDashboard({ user }) {
  const { gigs } = useMarketplace();
  const myGigs = gigs.filter(g => g.customerId === user.id);

  const stats = [
    { label: 'Total Spent', value: formatCurrency(user.totalSpent || 0), icon: IndianRupee, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
    { label: 'Active Orders', value: user.activeOrders || 0, icon: Clock, color: 'text-gold-400', bg: 'bg-gold-500/10', border: 'border-gold-500/20' },
    { label: 'Completed', value: '12', icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { label: 'Writers Used', value: '8', icon: Award, color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/20' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-ink-muted mb-1">Welcome back,</p>
          <h1 className="font-display text-3xl font-800 text-ink">{user.name?.split(' ')[0]} 👋</h1>
        </div>
        <Link href="/dashboard/marketplace" className="btn-primary text-sm px-5 py-2.5">
          <Zap size={15} />
          Post Assignment
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            className={`stat-card border ${stat.border}`}
          >
            <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon size={17} className={stat.color} />
            </div>
            <div className={`font-display text-2xl font-800 mb-1 ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-ink-muted">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* My Orders */}
      <div className="glass-card rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-600 text-ink">My Assignments</h2>
          <Link href="/dashboard/marketplace" className="btn-primary text-xs px-3 py-1.5">
            + Post New
          </Link>
        </div>

        {myGigs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase size={40} className="text-ink-subtle mx-auto mb-4" />
            <p className="text-ink-muted mb-2">No assignments yet</p>
            <p className="text-sm text-ink-subtle mb-6">Post your first assignment to get started</p>
            <Link href="/dashboard/marketplace" className="btn-primary text-sm">
              Post Assignment
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {myGigs.map((gig, i) => (
              <div key={gig.id} className="flex items-center justify-between p-4 rounded-2xl border border-glass-border hover:bg-glass transition-all">
                <div>
                  <p className="text-sm font-medium text-ink mb-1">{gig.title}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-ink-muted">{gig.pages} pages</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      gig.status === 'open' ? 'bg-violet-500/15 text-violet-400' :
                      gig.status === 'in-progress' ? 'bg-gold-500/15 text-gold-400' :
                      'bg-emerald-500/15 text-emerald-400'
                    }`}>{gig.status}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-display font-700 text-ink">₹{gig.price}</p>
                  <p className="text-xs text-ink-subtle">{gig.applicants} applicants</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Career Tools */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Resume Builder', desc: 'Land more interviews', href: '/dashboard/resume', icon: FileText },
          { label: 'Portfolio Maker', desc: 'Showcase your work', href: '/dashboard/portfolio', icon: Globe },
        ].map((tool) => (
          <Link key={tool.href} href={tool.href} className="glass-card rounded-2xl p-5 group hover:border-violet-500/25">
            <tool.icon size={20} className="text-violet-400 mb-3" />
            <p className="font-display font-600 text-sm text-ink mb-1">{tool.label}</p>
            <p className="text-xs text-ink-muted">{tool.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, isWriter } = useAuth();
  if (!user) return null;
  return isWriter ? <WriterDashboard user={user} /> : <CustomerDashboard user={user} />;
}
