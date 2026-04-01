'use client';

import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function LegalFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-glass-border bg-void pt-12 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center shadow-glow-sm">
                <Zap size={15} className="text-white" fill="white" />
              </div>
              <span className="font-display font-800 text-lg text-ink font-black">
                Student<span className="text-violet-500">Hub</span>
              </span>
            </div>
            <p className="text-sm text-ink-subtle max-w-sm leading-relaxed">
              The premium career-building toolkit for India's students. Build, showcase, and earn.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-sm text-ink mb-6 uppercase tracking-widest">Platform</h4>
            <ul className="space-y-4">
              <li><Link href="/dashboard/marketplace" className="text-sm text-ink-muted hover:text-white transition-colors">Gig Marketplace</Link></li>
              <li><Link href="/dashboard/resume" className="text-sm text-ink-muted hover:text-white transition-colors">Resume Builder</Link></li>
              <li><Link href="/dashboard/portfolio" className="text-sm text-ink-muted hover:text-white transition-colors">Portfolio Maker</Link></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-display font-bold text-sm text-ink mb-6 uppercase tracking-widest">Legal</h4>
            <ul className="space-y-4">
              <li><Link href="/legal/terms" className="text-sm text-ink-muted hover:text-white transition-colors underline-offset-4 hover:underline decoration-violet-500/50">Terms of Service</Link></li>
              <li><Link href="/legal/privacy" className="text-sm text-ink-muted hover:text-white transition-colors underline-offset-4 hover:underline decoration-violet-500/50">Privacy Policy</Link></li>
              <li><Link href="/legal/refund" className="text-sm text-ink-muted hover:text-white transition-colors underline-offset-4 hover:underline decoration-violet-500/50">Cancellation & Refund</Link></li>
              <li><Link href="/legal/contact" className="text-sm text-ink-muted hover:text-white transition-colors underline-offset-4 hover:underline decoration-violet-500/50">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-glass-border flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-ink-subtle font-medium uppercase tracking-[0.2em]">
          <p>© {currentYear} StudentHub. Brand owned by Aman Verma.</p>
          <div className="flex items-center gap-6">
            <span>Made with ✨ by India's Best Students</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
