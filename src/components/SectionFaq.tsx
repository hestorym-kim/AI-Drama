import React, { useState } from 'react';
import {
  ArrowLeft,
  ChevronDown,
  HelpCircle,
  Wrench,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { CHECKLIST_ITEMS, MainSectionId } from '../data/manualData';
import { Callout } from './Callout';
import { CodePromptBox } from './CodePromptBox';
import { GlossaryTerm } from './GlossaryTerm';
import { HighlightText } from './HighlightText';
import { StepCheckbox } from './StepCheckbox';

interface SectionFaqProps {
  completedIds: string[];
  onToggleCheck: (id: string) => void;
  searchQuery: string;
  onOpenGlossary: (termId: string) => void;
  onNavigateSection: (sectionId: MainSectionId, anchorId?: string) => void;
}

interface FaqItem {
  id: string;
  code: string;
  question: string;
  tag: string;
  cause: string;
  solutions: string[];
  copyableSnippet?: {
    title: string;
    content: string;
  };
  relatedTermIds: string[];
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'q1',
    code: 'Q1',
    question: '컷마다 캐릭터 얼굴과 옷차림이 자꾸 바뀝니다 (Character Drift)',
    tag: '캐릭터 일관성',
    cause:
      '프롬프트에 매번 인물 스펙을 길게 새로 작성하거나, 기준 레퍼런스 시트 없이 단발성 텍스트로 비디오를 생성했기 때문입니다.',
    solutions: [
      '캐릭터당 2~3개의 시그니처 비주얼 앵커(예: 형광 연두색 조끼, 특정 은색 시계)만 지정하고 모든 프롬프트에 동일 문구로 기재하세요.',
      '플랫폼의 자산 바인딩 기능을 활용해 캐릭터 시트를 등록하고, 프롬프트에서 @Character1 또는 Image 1-2 is Character 1 형태의 고유 태그로만 호출하세요.',
    ],
    copyableSnippet: {
      title: '캐릭터 고유 태그 호출 예시',
      content: '@Character1 (Image 1-2 is Character 1), wearing a neon green vest and silver watch',
    },
    relatedTermIds: ['asset-binding', 'seed'],
  },
  {
    id: 'q2',
    code: 'Q2',
    question: '전신 샷(Full Body)을 만들면 인물 얼굴이 뭉개지거나 찌그러집니다',
    tag: '얼굴 왜곡 방지',
    cause:
      'AI가 전신 이미지 내의 작게 표현된 얼굴 영역을 정체성 레퍼런스로 착각하여 가중치가 무너지기 때문입니다.',
    solutions: [
      '전신 시트 생성 시 얼굴 부분은 마스킹(빗금 처리)하여 몸매와 의상 레퍼런스로만 사용하세요.',
      "얼굴 정체성은 반드시 별도의 '확대 클로즈업 샷(ECU/CU)' 시트에서만 가져오도록 레퍼런스 노드를 분리 설정하세요.",
    ],
    relatedTermIds: ['ecu-ms-ws', 'asset-binding'],
  },
  {
    id: 'q3',
    code: 'Q3',
    question: '비디오 렌더링 시 인물 손가락이나 신체 움직임이 기괴하게 일그러집니다',
    tag: '모션 왜곡',
    cause:
      '한 컷 프롬프트 안에 "걸어오면서 가방을 열고 손을 들어 인사한다"처럼 다중 복합 행동을 한꺼번에 입력했기 때문입니다.',
    solutions: [
      '1장면 1행동 원칙을 엄격히 적용하세요. 한 클립당 하나의 명확한 동작(예: "천천히 걸어온다")만 부여하고, 다음 동작은 컷을 나누어 숏 테이블에서 분리 렌더링해야 합니다.',
    ],
    copyableSnippet: {
      title: '단일 행동 프롬프트 교정 예시',
      content: 'Static shot with subtle motion, walking slowly toward the camera along the corridor',
    },
    relatedTermIds: ['i2v', 'first-last-frame'],
  },
  {
    id: 'q4',
    code: 'Q4',
    question: '씬이 바뀌면 배경 세트나 조명 톤이 완전히 다른 장소처럼 변합니다',
    tag: '공간·조명 연속성',
    cause: '장소에 대한 공간 디테일과 조명 설정이 컷마다 달라졌기 때문입니다.',
    solutions: [
      '세트 내 공간 불변 디테일(Invariant Detail) 1~2개(예: 특정 황동 벽등, 손상된 타일 패턴)를 선정하고 해당 세트가 나오는 모든 프롬프트에 동일하게 적으세요.',
      '씬 전체 프롬프트에 주 조명 방향(예: cinematic lighting from left 45 degrees)을 일관되게 고정하세요.',
    ],
    copyableSnippet: {
      title: '공간 불변 디테일 + 주 조명 고정 문구',
      content: 'brown brick wall background with brass wall lamp, cinematic lighting from left 45 degrees',
    },
    relatedTermIds: ['invariant-detail', 'key-light'],
  },
  {
    id: 'q5',
    code: 'Q5',
    question: '인물 대사와 입 모양이 맞지 않고 어색하게 어긋납니다 (Lip-Sync Mismatch)',
    tag: '오디오·립싱크',
    cause:
      '비디오 클립의 프레임 속도(FPS)와 AI 성우 음성 파일의 대사 템포가 일치하지 않거나 후가공 립싱크 툴의 정밀도가 떨어지기 때문입니다.',
    solutions: [
      'Seedance 2.0처럼 비디오 생성 시 오디오 음파에 맞추어 입 모양을 동기화하는 네이티브 립싱크(Native Lip-Sync) 엔진을 사용하세요.',
      '타임라인 편집 단계에서 대사 시작 위치의 프레임을 잘라 맞추고, 필요시 0.9x~1.1x 미세 속도 조절(Speed Ramp)을 적용하세요.',
    ],
    relatedTermIds: ['lip-sync', 'tts', 'audio-ref'],
  },
];

