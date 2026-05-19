import React from 'react';

const SECTIONS = [
  { title: '1. Information We Collect', body: "We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we're collecting it and how it will be used." },
  { title: '2. Use of Information', body: "We use your personal information to provide and improve our services, to communicate with you, and to comply with legal obligations. We may also use your information to personalize your experience and to send you promotional communications." },
  { title: '3. Data Retention', body: "We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we'll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification." },
  { title: '4. Third-Party Sharing', body: "We don't share any personally identifying information publicly or with third-parties, except when required to by law." },
  { title: '5. Cookies', body: "Our website uses cookies to enhance your experience. You can choose to disable cookies in your browser settings, but this may affect the functionality of our website." },
  { title: '6. Your Rights', body: "You have the right to access, correct, or delete your personal information. You can also object to the processing of your information and request that we restrict the processing of your information." },
  { title: '7. Contact Us', body: "If you have any questions about our Privacy Policy, please contact us at privacy@agently.ai." },
];

export default function Privacy() {
  return (
    <div className="min-h-screen bg-pearl pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold text-brand-orange uppercase tracking-[0.3em] mb-4">Legal</p>
          <h1 className="text-5xl font-display font-semibold text-ink-950 tracking-tight mb-6">Privacy Policy.</h1>
          <p className="text-lg text-slate-lux leading-relaxed">Your privacy is important to us. It is Agently's policy to respect your privacy regarding any information we may collect from you.</p>
        </div>
        <div className="space-y-10">
          {SECTIONS.map((s) => (
            <div key={s.title} className="border-b border-line-soft pb-10 last:border-0">
              <h2 className="text-2xl font-display font-semibold text-ink-950 mb-4">{s.title}</h2>
              <p className="text-slate-lux leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
