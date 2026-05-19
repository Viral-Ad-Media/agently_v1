import * as React from 'react';
import { PhoneCall, Search, Filter, ArrowUpRight, Download, Play, MessageSquareText, Phone, ArrowDownLeft, ArrowUpRight as ArrowUp } from 'lucide-react';
import { LuxuryCard } from '@/src/components/ui/LuxuryCard';
import { LuxuryButton } from '@/src/components/ui/LuxuryButton';
import { cn } from '@/src/lib/utils';
import { useWorkspace } from '@/src/context/WorkspaceContext';
import { CallRecord } from '@/src/types';

const fmtDur = (s: number) => { const m = Math.floor(s / 60); return `${m}:${(s%60).toString().padStart(2,'0')}`; };

export default function CallLogs() {
  const { workspace, handleDownloadCallReport } = useWorkspace();
  const allCalls = workspace?.calls ?? [];
  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = React.useState<'all' | 'inbound' | 'outbound'>('all');
  const [selected, setSelected] = React.useState<CallRecord | null>(null);

  const filtered = allCalls.filter((c) => {
    const matchSearch = !search || c.callerName?.toLowerCase().includes(search.toLowerCase()) || c.callerPhone?.includes(search);
    const matchFilter = filter === 'all' || c.direction === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-semibold tracking-tight text-ink-950">Call Intelligence</h1>
          <p className="text-slate-lux mt-2">Archive of all AI concierge conversations and transcripts.</p>
        </div>
        <div className="flex gap-3">
          <LuxuryButton variant="secondary" size="sm">
            <Download className="h-4 w-4 mr-2" /> Export
          </LuxuryButton>
        </div>
      </div>

      {/* Filters */}
      <LuxuryCard className="p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-lux/40" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by caller name or number..."
              className="w-full pl-10 pr-4 h-10 rounded-luxury border border-line-soft bg-white text-sm outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'inbound', 'outbound'] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={cn('px-4 h-10 rounded-luxury text-xs font-bold uppercase tracking-wider transition-all', filter === f ? 'bg-ink-950 text-white' : 'bg-white border border-line-soft text-slate-lux hover:border-brand-orange/30')}
              >{f}</button>
            ))}
          </div>
        </div>
      </LuxuryCard>

      {/* Calls list */}
      <LuxuryCard className="overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-lux">
            <PhoneCall className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p className="font-medium">No calls found</p>
            <p className="text-sm mt-1">Try your agent to start generating call logs.</p>
          </div>
        ) : (
          <div className="divide-y divide-line-soft">
            {filtered.map((call) => (
              <div key={call.id} className="flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setSelected(selected?.id === call.id ? null : call)}>
                <div className={cn('p-2.5 rounded-xl flex-shrink-0', call.direction === 'inbound' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600')}>
                  {call.direction === 'inbound' ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-ink-900 truncate">{call.callerName || 'Unknown'}</p>
                    <span className={cn('text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0', call.outcome === 'Lead Captured' ? 'bg-emerald-50 text-emerald-600' : call.outcome === 'Escalated' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500')}>
                      {call.outcome}
                    </span>
                  </div>
                  <p className="text-xs text-slate-lux mt-0.5">{call.callerPhone} · {new Date(call.timestamp).toLocaleString()}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-semibold text-ink-900">{fmtDur(call.duration)}</p>
                  <div className="flex items-center gap-1 mt-1 justify-end">
                    {call.recordingUrl && <button onClick={(e) => { e.stopPropagation(); }} className="p-1 rounded-lg hover:bg-slate-100 text-slate-lux hover:text-brand-orange transition-colors"><Play className="h-3 w-3" /></button>}
                    <button onClick={(e) => { e.stopPropagation(); void handleDownloadCallReport(call.id); }} className="p-1 rounded-lg hover:bg-slate-100 text-slate-lux hover:text-brand-orange transition-colors"><Download className="h-3 w-3" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </LuxuryCard>

      {/* Transcript drawer */}
      {selected && (
        <LuxuryCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-ink-950">Call Transcript</h3>
            <button onClick={() => setSelected(null)} className="text-slate-lux hover:text-ink-900 text-xs font-semibold">Close</button>
          </div>
          <div className="space-y-2 mb-4">
            <p className="text-xs text-slate-lux"><strong>Summary:</strong> {selected.summary || 'No summary available'}</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4 space-y-2 max-h-64 overflow-y-auto">
            {selected.transcript && selected.transcript.length > 0 ? (
              selected.transcript.map((line, i) => (
                <div key={i} className={cn('flex', line.speaker !== 'caller' ? 'justify-start' : 'justify-end')}>
                  <div className={cn('max-w-[80%] px-3 py-2 rounded-xl text-sm', line.speaker !== 'caller' ? 'bg-brand-orange/10 text-ink-900' : 'bg-ink-950 text-white')}>
                    <p className="text-[10px] font-bold uppercase opacity-60 mb-0.5">{line.speaker}</p>
                    {line.text}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-lux">No transcript available.</p>
            )}
          </div>
        </LuxuryCard>
      )}
    </div>
  );
}
