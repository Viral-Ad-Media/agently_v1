import * as React from 'react';
import { motion } from 'motion/react';
import { 
  MessageSquare, 
  Plus, 
  Settings, 
  Palette, 
  Code, 
  Eye, 
  Zap, 
  Globe,
  Monitor,
  Smartphone,
  Copy,
  CheckCircle2,
  Mic
} from 'lucide-react';
import { LuxuryCard } from '@/src/components/ui/LuxuryCard';
import { LuxuryButton } from '@/src/components/ui/LuxuryButton';
import { cn } from '@/src/lib/utils';
import { useToast } from '@/src/components/ui/ToastProvider';

export default function Messenger() {
  const [activeTab, setActiveTab] = React.useState('preview');
  const [copied, setCopied] = React.useState(false);
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText('<script src="https://cdn.agently.ai/widget.js" data-id="ag_12345"></script>');
    setCopied(true);
    toast('Script copied to clipboard', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <h1 className="text-4xl font-display font-semibold tracking-tight text-ink-950">Chatbot Studio</h1>
           <p className="text-slate-lux mt-2">Design and deploy your intelligent web concierge.</p>
        </div>
        <div className="flex gap-3">
           <LuxuryButton variant="secondary" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Live Demo
           </LuxuryButton>
           <LuxuryButton size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Chatbot
           </LuxuryButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel: Configuration */}
        <div className="lg:col-span-1 space-y-6">
           <LuxuryCard className="space-y-6">
              <div className="space-y-4">
                 <h3 className="text-lg font-display font-semibold text-ink-950 flex items-center gap-2">
                    <Palette className="h-4 w-4 text-brand-orange" />
                    Appearance
                 </h3>
                 <div className="space-y-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-slate-lux">Brand Color</label>
                       <div className="flex gap-2">
                          {['#FF9900', '#000000', '#4F46E5', '#10B981'].map(color => (
                            <button 
                              key={color}
                              className={cn(
                                "h-8 w-8 rounded-full border-2 transition-all",
                                color === '#FF9900' ? "border-ink-950 scale-110" : "border-transparent hover:scale-105"
                              )}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                          <button className="h-8 w-8 rounded-full border-2 border-line-soft flex items-center justify-center text-slate-lux">
                             <Plus className="h-4 w-4" />
                          </button>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-slate-lux">Widget Theme</label>
                       <div className="grid grid-cols-2 gap-2">
                          <button className="p-3 rounded-xl border-2 border-ink-950 bg-white text-ink-950 text-xs font-bold uppercase tracking-widest">Light Lux</button>
                          <button className="p-3 rounded-xl border border-line-soft bg-ink-950 text-white text-xs font-bold uppercase tracking-widest">Dark Onyx</button>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="pt-6 border-t border-line-soft space-y-4">
                 <h3 className="text-lg font-display font-semibold text-ink-950 flex items-center gap-2">
                    <Settings className="h-4 w-4 text-brand-orange" />
                    Logic & Tone
                 </h3>
                 <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-line-soft">
                       <div className="flex items-center gap-3">
                          <Zap className="h-4 w-4 text-brand-orange" />
                          <span className="text-sm font-medium text-ink-900">Auto-Suggest</span>
                       </div>
                       <div className="h-5 w-10 bg-brand-orange rounded-full relative">
                          <div className="absolute right-0.5 top-0.5 h-4 w-4 bg-white rounded-full shadow-sm" />
                       </div>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-line-soft">
                       <div className="flex items-center gap-3">
                          <Mic className="h-4 w-4 text-brand-orange" />
                          <span className="text-sm font-medium text-ink-900">Voice-to-Text</span>
                       </div>
                       <div className="h-5 w-10 bg-slate-200 rounded-full relative">
                          <div className="absolute left-0.5 top-0.5 h-4 w-4 bg-white rounded-full shadow-sm" />
                       </div>
                    </div>
                 </div>
              </div>
           </LuxuryCard>

           <LuxuryCard variant="ink" className="space-y-4 shadow-xl">
              <h3 className="text-lg font-display font-semibold text-white flex items-center gap-2">
                 <Code className="h-4 w-4 text-brand-orange" />
                 Embed Script
              </h3>
              <p className="text-xs text-white/40 leading-relaxed">
                 Copy this snippet to your website's header to go live instantly.
              </p>
              <div className="relative group">
                 <pre className="p-4 bg-black/40 rounded-xl text-[10px] text-white/60 font-mono overflow-x-auto border border-white/5 whitespace-pre-wrap">
                    {`<script src="https://cdn.agently.ai/widget.js" data-id="ag_12345"></script>`}
                 </pre>
                 <button 
                  onClick={copyToClipboard}
                  className="absolute top-2 right-2 p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                 >
                    {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                 </button>
              </div>
           </LuxuryCard>
        </div>

        {/* Right Panel: Preview */}
        <div className="lg:col-span-2">
           <div className="flex items-center justify-between mb-4">
              <div className="flex p-1 bg-slate-200 rounded-lg">
                 <button className="p-2 rounded bg-white shadow-sm text-ink-950"><Monitor className="h-4 w-4" /></button>
                 <button className="p-2 text-slate-lux"><Smartphone className="h-4 w-4" /></button>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-lux uppercase tracking-widest">
                 <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                 Live Preview
              </div>
           </div>
           
           <div className="relative h-[600px] w-full bg-slate-100 rounded-[2rem] border border-line-soft overflow-hidden shadow-inner flex items-center justify-center p-8">
              {/* Mock Chat Widget */}
              <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="w-full max-w-sm h-full bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-line-soft"
              >
                 <div className="p-6 bg-brand-orange text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center relative">
                          <MessageSquare className="h-5 w-5 fill-current" />
                          <div className="absolute -right-0.5 -bottom-0.5 h-3 w-3 bg-emerald-400 border-2 border-brand-orange rounded-full" />
                       </div>
                       <div>
                          <h4 className="font-semibold text-sm">Agently Support</h4>
                          <p className="text-[10px] text-white/60 uppercase tracking-widest font-bold">Online Now</p>
                       </div>
                    </div>
                    <Settings className="h-5 w-5 text-white/60" />
                 </div>
                 
                 <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                    <div className="flex flex-col gap-1 max-w-[80%]">
                       <div className="p-3 bg-slate-100 rounded-2xl rounded-tl-none text-xs text-ink-900 leading-relaxed font-medium">
                          Hello! I'm Sarah, your AI concierge. How can I assist you with Agently today?
                       </div>
                    </div>
                    <div className="flex flex-col gap-1 max-w-[80%] self-end">
                       <div className="p-3 bg-brand-orange text-white rounded-2xl rounded-tr-none text-xs leading-relaxed font-medium">
                          I'd like to learn more about the enterprise plan.
                       </div>
                    </div>
                 </div>

                 <div className="p-4 border-t border-line-soft">
                    <div className="relative">
                       <input className="w-full h-11 pl-4 pr-10 bg-slate-50 border border-line-soft rounded-full text-xs outline-none focus:ring-2 focus:ring-brand-orange/20" placeholder="Type your message..." />
                       <LuxuryButton variant="primary" size="icon" className="absolute right-1 top-1 h-9 w-9 bg-brand-orange">
                          <Zap className="h-4 w-4 fill-current" />
                       </LuxuryButton>
                    </div>
                 </div>
              </motion.div>

              {/* Background watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                 <ShieldCheck className="w-[400px] h-[400px]" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function ShieldCheck(props: any) {
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
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}
