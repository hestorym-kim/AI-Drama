import { useEffect, useState, useCallback } from 'react';
import { MainSectionId, NAV_SECTIONS } from './data/manualData';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { SectionOverview } from './components/SectionOverview';
import { SectionProductionGuide } from './components/SectionProductionGuide';
import { SectionTools } from './components/SectionTools';
import { SectionLegal } from './components/SectionLegal';
import { SectionFaq } from './components/SectionFaq';
import { GlossaryModal } from './components/GlossaryModal';
import { ExportModal } from './components/ExportModal';
import { PrintReport } from './components/PrintReport';
import { QuickActionsMenu } from './components/QuickActionsMenu';
import { AiConceptModal } from './components/AiConceptModal';
import { ExportOptions } from './utils/exportGuide';

const PROGRESS_STORAGE_KEY = 'ai_drama_manual_progress_v1';
const THEME_STORAGE_KEY = 'ai_drama_manual_theme_v1';
const LAST_STAGE_STORAGE_KEY = 'ai_drama_manual_last_stage_v1';

export default function App() {
  // Default to Dark Mode as requested
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    try {
      const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
      return saved ? saved === 'dark' : true;
    } catch {
      return true;
    }
  });

  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [activeSection, setActiveSection] = useState<MainSectionId>('overview');
  const [activeSubId, setActiveSubId] = useState<string>('sec-1-1');
  const [lastVisitedStage, setLastVisitedStage] = useState<{
    sectionId: MainSectionId;
    subId: string;
  }>(() => {
    if (typeof window === 'undefined') {
      return { sectionId: 'overview', subId: 'sec-1-1' };
    }
    try {
      const raw = window.localStorage.getItem(LAST_STAGE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.sectionId) {
          return {
            sectionId: parsed.sectionId,
            subId: parsed.subId || 'sec-1-1',
          };
        }
      }
    } catch {
      // ignore storage errors
    }
    return { sectionId: 'overview', subId: 'sec-1-1' };
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [glossaryOpen, setGlossaryOpen] = useState<boolean>(false);
  const [glossaryTermId, setGlossaryTermId] = useState<string | null>(null);
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);
  const [aiConceptOpen, setAiConceptOpen] = useState<boolean>(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    includeChecklist: true,
    includeSummaryGuide: true,
  });

  // Sync dark mode class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
    } catch {
      // ignore storage errors
    }
  }, [isDark]);

  // Persist checklist progress
  useEffect(() => {
    try {
      window.localStorage.setItem(
        PROGRESS_STORAGE_KEY,
        JSON.stringify(completedIds)
      );
    } catch {
      // ignore storage errors
    }
  }, [completedIds]);

  const handleToggleCheck = useCallback((id: string) => {
    setCompletedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const handleResetProgress = useCallback(() => {
    setCompletedIds([]);
  }, []);

  // Persist current stage for cross-session Active Stage resume
  useEffect(() => {
    try {
      window.localStorage.setItem(
        LAST_STAGE_STORAGE_KEY,
        JSON.stringify({ sectionId: activeSection, subId: activeSubId })
      );
    } catch {
      // ignore storage errors
    }
  }, [activeSection, activeSubId]);

  const handleNavigate = useCallback(
    (sectionId: MainSectionId, anchorId?: string) => {
      if (sectionId !== activeSection) {
        setLastVisitedStage({
          sectionId: activeSection,
          subId: activeSubId,
        });
      }

      setActiveSection(sectionId);
      const sectionMeta = NAV_SECTIONS.find((s) => s.id === sectionId);
      const targetAnchor = anchorId || sectionMeta?.subSections[0]?.id || '';
      if (targetAnchor) {
        setActiveSubId(targetAnchor);
      }

      window.requestAnimationFrame(() => {
        if (anchorId) {
          const el = document.getElementById(anchorId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
          }
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    },
    [activeSection, activeSubId]
  );

  // Track active sub-section on scroll
  useEffect(() => {
    const sectionMeta = NAV_SECTIONS.find((s) => s.id === activeSection);
    if (!sectionMeta || !sectionMeta.implemented) return;

    const handleScroll = () => {
      const offsets = sectionMeta.subSections
        .map((sub) => {
          const el = document.getElementById(sub.id);
          if (!el) return null;
          return { id: sub.id, top: el.getBoundingClientRect().top };
        })
        .filter((item): item is { id: string; top: number } => item !== null);

      const passed = offsets.filter((o) => o.top <= 140);
      if (passed.length > 0) {
        setActiveSubId(passed[passed.length - 1].id);
      } else if (offsets.length > 0) {
        setActiveSubId(offsets[0].id);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  const handleOpenGlossary = useCallback((termId?: string) => {
    setGlossaryTermId(termId || null);
    setGlossaryOpen(true);
  }, []);

  return (
    <>
      <div className="no-print min-h-screen bg-slate-50 dark:bg-[#0B0E14] text-slate-900 dark:text-slate-100 transition-colors">
        <Sidebar
          activeSection={activeSection}
          activeSubId={activeSubId}
          onSelectSection={handleNavigate}
          completedIds={completedIds}
          onResetProgress={handleResetProgress}
          onOpenExport={() => setExportModalOpen(true)}
          isDark={isDark}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        <div className="lg:pl-72 flex flex-col min-h-screen">
          <TopBar
            activeSection={activeSection}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onNavigate={handleNavigate}
            onOpenGlossary={handleOpenGlossary}
            onOpenExport={() => setExportModalOpen(true)}
            isDark={isDark}
            onToggleTheme={() => setIsDark((prev) => !prev)}
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
          />

        <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
          {searchQuery.trim() && (
            <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-xs text-amber-800 dark:text-amber-200">
              <span>
                현재 <strong>"{searchQuery}"</strong> 키워드가 본문에 하이라이트되어 있습니다.
              </span>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="font-semibold underline underline-offset-2 hover:opacity-80 shrink-0 cursor-pointer"
              >
                검색 초기화
              </button>
            </div>
          )}

          {activeSection === 'overview' && (
            <SectionOverview
              completedIds={completedIds}
              onToggleCheck={handleToggleCheck}
              searchQuery={searchQuery}
              onOpenGlossary={handleOpenGlossary}
              onNavigateSection={handleNavigate}
            />
          )}

          {activeSection === 'production' && (
            <SectionProductionGuide
              completedIds={completedIds}
              onToggleCheck={handleToggleCheck}
              searchQuery={searchQuery}
              onOpenGlossary={handleOpenGlossary}
              onNavigateSection={handleNavigate}
            />
          )}

          {activeSection === 'tools' && (
            <SectionTools
              completedIds={completedIds}
              onToggleCheck={handleToggleCheck}
              searchQuery={searchQuery}
              onOpenGlossary={handleOpenGlossary}
              onNavigateSection={handleNavigate}
            />
          )}

          {activeSection === 'legal' && (
            <SectionLegal
              completedIds={completedIds}
              onToggleCheck={handleToggleCheck}
              searchQuery={searchQuery}
              onNavigateSection={handleNavigate}
            />
          )}

          {activeSection === 'faq' && (
            <SectionFaq
              completedIds={completedIds}
              onToggleCheck={handleToggleCheck}
              searchQuery={searchQuery}
              onOpenGlossary={handleOpenGlossary}
              onNavigateSection={handleNavigate}
            />
          )}
        </main>
      </div>

      <GlossaryModal
        isOpen={glossaryOpen}
        initialTermId={glossaryTermId}
        onClose={() => setGlossaryOpen(false)}
      />

      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        completedIds={completedIds}
        options={exportOptions}
        onChangeOptions={setExportOptions}
      />

      <AiConceptModal
        isOpen={aiConceptOpen}
        onClose={() => setAiConceptOpen(false)}
        currentSection={activeSection}
        currentSubLabel={
          NAV_SECTIONS.find((s) => s.id === activeSection)?.subSections.find(
            (sub) => sub.id === activeSubId
          )?.label
        }
      />

      <QuickActionsMenu
        activeSection={activeSection}
        activeSubId={activeSubId}
        lastVisitedStage={lastVisitedStage}
        onJumpToActiveStage={() =>
          handleNavigate(lastVisitedStage.sectionId, lastVisitedStage.subId)
        }
        onOpenAiConcept={() => setAiConceptOpen(true)}
      />
      </div>

      <PrintReport completedIds={completedIds} options={exportOptions} />
    </>
  );
}