export const SectionFaq: React.FC<SectionFaqProps> = ({
  completedIds,
  onToggleCheck,
  searchQuery,
  onOpenGlossary,
  onNavigateSection,
}) => {
  const [openIds, setOpenIds] = useState<string[]>(['q1']);
  const faqChecklist = CHECKLIST_ITEMS.filter((item) => item.section === 'faq');

  const toggleItem = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const allOpen = openIds.length === FAQ_ITEMS.length;

  const toggleAll = () => {
    setOpenIds(allOpen ? [] : FAQ_ITEMS.map((item) => item.id));
  };

  return (
    <div className="space-y-12">
      {/* Chapter Hero */}
      <header className="space-y-5 border-b border-slate-200 dark:border-slate-800/80 pb-8">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-mono text-amber-600 dark:text-amber-400 font-semibold">
            05
          </span>
          <span aria-hidden="true">/</span>
          <span>초보자 FAQ 및 트러블슈팅</span>
          <span aria-hidden="true">·</span>
          <span>Troubleshooting Guide</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 leading-tight [text-wrap:balance]">
          <HighlightText
            text="5. 초보자 FAQ 및 트러블슈팅 (Troubleshooting Guide)"
            query={searchQuery}
          />
        </h1>

        <p className="text-[15px] sm:text-base leading-relaxed text-slate-600 dark:text-slate-300 max-w-3xl">
          AI 드라마 제작 과정에서 초보자가 가장 자주 부딪히는 5가지 핵심 오류(캐릭터 이탈, 얼굴 뭉개짐, 신체 왜곡, 배경/조명 불일치, 립싱크 어긋남)의 원인과 검증된 해결책입니다. 질문을 클릭해 해결 방법을 확인하세요.
        </p>
      </header>

      {/* 5.1 Accordion Troubleshooting List */}
      <section id="sec-5-1" className="scroll-mt-24 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
              <HighlightText text="5.1 핵심 오류 Q1 ~ Q5 해결 가이드" query={searchQuery} />
            </h2>
          </div>

          <button
            type="button"
            onClick={toggleAll}
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-[#151A24] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            {allOpen ? '모두 접기' : '모두 펼치기'}
          </button>
        </div>

        <div className="space-y-3.5">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openIds.includes(item.id);
            return (
              <div
                key={item.id}
                className={`rounded-xl border transition-colors overflow-hidden ${
                  isOpen
                    ? 'border-amber-500/40 bg-white dark:bg-[#131822]'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131822] hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <span className="font-mono tabular-nums text-sm font-bold text-amber-600 dark:text-amber-400 mt-0.5 shrink-0">
                      {item.code}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">
                        {item.tag}
                      </div>
                      <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                        <HighlightText text={item.question} query={searchQuery} />
                      </h3>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-amber-500' : ''
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-4">
                        {/* 원인 */}
                        <div className="rounded-lg bg-rose-50/70 dark:bg-rose-500/[0.06] border border-rose-200/80 dark:border-rose-500/25 p-3.5 space-y-1">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-700 dark:text-rose-300">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>발생 원인</span>
                          </div>
                          <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                            <HighlightText text={item.cause} query={searchQuery} />
                          </p>
                        </div>

                        {/* 해결책 */}
                        <div className="rounded-lg bg-emerald-50/60 dark:bg-emerald-500/[0.05] border border-emerald-200/80 dark:border-emerald-500/25 p-4 space-y-2.5">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                            <span>실전 해결책</span>
                          </div>
                          <ol className="space-y-2 text-sm text-slate-800 dark:text-slate-200 leading-relaxed list-decimal list-inside">
                            {item.solutions.map((sol, idx) => (
                              <li key={idx}>
                                <HighlightText text={sol} query={searchQuery} />
                              </li>
                            ))}
                          </ol>
                        </div>

                        {item.copyableSnippet && (
                          <CodePromptBox
                            title={item.copyableSnippet.title}
                            content={item.copyableSnippet.content}
                            searchQuery={searchQuery}
                            compact
                          />
                        )}

                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <Wrench className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>관련 용어:</span>
                          {item.relatedTermIds.map((termId) => (
                            <GlossaryTerm
                              key={termId}
                              termId={termId}
                              onOpenGlossary={onOpenGlossary}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <Callout variant="success" title="문제가 계속될 때: 480p 드래프트 재점검">
          <p>
            특정 컷의 오류가 해결되지 않을 때는 처음부터 고화질(1080p)로 재시도하지 말고,{' '}
            <button
              type="button"
              onClick={() => onNavigateSection('overview', 'sec-1-2')}
              className="font-semibold underline underline-offset-2 text-emerald-700 dark:text-emerald-300 cursor-pointer"
            >
              Gate 3(스틸 프레임)
            </button>
            으로 돌아가 앵커 샷 이미지 자체를 수정한 뒤{' '}
            <GlossaryTerm termId="480p-draft" onOpenGlossary={onOpenGlossary} /> 모드로 다시 테스트하세요.
          </p>
        </Callout>

        {/* QA Troubleshooting Checklist */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              품질 점검 및 트러블슈팅 완료 체크리스트
            </h3>
            <span className="font-mono tabular-nums text-xs text-slate-500 dark:text-slate-400">
              {faqChecklist.filter((i) => completedIds.includes(i.id)).length}/
              {faqChecklist.length} 완료
            </span>
          </div>
          <div className="space-y-2.5">
            {faqChecklist.map((item) => (
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
          onClick={() => onNavigateSection('legal')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#151A24] hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>이전: 4. 저작권·초상권 및 법령 가이드</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigateSection('overview')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
        >
          <span>처음으로: 1. 개요 및 로드맵</span>
        </button>
      </div>
    </div>
  );
};
