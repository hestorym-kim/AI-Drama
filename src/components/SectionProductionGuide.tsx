import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  Copy,
  Film,
  Music,
  PenTool,
  Sliders,
  Sparkles,
  UserCheck,
  Volume2,
  XCircle,
  CheckCircle2,
} from 'lucide-react';
import { CHECKLIST_ITEMS, MainSectionId } from '../data/manualData';
import { Callout } from './Callout';
import { CodePromptBox } from './CodePromptBox';
import { GlossaryTerm } from './GlossaryTerm';
import { HighlightText } from './HighlightText';
import { StepCheckbox } from './StepCheckbox';

interface SectionProductionGuideProps {
  completedIds: string[];
  onToggleCheck: (id: string) => void;
  searchQuery: string;
  onOpenGlossary: (termId: string) => void;
  onNavigateSection: (sectionId: MainSectionId, anchorId?: string) => void;
}

const SHOT_TABLE_ROWS = [
  {
    shotNo: 'Shot #01',
    framing: 'Extreme Close-Up (ECU)',
    action: '떨리는 손끝으로 황동 손목시계의 태엽을 시계 방향으로 돌린다',
    dialogue: '(SFX: 째깍거리는 태엽 소리)',
    duration: '3초',
  },
  {
    shotNo: 'Shot #02',
    framing: 'Medium Shot (MS)',
    action: '서진이 눈살을 찌푸린 채 문 쪽을 날카롭게 노려본다',
    dialogue: '"당신이 여기 어쩐 일이야?"',
    duration: '4초',
  },
  {
    shotNo: 'Shot #03',
    framing: 'Wide Shot (WS)',
    action: '빗물이 내리치는 어두운 복도 끝에서 정장 입은 남자가 천천히 걸어온다',
    dialogue: '(SFX: 빗소리와 둔탁한 구두 발자국 소리)',
    duration: '5초',
  },
];

const CAMERA_COMMANDS = [
  { cmd: 'Pan left', desc: '카메라를 왼쪽으로 수평 회전' },
  { cmd: 'Slow zoom-in', desc: '피사체를 향해 천천히 줌인' },
  { cmd: 'Static shot with subtle motion', desc: '고정 카메라 내 미세한 피사체 움직임' },
  { cmd: 'Tracking shot', desc: '피사체의 동선을 따라 이동 촬영' },
];

const EXPRESSIONS = ['기쁨', '슬픔', '분노', '두려움', '무표정', '긴장'];

const NARRATIVE_DIAGRAM = `[0~10초: Hook] ➔ [10~55초: Conflict & Escalation] ➔ [55~75초: Cliffhanger]
 (즉시 상황 진입)      (갈등 고조 & 반전 제시)         (극적 순간 중단 & 결제 유도)`;

const PROMPT_FORMULA = `[Framing/Camera Movement] + [Tag/Image Callout] + [Action in Visual Words] + [Signature Anchor Attributes] + [Environment & Invariant Details] + [Lighting & Style]`;

const PROMPT_EXAMPLE = `Medium shot, @Character1 (Image 1-2 is Character 1) sitting by the wooden desk, wearing a neon green vest and silver watch, looking at the door with sharp eyes, brown brick wall background with brass wall lamp, cinematic lighting from left 45 degrees, 8k resolution.`;

const RENDER_FLOW = `[대본 & 스틸 확정] ➔ [480p Low-Res Draft 비디오 생성] ➔ [타임라인 컷/템포 검증] ➔ [승인 컷 1080p Upscale]`;

