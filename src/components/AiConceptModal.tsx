import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  Loader2,
  RefreshCw,
  Sparkles,
  Wrench,
  X,
} from 'lucide-react';
import { MainSectionId, NAV_SECTIONS } from '../data/manualData';
import { CodePromptBox } from './CodePromptBox';

interface AiConceptModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSection: MainSectionId;
  currentSubLabel?: string;
}

interface GeneratedConceptResponse {
  conceptTitle: string;
  logline: string;
  keyFocus: string;
  phaseActionPlan: string[];
  copyableAssetTitle: string;
  copyableAsset: string;
  recommendedTools: string[];
}

const STARTER_IDEAS = [
  '재벌가 숨겨진 막내딸의 기억 회복 복수극',
  '빗속 편의점에서 시작되는 5분 타임루프 미스터리',
  '계약 결혼한 AI 스타트업 대표의 비밀 폭로전',
];

export const AiConceptModal: React.FC<AiConceptModalProps> = ({
  isOpen,
  onClose,
  currentSection,
  currentSubLabel,
}) => {
  const [selectedPhase, setSelectedPhase] = useState<MainSectionId>(currentSection);
  const [userIdea, setUserIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GeneratedConceptResponse | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedPhase(currentSection);
    }
  }, [isOpen, currentSection]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const activePhaseMeta =
    NAV_SECTIONS.find((s) => s.id === selectedPhase) || NAV_SECTIONS[0];

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-concept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phaseId: selectedPhase,
          phaseTitle: `${activePhaseMeta.number}. ${activePhaseMeta.title}`,
          subSectionLabel:
            selectedPhase === currentSection ? currentSubLabel || '' : '',
          userIdea: userIdea.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data?.error || `요청 처리 중 오류가 발생했습니다 (HTTP ${response.status})`
        );
      }

      setResult(data as GeneratedConceptResponse);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'AI 컨셉을 생성하는 중 네트워크 오류가 발생했습니다.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-concept-modal-title"
    >
      <div
        className="w-full max-w-2xl max-h-[88vh] flex flex-col rounded-2xl bg-white dark:bg-[#11151E] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <div>
              <h2
                id="ai-concept-modal-title"
                className="text-base font-semibold text-slate-900 dark:text-slate-100"
              >
                현재 제작 단계 맞춤 AI 컨셉 생성기
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                현재 단계에 맞는 60~75초 숏폼 드라마 컨셉, 실행 계획, 복사용 프롬프트를 생성합니다.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="창 닫기"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <form onSubmit={handleGenerate} className="space-y-4">
            {/* Phase Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block">
                대상 제작 단계
              </label>
              <div className="flex flex-wrap gap-1.5">
                {NAV_SECTIONS.map((sec) => {
                  const active = selectedPhase === sec.id;
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => setSelectedPhase(sec.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                        active
                          ? 'bg-amber-500 text-slate-950 font-semibold'
                          : 'bg-slate-100 dark:bg-[#151A24] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      {sec.number}. {sec.shortTitle}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Idea Input */}
            <div className="space-y-2">
              <label
                htmlFor="ai-concept-idea-input"
                className="text-xs font-semibold text-slate-600 dark:text-slate-300 block"
              >
                드라마 소재 또는 키워드 (선택 사항)
              </label>
              <input
                id="ai-concept-idea-input"
                type="text"
                value={userIdea}
                onChange={(e) => setUserIdea(e.target.value)}
                placeholder="예: 낡은 황동 시계로 시간을 되돌리는 여주인공, 사내 비밀 연애 스릴러..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-[#0B0E14] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-slate-400 mr-1">추천 소재:</span>
                {STARTER_IDEAS.map((idea) => (
                  <button
                    key={idea}
                    type="button"
                    onClick={() => setUserIdea(idea)}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 dark:bg-[#151A24] text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-300 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
                  >
                    {idea}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-950 text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>AI 컨셉 생성 중...</span>
                  </>
                ) : result ? (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>다시 생성하기</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>AI 컨셉 생성</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Error Display */}
          {error && (
            <div className="rounded-xl border border-rose-300 dark:border-rose-500/40 bg-rose-50/80 dark:bg-rose-500/[0.08] p-4 flex items-start gap-2.5 text-sm text-rose-800 dark:text-rose-200">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          {/* Result Display */}
          {result && !loading && (
            <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="rounded-xl border border-amber-500/30 bg-amber-50/50 dark:bg-amber-500/[0.06] p-4 space-y-2">
                <div className="text-xs font-mono font-semibold text-amber-700 dark:text-amber-300">
                  {activePhaseMeta.number}. {activePhaseMeta.shortTitle} 맞춤 결과
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {result.conceptTitle}
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  {result.logline}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B0E14] p-4 space-y-1.5">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  핵심 포인트
                </div>
                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                  {result.keyFocus}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131822] p-4 space-y-2.5">
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  단계별 실행 액션 플랜
                </div>
                <ol className="space-y-1.5 text-sm text-slate-700 dark:text-slate-300 list-decimal list-inside">
                  {result.phaseActionPlan.map((step, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <CodePromptBox
                title={result.copyableAssetTitle || '바로 쓰는 실전 템플릿'}
                content={result.copyableAsset}
                compact
              />

              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                <Wrench className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="font-semibold">추천 툴 조합:</span>
                <span>{result.recommendedTools.join(' · ')}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
