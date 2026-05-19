import * as React from 'react';
import { Hash, Search, Plus, RefreshCw, Phone, UserPlus, Trash2 } from 'lucide-react';
import { LuxuryCard } from '@/src/components/ui/LuxuryCard';
import { LuxuryButton } from '@/src/components/ui/LuxuryButton';
import { cn } from '@/src/lib/utils';

const numbers = [
  { id: '1', number: '+1 (415) 800-4122', label: 'San Francisco Office', agent: 'Sarah', status: 'assigned' },
  { id: '2', number: '+1 (212) 555-0918', label: 'NY Front Desk', agent: 'Marcus', status: 'assigned' },
  { id: '3', number: '+1 (323) 444-1192', label: 'LA Support', agent: 'None', status: 'available' },
];

export default function PhoneNumbers() {
  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <h1 className="text-4xl font-display font-semibold tracking-tight text-ink-950">Phone Numbers</h1>
           <p className="text-slate-lux mt-2">Provision and assign global numbers to your AI fleet.</p>
        </div>
        <div className="flex gap-3">
           <LuxuryButton variant="secondary" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
           </LuxuryButton>
           <LuxuryButton size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Buy US Number
           </LuxuryButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {numbers.map((num) => (
          <LuxuryCard key={num.id} className="relative group">
             <div className="flex items-start justify-between mb-8">
                <div className="h-12 w-12 rounded-xl bg-ink-950 flex items-center justify-center text-brand-orange border border-white/10">
                   <Phone className="h-6 w-6" />
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                  num.status === 'assigned' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                )}>
                   {num.status}
                </div>
             </div>
             
             <div className="space-y-1 mb-6">
                <h3 className="text-2xl font-display font-semibold text-ink-950 tracking-tight font-tabular">
                   {num.number}
                </h3>
                <p className="text-sm text-slate-lux">{num.label}</p>
             </div>

             <div className="pt-4 border-t border-line-soft flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <UserPlus className="h-3.5 w-3.5 text-slate-lux/40" />
                   <span className="text-xs font-semibold text-ink-800">
                      {num.agent === 'None' ? 'Available' : `Assigned to ${num.agent}`}
                   </span>
                </div>
                <button className="text-slate-lux/30 hover:text-rose-500 transition-colors">
                   <Trash2 className="h-4 w-4" />
                </button>
             </div>
          </LuxuryCard>
        ))}

        <button className="group h-full min-h-[220px] rounded-luxury border-2 border-dashed border-line-soft hover:border-brand-orange/40 hover:bg-brand-orange/5 transition-all flex flex-col items-center justify-center gap-3">
           <div className="h-12 w-12 rounded-full border border-line-soft flex items-center justify-center group-hover:border-brand-orange/40 transition-colors">
              <Plus className="h-6 w-6 text-slate-lux/40 group-hover:text-brand-orange transition-colors" />
           </div>
           <span className="text-xs font-bold text-slate-lux/40 uppercase tracking-widest group-hover:text-brand-orange/60 transition-colors">Provision Number</span>
        </button>
      </div>
    </div>
  );
}
