import React from 'react';
import { Check } from 'lucide-react';
import { HighlightText } from './HighlightText';

interface StepCheckboxProps {
  id: string;
  label: string;
  detail?: string;
  checked: boolean;
  onToggle: (id: string) => void;
  searchQuery?: string;
}

export const StepCheckbox: React.FC<StepCheckboxProps> = ({
  id,
  label,
  detail,
  checked,
  onToggle,
  searchQuery = '',
}) => {
  return (
    <label
      htmlFor={`chk-${id}`}
      className={`group flex items-start gap-3.5 p-3.5 rounded-xl border transition-colors cursor-pointer select-none ${
        checked
          ? 'bg-emerald-50/50 dark:bg-emerald-500/[0.06] border-emerald-200 dark:border-emerald-500/30'
          : 'bg-white dark:bg-[#131822] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <input
        id={`chk-${id}`}
        type="checkbox"
        checked={checked}
        onChange={() => onToggle(id)}
        className="sr-only"
      />
      <span
        aria-hidden="true"
        className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-colors ${
          checked
            ? 'bg-emerald-600 dark:bg-emerald-500 border-emerald-600 dark:border-emerald-500 text-white dark:text-slate-950'
            : 'bg-white dark:bg-[#0B0E14] border-slate-300 dark:border-slate-600 group-hover:border-amber-500 dark:group-hover:border-amber-400'
        }`}
      >
        {checked && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
      </span>
      <div className="min-w-0 flex-1">
        <div
          className={`text-sm font-medium leading-snug transition-colors ${
            checked
              ? 'text-slate-500 dark:text-slate-400 line-through decoration-slate-400/60'
              : 'text-slate-900 dark:text-slate-100'
          }`}
        >
          <HighlightText text={label} query={searchQuery} />
        </div>
        {detail && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            <HighlightText text={detail} query={searchQuery} />
          </p>
        )}
      </div>
    </label>
  );
};
