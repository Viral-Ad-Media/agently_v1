import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Building2, BrainCircuit, BookOpen, UserCircle, Rocket, ChevronRight, ChevronLeft, Globe, Plus, Trash2, CheckCircle2, Sparkles } from 'lucide-react';
import { LuxuryButton } from '@/src/components/ui/LuxuryButton';
import { LuxuryCard } from '@/src/components/ui/LuxuryCard';
import { cn } from '@/src/lib/utils';
import { useWorkspace } from '@/src/context/WorkspaceContext';
import { BusinessProfile, AgentConfig, FAQ } from '@/src/types';

const steps = [
  { id: 'business', title: 'Your Business', icon: Building2 },
  { id: 'training', title: 'Training Agent', icon: BrainCircuit },
  { id: 'kb', title: 'Knowledge Base', icon: BookOpen },
  { id: 'persona', title: 'Agent Persona', icon: UserCircle },
  { id: 'deploy', title: 'Ready to Deploy', icon: Rocket },
];

const INDUSTRIES = [
  'Accounting & Bookkeeping','Architecture','Auto Repair & Mechanic','Barbershop & Hair Salon','Beauty & Wellness',
  'Cleaning Services','Construction & Contracting','Consulting','Dental Practice','E-commerce','Education & Tutoring',
  'Electrical Services','Event Planning','Financial Services','Fitness & Gym','Food & Restaurant','Freight & Logistics',
  'Healthcare & Medical','Home Services','Hotel & Hospitality','HVAC Services','Insurance','Interior Design',
  'IT & Technology','Landscaping & Lawn Care','Legal / Law Firm','Manufacturing','Marketing Agency','Mortgage & Lending',
  'Moving Services','Non-Profit','Pest Control','Pet Services','Photography','Physiotherapy','Plumbing',
  'Property Management','Real Estate','Recruitment','Roofing','SaaS / Software','Security Services','Solar Energy',
  'Spa & Skincare','Transportation','Travel Agency','Veterinary','Wedding Services','Other',
];

const TONE_OPTIONS = [
  { id: 'Professional' as const, desc: 'Precise & formal' },
  { id: 'Friendly' as const, desc: 'Warm & bubbly' },
  { id: 'Empathetic' as const, desc: 'Caring & patient' },
];

interface NominatimResult { place_id: number; display_name: string; }

