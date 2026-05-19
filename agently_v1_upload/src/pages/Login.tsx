import * as React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Mail, Lock, ArrowRight, Sparkles, Globe, Zap } from 'lucide-react';
import { LuxuryButton } from '@/src/components/ui/LuxuryButton';
import { cn } from '@/src/lib/utils';

export default function Login() {
  const [isLogin, setIsLogin] = React.useState(true);
  const [useMagicLink, setUseMagicLink] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-pearl overflow-hidden">
      {/* Left Panel - Luxury Brand Area */}
      <div className="hidden lg:flex w-1/2 bg-ink-950 relative overflow-hidden flex-col p-16 justify-between border-r border-white/5">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-orange/10 rounded-full blur-[120px] -mr-96 -mt-96" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-orange/5 rounded-full blur-[100px] -ml-48 -mb-48" />
        
        {/* Animated Orb Component */}
        <div className="absolute inset-0 flex items-center justify-center opacity-40">
           <div className="relative h-96 w-96">
              <motion.div 
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 90, 180, 270, 360],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border border-brand-orange/30 rounded-full" 
              />
              <motion.div 
                animate={{ 
                  scale: [1.2, 1, 1.2],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 border border-brand-orange/20 rounded-full" 
              />
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="h-48 w-48 bg-brand-orange rounded-full blur-[60px] opacity-20 animate-pulse" />
              </div>
           </div>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-brand-orange flex items-center justify-center shadow-2xl shadow-brand-orange/40">
             <ShieldCheck className="h-7 w-7 text-white" />
          </div>
          <span className="text-2xl font-display font-semibold text-white tracking-tight">Agently</span>
        </div>

        <div className="relative z-10 space-y-12">
          <div className="space-y-6">
             <motion.h2 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               className="text-6xl font-display font-semibold text-white leading-tight tracking-tight"
             >
               Intelligent <br />
               <span className="text-brand-orange">Voice Ops</span> <br />
               for Business.
             </motion.h2>
             <p className="text-xl text-white/40 max-w-md font-light leading-relaxed">
               The enterprise command center for AI receptionists, chatbots, and automated outreach.
             </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
             {[
               { icon: Sparkles, label: 'High Fidelity', desc: 'Natural voice synthesis' },
               { icon: Globe, label: 'Multi-lingual', desc: '50+ languages supported' },
               { icon: Zap, label: 'Instant Deploy', desc: 'Live in under 5 minutes' },
               { icon: Lock, label: 'Enterprise Grade', desc: 'Secure & PCI compliant' },
             ].map((feature, i) => (
               <div key={i} className="space-y-2">
                  <div className="flex items-center gap-2 text-brand-orange font-bold text-[10px] uppercase tracking-widest">
                     <feature.icon className="h-3.3 w-3.3" />
                     {feature.label}
                  </div>
                  <p className="text-xs text-white/30 leading-relaxed">{feature.desc}</p>
               </div>
             ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-[10px] text-white/20 uppercase tracking-[0.3em] font-bold">
           <span>v2.4 Premium</span>
           <span>Agently Intelligence © 2026</span>
        </div>
      </div>

      {/* Right Panel - Auth Form Area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md space-y-10">
          <div className="space-y-3">
             <div className="h-12 w-12 rounded-xl bg-brand-orange flex items-center justify-center lg:hidden mb-6">
                <ShieldCheck className="h-7 w-7 text-white" />
             </div>
             <h1 className="text-3xl font-display font-semibold text-ink-950 tracking-tight">
               {isLogin ? 'Welcome Back' : 'Create Account'}
             </h1>
             <p className="text-slate-lux">
               {isLogin 
                 ? 'Enter your credentials to access your workspace.' 
                 : 'Start your 14-day premium trial today.'}
             </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex p-1 bg-slate-100 rounded-luxury">
            <button 
              onClick={() => setIsLogin(true)}
              className={cn(
                "flex-1 py-2 text-sm font-semibold rounded-luxury transition-all",
                isLogin ? "bg-white text-ink-950 shadow-sm" : "text-slate-lux hover:text-ink-950"
              )}
            >
              Sign In
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={cn(
                "flex-1 py-2 text-sm font-semibold rounded-luxury transition-all",
                !isLogin ? "bg-white text-ink-950 shadow-sm" : "text-slate-lux hover:text-ink-950"
              )}
            >
              Register
            </button>
          </div>

          <form className="space-y-6" onSubmit={(e) => { 
            e.preventDefault(); 
            // Simulated login transition
            const btn = e.currentTarget.querySelector('button[type="submit"]');
            if (btn) btn.setAttribute('disabled', 'true');
            setTimeout(() => {
              window.location.hash = '#/onboarding'; 
            }, 1000);
          }}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-lux px-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-lux/40" />
                  <input 
                    type="email" 
                    required
                    placeholder="name@company.com"
                    className="w-full h-14 pl-12 pr-4 bg-white border border-line-soft rounded-luxury focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange outline-none transition-all placeholder:text-slate-lux/30"
                  />
                </div>
              </div>

              {!useMagicLink && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-lux">Password</label>
                    {isLogin && <button type="button" className="text-[10px] font-bold text-brand-orange hover:text-brand-orange-600 transition-colors uppercase tracking-widest">Forgot?</button>}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-lux/40" />
                    <input 
                      type="password" 
                      required
                      placeholder="••••••••"
                      className="w-full h-14 pl-12 pr-4 bg-white border border-line-soft rounded-luxury focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange outline-none transition-all placeholder:text-slate-lux/30"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
               <LuxuryButton type="submit" className="w-full py-4 h-14 text-base shadow-xl shadow-brand-orange/10 group" variant="primary">
                 {isLogin ? 'Sign In to Workspace' : 'Create Secure ID'}
                 <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
               </LuxuryButton>

               <div className="relative py-2">
                 <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-line-soft" /></div>
                 <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold"><span className="bg-pearl px-4 text-slate-lux/40">Or Continue With</span></div>
               </div>

               <LuxuryButton 
                 type="button"
                 onClick={() => setUseMagicLink(!useMagicLink)}
                 variant="secondary" 
                 className="w-full h-14 border-line-soft hover:bg-slate-50"
                >
                 {useMagicLink ? 'Use Password instead' : 'Secure Magic Link'}
               </LuxuryButton>
            </div>
          </form>

          <p className="text-[10px] text-center text-slate-lux leading-relaxed max-w-[280px] mx-auto uppercase tracking-wider font-medium opacity-60">
             By continuing, you agree to Agently's 
             <a href="#" className="text-ink-950 font-bold mx-1">Terms</a> and 
             <a href="#" className="text-ink-950 font-bold mx-1">Privacy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
