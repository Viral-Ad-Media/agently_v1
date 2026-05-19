import React, { memo, useEffect, useMemo, useState, useTransition } from 'react';
import { Calendar, RefreshCw, Phone, Users, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { LuxuryCard } from '@/src/components/ui/LuxuryCard';
import { LuxuryButton } from '@/src/components/ui/LuxuryButton';
import { useWorkspace } from '@/src/context/WorkspaceContext';
import { useToast } from '@/src/components/ui/ToastProvider';
import { TwilioNumberRecord, voiceCallsApi } from '@/src/services/voiceCallsApi';
import { AgentConfig, Lead } from '@/src/types';
import AppModal from '@/src/components/AppModal';

type CallType = 'call_now' | 'one_time' | 'one_time_batch' | 'recurring_monthly' | 'custom_rule';
type RecipientMode = 'direct' | 'leads';
type BatchMode = 'all_recipients_each_time' | 'spread_recipients_across_times';

type DirectRecipient = { id: string; name: string; phone: string; displayPhone: string; phoneError?: string; };

type SchedulePreview = {
  totalCalls?: number; total_calls?: number; calls?: unknown[]; runs?: unknown[]; warnings?: string[];
  [key: string]: unknown;
};

type OutreachSchedule = {
  id?: string; name?: string; status?: string; schedule_type?: string; scheduleType?: string;
  voice_agent_id?: string; voiceAgentId?: string; from_number?: string; fromNumber?: string;
  call_purpose?: string; callPurpose?: string; timezone?: string; created_at?: string;
  createdAt?: string; start_at?: string; startAt?: string; direct_recipients?: unknown;
  directRecipients?: unknown; lead_ids?: unknown; leadIds?: unknown;
  progress?: Record<string, unknown>; metadata?: Record<string, unknown>;
  [key: string]: unknown;
};

const FALLBACK_TIMEZONES = [
  'UTC', 'Africa/Accra', 'Africa/Cairo', 'Africa/Johannesburg', 'Africa/Lagos', 'Africa/Nairobi',
  'America/Anchorage', 'America/Argentina/Buenos_Aires', 'America/Bogota', 'America/Chicago',
  'America/Denver', 'America/Los_Angeles', 'America/Mexico_City', 'America/New_York',
  'America/Phoenix', 'America/Sao_Paulo', 'America/Toronto', 'Asia/Bangkok', 'Asia/Dubai',
  'Asia/Hong_Kong', 'Asia/Karachi', 'Asia/Kolkata', 'Asia/Riyadh', 'Asia/Shanghai',
  'Asia/Singapore', 'Asia/Seoul', 'Asia/Tokyo', 'Australia/Melbourne', 'Australia/Sydney',
  'Europe/Amsterdam', 'Europe/Berlin', 'Europe/London', 'Europe/Madrid', 'Europe/Moscow',
  'Europe/Paris', 'Europe/Rome', 'Pacific/Auckland',
];

const getTimezones = () => {
  try {
    const zones = (Intl as any).supportedValuesOf?.('timeZone');
    if (Array.isArray(zones) && zones.length > 0) return ['UTC', ...zones.filter((z: string) => z !== 'UTC')];
  } catch {}
  return FALLBACK_TIMEZONES;
};

const TIMEZONES = getTimezones();
const DAYS = [
  { key: 'monday', label: 'Mon' }, { key: 'tuesday', label: 'Tue' }, { key: 'wednesday', label: 'Wed' },
  { key: 'thursday', label: 'Thu' }, { key: 'friday', label: 'Fri' }, { key: 'saturday', label: 'Sat' },
  { key: 'sunday', label: 'Sun' },
];

const todayIso = () => new Date().toISOString().slice(0, 10);
const sixMonthsFromToday = () => { const d = new Date(); d.setMonth(d.getMonth() + 6); return d.toISOString().slice(0, 10); };
const pad = (v: number) => String(v).padStart(2, '0');
const timePlusMinutes = (mins = 5) => {
  const now = new Date(); now.setMinutes(now.getMinutes() + mins);
  return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
};
const addThirtyMinutes = (time: string) => {
  const [h = '0', m = '0'] = time.split(':');
  const d = new Date(); d.setHours(Number(h), Number(m), 0, 0); d.setMinutes(d.getMinutes() + 30);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
const isValidTime = (v: string) => TIME_PATTERN.test(v);
const makeRecipient = (): DirectRecipient => ({ id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, name: '', phone: '', displayPhone: '' });

const unwrapList = <T,>(payload: unknown, keys: string[]): T[] => {
  if (Array.isArray(payload)) return payload as T[];
  if (!payload || typeof payload !== 'object') return [];
  const record = payload as Record<string, unknown>;
  for (const key of keys) {
    const val = record[key];
    if (Array.isArray(val)) return val as T[];
    if (val && typeof val === 'object') { const nested = unwrapList<T>(val, keys); if (nested.length) return nested; }
  }
  return [];
};

const getNumberOrgId = (n: TwilioNumberRecord) => n.organization_id || n.organizationId || n.orgId || '';
const getPhone = (n: TwilioNumberRecord) => n.phone_number || n.phoneNumber || '';
const getAssignedAgentId = (n: TwilioNumberRecord) =>
  n.assigned_voice_agent_id || n.assignedVoiceAgentId || n.voiceAgentId || n.agentId || '';

const getScheduleId = (schedule: OutreachSchedule, fallback: number) => String(schedule.id || fallback);
const getScheduleStatus = (schedule: OutreachSchedule) => {
  const raw = String(schedule.status || 'active').toLowerCase();
  if (['completed', 'complete', 'done', 'cancelled', 'canceled', 'failed', 'deleted'].includes(raw)) return raw;
  const p = schedule.progress && typeof schedule.progress === 'object' ? schedule.progress as Record<string, unknown> : {};
  const total = Number(p.totalRuns || p.total_runs || p.total || 0) || 0;
  const remaining = Number(p.remaining || p.pending || 0) || 0;
  const failed = Number(p.failed || 0) || 0;
  if (total > 0 && remaining <= 0) return failed >= total ? 'failed' : 'completed';
  return raw;
};
const isDoneStatus = (s: string) => ['completed', 'complete', 'done', 'cancelled', 'canceled', 'failed'].includes(s);
const formatScheduleType = (v?: string) => String(v || 'schedule').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
const statusClass = (s: string) => {
  const v = s.toLowerCase();
  if (['completed', 'complete', 'done'].some((x) => v.includes(x))) return 'bg-slate-100 text-slate-500';
  if (['cancel', 'failed', 'error'].some((x) => v.includes(x))) return 'bg-red-50 text-red-600';
  if (['queued', 'pending', 'draft'].some((x) => v.includes(x))) return 'bg-amber-50 text-amber-700';
  return 'bg-emerald-50 text-emerald-700';
};
const humanDateTime = (v: unknown) => {
  if (!v) return '—';
  const d = new Date(String(v));
  if (isNaN(d.getTime())) return String(v);
  return d.toLocaleString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
};
const parseScheduleRecipients = (schedule: OutreachSchedule) => {
  const raw = schedule.directRecipients || schedule.direct_recipients || schedule.metadata?.directRecipients || [];
  const list = Array.isArray(raw) ? raw : (typeof raw === 'string' ? (() => { try { return JSON.parse(raw); } catch { return []; } })() : []);
  return Array.isArray(list) ? list.map((item) => item && typeof item === 'object' ? item as Record<string, unknown> : null).filter(Boolean) : [];
};
const recipientSummary = (schedule: OutreachSchedule) => {
  const rs = parseScheduleRecipients(schedule);
  if (rs.length) {
    const names = rs.map((r) => String(r?.name || r?.phone || 'Recipient')).slice(0, 3);
    return `${names.join(', ')}${rs.length > 3 ? ` +${rs.length - 3} more` : ''}`;
  }
  const count = Array.isArray(schedule.lead_ids) ? schedule.lead_ids.length : Array.isArray(schedule.leadIds) ? schedule.leadIds.length : 0;
  return count ? `${count} lead${count === 1 ? '' : 's'}` : 'No recipients shown';
};
const normalizeNorthAmericaPhone = (raw: string) => {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return { display: '', value: '', error: '' };
  if (digits.length === 10) return { display: `+1${digits}`, value: `+1${digits}`, error: '' };
  if (digits.length === 11 && digits.startsWith('1')) return { display: `+${digits}`, value: `+${digits}`, error: '' };
  return { display: raw, value: '', error: 'Currently, outbound calls are supported for U.S. and Canadian numbers only.' };
};

const PAGE_SIZE = 10;

const TimePicker = memo(({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <label className="space-y-1.5">
    <span className="text-xs font-semibold text-slate-lux">{label}</span>
    <input type="time" step={60} value={isValidTime(value) ? value : timePlusMinutes(5)} onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-2xl border border-line-soft bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange" />
  </label>
));
TimePicker.displayName = 'TimePicker';

const TimezonePicker = memo(({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
  const [query, setQuery] = useState(value || '');
  const [open, setOpen] = useState(false);
  useEffect(() => setQuery(value || ''), [value]);
  const filtered = useMemo(() => { const n = query.trim().toLowerCase(); return (n ? TIMEZONES.filter((z) => z.toLowerCase().includes(n)) : TIMEZONES).slice(0, 50); }, [query]);
  return (
    <div className="relative space-y-1.5">
      <span className="text-xs font-semibold text-slate-lux">Timezone</span>
      <input value={query} onFocus={() => setOpen(true)} onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onBlur={() => setTimeout(() => { setOpen(false); if (!TIMEZONES.includes(query)) setQuery(value); }, 120)}
        placeholder="Search timezone..." className="w-full rounded-2xl border border-line-soft bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange" />
      {!TIMEZONES.includes(value) && <p className="text-[10px] font-semibold text-red-500">Choose a valid timezone.</p>}
      {open && (
        <div className="absolute z-30 mt-1 max-h-64 w-full overflow-y-auto rounded-2xl border border-line-soft bg-white p-1 shadow-xl">
          {filtered.length ? filtered.map((zone) => (
            <button key={zone} type="button" onMouseDown={(e) => e.preventDefault()}
              onClick={() => { onChange(zone); setQuery(zone); setOpen(false); }}
              className={`block w-full rounded-xl px-3 py-2 text-left text-xs transition-all ${zone === value ? 'bg-ink-950 text-white' : 'text-slate-lux hover:bg-slate-50'}`}
            >{zone}</button>
          )) : <p className="px-3 py-3 text-xs text-slate-lux">No matching timezones.</p>}
        </div>
      )}
    </div>
  );
});
TimezonePicker.displayName = 'TimezonePicker';

const TimeListEditor = memo(({ values, onChange }: { values: string[]; onChange: (v: string[]) => void }) => (
  <div className="space-y-3 rounded-3xl bg-slate-50 border border-line-soft p-4">
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-lux">Call times</p>
        <p className="mt-0.5 text-xs text-slate-400">Pick exact hour and minute for each call window.</p>
      </div>
      <LuxuryButton variant="secondary" size="sm" onClick={() => onChange([...values, addThirtyMinutes(values[values.length - 1] || timePlusMinutes(5))])}>
        + Time
      </LuxuryButton>
    </div>
    {values.map((time, i) => (
      <div key={`${i}-${time}`} className="grid grid-cols-[1fr_auto] items-end gap-3 rounded-2xl border border-line-soft bg-white p-3">
        <TimePicker label={`Time ${i + 1}`} value={time} onChange={(v) => onChange(values.map((t, j) => j === i ? v : t))} />
        <button type="button" onClick={() => onChange(values.length <= 1 ? values : values.filter((_, j) => j !== i))}
          disabled={values.length <= 1}
          className="mb-0.5 rounded-xl border border-red-100 px-3 py-3 text-[10px] font-semibold uppercase tracking-widest text-red-500 hover:bg-red-50 disabled:opacity-40">
          Remove
        </button>
      </div>
    ))}
  </div>
));
TimeListEditor.displayName = 'TimeListEditor';

export default function OutreachScheduler() {
  const { workspace, refreshWorkspace } = useWorkspace();
  const { toast: addToast } = useToast();
  const org = workspace?.organization!;;
  const leads: Lead[] = workspace?.leads || [];
  const agents = useMemo(() => org?.voiceAgents || [], [org]);

  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<'create' | 'scheduled'>('create');
  const [busy, setBusy] = useState<string | null>(null);
  const [numbers, setNumbers] = useState<TwilioNumberRecord[]>([]);
  const [schedules, setSchedules] = useState<OutreachSchedule[]>([]);
  const [preview, setPreview] = useState<SchedulePreview | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<OutreachSchedule | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name?: string; bulk?: boolean } | null>(null);
  const [selectedScheduleIds, setSelectedScheduleIds] = useState<string[]>([]);
  const [schedulePage, setSchedulePage] = useState(1);

  const [callType, setCallType] = useState<CallType>('one_time');
  const [recipientMode, setRecipientMode] = useState<RecipientMode>('direct');
  const [voiceAgentId, setVoiceAgentId] = useState(agents[0]?.id || org?.activeVoiceAgentId || '');
  const [fromNumber, setFromNumber] = useState('');
  const [directRecipients, setDirectRecipients] = useState<DirectRecipient[]>([makeRecipient()]);
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [callPurpose, setCallPurpose] = useState('');
  const [customInstructions, setCustomInstructions] = useState('');
  const [scheduleName, setScheduleName] = useState('');
  const [timezone, setTimezone] = useState(org?.profile?.timezone || org?.settings?.timezone || 'Africa/Lagos');
  const [startLocalDate, setStartLocalDate] = useState(todayIso());
  const [startTime, setStartTime] = useState(timePlusMinutes(5));
  const [startTimes, setStartTimes] = useState<string[]>([timePlusMinutes(5)]);
  const [batchMode, setBatchMode] = useState<BatchMode>('spread_recipients_across_times');
  const [repeatCount, setRepeatCount] = useState(3);
  const [monthlyDays, setMonthlyDays] = useState<number[]>([new Date().getDate()]);
  const [customEndDate, setCustomEndDate] = useState(sixMonthsFromToday());
  const [weekdayRules, setWeekdayRules] = useState<string[]>(['monday', 'tuesday', 'wednesday', 'thursday', 'friday']);
  const [maxAttemptsPerLead, setMaxAttemptsPerLead] = useState(1);
  const [retryDelayMinutes, setRetryDelayMinutes] = useState(60);
  const [voicemailBehavior, setVoicemailBehavior] = useState('hangup');

  const orgTimezone = org?.settings?.timezone || org?.profile?.timezone || 'Africa/Lagos';
  useEffect(() => setTimezone(orgTimezone), [orgTimezone]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash || '';
    const query = hash.includes('?') ? new URLSearchParams(hash.split('?')[1]) : new URLSearchParams();
    const tag = query.get('tag');
    if (!tag) return;
    const taggedLeads = leads.filter((l) => (l.tags || []).some((t) => t.toLowerCase() === tag.toLowerCase()));
    if (!taggedLeads.length) return;
    setActiveTab('create'); setRecipientMode('leads');
    setSelectedLeadIds(taggedLeads.map((l) => l.id));
    setScheduleName(`${tag} outreach`);
    setCallPurpose((c) => c || `Follow up with ${tag} leads.`);
    setPreview(null);
  }, [leads]);

  const tenantNumbers = useMemo(() => numbers.filter((n) => getNumberOrgId(n) === org?.id), [numbers, org?.id]);
  const assignedNumbers = useMemo(() => {
    if (!voiceAgentId) return tenantNumbers;
    const agentNums = tenantNumbers.filter((n) => getAssignedAgentId(n) === voiceAgentId);
    return agentNums.length ? agentNums : tenantNumbers;
  }, [tenantNumbers, voiceAgentId]);
  const selectedAgent = agents.find((a) => a.id === voiceAgentId) || agents[0];
  const totalSchedulePages = Math.max(1, Math.ceil(schedules.length / PAGE_SIZE));
  const pagedSchedules = useMemo(() => schedules.slice((schedulePage - 1) * PAGE_SIZE, schedulePage * PAGE_SIZE), [schedules, schedulePage]);
  const pageScheduleIds = useMemo(() => pagedSchedules.map((s, i) => getScheduleId(s, (schedulePage - 1) * PAGE_SIZE + i)), [pagedSchedules, schedulePage]);

  const loadNumbers = async () => {
    if (!org?.id) return;
    try {
      const r = await voiceCallsApi.phoneNumbers.getTwilioNumbers({ organizationId: org.id });
      const scoped = r.numbers.filter((n) => getNumberOrgId(n) === org.id);
      setNumbers(scoped);
      const preferred = scoped.find((n) => getAssignedAgentId(n) === voiceAgentId) || scoped[0];
      if (!fromNumber && preferred) setFromNumber(getPhone(preferred));
    } catch (err) { addToast(err instanceof Error ? err.message : 'Could not load phone numbers.', 'error'); }
  };

  const loadSchedules = async () => {
    setBusy('load-schedules');
    try {
      const r = await voiceCallsApi.outreach.getOutreachSchedules();
      const list = unwrapList<OutreachSchedule>(r, ['schedules', 'data', 'items', 'results']);
      startTransition(() => { setSchedules(list); setSchedulePage(1); setSelectedScheduleIds([]); });
    } catch (err) { addToast(err instanceof Error ? err.message : 'Could not load schedules.', 'error'); }
    finally { setBusy(null); }
  };

  useEffect(() => { void loadNumbers(); void loadSchedules(); }, [org?.id]);

  useEffect(() => {
    const preferred = assignedNumbers.find((n) => getAssignedAgentId(n) === voiceAgentId) || assignedNumbers[0];
    if (preferred) setFromNumber(getPhone(preferred));
    setPreview(null);
  }, [voiceAgentId, assignedNumbers]);

  const updateRecipient = (id: string, field: keyof DirectRecipient, value: string) => {
    setDirectRecipients((curr) => curr.map((r) => {
      if (r.id !== id) return r;
      if (field !== 'phone' && field !== 'displayPhone') return { ...r, [field]: value };
      const n = normalizeNorthAmericaPhone(value);
      return { ...r, displayPhone: value, phone: n.value, phoneError: n.error };
    }));
    setPreview(null);
  };

  const getValidDirectRecipients = () => directRecipients.map((r) => ({ name: r.name.trim() || 'Unknown', phone: r.phone.trim() })).filter((r) => r.phone);

  const validate = (forPreview = true) => {
    if (!voiceAgentId) return 'Choose a voice agent.';
    if (!fromNumber) return 'Choose a from number.';
    if (!callPurpose.trim()) return 'Call purpose is required.';
    const badRecipient = directRecipients.find((r) => r.displayPhone && r.phoneError);
    if (badRecipient) return badRecipient.phoneError || 'Enter a valid U.S. or Canadian number.';
    if (recipientMode === 'direct' && getValidDirectRecipients().length === 0) return 'Add at least one direct recipient phone number.';
    if (recipientMode === 'leads' && selectedLeadIds.length === 0) return 'Select at least one lead.';
    if (startLocalDate > sixMonthsFromToday()) return 'Schedules can only be created up to 6 months ahead.';
    if (callType !== 'call_now' && callType !== 'one_time_batch' && callType !== 'custom_rule' && !isValidTime(startTime)) return 'Choose a valid call time.';
    if (callType === 'one_time_batch' && startTimes.length === 0) return 'Add at least one batch start time.';
    if ((callType === 'one_time_batch' || callType === 'custom_rule') && startTimes.some((t) => !isValidTime(t))) return 'Choose valid call times.';
    if (callType === 'recurring_monthly' && repeatCount < 1) return 'Monthly occurrence count must be at least 1.';
    if (callType === 'recurring_monthly' && monthlyDays.length === 0) return 'Choose at least one day of the month.';
    if (callType === 'custom_rule' && customEndDate < startLocalDate) return 'End date must be after start date.';
    if (callType === 'custom_rule' && weekdayRules.length === 0) return 'Choose at least one day for the custom schedule.';
    if (!forPreview && callType !== 'call_now' && !preview) return 'Preview the generated calls before creating the schedule.';
    return '';
  };

  const buildPayload = () => {
    const base: Record<string, unknown> = {
      name: scheduleName.trim() || `${selectedAgent?.name || 'Agent'} outreach`,
      voiceAgentId, fromNumber, callPurpose: callPurpose.trim(),
      customInstructions: customInstructions.trim(), timezone, maxAttemptsPerLead,
      retryDelayMinutes, voicemailBehavior, status: 'active',
    };
    if (recipientMode === 'direct') base.directRecipients = getValidDirectRecipients();
    else if (selectedLeadIds.length === 1) { base.leadId = selectedLeadIds[0]; base.leadIds = selectedLeadIds; }
    else base.leadIds = selectedLeadIds;

    if (callType === 'one_time') return { ...base, scheduleType: 'one_time', startLocalDate, startTime };
    if (callType === 'one_time_batch') return { ...base, scheduleType: 'one_time_batch', startLocalDate, startTimes, batchMode };
    if (callType === 'recurring_monthly') return { ...base, scheduleType: 'recurring_monthly', startLocalDate, startTime, monthlyDays, repeat: { frequency: 'monthly', interval: 1, count: repeatCount }, monthEndBehavior: 'last_day' };
    if (callType === 'custom_rule') return { ...base, scheduleType: 'custom_rule', scheduleConfig: { dateRange: { startDate: startLocalDate, endDate: customEndDate }, weeklyRules: [{ daysOfWeek: weekdayRules, times: startTimes }], batchMode } };
    return { voiceAgentId, fromNumber, to: getValidDirectRecipients()[0]?.phone || '', recipient: getValidDirectRecipients()[0], callPurpose: callPurpose.trim(), customInstructions: customInstructions.trim() };
  };

  const handlePreview = async () => {
    const msg = validate(true); if (msg) { addToast(msg, 'error'); return; }
    if (callType === 'call_now') { addToast('Call Now does not need preview. Use Place Call.'); return; }
    setBusy('preview');
    try {
      const r = await voiceCallsApi.outreach.previewOutreachSchedule(buildPayload());
      setPreview(r as SchedulePreview); addToast('Schedule preview generated.', 'success');
    } catch (err) { setPreview(null); addToast(err instanceof Error ? err.message : 'Preview failed.', 'error'); }
    finally { setBusy(null); }
  };

  const handleCreate = async () => {
    const msg = validate(false); if (msg) { addToast(msg, 'error'); return; }
    setBusy('create');
    try {
      if (callType === 'call_now') { await voiceCallsApi.calls.createOutboundCall(buildPayload()); addToast('Call placed successfully.', 'success'); }
      else { await voiceCallsApi.outreach.createOutreachSchedule(buildPayload()); addToast('Schedule created successfully.', 'success'); }
      setPreview(null); await loadSchedules(); setActiveTab('scheduled');
    } catch (err) { addToast(err instanceof Error ? err.message : 'Create failed.', 'error'); }
    finally { setBusy(null); }
  };

  const handleCancelSchedule = async (scheduleId: string) => {
    setBusy(`cancel-${scheduleId}`);
    try { await voiceCallsApi.outreach.cancelOutreachSchedule(scheduleId, { reason: 'User cancelled from dashboard.' }); addToast('Schedule cancelled.', 'success'); await loadSchedules(); }
    catch (err) { addToast(err instanceof Error ? err.message : 'Cancel failed.', 'error'); }
    finally { setBusy(null); }
  };

  const confirmDeleteSchedule = async () => {
    if (!deleteTarget) return;
    setBusy(`delete-${deleteTarget.id}`);
    try { await voiceCallsApi.outreach.deleteOutreachSchedule(deleteTarget.id); addToast('Schedule deleted.', 'success'); setDeleteTarget(null); await loadSchedules(); }
    catch (err) { addToast(err instanceof Error ? err.message : 'Delete failed.', 'error'); }
    finally { setBusy(null); }
  };

  const handleBulkDelete = async () => {
    if (!selectedScheduleIds.length) return;
    setBusy('bulk-delete');
    try {
      await Promise.all(selectedScheduleIds.map((id) => voiceCallsApi.outreach.deleteOutreachSchedule(id)));
      addToast('Selected schedules deleted.', 'success'); setSelectedScheduleIds([]); setDeleteTarget(null); await loadSchedules();
    } catch (err) { addToast(err instanceof Error ? err.message : 'Bulk delete failed.', 'error'); }
    finally { setBusy(null); }
  };

  const previewCalls = (() => { if (!preview) return []; const c = preview.calls || preview.runs; return Array.isArray(c) ? c.slice(0, 8) : []; })();
  const previewTotal = (() => { if (!preview) return 0; if (typeof preview.totalCalls === 'number') return preview.totalCalls; if (typeof preview.total_calls === 'number') return preview.total_calls; const c = preview.calls || preview.runs; return Array.isArray(c) ? c.length : 0; })();

  const inputCls = 'w-full rounded-2xl border border-line-soft bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange';
  const selectCls = 'w-full rounded-2xl border border-line-soft bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange';

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-semibold tracking-tight text-ink-950">Outreach</h1>
          <p className="text-slate-lux mt-2">Create immediate, scheduled, batch, monthly, and custom outbound calls.</p>
        </div>
        <div className="flex items-center gap-1 rounded-2xl bg-slate-100 p-1">
          {(['create', 'scheduled'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`rounded-xl px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${activeTab === tab ? 'bg-white text-ink-950 shadow-sm' : 'text-slate-lux hover:text-ink-950'}`}>
              {tab === 'create' ? 'Create' : 'Scheduled'}
            </button>
          ))}
        </div>
      </div>

      {/* Scheduled Tab */}
      {activeTab === 'scheduled' ? (
        <LuxuryCard className="p-6">
          <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-lg font-display font-semibold text-ink-950">Scheduled calls</h3>
              <p className="text-xs text-slate-lux">Completed, failed, and cancelled schedules are greyed out.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <LuxuryButton variant="secondary" size="sm" onClick={() => setSelectedScheduleIds((curr) => pageScheduleIds.every((id) => curr.includes(id)) ? curr.filter((id) => !pageScheduleIds.includes(id)) : Array.from(new Set([...curr, ...pageScheduleIds])))}>
                {pageScheduleIds.length > 0 && pageScheduleIds.every((id) => selectedScheduleIds.includes(id)) ? 'Clear Page' : 'Select Page'}
              </LuxuryButton>
              {selectedScheduleIds.length > 0 && (
                <LuxuryButton variant="secondary" size="sm" className="text-red-500 border-red-100 hover:bg-red-50"
                  onClick={() => setDeleteTarget({ id: 'bulk', name: `${selectedScheduleIds.length} selected schedules`, bulk: true })}>
                  Delete Selected
                </LuxuryButton>
              )}
              <LuxuryButton variant="secondary" size="sm" onClick={() => void loadSchedules()} disabled={busy === 'load-schedules'}>
                {busy === 'load-schedules' ? 'Loading...' : 'Refresh'}
              </LuxuryButton>
            </div>
          </div>

          {schedules.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-line-soft py-16 text-center">
              <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-3" />
              <p className="text-base font-semibold text-ink-950">No schedules yet</p>
              <p className="mt-1 text-sm text-slate-lux">Create a scheduled call to see it here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pagedSchedules.map((schedule, index) => {
                const scheduleId = getScheduleId(schedule, (schedulePage - 1) * PAGE_SIZE + index);
                const agent = agents.find((a) => a.id === (schedule.voiceAgentId || schedule.voice_agent_id));
                const status = getScheduleStatus(schedule);
                const completed = isDoneStatus(status);
                return (
                  <div key={scheduleId} className={`rounded-2xl border p-4 transition-all ${completed ? 'border-line-soft bg-slate-50 opacity-60' : 'border-line-soft bg-white hover:border-brand-orange/20'}`}>
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex gap-3">
                        <input type="checkbox" checked={selectedScheduleIds.includes(scheduleId)}
                          onChange={() => setSelectedScheduleIds((curr) => curr.includes(scheduleId) ? curr.filter((id) => id !== scheduleId) : [...curr, scheduleId])}
                          className="mt-1 h-4 w-4 accent-brand-orange" />
                        <button type="button" onClick={() => setSelectedSchedule(schedule)} className="text-left">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold text-ink-950">{schedule.name || 'Scheduled call'}</p>
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-lux">
                              {formatScheduleType(schedule.scheduleType || schedule.schedule_type)}
                            </span>
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${statusClass(status)}`}>{status}</span>
                          </div>
                          <p className="mt-1 text-xs text-slate-lux">{agent?.name || 'Agent'} · {schedule.fromNumber || schedule.from_number || 'No from number'} · {recipientSummary(schedule)}</p>
                          <p className="mt-0.5 text-xs text-slate-400">{humanDateTime(schedule.startAt || schedule.start_at)} · {schedule.callPurpose || schedule.call_purpose || 'No purpose'}</p>
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {!completed && (
                          <LuxuryButton variant="secondary" size="sm" onClick={() => void handleCancelSchedule(scheduleId)} disabled={busy === `cancel-${scheduleId}`}>
                            Cancel
                          </LuxuryButton>
                        )}
                        <LuxuryButton variant="secondary" size="sm" className="text-red-500 border-red-100 hover:bg-red-50"
                          onClick={() => setDeleteTarget({ id: scheduleId, name: schedule.name || 'Scheduled call' })} disabled={busy === `delete-${scheduleId}`}>
                          Delete
                        </LuxuryButton>
                      </div>
                    </div>
                  </div>
                );
              })}
              {schedules.length > PAGE_SIZE && (
                <div className="mt-5 flex flex-col gap-3 border-t border-line-soft pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-slate-lux">Showing {(schedulePage - 1) * PAGE_SIZE + 1}–{Math.min(schedulePage * PAGE_SIZE, schedules.length)} of {schedules.length}</p>
                  <div className="flex items-center gap-2">
                    <LuxuryButton variant="secondary" size="sm" onClick={() => setSchedulePage((p) => Math.max(1, p - 1))} disabled={schedulePage <= 1}>Prev</LuxuryButton>
                    <span className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-lux">Page {schedulePage} of {totalSchedulePages}</span>
                    <LuxuryButton variant="secondary" size="sm" onClick={() => setSchedulePage((p) => Math.min(totalSchedulePages, p + 1))} disabled={schedulePage >= totalSchedulePages}>Next</LuxuryButton>
                  </div>
                </div>
              )}
            </div>
          )}
        </LuxuryCard>
      ) : (
        /* Create Tab */
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="space-y-6">
            {/* Call Type */}
            <LuxuryCard className="p-6">
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-slate-lux">Call type</p>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                {([['call_now', 'Call Now'], ['one_time', 'One-time'], ['one_time_batch', 'Batch'], ['recurring_monthly', 'Monthly'], ['custom_rule', 'Custom']] as const).map(([value, label]) => (
                  <button key={value} onClick={() => { setCallType(value as CallType); setPreview(null); }}
                    className={`rounded-2xl border px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest transition-all ${callType === value ? 'border-brand-orange bg-brand-orange text-white' : 'border-line-soft bg-white text-slate-lux hover:border-brand-orange/30'}`}>
                    {label}
                  </button>
                ))}
              </div>
            </LuxuryCard>

            {/* Agent & Number */}
            <LuxuryCard className="p-6">
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-slate-lux">Agent and number</p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-lux">Agent</span>
                  <select value={voiceAgentId} onChange={(e) => setVoiceAgentId(e.target.value)} className={selectCls}>
                    {agents.map((a: AgentConfig) => <option key={a.id} value={a.id}>{a.name} ({a.direction})</option>)}
                  </select>
                </label>
                <label className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-lux">From number</span>
                  <select value={fromNumber} onChange={(e) => setFromNumber(e.target.value)} className={selectCls}>
                    <option value="">Choose number</option>
                    {assignedNumbers.map((n) => <option key={getPhone(n)} value={getPhone(n)}>{getPhone(n)}{getAssignedAgentId(n) === voiceAgentId ? ' · assigned' : ''}</option>)}
                  </select>
                </label>
              </div>
            </LuxuryCard>

            {/* Recipients */}
            <LuxuryCard className="p-6">
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-slate-lux">Recipients</p>
              <div className="mb-4 flex rounded-2xl bg-slate-100 p-1 text-xs font-semibold uppercase tracking-widest">
                {(['direct', 'leads'] as const).map((mode) => (
                  <button key={mode} onClick={() => { setRecipientMode(mode); setPreview(null); }}
                    className={`flex-1 rounded-xl px-4 py-2 transition-all ${recipientMode === mode ? 'bg-white text-ink-950 shadow-sm' : 'text-slate-lux'}`}>
                    {mode === 'direct' ? 'Direct' : 'Leads'}
                  </button>
                ))}
              </div>
              {recipientMode === 'direct' ? (
                <div className="space-y-3">
                  {directRecipients.map((r, i) => (
                    <div key={r.id} className="space-y-1">
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto]">
                        <input value={r.name} onChange={(e) => updateRecipient(r.id, 'name', e.target.value)} placeholder={`Recipient ${i + 1} name`} className={inputCls} />
                        <input value={r.displayPhone} onChange={(e) => updateRecipient(r.id, 'phone', e.target.value)} placeholder="+1 (555) 123-4567" className={inputCls} />
                        <button onClick={() => { setDirectRecipients((c) => c.length === 1 ? c : c.filter((x) => x.id !== r.id)); setPreview(null); }}
                          className="rounded-2xl border border-red-100 px-4 py-3 text-xs font-semibold uppercase tracking-widest text-red-500 hover:bg-red-50">Remove</button>
                      </div>
                      {r.phone && <p className="text-[11px] font-semibold text-emerald-600">Will call {r.phone}</p>}
                      {r.phoneError && <p className="text-[11px] font-semibold text-red-500">{r.phoneError}</p>}
                    </div>
                  ))}
                  <LuxuryButton variant="secondary" size="sm"
                    onClick={() => setDirectRecipients((c) => [...c, makeRecipient()])}>Add recipient</LuxuryButton>
                </div>
              ) : (
                <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                  {leads.length === 0 ? (
                    <p className="text-sm text-slate-lux">No leads available yet.</p>
                  ) : leads.map((lead) => (
                    <label key={lead.id} className="flex items-center justify-between gap-3 rounded-2xl border border-line-soft px-4 py-3 cursor-pointer hover:border-brand-orange/30">
                      <div>
                        <p className="text-sm font-semibold text-ink-950">{lead.name}</p>
                        <p className="text-xs text-slate-lux">{lead.phone || lead.email || 'No contact'}</p>
                      </div>
                      <input type="checkbox" checked={selectedLeadIds.includes(lead.id)}
                        onChange={() => { setSelectedLeadIds((c) => c.includes(lead.id) ? c.filter((id) => id !== lead.id) : [...c, lead.id]); setPreview(null); }}
                        className="h-4 w-4 accent-brand-orange" />
                    </label>
                  ))}
                </div>
              )}
            </LuxuryCard>

            {/* Purpose & Timing */}
            <LuxuryCard className="p-6">
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-slate-lux">Purpose and timing</p>
              <div className="space-y-4">
                <input value={scheduleName} onChange={(e) => setScheduleName(e.target.value)} placeholder="Schedule name, e.g. Renewal follow-up" className={inputCls} />
                <textarea value={callPurpose} onChange={(e) => { setCallPurpose(e.target.value); setPreview(null); }} placeholder="Required: why is the agent calling?" rows={3} className={inputCls} />
                <textarea value={customInstructions} onChange={(e) => { setCustomInstructions(e.target.value); setPreview(null); }} placeholder="Optional: call-specific guidance" rows={2} className={inputCls} />

                {callType !== 'call_now' && (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <label className="space-y-1.5">
                      <span className="text-xs font-semibold text-slate-lux">Start date</span>
                      <input type="date" min={todayIso()} max={sixMonthsFromToday()} value={startLocalDate}
                        onChange={(e) => { setStartLocalDate(e.target.value); setPreview(null); }} className={inputCls} />
                    </label>
                    <TimezonePicker value={timezone} onChange={(v) => { setTimezone(v); setPreview(null); }} />
                    {callType !== 'one_time_batch' && callType !== 'custom_rule' ? (
                      <TimePicker label="Time" value={startTime} onChange={(v) => { setStartTime(v); setPreview(null); }} />
                    ) : (
                      <div className="md:col-span-3">
                        <TimeListEditor values={startTimes} onChange={(v) => { setStartTimes(v); setPreview(null); }} />
                      </div>
                    )}
                  </div>
                )}

                {(callType === 'one_time_batch' || callType === 'custom_rule') && (
                  <label className="block space-y-1.5">
                    <span className="text-xs font-semibold text-slate-lux">Batch mode</span>
                    <select value={batchMode} onChange={(e) => setBatchMode(e.target.value as BatchMode)} className={selectCls}>
                      <option value="spread_recipients_across_times">Spread recipients across times</option>
                      <option value="all_recipients_each_time">All recipients each time</option>
                    </select>
                  </label>
                )}

                {callType === 'recurring_monthly' && (
                  <div className="space-y-4 rounded-3xl bg-slate-50 border border-line-soft p-4">
                    <label className="block space-y-1.5">
                      <span className="text-xs font-semibold text-slate-lux">Number of months</span>
                      <input type="number" min={1} max={6} value={repeatCount} onChange={(e) => { setRepeatCount(Number(e.target.value)); setPreview(null); }} className={inputCls} />
                    </label>
                    <div>
                      <p className="mb-2 text-xs font-semibold text-slate-lux">Days of the month</p>
                      <div className="grid grid-cols-7 gap-1.5">
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                          <button key={day} onClick={() => { setMonthlyDays((c) => c.includes(day) ? c.filter((d) => d !== day) : [...c, day].sort((a, b) => a - b)); setPreview(null); }}
                            className={`rounded-xl py-2 text-xs font-semibold ${monthlyDays.includes(day) ? 'bg-brand-orange text-white' : 'bg-white border border-line-soft text-slate-lux hover:border-brand-orange/30'}`}>
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {callType === 'custom_rule' && (
                  <div className="space-y-4 rounded-3xl bg-slate-50 border border-line-soft p-4">
                    <label className="block space-y-1.5">
                      <span className="text-xs font-semibold text-slate-lux">End date</span>
                      <input type="date" min={startLocalDate} max={sixMonthsFromToday()} value={customEndDate}
                        onChange={(e) => { setCustomEndDate(e.target.value); setPreview(null); }} className={inputCls} />
                    </label>
                    <div>
                      <p className="mb-2 text-xs font-semibold text-slate-lux">Call days</p>
                      <div className="grid grid-cols-7 gap-1.5">
                        {DAYS.map((day) => (
                          <button key={day.key} onClick={() => { setWeekdayRules((c) => c.includes(day.key) ? c.filter((d) => d !== day.key) : [...c, day.key]); setPreview(null); }}
                            className={`rounded-xl py-3 text-[10px] font-semibold uppercase tracking-widest ${weekdayRules.includes(day.key) ? 'bg-brand-orange text-white' : 'bg-white border border-line-soft text-slate-lux hover:border-brand-orange/30'}`}>
                            {day.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <label className="space-y-1.5">
                    <span className="text-xs font-semibold text-slate-lux">Max attempts</span>
                    <input type="number" min={1} max={5} value={maxAttemptsPerLead} onChange={(e) => setMaxAttemptsPerLead(Number(e.target.value))} className={inputCls} />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-xs font-semibold text-slate-lux">Retry delay</span>
                    <select value={retryDelayMinutes} onChange={(e) => setRetryDelayMinutes(Number(e.target.value))} className={selectCls}>
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={180}>3 hours</option>
                      <option value={1440}>Next day</option>
                    </select>
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-xs font-semibold text-slate-lux">Voicemail</span>
                    <select value={voicemailBehavior} onChange={(e) => setVoicemailBehavior(e.target.value)} className={selectCls}>
                      <option value="hangup">Hang up</option>
                      <option value="leave_message">Leave message</option>
                    </select>
                  </label>
                </div>
              </div>
            </LuxuryCard>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <LuxuryCard className="p-6">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-lux mb-4">Preview and create</p>
              <div className="space-y-3 rounded-2xl bg-slate-50 border border-line-soft p-4 text-sm text-slate-lux">
                <p><span className="font-semibold text-ink-950">Type:</span> {formatScheduleType(callType)}</p>
                <p><span className="font-semibold text-ink-950">Agent:</span> {selectedAgent?.name || 'None'}</p>
                <p><span className="font-semibold text-ink-950">From:</span> {fromNumber || 'Choose number'}</p>
                <p><span className="font-semibold text-ink-950">Recipients:</span> {recipientMode === 'direct' ? getValidDirectRecipients().length : selectedLeadIds.length}</p>
              </div>
              {callType !== 'call_now' && (
                <LuxuryButton variant="secondary" className="w-full mt-4" onClick={() => void handlePreview()} disabled={busy === 'preview'}>
                  {busy === 'preview' ? 'Previewing...' : 'Preview calls'}
                </LuxuryButton>
              )}
              <LuxuryButton variant="primary" className="w-full mt-3" onClick={() => void handleCreate()} disabled={busy === 'create' || isPending}>
                {busy === 'create' ? 'Working...' : callType === 'call_now' ? 'Place Call' : 'Create Schedule'}
              </LuxuryButton>
              {preview && (
                <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-sm font-semibold text-emerald-800">{previewTotal} calls generated</p>
                  {previewCalls.length > 0 && (
                    <pre className="mt-3 max-h-56 overflow-auto whitespace-pre-wrap rounded-xl bg-white p-3 text-[11px] text-slate-500">
                      {JSON.stringify(previewCalls, null, 2)}
                    </pre>
                  )}
                  {preview.warnings && preview.warnings.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {preview.warnings.map((w, i) => <p key={i} className="text-xs text-amber-700">⚠ {w}</p>)}
                    </div>
                  )}
                </div>
              )}
            </LuxuryCard>
          </aside>
        </div>
      )}

      {/* Schedule Detail Modal */}
      <AppModal open={!!selectedSchedule} onClose={() => setSelectedSchedule(null)}
        title={selectedSchedule?.name || 'Schedule details'}
        description={selectedSchedule ? `${formatScheduleType(selectedSchedule.scheduleType || selectedSchedule.schedule_type)} · ${getScheduleStatus(selectedSchedule)}` : undefined}
        size="lg"
        footer={
          <LuxuryButton variant="secondary" className="w-full" onClick={() => setSelectedSchedule(null)}>Close</LuxuryButton>
        }
      >
        {selectedSchedule && (
          <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
            {[
              ['From', selectedSchedule.fromNumber || selectedSchedule.from_number || '—'],
              ['Timezone', selectedSchedule.timezone || '—'],
              ['Created', humanDateTime(selectedSchedule.createdAt || selectedSchedule.created_at)],
              ['Starts', humanDateTime(selectedSchedule.startAt || selectedSchedule.start_at)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-slate-50 border border-line-soft p-4">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-lux">{label}</p>
                <p className="mt-1 font-semibold text-ink-950">{value}</p>
              </div>
            ))}
            <div className="rounded-2xl bg-slate-50 border border-line-soft p-4 md:col-span-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-lux">Recipients</p>
              <p className="mt-1 text-slate-lux">{recipientSummary(selectedSchedule)}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 border border-line-soft p-4 md:col-span-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-lux">Purpose</p>
              <p className="mt-1 text-slate-lux">{selectedSchedule.callPurpose || selectedSchedule.call_purpose || '—'}</p>
            </div>
          </div>
        )}
      </AppModal>

      {/* Delete Confirm Modal */}
      <AppModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete schedule" description="This cannot be undone." size="md"
        footer={
          <div className="flex gap-3">
            <LuxuryButton variant="secondary" className="flex-1" onClick={() => setDeleteTarget(null)} disabled={!!busy}>Cancel</LuxuryButton>
            <button onClick={() => deleteTarget?.bulk ? void handleBulkDelete() : void confirmDeleteSchedule()}
              disabled={!!busy}
              className="flex-1 rounded-2xl bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 transition-all">
              {busy ? 'Deleting…' : 'Yes, delete permanently'}
            </button>
          </div>
        }
      >
        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          Permanently deleting <strong>{deleteTarget?.bulk ? `${selectedScheduleIds.length} selected schedules` : deleteTarget?.name || 'this schedule'}</strong>. This cannot be recovered.
        </div>
      </AppModal>
    </div>
  );
}
