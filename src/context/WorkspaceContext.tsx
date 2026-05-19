import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  AgentConfig,
  BusinessProfile,
  ChatMessage,
  ChatbotConfig,
  Lead,
  WorkspaceBootstrap,
} from '../types';
import { api } from '../services/api';
import { clearSessionToken, getSessionToken, setSessionToken } from '../services/session';
import { subscribeToOrgRealtime } from '../services/realtime';

interface WorkspaceContextType {
  workspace: WorkspaceBootstrap | null;
  isInitializing: boolean;
  showSimulator: boolean;
  setShowSimulator: (v: boolean) => void;
  handleLogin: (email: string, password: string) => Promise<void>;
  handleRegister: (payload: { name: string; companyName: string; email: string; password: string }) => Promise<void>;
  handleSendMagicLink: (email: string) => Promise<unknown>;
  handleVerifyMagicLink: (token: string) => Promise<void>;
  handleLogout: () => Promise<void>;
  refreshWorkspace: () => Promise<void>;
  handleGenerateFaqs: (website: string) => Promise<unknown[]>;
  handleOnboardingComplete: (profile: BusinessProfile, agent: AgentConfig) => Promise<void>;
  handleUpdateAgent: (updates: Partial<AgentConfig>) => Promise<void>;
  handleCreateVoiceAgent: (payload?: Partial<AgentConfig>) => Promise<void>;
  handleActivateVoiceAgent: (voiceAgentId: string) => Promise<void>;
  handleDeleteVoiceAgent: (voiceAgentId: string) => Promise<void>;
  handleUpdateRules: (ruleUpdates: Partial<AgentConfig['rules']>) => Promise<void>;
  handleAddFaq: () => Promise<void>;
  handleUpdateFaq: (faqId: string, updates: { question?: string; answer?: string }) => Promise<void>;
  handleRemoveFaq: (faqId: string) => Promise<void>;
  handleSyncFaqs: (website?: string) => Promise<void>;
  handleImportChatbotFaqs: (chatbotId: string, website: string) => Promise<void>;
  handleRestartAgent: () => Promise<void>;
  handleCreateChatbot: () => Promise<void>;
  handleUpdateChatbot: (chatbotId: string, updates: Partial<ChatbotConfig>) => Promise<void>;
  handleActivateChatbot: (chatbotId: string) => Promise<void>;
  handleDeleteChatbot: (chatbotId: string) => Promise<void>;
  handleSendMessage: (message: string, chatbotId?: string) => Promise<ChatMessage>;
  handleResetConversation: (chatbotId?: string) => Promise<void>;
  handleSimulatorFinished: (payload: {
    transcript: string;
    duration: number;
    outcome?: string;
    callerName?: string;
    callerPhone?: string;
    lead?: Partial<Lead>;
  }) => Promise<void>;
  handleUpdateLead: (leadId: string, updates: Partial<Lead>) => Promise<void>;
  handleCreateLead: (payload: Pick<Lead, 'name' | 'email' | 'phone' | 'reason'>) => Promise<void>;
  handleExportLeads: () => Promise<void>;
  handleDeleteLead: (leadId: string) => Promise<void>;
  handleBulkDeleteLeads: (leadIds: string[]) => Promise<void>;
  handleInviteMember: (email: string, role: 'Admin' | 'Viewer', name: string) => Promise<void>;
  handleRemoveMember: (memberId: string) => Promise<void>;
  handleUpdatePlan: (plan: 'Starter' | 'Pro') => Promise<void>;
  handleCancelPlan: () => Promise<void>;
  handleDownloadInvoice: (invoiceId: string) => Promise<void>;
  handleContactSales: () => Promise<void>;
  handleDownloadCallReport: (callId: string) => Promise<void>;
  handleSaveSettings: (settings: { timezone: string; phoneNumber: string }) => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [workspace, setWorkspace] = useState<WorkspaceBootstrap | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [showSimulator, setShowSimulator] = useState(false);

  const org = workspace?.organization ?? null;

  const applyWorkspace = (next: WorkspaceBootstrap) => setWorkspace(next);

  const loadWorkspace = async () => {
    const next = await api.bootstrap();
    applyWorkspace(next);
    return next;
  };

