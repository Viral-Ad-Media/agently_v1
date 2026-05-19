import * as React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '@/src/lib/utils';

export interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'glass' | 'ink' | 'outline';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const LuxuryCard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', children, ...props }, ref) => {
    const variants = {
      default: 'bg-white border border-line-soft shadow-sm',
      glass: 'luxury-glass shadow-sm',
      ink: 'bg-ink-950 text-white border border-white/5',
      outline: 'bg-transparent border border-line-soft',
    };

    const paddings = {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'rounded-luxury overflow-hidden',
          variants[variant],
          paddings[padding],
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

LuxuryCard.displayName = 'LuxuryCard';
