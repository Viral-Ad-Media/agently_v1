import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Mic, MicOff, PhoneOff, User, MessageSquare, Play, Info, MoreVertical } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { LuxuryButton } from '@/src/components/ui/LuxuryButton';

export interface CallSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CallSimulator({ isOpen, onClose }: CallSimulatorProps) {
  const [status, setStatus] = React.useState<'idle' | 'calling' | 'active' | 'finished'>('idle');
  const [isMuted, setIsMuted] = React.useState(false);
  const [transcript, setTranscript] = React.useState<Array<{ role: 'ai' | 'user', text: string }>>([]);

  const startCall = () => {
    setStatus('calling');
    setTimeout(() => {
      setStatus('active');
      setTranscript([{ role: 'ai', text: "Hello! This is Sarah from Agently Front Desk. How can I help you today?" }]);
    }, 2000);
  };

  const endCall = () => {
    setStatus('finished');
    setTimeout(() => {
      onClose();
      setStatus('idle');
      setTranscript([]);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink-950/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="relative w-full max-w-lg bg-ink-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            {/* Header / Status Bar */}
            <div className="p-8 flex flex-col items-center text-center">
              <div className="h-4 w-48 bg-white/5 rounded-full mb-8" /> {/* Speaker bar motif */}
              
              <div className="relative mb-6">
                <div className="h-24 w-24 rounded-full bg-brand-orange-soft flex items-center justify-center ring-8 ring-brand-orange/5">
                   <User className="h-10 w-10 text-brand-orange" />
                </div>
                {status === 'active' && (
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 rounded-full border border-brand-orange" 
                  />
                )}
              </div>

              <h3 className="text-xl font-display font-semibold text-white mb-1">
                 {status === 'idle' && 'Voice Lab Simulator'}
                 {status === 'calling' && 'Connecting...'}
                 {status === 'active' && 'Live AI Call'}
                 {status === 'finished' && 'Call Complete'}
              </h3>
              <p className="text-sm text-white/40 uppercase tracking-widest font-bold">
                 {status === 'active' ? 'Sarah (Front Desk)' : 'Ultra-Low Latency Channel'}
              </p>
            </div>

            {/* Transcript Area */}
            <div className="px-8 pb-8 h-48 overflow-y-auto custom-scrollbar flex flex-col gap-4">
              <AnimatePresence>
                {transcript.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed",
                      msg.role === 'ai' ? "bg-white/10 text-white rounded-tl-none" : "bg-brand-orange text-white rounded-tr-none self-end"
                    )}
                  >
                    {msg.text}
                  </motion.div>
                ))}
              </AnimatePresence>
              {status === 'active' && transcript.length === 1 && (
                <div className="flex gap-1.5 px-2">
                   {[1,2,3].map(i => (
                     <motion.div key={i} animate={{ height: [4, 8, 4] }} transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }} className="w-1 bg-brand-orange/40 rounded-full" />
                   ))}
                </div>
              )}
            </div>

            {/* Waveform Visualization */}
            {status === 'active' && (
              <div className="h-12 flex items-center justify-center gap-1 px-12 mb-8">
                 {[...Array(30)].map((_, i) => (
                   <motion.div
                     key={i}
                     animate={{ height: [4, Math.random() * 32 + 4, 4] }}
                     transition={{ repeat: Infinity, duration: 0.5 + Math.random() }}
                     className="flex-1 bg-brand-orange/60 rounded-full"
                   />
                 ))}
              </div>
            )}

            {/* Controls */}
            <div className="p-8 bg-black/40 border-t border-white/5">
              <div className="flex items-center justify-between gap-6">
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className={cn(
                    "flex flex-col items-center gap-2 text-white/40 hover:text-white transition-colors",
                    isMuted && "text-brand-orange"
                  )}
                >
                  <div className="h-14 w-14 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                     {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Mute</span>
                </button>

                {status === 'idle' ? (
                  <button 
                    onClick={startCall}
                    className="h-20 w-20 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-2xl shadow-emerald-500/20 active:scale-95 transition-all"
                  >
                    <Phone className="h-8 w-8 fill-current" />
                  </button>
                ) : (
                  <button 
                    onClick={endCall}
                    className="h-20 w-20 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-2xl shadow-rose-500/20 active:scale-95 transition-all"
                  >
                    <PhoneOff className="h-8 w-8 fill-current" />
                  </button>
                )}

                <button className="flex flex-col items-center gap-2 text-white/40 hover:text-white transition-colors">
                  <div className="h-14 w-14 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                     <Info className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Info</span>
                </button>
              </div>
            </div>
            
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-white/20 hover:text-white hover:bg-white/5 rounded-full transition-all"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
