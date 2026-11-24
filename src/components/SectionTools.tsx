import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Cpu,
  Filter,
  Layers,
  AlertCircle,
} from 'lucide-react';
import {
  AI_TOOLS,
  CHECKLIST_ITEMS,
  MainSectionId,
  ToolFilterCategory,
  ToolItem,
} from '../data/manualData';
import { GlossaryTerm } from './GlossaryTerm';
import { HighlightText } from './HighlightText';
import { StepCheckbox } from './StepCheckbox';

interface SectionToolsProps {
  completedIds: string[];
  onToggleCheck: (id: string) => void;
  searchQuery: string;
  onOpenGlossary: (termId: string) => void;
  onNavigateSection: (sectionId: MainSectionId, anchorId?: string) => void;
}

const FILTER_TABS: Array<{ id: ToolFilterCategory; label: string }> = [
  { id: '전체', label: '전체' },
  { id: '기획', label: '기획' },
  { id: '이미지', label: '이미지' },
  { id: '비디오', label: '비디오' },
  { id: '오디오', label: '오디오' },
  { id: '편집', label: '편집 · 캔버스' },
];

const DIFFICULTY_FILTERS: Array<'전체' | ToolItem['difficulty']> = [
  '전체',
  '쉬움',
  '보통',
  '어려움',
];

const DIFFICULTY_BADGE_STYLES: Record<ToolItem['difficulty'], string> = {
  쉬움: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  보통: 'bg-amber-500/12 text-amber-700 dark:text-amber-300 border-amber-500/30',
  어려움: 'bg-rose-500/12 text-rose-700 dark:text-rose-300 border-rose-500/30',
};

