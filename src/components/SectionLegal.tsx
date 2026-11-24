import React from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Ban,
  CheckCircle2,
  FileWarning,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import { CHECKLIST_ITEMS, MainSectionId } from '../data/manualData';
import { Callout } from './Callout';
import { CodePromptBox } from './CodePromptBox';
import { HighlightText } from './HighlightText';
import { StepCheckbox } from './StepCheckbox';

interface SectionLegalProps {
  completedIds: string[];
  onToggleCheck: (id: string) => void;
  searchQuery: string;
  onNavigateSection: (sectionId: MainSectionId, anchorId?: string) => void;
}

interface DoDontRow {
  category: string;
  doText: string;
  dontText: string;
  legalRisk: string;
}

const DO_DONT_CASES: DoDontRow[] = [
  {
    category: '저작권 입증',
    doText: '숏 테이블, 프롬프트 이력, 컷 편집 타임라인 프로젝트 파일 보관',
    dontText: 'AI가 출력한 비디오 클립을 무수정 상태로 단독 저작권 등록 신청',
    legalRisk: '저작권 등록 거절 (USCO 가이드라인, 문체부 안내서)',
  },
  {
    category: '라벨 표시',
    doText: '딥페이크 및 가상인물 광고 영상에 "가상인물" 상시 자막 표시',
    dontText: 'AI 생성 영상을 실제 실사 촬영본인 것처럼 은폐하여 배포/광고',
    legalRisk: 'AI 기본법 제31조 위반, 공정위 가시적 표시 지침 위반',
  },
  {
    category: '초상권 보호',
    doText: "배우/성우 계약 시 'AI 데이터 학습 및 미발화 문장 합성 동의서' 작성",
    dontText: '유명 연예인/유튜버의 얼굴이나 목소리를 무단 임베딩하여 드라마 제작',
    legalRisk: '부정경쟁방지법 타목 위반 (초상권/퍼블리시티권 침해)',
  },
  {
    category: '상업 이용 약관',
    doText: '툴 사용 당시 유료 구독 영수증 및 상업적 이용 가능 약관 캡처 보관',
    dontText: 'Suno 무료 플랜으로 생성한 BGM을 유료 인앱 숏드라마에 무단 사용',
    legalRisk: '서비스 이용약관 위반 및 저작권 침해 소송 리스크',
  },
];

const CONSENT_CLAUSE_SNIPPET = `[출연진(배우·성우) AI 데이터 학습 및 합성 동의 필수 조항 예시]
1. 사용 매체: 세로형 숏폼 드라마(모바일 앱·SNS·유튜브) 및 홍보물
2. 사용 기간: 작품 공개일로부터 O년간 (계약서에 명시)
3. 핵심 동의 범위: 출연자의 외형(초상) 및 음성을 AI 모델 학습·합성에 활용하며,
   "본인이 직접 말하지 않은 대사를 AI 합성으로 생성하는 것에 대한 명시적 동의"를 포함한다.`;

