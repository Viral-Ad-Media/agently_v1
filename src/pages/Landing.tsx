import * as React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ArrowRight, Mic2, MessageSquare, Zap, Target, BarChart3, Globe2, ChevronRight, Play } from 'lucide-react';
import { LuxuryButton } from '@/src/components/ui/LuxuryButton';
import { LuxuryCard } from '@/src/components/ui/LuxuryCard';
import { cn } from '@/src/lib/utils';

export default function Landing({ section }: { section?: string }) {
  // Navigation scroll logic placeholder
  React.useEffect(() => {
    if (section) {
      const element = document.getElementById(section);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  }, [section]);

  return (
    <div className="bg-pearl selection:bg-brand-orange-soft selection:text-brand-orange-600 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-20 bg-pearl/80 backdrop-blur-md border-b border-line-soft">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-brand-orange flex items-center justify-center shadow-lg shadow-brand-orange/20">
               <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-display font-semibold text-ink-950 tracking-tight">Agently</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'Pricing', 'About', 'FAQs'].map((item) => (
              <a key={item} href={`#/${item.toLowerCase()}`} className="text-sm font-semibold text-slate-lux hover:text-ink-950 transition-colors uppercase tracking-[0.15em]">
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <a href="#/login" className="text-sm font-bold text-ink-950 px-4 py-2 hover:opacity-70 transition-opacity uppercase tracking-widest">Sign In</a>
            <LuxuryButton onClick={() => window.location.hash = '#/login'} size="sm" className="hidden sm:flex">
              Start Free Trial
            </LuxuryButton>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-40 overflow-hidden">
        {/* Abstract Cinematic Background */}
        <div className="absolute inset-0 pointer-events-none">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[1400px] bg-brand-orange/5 rounded-full blur-[160px]" />
           <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-orange/10 rounded-full blur-[120px] -mr-48 -mt-48" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
           <div className="max-w-4xl">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ink-950 text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-8"
              >
                 <Zap className="h-3 w-3 text-brand-orange fill-brand-orange" />
                 Next Gen Intelligence v2.0
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-6xl md:text-8xl font-display font-semibold tracking-tight text-ink-950 leading-[0.9] mb-8"
              >
                Intelligent <br />
                <span className="text-brand-orange italic font-light">Concierge Ops</span> <br />
                for Global Teams.
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl md:text-2xl text-slate-lux max-w-2xl leading-relaxed font-light mb-12"
              >
                The executive command center for ultra-reliable AI receptionists and chatbots. Premium voice synthesis meets enterprise-grade logic.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-6"
              >
                 <LuxuryButton size="lg" className="w-full sm:w-auto h-16 px-10 group" onClick={() => window.location.hash = '#/login'}>
                    Deploy Now 
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                 </LuxuryButton>
                 <button className="flex items-center gap-3 px-6 py-4 text-ink-950 font-bold uppercase tracking-widest hover:text-brand-orange transition-colors group">
                    <div className="h-10 w-10 rounded-full border border-line-soft flex items-center justify-center group-hover:border-brand-orange">
                       <Play className="h-4 w-4 fill-current" />
                    </div>
                    Watch Cinema
                 </button>
              </motion.div>
           </div>
        </div>

        {/* Floating Visual Motif - Abstract Command Center */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden xl:block translate-x-24">
           <div className="relative">
              <LuxuryCard variant="ink" className="w-[500px] h-[600px] rotate-[-5deg] shadow-2xl relative overflow-hidden flex flex-col p-10">
                 <div className="flex items-center gap-4 mb-8">
                    <div className="h-3 w-3 rounded-full bg-rose-500" />
                    <div className="h-3 w-3 rounded-full bg-amber-500" />
                    <div className="h-3 w-3 rounded-full bg-emerald-500" />
                 </div>
                 
                 <div className="space-y-6">
                    <div className="h-px w-full bg-white/10" />
                    <div className="flex items-center justify-between">
                       <div className="space-y-1">
                          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Inbound Channel</p>
                          <h4 className="text-xl text-white font-medium">Global Receptionist</h4>
                       </div>
                       <Mic2 className="text-brand-orange h-6 w-6" />
                    </div>
                    <div className="flex items-end gap-1 h-32 px-4">
                       {[...Array(20)].map((_, i) => (
                         <motion.div 
                           key={i}
                           animate={{ height: [20, 60, 30, 80, 40][i % 5] }}
                           transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse', delay: i * 0.1 }}
                           className="flex-1 bg-brand-orange/40 rounded-full" 
                         />
                       ))}
                    </div>
                    <div className="space-y-3">
                       <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                          <div className="flex justify-between text-xs mb-2">
                             <span className="text-white/40">Knowledge Base Sync</span>
                             <span className="text-emerald-400">Stable</span>
                          </div>
                          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                             <div className="h-full w-4/5 bg-emerald-400" />
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Cinematic Glow */}
                 <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-brand-orange/20 to-transparent pointer-events-none" />
              </LuxuryCard>

              <LuxuryCard variant="glass" className="absolute -left-32 -bottom-20 w-[300px] p-6 shadow-2xl rotate-[3deg]">
                 <div className="flex items-center gap-4 mb-4">
                    <div className="h-10 w-10 rounded-full bg-brand-orange/10 flex items-center justify-center">
                       <Zap className="h-5 w-5 text-brand-orange" />
                    </div>
                    <div>
                       <p className="text-[10px] font-bold text-slate-lux uppercase">Latency</p>
                       <p className="text-lg font-display font-semibold text-ink-950">240ms</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span className="text-xs text-slate-lux">Ultra-fast synthesis active</span>
                 </div>
              </LuxuryCard>
           </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 border-t border-line-soft">
         <div className="max-w-7xl mx-auto px-6">
            <p className="text-center text-[10px] font-bold text-slate-lux/40 uppercase tracking-[0.4em] mb-12">Trusted by Enterprise Orgs</p>
            <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-30 grayscale contrast-200">
               <span className="text-2xl font-display font-bold">SIRONA</span>
               <span className="text-2xl font-display font-bold">VERTEX</span>
               <span className="text-2xl font-display font-bold">ALTOS</span>
               <span className="text-2xl font-display font-bold">ZEPHYR</span>
               <span className="text-2xl font-display font-bold">NOVA</span>
            </div>
         </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 bg-ivory">
         <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-xl mb-20 space-y-4">
               <h2 className="text-4xl md:text-5xl font-display font-semibold text-ink-950 tracking-tight leading-tight">
                  Premium Tools for <br />
                  <span className="text-brand-orange italic font-light">AI Voice Professionals.</span>
               </h2>
               <p className="text-slate-lux text-lg leading-relaxed">
                  Everything you need to deploy, monitor, and scale your AI workforce across voice and text.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {[
                  { icon: Mic2, title: 'Voice Agents', desc: 'Native high-fidelity voice synthesis with OpenAI and ElevenLabs integration.' },
                  { icon: MessageSquare, title: 'Intelligent Chat', desc: 'Omnichannel chatbots with shared knowledge bases and CRM sync.' },
                  { icon: Target, title: 'Outreach Pro', desc: 'Batch and recurring campaign scheduling for warm leads and follow-ups.' },
                  { icon: BarChart3, title: 'Real-time Analytics', desc: 'Executive dashboard for call intelligence, transcripts, and summaries.' },
                  { icon: Globe2, title: 'Global Presence', desc: 'Phone numbers in 50+ countries with search and instant provisioning.' },
                  { icon: ShieldCheck, title: 'Data Security', desc: 'Enterprise-grade encryption and PII protection for sensitive calls.' },
               ].map((feature, i) => (
                  <LuxuryCard key={i} padding="lg" className="group hover:border-brand-orange/40 transition-colors">
                     <div className="h-14 w-14 rounded-2xl bg-ink-950 text-white flex items-center justify-center mb-6 group-hover:bg-brand-orange transition-colors">
                        <feature.icon className="h-6 w-6" />
                     </div>
                     <h3 className="text-xl font-display font-semibold text-ink-950 mb-3">{feature.title}</h3>
                     <p className="text-slate-lux text-sm leading-relaxed mb-6">{feature.desc}</p>
                     <button className="flex items-center gap-2 text-xs font-black text-ink-950 uppercase tracking-widest hover:text-brand-orange transition-colors">
                        Explore Mode
                        <ChevronRight className="h-3 w-3" />
                     </button>
                  </LuxuryCard>
               ))}
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-ink-950 text-white py-24">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-20 border-b border-white/5 pb-20">
               <div className="col-span-2 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-brand-orange flex items-center justify-center shadow-lg shadow-brand-orange/20">
                       <ShieldCheck className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-2xl font-display font-semibold text-white tracking-tight">Agently</span>
                  </div>
                  <p className="text-white/40 text-sm max-w-xs leading-relaxed">
                     The global standard for premium AI concierge operations. Scalable, secure, and intelligent.
                  </p>
               </div>
               
               <div className="space-y-6">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-brand-orange">Product</h4>
                  <ul className="space-y-4 text-sm text-white/40">
                     <li><a href="#" className="hover:text-white transition-colors">Voice Agents</a></li>
                     <li><a href="#" className="hover:text-white transition-colors">Messenger</a></li>
                     <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                  </ul>
               </div>

               <div className="space-y-6">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-brand-orange">Company</h4>
                  <ul className="space-y-4 text-sm text-white/40">
                     <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                     <li><a href="#/contact" className="hover:text-white transition-colors">Contact</a></li>
                     <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                  </ul>
               </div>

               <div className="space-y-6">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-brand-orange">Legal</h4>
                  <ul className="space-y-4 text-sm text-white/40">
                     <li><a href="#/terms" className="hover:text-white transition-colors">Terms</a></li>
                     <li><a href="#/privacy" className="hover:text-white transition-colors">Privacy</a></li>
                     <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
                  </ul>
               </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-[0.2em] font-bold text-white/20">
               <span>Agently Intelligence © 2026</span>
               <div className="flex items-center gap-8">
                  <span>Twitter</span>
                  <span>LinkedIn</span>
                  <span>GitHub</span>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
}

// Internal reusable CheckCircle icon
function CheckCircle2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}