export const SectionTools: React.FC<SectionToolsProps> = ({
  completedIds,
  onToggleCheck,
  searchQuery,
  onOpenGlossary,
  onNavigateSection,
}) => {
  const toolChecklist = CHECKLIST_ITEMS.filter((item) => item.section === 'tools');
  const [selectedCategory, setSelectedCategory] = useState<ToolFilterCategory>('전체');
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    '전체' | ToolItem['difficulty']
  >('전체');

  const trimmed = searchQuery.trim().toLowerCase();

  const filteredTools = AI_TOOLS.filter((tool) => {
    const matchCategory =
      selectedCategory === '전체' || tool.filterCategories.includes(selectedCategory);
    const matchDifficulty =
      selectedDifficulty === '전체' || tool.difficulty === selectedDifficulty;
    const matchQuery =
      !trimmed ||
      tool.name.toLowerCase().includes(trimmed) ||
      tool.sourceCategory.toLowerCase().includes(trimmed) ||
      tool.features.toLowerCase().includes(trimmed) ||
      tool.recommendedUse.toLowerCase().includes(trimmed) ||
      tool.pricingAndTerms.toLowerCase().includes(trimmed);
    return matchCategory && matchDifficulty && matchQuery;
  });

  const getCategoryCount = (cat: ToolFilterCategory) => {
    if (cat === '전체') return AI_TOOLS.length;
    return AI_TOOLS.filter((t) => t.filterCategories.includes(cat)).length;
  };

  return (
    <div className="space-y-12">
      {/* Chapter Hero */}
      <header className="space-y-5 border-b border-slate-200 dark:border-slate-800/80 pb-8">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-mono text-amber-600 dark:text-amber-400 font-semibold">
            03
          </span>
          <span aria-hidden="true">/</span>
          <span>필수 AI 제작 툴 디렉토리</span>
          <span aria-hidden="true">·</span>
          <span>AI Tool Stack Directory · 총 {AI_TOOLS.length}종</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 leading-tight [text-wrap:balance]">
          <HighlightText
            text="3. 필수 AI 제작 툴 디렉토리 (AI Tool Stack Directory)"
            query={searchQuery}
          />
        </h1>

        <p className="text-[15px] sm:text-base leading-relaxed text-slate-600 dark:text-slate-300 max-w-3xl">
          AI 드라마 파이프라인에서 활용되는 18가지 핵심 제작 도구를 기능별로 분류하고, 핵심 특장점, 파이프라인 내 추천 단계, 비용 및 약관상 제약 조건, 초보자 난이도를 정리한 실전 디렉토리입니다.
        </p>

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>관련 핵심 용어:</span>
          <GlossaryTerm termId="mcp" onOpenGlossary={onOpenGlossary} />
          <GlossaryTerm termId="i2v" onOpenGlossary={onOpenGlossary} />
          <GlossaryTerm termId="lip-sync" onOpenGlossary={onOpenGlossary} />
          <GlossaryTerm termId="tts" onOpenGlossary={onOpenGlossary} />
        </div>
      </header>

      {/* 3.1 카테고리별 필터링 & 카드 디렉토리 */}
      <section id="sec-3-1" className="scroll-mt-24 space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
              <HighlightText text="3.1 카테고리별 AI 툴 스택 카드" query={searchQuery} />
            </h2>
            <span className="font-mono tabular-nums text-xs text-slate-500 dark:text-slate-400">
              표시 중: {filteredTools.length} / {AI_TOOLS.length}개 툴
            </span>
          </div>

          {/* Filter Bar */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131822] p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Category Segmented Controls */}
            <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="카테고리 필터">
              {FILTER_TABS.map((tab) => {
                const active = selectedCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedCategory(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                      active
                        ? 'bg-amber-500 text-slate-950 font-semibold'
                        : 'bg-slate-100 dark:bg-[#0B0E14] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    {tab.label}{' '}
                    <span className="font-mono tabular-nums opacity-75">
                      ({getCategoryCount(tab.id)})
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                <Filter className="w-3.5 h-3.5" />
                난이도
              </span>
              <div className="flex items-center gap-1">
                {DIFFICULTY_FILTERS.map((diff) => {
                  const active = selectedDifficulty === diff;
                  return (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setSelectedDifficulty(diff)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                        active
                          ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {diff}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Tool Cards Grid */}
        {filteredTools.length === 0 ? (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131822] p-10 text-center space-y-3">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              선택한 필터 또는 검색 조건과 일치하는 AI 툴이 없습니다.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('전체');
                setSelectedDifficulty('전체');
              }}
              className="px-4 py-2 rounded-lg bg-amber-500 text-slate-950 text-xs font-semibold cursor-pointer"
            >
              필터 초기화
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTools.map((tool) => {
              const hasTermCaveat =
                tool.pricingAndTerms.includes('불가') ||
                tool.pricingAndTerms.includes('유료 구독 곡만') ||
                tool.pricingAndTerms.includes('$1M');

              return (
                <article
                  key={tool.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131822] p-5 flex flex-col justify-between gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                >
                  <div className="space-y-3.5">
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <Cpu className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span className="truncate">
                            <HighlightText text={tool.sourceCategory} query={searchQuery} />
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">
                          <HighlightText text={tool.name} query={searchQuery} />
                        </h3>
                      </div>

                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border whitespace-nowrap shrink-0 ${DIFFICULTY_BADGE_STYLES[tool.difficulty]}`}
                      >
                        난이도 · {tool.difficulty}
                      </span>
                    </div>

                    {/* Features & Recommended Use */}
                    <div className="space-y-2.5 text-sm">
                      <div>
                        <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mb-0.5">
                          핵심 기능 및 특장점
                        </div>
                        <p className="text-slate-700 dark:text-slate-200 leading-relaxed text-[13px]">
                          <HighlightText text={tool.features} query={searchQuery} />
                        </p>
                      </div>

                      <div>
                        <div className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 mb-0.5">
                          파이프라인 내 추천 용도
                        </div>
                        <p className="text-slate-800 dark:text-slate-100 font-medium leading-relaxed text-[13px]">
                          <HighlightText text={tool.recommendedUse} query={searchQuery} />
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Cost & Terms Footer */}
                  <div
                    className={`rounded-lg px-3.5 py-2.5 text-xs border flex items-start gap-2 ${
                      hasTermCaveat
                        ? 'bg-amber-50/70 dark:bg-amber-500/[0.06] border-amber-200 dark:border-amber-500/25 text-amber-900 dark:text-amber-200'
                        : 'bg-slate-50 dark:bg-[#0B0E14] border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {hasTermCaveat && (
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-semibold">비용 및 약관: </span>
                      <HighlightText text={tool.pricingAndTerms} query={searchQuery} />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* 3.2 전체 18종 약관·비용 요약표 */}
      <section
        id="sec-3-2"
        className="scroll-mt-24 space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800/80"
      >
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            <HighlightText text="3.2 전체 18종 툴 스택 한눈에 비교표" query={searchQuery} />
          </h2>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-[#131822]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0E121A] text-xs font-semibold text-slate-600 dark:text-slate-300">
                  <th className="py-3 px-4 whitespace-nowrap">툴 명칭</th>
                  <th className="py-3 px-4 whitespace-nowrap">카테고리</th>
                  <th className="py-3 px-4">핵심 기능 및 특장점</th>
                  <th className="py-3 px-4">추천 용도</th>
                  <th className="py-3 px-4">비용 및 약관 제약</th>
                  <th className="py-3 px-4 whitespace-nowrap text-center">난이도</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 text-xs sm:text-[13px]">
                {AI_TOOLS.map((tool) => (
                  <tr
                    key={tool.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                      <HighlightText text={tool.name} query={searchQuery} />
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      <HighlightText text={tool.sourceCategory} query={searchQuery} />
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                      <HighlightText text={tool.features} query={searchQuery} />
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-200">
                      <HighlightText text={tool.recommendedUse} query={searchQuery} />
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      <HighlightText text={tool.pricingAndTerms} query={searchQuery} />
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${DIFFICULTY_BADGE_STYLES[tool.difficulty]}`}
                      >
                        {tool.difficulty}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tool Setup Checklist */}
        <div className="space-y-3 pt-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              툴 스택 세팅 완료 체크리스트
            </h3>
            <span className="font-mono tabular-nums text-xs text-slate-500 dark:text-slate-400">
              {toolChecklist.filter((i) => completedIds.includes(i.id)).length}/
              {toolChecklist.length} 완료
            </span>
          </div>
          <div className="space-y-2.5">
            {toolChecklist.map((item) => (
              <StepCheckbox
                key={item.id}
                id={item.id}
                label={item.label}
                checked={completedIds.includes(item.id)}
                onToggle={onToggleCheck}
                searchQuery={searchQuery}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Navigation */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => onNavigateSection('production')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#151A24] hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>이전: 2. 단계별 실전 제작 가이드</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigateSection('legal')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
        >
          <span>다음: 4. 저작권·초상권 및 법령 가이드</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
