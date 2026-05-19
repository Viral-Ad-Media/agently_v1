import * as React from 'react';
import { PhoneCall, Search, Filter, ArrowUpRight, Download, Play, MessageSquareText } from 'lucide-react';
import { LuxuryCard } from '@/src/components/ui/LuxuryCard';
import { LuxuryButton } from '@/src/components/ui/LuxuryButton';
import { cn } from '@/src/lib/utils';

const calls = [
  { id: '1', customer: '+1 (555) 012-3456', agent: 'Sarah', status: 'completed', duration: '4:12', time: '12 mins ago', direction: 'inbound' },
  { id: '2', customer: '+1 (555) 987-6543', agent: 'Marcus', status: 'completed', duration: '2:45', time: '45 mins ago', direction: 'outbound' },
  { id: '3', customer: '+1 (555) 246-8135', agent: 'Sarah', status: 'failed', duration: '0:12', time: '2 hours ago', direction: 'inbound' },
  { id: '4', customer: '+1 (555) 135-7924', agent: 'Elena', status: 'completed', duration: '8:50', time: '3 hours ago', direction: 'inbound' },
];

export default function CallLogs() {
  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <h1 className="text-4xl font-display font-semibold tracking-tight text-ink-950">Call Intelligence</h1>
           <p className="text-slate-lux mt-2">Archive of all AI concierge conversations and transcripts.</p>
        </div>
        <div className="flex gap-3">
           <LuxuryButton variant="secondary" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
           </LuxuryButton>
           <LuxuryButton size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
           </LuxuryButton>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-white p-2 rounded-luxury border border-line-soft">
         <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-lux/40" />
            <input className="w-full h-11 pl-12 pr-4 bg-transparent outline-none text-sm placeholder:text-slate-lux/30" placeholder="Search by number, agent, or transcript content..." />
         </div>
      </div>

      <LuxuryCard padding="none" className="overflow-hidden border border-line-soft shadow-sm">
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
               <thead>
                  <tr className="bg-slate-50 border-b border-line-soft text-[10px] font-bold uppercase tracking-[0.15em] text-slate-lux">
                     <th className="px-6 py-4">Status</th>
                     <th className="px-6 py-4">Customer</th>
                     <th className="px-6 py-4">Agent</th>
                     <th className="px-6 py-4">Direction</th>
                     <th className="px-6 py-4 font-tabular">Duration</th>
                     <th className="px-6 py-4">Time</th>
                     <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-line-soft bg-white">
                  {calls.map((call) => (
                     <tr key={call.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4">
                           <div className={cn(
                             "h-2 w-2 rounded-full",
                             call.status === 'completed' ? "bg-emerald-500" : "bg-rose-500"
                           )} />
                        </td>
                        <td className="px-6 py-4 font-semibold text-ink-950">{call.customer}</td>
                        <td className="px-6 py-4 text-slate-lux">{call.agent}</td>
                        <td className="px-6 py-4 uppercase tracking-widest text-[10px] font-bold text-slate-lux/60">{call.direction}</td>
                        <td className="px-6 py-4 font-tabular text-slate-lux">{call.duration}</td>
                        <td className="px-6 py-4 text-slate-lux">{call.time}</td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-2 hover:bg-brand-orange-soft text-slate-lux hover:text-brand-orange rounded-lg transition-all">
                                 <Play className="h-4 w-4" />
                              </button>
                              <button className="p-2 hover:bg-brand-orange-soft text-slate-lux hover:text-brand-orange rounded-lg transition-all">
                                 <MessageSquareText className="h-4 w-4" />
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </LuxuryCard>
    </div>
  );
}
