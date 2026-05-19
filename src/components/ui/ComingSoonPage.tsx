import * as React from 'react';
import { Construction } from 'lucide-react';
import { LuxuryCard } from '@/src/components/ui/LuxuryCard';

export default function ComingSoonPage({ title }: { title: string }) {
  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-2">
         <h1 className="text-4xl font-display font-semibold tracking-tight text-ink-950">{title}</h1>
         <p className="text-slate-lux">This premium interface is currently being polished for production.</p>
      </div>

      <LuxuryCard padding="lg" variant="glass" className="flex flex-col items-center justify-center py-24 text-center">
         <div className="h-20 w-20 rounded-3xl bg-brand-orange-soft flex items-center justify-center mb-6">
            <Construction className="h-10 w-10 text-brand-orange" />
         </div>
         <h2 className="text-2xl font-display font-semibold text-ink-950 mb-2">Luxury Reveal Incoming</h2>
         <p className="text-slate-lux max-w-sm">We are finalizing the executive controls and data visualization for this module.</p>
      </LuxuryCard>
    </div>
  );
}
