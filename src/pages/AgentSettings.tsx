import * as React from 'react';
import { Mic2, Plus, Globe, Settings, Sliders, Database, ShieldAlert, Trash2, RefreshCw, Save, Play, Square, CheckCircle2, AlertCircle } from 'lucide-react';
import { LuxuryCard } from '@/src/components/ui/LuxuryCard';
import { LuxuryButton } from '@/src/components/ui/LuxuryButton';
import { cn } from '@/src/lib/utils';
import { useWorkspace } from '@/src/context/WorkspaceContext';
import { AgentConfig } from '@/src/types';
import { api } from '@/src/services/api';
import { voiceCallsApi } from '@/src/services/voiceCallsApi';
import { useToast } from '@/src/components/ui/ToastProvider';

const TONES = ['Professional', 'Friendly', 'Empathetic'] as const;
const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Portuguese', 'Italian'] as const;

const tabs = [
  { id: 'fleet', label: 'Agent Fleet', icon: Mic2 },
  { id: 'settings', label: 'Persona & Voice', icon: Settings },
  { id: 'knowledge', label: 'Knowledge Base', icon: Database },
  { id: 'rules', label: 'Rules & Routing', icon: ShieldAlert },
];

const inp = 'w-full px-4 py-3 rounded-2xl border border-line-soft bg-white outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange text-sm text-ink-900 transition-all';

