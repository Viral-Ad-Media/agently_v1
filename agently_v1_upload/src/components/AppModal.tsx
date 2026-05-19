import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnBackdrop?: boolean;
}

export default function AppModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  closeOnBackdrop = true,
}: ModalProps) {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-[95vw]',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOnBackdrop ? onClose : undefined}
            className="absolute inset-0 bg-ink-950/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={cn(
              "relative w-full luxury-glass border border-white/10 shadow-2xl rounded-luxury flex flex-col max-h-[90vh]",
              sizes[size],
              "sm:bottom-auto bottom-0 sm:mb-0 -mb-4 rounded-b-none sm:rounded-b-luxury transform transition-all"
            )}
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 pb-2">
              <div className="space-y-1">
                <h3 className="text-2xl font-display font-semibold text-ink-950 leading-none">
                  {title}
                </h3>
                {description && (
                  <p className="text-sm text-slate-lux">{description}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-lux hover:text-ink-950 hover:bg-black/5 rounded-xl transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
              {children}
            </div>

            {/* Footer shadow fade */}
            <div className="h-8 absolute bottom-0 left-0 right-0 pointer-events-none bg-gradient-to-t from-white/40 to-transparent rounded-b-luxury" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
