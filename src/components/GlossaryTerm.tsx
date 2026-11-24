import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, ChevronDown, X } from 'lucide-react';
import { GLOSSARY_ENTRIES } from '../data/manualData';

interface GlossaryTermProps {
  termId: string;
  label?: string;
  onOpenGlossary?: (termId: string) => void;
}

export const GlossaryTerm: React.FC<GlossaryTermProps> = ({
  termId,
  label,
  onOpenGlossary,
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  const entry = GLOSSARY_ENTRIES.find((item) => item.id === termId);

  useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  if (!entry) {
    return <span>{label || termId}</span>;
  }

  return (
    <span ref={containerRef} className="relative inline-block align-baseline">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[0.92em] font-medium bg-amber-500/10 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300 border border-amber-500/25 dark:border-amber-400/25 hover:bg-amber-500/20 dark:hover:bg-amber-400/20 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
      >
        <span className="underline decoration-dotted underline-offset-4 decoration-amber-500/60">
          {label || entry.term}
        </span>
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <span
          role="dialog"
          aria-label={`${entry.term} 용어 설명`}
          className="block sm:absolute sm:left-0 sm:top-full sm:mt-2 sm:w-80 md:w-96 z-40 mt-2 rounded-xl bg-white dark:bg-[#151A24] border border-slate-200 dark:border-slate-700/80 shadow-xl p-4 text-left font-normal"
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <div className="text-xs font-medium text-amber-600 dark:text-amber-400">
                {entry.category}
              </div>
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                {entry.term}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {entry.fullName}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="닫기"
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 mb-2.5">
            {entry.shortDef}
          </p>

          <div className="rounded-lg bg-slate-50 dark:bg-[#0E1219] border border-slate-200/80 dark:border-slate-800 p-2.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300 mb-2.5">
            <span className="font-semibold text-slate-800 dark:text-slate-100">실전 팁: </span>
            {entry.beginnerTip}
          </div>

          {onOpenGlossary && (
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onOpenGlossary(entry.id);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              전체 용어 사전에서 자세히 보기
            </button>
          )}
        </span>
      )}
    </span>
  );
};
