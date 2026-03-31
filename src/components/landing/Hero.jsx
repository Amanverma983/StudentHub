'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight, Star, Briefcase, FileText, Globe, Zap,
  TrendingUp, Users, Shield, ChevronRight,
} from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

const STATS = [
  { value: '12,400+', label: 'Active Students' },
  { value: '₹48L+', label: 'Earned by Writers' },
  { value: '8,200+', label: 'Gigs Completed' },
  { value: '4.9★', label: 'Average Rating' },
];

const FEATURES = [
  {
    icon: Briefcase,
    title: 'Assignment Marketplace',
    description: 'Browse and claim handwritten assignment gigs. Earn money while leveraging your academic expertise.',
    gradient: 'from-violet-500/20 to-violet-700/10',
    border: 'border-violet-500/20',
    iconBg: 'bg-violet-500/15 text-violet-400',
    tag: 'For Writers',
    tagClass: 'badge-violet',
  },
  {
    icon: FileText,
    title: 'ATS Resume Builder',
    description: 'Craft stunning, recruiter-approved resumes with real-time editing and one-click PDF export.',
    gradient: 'from-gold-500/15 to-gold-700/10',
    border: 'border-gold-500/20',
    iconBg: 'bg-gold-500/12 text-gold-400',
    tag: 'Career Tool',
    tagClass: 'badge-gold',
  },
  {
    icon: Globe,
    title: 'Portfolio Maker',
    description: 'Build a stunning personal website in minutes. Glassmorphism, Terminal, Bento — choose your vibe.',
    gradient: 'from-emerald-500/15 to-teal-700/10',
    border: 'border-emerald-500/20',
    iconBg: 'bg-emerald-500/12 text-emerald-400',
    tag: 'Career Tool',
    tagClass: 'badge-green',
  },
];

const SOCIAL_PROOF = [
  { name: 'Arjun S.', role: 'IIT Delhi, 3rd Year', text: 'Made ₹18,000 last month just doing CS assignments. The platform is incredibly smooth.', rating: 5 },
  { name: 'Priya M.', role: 'Delhi University', text: 'Got my resume from zero to landing 3 internship interviews in a week. Life-changing.', rating: 5 },
  { name: 'Ravi K.', role: 'BITS Pilani', text: 'The portfolio builder is insane. Created a glass-theme portfolio and landed a dev role.', rating: 5 },
];

