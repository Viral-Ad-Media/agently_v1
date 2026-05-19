import * as React from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Lock, 
  Bell, 
  Globe, 
  Database, 
  Cpu, 
  Trash2, 
  ChevronRight,
  ShieldCheck,
  Smartphone,
  Cloud
} from 'lucide-react';
import { LuxuryCard } from '@/src/components/ui/LuxuryCard';
import { LuxuryButton } from '@/src/components/ui/LuxuryButton';
import { cn } from '@/src/lib/utils';

export default function Settings() {
  const [activeTab, setActiveTab] = React.useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'nodes', label: 'Compute Nodes', icon: Cpu },
    { id: 'database', label: 'Data Registry', icon: Database },
  ];

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <h1 className="text-4xl font-display font-semibold tracking-tight text-ink-950">System Nexus</h1>
           <p className="text-slate-lux mt-2">Core configuration and global environment parameters.</p>
        </div>
        <LuxuryButton size="sm">
           Save Changes
        </LuxuryButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="lg:col-span-1 space-y-2">
           {tabs.map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={cn(
                 "w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 group",
                 activeTab === tab.id 
                  ? "bg-ink-950 text-white shadow-lg shadow-ink-950/20" 
                  : "bg-white text-slate-lux border border-line-soft hover:bg-slate-50"
               )}
             >
                <div className="flex items-center gap-3">
                   <tab.icon className={cn(
                     "h-5 w-5 transition-colors",
                     activeTab === tab.id ? "text-brand-orange" : "text-slate-lux/40 group-hover:text-slate-lux"
                   )} />
                   <span className="text-sm font-semibold">{tab.label}</span>
                </div>
                {activeTab === tab.id && <ChevronRight className="h-4 w-4 text-white/40" />}
             </button>
           ))}

           <div className="pt-8 space-y-4">
              <LuxuryCard variant="glass" className="border-rose-100 bg-rose-50/20">
                 <h4 className="text-[10px] font-bold text-rose-600 uppercase tracking-widest mb-1 flex items-center gap-2">
                    <Trash2 className="h-3 w-3" />
                    Danger Zone
                 </h4>
                 <p className="text-[11px] text-rose-600/70 mb-4">Permanent workspace removal is irreversible.</p>
                 <button className="text-[10px] font-bold uppercase tracking-widest text-rose-600 hover:underline">
                    Terminate Environment
                 </button>
              </LuxuryCard>
           </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
           <LuxuryCard className="min-h-[600px] space-y-10">
              {activeTab === 'general' && (
                <div className="space-y-10">
                   <section className="space-y-6">
                      <div className="flex items-center gap-3 text-ink-950">
                         <Globe className="h-5 w-5 text-brand-orange" />
                         <h3 className="text-xl font-display font-semibold">Global Environment</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-lux">Workspace Domain</label>
                            <div className="relative">
                               <input className="w-full h-12 px-4 rounded-xl border border-line-soft bg-slate-50/50 outline-none pr-32 font-medium" defaultValue="alpha-one" />
                               <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-lux/40">.agently.ai</span>
                            </div>
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-lux">Compliance Region</label>
                            <select className="w-full h-12 px-4 rounded-xl border border-line-soft bg-white appearance-none outline-none focus:ring-2 focus:ring-brand-orange/20">
                               <option>United States (Virginia)</option>
                               <option>European Union (Dublin)</option>
                               <option>Asia Pacific (Singapore)</option>
                            </select>
                         </div>
                      </div>
                   </section>

                   <section className="space-y-6 pt-10 border-t border-line-soft">
                      <div className="flex items-center gap-3 text-ink-950">
                         <Cloud className="h-5 w-5 text-brand-orange" />
                         <h3 className="text-xl font-display font-semibold">Third-Party Integrations</h3>
                      </div>
                      <div className="space-y-4">
                         {[
                           { name: 'Stripe Terminal', status: 'Connected', icon: Smartphone },
                           { name: 'HubSpot CRM', status: 'Disconnected', icon: Database },
                           { name: 'Slack Notifications', status: 'Connected', icon: Bell },
                         ].map((integration, i) => (
                           <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-line-soft bg-slate-50/30 group hover:bg-slate-50 transition-colors">
                              <div className="flex items-center gap-4">
                                 <div className="h-10 w-10 rounded-xl bg-white border border-line-soft flex items-center justify-center">
                                    <integration.icon className="h-5 w-5 text-slate-lux/60" />
                                 </div>
                                 <span className="font-semibold text-ink-950">{integration.name}</span>
                              </div>
                              <div className="flex items-center gap-4">
                                 <span className={cn(
                                   "text-[10px] font-bold uppercase tracking-widest",
                                   integration.status === 'Connected' ? "text-emerald-500" : "text-slate- lux/40"
                                 )}>{integration.status}</span>
                                 <LuxuryButton variant="glass" size="sm" className="h-8 py-0 px-4 text-[10px]">
                                   {integration.status === 'Connected' ? 'Configure' : 'Connect'}
                                 </LuxuryButton>
                              </div>
                           </div>
                         ))}
                      </div>
                   </section>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-10">
                   <div className="p-6 rounded-2xl bg-brand-orange-soft border border-brand-orange/20 flex items-start gap-4">
                      <ShieldCheck className="h-6 w-6 text-brand-orange mt-1" />
                      <div>
                         <h4 className="font-semibold text-brand-orange-600 mb-1">Security Health: Optimized</h4>
                         <p className="text-sm text-brand-orange-600/70 leading-relaxed">Your workspace is protected by Enterprise-grade encryption and adaptive MFA. No vulnerabilities detected.</p>
                      </div>
                   </div>
                   
                   <section className="space-y-6">
                      <h3 className="text-xl font-display font-semibold flex items-center gap-3">
                         <Lock className="h-5 w-5 text-brand-orange" />
                         Authentication Protocol
                      </h3>
                      <div className="space-y-4">
                         <div className="flex items-center justify-between p-4 border-b border-line-soft">
                            <div>
                               <p className="font-bold text-ink-950">Multi-Factor Authentication</p>
                               <p className="text-xs text-slate-lux">Require a secondary code for all administrative actions.</p>
                            </div>
                            <div className="h-6 w-12 bg-brand-orange rounded-full relative">
                               <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full" />
                            </div>
                         </div>
                         <div className="flex items-center justify-between p-4 border-b border-line-soft">
                            <div>
                               <p className="font-bold text-ink-950">Strict IP Access</p>
                               <p className="text-xs text-slate-lux">Restrict workspace access to pre-defined CIDR blocks.</p>
                            </div>
                            <div className="h-6 w-12 bg-slate-200 rounded-full relative">
                               <div className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full" />
                            </div>
                         </div>
                      </div>
                   </section>
                </div>
              )}

              {activeTab === 'nodes' && (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                   <div className="h-20 w-20 rounded-3xl bg-slate-50 border border-line-soft flex items-center justify-center">
                      <Cpu className="h-10 w-10 text-slate-lux/20 animate-pulse" />
                   </div>
                   <div className="space-y-2">
                      <h3 className="text-2xl font-display font-semibold text-ink-950">Compute Management</h3>
                      <p className="text-slate-lux container max-w-sm">Manage the high-performance GPU nodes that power your voice synthesis models.</p>
                   </div>
                   <LuxuryButton variant="secondary">Provision Node</LuxuryButton>
                </div>
              )}
           </LuxuryCard>
        </div>
      </div>
    </div>
  );
}
