import * as React from 'react';
import { Users, Mail, Shield, ShieldCheck, MoreHorizontal, UserPlus, Search, ShieldAlert, X, Trash2 } from 'lucide-react';
import { LuxuryCard } from '@/src/components/ui/LuxuryCard';
import { LuxuryButton } from '@/src/components/ui/LuxuryButton';
import { cn } from '@/src/lib/utils';
import { useWorkspace } from '@/src/context/WorkspaceContext';

const ROLE_COLORS: Record<string, string> = {
  Owner: 'bg-brand-orange/10 text-brand-orange',
  Admin: 'bg-blue-50 text-blue-600',
  Viewer: 'bg-slate-100 text-slate-500',
};

export default function Team() {
  const { workspace, handleInviteMember, handleRemoveMember } = useWorkspace();
  const members = workspace?.organization?.members ?? [];
  const [showInvite, setShowInvite] = React.useState(false);
  const [inviting, setInviting] = React.useState(false);
  const [form, setForm] = React.useState({ email: '', name: '', role: 'Viewer' as 'Admin' | 'Viewer' });

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);
    try { await handleInviteMember(form.email, form.role, form.name); setShowInvite(false); setForm({ email: '', name: '', role: 'Viewer' }); }
    finally { setInviting(false); }
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-semibold tracking-tight text-ink-950">Team & Governance</h1>
          <p className="text-slate-lux mt-2">Manage access controls and workspace permissions.</p>
        </div>
        <LuxuryButton size="sm" onClick={() => setShowInvite(true)}>
          <UserPlus className="h-4 w-4 mr-2" /> Invite Member
        </LuxuryButton>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Members', value: `${members.length}`, icon: Users, color: 'text-brand-orange' },
          { label: 'Admins', value: `${members.filter(m => m.role === 'Admin').length}`, icon: ShieldCheck, color: 'text-blue-500' },
          { label: 'Viewers', value: `${members.filter(m => m.role === 'Viewer').length}`, icon: Shield, color: 'text-slate-500' },
          { label: 'Owner', value: `${members.filter(m => m.role === 'Owner').length}`, icon: ShieldAlert, color: 'text-brand-orange' },
        ].map((s) => (
          <LuxuryCard key={s.label} className="p-5">
            <div className={cn('p-2 rounded-xl bg-slate-50 w-fit mb-3', s.color)}><s.icon className="h-5 w-5" /></div>
            <p className="text-2xl font-display font-semibold text-ink-950">{s.value}</p>
            <p className="text-xs text-slate-lux uppercase tracking-wider mt-1 font-medium">{s.label}</p>
          </LuxuryCard>
        ))}
      </div>

      {/* Members list */}
      <LuxuryCard className="overflow-hidden">
        <div className="divide-y divide-line-soft">
          {members.length === 0 ? (
            <div className="text-center py-16 text-slate-lux">No team members yet. Invite someone to get started.</div>
          ) : members.map((member) => (
            <div key={member.id} className="flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors">
              <div className="h-10 w-10 rounded-xl overflow-hidden bg-ink-900 flex-shrink-0">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`} alt={member.name} referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-ink-900 truncate">{member.name}</p>
                <p className="text-xs text-slate-lux flex items-center gap-1"><Mail className="h-3 w-3" /> {member.email}</p>
              </div>
              <span className={cn('text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full', ROLE_COLORS[member.role] ?? 'bg-slate-100 text-slate-500')}>
                {member.role}
              </span>
              {member.role !== 'Owner' && (
                <button onClick={() => void handleRemoveMember(member.id)} className="p-2 rounded-lg hover:bg-red-50 text-slate-lux hover:text-red-500 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </LuxuryCard>

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 z-50 bg-ink-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <LuxuryCard className="w-full max-w-md p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-display font-semibold text-ink-950">Invite Team Member</h3>
              <button onClick={() => setShowInvite(false)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-lux"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-lux mb-1.5">Full Name</label>
                <input type="text" required value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Jane Smith" className="w-full px-4 py-3 rounded-2xl border border-line-soft bg-white outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-lux mb-1.5">Email</label>
                <input type="email" required value={form.email} onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))} placeholder="jane@company.com" className="w-full px-4 py-3 rounded-2xl border border-line-soft bg-white outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-lux mb-1.5">Role</label>
                <select value={form.role} onChange={(e) => setForm(p => ({ ...p, role: e.target.value as 'Admin' | 'Viewer' }))} className="w-full px-4 py-3 rounded-2xl border border-line-soft bg-white outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange text-sm">
                  <option value="Viewer">Viewer</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <LuxuryButton variant="secondary" type="button" className="flex-1" onClick={() => setShowInvite(false)}>Cancel</LuxuryButton>
                <LuxuryButton type="submit" disabled={inviting} className="flex-1">
                  {inviting ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : 'Send Invite'}
                </LuxuryButton>
              </div>
            </form>
          </LuxuryCard>
        </div>
      )}
    </div>
  );
}
