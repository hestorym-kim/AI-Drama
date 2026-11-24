import React, { useState, useEffect } from 'react';
import { X, Search, ChevronDown, BookOpen } from 'lucide-react';
import { GLOSSARY_ENTRIES, GlossaryEntry } from '../data/manualData';

interface GlossaryModalProps {
  isOpen: boolean;
  initialTermId?: string | null;
  onClose: () => void;
}

const CATEGORIES: Array<'전체' | GlossaryEntry['category']> = [
  '전체',
  '기획/연출',
  '일관성 제어',
  '영상/생성',
  '오디오/후반',
  '파이프라인',
];

export const GlossaryModal: React.FC<GlossaryModalProps> = ({
  isOpen,
  initialTermId,
  onClose,
}) => {
  const [filterText, setFilterText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'전체' | GlossaryEntry['category']>('전체');
  const [expandedId, setExpandedId] = useState<string | null>(initialTermId || 'i2v');

  useEffect(() => {
    if (isOpen && initialTermId) {
      setExpandedId(initialTermId);
      setSelectedCategory('전체');
      setFilterText('');
    }
  }, [isOpen, initialTermId]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = GLOSSARY_ENTRIES.filter((entry) => {
    const matchCat = selectedCategory === '전체' || entry.category === selectedCategory;
    const q = filterText.trim().toLowerCase();
    const matchText =
      !q ||
      entry.term.toLowerCase().includes(q) ||
      entry.fullName.toLowerCase().includes(q) ||
      entry.shortDef.toLowerCase().includes(q) ||
      entry.detailedDef.toLowerCase().includes(q);
    return matchCat && matchText;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="glossary-modal-title"
    >
      <div
        className="w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl bg-white dark:bg-[#11151E] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <div>
              <h2
                id="glossary-modal-title"
                className="text-base font-semibold text-slate-900 dark:text-slate-100"
              >
                AI 드라마 제작 핵심 용어 사전
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                낯선 전문 용어를 클릭해 개념과 실전 적용 팁을 확인하세요.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="용어 사전 닫기"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 space-y-3 bg-slate-50/60 dark:bg-[#0D1017]">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="용어 검색 (예: I2V, Seed, 립싱크, Anchor Shot...)"
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-white dark:bg-[#151A24] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 font-semibold'
                    : 'bg-white dark:bg-[#151A24] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2.5">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
              검색어와 일치하는 용어가 없습니다.
            </div>
          ) : (
            filtered.map((item) => {
              const isExpanded = expandedId === item.id;
              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#151A24] overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    aria-expanded={isExpanded}
                    className="w-full flex items-center justify-between gap-4 px-4 py-3.5 text-left hover:bg-slate-50 dark:hover:bg-[#1A202C] transition-colors cursor-pointer"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5">
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {item.term}
                        </span>
                        <span className="text-xs text-slate-400" aria-hidden="true">
                          ·
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {item.fullName}
                        </span>
                        <span className="text-xs text-slate-400" aria-hidden="true">
                          ·
                        </span>
                        <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                          {item.category}
                        </span>
                      </div>
                      {!isExpanded && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-1">
                          {item.shortDef}
                        </p>
                      )}
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-150 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5 text-sm">
                      <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                        {item.shortDef}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {item.detailedDef}
                      </p>
                      <div className="rounded-lg bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 px-3 py-2 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                        <span className="font-semibold">초보자 팁: </span>
                        {item.beginnerTip}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
