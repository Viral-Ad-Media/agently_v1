import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, CheckCircle2, Phone, UserPlus, Info, Trash2, X, Filter, MoreVertical, Sparkles, MessageCircle } from 'lucide-react';
import { LuxuryCard } from '@/src/components/ui/LuxuryCard';
import { LuxuryButton } from '@/src/components/ui/LuxuryButton';
import { cn } from '@/src/lib/utils';

interface Notification {
  id: string;
  type: 'call' | 'lead' | 'billing' | 'system';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

const initialNotifications: Notification[] = [
  { id: '1', type: 'call', title: 'Successful Conversion', message: 'Inbound call from (415) 800-4122 resulted in a scheduled demo.', time: '5 mins ago', isRead: false },
  { id: '2', type: 'lead', title: 'New Multi-unit Lead', message: 'Jonathan Sterling from Vertex Solutions added via Web Chat.', time: '12 mins ago', isRead: false },
  { id: '3', type: 'system', title: 'System Optimization', message: 'Voice synthesis latency reduced by 15% across all active agents.', time: '1 hour ago', isRead: true },
  { id: '4', type: 'billing', title: 'Usage Alert', message: 'Enterprise Workspace has used 80% of monthly minute quota.', time: '2 hours ago', isRead: true },
  { id: '5', type: 'call', title: 'Missed Call Handled', message: 'Sarah auto-escalated a complex support query to secondary tier.', time: '4 hours ago', isRead: true },
];

export default function Notifications() {
  const [notifs, setNotifs] = React.useState(initialNotifications);
  const [filter, setFilter] = React.useState<'all' | 'unread'>('all');

  const filteredNotifs = filter === 'all' ? notifs : notifs.filter(n => !n.isRead);

  const markRead = (id: string) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const deleteNotif = (id: string) => {
    setNotifs(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <div className="flex items-center gap-2 mb-2">
              <span className="p-1 px-2.5 rounded-full bg-brand-orange-soft text-brand-orange text-[10px] font-bold uppercase tracking-widest border border-brand-orange/20 flex items-center gap-1.5">
                 <Sparkles className="h-3 w-3" />
                 Intelligence Feed
              </span>
           </div>
           <h1 className="text-4xl font-display font-semibold tracking-tight text-ink-950">System Notifications</h1>
           <p className="text-slate-lux mt-2">Critical activity and real-time intelligence events.</p>
        </div>
        <div className="flex gap-3">
           <LuxuryButton variant="secondary" size="sm" onClick={() => setNotifs(prev => prev.map(n => ({ ...n, isRead: true })))}>
              Mark All Read
           </LuxuryButton>
           <div className="flex p-1 bg-slate-100 rounded-lg">
              <button 
                onClick={() => setFilter('all')}
                className={cn(
                  "px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded transition-all",
                  filter === 'all' ? "bg-white text-ink-950 shadow-sm" : "text-slate-lux hover:text-ink-950"
                )}
              >
                All
              </button>
              <button 
                onClick={() => setFilter('unread')}
                className={cn(
                  "px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded transition-all",
                  filter === 'unread' ? "bg-white text-ink-950 shadow-sm" : "text-slate-lux hover:text-ink-950"
                )}
              >
                Unread
              </button>
           </div>
        </div>
      </div>

      <div className="max-w-4xl space-y-4">
        <AnimatePresence mode="popLayout text-left">
           {filteredNotifs.length === 0 ? (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="py-32 flex flex-col items-center justify-center text-center space-y-6"
             >
                <div className="h-24 w-24 rounded-full bg-slate-50 border border-line-soft flex items-center justify-center">
                   <Bell className="h-10 w-10 text-slate-lux/20" />
                </div>
                <div className="space-y-1">
                   <h3 className="text-xl font-display font-semibold text-ink-950">Inbox is Clear</h3>
                   <p className="text-slate-lux">No critical notifications discovered at this time.</p>
                </div>
             </motion.div>
           ) : (
             filteredNotifs.map((n) => (
                <motion.div
                  key={n.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={cn(
                    "group relative overflow-hidden",
                    !n.isRead && "ring-1 ring-brand-orange shadow-lg shadow-brand-orange/5"
                  )}
                >
                   <LuxuryCard padding="none" className={cn(
                     "relative border transition-all duration-300",
                     n.isRead ? "bg-white border-line-soft shadow-sm" : "bg-brand-orange/[0.02] border-brand-orange/20"
                   )}>
                      <div className="flex items-start gap-5 p-6">
                         <div className={cn(
                           "flex-shrink-0 h-11 w-11 rounded-xl flex items-center justify-center",
                           n.type === 'call' ? "bg-emerald-50 text-emerald-600" :
                           n.type === 'lead' ? "bg-blue-50 text-blue-600" :
                           n.type === 'billing' ? "bg-amber-50 text-amber-600" :
                           "bg-slate-50 text-slate-600"
                         )}>
                            {n.type === 'call' && <Phone className="h-5 w-5" />}
                            {n.type === 'lead' && <UserPlus className="h-5 w-5" />}
                            {n.type === 'billing' && <Info className="h-5 w-5" />}
                            {n.type === 'system' && <Bell className="h-5 w-5" />}
                         </div>
                         
                         <div className="flex-1 min-w-0 pr-12">
                            <div className="flex items-center gap-3 mb-1">
                               <h3 className={cn(
                                 "text-base font-semibold tracking-tight truncate",
                                 n.isRead ? "text-ink-900" : "text-ink-950"
                               )}>{n.title}</h3>
                               {!n.isRead && <div className="h-2 w-2 rounded-full bg-brand-orange animate-pulse" />}
                            </div>
                            <p className="text-sm text-slate-lux leading-relaxed max-w-2xl">{n.message}</p>
                            <div className="mt-3 flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-lux/40">
                               <span>{n.time}</span>
                               <span className="h-1 w-1 rounded-full bg-slate-300" />
                               <span className="uppercase">{n.type} Management</span>
                            </div>
                         </div>

                         {/* Actions Overlay */}
                         <div className="absolute top-6 right-6 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!n.isRead && (
                              <button 
                                onClick={() => markRead(n.id)}
                                className="p-2 hover:bg-emerald-50 text-slate-lux hover:text-emerald-600 rounded-lg transition-all"
                                title="Mark read"
                              >
                                 <CheckCircle2 className="h-4 w-4" />
                              </button>
                            )}
                            <button 
                              onClick={() => deleteNotif(n.id)}
                              className="p-2 hover:bg-rose-50 text-slate-lux hover:text-rose-600 rounded-lg transition-all"
                              title="Delete notification"
                            >
                               <Trash2 className="h-4 w-4" />
                            </button>
                         </div>
                      </div>

                      {/* Active status bar */}
                      {!n.isRead && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-orange" />
                      )}
                   </LuxuryCard>
                </motion.div>
             ))
           )}
        </AnimatePresence>
      </div>
    </div>
  );
}
