import React, { useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Layers,
  ShieldAlert,
  Wrench,
} from 'lucide-react';
import { CHECKLIST_ITEMS, MainSectionId } from '../data/manualData';
import { Callout } from './Callout';
import { GlossaryTerm } from './GlossaryTerm';
import { HighlightText } from './HighlightText';
import { StepCheckbox } from './StepCheckbox';

interface SectionOverviewProps {
  completedIds: string[];
  onToggleCheck: (id: string) => void;
  searchQuery: string;
  onOpenGlossary: (termId: string) => void;
  onNavigateSection: (sectionId: MainSectionId, anchorId?: string) => void;
}

interface GateItem {
  id: string;
  checkId: string;
  gateNumber: string;
  title: string;
  subtitle: string;
  criteria: string;
  passCondition: string;
  blockerNote?: string;
}

const REVIEW_GATES: GateItem[] = [
  {
    id: 'gate-1',
    checkId: 'gate-1',
    gateNumber: 'Gate 1',
    title: '스토리 아웃라인 게이트',
    subtitle: 'Story Outline Gate',
    criteria: '화면비(9:16 세로형 또는 16:9 가로형), 로그라인, 서사적 갈등의 직관성 검증.',
    passCondition:
      '제3자가 로그라인 두 문장만 읽고도 등장인물의 목적과 핵심 갈등을 즉시 이해할 수 있어야 함. 불합격 시 비주얼 생성 단계 진입 전면 차단.',
  },
  {
    id: 'gate-2',
    checkId: 'gate-2',
    gateNumber: 'Gate 2',
    title: '캐스팅 및 캐릭터 바인딩 게이트',
    subtitle: 'Casting & Identity Gate',
    criteria:
      '정면 메인 이미지를 기준점으로 다각도 룩과 표정이 담긴 레퍼런스를 개별 캐릭터 자산으로 등록 및 바인딩.',
    passCondition:
      '캐릭터당 2~3개의 시그니처 비주얼 앵커 속성이 확정되고 고유 ID(@Character1)가 부여되어야 함.',
  },
  {
    id: 'gate-3',
    checkId: 'gate-3',
    gateNumber: 'Gate 3',
    title: '샷 카드 및 스틸 프레임 승인 게이트',
    subtitle: 'Shot List & Still Frame Gate',
    criteria:
      '대본을 장소, 시간, 캐릭터, 감정 목적, 프레이밍 정보가 포함된 샷 카드로 분해한 후 정지 이미지(Still Frame) 1차 검토.',
    passCondition:
      '앵커 숏(Anchor Shot)의 구도, 조명, 인물 표정이 승인된 샷만 비디오 생성 단계로 이관.',
  },
  {
    id: 'gate-4',
    checkId: 'gate-4',
    gateNumber: 'Gate 4',
    title: '승인 스틸 기반 비디오 생성 게이트',
    subtitle: 'Approved Still Video Generation Gate',
    criteria: 'Gate 3을 통과한 스틸 프레임만을 I2V 엔진에 입력하여 연속 동작 클립 렌더링.',
    passCondition:
      '인물의 프레임 당 단일 동작(1장면 1행동) 유지 및 신체 뭉개짐 여부 검증.',
  },
  {
    id: 'gate-5',
    checkId: 'gate-5',
    gateNumber: 'Gate 5',
    title: '오디오 합성 및 타임라인 컷 편집 게이트',
    subtitle: 'Voice-to-Cut & Timeline Editing Gate',
    criteria:
      '비디오 클립을 타임라인에 배치하고 TTS, 립싱크, BGM/SFX 레이어링 후 리듬감 청음.',
    passCondition: '대사 전달력, 립싱크 자연스러움, 템포 타임라인 완결성 확보.',
  },
];

