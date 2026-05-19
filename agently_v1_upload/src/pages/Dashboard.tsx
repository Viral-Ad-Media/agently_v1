import * as React from 'react';
import { motion } from 'motion/react';
import { 
  PhoneCall, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp,
  Activity,
  Mic2,
  Calendar
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { LuxuryCard } from '@/src/components/ui/LuxuryCard';
import { LuxuryButton } from '@/src/components/ui/LuxuryButton';
import { cn } from '@/src/lib/utils';
import { useToast } from '@/src/components/ui/ToastProvider';

const data = [
  { day: 'Mon', calls: 120, minutes: 400 },
  { day: 'Tue', calls: 150, minutes: 480 },
  { day: 'Wed', calls: 180, minutes: 520 },
  { day: 'Thu', calls: 210, minutes: 600 },
  { day: 'Fri', calls: 190, minutes: 550 },
  { day: 'Sat', calls: 140, minutes: 380 },
  { day: 'Sun', calls: 110, minutes: 320 },
];

const StatCard = ({ title, value, trend, icon: Icon, trendUp }: any) => (
  <LuxuryCard variant="default" className="relative group overflow-hidden">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2.5 rounded-xl bg-ink-900 group-hover:bg-brand-orange transition-colors">
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className={cn(
        "flex items-center gap-1 text-xs font-bold font-tabular",
        trendUp ? "text-emerald-600" : "text-rose-600"
      )}>
        {trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
        {trend}
      </div>
    </div>
    <div>
      <p className="text-[10px] text-slate-lux uppercase tracking-[0.2em] font-bold mb-1">{title}</p>
      <h3 className="text-3xl font-display font-semibold tracking-tight text-ink-950 font-tabular">{value}</h3>
    </div>
    {/* Subtle glow background */}
    <div className="absolute -right-4 -bottom-4 h-24 w-24 bg-brand-orange/5 rounded-full blur-2xl group-hover:bg-brand-orange/10 transition-colors" />
  </LuxuryCard>
);

export default function Dashboard() {
  const { toast } = useToast();

  const handleDownload = () => {
    toast('Generating executive report...', 'info');
    setTimeout(() => {
      toast('Report downloaded successfully', 'success');
    }, 1500);
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-brand-orange-soft text-brand-orange-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-brand-orange/20">
                 Workspace Alpha
              </span>
              <span className="text-slate-lux text-xs flex items-center gap-1.5 font-medium">
                 <Calendar className="h-3 w-3" />
                 Last 7 Days
              </span>
           </div>
           <h1 className="text-4xl md:text-5xl font-display font-semibold tracking-tight text-ink-950">
             Executive Overview
           </h1>
        </div>
        <div className="flex items-center gap-3">
           <button 
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-white text-ink-900 border border-line-soft rounded-luxury hover:bg-slate-50 transition-colors text-sm font-medium shadow-sm"
           >
              <Activity className="h-4 w-4 text-brand-orange" />
              Download Report
           </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Calls" value="4,820" trend="+12.5%" icon={PhoneCall} trendUp={true} />
        <StatCard title="Minutes Used" value="1,240" trend="+8.2%" icon={Clock} trendUp={true} />
        <StatCard title="Agent Success" value="98.2%" trend="+2.4%" icon={CheckCircle2} trendUp={true} />
        <StatCard title="New Leads" value="156" trend="-3.1%" icon={TrendingUp} trendUp={false} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <LuxuryCard className="lg:col-span-2 min-h-[460px] flex flex-col min-w-0 overflow-hidden">
          <div className="flex items-center justify-between mb-8">
             <div>
                <h3 className="text-xl font-display font-semibold text-ink-950">System Performance</h3>
                <p className="text-sm text-slate-lux">Daily call volume tracking</p>
             </div>
             <div className="flex items-center gap-2 text-xs font-bold text-ink-950">
                <div className="h-2 w-2 rounded-full bg-brand-orange" />
                Inbound Calls
             </div>
          </div>
          <div className="flex-1 w-full min-h-[300px]">
             <ResponsiveContainer width="99%" height="100%" minWidth={0}>
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-brand-orange)" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="var(--color-brand-orange)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(15, 23, 42, 0.05)" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: '#64748b', fontVariantNumeric: 'tabular-nums' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#070a12', 
                      border: 'none', 
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                      padding: '12px'
                    }}
                    itemStyle={{ color: '#ff9900' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="calls" 
                    stroke="var(--color-brand-orange)" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorCalls)" 
                  />
                </AreaChart>
             </ResponsiveContainer>
          </div>
        </LuxuryCard>

        <LuxuryCard variant="ink" className="flex flex-col relative h-full">
           <div className="mb-8 relative z-10">
              <h3 className="text-xl font-display font-semibold text-white">Active Agents</h3>
              <p className="text-sm text-white/40">Status of your voice concierges</p>
           </div>
           <div className="space-y-4 relative z-10">
              {[
                { name: 'Sarah (Front Desk)', status: 'Active', color: 'bg-emerald-500' },
                { name: 'Marcus (Support)', status: 'Active', color: 'bg-emerald-500' },
                { name: 'Elena (Sales)', status: 'Active', color: 'bg-emerald-500' },
                { name: 'David (After Hours)', status: 'Paused', color: 'bg-amber-500' },
              ].map((agent, i) => (
                <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <Mic2 className="h-4 w-4 text-brand-orange" />
                    </div>
                    <span className="text-sm font-medium text-white/90">{agent.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", agent.color)} />
                    <span className="text-[10px] uppercase tracking-wider font-bold text-white/40">{agent.status}</span>
                  </div>
                </div>
              ))}
           </div>
           
           <LuxuryButton variant="glass" className="mt-auto relative z-10 w-full bg-white/10 border-white/10 text-white text-xs py-2 h-10">
              Go to Studio
           </LuxuryButton>

           {/* Backdrop orb */}
           <div className="absolute top-0 right-0 h-64 w-64 bg-brand-orange/10 rounded-full blur-[80px] -mr-32 -mt-32" />
        </LuxuryCard>
      </div>
    </div>
  );
}
