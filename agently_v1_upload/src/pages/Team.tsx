import * as React from 'react';
import { Users, Mail, Shield, ShieldCheck, MoreHorizontal, UserPlus, Search, ShieldAlert } from 'lucide-react';
import { LuxuryCard } from '@/src/components/ui/LuxuryCard';
import { LuxuryButton } from '@/src/components/ui/LuxuryButton';
import { cn } from '@/src/lib/utils';

const team = [
  { id: '1', name: 'Alex Thompson', email: 'alex@agently.ai', role: 'Owner', status: 'active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
  { id: '2', name: 'Jordan Vance', email: 'jordan@agently.ai', role: 'Admin', status: 'active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan' },
  { id: '3', name: 'Casey Smith', email: 'casey@support.com', role: 'Member', status: 'active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Casey' },
  { id: '4', name: 'Taylor Brooks', email: 'taylor@guest.com', role: 'Viewer', status: 'pending', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor' },
];

export default function Team() {
  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <h1 className="text-4xl font-display font-semibold tracking-tight text-ink-950">Team & Governance</h1>
           <p className="text-slate-lux mt-2">Manage access controls and collaborative workspace permissions.</p>
        </div>
        <LuxuryButton size="sm">
           <UserPlus className="h-4 w-4 mr-2" />
           Invite Member
        </LuxuryButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Total Members', value: '4 / 10', icon: Users, color: 'text-brand-orange' },
           { label: 'Active Admins', value: '2', icon: ShieldCheck, color: 'text-emerald-500' },
           { label: 'Pending Invites', value: '1', icon: Mail, color: 'text-blue-500' },
           { label: 'Security Score', value: '94%', icon: Shield, color: 'text-brand-orange' },
         ].map((stat, i) => (
            <LuxuryCard key={i} className="flex flex-col justify-between h-32">
               <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold text-slate-lux uppercase tracking-[0.2em]">{stat.label}</p>
                  <stat.icon className={cn("h-4 w-4", stat.color)} />
               </div>
               <h3 className="text-2xl font-display font-semibold text-ink-950">{stat.value}</h3>
            </LuxuryCard>
         ))}
      </div>

      <div className="flex items-center gap-4 bg-white p-2 rounded-luxury border border-line-soft">
         <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-lux/40" />
            <input className="w-full h-11 pl-12 pr-4 bg-transparent outline-none text-sm placeholder:text-slate-lux/30" placeholder="Search team by name or email..." />
         </div>
      </div>

      <LuxuryCard padding="none" className="overflow-hidden border border-line-soft shadow-sm">
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
               <thead>
                  <tr className="bg-slate-50 border-b border-line-soft text-[10px] font-bold uppercase tracking-[0.15em] text-slate-lux">
                     <th className="px-6 py-4">User</th>
                     <th className="px-6 py-4">Role</th>
                     <th className="px-6 py-4">Status</th>
                     <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-line-soft bg-white">
                  {team.map((member) => (
                     <tr key={member.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-xl bg-slate-100 border border-line-soft overflow-hidden">
                                 <img src={member.avatar} alt={member.name} referrerPolicy="no-referrer" />
                              </div>
                              <div>
                                 <div className="font-semibold text-ink-950">{member.name}</div>
                                 <div className="text-[10px] text-slate-lux font-bold uppercase tracking-widest">{member.email}</div>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-2">
                              {member.role === 'Owner' || member.role === 'Admin' ? (
                                <ShieldCheck className="h-3.5 w-3.5 text-brand-orange" />
                              ) : (
                                <Users className="h-3.5 w-3.5 text-slate-lux" />
                              )}
                              <span className="text-slate-lux font-medium">{member.role}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <span className={cn(
                             "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                             member.status === 'active' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                           )}>
                              {member.status}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button className="p-2 hover:bg-slate-100 text-slate-lux rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="h-4 w-4" />
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </LuxuryCard>
      
      <div className="p-6 rounded-2xl bg-ink-950 text-white flex items-center justify-between border border-white/10">
         <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center">
               <ShieldAlert className="h-6 w-6 text-brand-orange" />
            </div>
            <div>
               <h4 className="font-display font-semibold text-lg leading-tight">Advanced Security Ready</h4>
               <p className="text-sm text-white/40">Enable SSO and 2FA for your entire organization in one click.</p>
            </div>
         </div>
         <LuxuryButton variant="glass" size="sm" className="bg-white/10 border-white/10 hover:bg-white/20 text-white">
            Enable MFA
         </LuxuryButton>
      </div>
    </div>
  );
}