export const SectionProductionGuide: React.FC<SectionProductionGuideProps> = ({
  completedIds,
  onToggleCheck,
  searchQuery,
  onOpenGlossary,
  onNavigateSection,
}) => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [selectedExpression, setSelectedExpression] = useState<string>('긴장');

  // Interactive Prompt Builder state
  const [builderFraming, setBuilderFraming] = useState('Medium shot');
  const [builderTag, setBuilderTag] = useState('@Character1 (Image 1-2 is Character 1)');
  const [builderAction, setBuilderAction] = useState(
    'sitting by the wooden desk, looking at the door with sharp eyes'
  );
  const [builderAnchor, setBuilderAnchor] = useState(
    'wearing a neon green vest and silver watch'
  );
  const [builderEnv, setBuilderEnv] = useState(
    'brown brick wall background with brass wall lamp'
  );
  const [builderLighting, setBuilderLighting] = useState(
    'cinematic lighting from top-left 45 degrees, 8k resolution'
  );

  const assembledPrompt = `${builderFraming}, ${builderTag} ${builderAction}, ${builderAnchor}, ${builderEnv}, ${builderLighting}.`;

  const handleCopyCommand = async (cmd: string) => {
    try {
      await navigator.clipboard.writeText(cmd);
    } catch {
      // ignore fallback
    }
    setCopiedCmd(cmd);
    window.setTimeout(() => setCopiedCmd(null), 1500);
  };

  const getCheckItem = (id: string) =>
    CHECKLIST_ITEMS.find((item) => item.id === id);

  return (
    <div className="space-y-14">
      {/* Chapter Hero */}
      <header className="space-y-5 border-b border-slate-200 dark:border-slate-800/80 pb-8">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-mono text-amber-600 dark:text-amber-400 font-semibold">
            02
          </span>
          <span aria-hidden="true">/</span>
          <span>단계별 실전 제작 가이드</span>
          <span aria-hidden="true">·</span>
          <span>기획 · 비주얼 · 비디오 · 오디오 및 후반 작업</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 leading-tight [text-wrap:balance]">
          <HighlightText text="2. 단계별 실전 제작 가이드" query={searchQuery} />
        </h1>

        <p className="text-[15px] sm:text-base leading-relaxed text-slate-600 dark:text-slate-300 max-w-3xl">
          시나리오 설계부터 캐릭터 일관성 제어, I2V 비디오 모션 연출, 오디오 레이어링과 480p 드래프트 검증까지 실제 AI 숏드라마 1편을 완성하기 위한 실무 규격과 프롬프트 공식을 단계별로 안내합니다.
        </p>
      </header>

      {/* ================================================================= */}
      {/* 2.1 기획 및 시나리오 (Pre-Production) */}
      {/* ================================================================= */}
      <section id="sec-2-1" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2.5">
          <PenTool className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            <HighlightText text="2.1 기획 및 시나리오 (Pre-Production)" query={searchQuery} />
          </h2>
        </div>

        {/* 숏폼 특화 3단 서사 구조 */}
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">
            <HighlightText
              text="숏폼 특화 3단 서사 구조 (60~75초 기준)"
              query={searchQuery}
            />
          </h3>
          <p className="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">
            시청자의 이탈을 막고 소액 결제를 유도하기 위해{' '}
            <GlossaryTerm termId="micro-drama" label="마이크로드라마" onOpenGlossary={onOpenGlossary} />
            는 초단위 3단 서사 구조를 준수합니다.
          </p>

          {/* Visual 3-Act Timeline */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131822] p-4 sm:p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-3 rounded-lg bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/25 p-3.5">
                <div className="font-mono tabular-nums text-xs font-semibold text-amber-700 dark:text-amber-300">
                  0~10초 · Hook
                </div>
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-1">
                  즉시 상황 진입
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                  사건의 한가운데(
                  <GlossaryTerm termId="in-media-res" onOpenGlossary={onOpenGlossary} />
                  )에서 즉시 시작합니다. 설명조 오프닝을 배제하고 강렬한 시각적 상황과 단 한 줄의 대사로 시선을 사로잡습니다.
                </p>
              </div>

              <div className="md:col-span-6 rounded-lg bg-slate-50 dark:bg-[#0E121A] border border-slate-200 dark:border-slate-800 p-3.5">
                <div className="font-mono tabular-nums text-xs font-semibold text-sky-700 dark:text-sky-300">
                  10~55초 · Conflict & Escalation
                </div>
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-1">
                  갈등 고조 & 반전 제시
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                  1~2개의 반전 요소나 인물 간 대립을 심화시킵니다. 씬 전환은{' '}
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    20초당 1회 이내
                  </span>
                  로 제한해 리소스를 절감하되,{' '}
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    2~3초 간격의 하드컷 편집
                  </span>
                  으로 속도감을 부여합니다.
                </p>
              </div>

              <div className="md:col-span-3 rounded-lg bg-rose-500/10 dark:bg-rose-400/10 border border-rose-500/25 p-3.5">
                <div className="font-mono tabular-nums text-xs font-semibold text-rose-700 dark:text-rose-300">
                  55~75초 · Cliffhanger
                </div>
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-1">
                  극적 순간 중단 & 결제 유도
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                  갈등을 해결하지 않은 채 가장 폭발적인 절정 순간이나 비밀 폭로 직전에 장면을 자릅니다. 다음 회차 시청 및 결제를 유도하는 핵심 서사 장치입니다.
                </p>
              </div>
            </div>

            <CodePromptBox
              title="3단 서사 구조 템플릿"
              subtitle="60~75초 숏폼 기준"
              content={NARRATIVE_DIAGRAM}
              searchQuery={searchQuery}
              compact
            />
          </div>
        </div>

        {/* 시각적 지문 대본 작성법 */}
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">
            <HighlightText text="시각적 지문 대본 작성법" query={searchQuery} />
          </h3>
          <p className="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">
            AI 비디오 생성 모델은 추상적 감정 단어를 이해하지 못합니다. 모든 대본 지문은{' '}
            <strong className="font-semibold text-slate-900 dark:text-slate-100">
              물리적 표정과 동작
            </strong>
            으로 분해되어야 합니다.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-rose-200 dark:border-rose-500/30 bg-rose-50/50 dark:bg-rose-500/[0.05] p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 dark:text-rose-300">
                <XCircle className="w-4 h-4 shrink-0" />
                <span>잘못된 지문 예시 (추상적 감정 서술)</span>
              </div>
              <p className="font-mono text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                <HighlightText
                  text="(갑자기 아버지를 향한 그리움과 죄책감에 휩싸인다)"
                  query={searchQuery}
                />
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                AI는 '그리움'이나 '죄책감'의 구체적인 신체 움직임을 추론하지 못해 무표정이나 어색한 흔들림을 생성합니다.
              </p>
            </div>

            <div className="rounded-xl border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-500/[0.05] p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>시각적 지문 수정 예시 (물리적 동작 분해)</span>
              </div>
              <p className="font-mono text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                <HighlightText
                  text="(손끝을 미세하게 떨며 시선을 아래로 내리고, 쥔 손에 힘을 주어 낡은 시계를 꼭 쥐어잡는다)"
                  query={searchQuery}
                />
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                카메라에 직접 포착 가능한 손끝 떨림, 시선 방향, 소품 파지 동작으로 감정을 번역했습니다.
              </p>
            </div>
          </div>
        </div>

        {/* 숏 테이블 구축 규칙 */}
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">
            <HighlightText text="숏 테이블(Shot Table) 구축 규칙" query={searchQuery} />
          </h3>
          <p className="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">
            대본 확정 후 샷 번호, 프레이밍(<GlossaryTerm termId="ecu-ms-ws" onOpenGlossary={onOpenGlossary} />), 액션 묘사, 대사, 초 단위 길이를 명시한 숏 테이블을 작성합니다. 인물의 감정 클로즈업, 와이드 사건 샷, 핵심 리액션 샷 등{' '}
            <strong className="font-semibold text-slate-900 dark:text-slate-100">
              3~5개의 핵심{' '}
              <GlossaryTerm termId="anchor-shot" label="앵커 숏(Anchor Shot)" onOpenGlossary={onOpenGlossary} />
            </strong>
            을 먼저 설계한 후 그 사이를 미디엄/와이드 샷으로 채워 연결성을 확보하세요.
          </p>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-[#131822]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0E121A] text-xs font-semibold text-slate-600 dark:text-slate-300">
                    <th className="py-3 px-4 whitespace-nowrap">샷 번호</th>
                    <th className="py-3 px-4 whitespace-nowrap">프레이밍 (Framing)</th>
                    <th className="py-3 px-4">시각적 액션 묘사 (Action Description)</th>
                    <th className="py-3 px-4">대사 / 사운드 (Dialogue/SFX)</th>
                    <th className="py-3 px-4 whitespace-nowrap text-right">초 분량</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 text-sm">
                  {SHOT_TABLE_ROWS.map((row) => (
                    <tr
                      key={row.shotNo}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono tabular-nums font-semibold text-amber-600 dark:text-amber-400 whitespace-nowrap">
                        <HighlightText text={row.shotNo} query={searchQuery} />
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        <HighlightText text={row.framing} query={searchQuery} />
                      </td>
                      <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200">
                        <HighlightText text={row.action} query={searchQuery} />
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                        <HighlightText text={row.dialogue} query={searchQuery} />
                      </td>
                      <td className="py-3.5 px-4 font-mono tabular-nums text-right text-slate-900 dark:text-slate-100 font-medium whitespace-nowrap">
                        {row.duration}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {getCheckItem('prac-2-1') && (
            <StepCheckbox
              id="prac-2-1"
              label={getCheckItem('prac-2-1')!.label}
              checked={completedIds.includes('prac-2-1')}
              onToggle={onToggleCheck}
              searchQuery={searchQuery}
            />
          )}
        </div>
      </section>

      {/* ================================================================= */}
      {/* 2.2 비주얼 에셋 및 캐릭터 일관성 제어 */}
      {/* ================================================================= */}
      <section id="sec-2-2" className="scroll-mt-24 space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <UserCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            <HighlightText
              text="2.2 비주얼 에셋 및 캐릭터 일관성 제어 (Visual & Character Continuity)"
              query={searchQuery}
            />
          </h2>
        </div>

        {/* 캐릭터 시트 제작 및 정밀 분리 기법 */}
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">
            <HighlightText text="캐릭터 시트 제작 및 정밀 분리 기법" query={searchQuery} />
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 전신 컷 얼굴 마스킹 */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131822] p-5 space-y-3">
              <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                분리 바인딩 핵심 기법
              </div>
              <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                <HighlightText text="전신 컷 얼굴 마스킹(빗금 처리)" query={searchQuery} />
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <HighlightText
                  text="전신(Full Body) 시트에 얼굴 정체성이 포함되어 있으면 AI 모델이 전신의 작은 얼굴과 클로즈업 정체성을 혼동하여 얼굴이 찌그러집니다. 전신 시트의 얼굴 부분은 마스킹(빗금 처리)하거나 비워두고, 얼굴 정체성은 반드시 별도의 '확대 클로즈업 샷'에서만 가져오도록 바인딩합니다."
                  query={searchQuery}
                />
              </p>

              {/* Visual Diagram */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B0E14] p-3 text-center">
                  <div className="mx-auto w-12 h-10 rounded bg-slate-300/60 dark:bg-slate-700/60 border border-dashed border-amber-500/70 flex items-center justify-center text-[10px] font-mono text-amber-700 dark:text-amber-300 mb-1.5">
                    ////
                  </div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    전신 시트 (의상·체형)
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    얼굴 영역 빗금 마스킹
                  </div>
                </div>
                <div className="rounded-lg border border-amber-500/30 bg-amber-50/40 dark:bg-amber-500/[0.06] p-3 text-center">
                  <div className="mx-auto w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-[10px] font-mono text-amber-700 dark:text-amber-300 mb-1.5">
                    ECU
                  </div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    확대 클로즈업 시트
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    얼굴 정체성 단독 바인딩
                  </div>
                </div>
              </div>
            </div>

            {/* 6분할 표정 시트 */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131822] p-5 space-y-3">
              <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                감정 연기 레퍼런스
              </div>
              <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                <HighlightText text="6분할 표정 시트(Expression Sheet)" query={searchQuery} />
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <HighlightText
                  text="기쁨, 슬픔, 분노, 두려움, 무표정, 긴장 등 6가지 핵심 감정 클로즈업을 한 장의 시트로 사전 생성하여 감정 변화 신에 레퍼런스로 호출합니다."
                  query={searchQuery}
                />
              </p>

              {/* Interactive 6-grid preview */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                {EXPRESSIONS.map((exp, index) => {
                  const active = selectedExpression === exp;
                  return (
                    <button
                      key={exp}
                      type="button"
                      onClick={() => setSelectedExpression(exp)}
                      className={`rounded-lg px-2.5 py-2 text-center border transition-colors cursor-pointer ${
                        active
                          ? 'bg-amber-500/15 border-amber-500/50 text-amber-700 dark:text-amber-300 font-semibold'
                          : 'bg-slate-50 dark:bg-[#0B0E14] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <span className="block font-mono text-[10px] opacity-60">
                        0{index + 1}
                      </span>
                      <span className="text-xs">{exp}</span>
                    </button>
                  );
                })}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                선택된 레퍼런스 감정 슬롯: <strong className="text-slate-800 dark:text-slate-200">{selectedExpression}</strong> — 해당 감정 씬 호출 시 동일 인물 ID와 함께 참조
              </div>
            </div>
          </div>
        </div>

        {/* 시그니처 앵커 및 공간/조명 고정 법칙 */}
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">
            <HighlightText text="시그니처 앵커 및 공간/조명 고정 법칙" query={searchQuery} />
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131822] p-4 space-y-2">
              <div className="font-mono text-xs font-semibold text-amber-600 dark:text-amber-400">
                RULE 01
              </div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                인물 시그니처 앵커
              </h4>
              <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                캐릭터당 2~3개의 고유 표식(예: 형광 연두색 주차 조끼, 특정 은색 손목시계, 눈가 흉터)을 선정하고 프롬프트마다 한 토씨도 틀리지 않고 기재합니다.{' '}
                <strong className="text-rose-600 dark:text-rose-400">
                  네 문단 이상의 과도한 신체 스펙 묘사는 AI 가중치 불균형을 유발하므로 금지
                </strong>
                합니다.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131822] p-4 space-y-2">
              <div className="font-mono text-xs font-semibold text-amber-600 dark:text-amber-400">
                RULE 02
              </div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                공간 불변 디테일 (
                <GlossaryTerm termId="invariant-detail" label="Invariant Detail" onOpenGlossary={onOpenGlossary} />
                )
              </h4>
              <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                세트 무너짐을 막기 위해 장소 내 절대 바뀌지 않는 고정 오브젝트(예: 특정 황동 조명 기구, 벽돌 패턴, 손상된 타일 무늬)를 문구로 고정합니다.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131822] p-4 space-y-2">
              <div className="font-mono text-xs font-semibold text-amber-600 dark:text-amber-400">
                RULE 03
              </div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                주 조명 방향 (
                <GlossaryTerm termId="key-light" label="Key Light Continuity" onOpenGlossary={onOpenGlossary} />
                )
              </h4>
              <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                씬 전체 프롬프트에 조명 방향(예:{' '}
                <code className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                  cinematic lighting from top-left 45 degrees
                </code>
                )을 일관되게 명시합니다.
              </p>
            </div>
          </div>
        </div>

        {/* 프롬프트 태깅 및 호출 공식 */}
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">
            <HighlightText text="프롬프트 태깅 및 호출 공식" query={searchQuery} />
          </h3>
          <p className="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">
            캐릭터 이름 대신 ID 태그나 숫자 역할을 할당하여 모델의 인물 인지 오류를 방지합니다.
          </p>

          <CodePromptBox
            title="프롬프트 표준 공식"
            subtitle="6단계 구조화 문법"
            content={PROMPT_FORMULA}
            searchQuery={searchQuery}
          />

          <CodePromptBox
            title="실전 작성 예시"
            subtitle="@Character1 태깅 + 앵커 + 불변 디테일 + 45도 조명"
            content={PROMPT_EXAMPLE}
            searchQuery={searchQuery}
          />

          {/* Interactive Prompt Builder */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131822] p-5 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  초보자용 실전 프롬프트 조립기
                </h4>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                항목을 수정하면 아래 코드가 실시간 반영됩니다
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <label className="space-y-1">
                <span className="font-medium text-slate-600 dark:text-slate-300 block">
                  1. 프레이밍 / 무빙
                </span>
                <input
                  type="text"
                  value={builderFraming}
                  onChange={(e) => setBuilderFraming(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#0B0E14] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                />
              </label>

              <label className="space-y-1">
                <span className="font-medium text-slate-600 dark:text-slate-300 block">
                  2. 캐릭터 ID 태그
                </span>
                <input
                  type="text"
                  value={builderTag}
                  onChange={(e) => setBuilderTag(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#0B0E14] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                />
              </label>

              <label className="space-y-1">
                <span className="font-medium text-slate-600 dark:text-slate-300 block">
                  3. 시각적 단일 액션
                </span>
                <input
                  type="text"
                  value={builderAction}
                  onChange={(e) => setBuilderAction(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#0B0E14] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                />
              </label>

              <label className="space-y-1">
                <span className="font-medium text-slate-600 dark:text-slate-300 block">
                  4. 시그니처 앵커 (2~3개)
                </span>
                <input
                  type="text"
                  value={builderAnchor}
                  onChange={(e) => setBuilderAnchor(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#0B0E14] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                />
              </label>

              <label className="space-y-1">
                <span className="font-medium text-slate-600 dark:text-slate-300 block">
                  5. 배경 & 불변 디테일
                </span>
                <input
                  type="text"
                  value={builderEnv}
                  onChange={(e) => setBuilderEnv(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#0B0E14] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                />
              </label>

              <label className="space-y-1">
                <span className="font-medium text-slate-600 dark:text-slate-300 block">
                  6. 주 조명 & 화질
                </span>
                <input
                  type="text"
                  value={builderLighting}
                  onChange={(e) => setBuilderLighting(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#0B0E14] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                />
              </label>
            </div>

            <CodePromptBox
              title="조립된 내 프롬프트"
              content={assembledPrompt}
              compact
            />
          </div>

          {getCheckItem('prac-2-2') && (
            <StepCheckbox
              id="prac-2-2"
              label={getCheckItem('prac-2-2')!.label}
              checked={completedIds.includes('prac-2-2')}
              onToggle={onToggleCheck}
              searchQuery={searchQuery}
            />
          )}
        </div>
      </section>

      {/* ================================================================= */}
      {/* 2.3 비디오 생성 및 모션 연출 */}
      {/* ================================================================= */}
      <section id="sec-2-3" className="scroll-mt-24 space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <Film className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            <HighlightText
              text="2.3 비디오 생성 및 모션 연출 (Video Generation & Motion)"
              query={searchQuery}
            />
          </h2>
        </div>

        {/* I2V vs T2V 선택 기준 */}
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">
            <HighlightText text="I2V vs T2V 선택 기준" query={searchQuery} />
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-amber-500/30 bg-amber-50/40 dark:bg-amber-500/[0.06] p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  <GlossaryTerm termId="i2v" label="Image-to-Video (I2V)" onOpenGlossary={onOpenGlossary} />
                </span>
                <span className="font-mono text-xs font-semibold text-amber-700 dark:text-amber-300">
                  메인 씬 100% 적용
                </span>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <HighlightText
                  text="캐릭터 및 세트 일관성이 필수적인 메인 씬에 100% 적용합니다. 승인된 정지 이미지를 첫 프레임으로 입력하여 동작을 유도합니다."
                  query={searchQuery}
                />
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131822] p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  <GlossaryTerm termId="t2v" label="Text-to-Video (T2V)" onOpenGlossary={onOpenGlossary} />
                </span>
                <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                  배경·익스태블리싱 샷 한정
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <HighlightText
                  text="인물이 등장하지 않는 익스태블리싱 샷(건물 외관, 하늘, 빗물 표면 등)이나 엑스트라의 단순 배경 움직임에 한해 부분 활용합니다."
                  query={searchQuery}
                />
              </p>
            </div>
          </div>
        </div>

        {/* 1장면 1행동 원칙과 카메라 무빙 제어 */}
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">
            <HighlightText text="1장면 1행동 원칙과 카메라 무빙 제어" query={searchQuery} />
          </h3>

          <Callout variant="warning" title="1장면 1행동 원칙 (Single Action per Clip)">
            <p className="mb-2">
              한 클립 프롬프트에{' '}
              <span className="line-through text-rose-600 dark:text-rose-400">
                "문을 열고 들어와 의자에 앉으며 눈물을 흘린다"
              </span>
              와 같은 복합 동작을 넣으면 피사체가 무너집니다.{' '}
              <strong className="text-emerald-700 dark:text-emerald-300">
                "문을 열고 들어선다"
              </strong>
              로 단일 동작만 제어해야 합니다.
            </p>
          </Callout>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131822] p-5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
              <Camera className="w-4 h-4 text-amber-500 shrink-0" />
              <span>카메라 워킹 제어 (단순·명확한 1축 무빙 명령어 — 클릭해 복사)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {CAMERA_COMMANDS.map((item) => {
                const isCopied = copiedCmd === item.cmd;
                return (
                  <button
                    key={item.cmd}
                    type="button"
                    onClick={() => handleCopyCommand(item.cmd)}
                    className="flex items-center justify-between gap-3 p-3 rounded-lg bg-slate-50 dark:bg-[#0B0E14] border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 text-left transition-colors cursor-pointer"
                  >
                    <div className="min-w-0">
                      <div className="font-mono text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                        <HighlightText text={item.cmd} query={searchQuery} />
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {item.desc}
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400 shrink-0">
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-500">복사됨</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>복사</span>
                        </>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 프레임 연동 및 네이티브 립싱크 */}
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">
            <HighlightText
              text="프레임 연동 (First/Last Frame) 및 네이티브 립싱크"
              query={searchQuery}
            />
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131822] p-4 space-y-2">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                <GlossaryTerm termId="first-last-frame" label="First/Last Frame 연결" onOpenGlossary={onOpenGlossary} />
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <HighlightText
                  text="이전 컷의 마지막 프레임(Last Frame)을 추출하여 다음 컷의 첫 프레임(First Frame) 레퍼런스로 입력하면 피사체의 포즈와 구도가 끊김 없이 이어집니다."
                  query={searchQuery}
                />
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131822] p-4 space-y-2">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                네이티브 <GlossaryTerm termId="lip-sync" label="립싱크" onOpenGlossary={onOpenGlossary} /> 적용
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <HighlightText
                  text="Seedance 2.0 등의 비디오 엔진을 사용할 경우, 비디오 생성 시 오디오 트랙을 직접 입력하여 오디오 음파에 동기화된 네이티브 립싱크 클립을 일괄 출력합니다."
                  query={searchQuery}
                />
              </p>
            </div>
          </div>

          {getCheckItem('prac-2-3') && (
            <StepCheckbox
              id="prac-2-3"
              label={getCheckItem('prac-2-3')!.label}
              checked={completedIds.includes('prac-2-3')}
              onToggle={onToggleCheck}
              searchQuery={searchQuery}
            />
          )}
        </div>
      </section>

      {/* ================================================================= */}
      {/* 2.4 오디오 합성 및 후반 작업 */}
      {/* ================================================================= */}
      <section id="sec-2-4" className="scroll-mt-24 space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <Volume2 className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            <HighlightText
              text="2.4 오디오 합성 및 후반 작업 (Audio & Post-Production)"
              query={searchQuery}
            />
          </h2>
        </div>

        {/* AI TTS 및 오디오 레퍼런스 유지 */}
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">
            <HighlightText
              text="AI TTS 및 오디오 레퍼런스(Audio Reference) 유지"
              query={searchQuery}
            />
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131822] p-4 space-y-2">
              <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                보이스오버 생성
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <HighlightText
                  text="Supertone 등 전문 TTS를 활용해 캐릭터별 감정 톤에 맞는 오디오 파일을 생성합니다."
                  query={searchQuery}
                />{' '}
                <GlossaryTerm termId="tts" onOpenGlossary={onOpenGlossary} />
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131822] p-4 space-y-2">
              <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                오디오 레퍼런스 기술
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <HighlightText
                  text="씬이 바뀔 때 목소리 톤이 변하는 것을 막기 위해 이전 씬의 완성된 캐릭터 음성 구간을 오디오 레퍼런스로 지정하여 생성합니다."
                  query={searchQuery}
                />{' '}
                <GlossaryTerm termId="audio-ref" onOpenGlossary={onOpenGlossary} />
              </p>
            </div>
          </div>
        </div>

        {/* 오디오 레이어링 (Voice, SFX, BGM) */}
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">
            <HighlightText text="오디오 레이어링 (Voice, SFX, BGM)" query={searchQuery} />
          </h3>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131822] divide-y divide-slate-200 dark:divide-slate-800">
            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-start gap-3">
                <Sliders className="w-4 h-4 text-amber-500 mt-1 shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    대사 (Voice)
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                    <HighlightText
                      text="센터 채널 배치, 다른 사운드 요소보다 3~6dB 높게 설정하여 전달력 확보."
                      query={searchQuery}
                    />
                  </p>
                </div>
              </div>
              <span className="font-mono tabular-nums text-xs font-semibold text-amber-600 dark:text-amber-400 shrink-0">
                Center · +3~6dB
              </span>
            </div>

            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-start gap-3">
                <Volume2 className="w-4 h-4 text-sky-500 mt-1 shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    효과음 (SFX)
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                    <HighlightText
                      text="Beeble AI 등을 활용해 폴리 사운드(발자국, 문 닫힘, 빗소리)를 미세하게 레이어링."
                      query={searchQuery}
                    />
                  </p>
                </div>
              </div>
              <span className="font-mono text-xs text-slate-500 dark:text-slate-400 shrink-0">
                Beeble AI · Foley
              </span>
            </div>

            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-start gap-3">
                <Music className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    배경음악 (BGM)
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                    <HighlightText
                      text="Suno 등을 활용해 서사 곡선(Hook-Conflict-Cliffhanger)에 맞추어 템포 변화 적용."
                      query={searchQuery}
                    />
                  </p>
                </div>
              </div>
              <span className="font-mono text-xs text-slate-500 dark:text-slate-400 shrink-0">
                Suno · Tempo Curve
              </span>
            </div>
          </div>
        </div>

        {/* 480p 드래프트 사전 검증 및 1080p 업스케일링 */}
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">
            <HighlightText
              text="480p 드래프트 사전 검증 및 1080p 업스케일링"
              query={searchQuery}
            />
          </h3>
          <p className="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">
            크레딧을 절감하기 위해 렌더링 검증 게이트를{' '}
            <GlossaryTerm termId="480p-draft" label="2단계 해상도" onOpenGlossary={onOpenGlossary} />
            로 운용합니다.
          </p>

          <CodePromptBox
            title="2단계 해상도 렌더링 검증 워크플로우"
            subtitle="크레딧 절감 표준 공정"
            content={RENDER_FLOW}
            searchQuery={searchQuery}
            compact
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131822] p-4 space-y-1.5">
              <div className="font-mono tabular-nums text-xs font-semibold text-amber-600 dark:text-amber-400">
                01 · 480p 드래프트 생성
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <HighlightText
                  text="저화질/저비용 모드로 전 컷 비디오 클립을 일괄 출력합니다."
                  query={searchQuery}
                />
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131822] p-4 space-y-1.5">
              <div className="font-mono tabular-nums text-xs font-semibold text-amber-600 dark:text-amber-400">
                02 · 타임라인 검증
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <HighlightText
                  text="480p 클립과 오디오를 타임라인에 얹어 대사 템포, 인물 움직임 자연스러움, 컷 연결성을 검증합니다. 무너진 컷만 프롬프트를 수정하여 재출력합니다."
                  query={searchQuery}
                />
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131822] p-4 space-y-1.5">
              <div className="font-mono tabular-nums text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                03 · 1080p 고화질 업스케일링
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <HighlightText
                  text="최종 검증을 통과한 컷만 Topaz AI 또는 비디오 엔진 내 업스케일러를 이용해 1080p 이상으로 업스케일하고 자막을 합성하여 마감합니다."
                  query={searchQuery}
                />
              </p>
            </div>
          </div>

          {getCheckItem('prac-2-4') && (
            <StepCheckbox
              id="prac-2-4"
              label={getCheckItem('prac-2-4')!.label}
              checked={completedIds.includes('prac-2-4')}
              onToggle={onToggleCheck}
              searchQuery={searchQuery}
            />
          )}
        </div>
      </section>

      {/* Bottom Navigation */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => onNavigateSection('overview')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#151A24] hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>이전: 1. 개요 및 로드맵</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigateSection('tools')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
        >
          <span>다음: 3. 필수 AI 제작 툴 디렉토리</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
