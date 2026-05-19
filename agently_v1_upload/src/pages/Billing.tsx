import * as React from 'react';
import { CreditCard, Zap, Download, ArrowUpRight, History, ShieldAlert, TrendingUp, Sparkles, Check } from 'lucide-react';
import { LuxuryCard } from '@/src/components/ui/LuxuryCard';
import { LuxuryButton } from '@/src/components/ui/LuxuryButton';
import { cn } from '@/src/lib/utils';

export default function Billing() {
  const currentPlan = "Enterprise Lux";
  const status = "Active";

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <div className="flex items-center gap-2 mb-2">
              <span className="p-1 px-2.5 rounded-full bg-brand-orange-soft text-brand-orange text-[10px] font-bold uppercase tracking-widest border border-brand-orange/20 flex items-center gap-1.5">
                 <Sparkles className="h-3 w-3" />
                 Premium Managed
              </span>
           </div>
           <h1 className="text-4xl font-display font-semibold tracking-tight text-ink-950">Usage & Subscription</h1>
           <p className="text-slate-lux mt-2">Scale and monitor your voice infrastructure resources.</p>
        </div>
        <div className="flex gap-3">
           <LuxuryButton variant="secondary" size="sm">
              Manage Payment
           </LuxuryButton>
           <LuxuryButton size="sm">
              Upgrade Workspace
           </LuxuryButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Plan Card */}
        <div className="lg:col-span-1">
           <LuxuryCard variant="ink" className="h-full relative overflow-hidden group">
              <div className="relative z-10 space-y-8">
                 <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Current Environment</p>
                    <h3 className="text-3xl font-display font-semibold text-white">{currentPlan}</h3>
                    <div className="flex items-center gap-2">
                       <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                       <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">{status}</span>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                       <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-white/40 mb-2">
                          <span>Voice Minutes</span>
                          <span className="text-white">8,420 / 10K</span>
                       </div>
                       <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-orange w-[84%] transition-all duration-1000" />
                       </div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                       <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-white/40 mb-2">
                          <span>Smart Agents</span>
                          <span className="text-white">4 / 20</span>
                       </div>
                       <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-orange w-[20%] transition-all duration-1000" />
                       </div>
                    </div>
                 </div>

                 <div className="pt-6 border-t border-line-soft/10">
                    <div className="flex items-center justify-between">
                       <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1">Next Settlement</p>
                          <p className="text-lg font-semibold text-white">June 1, 2026</p>
                       </div>
                       <p className="text-2xl font-display font-bold text-white">$499<span className="text-sm font-normal text-white/40">/mo</span></p>
                    </div>
                 </div>
              </div>

              {/* Decorative Glow */}
              <div className="absolute top-0 right-0 h-64 w-64 bg-brand-orange/10 rounded-full blur-[80px] -mr-32 -mt-32 group-hover:bg-brand-orange/20 transition-colors" />
           </LuxuryCard>
        </div>

        {/* Right Column: Billing History */}
        <div className="lg:col-span-2 space-y-6">
           <LuxuryCard className="flex-1">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-xl font-display font-semibold text-ink-950 flex items-center gap-2">
                    <History className="h-5 w-5 text-brand-orange" />
                    Activity History
                 </h3>
                 <button className="text-[10px] font-bold uppercase tracking-widest text-slate-lux hover:text-ink-950 flex items-center gap-1">
                    Export CSV
                    <Download className="h-3 w-3" />
                 </button>
              </div>

              <div className="space-y-4">
                 {[
                   { date: 'May 1, 2026', desc: 'Enterprise Lux Plan Renewal', amount: '$499.00', status: 'Succeeded' },
                   { date: 'Apr 15, 2026', desc: 'Add-on: Premium Voice Synthesis (Marcus)', amount: '$29.00', status: 'Succeeded' },
                   { date: 'Apr 1, 2026', desc: 'Enterprise Lux Plan Renewal', amount: '$499.00', status: 'Succeeded' },
                   { date: 'Mar 1, 2026', desc: 'Enterprise Lux Plan Setup Fee', amount: '$199.00', status: 'Succeeded' },
                 ].map((inv, i) => (
                   <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-line-soft bg-slate-50/50 hover:bg-slate-50 transition-colors gap-4">
                      <div className="flex items-center gap-4">
                         <div className="h-10 w-10 rounded-lg bg-white border border-line-soft flex items-center justify-center text-slate-lux group hover:text-brand-orange transition-colors">
                            <CreditCard className="h-5 w-5" />
                         </div>
                         <div>
                            <p className="font-semibold text-ink-950">{inv.desc}</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-lux/60">{inv.date}</p>
                         </div>
                      </div>
                      <div className="flex items-center justify-between md:justify-end gap-10">
                         <p className="font-display font-semibold text-ink-950">{inv.amount}</p>
                         <div className="flex items-center gap-2 min-w-[100px] justify-end">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-lux">{inv.status}</span>
                            <button className="p-1.5 hover:bg-white rounded-md border border-transparent hover:border-line-soft text-slate-lux">
                               <Download className="h-3.5 w-3.5" />
                            </button>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </LuxuryCard>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <LuxuryCard className="flex items-center gap-4 border border-emerald-100 bg-emerald-50/20">
                 <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                    <Check className="h-6 w-6" />
                 </div>
                 <div>
                    <h4 className="font-bold text-ink-950 text-sm">Primary Payment Connected</h4>
                    <p className="text-xs text-slate-lux">Visa ending in •••• 1245</p>
                 </div>
              </LuxuryCard>
              <div className="relative group p-6 rounded-luxury border border-line-soft bg-white hover:border-brand-orange/40 transition-all cursor-pointer">
                 <div className="flex items-center gap-4 relative z-10">
                    <div className="h-12 w-12 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                       <Zap className="h-6 w-6" />
                    </div>
                    <div>
                       <h4 className="font-bold text-ink-950 text-sm">Need More Minutes?</h4>
                       <p className="text-xs text-slate-lux flex items-center gap-1">
                          Refill instantly
                          <ArrowUpRight className="h-3 w-3" />
                       </p>
                    </div>
                 </div>
                 <div className="absolute inset-0 bg-brand-orange/[0.02] opacity-0 group-hover:opacity-100 transition-opacity rounded-luxury" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
