import * as React from 'react';
import { motion } from 'motion/react';
import { PhoneCall, CheckCircle2, Clock, ArrowUpRight, TrendingUp, Activity, Mic2, Calendar, Users, MessageSquare, BarChart3 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { LuxuryCard } from '@/src/components/ui/LuxuryCard';
import { LuxuryButton } from '@/src/components/ui/LuxuryButton';
import { cn } from '@/src/lib/utils';
import { useWorkspace } from '@/src/context/WorkspaceContext';
import { voiceCallsApi } from '@/src/services/voiceCallsApi';

const fmt = (n: number) => n?.toLocaleString() ?? '0';
const fmtDur = (s: number) => { const m = Math.floor(s / 60); return m >= 60 ? `${Math.floor(m/60)}h ${m%60}m` : `${m}m ${s%60}s`; };

export default function Dashboard() {
  const { workspace } = useWorkspace();
  const org = workspace?.organization ?? null;
  const dashboard = workspace?.dashboard ?? null;
  const calls = workspace?.calls ?? [];
  const leads = workspace?.leads ?? [];

  const [liveMetrics, setLiveMetrics] = React.useState<any>(null);

  React.useEffect(() => {
    voiceCallsApi.dashboard.getMetrics().then(setLiveMetrics).catch(() => {});
  }, []);

  const stats = dashboard?.stats;
  const usage = org?.subscription?.usage;
  const agentStatus = dashboard?.agentStatus;
  const weeklyFlow = dashboard?.weeklyFlow ?? [];
  const outcomeBreakdown = dashboard?.outcomeBreakdown ?? [];
  const recentCalls = calls.slice(0, 5);

  const usagePct = usage ? Math.min(100, Math.round((usage.minutes / (usage.minuteLimit || 1)) * 100)) : 0;

  const statCards = [
    { label: 'Total Calls', value: fmt(stats?.totalCalls ?? 0), icon: PhoneCall, trend: '+12%', color: 'text-brand-orange' },
    { label: 'Leads Captured', value: fmt(stats?.leadsCaptured ?? leads.length), icon: Users, trend: '+8%', color: 'text-emerald-500' },
    { label: 'Avg Duration', value: `${(stats?.avgDurationMinutes ?? 0).toFixed(1)}m`, icon: Clock, trend: '+3%', color: 'text-blue-500' },
    { label: 'Missed Calls', value: fmt(stats?.missedCalls ?? 0), icon: Activity, trend: '-5%', color: 'text-red-500' },
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-orange mb-2">
            {org?.profile?.name ?? 'Workspace'}
          </p>
          <h1 className="text-4xl font-display font-semibold tracking-tight text-ink-950">Command Center</h1>
          <p className="text-slate-lux mt-2">Real-time intelligence for your AI voice operations.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={cn('flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider', agentStatus?.online ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500')}>
            <span className={cn('w-2 h-2 rounded-full', agentStatus?.online ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300')} />
            {agentStatus?.online ? 'Agent Online' : 'Agent Offline'}
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <LuxuryCard className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={cn('p-2 rounded-xl bg-slate-50', s.color)}>
                  <s.icon className="h-5 w-5" />
                </div>
                <span className={cn('text-xs font-bold', s.trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500')}>
                  {s.trend}
                </span>
              </div>
              <p className="text-3xl font-display font-semibold text-ink-950">{s.value}</p>
              <p className="text-xs text-slate-lux mt-1 uppercase tracking-wider font-medium">{s.label}</p>
            </LuxuryCard>
          </motion.div>
        ))}
      </div>

      {/* Usage Bar */}
      <LuxuryCard className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-display font-semibold text-ink-950">Monthly Usage</h3>
            <p className="text-sm text-slate-lux">{fmt(usage?.minutes ?? 0)} of {fmt(usage?.minuteLimit ?? 0)} voice minutes used</p>
          </div>
          <span className="text-2xl font-display font-semibold text-ink-950">{usagePct}%</span>
        </div>
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${usagePct}%` }} transition={{ duration: 0.8 }}
            className={cn('h-full rounded-full', usagePct > 85 ? 'bg-red-500' : usagePct > 60 ? 'bg-amber-500' : 'bg-brand-orange')}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-slate-lux">
          <span>{fmt(usage?.calls ?? 0)} calls this month</span>
          <span>{fmt((usage?.minuteLimit ?? 0) - (usage?.minutes ?? 0))} minutes remaining</span>
        </div>
      </LuxuryCard>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly flow */}
        <LuxuryCard className="lg:col-span-2 p-6">
          <h3 className="font-display font-semibold text-ink-950 mb-6">Call Activity</h3>
          {weeklyFlow.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={weeklyFlow}>
                <defs>
                  <linearGradient id="callsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F05A25" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#F05A25" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="calls" stroke="#F05A25" fill="url(#callsGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="leads" stroke="#10b981" fill="none" strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-slate-lux text-sm">No call data yet</div>
          )}
        </LuxuryCard>

        {/* Outcomes */}
        <LuxuryCard className="p-6">
          <h3 className="font-display font-semibold text-ink-950 mb-6">Call Outcomes</h3>
          {outcomeBreakdown.length > 0 ? (
            <div className="space-y-3">
              {outcomeBreakdown.map((o) => {
                const total = outcomeBreakdown.reduce((sum, x) => sum + x.count, 0);
                const pct = total > 0 ? Math.round((o.count / total) * 100) : 0;
                return (
                  <div key={o.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-lux">{o.label}</span>
                      <span className="font-semibold text-ink-900">{o.count}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-brand-orange" style={{ width: `${pct}%`, backgroundColor: o.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-lux text-sm">No data yet</div>
          )}
        </LuxuryCard>
      </div>

      {/* Recent Calls */}
      <LuxuryCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-semibold text-ink-950">Recent Calls</h3>
          <LuxuryButton variant="secondary" size="sm" className="text-xs" onClick={() => window.location.hash = '#/calls'}>
            View All <ArrowUpRight className="h-3 w-3 ml-1" />
          </LuxuryButton>
        </div>
        {recentCalls.length === 0 ? (
          <div className="text-center py-12 text-slate-lux">No calls recorded yet. Start by testing your agent!</div>
        ) : (
          <div className="space-y-3">
            {recentCalls.map((call) => (
              <div key={call.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                <div className={cn('p-2 rounded-xl', call.direction === 'inbound' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600')}>
                  <PhoneCall className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink-900 truncate">{call.callerName || call.callerPhone}</p>
                  <p className="text-xs text-slate-lux truncate">{call.outcome} · {new Date(call.timestamp).toLocaleString()}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-ink-900">{fmtDur(call.duration)}</p>
                  <span className={cn('text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full', call.direction === 'inbound' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600')}>
                    {call.direction}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </LuxuryCard>
    </div>
  );
}
