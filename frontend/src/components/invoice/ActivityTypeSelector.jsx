import React from "react";
import { FileText, Wrench, Car, ShoppingCart, Hammer } from "lucide-react";
import { activityTypes } from "../../lib/calc";

const iconMap = { FileText, Wrench, Car, ShoppingCart, Hammer };

export default function ActivityTypeSelector({ value, onChange }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {activityTypes.map((t) => {
        const Icon = iconMap[t.icon];
        const active = value === t.id;
        return (
          <button
            type="button"
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`text-left p-4 rounded-xl border transition-all ${
              active
                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 shadow-md shadow-indigo-500/10"
                : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-indigo-300"
            }`}
          >
            <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${active ? "bg-indigo-600 text-white" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300"}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="mt-3 font-semibold text-sm text-neutral-900 dark:text-neutral-100">{t.label}</div>
            <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-snug">{t.desc}</div>
          </button>
        );
      })}
    </div>
  );
}
