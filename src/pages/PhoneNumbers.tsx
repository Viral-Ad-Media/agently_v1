import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Hash, RefreshCw, Phone, Search, Plus } from 'lucide-react';
import { LuxuryCard } from '@/src/components/ui/LuxuryCard';
import { LuxuryButton } from '@/src/components/ui/LuxuryButton';
import { useWorkspace } from '@/src/context/WorkspaceContext';
import { useToast } from '@/src/components/ui/ToastProvider';
import {
  TwilioNumberRecord,
  AvailableTwilioNumber,
  voiceCallsApi,
} from '@/src/services/voiceCallsApi';
import { AgentConfig } from '@/src/types';

const FLAG_MAP: Record<string, string> = {
  US: '🇺🇸',
  CA: '🇨🇦',
  GB: '🇬🇧',
};

type Tab = 'numbers' | 'search';

const normalizeStatusText = (value?: string | null) => {
  const raw = String(value || 'unknown').replace(/_/g, ' ');
  return raw.charAt(0).toUpperCase() + raw.slice(1);
};

const readinessClass = (value?: string | null) => {
  const status = String(value || '').toLowerCase();
  if (['ready', 'active', 'configured', 'verified'].some((w) => status.includes(w)))
    return 'bg-emerald-100 text-emerald-700';
  if (['pending', 'needs', 'unknown', 'not run'].some((w) => status.includes(w)))
    return 'bg-amber-100 text-amber-700';
  if (['failed', 'error', 'blocked'].some((w) => status.includes(w)))
    return 'bg-red-100 text-red-700';
  return 'bg-slate-100 text-slate-600';
};

