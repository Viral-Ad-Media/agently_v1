import * as React from 'react';
import { Users, Search, Plus, Filter, Tag, MoreHorizontal, Mail, Phone, Download, Trash2, X } from 'lucide-react';
import { LuxuryCard } from '@/src/components/ui/LuxuryCard';
import { LuxuryButton } from '@/src/components/ui/LuxuryButton';
import { cn } from '@/src/lib/utils';
import { useWorkspace } from '@/src/context/WorkspaceContext';
import { Lead } from '@/src/types';

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-50 text-blue-600',
  contacted: 'bg-amber-50 text-amber-600',
  closed: 'bg-emerald-50 text-emerald-700',
};

export default function Leads() {
  const { workspace, handleCreateLead, handleDeleteLead, handleExportLeads, handleUpdateLead } = useWorkspace();
  const leads = workspace?.leads ?? [];
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [showCreate, setShowCreate] = React.useState(false);
  const [creating, setCreating] = React.useState(false);
  const [form, setForm] = React.useState({ name: '', email: '', phone: '', reason: '' });

  const filtered = leads.filter((l) => {
    const matchSearch = !search || l.name?.toLowerCase().includes(search.toLowerCase()) || l.email?.toLowerCase().includes(search.toLowerCase()) || l.phone?.includes(search);
    const matchStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const toggleSelect = (id: string) => setSelected((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  const allSelected = filtered.length > 0 && filtered.every((l) => selected.has(l.id));
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(filtered.map((l) => l.id)));

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await handleCreateLead(form);
      setShowCreate(false);
      setForm({ name: '', email: '', phone: '', reason: '' });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-semibold tracking-tight text-ink-950">Leads CRM</h1>
          <p className="text-slate-lux mt-2">Manage customers captured by your AI receptionists.</p>
        </div>
        <div className="flex gap-3">
          <LuxuryButton variant="secondary" size="sm" onClick={handleExportLeads}>
            <Download className="h-4 w-4 mr-2" /> Export CSV
          </LuxuryButton>
          <LuxuryButton size="sm" onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Lead
          </LuxuryButton>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: leads.length, color: 'text-ink-950' },
          { label: 'New', value: leads.filter(l => l.status === 'new').length, color: 'text-blue-600' },
          { label: 'Contacted', value: leads.filter(l => l.status === 'contacted').length, color: 'text-amber-600' },
          { label: 'Closed', value: leads.filter(l => l.status === 'closed').length, color: 'text-emerald-600' },
        ].map((s) => (
          <LuxuryCard key={s.label} className="p-5 text-center">
            <p className={cn('text-3xl font-display font-semibold', s.color)}>{s.value}</p>
            <p className="text-xs text-slate-lux uppercase tracking-wider mt-1 font-medium">{s.label}</p>
          </LuxuryCard>
        ))}
      </div>

      {/* Filters */}
      <LuxuryCard className="p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-lux/40" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search leads..." className="w-full pl-10 pr-4 h-10 rounded-luxury border border-line-soft bg-white text-sm outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange" />
          </div>
          <div className="flex gap-2">
            {(['all', 'new', 'contacted', 'closed'] as const).map((f) => (
              <button key={f} onClick={() => setStatusFilter(f)} className={cn('px-4 h-10 rounded-luxury text-xs font-bold uppercase tracking-wider transition-all', statusFilter === f ? 'bg-ink-950 text-white' : 'bg-white border border-line-soft text-slate-lux hover:border-brand-orange/30')}>{f}</button>
            ))}
          </div>
        </div>
      </LuxuryCard>

      {/* Table */}
      <LuxuryCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-line-soft bg-slate-50">
                <th className="p-4 text-left w-10">
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} className="accent-brand-orange" />
                </th>
                <th className="p-4 text-left text-[10px] font-bold uppercase tracking-widest text-slate-lux">Name</th>
                <th className="p-4 text-left text-[10px] font-bold uppercase tracking-widest text-slate-lux hidden md:table-cell">Contact</th>
                <th className="p-4 text-left text-[10px] font-bold uppercase tracking-widest text-slate-lux">Status</th>
                <th className="p-4 text-left text-[10px] font-bold uppercase tracking-widest text-slate-lux hidden lg:table-cell">Tags</th>
                <th className="p-4 text-left text-[10px] font-bold uppercase tracking-widest text-slate-lux hidden lg:table-cell">Added</th>
                <th className="p-4 w-10" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-16 text-slate-lux">No leads found.</td></tr>
              ) : filtered.map((lead) => (
                <tr key={lead.id} className="border-b border-line-soft hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <input type="checkbox" checked={selected.has(lead.id)} onChange={() => toggleSelect(lead.id)} className="accent-brand-orange" />
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-ink-900">{lead.name}</p>
                    <p className="text-xs text-slate-lux">{lead.reason}</p>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <div className="flex flex-col gap-1">
                      {lead.phone && <span className="flex items-center gap-1 text-xs text-slate-lux"><Phone className="h-3 w-3" /> {lead.phone}</span>}
                      {lead.email && <span className="flex items-center gap-1 text-xs text-slate-lux"><Mail className="h-3 w-3" /> {lead.email}</span>}
                    </div>
                  </td>
                  <td className="p-4">
                    <select value={lead.status} onChange={(e) => void handleUpdateLead(lead.id, { status: e.target.value as Lead['status'] })}
                      className={cn('text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border-0 cursor-pointer outline-none', STATUS_COLORS[lead.status] ?? 'bg-slate-100 text-slate-500')}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                  <td className="p-4 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {(lead.tags ?? []).slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded-full bg-brand-orange/10 text-brand-orange text-[10px] font-bold">{tag}</span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 hidden lg:table-cell text-xs text-slate-lux">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <button onClick={() => void handleDeleteLead(lead.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-lux hover:text-red-500 transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LuxuryCard>

      {/* Create Lead Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 bg-ink-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <LuxuryCard className="w-full max-w-md p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-display font-semibold text-ink-950">Add New Lead</h3>
              <button onClick={() => setShowCreate(false)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-lux"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              {[
                { key: 'name', label: 'Full Name', type: 'text', placeholder: 'John Smith', required: true },
                { key: 'email', label: 'Email', type: 'email', placeholder: 'john@example.com' },
                { key: 'phone', label: 'Phone', type: 'tel', placeholder: '+1 555 000 0000', required: true },
                { key: 'reason', label: 'Reason', type: 'text', placeholder: 'Interested in services' },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-lux mb-1.5">{f.label}</label>
                  <input type={f.type} required={f.required} placeholder={f.placeholder} value={(form as any)[f.key]}
                    onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full px-4 py-3 rounded-2xl border border-line-soft bg-white outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange text-sm"
                  />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <LuxuryButton variant="secondary" type="button" className="flex-1" onClick={() => setShowCreate(false)}>Cancel</LuxuryButton>
                <LuxuryButton type="submit" disabled={creating} className="flex-1">
                  {creating ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : 'Add Lead'}
                </LuxuryButton>
              </div>
            </form>
          </LuxuryCard>
        </div>
      )}
    </div>
  );
}
