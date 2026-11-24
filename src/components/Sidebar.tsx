import React from 'react';
import { Clapperboard, Download, RotateCcw, X, ChevronRight } from 'lucide-react';
import { MainSectionId, NAV_SECTIONS, CHECKLIST_ITEMS } from '../data/manualData';
import { SidebarProgressChart } from './SidebarProgressChart';

interface SidebarProps {
  activeSection: MainSectionId;
  activeSubId: string;
  onSelectSection: (sectionId: MainSectionId, anchorId?: string) => void;
  completedIds: string[];
  onResetProgress: () => void;
  onOpenExport: () => void;
  isDark: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  activeSubId,
  onSelectSection,
  completedIds,
  onResetProgress,
  onOpenExport,
  isDark,
  mobileOpen,
  onCloseMobile,
}) => {
  const totalTasks = CHECKLIST_ITEMS.length;
  const completedCount = completedIds.filter((id) =>
    CHECKLIST_ITEMS.some((item) => item.id === id)
  ).length;
  const progressPct = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const sidebarContent = (
    <div className="h-full flex flex-col bg-white dark:bg-[#0E121A] border-r border-slate-200 dark:border-slate-800/90">
      {/* Brand Title */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800/90 shrink-0">
        <button
          type="button"
          onClick={() => {
            onSelectSection('overview');
            onCloseMobile();
          }}
          className="flex items-center gap-2.5 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-md"
        >
          <span className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <Clapperboard className="w-4 h-4" />
          </span>
          <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap">
            AI 드라마 제작 매뉴얼
          </span>
        </button>
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="내비게이션 닫기"
          className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Tracker Card */}
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800/80 shrink-0">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-medium text-slate-600 dark:text-slate-300">
            제작 공정 진행률
          </span>
          <span className="font-mono tabular-nums font-semibold text-amber-600 dark:text-amber-400">
            {completedCount}/{totalTasks} ({progressPct}%)
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden mb-3">
          <div
            className="h-full bg-amber-500 dark:bg-amber-400 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <SidebarProgressChart
          completedIds={completedIds}
          activeSection={activeSection}
          isDark={isDark}
          onSelectStage={(sectionId) => {
            onSelectSection(sectionId);
            onCloseMobile();
          }}
        />

        <div className="mt-2.5 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => {
              onOpenExport();
              onCloseMobile();
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-amber-500/12 text-amber-700 dark:text-amber-300 border border-amber-500/25 hover:bg-amber-500/20 transition-colors whitespace-nowrap cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>진행 상황 내보내기</span>
          </button>

          {completedCount > 0 && (
            <button
              type="button"
              onClick={onResetProgress}
              className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors whitespace-nowrap cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              초기화
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tree */}
      <nav aria-label="매뉴얼 목차" className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
        {NAV_SECTIONS.map((section) => {
          const isActive = activeSection === section.id;
          return (
            <div key={section.id} className="space-y-1">
              <button
                type="button"
                onClick={() => {
                  onSelectSection(section.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-left transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                  isActive
                    ? 'bg-amber-500/12 text-amber-700 dark:bg-amber-400/12 dark:text-amber-300 font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 font-medium'
                }`}
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`font-mono tabular-nums text-xs shrink-0 ${
                      isActive
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {section.number}
                  </span>
                  <span className="text-[13px] truncate">{section.title}</span>
                </span>
                {!section.implemented && (
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 shrink-0">
                    예정
                  </span>
                )}
              </button>

              {/* Sub-navigation */}
              {isActive && section.subSections.length > 0 && (
                <div className="pl-7 pr-2 py-1 space-y-0.5">
                  {section.subSections.map((sub) => {
                    const isSubActive = activeSubId === sub.id;
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => {
                          onSelectSection(section.id, sub.id);
                          onCloseMobile();
                        }}
                        className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-left text-xs transition-colors cursor-pointer ${
                          isSubActive
                            ? 'text-slate-900 dark:text-slate-100 font-medium bg-slate-100 dark:bg-slate-800/70'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                        }`}
                      >
                        <ChevronRight
                          className={`w-3 h-3 shrink-0 transition-transform ${
                            isSubActive ? 'text-amber-500 translate-x-0.5' : 'opacity-40'
                          }`}
                        />
                        <span className="truncate">{sub.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer note */}
      <div className="px-5 py-3.5 border-t border-slate-200 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
        올인원 제작 매뉴얼 · 5개 챕터 완결판
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-72 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile / Tablet Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="relative w-72 max-w-[85vw] h-full z-10 shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};
