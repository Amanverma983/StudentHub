'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Briefcase, FileText, Globe, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const LINKS = [
  { label: 'Home', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Market', href: '/dashboard/marketplace', icon: Briefcase },
  { label: 'Wallet', href: '/dashboard/wallet', icon: TrendingUp },
  { label: 'Resume', href: '/dashboard/resume', icon: FileText },
];

export default function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-glass-border safe-area-pb">
      <div className="flex items-center justify-around px-2 py-2">
        {LINKS.map(link => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200',
                isActive ? 'text-violet-400' : 'text-ink-subtle'
              )}
            >
              <link.icon size={20} className={isActive ? 'text-violet-400' : ''} />
              <span className="text-[10px] font-medium font-display">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
