import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  BrainCircuit, 
  BookOpen, 
  UserCircle, 
  Rocket, 
  ChevronRight, 
  ChevronLeft,
  Search,
  Globe,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { LuxuryButton } from '@/src/components/ui/LuxuryButton';
import { LuxuryCard } from '@/src/components/ui/LuxuryCard';
import { cn } from '@/src/lib/utils';

const steps = [
  { id: 'business', title: 'Your Business', icon: Building2 },
  { id: 'training', title: 'Training Agent', icon: BrainCircuit },
  { id: 'kb', title: 'Knowledge Base', icon: BookOpen },
  { id: 'persona', title: 'Agent Persona', icon: UserCircle },
  { id: 'deploy', title: 'Ready to Deploy', icon: Rocket },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [direction, setDirection] = React.useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    } else {
       window.location.hash = '#/dashboard';
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepId = steps[currentStep].id;

  return (
    <div className="min-h-screen bg-pearl flex flex-col items-center justify-center p-6 pb-24 md:pb-6">
      {/* Background Decorative Element */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[100px] -mr-48 -mt-48" />
         <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-orange/5 rounded-full blur-[80px] -ml-40 -mb-40" />
      </div>

      <div className="max-w-4xl w-full relative z-10 flex flex-col md:flex-row gap-12 items-start">
        {/* Progress Rail - Desktop */}
        <div className="hidden md:flex flex-col gap-10 w-64 pt-6">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center gap-4 group">
               <div className={cn(
                 "relative h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-500",
                 i <= currentStep ? "bg-brand-orange text-white shadow-lg shadow-brand-orange/20" : "bg-white text-slate-lux border border-line-soft"
               )}>
                  <step.icon className="h-5 w-5" />
                  {i < currentStep && (
                    <div className="absolute -right-1 -top-1 bg-emerald-500 rounded-full p-0.5 border-2 border-pearl">
                       <CheckCircle2 className="h-2 w-2 text-white" />
                    </div>
                  )}
               </div>
               <div>
                  <p className={cn(
                    "text-[10px] font-bold uppercase tracking-widest mb-0.5 transition-colors",
                    i <= currentStep ? "text-brand-orange" : "text-slate-lux/40"
                  )}>Step 0{i + 1}</p>
                  <p className={cn(
                    "text-sm font-semibold transition-colors",
                    i === currentStep ? "text-ink-950" : "text-slate-lux group-hover:text-ink-950"
                  )}>{step.title}</p>
               </div>
            </div>
          ))}
          <div className="h-[240px] w-0.5 bg-line-soft ml-5 absolute left-[30px] top-[140px] -z-10">
             <motion.div 
               animate={{ height: `${(currentStep / (steps.length - 1)) * 100}%` }}
               className="w-full bg-brand-orange" 
             />
          </div>
        </div>

        {/* Form Area */}
        <div className="flex-1 w-full space-y-8">
           <div className="space-y-2">
              <span className="md:hidden text-[10px] font-bold text-brand-orange uppercase tracking-widest">
                Step 0{currentStep + 1} of 05
              </span>
              <h1 className="text-4xl font-display font-semibold text-ink-950 tracking-tight">
                 {currentStepId === 'business' && 'Define Your Business'}
                 {currentStepId === 'training' && 'Train Your AI'}
                 {currentStepId === 'kb' && 'Connect Knowledge'}
                 {currentStepId === 'persona' && 'Agent Persona'}
                 {currentStepId === 'deploy' && 'Launch Command'}
              </h1>
              <p className="text-slate-lux max-w-lg">
                 {currentStepId === 'business' && 'Set up your organizations clinical or commercial identity.'}
                 {currentStepId === 'training' && 'Help your AI understand the core intent of your callers.'}
                 {currentStepId === 'kb' && 'Sync your website or upload documents for instant training.'}
                 {currentStepId === 'persona' && 'Define how your voice agent should sound and behave.'}
                 {currentStepId === 'deploy' && 'Everything is set. Your AI concierge is ready to go live.'}
              </p>
           </div>

           <LuxuryCard padding="lg" variant="glass" className="min-h-[400px] flex flex-col">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentStep}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -direction * 40 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="flex-1"
                >
                   {currentStepId === 'business' && (
                     <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-lux ml-1">Business Name</label>
                              <input className="w-full h-12 px-4 rounded-xl border border-line-soft focus:ring-2 focus:ring-brand-orange/20 outline-none transition-all placeholder:text-slate-lux/30" placeholder="e.g. Acme Clinics" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-lux ml-1">Industry</label>
                              <div className="relative">
                                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-lux/40" />
                                 <input className="w-full h-12 pl-12 pr-4 rounded-xl border border-line-soft outline-none focus:ring-2 focus:ring-brand-orange/20" placeholder="Search industries..." />
                              </div>
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold uppercase tracking-widest text-slate-lux ml-1">Primary Office Location</label>
                           <input className="w-full h-12 px-4 rounded-xl border border-line-soft focus:ring-2 focus:ring-brand-orange/20 outline-none transition-all placeholder:text-slate-lux/30" placeholder="City, State / Country" />
                        </div>
                     </div>
                   )}

                   {currentStepId === 'kb' && (
                     <div className="space-y-6">
                        <div className="p-6 rounded-2xl bg-brand-orange/5 border border-brand-orange/10 flex items-start gap-4">
                           <div className="p-3 rounded-xl bg-brand-orange text-white">
                              <Globe className="h-6 w-6" />
                           </div>
                           <div>
                              <h4 className="font-semibold text-ink-950 mb-1">Instant Website Sync</h4>
                              <p className="text-sm text-slate-lux mb-4">We'll automatically extract FAQs and business rules from your site.</p>
                              <div className="flex gap-2">
                                 <input className="flex-1 h-10 px-4 rounded-lg border border-line-soft outline-none focus:ring-2 focus:ring-brand-orange/20" placeholder="https://yourwebsite.com" />
                                 <LuxuryButton size="sm">Sync</LuxuryButton>
                              </div>
                           </div>
                        </div>

                        <div className="text-center py-8 border-2 border-dashed border-line-soft rounded-2xl">
                           <BookOpen className="h-8 w-8 text-slate-lux/30 mx-auto mb-3" />
                           <p className="text-sm font-medium text-slate-lux">Or upload training PDFs, CSVs or Docs</p>
                           <button className="text-xs font-bold text-brand-orange mt-2 uppercase tracking-widest">Select Files</button>
                        </div>
                     </div>
                   )}

                   {currentStepId === 'deploy' && (
                     <div className="flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-1000 py-12">
                        <div className="relative mb-8">
                           <div className="absolute inset-0 bg-brand-orange rounded-full blur-3xl opacity-20 animate-pulse" />
                           <div className="relative h-32 w-32 rounded-3xl bg-ink-950 flex items-center justify-center ring-8 ring-brand-orange/10">
                              <Sparkles className="h-16 w-16 text-brand-orange" />
                           </div>
                        </div>
                        <h2 className="text-3xl font-display font-semibold text-ink-950 mb-3">Optimization Complete</h2>
                        <p className="text-slate-lux max-w-sm mb-8 leading-relaxed italic">
                           "Your agent is trained on your knowledge base and calibrated for professional executive tone."
                        </p>
                        <div className="flex gap-4">
                           <div className="px-4 py-2 rounded-full border border-emerald-100 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              Ready for calls
                           </div>
                           <div className="px-4 py-2 rounded-full border border-brand-orange/20 bg-brand-orange/5 text-brand-orange text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
                              Premium Voice Active
                           </div>
                        </div>
                     </div>
                   )}
                </motion.div>
              </AnimatePresence>

              <div className="mt-12 flex items-center justify-between border-t border-line-soft pt-8">
                <button 
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 text-sm font-bold text-slate-lux hover:text-ink-950 transition-colors disabled:opacity-30 disabled:pointer-events-none uppercase tracking-widest"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>
                <LuxuryButton onClick={nextStep} className="group min-w-[160px]">
                  {currentStep === steps.length - 1 ? 'Launch Command center' : 'Continue'}
                  <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </LuxuryButton>
              </div>
           </LuxuryCard>
        </div>
      </div>
    </div>
  );
}
