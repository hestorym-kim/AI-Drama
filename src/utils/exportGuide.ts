import { CHECKLIST_ITEMS, ChecklistItem } from '../data/manualData';

export interface ExportOptions {
  includeChecklist: boolean;
  includeSummaryGuide: boolean;
}

export interface GroupedChecklist {
  group: string;
  items: Array<ChecklistItem & { completed: boolean }>;
  completedCount: number;
}

export interface SummarySection {
  title: string;
  bullets: string[];
}

export const SUMMARY_GUIDE_SECTIONS: SummarySection[] = [
  {
    title: '1. 개요 및 5단계 검토 게이트 요약',
    bullets: [
      '표준 6단계 파이프라인: 기획(Pre-Production) → 자산 고정(Asset Binding) → 스틸 승인(Still Gate) → I2V 비디오 생성 → 오디오·타임라인 편집 → 480p 드래프트 검증 후 1080p 업스케일링.',
      'Gate 1 (스토리): 9:16/16:9 화면비 확정, 로그라인 두 문장만으로 목적과 갈등 직관적 이해 필수.',
      'Gate 2 (캐릭터 바인딩): 캐릭터당 2~3개 시그니처 비주얼 앵커 확정 및 고유 ID(@Character1) 부여.',
      'Gate 3 (스틸 프레임): 앵커 숏(Anchor Shot)의 구도·조명·표정이 승인된 샷만 비디오 단계로 이관.',
      'Gate 4 (비디오 생성): 1장면 1행동(단일 동작) 유지 및 신체 뭉개짐 여부 검증.',
      'Gate 5 (타임라인): TTS·립싱크·BGM/SFX 레이어링 및 대사 전달력·템포 완결성 확보.',
    ],
  },
  {
    title: '2. 단계별 실전 제작 핵심 공식',
    bullets: [
      '3단 서사 구조 (60~75초): [0~10초 Hook (즉시 사건 진입)] → [10~55초 Conflict (20초당 1회 이하 씬 전환, 2~3초 하드컷)] → [55~75초 Cliffhanger (절정 직전 절단)].',
      '시각적 지문: 추상적 감정 대신 물리적 표정·동작(예: 손끝 떨림, 시선 하향, 시계 파지)으로 서술.',
      '캐릭터 분리 기법: 전신 시트의 얼굴은 빗금 마스킹 처리하고, 얼굴 정체성은 확대 클로즈업(ECU/CU) 시트에서만 바인딩 + 6분할 표정 시트 사전 제작.',
      '프롬프트 표준 공식: [Framing/Camera Movement] + [Tag/Image Callout] + [Action in Visual Words] + [Signature Anchor Attributes] + [Environment & Invariant Details] + [Lighting & Style].',
      '모션 및 립싱크: 메인 씬 100% I2V 적용, 1축 카메라 무빙(Pan left, Slow zoom-in 등), First/Last Frame 연동, Seedance 2.0 네이티브 립싱크.',
      '오디오 & 렌더링: 대사(Voice) 센터 채널 +3~6dB 확보, 오디오 레퍼런스 고정, 480p 드래프트 검증 통과 컷만 1080p(Topaz AI 등) 업스케일.',
    ],
  },
  {
    title: '3. 핵심 AI 제작 툴 스택 추천',
    bullets: [
      '기획·자동화: ChatGPT (GPT-4o) / Claude (MCP 캔버스 API 연동).',
      '이미지 에셋: Midjourney (미장센·키비주얼), Nano Banana (정체성 융합), Higgsfield (캐릭터 시트+I2V).',
      '비디오 생성: Kling (물리·모션), Seedance 2.0 (네이티브 립싱크), MiniMax H3 (10초 장기 모션), Runway Gen-3 (카메라 워킹), Vidu Q4 (Silent Reaction), Grok.',
      '오디오·캔버스: Supertone (TTS), Suno (유료 구독만 상업 이용 가능), Beeble AI (SFX), ArcLoop / Morphic / NadouPro / Newtake.',
    ],
  },
  {
    title: '4. 저작권·초상권 및 법령 준수 핵심 수칙',
    bullets: [
      '저작권 인정(USCO·문체부): 단순 프롬프트 입력물은 저작권 불인정. 인간의 직접 수정·보완 및 선택·배치 창작성이 인정되며, 등록 시 AI 생성 부분은 Disclaim 처리.',
      '표시 의무: AI 기본법 제31조(라벨/워터마크), 공정위 가상인물 광고("가상인물" 상시 자막), 유튜브 합성 콘텐츠 공개 태그 필수.',
      '초상권(부정경쟁방지법 타목): 실존 인물 얼굴·음성 무단 합성 처벌 대상. 배우·성우 계약 시 AI 학습 및 미발화 대사 합성 명시적 서면 동의서 체결.',
      '증빙 보관: 숏 테이블, 프롬프트 이력, 편집 타임라인 프로젝트 파일 및 유료 툴 구독 영수증·상업 약관 캡처 보관.',
    ],
  },
  {
    title: '5. 트러블슈팅 Q1~Q5 핵심 처방',
    bullets: [
      'Q1 (Character Drift): 시그니처 앵커 2~3개 동일 문구 유지 + @Character1 고유 태그 호출.',
      'Q2 (전신 샷 얼굴 뭉개짐): 전신 시트 얼굴 빗금 마스킹 + 확대 클로즈업(ECU/CU) 노드 분리.',
      'Q3 (손가락·신체 왜곡): 1장면 1행동 원칙 적용(복합 동작 컷 분할).',
      'Q4 (배경·조명 변화): 공간 불변 디테일(Invariant Detail) 1~2개 및 주 조명 방향(예: left 45 degrees) 고정.',
      'Q5 (립싱크 불일치): 네이티브 립싱크 엔진(Seedance 2.0) 사용 및 타임라인 0.9x~1.1x 미세 속도 조절.',
    ],
  },
];

