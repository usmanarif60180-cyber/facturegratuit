import React from "react";
import AdBanner from "../components/AdBanner";
import { blogPosts } from "../mock";
import * as Icons from "lucide-react";
import { Badge } from "../components/ui/badge";

const tags = ["All", "Invoices", "Taxes", "Quotes", "AI", "Accounting", "Construction", "Finance", "Productivity", "Guides"];

export default function Blog() {
  const [active, setActive] = React.useState("All");
  const filtered = active === "All" ? blogPosts : blogPosts.filter((p) => p.tag === active);
  return (
    <div className="max-w-7xl mx-auto px-6 py-14">
      <div className="text-sm text-neutral-500 mb-2">Home / Blog</div>
      <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">The ProFacture AI Blog</h1>
      <p className="mt-3 text-neutral-500 dark:text-neutral-400 max-w-2xl">Practical, no-fluff guides on invoicing, quotes, taxes, accounting and running a small business.</p>

      <AdBanner />

      <div className="flex flex-wrap gap-2 my-8">
        {tags.map((t) => (
          <button key={t} onClick={() => setActive(t)} className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${active === t ? "bg-indigo-600 text-white border-indigo-600" : "bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:border-indigo-300"}`}>{t}</button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p) => {
          const Icon = Icons[p.icon] || Icons.FileText;
          return (
            <article key={p.title} className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 hover:-translate-y-0.5 hover:shadow-lg transition-all cursor-pointer">
              <div className="h-11 w-11 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center"><Icon className="h-5 w-5" /></div>
              <Badge variant="secondary" className="mt-4 rounded-full text-[11px]">{p.tag}</Badge>
              <h3 className="mt-3 font-semibold text-lg text-neutral-900 dark:text-neutral-100 leading-snug group-hover:text-indigo-600 transition-colors">{p.title}</h3>
              <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">{p.desc}</p>
              <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
                <span>{p.author}</span>
                <span>{p.read}</span>
              </div>
            </article>
          );
        })}
      </div>

      <AdBanner />
    </div>
  );
}
