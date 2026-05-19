import React from 'react';

const SECTIONS = [
  { title: '1. Acceptance of Terms', body: "By accessing or using Agently, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site." },
  { title: '2. Use License', body: "Permission is granted to temporarily download one copy of the materials on Agently's website for personal, non-commercial transitory viewing only. You may not: modify or copy the materials; use the materials for any commercial purpose; attempt to decompile or reverse engineer any software; or remove any copyright or other proprietary notations." },
  { title: '3. Disclaimer', body: "The materials on Agently's website are provided on an 'as is' basis. Agently makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property." },
  { title: '4. Limitations', body: "In no event shall Agently or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Agently's website." },
  { title: '5. Accuracy of Materials', body: "The materials appearing on Agently's website could include technical, typographical, or photographic errors. Agently does not warrant that any of the materials on its website are accurate, complete or current. Agently may make changes to the materials at any time without notice." },
  { title: '6. Governing Law', body: "These terms and conditions are governed by and construed in accordance with the laws of California and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location." },
];

export default function Terms() {
  return (
    <div className="min-h-screen bg-pearl pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold text-brand-orange uppercase tracking-[0.3em] mb-4">Legal</p>
          <h1 className="text-5xl font-display font-semibold text-ink-950 tracking-tight mb-6">Terms of Service.</h1>
          <p className="text-lg text-slate-lux leading-relaxed">Please read these terms carefully before using Agently.</p>
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