const StatusPill = ({ label, value }: { label: string; value?: string | null }) => (
  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${readinessClass(value)}`}>
    <span className="text-slate-500/70">{label}:</span>
    {normalizeStatusText(value)}
  </span>
);

const getOrgId = (n: TwilioNumberRecord) =>
  String(n.organization_id || n.organizationId || n.orgId || '').trim();
const getNumberId = (n: TwilioNumberRecord) =>
  String(n.id || n.numberId || n.phone_sid || n.phoneSid || n.sid || '').trim();
const getPhoneNumber = (n: TwilioNumberRecord) =>
  String(n.phone_number || n.phoneNumber || '').trim();
const getAssignedAgentId = (n: TwilioNumberRecord) =>
  String(n.assigned_voice_agent_id || n.assignedVoiceAgentId || n.voiceAgentId || n.agentId || '').trim();

const getAssignedAgent = (n: TwilioNumberRecord, agents: AgentConfig[] = []) => {
  const assignedId = getAssignedAgentId(n);
  if (assignedId) {
    const agent = agents.find((a) => a.id === assignedId);
    if (agent) return agent;
  }
  const phone = getPhoneNumber(n);
  return agents.find((a) => a.twilioPhoneNumber === phone);
};

export default function PhoneNumbers() {
  const { workspace, refreshWorkspace } = useWorkspace();
  const { toast: addToast } = useToast();
  const org = workspace?.organization!;;
  const agents = useMemo(() => org?.voiceAgents || [], [org]);

  const [tab, setTab] = useState<Tab>('numbers');
  const [busy, setBusy] = useState<string | null>(null);
  const [numbers, setNumbers] = useState<TwilioNumberRecord[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [assignmentDrafts, setAssignmentDrafts] = useState<Record<string, string>>({});
  const [areaCode, setAreaCode] = useState('');
  const [contains, setContains] = useState('');
  const [availableNumbers, setAvailableNumbers] = useState<AvailableTwilioNumber[]>([]);
  const [searchDone, setSearchDone] = useState(false);

  const loadNumbers = useCallback(async () => {
    if (!org?.id) return;
    setBusy('load');
    try {
      const response = await voiceCallsApi.phoneNumbers.getTwilioNumbers({ organizationId: org.id });
      const tenantNumbers = (response.numbers || []).filter((n) => getOrgId(n) === org.id);
      setNumbers(tenantNumbers);
      setHasLoaded(true);
    } catch (err: any) {
      addToast(err?.message || 'Could not load phone numbers.', 'error');
    } finally {
      setBusy(null);
    }
  }, [org?.id, addToast]);

  useEffect(() => { void loadNumbers(); }, [loadNumbers]);

  const handleSearch = async () => {
    setBusy('search');
    setSearchDone(false);
    setAvailableNumbers([]);
    try {
      const result = await voiceCallsApi.phoneNumbers.searchAvailableTwilioNumbers({
        country: 'US',
        areaCode: areaCode || undefined,
        contains: contains || undefined,
        limit: 20,
      });
      setAvailableNumbers(result.numbers || []);
      setSearchDone(true);
    } catch (err: any) {
      addToast(err?.message || 'Number search failed.', 'error');
    } finally {
      setBusy(null);
    }
  };

  const handlePurchase = async (number: AvailableTwilioNumber) => {
    const phoneNumber = number.phoneNumber || number.phone_number;
    if (!phoneNumber) return;
    if (!window.confirm(`Purchase ${phoneNumber}? This may charge the connected Twilio account.`)) return;
    setBusy(`purchase-${phoneNumber}`);
    try {
      await voiceCallsApi.phoneNumbers.purchaseTwilioNumber({ phoneNumber, organizationId: org.id });
      addToast(`${phoneNumber} purchased. Assign it to an agent from the Numbers tab.`, 'success');
      await loadNumbers();
      setTab('numbers');
      refreshWorkspace();
    } catch (err: any) {
      addToast(err?.message || 'Purchase failed.', 'error');
    } finally {
      setBusy(null);
    }
  };

  const handleAssign = async (number: TwilioNumberRecord, agentId: string) => {
    const numberId = getNumberId(number);
    const phoneNumber = getPhoneNumber(number);
    if (!numberId || !agentId) { addToast('Select an agent before assigning a number.', 'error'); return; }
    setBusy(`assign-${numberId}`);
    try {
      await voiceCallsApi.phoneNumbers.assignTwilioNumberToAgent(numberId, { agentId, voiceAgentId: agentId });
      const assignedAgent = agents.find((a) => a.id === agentId);
      addToast(`${phoneNumber || 'Number'} assigned to ${assignedAgent?.name || 'agent'}.`, 'success');
      setAssignmentDrafts((d) => ({ ...d, [numberId]: '' }));
      setNumbers((current) =>
        current.map((item) =>
          getNumberId(item) === numberId
            ? { ...item, assigned_voice_agent_id: agentId, assignedVoiceAgentId: agentId, overall_status: 'ready' }
            : item,
        ),
      );
      void loadNumbers();
      refreshWorkspace();
    } catch (err: any) {
      addToast(err?.message || 'Assign failed.', 'error');
    } finally {
      setBusy(null);
    }
  };

  const handleUnassign = async (number: TwilioNumberRecord) => {
    const numberId = getNumberId(number);
    const phoneNumber = getPhoneNumber(number);
    if (!numberId) return;
    setBusy(`unassign-${numberId}`);
    try {
      await voiceCallsApi.phoneNumbers.updateTwilioNumber(numberId, {
        assigned_voice_agent_id: null, agentId: null, voiceAgentId: null, unassign: true,
      });
      addToast(`${phoneNumber || 'Number'} unassigned.`, 'success');
      setAssignmentDrafts((d) => ({ ...d, [numberId]: '' }));
      setNumbers((current) =>
        current.map((item) =>
          getNumberId(item) === numberId
            ? { ...item, assigned_voice_agent_id: null, assignedVoiceAgentId: null, assigned_agent_status: 'needs_assignment' }
            : item,
        ),
      );
      void loadNumbers();
    } catch (err: any) {
      addToast(err?.message || 'Unassign failed.', 'error');
    } finally {
      setBusy(null);
    }
  };

  const renderNumberCard = (number: TwilioNumberRecord) => {
    const phoneNumber = getPhoneNumber(number) || 'Unknown number';
    const numberId = getNumberId(number) || phoneNumber;
    const assigned = getAssignedAgent(number, agents);
    const capabilities = number.capabilities || {};
    const canVoice = capabilities.voice !== false;
    const canSms = capabilities.sms === true;
    const inbound = number.inbound_voice_status || number.inboundVoiceStatus || number.overall_status || number.overallStatus;
    const outbound = number.outbound_voice_status || number.outboundVoiceStatus || number.overall_status || number.overallStatus;

    return (
      <LuxuryCard key={numberId} className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{FLAG_MAP[number.iso_country || number.isoCountry || 'US'] || '🌍'}</span>
              <p className="text-lg font-semibold text-ink-950">{phoneNumber}</p>
            </div>
            <p className="font-mono text-xs text-slate-lux">
              {number.phone_sid || number.phoneSid || number.sid || number.id || 'No SID'}
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-lux">
            {number.number_type || number.numberType || number.source || 'number'}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${canVoice ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
            Voice {canVoice ? 'capable' : 'unavailable'}
          </span>
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${canSms ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
            SMS {canSms ? 'capable' : 'not supported'}
          </span>
          <StatusPill label="Inbound" value={inbound} />
          <StatusPill label="Outbound" value={outbound} />
        </div>

        <div className="rounded-2xl bg-slate-50 border border-line-soft p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-lux mb-3">Assigned agent</p>
          {assigned ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-ink-950">{assigned.name}</p>
                <p className="mt-0.5 text-xs text-slate-lux">Assigned — available for inbound + outbound calls.</p>
              </div>
              <LuxuryButton
                variant="secondary"
                size="sm"
                onClick={() => void handleUnassign(number)}
                disabled={!!busy}
              >
                {busy === `unassign-${numberId}` ? 'Unassigning…' : 'Unassign'}
              </LuxuryButton>
            </div>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <select
                value={assignmentDrafts[numberId] || ''}
                onChange={(e) => setAssignmentDrafts((d) => ({ ...d, [numberId]: e.target.value }))}
                disabled={!!busy}
                className="flex-1 rounded-2xl border border-line-soft bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange"
              >
                <option value="">Choose an agent</option>
                {agents
                  .filter((agent) => !numbers.some((n) => getAssignedAgentId(n) === agent.id))
                  .map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name} ({agent.direction})
                    </option>
                  ))}
              </select>
              <LuxuryButton
                variant="primary"
                size="sm"
                onClick={() => void handleAssign(number, assignmentDrafts[numberId] || '')}
                disabled={!!busy || !assignmentDrafts[numberId]}
              >
                {busy === `assign-${numberId}` ? 'Assigning…' : 'Assign'}
              </LuxuryButton>
            </div>
          )}
        </div>
      </LuxuryCard>
    );
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-semibold tracking-tight text-ink-950">Phone Numbers</h1>
          <p className="text-slate-lux mt-2">Provision and assign global numbers to your AI fleet.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-2xl bg-slate-100 p-1">
            <button
              onClick={() => setTab('numbers')}
              className={`rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${tab === 'numbers' ? 'bg-white text-ink-950 shadow-sm' : 'text-slate-lux hover:text-ink-950'}`}
            >
              My Numbers
            </button>
            <button
              onClick={() => setTab('search')}
              className={`rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${tab === 'search' ? 'bg-white text-ink-950 shadow-sm' : 'text-slate-lux hover:text-ink-950'}`}
            >
              Buy US Number
            </button>
          </div>
          <LuxuryButton
            variant="secondary"
            size="sm"
            
            onClick={() => void loadNumbers()}
            disabled={busy === 'load'}
          >
            {busy === 'load' ? 'Refreshing…' : 'Refresh'}
          </LuxuryButton>
        </div>
      </div>

      {/* Info Banner */}
      <LuxuryCard className="p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-ink-950">Manage calling numbers</p>
            <p className="mt-1 text-xs text-slate-lux leading-relaxed">
              Assign each available number to one voice agent. Assigned numbers can be used for both inbound and outbound calls.
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
            One number per agent
          </span>
        </div>
      </LuxuryCard>

      {/* Numbers Tab */}
      {tab === 'numbers' && (
        <div className="space-y-4">
          {busy === 'load' && !hasLoaded ? (
            <LuxuryCard className="p-16 text-center">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-brand-orange border-t-transparent" />
              <p className="text-sm text-slate-lux">Loading phone numbers…</p>
            </LuxuryCard>
          ) : numbers.length === 0 ? (
            <LuxuryCard className="p-16 text-center">
              <div className="mb-4 text-4xl">📭</div>
              <p className="text-base font-semibold text-ink-950">No phone numbers found</p>
              <p className="mt-1 text-sm text-slate-lux">No numbers attached to this organization yet.</p>
              <div className="mt-6 flex justify-center gap-3">
                <LuxuryButton variant="primary" size="sm" onClick={() => setTab('search')}>
                  Buy Number
                </LuxuryButton>
                <LuxuryButton variant="secondary" size="sm" onClick={() => void loadNumbers()}>
                  Refresh
                </LuxuryButton>
              </div>
            </LuxuryCard>
          ) : (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {numbers.map(renderNumberCard)}
            </div>
          )}
        </div>
      )}

      {/* Search Tab */}
      {tab === 'search' && (
        <div className="space-y-6">
          <LuxuryCard className="p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-display font-semibold text-ink-950">Search US voice-capable numbers</h3>
                <p className="mt-1 text-sm text-slate-lux">Search restricted to US numbers while readiness rules are validated.</p>
              </div>
              <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
                US only
              </span>
            </div>
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold text-slate-lux mb-1.5">Country</label>
                <input
                  value="United States (US)"
                  disabled
                  className="w-full rounded-2xl border border-line-soft bg-slate-50 px-4 py-2.5 text-sm text-slate-lux"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-lux mb-1.5">Area code</label>
                <input
                  placeholder="e.g. 212"
                  value={areaCode}
                  onChange={(e) => setAreaCode(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  className="w-full rounded-2xl border border-line-soft bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-lux mb-1.5">Contains digits</label>
                <input
                  placeholder="e.g. 555"
                  value={contains}
                  onChange={(e) => setContains(e.target.value.replace(/\D/g, '').slice(0, 7))}
                  className="w-full rounded-2xl border border-line-soft bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange"
                />
              </div>
            </div>
            <LuxuryButton
              variant="primary"
              
              onClick={() => void handleSearch()}
              disabled={busy === 'search'}
            >
              {busy === 'search' ? 'Searching…' : 'Search Numbers'}
            </LuxuryButton>
          </LuxuryCard>

          {searchDone && (
            <LuxuryCard className="p-6">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-lg font-display font-semibold text-ink-950">
                  {availableNumbers.length ? `${availableNumbers.length} numbers available` : 'No numbers found'}
                </h3>
                <p className="text-xs text-slate-lux">Purchased numbers can be assigned from the Numbers tab.</p>
              </div>
              {availableNumbers.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-line-soft py-12 text-center">
                  <div className="mb-3 text-3xl">🔭</div>
                  <p className="text-sm text-slate-lux">No numbers found. Try another area code or clear the filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {availableNumbers.map((number) => {
                    const phoneNumber = number.phoneNumber || number.phone_number;
                    const capabilities = number.capabilities || {};
                    return (
                      <div
                        key={phoneNumber}
                        className="rounded-2xl border border-line-soft bg-slate-50 p-4 transition-all hover:border-brand-orange/30 hover:bg-brand-orange/5"
                      >
                        <div className="mb-2 flex items-start justify-between">
                          <div>
                            <p className="text-base font-semibold text-ink-950">{number.friendlyName || phoneNumber}</p>
                            <p className="font-mono text-[10px] text-slate-lux">{phoneNumber}</p>
                          </div>
                          <span className="text-lg">🇺🇸</span>
                        </div>
                        {(number.locality || number.region) && (
                          <p className="mb-3 text-xs text-slate-lux">{[number.locality, number.region].filter(Boolean).join(', ')}</p>
                        )}
                        <div className="mb-4 flex gap-1.5">
                          {capabilities.voice !== false && (
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">Voice</span>
                          )}
                          {capabilities.sms && (
                            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">SMS</span>
                          )}
                        </div>
                        <LuxuryButton
                          variant="primary"
                          size="sm"
                          className="w-full"
                          onClick={() => void handlePurchase(number)}
                          disabled={!!busy}
                        >
                          {busy === `purchase-${phoneNumber}` ? 'Purchasing…' : 'Purchase'}
                        </LuxuryButton>
                      </div>
                    );
                  })}
                </div>
              )}
            </LuxuryCard>
          )}
        </div>
      )}
    </div>
  );
}