export function getGroupedChecklist(completedIds: string[]): GroupedChecklist[] {
  const groupsOrder: string[] = [];
  const map = new Map<string, Array<ChecklistItem & { completed: boolean }>>();

  for (const item of CHECKLIST_ITEMS) {
    if (!map.has(item.group)) {
      groupsOrder.push(item.group);
      map.set(item.group, []);
    }
    map.get(item.group)!.push({
      ...item,
      completed: completedIds.includes(item.id),
    });
  }

  return groupsOrder.map((group) => {
    const items = map.get(group)!;
    return {
      group,
      items,
      completedCount: items.filter((i) => i.completed).length,
    };
  });
}

export function buildExportText(
  completedIds: string[],
  options: ExportOptions
): string {
  const now = new Date();
  const dateStr = now.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  const totalCount = CHECKLIST_ITEMS.length;
  const completedCount = completedIds.filter((id) =>
    CHECKLIST_ITEMS.some((i) => i.id === id)
  ).length;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const lines: string[] = [];
  lines.push('================================================================');
  lines.push('올인원 AI 드라마 제작 실전 매뉴얼 — 진행 상황 및 요약 가이드');
  lines.push('================================================================');
  lines.push(`내보낸 일시: ${dateStr}`);
  lines.push(`전체 진행률: ${completedCount} / ${totalCount} 완료 (${pct}%)`);
  lines.push('');

  if (options.includeChecklist) {
    lines.push('----------------------------------------------------------------');
    lines.push('[PART 1] 제작 공정 체크리스트 현황');
    lines.push('----------------------------------------------------------------');

    const grouped = getGroupedChecklist(completedIds);
    for (const grp of grouped) {
      lines.push(`\n■ ${grp.group} (${grp.completedCount}/${grp.items.length})`);
      for (const item of grp.items) {
        const mark = item.completed ? '[x]' : '[ ]';
        lines.push(`  ${mark} ${item.label}`);
        if (item.detail) {
          lines.push(`      └ ${item.detail}`);
        }
      }
    }
    lines.push('');
  }

  if (options.includeSummaryGuide) {
    lines.push('----------------------------------------------------------------');
    lines.push('[PART 2] AI 드라마 제작 실전 요약 가이드');
    lines.push('----------------------------------------------------------------');

    for (const sec of SUMMARY_GUIDE_SECTIONS) {
      lines.push(`\n■ ${sec.title}`);
      for (const bullet of sec.bullets) {
        lines.push(`  • ${bullet}`);
      }
    }
    lines.push('');
  }

  lines.push('================================================================');
  lines.push('작성 기준: 올인원 AI 드라마 제작 실전 매뉴얼');
  lines.push('================================================================');

  return lines.join('\n');
}

export function downloadTextFile(content: string, ext: 'txt' | 'md' = 'txt'): void {
  const dateStamp = new Date().toISOString().slice(0, 10);
  const filename = `ai-drama-manual-progress-${dateStamp}.${ext}`;
  const mimeType =
    ext === 'md' ? 'text/markdown;charset=utf-8' : 'text/plain;charset=utf-8';
  const blob = new Blob(['\uFEFF' + content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
