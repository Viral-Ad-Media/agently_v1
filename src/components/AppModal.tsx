import React, { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface AppModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  hideHeader?: boolean;
  className?: string;
  bodyClassName?: string;
  closeOnBackdrop?: boolean;
}

const SIZE_CLASS: Record<NonNullable<AppModalProps['size']>, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  '2xl': 'max-w-5xl',
};

const AppModal: React.FC<AppModalProps> = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'lg',
  hideHeader = false,
  className = '',
  bodyClassName = '',
  closeOnBackdrop = true,
}) => {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[400] bg-ink-950/70 p-4 sm:p-6 backdrop-blur-sm"
      onClick={(event) => {
        if (closeOnBackdrop && event.target === event.currentTarget) onClose();
      }}
      aria-modal="true"
      role="dialog"
      aria-label={title}
    >
      <div className="flex h-full items-center justify-center">
        <div
          className={`relative flex max-h-[calc(100vh-2rem)] w-full flex-col ${SIZE_CLASS[size]} rounded-3xl border border-line-soft bg-white shadow-2xl ${className}`}
          onClick={(event) => event.stopPropagation()}
        >
          {!hideHeader ? (
            <div className="flex items-start justify-between gap-4 border-b border-line-soft px-6 py-5 sm:px-8">
              <div>
                <h3 className="text-xl font-display font-semibold tracking-tight text-ink-950">
                  {title}
                </h3>
                {description ? (
                  <p className="mt-1 text-sm text-slate-lux">{description}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl p-2.5 text-slate-400 transition-all hover:bg-slate-50 hover:text-ink-950"
                aria-label="Close modal"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          ) : null}

          <div className={`min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8 ${hideHeader ? 'p-0 sm:p-0 ' : ''}${bodyClassName}`}>
            {children}
          </div>

          {footer ? (
            <div className="border-t border-line-soft px-6 py-5 sm:px-8">
              {footer}
            </div>
          ) : null}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default AppModal;
