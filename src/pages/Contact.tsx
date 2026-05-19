import React, { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { LuxuryCard } from '@/src/components/ui/LuxuryCard';
import { LuxuryButton } from '@/src/components/ui/LuxuryButton';
import { api } from '@/src/services/api';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.submitContact(form);
      setSent(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSent(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send your message.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full rounded-2xl border border-line-soft bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all';

  return (
    <div className="min-h-screen bg-pearl pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-semibold text-brand-orange uppercase tracking-[0.3em] mb-4">Contact Us</p>
          <h1 className="text-5xl font-display font-semibold text-ink-950 tracking-tight mb-6">Get in Touch.</h1>
          <p className="text-lg text-slate-lux leading-relaxed">
            Have questions about Agently? Our team is here to help you get started or answer any technical inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <LuxuryCard className="p-10">
            {sent ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h3 className="text-2xl font-display font-semibold text-ink-950 mb-2">Message Sent!</h3>
                <p className="text-slate-lux">We'll get back to you as soon as possible.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-lux uppercase tracking-wider mb-1.5">Full Name</label>
                    <input type="text" required className={inputCls} value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-lux uppercase tracking-wider mb-1.5">Email Address</label>
                    <input type="email" required className={inputCls} value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-lux uppercase tracking-wider mb-1.5">Subject</label>
                  <input type="text" required className={inputCls} value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-lux uppercase tracking-wider mb-1.5">Message</label>
                  <textarea rows={6} required className={inputCls} value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
                </div>
                <LuxuryButton type="submit" disabled={loading} className="w-full">
                  {loading ? 'Sending...' : 'Send Message'}
                </LuxuryButton>
              </form>
            )}
          </LuxuryCard>

          <div className="space-y-6">
            <LuxuryCard className="p-10 bg-ink-950 text-white border-0">
              <h3 className="text-xl font-display font-semibold mb-6">Direct Support</h3>
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center shrink-0"><Mail className="w-5 h-5" /></div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-white/50">Email Us</p>
                    <p className="font-semibold">hello@agently.ai</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center shrink-0"><Phone className="w-5 h-5" /></div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-white/50">Call Us</p>
                    <p className="font-semibold">+1 (415) 555-0123</p>
                  </div>
                </div>
              </div>
            </LuxuryCard>

            <LuxuryCard className="p-10">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-brand-orange/10 flex items-center justify-center shrink-0"><MapPin className="w-5 h-5 text-brand-orange" /></div>
                <div>
                  <h3 className="text-lg font-display font-semibold text-ink-950 mb-2">Office Location</h3>
                  <p className="text-slate-lux leading-relaxed text-sm">
                    123 AI Boulevard, Suite 456<br />
                    San Francisco, CA 94103<br />
                    United States
                  </p>
                </div>
              </div>
            </LuxuryCard>
          </div>
        </div>
      </div>
    </div>
  );
}
