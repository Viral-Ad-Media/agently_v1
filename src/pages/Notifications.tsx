import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, CheckCircle2, Phone, UserPlus, Info, Trash2, X, Filter, Sparkles, MessageCircle } from 'lucide-react';
import { LuxuryCard } from '@/src/components/ui/LuxuryCard';
import { LuxuryButton } from '@/src/components/ui/LuxuryButton';
import { cn } from '@/src/lib/utils';
import { voiceCallsApi } from '@/src/services/voiceCallsApi';
import { TenantNotification } from '@/src/types';
import { useToast } from '@/src/components/ui/ToastProvider';

const TYPE_ICONS: Record<string, any> = {
  call_completed: Phone,
  call_failed: Phone,
  message_captured: MessageCircle,
  lead_requested_follow_up: UserPlus,
  unanswered_question_captured: Info,
  transfer_requested: Phone,
  schedule_completed: CheckCircle2,
  schedule_failed: Info,
};

const TYPE_COLORS: Record<string, string> = {
  call_completed: 'bg-emerald-50 text-emerald-600',
  call_failed: 'bg-red-50 text-red-500',
  message_captured: 'bg-blue-50 text-blue-600',
  lead_requested_follow_up: 'bg-brand-orange/10 text-brand-orange',
  transfer_requested: 'bg-amber-50 text-amber-600',
  schedule_completed: 'bg-emerald-50 text-emerald-600',
};

export default function Notifications() {
  const { toast } = useToast();
  const [notifs, setNotifs] = React.useState<TenantNotification[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState<'all' | 'unread'>('all');

  const load = async () => {
    try {
      const data = await voiceCallsApi.notifications.getNotifications({ limit: 50 }) as any;
      const list = data?.notifications || data?.items || data?.data || [];
      setNotifs(Array.isArray(list) ? list : []);
    } catch {} finally { setLoading(false); }
  };

  React.useEffect(() => { void load(); }, []);

  const displayed = filter === 'unread' ? notifs.filter(n => !n.is_read) : notifs;
  const unreadCount = notifs.filter(n => !n.is_read).length;

  const markRead = async (id: string) => {
    try {
      await voiceCallsApi.notifications.markNotificationRead(id);
      setNotifs(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch {}
  };

  const markAllRead = async () => {
    try {
      await voiceCallsApi.notifications.markAllNotificationsRead();
      setNotifs(prev => prev.map(n => ({ ...n, is_read: true })));
      toast('All notifications marked as read.', 'success');
    } catch {}
  };

  const deleteNotif = async (id: string) => {
    try {
      await voiceCallsApi.notifications.deleteNotification(id);
      setNotifs(prev => prev.filter(n => n.id !== id));
    } catch {}
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-semibold tracking-tight text-ink-950">Notifications</h1>
          <p className="text-slate-lux mt-2">Real-time alerts from your AI agents and system events.</p>
        </div>
        <div className="flex gap-3">
          {unreadCount > 0 && (
            <LuxuryButton variant="secondary" size="sm" onClick={markAllRead}>
              <CheckCircle2 className="h-4 w-4 mr-2" /> Mark All Read
            </LuxuryButton>
          )}
        </div>
      </div>

      {/* Stats + filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex gap-2">
          {(['all', 'unread'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={cn('px-4 py-2 rounded-luxury text-xs font-bold uppercase tracking-wider transition-all', filter === f ? 'bg-ink-950 text-white' : 'bg-white border border-line-soft text-slate-lux hover:border-brand-orange/30')}>
              {f} {f === 'unread' && unreadCount > 0 && `(${unreadCount})`}
            </button>
          ))}
        </div>
      </div>

      <LuxuryCard className="overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-orange border-t-transparent" />
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-20 text-slate-lux">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p className="font-medium">No notifications</p>
            <p className="text-sm mt-1">{filter === 'unread' ? 'You\'re all caught up!' : 'Notifications will appear here as your agents work.'}</p>
          </div>
        ) : (
          <AnimatePresence>
            <div className="divide-y divide-line-soft">
              {displayed.map((notif) => {
                const IconComp = TYPE_ICONS[notif.type] ?? Bell;
                const colorClass = TYPE_COLORS[notif.type] ?? 'bg-slate-100 text-slate-500';
                return (
                  <motion.div key={notif.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }}
                    className={cn('flex items-start gap-4 p-5 hover:bg-slate-50 transition-colors', !notif.is_read && 'bg-brand-orange-soft/30')}
                    onClick={() => !notif.is_read && markRead(notif.id)}
                  >
                    <div className={cn('p-2.5 rounded-xl flex-shrink-0 mt-0.5', colorClass)}>
                      <IconComp className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-ink-900 text-sm">{notif.title || notif.type}</p>
                        {!notif.is_read && <span className="w-2 h-2 bg-brand-orange rounded-full flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-slate-lux mt-0.5 line-clamp-2">{notif.message || notif.body}</p>
                      <p className="text-[10px] text-slate-lux/70 mt-1">{new Date(notif.created_at).toLocaleString()}</p>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); void deleteNotif(notif.id); }} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-lux hover:text-red-500 transition-colors flex-shrink-0">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        )}
      </LuxuryCard>
    </div>
  );
}
