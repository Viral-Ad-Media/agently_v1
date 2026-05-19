import * as React from 'react';
import { 
  Send, 
  Calendar, 
  Plus, 
  Clock, 
  Users, 
  Target, 
  Search, 
  ChevronRight, 
  MoreVertical,
  Play,
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { LuxuryCard } from '@/src/components/ui/LuxuryCard';
import { LuxuryButton } from '@/src/components/ui/LuxuryButton';
import { cn } from '@/src/lib/utils';

const schedules = [
  { id: '1', name: 'Premium Callback Campaign', agent: 'Elena', targeted: '120 Leads', status: 'active', frequency: 'Monthly', nextRun: 'May 20, 09:00 AM' },
  { id: '2', name: 'Post-Support Followup', agent: 'Marcus', targeted: 'Dynamic', status: 'active', frequency: 'Daily', nextRun: 'May 19, 08:30 AM' },
  { id: '3', name: 'Abandoned Cart Rescue', agent: 'Sarah', targeted: '45 Leads', status: 'paused', frequency: 'Real-time', nextRun: 'Paused' },
];

export default function OutreachScheduler() {
  const [view, setView] = React.useState<'list' | 'create'>('list');

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <h1 className="text-4xl font-display font-semibold tracking-tight text-ink-950">Outreach Orchester</h1>
           <p className="text-slate-lux mt-2">Scale your proactive voice outreach with automated scheduling.</p>
        </div>
        <div className="flex gap-3">
           <LuxuryButton variant={view === 'list' ? 'secondary' : 'tertiary'} size="sm" onClick={() => setView('list')}>
              Active Campaigns
           </LuxuryButton>
           <LuxuryButton size="sm" onClick={() => setView('create')}>
              <Plus className="h-4 w-4 mr-2" />
              New Orchestration
           </LuxuryButton>
        </div>
      </div>

      {view === 'list' ? (
        <div className="space-y-6">
           <div className="flex items-center gap-4 bg-white p-2 rounded-luxury border border-line-soft">
              <div className="relative flex-1">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-lux/40" />
                 <input className="w-full h-11 pl-12 pr-4 bg-transparent outline-none text-sm placeholder:text-slate-lux/30" placeholder="Search campaigns..." />
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schedules.map((schedule) => (
                <LuxuryCard key={schedule.id} className="group hover:border-brand-orange/40 transition-all">
                   <div className="flex items-start justify-between mb-6">
                      <div className="h-11 w-11 rounded-xl bg-ink-950 text-white flex items-center justify-center">
                         <Target className="h-5 w-5 text-brand-orange" />
                      </div>
                      <div className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                        schedule.status === 'active' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-100"
                      )}>
                         {schedule.status}
                      </div>
                   </div>

                   <div className="space-y-2 mb-6">
                      <h3 className="text-lg font-display font-semibold text-ink-950 truncate pr-4">{schedule.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-slate-lux font-medium">
                         <Users className="h-3.5 w-3.5 text-slate-lux/40" />
                         {schedule.targeted}
                         <span className="h-1 w-1 rounded-full bg-slate-200" />
                         {schedule.agent} Agent
                      </div>
                   </div>

                   <div className="pt-4 border-t border-line-soft grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                         <p className="text-[9px] font-bold text-slate-lux/40 uppercase tracking-widest">Frequency</p>
                         <div className="flex items-center gap-1.5 text-xs font-bold text-ink-900">
                            <RotateCcw className="h-3 w-3 text-brand-orange" />
                            {schedule.frequency}
                         </div>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[9px] font-bold text-slate-lux/40 uppercase tracking-widest">Next Run</p>
                         <div className="flex items-center gap-1.5 text-xs font-bold text-ink-900">
                            <Clock className="h-3 w-3 text-brand-orange" />
                            {schedule.nextRun}
                         </div>
                      </div>
                   </div>

                   <div className="mt-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <LuxuryButton variant="glass" size="sm" className="flex-1 text-[11px] h-9">
                         View Details
                      </LuxuryButton>
                      <button className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 border border-line-soft hover:bg-slate-100 text-slate-lux transition-colors">
                         <MoreVertical className="h-4 w-4" />
                      </button>
                   </div>
                </LuxuryCard>
              ))}
           </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
           <LuxuryCard padding="lg" variant="glass" className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-slate-lux">Campaign Name</label>
                       <input className="w-full h-12 px-4 rounded-xl border border-line-soft focus:ring-2 focus:ring-brand-orange/20 outline-none" placeholder="e.g. VIP Member Rewards" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-slate-lux">Assigned Voice Agent</label>
                       <select className="w-full h-12 px-4 rounded-xl border border-line-soft appearance-none outline-none focus:ring-2 focus:ring-brand-orange/20">
                          <option>Select Agent...</option>
                          <option>Sarah (Front Desk)</option>
                          <option>Marcus (Support)</option>
                          <option>Elena (Sales)</option>
                       </select>
                    </div>
                 </div>
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-slate-lux">Target Audience</label>
                       <select className="w-full h-12 px-4 rounded-xl border border-line-soft appearance-none outline-none focus:ring-2 focus:ring-brand-orange/20">
                          <option>Select Tag...</option>
                          <option>Enterprise Leads</option>
                          <option>Healthcare Sector</option>
                          <option>Retail Follow-ups</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-slate-lux">Orchestration Mode</label>
                       <div className="flex p-1 bg-slate-100 rounded-xl">
                          <button className="flex-1 py-2 text-xs font-bold uppercase rounded-lg bg-white shadow-sm">Once</button>
                          <button className="flex-1 py-2 text-xs font-bold uppercase text-slate-lux">Recurring</button>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="p-6 rounded-2xl bg-amber-50 border border-amber-100 flex items-start gap-4">
                 <AlertCircle className="h-6 w-6 text-amber-500 mt-1" />
                 <div>
                    <h4 className="font-semibold text-ink-950 mb-1 leading-none">Global Compliance Check</h4>
                    <p className="text-sm text-slate- lux/70 leading-relaxed">
                       This campaign will fire calls between 09:00 and 17:00 in each recipient's local timezone to minimize regulatory friction.
                    </p>
                 </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-line-soft">
                 <button onClick={() => setView('list')} className="text-sm font-bold text-slate-lux hover:text-ink-950 uppercase tracking-widest">Cancel</button>
                 <LuxuryButton className="h-12 px-10 group shadow-xl shadow-brand-orange/20">
                    Deploy Campaign
                    <Send className="h-4 w-4 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                 </LuxuryButton>
              </div>
           </LuxuryCard>
        </div>
      )}
    </div>
  );
}
