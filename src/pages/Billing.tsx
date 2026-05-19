import * as React from 'react';
import { CreditCard, Zap, Download, ArrowUpRight, History, ShieldAlert, TrendingUp, Sparkles, Check } from 'lucide-react';
import { LuxuryCard } from '@/src/components/ui/LuxuryCard';
import { LuxuryButton } from '@/src/components/ui/LuxuryButton';
import { cn } from '@/src/lib/utils';
import { useWorkspace } from '@/src/context/WorkspaceContext';

const PLANS = [
  { id: 'Starter', label: 'Starter', price: '$49', features: ['500 voice minutes', '1 voice agent', 'Basic analytics', 'Email support'] },
  { id: 'Pro', label: 'Pro', price: '$149', features: ['5,000 voice minutes', '8 voice agents', 'Advanced analytics', 'Priority support', 'Outreach campaigns'] },
];

export default function Billing() {
  const { workspace, handleUpdatePlan, handleCancelPlan, handleDownloadInvoice, handleContactSales } = useWorkspace();
  const org = workspace?.organization;
  const sub = org?.subscription;
  const invoices = org?.invoices ?? [];
  const [upgrading, setUpgrading] = React.useState(false);

  const onUpgrade = async (plan: 'Starter' | 'Pro') => {
    setUpgrading(true);
    try { await handleUpdatePlan(plan); } finally { setUpgrading(false); }
  };

  const usagePct = sub ? Math.min(100, Math.round((sub.usage.minutes / (sub.usage.minuteLimit || 1)) * 100)) : 0;
  const callPct = sub ? Math.min(100, Math.round((sub.usage.calls / (sub.usage.callLimit || 1)) * 100)) : 0;

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1 px-2.5 rounded-full bg-brand-orange-soft text-brand-orange text-[10px] font-bold uppercase tracking-widest border border-brand-orange/20 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3" /> {sub?.plan ?? 'Free'} Plan
            </span>
          </div>
          <h1 className="text-4xl font-display font-semibold tracking-tight text-ink-950">Usage & Subscription</h1>
          <p className="text-slate-lux mt-2">Monitor voice infrastructure resources and billing.</p>
        </div>
        <div className="flex gap-3">
          <LuxuryButton variant="secondary" size="sm" onClick={() => void handleContactSales()}>
            Contact Sales
          </LuxuryButton>
        </div>
      </div>

      {/* Current Usage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LuxuryCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-ink-950">Voice Minutes</p>
            <span className="text-2xl font-display font-semibold text-ink-950">{usagePct}%</span>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
            <div className={cn('h-full rounded-full transition-all', usagePct > 85 ? 'bg-red-500' : 'bg-brand-orange')} style={{ width: `${usagePct}%` }} />
          </div>
          <p className="text-xs text-slate-lux">{sub?.usage.minutes?.toLocaleString() ?? 0} / {sub?.usage.minuteLimit?.toLocaleString() ?? 0} minutes used</p>
        </LuxuryCard>
        <LuxuryCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-ink-950">Call Volume</p>
            <span className="text-2xl font-display font-semibold text-ink-950">{callPct}%</span>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
            <div className={cn('h-full rounded-full transition-all', callPct > 85 ? 'bg-red-500' : 'bg-emerald-500')} style={{ width: `${callPct}%` }} />
          </div>
          <p className="text-xs text-slate-lux">{sub?.usage.calls?.toLocaleString() ?? 0} / {sub?.usage.callLimit?.toLocaleString() ?? 0} calls this period</p>
        </LuxuryCard>
      </div>

      {/* Plans */}
      <div>
        <h2 className="text-xl font-display font-semibold text-ink-950 mb-6">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PLANS.map((plan) => {
            const isCurrent = sub?.plan === plan.id;
            return (
              <LuxuryCard key={plan.id} className={cn('p-6', isCurrent && 'ring-2 ring-brand-orange')}>
                {isCurrent && <div className="text-[10px] font-bold uppercase tracking-widest text-brand-orange mb-3">Current Plan</div>}
                <div className="flex items-end gap-1 mb-4">
                  <span className="text-4xl font-display font-semibold text-ink-950">{plan.price}</span>
                  <span className="text-slate-lux pb-1">/month</span>
                </div>
                <p className="text-xl font-semibold text-ink-950 mb-4">{plan.label}</p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-lux">
                      <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                {!isCurrent ? (
                  <LuxuryButton onClick={() => void onUpgrade(plan.id as 'Starter' | 'Pro')} disabled={upgrading} className="w-full">
                    {upgrading ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : `Upgrade to ${plan.label}`}
                  </LuxuryButton>
                ) : (
                  <LuxuryButton variant="secondary" onClick={() => { if (window.confirm('Cancel your subscription?')) void handleCancelPlan(); }} className="w-full">
                    Cancel Plan
                  </LuxuryButton>
                )}
              </LuxuryCard>
            );
          })}
        </div>
      </div>

      {/* Invoices */}
      {invoices.length > 0 && (
        <LuxuryCard className="p-6">
          <h3 className="font-display font-semibold text-ink-950 mb-6">Invoice History</h3>
          <div className="space-y-3">
            {invoices.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
                <div>
                  <p className="font-semibold text-ink-900">${inv.amount.toFixed(2)}</p>
                  <p className="text-xs text-slate-lux">{new Date(inv.date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn('text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full', inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600')}>
                    {inv.status}
                  </span>
                  <button onClick={() => void handleDownloadInvoice(inv.id)} className="p-2 rounded-lg hover:bg-white text-slate-lux hover:text-brand-orange transition-colors">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </LuxuryCard>
      )}
    </div>
  );
}