export const SectionLegal: React.FC<SectionLegalProps> = ({
  completedIds,
  onToggleCheck,
  searchQuery,
  onNavigateSection,
}) => {
  const legalChecklist = CHECKLIST_ITEMS.filter((item) => item.section === 'legal');

  return (
    <div className="space-y-12">
      {/* Chapter Hero */}
      <header className="space-y-5 border-b border-slate-200 dark:border-slate-800/80 pb-8">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-mono text-amber-600 dark:text-amber-400 font-semibold">
            04
          </span>
          <span aria-hidden="true">/</span>
          <span>저작권, 초상권 및 관련 법령 가이드</span>
          <span aria-hidden="true">·</span>
          <span>Legal & Compliance</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 leading-tight [text-wrap:balance]">
          <HighlightText
            text="4. 저작권, 초상권 및 관련 법령 가이드 (Legal & Compliance)"
            query={searchQuery}
          />
        </h1>

        <p className="text-[15px] sm:text-base leading-relaxed text-slate-600 dark:text-slate-300 max-w-3xl">
          상업용 AI 숏드라마를 배포·수익화할 때 반드시 준수해야 하는 국내외 저작권 인정 기준, AI 생성물 라벨링 의무, 초상권·퍼블리시티권 보호 및 상업적 약관 증빙 수칙입니다.
        </p>
      </header>

      {/* 4.1 AI 저작물 저작권 인정 기준 */}
      <section id="sec-4-1" className="scroll-mt-24 space-y-5">
        <div className="flex items-center gap-2.5">
          <Scale className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            <HighlightText
              text="4.1 AI 저작물 저작권 인정 기준 (인간의 창작적 기여)"
              query={searchQuery}
            />
          </h2>
        </div>

        <p className="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">
          <HighlightText
            text='미국 저작권청(USCO Part 3 보고서) 및 대한민국 문화체육관광부 「생성형 인공지능 저작물 학습 저작권 안내서」의 핵심 원칙은 "저작권은 오직 인간의 창작적 기여(Human Authorship)가 증명된 부분에만 인정된다"는 점입니다.'
            query={searchQuery}
          />
        </p>

        {/* 노란색/붉은색 경고 콜아웃 */}
        <div className="rounded-xl border border-amber-300 dark:border-amber-500/40 bg-amber-50/80 dark:bg-amber-500/[0.08] p-4 sm:p-5 space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-amber-900 dark:text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>주의: 단순 프롬프트 입력물 저작권 불인정</span>
          </div>
          <p className="text-sm text-amber-950/90 dark:text-amber-100/90 leading-relaxed">
            <HighlightText
              text="사용자가 아무리 길고 정교한 텍스트 프롬프트를 입력하더라도, AI 생성 모델 알고리즘에 의해 자율 출력된 비디오 클립은 인간의 직접적인 표현 제어로 보지 않아 저작권 보호를 받지 못합니다."
              query={searchQuery}
            />
          </p>
        </div>

        {/* 저작권 인정 요건 2가지 */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            저작권 인정 요건 (Human Authorship 입증 기준)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131822] p-5 space-y-2">
              <div className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                요건 01 · Modification
              </div>
              <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                인간의 직접적 수정·보완
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <HighlightText
                  text="AI 결과물에 인간이 디지털 합성, 색보정, 리터칭 등 독자적 표현을 추가한 경우 해당 창작 기여 부분에 저작권이 인정됩니다."
                  query={searchQuery}
                />
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131822] p-5 space-y-2">
              <div className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                요건 02 · Selection & Arrangement
              </div>
              <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                선택 및 배치
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <HighlightText
                  text="여러 AI 클립과 요소들을 의도적으로 선택, 편집, 타임라인 배치하여 독자적인 전체 서사 구조를 완성한 경우 (전체 구조에 대해 저작권 인정)."
                  query={searchQuery}
                />
              </p>
            </div>
          </div>
        </div>

        <Callout variant="info" title="저작권 등록 신청 수칙 (Disclaim 원칙)">
          <p>
            <HighlightText
              text="저작권 등록 시 순수 AI 생성 부분은 Disclaim(제외)하고, 인간이 창작한 대본, 편집, 콤포지팅 부분만을 분리하여 신청해야 합니다. 이를 증명하기 위해 숏 테이블, 프롬프트 이력, 편집 프로젝트 파일을 반드시 보관하세요."
              query={searchQuery}
            />
          </p>
        </Callout>
      </section>

      {/* 4.2 AI 생성물 라벨링 및 표시 의무 */}
      <section
        id="sec-4-2"
        className="scroll-mt-24 space-y-5 pt-6 border-t border-slate-200 dark:border-slate-800/80"
      >
        <div className="flex items-center gap-2.5">
          <Tag className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            <HighlightText text="4.2 AI 생성물 라벨링 및 표시 의무" query={searchQuery} />
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131822] p-5 space-y-2">
            <div className="font-mono text-xs font-semibold text-amber-600 dark:text-amber-400">
              국내 법령
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">
              대한민국 AI 기본법 (제31조)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <HighlightText
                text="AI 기술로 생성된 영상 결과물에는 이용자가 명확히 인식할 수 있도록 가시적 라벨 표시 또는 메타데이터 워터마크를 부과해야 합니다."
                query={searchQuery}
              />
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131822] p-5 space-y-2">
            <div className="font-mono text-xs font-semibold text-amber-600 dark:text-amber-400">
              광고 규제
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">
              공정거래위원회 가상인물 광고 표시 지침
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <HighlightText
                text='AI 가상 인물이 등장하여 제품을 추천·보증하는 광고 영상은 해당 인물이 나오는 노출 시간 내내 "가상인물" 문구를 화면상에 상시 표시해야 합니다.'
                query={searchQuery}
              />
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131822] p-5 space-y-2">
            <div className="font-mono text-xs font-semibold text-amber-600 dark:text-amber-400">
              플랫폼 정책
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">
              유튜브(YouTube) AI 콘텐츠 공개 정책
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <HighlightText
                text="실제 인물/장소를 합성·변형한 사실적 비디오에 대해 업로드 단계에서 '선택/합성 콘텐츠' 태그를 부과해야 하며, 미이행 시 콘텐츠 삭제 및 파트너 프로그램 정지 제재를 받습니다."
                query={searchQuery}
              />
            </p>
          </div>
        </div>
      </section>

      {/* 4.3 초상권, 퍼블리시티권 및 상업적 사용 증빙 */}
      <section
        id="sec-4-3"
        className="scroll-mt-24 space-y-5 pt-6 border-t border-slate-200 dark:border-slate-800/80"
      >
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            <HighlightText
              text="4.3 초상권, 퍼블리시티권 및 상업적 사용 증빙"
              query={searchQuery}
            />
          </h2>
        </div>

        {/* 붉은색 고위험 경고 콜아웃 */}
        <div className="rounded-xl border border-rose-300 dark:border-rose-500/40 bg-rose-50/80 dark:bg-rose-500/[0.08] p-4 sm:p-5 space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-rose-900 dark:text-rose-300">
            <FileWarning className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>고위험 경고: 부정경쟁방지법 (제2조 제1호 타목) 민·형사 처벌 대상</span>
          </div>
          <p className="text-sm text-rose-950/90 dark:text-rose-100/90 leading-relaxed">
            <HighlightText
              text="실존 인물의 얼굴이나 음성을 사전 서면 동의 없이 AI로 복제·합성하는 행위는 인격적·경제적 가치를 무단 침해하는 부정경쟁행위로 민·형사상 처벌 대상입니다. 유명 연예인, 인플루언서, 성우의 외형/목소리를 무단 임베딩하지 마세요."
              query={searchQuery}
            />
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131822] p-5 space-y-3">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            출연진 전용 동의서 체결 필수 요건
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <HighlightText
              text="배우 또는 성우의 데이터를 AI 학습 및 합성 영상에 사용할 경우, 사용 매체, 사용 기간, 및 '본인이 직접 말하지 않은 대사를 AI 합성으로 생성하는 것에 대한 명시적 동의' 조항이 포함된 동의서를 체결해야 합니다."
              query={searchQuery}
            />
          </p>

          <CodePromptBox
            title="출연진 AI 합성 동의서 핵심 체크 문구"
            subtitle="계약서 반영용 참고 조항"
            content={CONSENT_CLAUSE_SNIPPET}
            searchQuery={searchQuery}
            compact
          />
        </div>
      </section>

      {/* 4.4 파이프라인 법적 준수 Do & Don't 대비 카드 */}
      <section
        id="sec-4-4"
        className="scroll-mt-24 space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800/80"
      >
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            <HighlightText
              text="4.4 파이프라인 법적 준수 Do & Don’t 대비표"
              query={searchQuery}
            />
          </h2>
        </div>

        <p className="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">
          가이드라인 및 개별 법령 준수를 위해 제작사가 적용해야 하는 법적 수칙입니다. 권장 행위(Do)와 금지 행위(Don’t)를 나란히 비교해 실수를 예방하세요.
        </p>

        {/* Do vs Don't Comparison Cards */}
        <div className="space-y-4">
          {DO_DONT_CASES.map((row) => (
            <div
              key={row.category}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131822] overflow-hidden"
            >
              <div className="px-4 py-3 bg-slate-50 dark:bg-[#0E121A] border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  <HighlightText text={row.category} query={searchQuery} />
                </h3>
                <span className="text-xs font-medium text-rose-600 dark:text-rose-400">
                  리스크 · <HighlightText text={row.legalRisk} query={searchQuery} />
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
                {/* DO */}
                <div className="p-4 bg-emerald-50/40 dark:bg-emerald-500/[0.04] space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>권장 행위 (Do)</span>
                  </div>
                  <p className="text-sm text-slate-800 dark:text-slate-100 leading-relaxed">
                    <HighlightText text={row.doText} query={searchQuery} />
                  </p>
                </div>

                {/* DON'T */}
                <div className="p-4 bg-rose-50/40 dark:bg-rose-500/[0.04] space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-700 dark:text-rose-300">
                    <Ban className="w-4 h-4 shrink-0" />
                    <span>금지 행위 (Don’t)</span>
                  </div>
                  <p className="text-sm text-slate-800 dark:text-slate-100 leading-relaxed">
                    <HighlightText text={row.dontText} query={searchQuery} />
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Legal Self-Check List */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              배포 전 법적 준수 자가 점검 체크리스트
            </h3>
            <span className="font-mono tabular-nums text-xs text-slate-500 dark:text-slate-400">
              {legalChecklist.filter((i) => completedIds.includes(i.id)).length}/
              {legalChecklist.length} 완료
            </span>
          </div>
          <div className="space-y-2.5">
            {legalChecklist.map((item) => (
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
          onClick={() => onNavigateSection('tools')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#151A24] hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>이전: 3. 필수 AI 제작 툴 디렉토리</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigateSection('faq')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
        >
          <span>다음: 5. 초보자 FAQ 및 트러블슈팅</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
