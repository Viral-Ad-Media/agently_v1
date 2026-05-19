import * as React from 'react';
import { Settings as SettingsIcon, Globe, Lock, Bell, Database, Cpu, Trash2, ChevronRight, ShieldCheck, Cloud, AlertTriangle } from 'lucide-react';
import { LuxuryCard } from '@/src/components/ui/LuxuryCard';
import { LuxuryButton } from '@/src/components/ui/LuxuryButton';
import { cn } from '@/src/lib/utils';
import { useWorkspace } from '@/src/context/WorkspaceContext';
import { api } from '@/src/services/api';
import { useToast } from '@/src/components/ui/ToastProvider';

const TIMEZONES = [
  'UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
  'America/Toronto', 'America/Sao_Paulo', 'Europe/London', 'Europe/Paris', 'Europe/Berlin',
  'Africa/Lagos', 'Africa/Nairobi', 'Asia/Dubai', 'Asia/Kolkata', 'Asia/Singapore',
  'Asia/Tokyo', 'Australia/Sydney', 'Pacific/Auckland',
];

export default function Settings() {
  const { workspace, handleSaveSettings } = useWorkspace();
  const { toast } = useToast();
  const org = workspace?.organization;
  const [activeTab, setActiveTab] = React.useState('general');
  const [saving, setSaving] = React.useState(false);
  const [timezone, setTimezone] = React.useState(org?.profile?.timezone ?? 'UTC');
  const [phoneNumber, setPhoneNumber] = React.useState(org?.phoneNumber ?? '');
  const [twilioSid, setTwilioSid] = React.useState('');
  const [twilioToken, setTwilioToken] = React.useState('');
  const [deleteConfirm, setDeleteConfirm] = React.useState('');

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'security', label: 'Security & API', icon: Lock },
    { id: 'integrations', label: 'Integrations', icon: Cloud },
    { id: 'danger', label: 'Danger Zone', icon: AlertTriangle },
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      await handleSaveSettings({ timezone, phoneNumber });
      toast('Settings saved successfully.', 'success');
    } catch {
      toast('Failed to save settings.', 'error');
    } finally { setSaving(false); }
  };

  const handleSaveTwilio = async () => {
    setSaving(true);
    try {
      await api.updateSettings({ twilio: { accountSid: twilioSid, authToken: twilioToken } });
      toast('Twilio credentials saved.', 'success');
      setTwilioToken('');
    } catch { toast('Failed to save Twilio settings.', 'error'); }
    finally { setSaving(false); }
  };

  const handleDeleteOrg = async () => {
    if (deleteConfirm !== org?.profile?.name) return;
    try {
      await api.requestOrganizationDeletion({ organizationName: org.profile.name, acknowledgeNoRefund: true });
      toast('Deletion request submitted.', 'success');
    } catch { toast('Failed to submit deletion request.', 'error'); }
  };

  return (
    <div className="space-y-10 pb-20">
      <div>
        <h1 className="text-4xl font-display font-semibold tracking-tight text-ink-950">Workspace Settings</h1>
        <p className="text-slate-lux mt-2">Configure your organization and integrations.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={cn('flex items-center gap-2 px-4 py-2.5 rounded-luxury text-sm font-semibold transition-all', activeTab === tab.id ? 'bg-ink-950 text-white' : 'bg-white border border-line-soft text-slate-lux hover:border-brand-orange/30 hover:text-ink-900')}
          >
            <tab.icon className={cn('h-4 w-4', tab.id === 'danger' && 'text-red-500')} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'general' && (
        <LuxuryCard className="p-8 space-y-6">
          <h2 className="text-xl font-display font-semibold text-ink-950">General Settings</h2>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-lux mb-2">Organization Name</label>
            <input readOnly value={org?.profile?.name ?? ''} className="w-full px-4 py-3 rounded-2xl border border-line-soft bg-slate-50 outline-none text-ink-900 cursor-not-allowed opacity-60 text-sm" />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-lux mb-2">Timezone</label>
            <select value={timezone} onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-line-soft bg-white outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange text-sm text-ink-900"
            >
              {TIMEZONES.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-lux mb-2">Primary Phone Number</label>
            <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+1 555 000 0000"
              className="w-full px-4 py-3 rounded-2xl border border-line-soft bg-white outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange text-sm"
            />
          </div>
          <LuxuryButton onClick={handleSave} disabled={saving}>
            {saving ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : 'Save Changes'}
          </LuxuryButton>
        </LuxuryCard>
      )}

      {activeTab === 'security' && (
        <LuxuryCard className="p-8 space-y-6">
          <h2 className="text-xl font-display font-semibold text-ink-950">Security & API</h2>
          <div className="rounded-2xl bg-slate-50 border border-line-soft p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-lux mb-1">Session Token</p>
            <p className="text-sm text-ink-900 font-mono">••••••••••••••••••••••••••••••••</p>
          </div>
          <p className="text-sm text-slate-lux">API keys and webhook secrets are managed through the Voice Agent settings per agent.</p>
        </LuxuryCard>
      )}

      {activeTab === 'integrations' && (
        <LuxuryCard className="p-8 space-y-6">
          <h2 className="text-xl font-display font-semibold text-ink-950">Twilio Integration</h2>
          <p className="text-sm text-slate-lux">Optionally override the platform Twilio credentials with your own account.</p>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-lux mb-2">Account SID</label>
            <input type="text" value={twilioSid} onChange={(e) => setTwilioSid(e.target.value)} placeholder="ACxxxxxxxxxxxxxxxx" className="w-full px-4 py-3 rounded-2xl border border-line-soft bg-white outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange text-sm font-mono" />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-lux mb-2">Auth Token</label>
            <input type="password" value={twilioToken} onChange={(e) => setTwilioToken(e.target.value)} placeholder="••••••••••••••••" className="w-full px-4 py-3 rounded-2xl border border-line-soft bg-white outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange text-sm" />
          </div>
          <LuxuryButton onClick={handleSaveTwilio} disabled={saving || (!twilioSid && !twilioToken)}>Save Twilio Settings</LuxuryButton>
        </LuxuryCard>
      )}

      {activeTab === 'danger' && (
        <LuxuryCard className="p-8 space-y-6 border-red-200">
          <h2 className="text-xl font-display font-semibold text-red-600">Danger Zone</h2>
          <div className="rounded-2xl bg-red-50 border border-red-200 p-5">
            <p className="font-semibold text-red-800 mb-1">Delete Organization</p>
            <p className="text-sm text-red-600 mb-4">This is irreversible. All data will be permanently erased.</p>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-red-600 mb-2">
              Type "<strong>{org?.profile?.name}</strong>" to confirm
            </label>
            <input type="text" value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)} placeholder={org?.profile?.name} className="w-full px-4 py-3 rounded-2xl border border-red-200 bg-white outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm mb-4" />
            <button
              disabled={deleteConfirm !== org?.profile?.name}
              onClick={handleDeleteOrg}
              className="px-6 py-3 rounded-2xl bg-red-600 text-white text-sm font-bold uppercase tracking-wider hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Delete Organization
            </button>
          </div>
        </LuxuryCard>
      )}
    </div>
  );
}
