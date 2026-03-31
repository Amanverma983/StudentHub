'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye, EyeOff, Zap, ArrowLeft, AlertCircle,
  Mail, Lock, User, PenTool, ShoppingBag, Check,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';

function SignupContent() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('writer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [localError, setLocalError] = useState('');
  const { signUp, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isAuthenticated) router.replace('/dashboard');
    const roleParam = searchParams.get('role');
    if (roleParam === 'writer' || roleParam === 'customer') setRole(roleParam);
  }, [isAuthenticated, router, searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (!name.trim() || !email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }
    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters');
      return;
    }
    const { error } = await signUp(email, password, name, role);
    if (error) {
      setLocalError(error);
    } else {
      router.push('/dashboard');
    }
  };

  const ROLES = [
    {
      id: 'writer',
      title: 'Writer',
      subtitle: 'Earn Money',
      description: 'Complete handwritten assignments and earn money per page.',
      icon: PenTool,
      gradient: 'from-gold-500/20 to-gold-700/10',
      border: 'border-gold-500/30',
      activeBorder: 'border-gold-400',
      tag: 'badge-gold',
      benefits: ['Customized rates', 'Flexible schedule', 'Build portfolio'],
    },
    {
      id: 'customer',
      title: 'Customer',
      subtitle: 'Get Help',
      description: 'Post assignments and get high-quality handwritten work done.',
      icon: ShoppingBag,
      gradient: 'from-violet-500/20 to-violet-700/10',
      border: 'border-violet-500/30',
      activeBorder: 'border-violet-400',
      tag: 'badge-violet',
      benefits: ['24/7 availability', 'Verified writers', 'Satisfaction guarantee'],
    },
  ];

  return (
    <div className="min-h-screen bg-void flex flex-col">
      <div className="fixed inset-0 pointer-events-none">
        <div className="glow-orb w-[500px] h-[500px] bg-violet-600/12 -top-40 right-0" />
        <div className="glow-orb w-[300px] h-[300px] bg-gold-500/8 bottom-0 left-0" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="relative z-10 p-6">
        <Link href="/" className="inline-flex items-center gap-2 text-ink-muted hover:text-ink text-sm transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 24, scale: 0.97 }}
           animate={{ opacity: 1, y: 0, scale: 1 }}
           transition={{ duration: 0.5 }}
           className="w-full max-w-lg"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
               <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center shadow-glow-violet">
                 <Zap size={18} className="text-white" fill="white" />
               </div>
               <span className="font-display font-800 text-2xl text-ink">
                 Student<span className="gradient-text-violet">Hub</span>
               </span>
            </Link>
            <h1 className="font-display text-2xl font-700 text-ink mb-2">Create your account</h1>
            <p className="text-ink-muted text-sm">Join 12,400+ students building their careers</p>
          </div>

          <div className="glass-card rounded-3xl p-8 border border-glass-border shadow-premium">
            {/* Role Selection */}
            <div className="mb-8">
              <p className="text-xs font-semibold text-ink-muted uppercase tracking-widest mb-4">I want to</p>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map(r => (
                  <button
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    className={`relative p-4 rounded-2xl text-left transition-all duration-200 border bg-gradient-to-br ${r.gradient} ${
                      role === r.id
                        ? `${r.activeBorder} shadow-lg`
                        : `${r.border} opacity-60 hover:opacity-80`
                    }`}
                  >
                    {role === r.id && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
                        <Check size={11} className="text-white" strokeWidth={3} />
                      </div>
                    )}
                    <r.icon size={18} className={role === r.id ? 'text-ink mb-2' : 'text-ink-muted mb-2'} />
                    <p className={`font-display font-600 text-sm mb-0.5 ${role === r.id ? 'text-ink' : 'text-ink-muted'}`}>
                      {r.title}
                    </p>
                    <p className={`text-xs ${role === r.id ? 'text-ink-muted' : 'text-ink-subtle'}`}>
                      {r.subtitle}
                    </p>
                  </button>
                ))}
              </div>

              {/* Benefits */}
              <div className="mt-4 flex items-center gap-4 flex-wrap">
                {ROLES.find(r => r.id === role)?.benefits.map(b => (
                  <div key={b} className="flex items-center gap-1.5 text-xs text-ink-muted">
                    <Check size={11} className="text-emerald-400" />
                    {b}
                  </div>
                ))}
              </div>
            </div>

            <div className="divider mb-6" />

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {localError && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                >
                  <AlertCircle size={15} />
                  {localError}
                </motion.div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-ink-muted uppercase tracking-widest mb-2">Full Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-subtle" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Arjun Sharma"
                    className="input-field pl-10"
                    autoComplete="name"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-ink-muted uppercase tracking-widest mb-2">Email Address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-subtle" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="input-field pl-10"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-ink-muted uppercase tracking-widest mb-2">Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-subtle" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="input-field pl-10 pr-10"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink-muted transition-colors"
                  >
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant={role === 'writer' ? 'gold' : 'primary'}
                size="lg"
                loading={loading}
                className="w-full justify-center mt-2"
              >
                Create Account as {role === 'writer' ? 'Writer' : 'Customer'}
              </Button>

              <p className="text-center text-xs text-ink-subtle">
                By signing up, you agree to our{' '}
                <Link href="#" className="text-ink-muted hover:text-ink transition-colors">Terms of Service</Link>
                {' '}and{' '}
                <Link href="#" className="text-ink-muted hover:text-ink transition-colors">Privacy Policy</Link>
              </p>
            </form>

            <div className="divider my-6" />

            <p className="text-center text-sm text-ink-muted">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-void flex items-center justify-center"><Zap className="text-violet-500 animate-pulse" /></div>}>
      <SignupContent />
    </Suspense>
  );
}
