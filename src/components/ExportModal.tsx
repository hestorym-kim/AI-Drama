import React, { useEffect, useState } from 'react';
import {
  Check,
  Copy,
  Download,
  FileText,
  Printer,
  X,
} from 'lucide-react';
import { CHECKLIST_ITEMS } from '../data/manualData';
import {
  ExportOptions,
  buildExportText,
  downloadTextFile,
  getGroupedChecklist,
} from '../utils/exportGuide';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedIds: string[];
  options: ExportOptions;
  onChangeOptions: (next: ExportOptions) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  completedIds,
  options,
  onChangeOptions,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloadedMsg, setDownloadedMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const totalCount = CHECKLIST_ITEMS.length;
  const completedCount = completedIds.filter((id) =>
    CHECKLIST_ITEMS.some((i) => i.id === id)
  ).length;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const grouped = getGroupedChecklist(completedIds);

  const exportText = buildExportText(completedIds, options);
  const hasSelection = options.includeChecklist || options.includeSummaryGuide;

  const handleDownload = (ext: 'txt' | 'md') => {
    if (!hasSelection) return;
    downloadTextFile(exportText, ext);
    setDownloadedMsg(
      ext === 'txt' ? '텍스트(.txt) 파일이 저장되었습니다.' : '마크다운(.md) 파일이 저장되었습니다.'
    );
    window.setTimeout(() => setDownloadedMsg(null), 2500);
  };

  const handleCopy = async () => {
    if (!hasSelection) return;
    try {
      await navigator.clipboard.writeText(exportText);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = exportText;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const handlePrintPdf = () => {
    if (!hasSelection) return;
    onClose();
    window.setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <div
      className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
    >
      <div
        className="w-full max-w-3xl max-h-[88vh] flex flex-col rounded-2xl bg-white dark:bg-[#11151E] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <Download className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <div>
              <h2
                id="export-modal-title"
                className="text-base font-semibold text-slate-900 dark:text-slate-100"
              >
                진행 상황 및 요약 가이드 내보내기
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                현재 체크리스트 완료 현황과 핵심 요약 가이드를 PDF 또는 텍스트 파일로 저장합니다.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="내보내기 창 닫기"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Progress Overview */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B0E14] p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-800 dark:text-slate-100">
                현재 제작 공정 완료 현황
              </span>
              <span className="font-mono tabular-nums font-bold text-amber-600 dark:text-amber-400">
                {completedCount} / {totalCount} ({pct}%)
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-amber-500 dark:bg-amber-400 transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {grouped.map((grp) => (
                <div
                  key={grp.group}
                  className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#131822] border border-slate-200/80 dark:border-slate-800"
                >
                  <span className="text-slate-600 dark:text-slate-300 truncate pr-2">
                    {grp.group}
                  </span>
                  <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100 shrink-0">
                    {grp.completedCount}/{grp.items.length}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Export Content Toggles */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              포함할 항목 선택
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131822] cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.includeChecklist}
                  onChange={(e) =>
                    onChangeOptions({
                      ...options,
                      includeChecklist: e.target.checked,
                    })
                  }
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
                <div className="text-xs">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    체크리스트 진행 상황
                  </div>
                  <div className="text-slate-500 dark:text-slate-400">
                    23개 공정·게이트·법령 점검 항목
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131822] cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.includeSummaryGuide}
                  onChange={(e) =>
                    onChangeOptions({
                      ...options,
                      includeSummaryGuide: e.target.checked,
                    })
                  }
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
                <div className="text-xs">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    5개 챕터 요약 가이드
                  </div>
                  <div className="text-slate-500 dark:text-slate-400">
                    프롬프트 공식, 툴 스택, 법령, FAQ 요약
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Preview Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                문서 미리보기
              </span>
              <button
                type="button"
                disabled={!hasSelection}
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 hover:underline disabled:opacity-40 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-500">전체 복사 완료</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>클립보드에 복사</span>
                  </>
                )}
              </button>
            </div>

            {hasSelection ? (
              <pre className="h-52 overflow-y-auto rounded-xl bg-slate-900 dark:bg-[#0B0E14] border border-slate-800 p-4 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap break-words">
                {exportText}
              </pre>
            ) : (
              <div className="h-32 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-xs text-slate-500 dark:text-slate-400">
                내보낼 항목을 1개 이상 선택해 주세요.
              </div>
            )}
          </div>

          {downloadedMsg && (
            <div className="rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-2 text-xs font-medium text-emerald-700 dark:text-emerald-300">
              {downloadedMsg}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0D1017] flex flex-wrap items-center justify-end gap-2.5">
          <button
            type="button"
            disabled={!hasSelection}
            onClick={() => handleDownload('md')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium bg-white dark:bg-[#151A24] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 disabled:opacity-40 transition-colors cursor-pointer whitespace-nowrap"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>마크다운(.md) 저장</span>
          </button>

          <button
            type="button"
            disabled={!hasSelection}
            onClick={() => handleDownload('txt')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 hover:opacity-90 disabled:opacity-40 transition-opacity cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>텍스트(.txt) 저장</span>
          </button>

          <button
            type="button"
            disabled={!hasSelection}
            onClick={handlePrintPdf}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 disabled:opacity-40 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PDF로 저장 (인쇄)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