const PIPELINE_STEPS = [
  {
    step: '01',
    checkId: 'pipe-1',
    title: '기획 및 시나리오',
    eng: 'Pre-Production',
    desc: '로그라인 설정, 3단 서사 구조(Hook-Conflict-Cliffhanger) 설계 및 숏 테이블 작성.',
  },
  {
    step: '02',
    checkId: 'pipe-2',
    title: '비주얼 자산 및 캐릭터 고정',
    eng: 'Asset Binding',
    desc: '등장인물 캐릭터 시트, 대표 소품 시트, 로케이션(배경) 시트 생성 및 고정.',
  },
  {
    step: '03',
    checkId: 'pipe-3',
    title: '스토리보드 및 스틸 프레임 승인',
    eng: 'Still Frame Gate',
    desc: '샷 카드 분해 및 1차 정지 이미지 렌더링을 통한 액션/구도 검증.',
  },
  {
    step: '04',
    checkId: 'pipe-4',
    title: '비디오 클립 생성',
    eng: 'Video Generation',
    desc: '검증된 스틸 이미지를 Image-to-Video(I2V) 및 Multi-reference 비디오 엔진으로 넘겨 3~6초 클립 렌더링.',
  },
  {
    step: '05',
    checkId: 'pipe-5',
    title: '오디오 합성 및 타임라인 편집',
    eng: 'Audio & Editing',
    desc: 'AI 성우 보이스오버(TTS), 립싱크(Lip-Sync), BGM/SFX 오디오 레이어링 및 컷 조립.',
  },
  {
    step: '06',
    checkId: 'pipe-6',
    title: '드래프트 검증 및 최종 업스케일링',
    eng: 'Post-Production',
    desc: '480p 저화질 드래프트 컷 연결성 점검 후 확정된 컷만 1080p 고화질 업스케일링 및 자막 마감.',
  },
];

const COMPARISON_ROWS = [
  {
    item: '분당 제작비',
    traditional: '약 $3,000 ~ $10,000+',
    ai: '약 $30 내외 (약 1/100 수준 절감)',
  },
  {
    item: '제작 기간 (100회 에피소드 기준)',
    traditional: '최소 3개월 ~ 6개월 이상',
    ai: '3일 ~ 7일 이내 완편 생성',
  },
  {
    item: '인력 구조',
    traditional: '배우, 감독, 촬영기사, 조명팀, 편집자 등 수십 명',
    ai: '1인 크리에이터 또는 소규모 (2~3인) 팀',
  },
  {
    item: '연속성 제어 방식',
    traditional: '실물 세트 및 동일 배우 촬영으로 자연 유지',
    ai: '캐릭터 시트, 앵커 속성, 레퍼런스 노드 고정 필요',
  },
  {
    item: '수정 및 재작업',
    traditional: '재촬영 필요 (고비용, 시간 지연)',
    ai: '저화질 드래프트 렌더링 후 특정 컷 프롬프트/시트 재생성',
  },
];

