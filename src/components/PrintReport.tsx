import React from 'react';
import { CHECKLIST_ITEMS } from '../data/manualData';
import {
  ExportOptions,
  SUMMARY_GUIDE_SECTIONS,
  getGroupedChecklist,
} from '../utils/exportGuide';

interface PrintReportProps {
  completedIds: string[];
  options: ExportOptions;
}

export const PrintReport: React.FC<PrintReportProps> = ({
  completedIds,
  options,
}) => {
  const totalCount = CHECKLIST_ITEMS.length;
  const completedCount = completedIds.filter((id) =>
    CHECKLIST_ITEMS.some((i) => i.id === id)
  ).length;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const grouped = getGroupedChecklist(completedIds);

  const dateStr = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="hidden print-only bg-white text-slate-900 p-0 text-sm leading-relaxed">
      {/* Print Header */}
      <div className="border-b-2 border-slate-900 pb-4 mb-6">
        <div className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">
          AI Drama Production Manual · Progress & Summary Report
        </div>
        <h1 className="text-2xl font-bold text-slate-950">
          올인원 AI 드라마 제작 실전 매뉴얼 — 진행 현황 & 요약 가이드
        </h1>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
          <span>출력 일자: {dateStr}</span>
          <span className="font-mono font-semibold text-slate-900">
            전체 진행률: {completedCount} / {totalCount} ({pct}%)
          </span>
        </div>
      </div>

      {/* Checklist Section */}
      {options.includeChecklist && (
        <section className="mb-8">
          <h2 className="text-base font-bold text-slate-950 border-b border-slate-300 pb-1.5 mb-4">
            1. 제작 공정 체크리스트 진행 상황
          </h2>
          <div className="space-y-4">
            {grouped.map((grp) => (
              <div key={grp.group} className="break-inside-avoid">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1.5 rounded mb-2">
                  <span>{grp.group}</span>
                  <span className="font-mono">
                    {grp.completedCount} / {grp.items.length}
                  </span>
                </div>
                <ul className="space-y-1.5 pl-1">
                  {grp.items.map((item) => (
                    <li key={item.id} className="flex items-start gap-2 text-xs">
                      <span
                        className={`inline-flex items-center justify-center w-4 h-4 mt-0.5 rounded border text-[10px] font-bold shrink-0 ${
                          item.completed
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'border-slate-400 text-transparent'
                        }`}
                      >
                        {item.completed ? '✓' : ''}
                      </span>
                      <div>
                        <span
                          className={
                            item.completed
                              ? 'font-medium text-slate-500 line-through'
                              : 'font-medium text-slate-900'
                          }
                        >
                          {item.label}
                        </span>
                        {item.detail && (
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {item.detail}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Summary Guide Section */}
      {options.includeSummaryGuide && (
        <section>
          <h2 className="text-base font-bold text-slate-950 border-b border-slate-300 pb-1.5 mb-4">
            2. AI 드라마 제작 실전 요약 가이드
          </h2>
          <div className="space-y-4">
            {SUMMARY_GUIDE_SECTIONS.map((sec) => (
              <div key={sec.title} className="break-inside-avoid">
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                  {sec.title}
                </h3>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-700">
                  {sec.bullets.map((bullet, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
