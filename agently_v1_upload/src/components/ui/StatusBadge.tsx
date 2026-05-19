import * as React from 'react';
import { cn } from '@/src/lib/utils';

type StatusVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface StatusBadgeProps {
  children: React.ReactNode;
  variant?: StatusVariant;
  className?: string;
  dot?: boolean;
}

export function StatusBadge({ 
  children, 
  variant = 'neutral', 
  className,
  dot = true
}: StatusBadgeProps) {
  const variants: Record<StatusVariant, string> = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    warning: 'bg-amber-50 text-amber-700 border-amber-100',
    error: 'bg-rose-50 text-rose-700 border-rose-100',
    info: 'bg-blue-50 text-blue-700 border-blue-100',
    neutral: 'bg-slate-50 text-slate-700 border-slate-200',
  };

  const dots: Record<StatusVariant, string> = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-rose-500',
    info: 'bg-blue-500',
    neutral: 'bg-slate-400',
  };

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-all",
      variants[variant],
      className
    )}>
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", dots[variant])} />}
      {children}
    </span>
  );
}
