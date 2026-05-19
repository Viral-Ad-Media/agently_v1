import * as React from 'react';
import { Mic2, Plus, Globe, Settings, Sliders, Database, ShieldAlert } from 'lucide-react';
import { LuxuryCard } from '@/src/components/ui/LuxuryCard';
import { LuxuryButton } from '@/src/components/ui/LuxuryButton';
import { cn } from '@/src/lib/utils';

const tabs = [
  { id: 'fleet', label: 'Agent Fleet', icon: Mic2 },
  { id: 'settings', label: 'Persona & Voice', icon: Settings },
  { id: 'knowledge', label: 'Knowledge Base', icon: Database },
  { id: 'rules', label: 'Rules & Routing', icon: ShieldAlert },
];

export default function AgentSettings() {
  const [activeTab, setActiveTab] = React.useState('fleet');

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <h1 className="text-4xl font-display font-semibold tracking-tight text-ink-950">Voice Agent Studio</h1>
           <p className="text-slate-lux mt-2">Manage and train your AI concierge squad.</p>
        </div>
        <LuxuryButton className="h-12 px-6">
           <Plus className="h-4 w-4 mr-2" />
           Create New Agent
        </LuxuryButton>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-100 rounded-luxury w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-luxury transition-all",
              activeTab === tab.id ? "bg-white text-ink-950 shadow-sm" : "text-slate-lux hover:text-ink-950"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Sarah', role: 'Front Desk', status: 'active', info: 'Professional, Warm' },
          { name: 'Marcus', role: 'Technical Support', status: 'active', info: 'Analytical, Calm' },
          { name: 'Elena', role: 'Luxury Sales', status: 'draft', info: 'Sophisticated, Elegant' },
        ].map((agent, i) => (
          <LuxuryCard key={i} className="group relative">
             <div className="flex items-start justify-between mb-6">
                <div className="h-14 w-14 rounded-2xl bg-ink-950 flex items-center justify-center text-white ring-4 ring-pearl">
                   <Mic2 className="h-6 w-6 text-brand-orange" />
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                  agent.status === 'active' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-100"
                )}>
                   {agent.status}
                </div>
             </div>
             <div>
                <h3 className="text-xl font-display font-semibold text-ink-950">{agent.name}</h3>
                <p className="text-sm text-slate-lux">{agent.role}</p>
                <div className="mt-4 pt-4 border-t border-line-soft flex items-center justify-between">
                   <span className="text-[10px] font-bold text-slate-lux/40 uppercase tracking-widest">{agent.info}</span>
                   <button className="text-xs font-bold text-brand-orange uppercase tracking-widest hover:text-brand-orange-600 transition-colors">Edit</button>
                </div>
             </div>
             {agent.status === 'active' && (
               <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
             )}
          </LuxuryCard>
        ))}
      </div>
    </div>
  );
}
