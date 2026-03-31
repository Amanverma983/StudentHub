'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  gold: 'btn-gold',
  ghost: 'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-ink-muted hover:text-ink hover:bg-glass transition-all duration-200 font-display font-medium text-sm',
  danger: 'inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 hover:bg-red-500/20 transition-all duration-200 font-display font-semibold text-sm',
};

const sizes = {
  sm: 'px-3 py-2 text-xs rounded-lg gap-1.5',
  md: '',
  lg: 'px-6 py-4 text-base rounded-xl gap-2.5',
  xl: 'px-8 py-5 text-lg rounded-2xl gap-3',
};

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    className,
    disabled,
    loading,
    leftIcon,
    rightIcon,
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        variants[variant],
        size !== 'md' && sizes[size],
        'select-none',
        (disabled || loading) && 'opacity-50 cursor-not-allowed pointer-events-none',
        className
      )}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
});

export default Button;