export default function Hero() {
  return (
    <main className="mesh-bg min-h-screen">

      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="glow-orb w-[600px] h-[600px] bg-violet-600/10 -top-40 -left-40" />
        <div className="glow-orb w-[400px] h-[400px] bg-gold-500/8 top-1/3 right-0" />
        <div className="glow-orb w-[300px] h-[300px] bg-violet-500/8 bottom-20 left-1/4" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-36 pb-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">

            {/* Pill Badge */}
            <motion.div
              variants={fadeUp}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 mb-8"
            >
              <span className="badge-violet">
                <Zap size={10} fill="currentColor" />
                India's #1 Student Career Platform
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.6, delay: 0.1 }}
              className="display-xl text-ink mb-6"
            >
              Build Your Career.
              <br />
              <span className="gradient-text">Earn While You Study.</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={fadeUp}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-ink-muted max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              The all-in-one platform for students to earn money from assignment gigs,
              build ATS-crushing resumes, and create stunning portfolios — all in one place.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <Link href="/auth/signup" className="btn-primary text-base px-7 py-3.5 group">
                Start Earning Free
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/auth/login" className="btn-secondary text-base px-7 py-3.5">
                Demo: writer@demo.com
              </Link>
            </motion.div>

            {/* Demo Hint */}
            <motion.p
              variants={fadeUp}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.5, delay: 0.35 }}
              className="text-xs text-ink-subtle mb-16"
            >
              Password: <code className="text-violet-400 font-mono">demo1234</code> · No credit card required
            </motion.p>

            {/* Stats */}
            <motion.div
              variants={fadeUp}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto"
            >
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                  className="glass-card rounded-2xl px-4 py-5 text-center"
                >
                  <div className="font-display text-2xl font-800 gradient-text mb-1">{stat.value}</div>
                  <div className="text-xs text-ink-muted">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="badge-violet mb-4 inline-flex">Everything You Need</span>
            <h2 className="display-lg text-ink mt-4 mb-4">
              One Platform,<br />
              <span className="gradient-text-violet">Infinite Possibilities</span>
            </h2>
            <p className="text-ink-muted text-lg max-w-xl mx-auto">
              Whether you're here to earn or hire, StudentHub has the tools to elevate your academic career.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className={`glass-card rounded-3xl p-8 bg-gradient-to-br ${feature.gradient} border ${feature.border} relative overflow-hidden group`}
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-2xl ${feature.iconBg} flex items-center justify-center mb-6`}>
                  <feature.icon size={22} />
                </div>

                <div className={`${feature.tagClass} mb-4`}>{feature.tag}</div>

                <h3 className="font-display text-xl font-700 text-ink mb-3">{feature.title}</h3>
                <p className="text-ink-muted text-sm leading-relaxed">{feature.description}</p>

                <div className="mt-6 flex items-center gap-2 text-sm text-ink-muted group-hover:text-ink-muted/80 transition-colors">
                  <span>Explore</span>
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Shimmer accent */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-radial from-white/5 to-transparent" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <span className="badge-gold mb-4 inline-flex">How It Works</span>
            <h2 className="display-lg text-ink mt-4">
              Start Earning in<br />
              <span className="gradient-text-gold">3 Simple Steps</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector Line */}
            <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
            <div className="hidden md:block absolute top-16 left-1/2 right-1/4 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />

            {[
              { step: '01', title: 'Create Your Profile', desc: 'Sign up as a Writer or Customer. Build your profile in minutes with our guided setup.', icon: Users, color: 'violet' },
              { step: '02', title: 'Browse or Post Gigs', desc: 'Writers browse and claim assignments. Customers post their requirements and set budgets.', icon: Briefcase, color: 'violet' },
              { step: '03', title: 'Earn & Grow', desc: 'Complete assignments, build your portfolio, export your resume. Level up your career.', icon: TrendingUp, color: 'gold' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center relative"
              >
                <div className={`w-14 h-14 mx-auto mb-6 rounded-2xl flex items-center justify-center ${item.color === 'gold' ? 'bg-gold-500/15' : 'bg-violet-500/15'}`}>
                  <item.icon size={24} className={item.color === 'gold' ? 'text-gold-400' : 'text-violet-400'} />
                </div>
                <div className={`text-4xl font-display font-800 mb-2 ${item.color === 'gold' ? 'gradient-text-gold' : 'gradient-text-violet'}`}>
                  {item.step}
                </div>
                <h3 className="font-display text-lg font-600 text-ink mb-3">{item.title}</h3>
                <p className="text-ink-muted text-sm max-w-xs mx-auto">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge-green mb-4 inline-flex">
              <Shield size={10} />
              Student Reviews
            </span>
            <h2 className="display-lg text-ink mt-4">
              Trusted by Students<br />
              <span className="gradient-text">Across India</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SOCIAL_PROOF.map((review, i) => (
              <motion.div
                key={review.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="glass-card rounded-2xl p-6"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star key={j} size={14} className="text-gold-400" fill="currentColor" />
                  ))}
                </div>
                <p className="text-sm text-ink-muted leading-relaxed mb-6">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center text-xs font-bold text-white">
                    {review.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold font-display text-ink">{review.name}</p>
                    <p className="text-xs text-ink-muted">{review.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card rounded-4xl p-12 text-center relative overflow-hidden border border-violet-500/20"
          >
            <div className="glow-orb w-64 h-64 bg-violet-500/15 -top-16 -left-16" />
            <div className="glow-orb w-48 h-48 bg-gold-500/10 -bottom-8 -right-8" />
            <div className="relative z-10">
              <span className="badge-violet mb-6 inline-flex">
                <Zap size={10} fill="currentColor" />
                Join 12,400+ Students
              </span>
              <h2 className="display-md text-ink mb-4">
                Ready to Take Control of<br />
                <span className="gradient-text">Your Academic Career?</span>
              </h2>
              <p className="text-ink-muted mb-10 max-w-lg mx-auto">
                Sign up free today and start earning, building, and growing with India's most trusted student platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/signup?role=writer" className="btn-gold text-base px-8 py-4">
                  <Zap size={18} />
                  Join as Writer
                </Link>
                <Link href="/auth/signup?role=customer" className="btn-secondary text-base px-8 py-4">
                  Post an Assignment
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-glass-border py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center">
                <Zap size={13} className="text-white" fill="white" />
              </div>
              <span className="font-display font-700 text-ink">Student<span className="gradient-text-violet">Hub</span></span>
            </div>
            <p className="text-xs text-ink-subtle">
              © 2025 StudentHub. Built with ❤️ for Indian Students.
            </p>
            <div className="flex items-center gap-6 text-xs text-ink-subtle">
              <Link href="#" className="hover:text-ink-muted transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-ink-muted transition-colors">Terms</Link>
              <Link href="#" className="hover:text-ink-muted transition-colors">Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