  useEffect(() => {
    const token = getSessionToken();
    if (!token) { setIsInitializing(false); return; }
    let mounted = true;
    (async () => {
      try {
        const next = await api.bootstrap();
        if (mounted) applyWorkspace(next);
      } catch {
        clearSessionToken();
        if (mounted) setWorkspace(null);
      } finally {
        if (mounted) setIsInitializing(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const realtimeDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!org?.id) return;
    const unsub = subscribeToOrgRealtime(org.id, {
      onAny: () => {
        if (realtimeDebounceRef.current) clearTimeout(realtimeDebounceRef.current);
        realtimeDebounceRef.current = setTimeout(() => void refreshWorkspace(), 1200);
      },
    });
    return () => {
      unsub();
      if (realtimeDebounceRef.current) clearTimeout(realtimeDebounceRef.current);
    };
  }, [org?.id]);

  const handleLogin = async (email: string, password: string) => {
    const res = await api.login(email, password);
    setSessionToken(res.token);
    await loadWorkspace();
  };

  const handleRegister = async (payload: { name: string; companyName: string; email: string; password: string }) => {
    const res = await api.register(payload);
    setSessionToken(res.token);
    await loadWorkspace();
  };

  const handleSendMagicLink = (email: string) => api.sendMagicLink(email);

  const handleVerifyMagicLink = async (token: string) => {
    const res = await api.verifyMagicLink(token);
    setSessionToken(res.token);
    await loadWorkspace();
  };

  const handleLogout = async () => {
    try { if (getSessionToken()) await api.logout(); } catch {}
    finally { clearSessionToken(); setWorkspace(null); setShowSimulator(false); }
  };

  const refreshWorkspace = async () => { await loadWorkspace(); };

  const requireOrg = () => {
    if (!workspace || !org) throw new Error('Workspace not ready');
    return { workspace, org };
  };

  const handleGenerateFaqs = async (website: string) => api.generateOnboardingFaqs(website);

  const handleOnboardingComplete = async (profile: BusinessProfile, agent: AgentConfig) => {
    await api.completeOnboarding(profile, agent);
    await refreshWorkspace();
  };

  const handleUpdateAgent = async (updates: Partial<AgentConfig>) => {
    await api.updateAgent(updates);
    await refreshWorkspace();
  };

  const handleCreateVoiceAgent = async (payload?: Partial<AgentConfig>) => {
    await api.createVoiceAgent(payload);
    await refreshWorkspace();
  };

  const handleActivateVoiceAgent = async (id: string) => {
    await api.activateVoiceAgent(id);
    await refreshWorkspace();
  };

  const handleDeleteVoiceAgent = async (id: string) => {
    await api.deleteVoiceAgent(id);
    await refreshWorkspace();
  };

  const handleUpdateRules = async (ruleUpdates: Partial<AgentConfig['rules']>) => {
    const { org: currentOrg } = requireOrg();
    await api.updateAgent({ rules: { ...currentOrg.agent.rules, ...ruleUpdates } });
    await refreshWorkspace();
  };

  const handleAddFaq = async () => {
    await api.createFaq('New FAQ question', 'Add the answer your agent should use.');
    await refreshWorkspace();
  };

  const handleUpdateFaq = async (id: string, updates: { question?: string; answer?: string }) => {
    await api.updateFaq(id, updates);
    await refreshWorkspace();
  };

  const handleRemoveFaq = async (id: string) => {
    await api.removeFaq(id);
    await refreshWorkspace();
  };

  const handleSyncFaqs = async (website?: string) => {
    const { org: currentOrg } = requireOrg();
    await api.syncFaqs(website || currentOrg.profile.website);
    await refreshWorkspace();
  };

  const handleImportChatbotFaqs = async (chatbotId: string, website: string) => {
    await api.importChatbotWebsite(chatbotId, website);
    await refreshWorkspace();
  };

  const handleRestartAgent = async () => {
    const res = await api.restartAgent();
    window.alert(res.message);
  };

  const handleCreateChatbot = async () => {
    await api.createChatbot();
    await refreshWorkspace();
  };

  const handleUpdateChatbot = async (id: string, updates: Partial<ChatbotConfig>) => {
    await api.updateChatbot(id, updates);
    await refreshWorkspace();
  };

  const handleActivateChatbot = async (id: string) => {
    await api.activateChatbot(id);
    await refreshWorkspace();
  };

  const handleDeleteChatbot = async (id: string) => {
    await api.deleteChatbot(id);
    await refreshWorkspace();
  };

  const handleSendMessage = async (message: string, chatbotId?: string): Promise<ChatMessage> => {
    const res = await api.sendMessengerMessage(message, chatbotId);
    setWorkspace(ws => ws ? { ...ws, conversation: res.conversation } : ws);
    return res.assistantMessage;
  };

  const handleResetConversation = async (chatbotId?: string) => {
    const res = await api.resetMessenger(chatbotId);
    setWorkspace(ws => ws ? { ...ws, conversation: res.conversation } : ws);
  };

  const handleSimulatorFinished = async (payload: {
    transcript: string; duration: number; outcome?: string;
    callerName?: string; callerPhone?: string; lead?: Partial<Lead>;
  }) => {
    await api.simulateCall(payload);
    await refreshWorkspace();
  };

  const handleUpdateLead = async (id: string, updates: Partial<Lead>) => {
    await api.updateLead(id, updates);
  };

  const handleCreateLead = async (payload: Pick<Lead, 'name' | 'email' | 'phone' | 'reason'>) => {
    await api.createLead(payload);
    await refreshWorkspace();
  };

  const handleExportLeads = async () => { await api.exportLeadsCsv(); };

  const handleDeleteLead = async (id: string) => {
    await (api as any).deleteLead(id);
    await refreshWorkspace();
  };

  const handleBulkDeleteLeads = async (ids: string[]) => {
    await (api as any).bulkDeleteLeads(ids);
    await refreshWorkspace();
  };

  const handleInviteMember = async (email: string, role: 'Admin' | 'Viewer', name: string) => {
    await api.inviteMember(email, role, name);
    await refreshWorkspace();
  };

  const handleRemoveMember = async (id: string) => {
    await api.removeMember(id);
    await refreshWorkspace();
  };

  const handleUpdatePlan = async (plan: 'Starter' | 'Pro') => {
    await api.updatePlan(plan);
    await refreshWorkspace();
  };

  const handleCancelPlan = async () => {
    await api.cancelPlan();
    await refreshWorkspace();
  };

  const handleDownloadInvoice = async (id: string) => { await api.downloadInvoice(id); };

  const handleContactSales = async () => {
    const { workspace: ws } = requireOrg();
    await api.submitContactSales({
      name: ws.user.name,
      email: ws.user.email,
      companyName: ws.organization.profile.name,
      expectedVolume: `${ws.organization.subscription.usage.calls} monthly calls`,
      message: `Interested in a custom SaaS plan for ${ws.organization.profile.name}.`,
    });
    window.alert('Sales inquiry sent successfully.');
  };

  const handleDownloadCallReport = async (callId: string) => { await api.downloadCallReport(callId); };

  const handleSaveSettings = async (settings: { timezone: string; phoneNumber: string }) => {
    const saved = await api.updateSettings(settings);
    setWorkspace(ws => {
      if (!ws) return ws;
      return {
        ...ws,
        organization: {
          ...ws.organization,
          settings: { ...ws.organization.settings, ...saved },
          profile: { ...ws.organization.profile, timezone: saved.timezone || ws.organization.profile.timezone },
          phoneNumber: saved.phoneNumber ?? ws.organization.phoneNumber,
        },
      };
    });
    await refreshWorkspace();
  };

  return (
    <WorkspaceContext.Provider value={{
      workspace, isInitializing, showSimulator, setShowSimulator,
      handleLogin, handleRegister, handleSendMagicLink, handleVerifyMagicLink, handleLogout,
      refreshWorkspace, handleGenerateFaqs, handleOnboardingComplete, handleUpdateAgent,
      handleCreateVoiceAgent, handleActivateVoiceAgent, handleDeleteVoiceAgent, handleUpdateRules,
      handleAddFaq, handleUpdateFaq, handleRemoveFaq, handleSyncFaqs, handleImportChatbotFaqs,
      handleRestartAgent, handleCreateChatbot, handleUpdateChatbot, handleActivateChatbot,
      handleDeleteChatbot, handleSendMessage, handleResetConversation, handleSimulatorFinished,
      handleUpdateLead, handleCreateLead, handleExportLeads, handleDeleteLead, handleBulkDeleteLeads,
      handleInviteMember, handleRemoveMember, handleUpdatePlan, handleCancelPlan,
      handleDownloadInvoice, handleContactSales, handleDownloadCallReport, handleSaveSettings,
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error('useWorkspace must be used within WorkspaceProvider');
  return ctx;
}