export default function AgentSettings() {
  const { workspace, handleUpdateAgent, handleCreateVoiceAgent, handleActivateVoiceAgent, handleDeleteVoiceAgent, handleUpdateRules, handleAddFaq, handleUpdateFaq, handleRemoveFaq, handleSyncFaqs, handleRestartAgent } = useWorkspace();
  const { toast } = useToast();
  const org = workspace?.organization;
  const agents = org?.voiceAgents ?? [];
  const activeAgent = org?.agent;

  const [activeTab, setActiveTab] = React.useState('fleet');
  const [draft, setDraft] = React.useState<Partial<AgentConfig>>(activeAgent ?? {});
  const [saving, setSaving] = React.useState(false);
  const [creating, setCreating] = React.useState(false);
  const [scrapeUrl, setScrapeUrl] = React.useState(org?.profile?.website ?? '');
  const [scraping, setScraping] = React.useState(false);
  const [scrapeResult, setScrapeResult] = React.useState('');
  const [previewText] = React.useState('Hello, this is a voice preview from Agently.');
  const [previewing, setPreviewing] = React.useState(false);

  React.useEffect(() => { if (activeAgent) setDraft(activeAgent); }, [activeAgent?.id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await handleUpdateAgent(draft);
      toast('Agent settings saved.', 'success');
    } catch { toast('Failed to save settings.', 'error'); }
    finally { setSaving(false); }
  };

  const handleScrape = async () => {
    setScraping(true);
    setScrapeResult('');
    try {
      const result = await api.importVoiceAgentKnowledge(draft.id!, scrapeUrl);
      setScrapeResult(`✅ Imported ${result.chunksStored} knowledge chunks via ${result.strategy}.`);
      toast(`Knowledge imported: ${result.chunksStored} chunks.`, 'success');
    } catch (e: any) {
      setScrapeResult(`❌ ${e.message}`);
      toast(e.message, 'error');
    } finally { setScraping(false); }
  };

  const handlePreviewVoice = async () => {
    if (!draft.id) return;
    setPreviewing(true);
    try {
      const result = await voiceCallsApi.testAgentVoice(draft.id, { text: previewText, voice_provider: 'openai' } as any);
      if (result.blob) {
        const url = URL.createObjectURL(result.blob);
        const audio = new Audio(url);
        audio.play();
        audio.onended = () => URL.revokeObjectURL(url);
      } else if (result.audioUrl) {
        new Audio(result.audioUrl).play();
      }
    } catch { toast('Voice preview failed.', 'error'); }
    finally { setPreviewing(false); }
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-semibold tracking-tight text-ink-950">Voice Agent Studio</h1>
          <p className="text-slate-lux mt-2">Manage and train your AI concierge squad.</p>
        </div>
        <div className="flex gap-3">
          <LuxuryButton variant="secondary" size="sm" onClick={() => void handleRestartAgent()}>
            <RefreshCw className="h-4 w-4 mr-2" /> Restart Agent
          </LuxuryButton>
          <LuxuryButton size="sm" disabled={creating} onClick={async () => { setCreating(true); try { await handleCreateVoiceAgent(); toast('New agent created.', 'success'); } finally { setCreating(false); } }}>
            {creating ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <><Plus className="h-4 w-4 mr-2" /> Create New Agent</>}
          </LuxuryButton>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={cn('flex items-center gap-2 px-4 py-2.5 rounded-luxury text-sm font-semibold transition-all', activeTab === tab.id ? 'bg-ink-950 text-white' : 'bg-white border border-line-soft text-slate-lux hover:border-brand-orange/30 hover:text-ink-900')}
          >
            <tab.icon className="h-4 w-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Fleet Tab */}
      {activeTab === 'fleet' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {agents.length === 0 ? (
            <LuxuryCard className="col-span-full p-16 text-center">
              <Mic2 className="h-12 w-12 mx-auto mb-4 text-brand-orange/30" />
              <p className="text-xl font-display font-semibold text-ink-950 mb-2">No Agents Yet</p>
              <p className="text-slate-lux mb-6">Create your first AI voice agent to get started.</p>
              <LuxuryButton onClick={() => void handleCreateVoiceAgent()}>Create Agent</LuxuryButton>
            </LuxuryCard>
          ) : agents.map((agent) => (
            <LuxuryCard key={agent.id} className={cn('p-6', org?.activeVoiceAgentId === agent.id && 'ring-2 ring-brand-orange')}>
              <div className="flex items-start justify-between mb-4">
                <div className={cn('p-2.5 rounded-xl', agent.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400')}>
                  <Mic2 className="h-5 w-5" />
                </div>
                {org?.activeVoiceAgentId === agent.id && (
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-brand-orange/10 text-brand-orange px-2.5 py-1 rounded-full">Active</span>
                )}
              </div>
              <h3 className="text-lg font-display font-semibold text-ink-950 mb-1">{agent.name}</h3>
              <p className="text-xs text-slate-lux mb-1 capitalize">{agent.direction} · {agent.language}</p>
              <p className="text-xs text-slate-lux font-mono mb-4">{agent.twilioPhoneNumber || 'No number assigned'}</p>
              <div className="flex gap-2">
                {org?.activeVoiceAgentId !== agent.id && (
                  <LuxuryButton size="sm" variant="secondary" className="flex-1 text-xs" onClick={() => void handleActivateVoiceAgent(agent.id)}>
                    Activate
                  </LuxuryButton>
                )}
                <button onClick={() => { if (window.confirm('Delete this agent?')) void handleDeleteVoiceAgent(agent.id); }}
                  className="p-2 rounded-xl hover:bg-red-50 text-slate-lux hover:text-red-500 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </LuxuryCard>
          ))}
        </div>
      )}

      {/* Persona & Voice Tab */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LuxuryCard className="p-6 space-y-5">
            <h2 className="text-lg font-display font-semibold text-ink-950">Agent Identity</h2>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-lux mb-2">Agent Name</label>
              <input className={inp} value={draft.name ?? ''} onChange={(e) => setDraft(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-lux mb-2">Direction</label>
              <select className={inp} value={draft.direction ?? 'inbound'} onChange={(e) => setDraft(p => ({ ...p, direction: e.target.value as any }))}>
                <option value="inbound">Inbound</option>
                <option value="outbound">Outbound</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-lux mb-2">Language</label>
              <select className={inp} value={draft.language ?? 'English'} onChange={(e) => setDraft(p => ({ ...p, language: e.target.value as any }))}>
                {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-lux mb-2">Tone</label>
              <div className="grid grid-cols-3 gap-2">
                {TONES.map((t) => (
                  <button key={t} onClick={() => setDraft(p => ({ ...p, tone: t }))}
                    className={cn('py-2.5 rounded-2xl border-2 text-xs font-bold uppercase tracking-wider transition-all', draft.tone === t ? 'border-brand-orange bg-brand-orange-soft text-brand-orange' : 'border-line-soft text-slate-lux hover:border-brand-orange/30')}
                  >{t}</button>
                ))}
              </div>
            </div>
          </LuxuryCard>

          <LuxuryCard className="p-6 space-y-5">
            <h2 className="text-lg font-display font-semibold text-ink-950">Greeting & Hours</h2>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-lux mb-2">Greeting Message</label>
              <textarea rows={4} className={inp} value={draft.greeting ?? ''} onChange={(e) => setDraft(p => ({ ...p, greeting: e.target.value }))} />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-lux mb-2">Business Hours</label>
              <input className={inp} value={draft.businessHours ?? ''} onChange={(e) => setDraft(p => ({ ...p, businessHours: e.target.value }))} placeholder="9:00 AM - 5:00 PM" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-lux mb-2">Escalation Phone</label>
              <input className={inp} value={draft.escalationPhone ?? ''} onChange={(e) => setDraft(p => ({ ...p, escalationPhone: e.target.value }))} placeholder="+1 555 000 0000" />
            </div>
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-line-soft">
              <input type="checkbox" id="voicemail" checked={draft.voicemailFallback ?? true} onChange={(e) => setDraft(p => ({ ...p, voicemailFallback: e.target.checked }))} className="accent-brand-orange" />
              <label htmlFor="voicemail" className="text-sm font-medium text-ink-900 cursor-pointer">Enable voicemail fallback</label>
            </div>

            <div className="flex gap-3">
              <LuxuryButton variant="secondary" size="sm" className="flex-1" onClick={handlePreviewVoice} disabled={previewing || !draft.id}>
                {previewing ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-orange border-t-transparent" /> : <><Play className="h-4 w-4 mr-1.5" /> Preview Voice</>}
              </LuxuryButton>
              <LuxuryButton size="sm" className="flex-1" onClick={handleSave} disabled={saving}>
                {saving ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <><Save className="h-4 w-4 mr-1.5" /> Save</>}
              </LuxuryButton>
            </div>
          </LuxuryCard>
        </div>
      )}

      {/* Knowledge Base Tab */}
      {activeTab === 'knowledge' && (
        <div className="space-y-6">
          <LuxuryCard className="p-6">
            <h2 className="text-lg font-display font-semibold text-ink-950 mb-4">Import Website Knowledge</h2>
            <p className="text-sm text-slate-lux mb-4">Scrape your website to auto-populate the agent's knowledge base.</p>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-lux/40" />
                <input type="url" value={scrapeUrl} onChange={(e) => setScrapeUrl(e.target.value)} placeholder="https://yourwebsite.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-line-soft bg-white outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange text-sm" />
              </div>
              <LuxuryButton onClick={handleScrape} disabled={scraping || !scrapeUrl}>
                {scraping ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : 'Import'}
              </LuxuryButton>
            </div>
            {scrapeResult && <p className={cn('mt-3 text-sm font-medium', scrapeResult.startsWith('✅') ? 'text-emerald-600' : 'text-red-500')}>{scrapeResult}</p>}
          </LuxuryCard>

          <LuxuryCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-display font-semibold text-ink-950">FAQs ({(draft.faqs ?? []).length})</h2>
              <div className="flex gap-2">
                <LuxuryButton variant="secondary" size="sm" onClick={() => void handleSyncFaqs()}>
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Sync
                </LuxuryButton>
                <LuxuryButton size="sm" onClick={() => void handleAddFaq()}>
                  <Plus className="h-3.5 w-3.5 mr-1.5" /> Add FAQ
                </LuxuryButton>
              </div>
            </div>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {(draft.faqs ?? []).length === 0 ? (
                <p className="text-center py-12 text-slate-lux text-sm">No FAQs yet. Add some or sync from your website.</p>
              ) : (draft.faqs ?? []).map((faq, i) => (
                <div key={faq.id} className="p-4 rounded-2xl border border-line-soft bg-slate-50 space-y-2">
                  <div className="flex items-start gap-2">
                    <input type="text" value={faq.question}
                      onChange={(e) => void handleUpdateFaq(faq.id, { question: e.target.value })}
                      onBlur={(e) => void handleUpdateFaq(faq.id, { question: e.target.value })}
                      className="flex-1 bg-transparent outline-none font-semibold text-sm text-ink-900 border-b border-line-soft pb-1 focus:border-brand-orange"
                    />
                    <button onClick={() => void handleRemoveFaq(faq.id)} className="p-1 rounded hover:bg-red-50 text-slate-lux hover:text-red-500 transition-colors flex-shrink-0">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <textarea rows={2} value={faq.answer}
                    onChange={(e) => void handleUpdateFaq(faq.id, { answer: e.target.value })}
                    onBlur={(e) => void handleUpdateFaq(faq.id, { answer: e.target.value })}
                    className="w-full bg-transparent outline-none text-sm text-slate-lux resize-none"
                  />
                </div>
              ))}
            </div>
          </LuxuryCard>
        </div>
      )}

      {/* Rules Tab */}
      {activeTab === 'rules' && (
        <LuxuryCard className="p-6">
          <h2 className="text-lg font-display font-semibold text-ink-950 mb-6">Agent Rules & Automation</h2>
          <div className="space-y-4">
            {[
              { key: 'autoBook', label: 'Auto-book appointments', desc: 'Automatically schedule meetings when a caller requests one.' },
              { key: 'autoEscalate', label: 'Auto-escalate complex queries', desc: 'Transfer to a human agent when the AI is uncertain.' },
              { key: 'captureAllLeads', label: 'Capture all leads', desc: 'Always collect caller info even for quick inquiries.' },
            ].map((rule) => (
              <div key={rule.key} className="flex items-start gap-4 p-5 rounded-2xl border border-line-soft hover:border-brand-orange/30 transition-colors">
                <div className="flex-1">
                  <p className="font-semibold text-ink-900">{rule.label}</p>
                  <p className="text-sm text-slate-lux mt-0.5">{rule.desc}</p>
                </div>
                <button
                  onClick={() => void handleUpdateRules({ [rule.key]: !(draft.rules as any)?.[rule.key] })}
                  className={cn('relative w-11 h-6 rounded-full transition-colors flex-shrink-0 mt-0.5', (draft.rules as any)?.[rule.key] ? 'bg-brand-orange' : 'bg-slate-200')}
                >
                  <span className={cn('absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all', (draft.rules as any)?.[rule.key] ? 'left-6' : 'left-1')} />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-lux mb-2">Data Capture Fields</label>
            <div className="flex flex-wrap gap-2">
              {['name', 'phone', 'email', 'reason', 'budget', 'timeline'].map((f) => {
                const active = (draft.dataCaptureFields ?? []).includes(f);
                return (
                  <button key={f} onClick={() => setDraft(p => ({ ...p, dataCaptureFields: active ? (p.dataCaptureFields ?? []).filter(x => x !== f) : [...(p.dataCaptureFields ?? []), f] }))}
                    className={cn('px-3 py-1.5 rounded-full border-2 text-xs font-bold uppercase tracking-wider transition-all', active ? 'border-brand-orange bg-brand-orange-soft text-brand-orange' : 'border-line-soft text-slate-lux hover:border-brand-orange/30')}
                  >
                    {active && '✓ '}{f}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <LuxuryButton onClick={handleSave} disabled={saving}>
              {saving ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <><Save className="h-4 w-4 mr-1.5" /> Save Rules</>}
            </LuxuryButton>
          </div>
        </LuxuryCard>
      )}
    </div>
  );
}
