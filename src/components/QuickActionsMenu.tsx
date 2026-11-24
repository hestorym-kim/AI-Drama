import React, { useEffect, useRef, useState } from 'react';
import { Compass, Sparkles, X, Zap } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { MainSectionId, NAV_SECTIONS } from '../data/manualData';

interface QuickActionsMenuProps {
  activeSection: MainSectionId;
  activeSubId: string;
  lastVisitedStage: {
    sectionId: MainSectionId;
    subId: string;
  };
  onJumpToActiveStage: () => void;
  onOpenAiConcept: () => void;
}

export const QuickActionsMenu: React.FC<QuickActionsMenuProps> = ({
  activeSection,
  lastVisitedStage,
  onJumpToActiveStage,
  onOpenAiConcept,
}) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
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

  const targetMeta = NAV_SECTIONS.find(
    (s) => s.id === lastVisitedStage.sectionId
  );
  const targetSub = targetMeta?.subSections.find(
    (sub) => sub.id === lastVisitedStage.subId
  );
  const currentMeta = NAV_SECTIONS.find((s) => s.id === activeSection);

  return (
    <div
      ref={wrapperRef}
      className="no-print fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2.5"
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            role="menu"
            aria-label="빠른 작업 메뉴"
            className="w-72 rounded-2xl bg-white dark:bg-[#131822] border border-slate-200 dark:border-slate-700/80 shadow-2xl p-2 space-y-1.5"
          >
            <div className="px-2.5 py-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500">
              Quick Actions
            </div>

            {/* Action 1: Jump to Active Stage (last visited section) */}
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                onJumpToActiveStage();
                setOpen(false);
              }}
              className="w-full flex items-start gap-3 p-2.5 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors cursor-pointer"
            >
              <span className="w-8 h-8 rounded-lg bg-sky-500/12 border border-sky-500/25 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0 mt-0.5">
                <Compass className="w-4 h-4" />
              </span>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  Active Stage로 이동
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  {targetMeta?.number}. {targetSub?.label || targetMeta?.shortTitle}
                </div>
              </div>
            </button>

            {/* Action 2: Generate AI Concept for current production phase */}
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onOpenAiConcept();
              }}
              className="w-full flex items-start gap-3 p-2.5 rounded-xl text-left hover:bg-amber-500/10 dark:hover:bg-amber-400/10 transition-colors cursor-pointer"
            >
              <span className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </span>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  Generate AI Concept
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  현재 단계({currentMeta?.number} {currentMeta?.shortTitle}) AI 컨셉 생성
                </div>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs sm:text-sm shadow-lg shadow-amber-500/20 border border-amber-400/60 transition-transform active:scale-95 cursor-pointer whitespace-nowrap"
      >
        {open ? <X className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
        <span>Quick Actions</span>
      </button>
    </div>
  );
};