export default function Onboarding() {
  const navigate = useNavigate();
  const { handleGenerateFaqs, handleOnboardingComplete } = useWorkspace();
  const [step, setStep] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const [profile, setProfile] = React.useState<BusinessProfile>({
    name: '', industry: '', website: '', location: '', onboarded: false,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  });

  const [agent, setAgent] = React.useState<AgentConfig>({
    id: 'voice_agent_onboarding', name: 'Maya', direction: 'inbound',
    twilioPhoneNumber: '', twilioPhoneSid: '', voice: 'Rachel', language: 'English',
    greeting: '', tone: 'Professional', businessHours: '9:00 AM - 5:00 PM', faqs: [],
    escalationPhone: '', voicemailFallback: true, isActive: false,
    dataCaptureFields: ['name', 'phone', 'email', 'reason'],
    rules: { autoBook: false, autoEscalate: true, captureAllLeads: true },
  });

  const [hours, setHours] = React.useState({ start: '09:00', end: '17:00' });
  const [industrySearch, setIndustrySearch] = React.useState('');
  const [industryOpen, setIndustryOpen] = React.useState(false);
  const [citySearch, setCitySearch] = React.useState('');
  const [citySuggestions, setCitySuggestions] = React.useState<NominatimResult[]>([]);
  const [cityOpen, setCityOpen] = React.useState(false);
  const industryRef = React.useRef<HTMLDivElement>(null);
  const cityDebounce = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    const biz = profile.name || 'our business';
    const agentN = agent.name || 'Maya';
    setAgent((a) => ({ ...a, greeting: `Hello, thank you for calling ${biz}! This is ${agentN}. How can I help you today?` }));
  }, [agent.name, profile.name]);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (industryRef.current && !industryRef.current.contains(e.target as Node)) setIndustryOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  React.useEffect(() => {
    if (citySearch.length < 3) { setCitySuggestions([]); setCityOpen(false); return; }
    if (cityDebounce.current) clearTimeout(cityDebounce.current);
    cityDebounce.current = setTimeout(async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(citySearch)}&format=json&limit=6&addressdetails=1`, { headers: { 'User-Agent': 'AgentlyOnboarding/1.0' } });
        const data = await res.json();
        if (Array.isArray(data)) { setCitySuggestions(data); setCityOpen(data.length > 0); }
      } catch {}
    }, 400);
  }, [citySearch]);

  const filteredIndustries = INDUSTRIES.filter((i) => i.toLowerCase().includes(industrySearch.toLowerCase()));

  const handleNext = async () => {
    setError('');
    try {
      if (step === 1) {
        setLoading(true);
        const generated = await handleGenerateFaqs(profile.website.trim()) as FAQ[];
        setAgent((a) => ({ ...a, faqs: generated.slice(0, 5) }));
        setStep(2);
      } else if (step === 4) {
        setLoading(true);
        await handleOnboardingComplete(profile, { ...agent, businessHours: `${hours.start} - ${hours.end}` });
        navigate('/dashboard');
      } else {
        setStep((s) => s + 1);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to continue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleField = (field: string) => {
    setAgent((a) => ({
      ...a,
      dataCaptureFields: a.dataCaptureFields.includes(field)
        ? a.dataCaptureFields.filter((f) => f !== field)
        : [...a.dataCaptureFields, field],
    }));
  };

  const inp = 'w-full px-5 py-4 rounded-2xl border border-line-soft bg-white focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none transition-all font-medium text-base text-ink-900 placeholder:text-slate-lux/40';

  return (
    <div className="min-h-screen bg-pearl flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center gap-2 justify-center mb-6">
            <span className="p-1 px-2.5 rounded-full bg-brand-orange-soft text-brand-orange text-[10px] font-bold uppercase tracking-widest border border-brand-orange/20 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3" /> Setup Wizard
            </span>
          </div>
          <h1 className="text-4xl font-display font-semibold text-ink-950 tracking-tight">
            Configure Your Workspace
          </h1>
          <p className="text-slate-lux mt-2">Deploy your AI concierge in under 5 minutes.</p>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {steps.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className={cn('flex items-center gap-2 flex-shrink-0 px-3 py-2 rounded-luxury text-xs font-semibold transition-all', step === i ? 'bg-brand-orange text-white' : step > i ? 'bg-brand-orange/10 text-brand-orange' : 'bg-white text-slate-lux border border-line-soft')}>
                {step > i ? <CheckCircle2 className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
                <span className="hidden sm:inline">{s.title}</span>
              </div>
              {i < steps.length - 1 && <div className={cn('h-px flex-1 min-w-[16px]', step > i ? 'bg-brand-orange' : 'bg-line-soft')} />}
            </React.Fragment>
          ))}
        </div>

        {/* Progress bar */}
        <div className="h-1.5 w-full bg-line-soft rounded-full mb-8 overflow-hidden">
          <motion.div animate={{ width: `${((step + 1) / steps.length) * 100}%` }} className="h-full bg-brand-orange rounded-full" transition={{ duration: 0.5 }} />
        </div>

        <LuxuryCard className="p-8 md:p-10">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>

              {/* Step 0: Business */}
              {step === 0 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-display font-semibold text-ink-950">Your Business</h2>
                    <p className="text-slate-lux mt-1">Tell us about your workplace.</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-lux mb-2">Company Name</label>
                      <input type="text" placeholder="e.g. Bright Path Dental" className={inp} value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} />
                    </div>
                    <div ref={industryRef}>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-lux mb-2">Industry</label>
                      <div className="relative">
                        <input type="text" placeholder={profile.industry || 'Search industry...'} className={inp + ' cursor-pointer'}
                          value={industryOpen ? industrySearch : profile.industry || ''}
                          onFocus={() => { setIndustryOpen(true); setIndustrySearch(''); }}
                          onChange={(e) => { setIndustrySearch(e.target.value); setIndustryOpen(true); }}
                        />
                        {industryOpen && (
                          <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-line-soft rounded-2xl shadow-xl max-h-52 overflow-y-auto">
                            {filteredIndustries.map((ind) => (
                              <button key={ind} type="button" onClick={() => { setProfile((p) => ({ ...p, industry: ind })); setIndustryOpen(false); setIndustrySearch(''); }}
                                className={cn('w-full text-left px-4 py-2.5 text-sm hover:bg-brand-orange-soft transition-colors', profile.industry === ind ? 'font-bold text-brand-orange bg-brand-orange-soft' : 'text-ink-900')}
                              >{ind}</button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="relative">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-lux mb-2">City / Location</label>
                      <input type="text" placeholder="e.g. Lagos, Nigeria" className={inp}
                        value={citySearch || profile.location}
                        onChange={(e) => { setCitySearch(e.target.value); setProfile((p) => ({ ...p, location: e.target.value })); }}
                        onFocus={() => citySearch.length >= 3 && setCityOpen(true)}
                      />
                      {cityOpen && citySuggestions.length > 0 && (
                        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-line-soft rounded-2xl shadow-xl max-h-52 overflow-y-auto">
                          {citySuggestions.map((city) => (
                            <button key={city.place_id} type="button" onClick={() => { const d = city.display_name.split(',')[0]; setProfile((p) => ({ ...p, location: d })); setCitySearch(d); setCityOpen(false); }}
                              className="w-full text-left px-4 py-2.5 text-sm hover:bg-brand-orange-soft text-ink-900 transition-colors"
                            >{city.display_name}</button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-lux mb-2">Website <span className="text-slate-lux/40">(for AI training)</span></label>
                      <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-lux/40" />
                        <input type="url" placeholder="https://yourwebsite.com" className={inp + ' pl-12'} value={profile.website} onChange={(e) => setProfile((p) => ({ ...p, website: e.target.value }))} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Training */}
              {step === 1 && (
                <div className="space-y-6 text-center">
                  <div className="w-20 h-20 rounded-[2rem] bg-brand-orange/10 flex items-center justify-center mx-auto">
                    <BrainCircuit className="h-10 w-10 text-brand-orange" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-semibold text-ink-950">Training Your Agent</h2>
                    <p className="text-slate-lux mt-1">We'll scan your website to build the knowledge base.</p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-5 text-left border border-line-soft">
                    <p className="text-xs font-bold text-slate-lux uppercase tracking-widest mb-2">Website to scan:</p>
                    <p className="text-sm text-ink-900 font-mono break-all">{profile.website || 'Not set — will skip'}</p>
                  </div>
                  <p className="text-sm text-slate-lux">Click <strong>Next</strong> to scan and auto-generate FAQs (~10 seconds).</p>
                </div>
              )}

              {/* Step 2: Knowledge Base */}
              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-2xl font-display font-semibold text-ink-950">Knowledge Base</h2>
                    <p className="text-slate-lux mt-1">Review the FAQs your agent will know.</p>
                  </div>
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {agent.faqs.length === 0 ? (
                      <div className="text-center py-8 text-slate-lux text-sm">No FAQs generated — you can add them later in Agent Settings.</div>
                    ) : (
                      agent.faqs.map((faq, i) => (
                        <div key={faq.id} className="rounded-2xl border border-line-soft bg-slate-50 p-4 space-y-2">
                          <input type="text" value={faq.question}
                            onChange={(e) => setAgent((a) => ({ ...a, faqs: a.faqs.map((f, j) => j === i ? { ...f, question: e.target.value } : f) }))}
                            className="w-full text-sm font-bold bg-transparent outline-none border-b border-line-soft pb-1 focus:border-brand-orange text-ink-900"
                          />
                          <textarea rows={2} value={faq.answer}
                            onChange={(e) => setAgent((a) => ({ ...a, faqs: a.faqs.map((f, j) => j === i ? { ...f, answer: e.target.value } : f) }))}
                            className="w-full text-sm bg-transparent outline-none resize-none text-slate-lux"
                          />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Agent Persona */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-display font-semibold text-ink-950">Agent Persona</h2>
                    <p className="text-slate-lux mt-1">Configure how your AI receptionist sounds.</p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-lux mb-2">Agent Name</label>
                    <input type="text" className={inp} value={agent.name} onChange={(e) => setAgent((a) => ({ ...a, name: e.target.value }))} />
                  </div>
                  <div className="bg-ink-950 rounded-2xl p-4 text-white text-sm">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1.5">Live Greeting Preview</p>
                    <p className="italic text-white/80">{agent.greeting}</p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-lux mb-3">Communication Tone</label>
                    <div className="grid grid-cols-3 gap-3">
                      {TONE_OPTIONS.map((t) => (
                        <button key={t.id} type="button" onClick={() => setAgent((a) => ({ ...a, tone: t.id }))}
                          className={cn('p-4 rounded-2xl border-2 transition-all text-center', agent.tone === t.id ? 'border-brand-orange bg-brand-orange-soft text-brand-orange' : 'border-line-soft bg-white text-slate-lux hover:border-brand-orange/30')}
                        >
                          <p className="font-bold text-sm">{t.id}</p>
                          <p className="text-[10px] mt-0.5 opacity-70">{t.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-lux mb-2">Open</label>
                      <input type="time" className={inp} value={hours.start} onChange={(e) => setHours((h) => ({ ...h, start: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-lux mb-2">Close</label>
                      <input type="time" className={inp} value={hours.end} onChange={(e) => setHours((h) => ({ ...h, end: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-lux mb-2">Capture from callers</label>
                    <div className="flex flex-wrap gap-2">
                      {['name', 'phone', 'email', 'reason', 'budget', 'timeline'].map((f) => (
                        <button key={f} type="button" onClick={() => toggleField(f)}
                          className={cn('px-4 py-2 rounded-full border-2 text-xs font-bold uppercase tracking-wider transition-all', agent.dataCaptureFields.includes(f) ? 'border-brand-orange bg-brand-orange-soft text-brand-orange' : 'border-line-soft text-slate-lux hover:border-brand-orange/30')}
                        >
                          {agent.dataCaptureFields.includes(f) && '✓ '}{f}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Deploy */}
              {step === 4 && (
                <div className="space-y-6 text-center">
                  <div className="w-20 h-20 bg-brand-orange rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-brand-orange/20">
                    <Rocket className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-semibold text-ink-950">Ready to Deploy!</h2>
                    <p className="text-slate-lux mt-1">Your AI agent is configured and ready.</p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-6 text-left space-y-4 border border-line-soft">
                    {[['Business', profile.name], ['Industry', profile.industry || '—'], ['Agent', agent.name], ['Tone', agent.tone], ['Hours', `${hours.start} – ${hours.end}`], ['FAQs', `${agent.faqs.length} entries`]].map(([k, v]) => (
                      <div key={k} className="flex justify-between items-center border-b border-line-soft pb-3 last:border-0 last:pb-0">
                        <span className="text-[10px] font-bold text-slate-lux uppercase tracking-widest">{k}</span>
                        <span className="font-semibold text-ink-950 text-sm">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

          {/* Error */}
          {error && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          {/* Nav */}
          <div className="mt-8 flex gap-3">
            {step > 0 && (
              <LuxuryButton variant="secondary" onClick={() => setStep((s) => s - 1)} disabled={loading} className="flex-1">
                <ChevronLeft className="h-4 w-4 mr-1" /> Back
              </LuxuryButton>
            )}
            <LuxuryButton onClick={handleNext} disabled={loading} className="flex-[2]">
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  {step === 4 ? 'Launch Agent' : 'Continue'}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              )}
            </LuxuryButton>
          </div>
        </LuxuryCard>
      </div>
    </div>
  );
}