export const SectionOverview: React.FC<SectionOverviewProps> = ({
  completedIds,
  onToggleCheck,
  searchQuery,
  onOpenGlossary,
  onNavigateSection,
}) => {
  const [openGateId, setOpenGateId] = useState<string>('gate-1');
  const prepItems = CHECKLIST_ITEMS.filter((item) => item.group === '1.4 사전 자산 체크리스트');

  return (
    <div className="space-y-12">
      {/* Chapter Hero */}
      <header className="space-y-5 border-b border-slate-200 dark:border-slate-800/80 pb-8">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-mono text-amber-600 dark:text-amber-400 font-semibold">
            01
          </span>
          <span aria-hidden="true">/</span>
          <span>개요 및 로드맵</span>
          <span aria-hidden="true">·</span>
          <span>6단계 파이프라인 · 5단계 검토 게이트</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 leading-tight [text-wrap:balance]">
          <HighlightText text="1. 개요 및 AI 드라마 제작 로드맵" query={searchQuery} />
        </h1>

        <p className="text-[15px] sm:text-base leading-relaxed text-slate-600 dark:text-slate-300 max-w-3xl">
          <HighlightText
            text="생성형 인공지능(Generative AI) 기술의 발전은 기존의 미디어 및 영상 제작 파이프라인에 근본적인 구조적 개편을 가져왔습니다. 과거 막대한 자본과 대규모 연출 인력, 수개월의 후반 작업이 필수적이었던 영상 콘텐츠 제작 공정은 LLM 기반 기획, 이미지 렌더링, 비디오 생성, 음성 합성, 타임라인 편집에 이르기까지 자동화된 에이전트 파이프라인으로 일원화되고 있습니다."
            query={searchQuery}
          />
        </p>

        <Callout variant="tip" title="핵심 패러다임: 무작위 프롬프트에서 공정 통제로">
          <p>
            특히 <span className="font-mono tabular-nums font-semibold">60초~75초</span> 내외의 세로형 비디오 형태로 소비되는{' '}
            <GlossaryTerm termId="micro-drama" label="마이크로드라마(Micro-drama)" onOpenGlossary={onOpenGlossary} />{' '}
            및 AI 숏드라마 분야에서는 분당 제작 비용이{' '}
            <span className="font-mono tabular-nums font-semibold text-amber-700 dark:text-amber-300">
              약 30달러
            </span>{' '}
            수준으로 하락함에 따라, 무작위 프롬프트 생성을 넘어 엄격한 공정 통제 체계가 제작사의 핵심 경쟁력이 되었습니다.
          </p>
        </Callout>
      </header>

      {/* 1.1 표준 6단계 제작 파이프라인 */}
      <section id="sec-1-1" className="scroll-mt-24 space-y-5">
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            <HighlightText text="1.1 표준 6단계 제작 파이프라인" query={searchQuery} />
          </h2>
          <p className="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">
            AI 드라마 제작은 우연성에 의존하는 작화를 지양하고 재사용 가능한 디지털 자산(Asset)을 중심으로 아래 6단계를 순차적으로 거쳐 완성됩니다. 각 단계를 완료할 때마다 체크박스를 눌러 진행률을 기록하세요.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {PIPELINE_STEPS.map((item) => {
            const isChecked = completedIds.includes(item.checkId);
            return (
              <div
                key={item.step}
                className={`rounded-xl border p-4 transition-colors ${
                  isChecked
                    ? 'bg-emerald-50/40 dark:bg-emerald-500/[0.05] border-emerald-200 dark:border-emerald-500/30'
                    : 'bg-white dark:bg-[#131822] border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-mono tabular-nums font-semibold text-amber-600 dark:text-amber-400">
                        STEP {item.step}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{item.eng}</span>
                    </div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mt-1">
                      <HighlightText text={item.title} query={searchQuery} />
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleCheck(item.checkId)}
                    aria-pressed={isChecked}
                    aria-label={`${item.title} 완료 표시`}
                    className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                      isChecked
                        ? 'bg-emerald-600 dark:bg-emerald-500 border-emerald-600 dark:border-emerald-500 text-white dark:text-slate-950'
                        : 'bg-slate-50 dark:bg-[#0B0E14] border-slate-300 dark:border-slate-700 text-transparent hover:border-amber-500'
                    }`}
                  >
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  <HighlightText text={item.desc} query={searchQuery} />
                </p>

                {item.step === '02' && (
                  <div className="mt-2.5 text-xs text-slate-500 dark:text-slate-400">
                    핵심 개념:{' '}
                    <GlossaryTerm termId="asset-binding" onOpenGlossary={onOpenGlossary} />
                  </div>
                )}
                {item.step === '04' && (
                  <div className="mt-2.5 text-xs text-slate-500 dark:text-slate-400">
                    핵심 개념: <GlossaryTerm termId="i2v" onOpenGlossary={onOpenGlossary} />
                  </div>
                )}
                {item.step === '05' && (
                  <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>핵심 개념:</span>
                    <GlossaryTerm termId="tts" onOpenGlossary={onOpenGlossary} />
                    <GlossaryTerm termId="lip-sync" onOpenGlossary={onOpenGlossary} />
                    <GlossaryTerm termId="sfx-bgm" onOpenGlossary={onOpenGlossary} />
                  </div>
                )}
                {item.step === '06' && (
                  <div className="mt-2.5 text-xs text-slate-500 dark:text-slate-400">
                    핵심 개념:{' '}
                    <GlossaryTerm termId="480p-draft" onOpenGlossary={onOpenGlossary} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 1.2 5단계 검토 게이트 (Review Gates) 체계 */}
      <section id="sec-1-2" className="scroll-mt-24 space-y-5">
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            <HighlightText text="1.2 5단계 검토 게이트 (Review Gates) 체계" query={searchQuery} />
          </h2>
          <p className="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">
            제작 비용과 크레딧 낭비를 막고 재작업(Re-work) 비율을 최소화하기 위해 각 공정 사이에 5가지 엄격한 승인 지점(
            <GlossaryTerm termId="review-gate" onOpenGlossary={onOpenGlossary} />
            )을 배치합니다.
          </p>
        </div>

        <div className="space-y-3">
          {REVIEW_GATES.map((gate) => {
            const isOpen = openGateId === gate.id;
            const isChecked = completedIds.includes(gate.checkId);
            return (
              <div
                key={gate.id}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131822] overflow-hidden"
              >
                <div className="flex items-center justify-between gap-3 px-4 py-3.5">
                  <button
                    type="button"
                    onClick={() => setOpenGateId(isOpen ? '' : gate.id)}
                    aria-expanded={isOpen}
                    className="flex-1 flex items-center gap-3 text-left min-w-0 cursor-pointer"
                  >
                    <span className="font-mono tabular-nums text-xs font-semibold text-amber-600 dark:text-amber-400 shrink-0">
                      {gate.gateNumber}
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 truncate">
                        <HighlightText text={gate.title} query={searchQuery} />
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {gate.subtitle}
                      </div>
                    </div>
                  </button>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onToggleCheck(gate.checkId)}
                      aria-pressed={isChecked}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap cursor-pointer ${
                        isChecked
                          ? 'bg-emerald-600/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/35'
                          : 'bg-slate-50 dark:bg-[#0B0E14] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isChecked ? '통과 완료' : '통과 체크'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOpenGateId(isOpen ? '' : gate.id)}
                      aria-label={`${gate.gateNumber} 상세 펼치기`}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-150 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {isOpen && (
                  <div className="px-4 pb-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg bg-slate-50 dark:bg-[#0B0E14] border border-slate-200/70 dark:border-slate-800 p-3.5">
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                        검토 기준
                      </div>
                      <p className="text-slate-700 dark:text-slate-200 leading-relaxed text-[13px]">
                        <HighlightText text={gate.criteria} query={searchQuery} />
                      </p>
                    </div>
                    <div className="rounded-lg bg-amber-50/60 dark:bg-amber-500/[0.06] border border-amber-200/70 dark:border-amber-500/20 p-3.5">
                      <div className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1.5">
                        통과 조건 (Pass Gate)
                      </div>
                      <p className="text-slate-700 dark:text-slate-200 leading-relaxed text-[13px]">
                        <HighlightText text={gate.passCondition} query={searchQuery} />
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <Callout variant="warning" title="게이트 미통과 시 절대 원칙">
          <p>
            Gate 1(스토리)과 Gate 3(스틸 프레임)을 통과하지 못한 상태에서 비디오 생성(Gate 4)을 진행하면, 크레딧 소모량이 기하급수적으로 늘어나고 컷 연결성이 붕괴됩니다.{' '}
            <GlossaryTerm termId="anchor-shot" label="앵커 숏(Anchor Shot)" onOpenGlossary={onOpenGlossary} />
            이 승인된 샷만 비디오 엔진으로 이관하세요.
          </p>
        </Callout>
      </section>

      {/* 1.3 전통 미디어 제작 대비 AI 제작의 비교 특징 */}
      <section id="sec-1-3" className="scroll-mt-24 space-y-5">
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            <HighlightText text="1.3 전통 미디어 제작 대비 AI 제작의 비교 특징" query={searchQuery} />
          </h2>
          <p className="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">
            전통적 영화/드라마 촬영 방식과 생성형 AI 파이프라인의 핵심적 수치 및 제어 특성을 비교하면 다음과 같습니다.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-[#131822]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0E121A] text-xs font-semibold text-slate-600 dark:text-slate-300">
                  <th className="py-3.5 px-4 whitespace-nowrap">비교 항목</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">전통 영상 제작 (Traditional)</th>
                  <th className="py-3.5 px-4 whitespace-nowrap text-amber-700 dark:text-amber-300">
                    AI 드라마 파이프라인 (AI Pipeline)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 text-sm">
                {COMPARISON_ROWS.map((row) => (
                  <tr
                    key={row.item}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                      <HighlightText text={row.item} query={searchQuery} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 tabular-nums">
                      <HighlightText text={row.traditional} query={searchQuery} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-900 dark:text-slate-100 font-medium tabular-nums">
                      <HighlightText text={row.ai} query={searchQuery} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 1.4 초보자 사전 준비물 및 체크리스트 */}
      <section id="sec-1-4" className="scroll-mt-24 space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            <HighlightText text="1.4 초보자 사전 준비물 및 체크리스트" query={searchQuery} />
          </h2>
          <p className="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">
            AI 드라마 제작에 착수하기 전 확보해야 할 주요 플랫폼 계정과 자산 사전 설정 항목입니다.
          </p>
        </div>

        {/* 필수 계정 및 도구 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
            <Wrench className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>필수 계정 및 도구</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131822] p-4 space-y-1.5">
              <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                LLM 기획 툴
              </div>
              <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                <HighlightText text="ChatGPT (GPT-4o) 또는 Claude (MCP 연동 플랜) 계정" query={searchQuery} />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                시나리오 기획, 시각적 지문 변환, 숏 테이블 및{' '}
                <GlossaryTerm termId="mcp" onOpenGlossary={onOpenGlossary} /> 연동 자동화
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131822] p-4 space-y-1.5">
              <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                비주얼 및 비디오 생성 엔진
              </div>
              <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                <HighlightText
                  text="Midjourney / Nano Banana (이미지), Kling / Seedance / MiniMax (비디오) 크레딧"
                  query={searchQuery}
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                캐릭터 키비주얼/레퍼런스 시트 및 I2V 모션 클립 생성
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131822] p-4 space-y-1.5">
              <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                캔버스 플랫폼
              </div>
              <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                <HighlightText
                  text="ArcLoop, Morphic, NadouPro, Newtake 중 작업 스타일에 맞는 통합 캔버스"
                  query={searchQuery}
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                샷 카딩, 캐릭터 바인딩, 노드 그래프 및 파이프라인 오케스트레이션
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131822] p-4 space-y-1.5">
              <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                오디오 및 편집 툴
              </div>
              <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                <HighlightText
                  text="Supertone / ElevenLabs (TTS), Suno (BGM), CapCut / Premiere (컷 편집 및 자막)"
                  query={searchQuery}
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                대사 보이스오버, 배경음악, 타임라인 조립 및 최종 자막 마감
              </p>
            </div>
          </div>
        </div>

        {/* 사전 자산 체크리스트 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
              <Layers className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>사전 자산 체크리스트 (클릭해 완료 표시 · 자동 저장)</span>
            </div>
            <span className="font-mono tabular-nums text-xs text-slate-500 dark:text-slate-400">
              {prepItems.filter((i) => completedIds.includes(i.id)).length}/{prepItems.length} 완료
            </span>
          </div>

          <div className="space-y-2.5">
            {prepItems.map((item) => (
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

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>관련 용어 확인:</span>
            <GlossaryTerm termId="invariant-detail" onOpenGlossary={onOpenGlossary} />
            <GlossaryTerm termId="key-light" onOpenGlossary={onOpenGlossary} />
            <GlossaryTerm termId="seed" onOpenGlossary={onOpenGlossary} />
          </div>
        </div>
      </section>

      {/* Bottom Next Section CTA */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 flex justify-end">
        <button
          type="button"
          onClick={() => onNavigateSection('production')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap"
        >
          <span>다음: 2. 단계별 실전 제작 가이드</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
