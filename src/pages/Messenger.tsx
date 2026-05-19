import * as React from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Plus, Settings, Palette, Code, Eye, Zap, Globe, Monitor, Smartphone, Copy, CheckCircle2, Mic, Send, RefreshCw, Trash2 } from 'lucide-react';
import { LuxuryCard } from '@/src/components/ui/LuxuryCard';
import { LuxuryButton } from '@/src/components/ui/LuxuryButton';
import { cn } from '@/src/lib/utils';
import { useToast } from '@/src/components/ui/ToastProvider';
import { useWorkspace } from '@/src/context/WorkspaceContext';
import { ChatbotConfig } from '@/src/types';

const ACCENT_COLORS = ['#F05A25', '#3B82F6', '#10B981', '#8B5CF6', '#EF4444', '#F59E0B'];

export default function Messenger() {
  const { workspace, handleSendMessage, handleResetConversation, handleCreateChatbot, handleUpdateChatbot, handleActivateChatbot, handleDeleteChatbot, handleImportChatbotFaqs } = useWorkspace();
  const { toast } = useToast();
  const org = workspace?.organization;
  const conversation = workspace?.conversation ?? [];
  const chatbots = org?.chatbots ?? [];
  const activeChatbot = chatbots.find(c => c.id === org?.activeChatbotId) ?? chatbots[0] ?? null;

  const [activeTab, setActiveTab] = React.useState('preview');
  const [copied, setCopied] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const [editBot, setEditBot] = React.useState<Partial<ChatbotConfig>>(activeChatbot ?? {});
  const [saving, setSaving] = React.useState(false);
  const [importUrl, setImportUrl] = React.useState(org?.profile?.website ?? '');
  const [importing, setImporting] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => { if (activeChatbot) setEditBot(activeChatbot); }, [activeChatbot?.id]);
  React.useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [conversation]);

  const copyToClipboard = () => {
    const script = activeChatbot?.embedScript || activeChatbot?.widgetScriptUrl || `<script src="https://cdn.agently.ai/widget.js" data-id="${activeChatbot?.id ?? 'YOUR_ID'}"></script>`;
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast('Script copied to clipboard.', 'success');
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    const msg = message;
    setMessage('');
    try { await handleSendMessage(msg, activeChatbot?.id); }
    catch { toast('Failed to send message.', 'error'); }
    finally { setSending(false); }
  };

  const handleSaveBot = async () => {
    if (!activeChatbot?.id) return;
    setSaving(true);
    try { await handleUpdateChatbot(activeChatbot.id, editBot); toast('Chatbot settings saved.', 'success'); }
    catch { toast('Save failed.', 'error'); }
    finally { setSaving(false); }
  };

  const handleImport = async () => {
    if (!activeChatbot?.id) return;
    setImporting(true);
    try { await handleImportChatbotFaqs(activeChatbot.id, importUrl); toast('Website knowledge imported.', 'success'); }
    catch (e: any) { toast(e.message, 'error'); }
    finally { setImporting(false); }
  };

  const embedTabs = [
    { id: 'preview', label: 'Live Preview', icon: Eye },
    { id: 'design', label: 'Design', icon: Palette },
    { id: 'embed', label: 'Embed Code', icon: Code },
  ];

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-semibold tracking-tight text-ink-950">Chatbot Studio</h1>
          <p className="text-slate-lux mt-2">Design, test, and deploy your AI chat concierge.</p>
        </div>
        <div className="flex gap-3">
          <LuxuryButton variant="secondary" size="sm" onClick={() => void handleCreateChatbot()}>
            <Plus className="h-4 w-4 mr-2" /> New Chatbot
          </LuxuryButton>
          {activeChatbot && org?.activeChatbotId !== activeChatbot?.id && (
            <LuxuryButton size="sm" onClick={() => void handleActivateChatbot(activeChatbot.id)}>
              <Zap className="h-4 w-4 mr-2" /> Activate
            </LuxuryButton>
          )}
        </div>
      </div>

      {chatbots.length === 0 ? (
        <LuxuryCard className="p-16 text-center">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-brand-orange/30" />
          <p className="text-xl font-display font-semibold text-ink-950 mb-2">No Chatbots Yet</p>
          <p className="text-slate-lux mb-6">Create your first chatbot to start handling website inquiries.</p>
          <LuxuryButton onClick={() => void handleCreateChatbot()}>Create Chatbot</LuxuryButton>
        </LuxuryCard>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Config + Tabs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chatbot selector */}
            {chatbots.length > 1 && (
              <LuxuryCard className="p-4">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-lux mb-2">Active Chatbot</label>
                <select className="w-full px-4 py-3 rounded-2xl border border-line-soft bg-white text-sm outline-none focus:ring-2 focus:ring-brand-orange/20"
                  value={activeChatbot?.id ?? ''} onChange={(e) => void handleActivateChatbot(e.target.value)}>
                  {chatbots.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </LuxuryCard>
            )}

            <LuxuryCard className="p-1">
              <div className="flex">
                {embedTabs.map((tab) => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={cn('flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold rounded-luxury transition-all', activeTab === tab.id ? 'bg-ink-950 text-white' : 'text-slate-lux hover:text-ink-900')}
                  >
                    <tab.icon className="h-3.5 w-3.5" /> {tab.label}
                  </button>
                ))}
              </div>
            </LuxuryCard>

            {activeTab === 'design' && activeChatbot && (
              <LuxuryCard className="p-6 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-lux mb-2">Header Title</label>
                  <input className="w-full px-4 py-3 rounded-2xl border border-line-soft bg-white text-sm outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange" value={editBot.headerTitle ?? ''} onChange={(e) => setEditBot(p => ({ ...p, headerTitle: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-lux mb-2">Welcome Message</label>
                  <textarea rows={2} className="w-full px-4 py-3 rounded-2xl border border-line-soft bg-white text-sm outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange resize-none" value={editBot.welcomeMessage ?? ''} onChange={(e) => setEditBot(p => ({ ...p, welcomeMessage: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-lux mb-2">Accent Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {ACCENT_COLORS.map((c) => (
                      <button key={c} onClick={() => setEditBot(p => ({ ...p, accentColor: c }))}
                        className={cn('w-8 h-8 rounded-full border-2 transition-all', editBot.accentColor === c ? 'border-ink-900 scale-110' : 'border-transparent')}
                        style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-lux mb-2">Import Website Knowledge</label>
                  <div className="flex gap-2">
                    <input type="url" value={importUrl} onChange={(e) => setImportUrl(e.target.value)} placeholder="https://example.com" className="flex-1 px-4 py-3 rounded-2xl border border-line-soft bg-white text-sm outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange" />
                    <LuxuryButton size="sm" onClick={handleImport} disabled={importing}>
                      {importing ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : 'Import'}
                    </LuxuryButton>
                  </div>
                </div>
                <LuxuryButton onClick={handleSaveBot} disabled={saving} className="w-full">
                  {saving ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : 'Save Design'}
                </LuxuryButton>
              </LuxuryCard>
            )}

            {activeTab === 'embed' && (
              <LuxuryCard className="p-6">
                <p className="text-sm text-slate-lux mb-4">Paste this snippet before the <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">&lt;/body&gt;</code> tag.</p>
                <div className="bg-ink-950 rounded-2xl p-4 mb-4">
                  <code className="text-xs text-brand-orange font-mono break-all">
                    {`<script src="https://cdn.agently.ai/widget.js" data-id="${activeChatbot?.id ?? 'YOUR_ID'}"></script>`}
                  </code>
                </div>
                <LuxuryButton onClick={copyToClipboard} className="w-full">
                  {copied ? <><CheckCircle2 className="h-4 w-4 mr-2 text-emerald-400" /> Copied!</> : <><Copy className="h-4 w-4 mr-2" /> Copy Embed Code</>}
                </LuxuryButton>
              </LuxuryCard>
            )}
          </div>

          {/* Right: Chat Preview */}
          <div className="lg:col-span-3">
            <LuxuryCard className="flex flex-col h-[600px]">
              {/* Chat header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-line-soft flex-shrink-0" style={{ backgroundColor: editBot.accentColor ?? activeChatbot?.accentColor ?? '#F05A25' }}>
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                  {(editBot.avatarLabel ?? activeChatbot?.avatarLabel ?? 'A')[0]}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{editBot.headerTitle ?? activeChatbot?.headerTitle ?? 'AI Assistant'}</p>
                  <p className="text-white/70 text-xs">Always online</p>
                </div>
                <button onClick={() => void handleResetConversation(activeChatbot?.id)} className="ml-auto p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                  <RefreshCw className="h-3.5 w-3.5 text-white" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {conversation.length === 0 && (
                  <div className="text-center py-6 text-slate-lux text-sm">
                    <p className="italic">{editBot.welcomeMessage ?? activeChatbot?.welcomeMessage ?? 'Hi there! How can I help you today?'}</p>
                  </div>
                )}
                {conversation.map((msg) => (
                  <div key={msg.id} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                    <div className={cn('max-w-[80%] px-4 py-3 rounded-2xl text-sm', msg.role === 'user' ? 'text-white' : 'bg-slate-100 text-ink-900')}
                      style={msg.role === 'user' ? { backgroundColor: editBot.accentColor ?? activeChatbot?.accentColor ?? '#F05A25' } : {}}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {sending && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 px-4 py-3 rounded-2xl">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSend} className="flex gap-2 p-4 border-t border-line-soft flex-shrink-0">
                <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder={editBot.placeholder ?? activeChatbot?.placeholder ?? 'Type a message...'}
                  className="flex-1 px-4 py-2.5 rounded-2xl border border-line-soft bg-white text-sm outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange" />
                <button type="submit" disabled={sending || !message.trim()} style={{ backgroundColor: editBot.accentColor ?? activeChatbot?.accentColor ?? '#F05A25' }}
                  className="p-2.5 rounded-2xl text-white disabled:opacity-40 transition-opacity">
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </LuxuryCard>
          </div>
        </div>
      )}
    </div>
  );
}
