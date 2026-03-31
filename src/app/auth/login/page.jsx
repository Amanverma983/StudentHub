'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Zap, ArrowLeft, AlertCircle, Mail, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [localError, setLocalError] = useState('');
  const { signIn, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) router.replace('/dashboard');
  }, [isAuthenticated, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }
    const { error } = await signIn(email, password);
    if (error) {
      setLocalError(error);
    } else {
      router.push('/dashboard');
    }
  };

  const fillDemo = (role) => {
    setEmail(role === 'writer' ? 'writer@demo.com' : 'customer@demo.com');
    setPassword('demo1234');
    setLocalError('');
  };

  return (
    <div className="min-h-screen bg-void flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="glow-orb w-[500px] h-[500px] bg-violet-600/12 -top-40 left-0" />
        <div className="glow-orb w-[300px] h-[300px] bg-gold-500/8 bottom-0 right-0" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* Back Link */}
      <div className="relative z-10 p-6">
        <Link href="/" className="inline-flex items-center gap-2 text-ink-muted hover:text-ink text-sm transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
      </div>

      {/* Auth Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center shadow-glow-violet">
                <Zap size={18} className="text-white" fill="white" />
              </div>
              <span className="font-display font-800 text-2xl text-ink">
                Student<span className="gradient-text-violet">Hub</span>
              </span>
            </Link>
            <h1 className="font-display text-2xl font-700 text-ink mb-2">Welcome back</h1>
            <p className="text-ink-muted text-sm">Sign in to your account to continue</p>
          </div>

          {/* Demo Buttons */}
          <div className="glass-card rounded-2xl p-4 mb-6 border border-violet-500/15">
            <p className="text-xs text-ink-muted mb-3 text-center font-medium">⚡ Quick Demo Access</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => fillDemo('writer')}
                className="py-2.5 px-3 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-semibold hover:bg-gold-500/15 transition-all font-display"
              >
                Writer Demo
              </button>
              <button
                onClick={() => fillDemo('customer')}
                className="py-2.5 px-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold hover:bg-violet-500/15 transition-all font-display"
              >
                Customer Demo
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="glass-card rounded-3xl p-8 border border-glass-border shadow-premium">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error */}
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

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-ink-muted uppercase tracking-widest mb-2">
                  Email Address
                </label>
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
                <label className="block text-xs font-semibold text-ink-muted uppercase tracking-widest mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-subtle" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field pl-10 pr-10"
                    autoComplete="current-password"
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

              <div className="flex justify-end">
                <Link href="#" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full justify-center mt-2"
              >
                Sign In
              </Button>
            </form>

            <div className="divider my-6" />

            <p className="text-center text-sm text-ink-muted">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                Create one free
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
