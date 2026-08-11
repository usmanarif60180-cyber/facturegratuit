import React from "react";

export default function LegalPage({ title, kicker, sections }) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-14">
      {kicker && <div className="text-sm text-neutral-500 mb-1">{kicker}</div>}
      <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">{title}</h1>
      <div className="mt-8 space-y-8">
        {sections.map((s, i) => (
          <div key={i} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6">
            {s.heading && <h2 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">{s.heading}</h2>}
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed whitespace-pre-line">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
