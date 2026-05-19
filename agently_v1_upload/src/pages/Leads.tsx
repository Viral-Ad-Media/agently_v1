import * as React from 'react';
import { Users, Search, Plus, Filter, Tag, MoreHorizontal, Mail, Phone, Download } from 'lucide-react';
import { LuxuryCard } from '@/src/components/ui/LuxuryCard';
import { LuxuryButton } from '@/src/components/ui/LuxuryButton';
import { cn } from '@/src/lib/utils';

const leads = [
  { id: '1', name: 'Jonathan Sterling', company: 'Vertex Solutions', status: 'qualified', phone: '+1 555-0192', tags: ['Enterprise', 'High Intent'] },
  { id: '2', name: 'Sarah Miller', company: 'Astra Health', status: 'contacted', phone: '+1 555-0184', tags: ['Clinical'] },
  { id: '3', name: 'Robert Chen', company: 'Nova Labs', status: 'new', phone: '+1 555-0273', tags: ['Inbound'] },
  { id: '4', name: 'Elena Rodriguez', company: 'Global Real Estate', status: 'converted', phone: '+1 555-0311', tags: ['VIP'] },
];

export default function Leads() {
  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <h1 className="text-4xl font-display font-semibold tracking-tight text-ink-950">Leads CRM</h1>
           <p className="text-slate-lux mt-2">Manage customers captured by your AI receptionists.</p>
        </div>
        <div className="flex gap-3">
           <LuxuryButton variant="secondary" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Import
           </LuxuryButton>
           <LuxuryButton size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Lead
           </LuxuryButton>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label: 'Total Leads', value: '1,240', color: 'bg-brand-orange' },
           { label: 'Qualified', value: '342', color: 'bg-emerald-500' },
           { label: 'New This Week', value: '12', color: 'bg-blue-500' },
         ].map((stat, i) => (
            <LuxuryCard key={i} className="flex items-center justify-between">
               <div>
                  <p className="text-[10px] font-bold text-slate-lux uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-display font-semibold text-ink-950">{stat.value}</h3>
               </div>
               <div className={cn("h-10 w-1 flex rounded-full", stat.color)} />
            </LuxuryCard>
         ))}
      </div>

      <div className="flex items-center gap-4 bg-white p-2 rounded-luxury border border-line-soft">
         <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-lux/40" />
            <input className="w-full h-11 pl-12 pr-4 bg-transparent outline-none text-sm placeholder:text-slate-lux/30" placeholder="Search by name, company, or phone..." />
         </div>
      </div>

      <LuxuryCard padding="none" className="overflow-hidden border border-line-soft shadow-sm">
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
               <thead>
                  <tr className="bg-slate-50 border-b border-line-soft text-[10px] font-bold uppercase tracking-[0.15em] text-slate-lux">
                     <th className="px-6 py-4">Lead</th>
                     <th className="px-6 py-4">Company</th>
                     <th className="px-6 py-4">Status</th>
                     <th className="px-6 py-4">Tags</th>
                     <th className="px-6 py-4 text-right">Contact</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-line-soft bg-white">
                  {leads.map((lead) => (
                     <tr key={lead.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4">
                           <div className="font-semibold text-ink-950">{lead.name}</div>
                        </td>
                        <td className="px-6 py-4 text-slate-lux font-medium">{lead.company}</td>
                        <td className="px-6 py-4">
                           <span className={cn(
                             "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                             lead.status === 'qualified' ? "bg-emerald-50 text-emerald-600" :
                             lead.status === 'contacted' ? "bg-blue-50 text-blue-600" :
                             lead.status === 'new' ? "bg-amber-50 text-amber-600" : "bg-ink-100 text-ink-900"
                           )}>
                              {lead.status}
                           </span>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex flex-wrap gap-1.5">
                              {lead.tags.map(tag => (
                                 <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-bold uppercase tracking-wider border border-slate-200">
                                    {tag}
                                 </span>
                              ))}
                           </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex items-center justify-end gap-2">
                              <button className="p-2 hover:bg-slate-100 text-slate-lux rounded-lg">
                                 <Mail className="h-4 w-4" />
                              </button>
                              <button className="p-2 hover:bg-slate-100 text-slate-lux rounded-lg">
                                 <Phone className="h-4 w-4" />
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
