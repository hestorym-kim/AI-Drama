import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, Download, Menu, Moon, Search, Sun, X, ArrowUpRight } from 'lucide-react';
import {
  GLOSSARY_ENTRIES,
  MainSectionId,
  NAV_SECTIONS,
  SEARCH_DOCUMENTS,
} from '../data/manualData';

interface TopBarProps {
  activeSection: MainSectionId;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onNavigate: (sectionId: MainSectionId, anchorId?: string) => void;
  onOpenGlossary: (termId?: string) => void;
  onOpenExport: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenMobileMenu: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeSection,
  searchQuery,
  onSearchChange,
  onNavigate,
  onOpenGlossary,
  onOpenExport,
  isDark,
  onToggleTheme,
  onOpenMobileMenu,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const searchWrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentSection = NAV_SECTIONS.find((s) => s.id === activeSection);
  const trimmed = searchQuery.trim().toLowerCase();

  const matchedDocs = trimmed
    ? SEARCH_DOCUMENTS.filter(
        (doc) =>
          doc.title.toLowerCase().includes(trimmed) ||
          doc.snippet.toLowerCase().includes(trimmed) ||
          doc.keywords.some((kw) => kw.toLowerCase().includes(trimmed))
      )
    : [];

  const matchedTerms = trimmed
    ? GLOSSARY_ENTRIES.filter(
        (g) =>
          g.term.toLowerCase().includes(trimmed) ||
          g.fullName.toLowerCase().includes(trimmed) ||
          g.shortDef.toLowerCase().includes(trimmed)
      )
    : [];

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    const handleShortcut = (e: KeyboardEvent) => {
      if (
        (e.key === '/' &&
          document.activeElement?.tagName !== 'INPUT' &&
          document.activeElement?.tagName !== 'TEXTAREA') ||
        ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')
      ) {
        e.preventDefault();
        inputRef.current?.focus();
        setDropdownOpen(true);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleShortcut);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleShortcut);
    };
  }, []);

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/90 dark:bg-[#0B0E14]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/90 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile menu button + Section indicator */}
      <div className="flex items-center gap-3 min-w-0 shrink-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="목차 열기"
          className="lg:hidden p-2 -ml-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
          <span className="font-mono tabular-nums text-amber-600 dark:text-amber-400 font-medium">
            {currentSection?.number}
          </span>
          <span aria-hidden="true">/</span>
          <span className="font-medium text-slate-800 dark:text-slate-200">
            {currentSection?.shortTitle}
          </span>
        </div>
      </div>

      {/* Center: Integrated Real-time Search */}
      <div ref={searchWrapperRef} className="relative flex-1 max-w-xl">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onFocus={() => setDropdownOpen(true)}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setDropdownOpen(true);
            }}
            placeholder="툴, 용어(I2V, Seed), 가이드 검색... (/)"
            aria-label="매뉴얼 통합 검색"
            className="w-full pl-10 pr-9 py-2 text-sm rounded-lg bg-slate-100 dark:bg-[#131822] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:bg-white dark:focus:bg-[#161C28] transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                onSearchChange('');
                inputRef.current?.focus();
              }}
              aria-label="검색어 지우기"
              className="absolute right-2.5 p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Live Search Results Dropdown */}
        {dropdownOpen && trimmed.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-2 rounded-xl bg-white dark:bg-[#131822] border border-slate-200 dark:border-slate-700/80 shadow-2xl max-h-[70vh] overflow-y-auto z-50 divide-y divide-slate-100 dark:divide-slate-800">
            {matchedDocs.length === 0 && matchedTerms.length === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
                "{searchQuery}"에 해당하는 가이드나 용어를 찾지 못했습니다.
              </div>
            ) : (
              <>
                {matchedDocs.length > 0 && (
                  <div className="p-2">
                    <div className="px-2.5 py-1.5 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                      본문 가이드 ({matchedDocs.length}) · 본문 내 키워드 자동 하이라이트됨
                    </div>
                    {matchedDocs.map((doc) => (
                      <button
                        key={doc.id}
                        type="button"
                        onClick={() => {
                          onNavigate(doc.sectionId, doc.anchorId);
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors flex items-start justify-between gap-3 cursor-pointer"
                      >
                        <div className="min-w-0">
                          <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                            {doc.breadcrumb}
                          </div>
                          <div className="text-sm font-medium text-slate-900 dark:text-slate-100 mt-0.5">
                            {doc.title}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                            {doc.snippet}
                          </p>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                      </button>
                    ))}
                  </div>
                )}

                {matchedTerms.length > 0 && (
                  <div className="p-2">
                    <div className="px-2.5 py-1.5 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                      AI 용어 사전 ({matchedTerms.length})
                    </div>
                    {matchedTerms.map((term) => (
                      <button
                        key={term.id}
                        type="button"
                        onClick={() => {
                          onOpenGlossary(term.id);
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-100">
                          <span>{term.term}</span>
                          <span className="text-xs text-slate-400" aria-hidden="true">
                            ·
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {term.fullName}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                          {term.shortDef}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Right: Export, Glossary & Dark/Light Mode Switch */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onOpenExport}
          aria-label="진행 상황 내보내기"
          title="진행 상황 내보내기 (PDF / 텍스트)"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-100 dark:bg-[#151A24] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span className="hidden md:inline">내보내기</span>
        </button>

        <button
          type="button"
          onClick={() => onOpenGlossary()}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-100 dark:bg-[#151A24] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span className="hidden sm:inline">용어 사전</span>
        </button>

        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
          title={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
          className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 dark:bg-[#151A24] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shrink-0 cursor-pointer"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>
      </div>
    </header>
  );
};
