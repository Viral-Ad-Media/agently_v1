import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X, Bell } from 'lucide-react';
import { cn } from '@/src/lib/utils';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const toast = React.useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className={cn(
                "pointer-events-auto flex items-center gap-3 p-4 pr-12 rounded-2xl shadow-xl border min-w-[320px] max-w-md",
                t.type === 'success' ? "bg-white border-emerald-100 text-emerald-950" :
                t.type === 'error' ? "bg-white border-rose-100 text-rose-950" :
                t.type === 'warning' ? "bg-white border-amber-100 text-amber-950" :
                "bg-ink-950 border-white/10 text-white"
              )}
            >
              <div className={cn(
                "flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center",
                t.type === 'success' ? "bg-emerald-50 text-emerald-600" :
                t.type === 'error' ? "bg-rose-50 text-rose-600" :
                t.type === 'warning' ? "bg-amber-50 text-amber-600" :
                "bg-white/10 text-brand-orange"
              )}>
                {t.type === 'success' && <CheckCircle2 className="h-4 w-4" />}
                {t.type === 'error' && <AlertCircle className="h-4 w-4" />}
                {t.type === 'warning' && <AlertCircle className="h-4 w-4" />}
                {t.type === 'info' && <Bell className="h-4 w-4" />}
              </div>
              
              <p className="text-xs font-bold uppercase tracking-widest">{t.message}</p>
              
              <button 
                onClick={() => removeToast(t.id)}
                className="absolute top-1/2 -translate-y-1/2 right-3 p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-lux"
              >
                <X className="h-3 w-3" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
