export type MainSectionId =
  | 'overview'
  | 'production'
  | 'tools'
  | 'legal'
  | 'faq';

export interface SubSectionItem {
  id: string;
  label: string;
  code: string;
}

export interface NavSection {
  id: MainSectionId;
  number: string;
  title: string;
  shortTitle: string;
  implemented: boolean;
  subSections: SubSectionItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    id: 'overview',
    number: '01',
    title: '개요 및 제작 로드맵',
    shortTitle: '개요 및 로드맵',
    implemented: true,
    subSections: [
      { id: 'sec-1-1', code: '1.1', label: '표준 6단계 제작 파이프라인' },
      { id: 'sec-1-2', code: '1.2', label: '5단계 검토 게이트 (Review Gates)' },
      { id: 'sec-1-3', code: '1.3', label: '전통 제작 대비 비교 특징' },
      { id: 'sec-1-4', code: '1.4', label: '초보자 사전 준비물 및 체크리스트' },
    ],
  },
  {
    id: 'production',
    number: '02',
    title: '단계별 실전 제작 가이드',
    shortTitle: '실전 제작 가이드',
    implemented: true,
    subSections: [
      { id: 'sec-2-1', code: '2.1', label: '기획 및 시나리오 (Pre-Production)' },
      { id: 'sec-2-2', code: '2.2', label: '비주얼 에셋 및 캐릭터 일관성 제어' },
      { id: 'sec-2-3', code: '2.3', label: '비디오 생성 및 모션 연출' },
      { id: 'sec-2-4', code: '2.4', label: '오디오 합성 및 후반 작업' },
    ],
  },
  {
    id: 'tools',
    number: '03',
    title: '필수 AI 제작 툴 디렉토리',
    shortTitle: 'AI 툴 디렉토리',
    implemented: true,
    subSections: [
      { id: 'sec-3-1', code: '3.1', label: '카테고리별 AI 툴 스택 카드' },
      { id: 'sec-3-2', code: '3.2', label: '전체 18종 약관·비용 요약표' },
    ],
  },
  {
    id: 'legal',
    number: '04',
    title: '저작권, 초상권 및 법령 가이드',
    shortTitle: '저작권 및 법령',
    implemented: true,
    subSections: [
      { id: 'sec-4-1', code: '4.1', label: 'AI 저작물 저작권 인정 기준' },
      { id: 'sec-4-2', code: '4.2', label: 'AI 생성물 라벨링 및 표시 의무' },
      { id: 'sec-4-3', code: '4.3', label: '초상권·퍼블리시티권 및 동의서' },
      { id: 'sec-4-4', code: '4.4', label: '법적 준수 Do & Don’t 대비표' },
    ],
  },
  {
    id: 'faq',
    number: '05',
    title: '초보자 FAQ 및 트러블슈팅',
    shortTitle: 'FAQ 및 트러블슈팅',
    implemented: true,
    subSections: [
      { id: 'sec-5-1', code: '5.1', label: '핵심 오류 Q1 ~ Q5 해결 아코디언' },
    ],
  },
];

export interface GlossaryEntry {
  id: string;
  term: string;
  fullName: string;
  category: '영상/생성' | '기획/연출' | '일관성 제어' | '오디오/후반' | '파이프라인';
  shortDef: string;
  detailedDef: string;
  beginnerTip: string;
}

export const GLOSSARY_ENTRIES: GlossaryEntry[] = [
  {
    id: 'i2v',
    term: 'I2V',
    fullName: 'Image-to-Video',
    category: '영상/생성',
    shortDef: '승인된 정지 이미지(스틸 프레임)를 첫 프레임으로 입력해 움직이는 영상 클립으로 변환하는 생성 방식입니다.',
    detailedDef:
      '텍스트만 입력하는 방식보다 캐릭터 외형, 의상, 조명, 배경 구도를 훨씬 안정적으로 유지할 수 있어 AI 드라마 메인 씬 제작의 100% 표준 방식으로 사용됩니다.',
    beginnerTip: '메인 인물이 등장하는 모든 샷은 반드시 스틸 이미지를 먼저 승인받은 뒤 I2V로 생성하세요.',
  },
  {
    id: 't2v',
    term: 'T2V',
    fullName: 'Text-to-Video',
    category: '영상/생성',
    shortDef: '기준 이미지 없이 텍스트 프롬프트만으로 바로 비디오 클립을 생성하는 방식입니다.',
    detailedDef:
      '캐릭터 얼굴이나 세트 일관성을 제어하기 어렵기 때문에 주연 배우가 나오는 장면에는 지양하며, 건물 외관·하늘·빗물 같은 익스태블리싱 샷이나 단순 배경에 제한적으로 활용합니다.',
    beginnerTip: '인물이 클로즈업으로 등장하는 장면에 T2V를 쓰면 컷마다 얼굴이 달라집니다.',
  },
  {
    id: 'seed',
    term: 'Seed',
    fullName: 'Random Seed Value (시드 고정값)',
    category: '일관성 제어',
    shortDef: 'AI 이미지·비디오 생성 시 노이즈 패턴의 출발점을 결정하는 고유 숫자 값입니다.',
    detailedDef:
      '같은 프롬프트라도 시드 값이 다르면 전혀 다른 구도와 인물이 출력됩니다. 시드 값을 고정하거나 기준 레퍼런스 이미지를 함께 바인딩하면 화풍과 구도의 편차를 크게 줄일 수 있습니다.',
    beginnerTip: '마음에 드는 결과물이 나왔을 때 시드 번호와 프롬프트를 함께 기록해 두면 미세 수정이 쉬워집니다.',
  },
  {
    id: 'lip-sync',
    term: 'Lip-sync',
    fullName: 'Native & Post Lip-Synchronization (립싱크)',
    category: '오디오/후반',
    shortDef: '캐릭터의 입 모양과 턱 움직임을 대사 음성 파일(TTS)의 음파에 정밀하게 맞추는 기술입니다.',
    detailedDef:
      'Seedance 2.0처럼 비디오 생성과 동시에 오디오 트랙을 입력해 입 모양을 만드는 네이티브 립싱크 방식과, 생성된 영상에 후처리로 입만 덮어씌우는 방식이 있습니다.',
    beginnerTip: '자연스러운 감정 연기를 원한다면 비디오 생성 시 오디오를 직접 입력하는 네이티브 립싱크를 권장합니다.',
  },
  {
    id: 'micro-drama',
    term: 'Micro-drama',
    fullName: 'Short-form Vertical Micro-drama (마이크로드라마)',
    category: '기획/연출',
    shortDef: '회당 60초~75초 내외, 9:16 세로 화면비로 제작되어 모바일에서 빠르게 소비되는 숏폼 드라마 포맷입니다.',
    detailedDef:
      '0~10초 내 Hook으로 시선을 붙잡고, 55~75초 지점에 강렬한 Cliffhanger를 배치해 다음 회차 결제를 유도하는 3단 서사 구조를 따릅니다.',
    beginnerTip: '긴 배경 설명은 과감히 생략하고 첫 장면부터 사건의 한가운데로 바로 들어가세요.',
  },
  {
    id: 'anchor-shot',
    term: 'Anchor Shot',
    fullName: 'Anchor Shot (거점 앵커 샷)',
    category: '기획/연출',
    shortDef: '전체 씬의 감정선과 공간 기준을 잡아주는 3~5개의 핵심 거점 샷입니다.',
    detailedDef:
      '인물의 핵심 감정 클로즈업, 사건을 보여주는 와이드 샷, 결정적 리액션 샷을 먼저 설계하고 승인한 뒤, 그 사이를 연결하는 미디엄/와이드 샷을 채워 일관성을 지킵니다.',
    beginnerTip: '모든 컷을 한 번에 뽑지 말고 앵커 샷 3~5장의 스틸 이미지부터 확정하세요.',
  },
  {
    id: 'asset-binding',
    term: 'Asset Binding',
    fullName: 'Character & Environment Asset Binding (자산 바인딩)',
    category: '일관성 제어',
    shortDef: '캐릭터 시트, 소품, 배경 이미지를 플랫폼 고유 ID(@Character1 등)로 등록해 고정 호출하는 작업입니다.',
    detailedDef:
      '매 컷마다 긴 외모 묘사를 반복하는 대신 미리 승인된 레퍼런스 시트를 노드에 연결해 컷 간 캐릭터 드리프트(Character Drift)를 방지합니다.',
    beginnerTip: '전신 샷의 얼굴은 빗금 마스킹 처리하고, 얼굴 정체성은 확대 클로즈업 시트에서 바인딩하세요.',
  },
  {
    id: 'invariant-detail',
    term: 'Invariant Detail',
    fullName: 'Spatial Invariant Detail (공간 불변 디테일)',
    category: '일관성 제어',
    shortDef: '동일 장소가 나오는 모든 프롬프트에 변함없이 고정 삽입하는 배경 핵심 오브젝트 문구입니다.',
    detailedDef:
      '예를 들어 "특정 황동 벽등과 붉은 벽돌 패턴"처럼 장면의 기준이 되는 물체를 프롬프트마다 동일하게 적어야 컷이 바뀌어도 세트가 무너지지 않습니다.',
    beginnerTip: '배경마다 절대 바뀌면 안 되는 소품 1~2개를 정해 프롬프트 템플릿에 박제해 두세요.',
  },
  {
    id: 'key-light',
    term: 'Key Light Continuity',
    fullName: 'Key Light Continuity (주 조명 방향 일관성)',
    category: '일관성 제어',
    shortDef: '하나의 씬(Scene) 안에서 주 광원이 비추는 방향과 색감을 일관되게 유지하는 규칙입니다.',
    detailedDef:
      '예: "cinematic lighting from top-left 45 degrees"처럼 빛의 각도를 모든 컷 프롬프트에 동일하게 명시하여 편집 시 이질감을 없앱니다.',
    beginnerTip: '주인공 컷과 상대방 리액션 컷의 조명 방향이 반대가 되지 않도록 방향 문구를 복붙하세요.',
  },
  {
    id: 'first-last-frame',
    term: 'First/Last Frame',
    fullName: 'First & Last Frame Linking (프레임 연동)',
    category: '영상/생성',
    shortDef: '이전 클립의 마지막 정지 프레임을 다음 클립의 첫 프레임 레퍼런스로 연결하는 기법입니다.',
    detailedDef:
      '피사체의 포즈, 시선, 위치가 컷 전환 시 갑자기 튀는 현상을 막고 3~6초 이상의 연속 동작을 자연스럽게 이어 붙일 때 사용합니다.',
    beginnerTip: '한 컷에서 끝낸 동작을 다음 동작으로 부드럽게 이어갈 때 마지막 프레임을 캡처해 I2V 시작점으로 넣으세요.',
  },
  {
    id: 'tts',
    term: 'TTS',
    fullName: 'Text-to-Speech (AI 음성 합성)',
    category: '오디오/후반',
    shortDef: '대본 텍스트를 입력하면 AI 성우의 감정 톤과 억양이 담긴 보이스오버 오디오로 생성하는 기술입니다.',
    detailedDef:
      'Supertone, ElevenLabs 등을 활용하며, 씬이 바뀌어도 목소리 톤이 달라지지 않도록 이전 대사의 오디오 레퍼런스를 함께 지정합니다.',
    beginnerTip: '대사 볼륨은 센터 채널에 배치하고 SFX/BGM보다 3~6dB 높여야 모바일 환경에서 잘 들립니다.',
  },
  {
    id: 'audio-ref',
    term: 'Audio Reference',
    fullName: 'Audio Voice Reference (오디오 레퍼런스)',
    category: '오디오/후반',
    shortDef: '동일 인물의 음색과 감정 톤을 유지하기 위해 기존 음성 구간을 기준 샘플로 지정하는 기능입니다.',
    detailedDef:
      'TTS 생성 시 씬마다 목소리가 미세하게 변하는 현상을 막기 위해 첫 번째로 완성된 캐릭터 음성 클립을 레퍼런스로 고정합니다.',
    beginnerTip: '가장 감정 연기가 잘 나온 첫 대사 클립을 캐릭터별 기준 오디오 파일로 저장해 두세요.',
  },
  {
    id: 'sfx-bgm',
    term: 'SFX / BGM',
    fullName: 'Sound Effects & Background Music',
    category: '오디오/후반',
    shortDef: '현장감을 살리는 폴리 효과음(SFX)과 서사 몰입도를 높이는 배경음악(BGM) 오디오 레이어입니다.',
    detailedDef:
      'Beeble AI 등으로 발자국·문 닫힘·빗소리 같은 효과음을 깔고, Suno 등을 통해 Hook-Conflict-Cliffhanger 곡선에 맞춘 배경음악을 레이어링합니다.',
    beginnerTip: '무음 구간이 길어지면 어색하므로 미세한 공간음(Ambience)을 깔아주고 대사와 겹치지 않게 볼륨을 조절하세요.',
  },
  {
    id: 'ecu-ms-ws',
    term: 'ECU / MS / WS',
    fullName: 'Extreme Close-Up / Medium Shot / Wide Shot',
    category: '기획/연출',
    shortDef: '카메라와 피사체 사이의 거리를 나타내는 표준 프레이밍(구도) 약어입니다.',
    detailedDef:
      'ECU(극단적 클로즈업)는 손끝·눈동자·시계 등 디테일 강조, MS(미디엄 샷)는 상반신 대화·표정 전달, WS(와이드 샷)는 공간 전체와 인물의 동선을 보여줄 때 씁니다.',
    beginnerTip: '숏 테이블 작성 시 ECU-MS-WS를 번갈아 배치하면 2~3초 하드컷 편집의 리듬감이 살아납니다.',
  },
  {
    id: 'mcp',
    term: 'MCP',
    fullName: 'Model Context Protocol',
    category: '파이프라인',
    shortDef: 'Claude 같은 LLM이 외부 제작 캔버스 플랫폼(Newtake 등)의 API와 노드를 직접 제어하도록 연결하는 프로토콜입니다.',
    detailedDef:
      '시나리오 작성부터 숏 카드 분해, 노드 자동 배치까지 사람 손을 덜 거치고 자동화된 파이프라인으로 연결할 때 활용합니다.',
    beginnerTip: '초기에는 수동 숏 테이블부터 익히고, 에피소드 대량 생산 단계에서 MCP 연동을 도입하면 효율이 극대화됩니다.',
  },
  {
    id: 'review-gate',
    term: 'Review Gate',
    fullName: '5-Stage Review Gate (검토 승인 게이트)',
    category: '파이프라인',
    shortDef: '불량 결과물이 다음 공정으로 넘어가 크레딧과 시간을 낭비하는 것을 막는 단계별 필수 검증 관문입니다.',
    detailedDef:
      '스토리(Gate 1) → 캐스팅 바인딩(Gate 2) → 스틸 프레임(Gate 3) → I2V 비디오(Gate 4) → 타임라인 컷 편집(Gate 5) 순서로 통과 여부를 판정합니다.',
    beginnerTip: 'Gate 3(스틸 이미지)을 통과하지 못한 샷은 절대 비디오 생성(Gate 4)으로 넘기지 마세요.',
  },
  {
    id: '480p-draft',
    term: '480p Draft',
    fullName: 'Low-Resolution Draft Gate (저화질 드래프트 사전 검증)',
    category: '파이프라인',
    shortDef: '고화질 렌더링 전에 저렴한 480p 해상도로 전 컷을 뽑아 컷 연결과 템포를 먼저 점검하는 방식입니다.',
    detailedDef:
      '비디오 생성 크레딧 낭비를 막기 위해 480p로 타임라인 조립 및 대사 싱크를 모두 확인한 뒤, 최종 확정된 컷만 1080p로 업스케일링합니다.',
    beginnerTip: '처음부터 1080p로 생성하면 수정 시 크레딧 손실이 큽니다. 무조건 480p 드래프트 검증 후 업스케일하세요.',
  },
  {
    id: 'in-media-res',
    term: 'In media res',
    fullName: 'In Medias Res (사건 한가운데 시작 기법)',
    category: '기획/연출',
    shortDef: '배경 설명이나 인물 소개 없이 이야기의 가장 긴박한 사건 한복판에서 즉시 시작하는 서사 기법입니다.',
    detailedDef:
      '60~75초 숏폼 드라마의 0~10초 Hook 구간에서 시청자가 스크롤을 넘기지 못하게 붙잡기 위한 필수 연출 전략입니다.',
    beginnerTip: '첫 컷에 평화로운 일상 대신 대립, 충격적인 물건, 또는 강렬한 한 줄 대사를 배치하세요.',
  },
];

export type ToolFilterCategory = '전체' | '기획' | '이미지' | '비디오' | '오디오' | '편집';

export interface ToolItem {
  id: string;
  name: string;
  sourceCategory: string;
  filterCategories: Array<Exclude<ToolFilterCategory, '전체'>>;
  features: string;
  recommendedUse: string;
  pricingAndTerms: string;
  difficulty: '쉬움' | '보통' | '어려움';
}

export const AI_TOOLS: ToolItem[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT (GPT-4o)',
    sourceCategory: '기획 / LLM',
    filterCategories: ['기획'],
    features: '시나리오 작성, 숏 테이블 자동 생성, 시각적 지문 변환',
    recommendedUse: '3단 서사 대본 작성 및 프롬프트 구조화',
    pricingAndTerms: '유/무료 플랜 (단순 입력물 저작권 보호 불가)',
    difficulty: '쉬움',
  },
  {
    id: 'claude-mcp',
    name: 'Claude (MCP)',
    sourceCategory: '기획 / 노드 연동',
    filterCategories: ['기획', '편집'],
    features: 'Model Context Protocol 기반 캔버스 플랫폼 직접 API 제어',
    recommendedUse: '노드 자동 배치 및 시나리오 ➔ 숏 카딩 자동화',
    pricingAndTerms: '유료 플랜 권장 (MCP 연동 기능 제공)',
    difficulty: '보통',
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    sourceCategory: '이미지 에셋',
    filterCategories: ['이미지'],
    features: '고화질 미장센, 다중 참고(Multi-reference) 이미지 생성',
    recommendedUse: '캐릭터 키비주얼 및 로케이션 시트 제작',
    pricingAndTerms: '유료 구독 (연 매출 $1M 이상 시 Pro/Mega)',
    difficulty: '보통',
  },
  {
    id: 'nano-banana',
    name: 'Nano Banana',
    sourceCategory: '이미지 에셋',
    filterCategories: ['이미지'],
    features: '정교한 캐릭터 정체성 융합 및 스타일 튜닝',
    recommendedUse: '등장인물 앵커 에셋 구축',
    pricingAndTerms: '유료 크레딧형',
    difficulty: '보통',
  },
  {
    id: 'higgsfield',
    name: 'Higgsfield',
    sourceCategory: '이미지 / 비디오',
    filterCategories: ['이미지', '비디오'],
    features: '캐릭터 시트 생성 및 I2V 비디오 렌더링 통합 지원',
    recommendedUse: '캐릭터 고정 및 숏드라마 클립 렌더링',
    pricingAndTerms: '유료 크레딧형',
    difficulty: '쉬움',
  },
  {
    id: 'kling',
    name: 'Kling',
    sourceCategory: '비디오 생성',
    filterCategories: ['비디오'],
    features: '물리 법칙 이해도 우수, 정교한 인물 모션 제어',
    recommendedUse: '승인된 스틸 기반 3~6초 메인 비디오 생성',
    pricingAndTerms: '유/무료 크레딧형',
    difficulty: '보통',
  },
  {
    id: 'seedance-2',
    name: 'Seedance 2.0',
    sourceCategory: '비디오 생성',
    filterCategories: ['비디오'],
    features: '비디오 생성과 동시에 오디오 맞춤 네이티브 립싱크 처리',
    recommendedUse: '대사 신 I2V 클립 및 립싱크 일괄 처리',
    pricingAndTerms: '유료 크레딧형',
    difficulty: '보통',
  },
  {
    id: 'minimax-h3',
    name: 'MiniMax H3',
    sourceCategory: '비디오 생성',
    filterCategories: ['비디오'],
    features: '768P/1080P 해상도에서 10초 장기 프레임 안정 유지',
    recommendedUse: '10초 이상 장기 모션 클립 생성',
    pricingAndTerms: '유료 크레딧형',
    difficulty: '보통',
  },
  {
    id: 'runway-gen3',
    name: 'Runway (Gen-3)',
    sourceCategory: '비디오 생성',
    filterCategories: ['비디오'],
    features: '카메라 워킹 및 텍스처 표현력 우수',
    recommendedUse: '시네마틱 카메라 무빙 샷 생성',
    pricingAndTerms: '유료 구독형',
    difficulty: '보통',
  },
  {
    id: 'vidu-q4',
    name: 'Vidu Q4',
    sourceCategory: '비디오 생성',
    filterCategories: ['비디오'],
    features: '대사 없는 인물의 정밀한 반응 연출(Silent Reaction) 특화',
    recommendedUse: '리액션 인서트 샷 연출',
    pricingAndTerms: '유료 크레딧형',
    difficulty: '보통',
  },
  {
    id: 'grok',
    name: 'Grok',
    sourceCategory: '비디오 / 오디오',
    filterCategories: ['비디오', '오디오'],
    features: '이미지 입력 기반 동작 생성 및 맞춤 오디오 통합 출력',
    recommendedUse: '빠른 컷 렌더링 및 배경음 통합',
    pricingAndTerms: '유료 플랜 연동',
    difficulty: '쉬움',
  },
  {
    id: 'supertone',
    name: 'Supertone',
    sourceCategory: '오디오 (TTS)',
    filterCategories: ['오디오'],
    features: '캐릭터별 다국어 음성 합성 및 감정 톤 제어',
    recommendedUse: '캐릭터 대사 보이스오버 생성',
    pricingAndTerms: '유료 구독형',
    difficulty: '쉬움',
  },
  {
    id: 'suno',
    name: 'Suno',
    sourceCategory: '오디오 (BGM)',
    filterCategories: ['오디오'],
    features: '장르별 숏드라마 맞춤 배경음악 및 보컬곡 생성',
    recommendedUse: '씬 무드에 맞는 BGM 레이어링',
    pricingAndTerms: '무료 곡 상업 불가, 유료 구독 곡만 상업 이용 가능',
    difficulty: '쉬움',
  },
  {
    id: 'beeble-ai',
    name: 'Beeble AI',
    sourceCategory: '오디오 (SFX)',
    filterCategories: ['오디오'],
    features: '정교한 미장센 효과음 및 폴리 사운드 생성',
    recommendedUse: '효과음(SFX) 레이어링 및 음향 배치',
    pricingAndTerms: '유/무료 크레딧형',
    difficulty: '보통',
  },
  {
    id: 'arcloop',
    name: 'ArcLoop',
    sourceCategory: '올인원 캔버스',
    filterCategories: ['편집'],
    features: '5단계 게이트 파이프라인 관리, 샷 카딩 및 통합 렌더링',
    recommendedUse: '파이프라인 오케스트레이션 및 연속성 관리',
    pricingAndTerms: '유료 플랫폼 (크레딧 차등)',
    difficulty: '보통',
  },
  {
    id: 'morphic',
    name: 'Morphic',
    sourceCategory: '올인원 캔버스',
    filterCategories: ['편집'],
    features: '캐릭터/로케이션 시트 템플릿 및 시네마틱 스토리보딩',
    recommendedUse: '불변 요소를 시스템적으로 고정 관리',
    pricingAndTerms: '유료 플랫폼',
    difficulty: '보통',
  },
  {
    id: 'nadoupro',
    name: 'NadouPro',
    sourceCategory: '노드 캔버스',
    filterCategories: ['편집'],
    features: '3D 디렉터(카메라 경로 프리비즈), 비주얼 그래프 연결',
    recommendedUse: '미장센 정밀 제어 및 카메라 경로 설계',
    pricingAndTerms: '유료 Pro/Max 플랜',
    difficulty: '어려움',
  },
  {
    id: 'newtake',
    name: 'Newtake',
    sourceCategory: '노드 캔버스',
    filterCategories: ['편집'],
    features: '얼굴 빗금 마스킹 노드 제어, Claude MCP 자동화 연동',
    recommendedUse: '얼굴 고정 및 파이프라인 자동 제어',
    pricingAndTerms: '유료 Pro/Max 플랜',
    difficulty: '보통',
  },
];

export interface ChecklistItem {
  id: string;
  section: MainSectionId;
  group: string;
  label: string;
  detail?: string;
}

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  // Section 1: 6 Pipeline Stages
  {
    id: 'pipe-1',
    section: 'overview',
    group: '1.1 표준 6단계 파이프라인',
    label: '1단계: 기획 및 시나리오 (Pre-Production)',
    detail: '로그라인, 3단 서사 구조(Hook-Conflict-Cliffhanger) 및 숏 테이블 작성 완료',
  },
  {
    id: 'pipe-2',
    section: 'overview',
    group: '1.1 표준 6단계 파이프라인',
    label: '2단계: 비주얼 자산 및 캐릭터 고정 (Asset Binding)',
    detail: '캐릭터 시트, 대표 소품 시트, 로케이션 배경 시트 생성 및 ID 바인딩',
  },
  {
    id: 'pipe-3',
    section: 'overview',
    group: '1.1 표준 6단계 파이프라인',
    label: '3단계: 스토리보드 및 스틸 프레임 승인 (Still Frame Gate)',
    detail: '샷 카드 분해 및 1차 정지 이미지 구도·표정·조명 검증',
  },
  {
    id: 'pipe-4',
    section: 'overview',
    group: '1.1 표준 6단계 파이프라인',
    label: '4단계: 비디오 클립 생성 (Video Generation)',
    detail: '승인된 스틸 이미지를 I2V 및 Multi-reference 엔진으로 3~6초 클립 렌더링',
  },
  {
    id: 'pipe-5',
    section: 'overview',
    group: '1.1 표준 6단계 파이프라인',
    label: '5단계: 오디오 합성 및 타임라인 편집 (Audio & Editing)',
    detail: 'AI 성우 보이스오버(TTS), 립싱크, BGM/SFX 오디오 레이어링 및 컷 조립',
  },
  {
    id: 'pipe-6',
    section: 'overview',
    group: '1.1 표준 6단계 파이프라인',
    label: '6단계: 드래프트 검증 및 최종 업스케일링 (Post-Production)',
    detail: '480p 드래프트 연결성 점검 후 확정 컷만 1080p 고화질 업스케일링 및 자막 마감',
  },
  // Section 1: 5 Review Gates
  {
    id: 'gate-1',
    section: 'overview',
    group: '1.2 5단계 검토 게이트',
    label: 'Gate 1: 스토리 아웃라인 게이트 통과',
    detail: '화면비(9:16/16:9), 로그라인 두 문장만으로 목적과 갈등이 직관적으로 이해됨',
  },
  {
    id: 'gate-2',
    section: 'overview',
    group: '1.2 5단계 검토 게이트',
    label: 'Gate 2: 캐스팅 및 캐릭터 바인딩 게이트 통과',
    detail: '캐릭터당 2~3개 시그니처 비주얼 앵커 확정 및 @Character1 ID 부여 완료',
  },
  {
    id: 'gate-3',
    section: 'overview',
    group: '1.2 5단계 검토 게이트',
    label: 'Gate 3: 샷 카드 및 스틸 프레임 승인 게이트 통과',
    detail: '앵커 숏(Anchor Shot)의 구도, 조명, 인물 표정 1차 승인 완료',
  },
  {
    id: 'gate-4',
    section: 'overview',
    group: '1.2 5단계 검토 게이트',
    label: 'Gate 4: 승인 스틸 기반 비디오 생성 게이트 통과',
    detail: '1장면 1행동 유지 및 신체 뭉개짐 없음 검증 완료',
  },
  {
    id: 'gate-5',
    section: 'overview',
    group: '1.2 5단계 검토 게이트',
    label: 'Gate 5: 오디오 합성 및 타임라인 컷 편집 게이트 통과',
    detail: '대사 전달력, 립싱크 자연스러움, 템포 타임라인 완결성 확보',
  },
  // Section 1: Pre-production asset checklist
  {
    id: 'prep-1',
    section: 'overview',
    group: '1.4 사전 자산 체크리스트',
    label: '9:16 종면 화면비 및 프로젝트 해상도(초안 480p, 최종 1080p) 설정 완료',
  },
  {
    id: 'prep-2',
    section: 'overview',
    group: '1.4 사전 자산 체크리스트',
    label: '캐릭터당 2~3개 시그니처 비주얼 앵커(고유 의상, 헤어, 소품) 선정',
  },
  {
    id: 'prep-3',
    section: 'overview',
    group: '1.4 사전 자산 체크리스트',
    label: '로케이션 내부 불변 디테일(Invariant Detail) 문구 정리',
  },
  {
    id: 'prep-4',
    section: 'overview',
    group: '1.4 사전 자산 체크리스트',
    label: '주 조명 방향(Key Light Continuity) 설정 완료',
  },
  // Section 2: Practical execution milestones
  {
    id: 'prac-2-1',
    section: 'production',
    group: '2.1 기획 및 시나리오',
    label: '3단 서사 구조(Hook-Conflict-Cliffhanger) 기반 시각적 지문 대본 및 숏 테이블 완성',
  },
  {
    id: 'prac-2-2',
    section: 'production',
    group: '2.2 비주얼 에셋',
    label: '전신 얼굴 마스킹(빗금) 분리 시트, 6분할 표정 시트 및 프롬프트 태깅 공식 세팅',
  },
  {
    id: 'prac-2-3',
    section: 'production',
    group: '2.3 비디오 생성',
    label: '1장면 1행동 원칙 적용 I2V 클립 렌더링 및 First/Last Frame·네이티브 립싱크 연동',
  },
  {
    id: 'prac-2-4',
    section: 'production',
    group: '2.4 오디오 및 후반',
    label: '오디오 레퍼런스 TTS·레이어링(Voice +3~6dB) 및 480p 드래프트 검증 후 1080p 업스케일링',
  },
  // Section 3: AI Tool Stack setup milestones
  {
    id: 'tool-1',
    section: 'tools',
    group: '3.1 AI 툴 스택 선정',
    label: '기획(LLM)·이미지·비디오·오디오·캔버스 분야별 주력 AI 툴 조합 선정 완료',
  },
  {
    id: 'tool-2',
    section: 'tools',
    group: '3.2 약관 및 플랜 확인',
    label: '선정 툴(Midjourney, Suno 등)의 유료 플랜 및 상업적 이용 가능 조건 확인 완료',
  },
  // Section 4: Legal compliance milestones
  {
    id: 'legal-1',
    section: 'legal',
    group: '4.4 법적 준수 증빙',
    label: '숏 테이블, 프롬프트 이력, 컷 편집 타임라인 프로젝트 파일 보관 (저작권 입증)',
  },
  {
    id: 'legal-2',
    section: 'legal',
    group: '4.4 법적 준수 증빙',
    label: 'AI 생성물 가시적 라벨·워터마크 및 가상인물 광고 상시 자막 표시 적용',
  },
  {
    id: 'legal-3',
    section: 'legal',
    group: '4.4 법적 준수 증빙',
    label: '출연진·성우 전용 AI 데이터 학습 및 미발화 문장 합성 서면 동의서 체결',
  },
  {
    id: 'legal-4',
    section: 'legal',
    group: '4.4 법적 준수 증빙',
    label: '유료 구독 영수증 및 상업적 이용 가능 약관(Suno, Midjourney 등) 증빙 보관',
  },
  // Section 5: FAQ & QA troubleshooting milestones
  {
    id: 'faq-1',
    section: 'faq',
    group: '5.1 품질 점검 및 트러블슈팅',
    label: '캐릭터 드리프트·전신 얼굴 마스킹·1장면 1행동 원칙 사전 점검 완료',
  },
  {
    id: 'faq-2',
    section: 'faq',
    group: '5.1 품질 점검 및 트러블슈팅',
    label: '배경/조명 불변 디테일 고정 및 480p 드래프트 립싱크 싱크 최종 QA 완료',
  },
];

export interface StageProgressStat {
  sectionId: MainSectionId;
  stageCode: string;
  shortLabel: string;
  fullTitle: string;
  completed: number;
  total: number;
  percentage: number;
}

const STAGE_SHORT_LABELS: Record<MainSectionId, string> = {
  overview: '01 개요',
  production: '02 제작',
  tools: '03 툴',
  legal: '04 법령',
  faq: '05 FAQ',
};

export function getStageProgressStats(completedIds: string[]): StageProgressStat[] {
  return NAV_SECTIONS.map((sec) => {
    const items = CHECKLIST_ITEMS.filter((item) => item.section === sec.id);
    const completed = items.filter((item) => completedIds.includes(item.id)).length;
    const total = items.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      sectionId: sec.id,
      stageCode: sec.number,
      shortLabel: STAGE_SHORT_LABELS[sec.id],
      fullTitle: sec.title,
      completed,
      total,
      percentage,
    };
  });
}

export interface SearchDocument {
  id: string;
  sectionId: MainSectionId;
  anchorId: string;
  title: string;
  breadcrumb: string;
  keywords: string[];
  snippet: string;
}

export const SEARCH_DOCUMENTS: SearchDocument[] = [
  {
    id: 'doc-1-1',
    sectionId: 'overview',
    anchorId: 'sec-1-1',
    title: '1.1 표준 6단계 제작 파이프라인',
    breadcrumb: '01. 개요 및 로드맵 > 1.1',
    keywords: ['파이프라인', '기획', 'Asset Binding', 'Still Frame', 'I2V', 'Multi-reference', 'TTS', 'Lip-Sync', 'BGM', 'SFX', '480p', '1080p', '업스케일링', '마이크로드라마', '30달러'],
    snippet: 'Pre-Production → Asset Binding → Still Frame Gate → Video Generation(3~6초 I2V) → Audio & Editing → 480p 드래프트 검증 및 1080p 업스케일링',
  },
  {
    id: 'doc-1-2',
    sectionId: 'overview',
    anchorId: 'sec-1-2',
    title: '1.2 5단계 검토 게이트 (Review Gates) 체계',
    breadcrumb: '01. 개요 및 로드맵 > 1.2',
    keywords: ['Gate 1', 'Gate 2', 'Gate 3', 'Gate 4', 'Gate 5', 'Review Gate', '스토리 아웃라인', '캐스팅', '@Character1', '샷 카드', '앵커 숏', '1장면 1행동', '타임라인'],
    snippet: '제작 비용과 크레딧 낭비를 막기 위한 5가지 필수 승인 관문(아웃라인 · 캐릭터 바인딩 · 스틸 프레임 · I2V 비디오 · 오디오 타임라인)',
  },
  {
    id: 'doc-1-3',
    sectionId: 'overview',
    anchorId: 'sec-1-3',
    title: '1.3 전통 미디어 제작 대비 AI 제작의 비교 특징',
    breadcrumb: '01. 개요 및 로드맵 > 1.3',
    keywords: ['분당 제작비', '제작 기간', '100회', '인력 구조', '연속성 제어', '재작업', '전통 영상 제작', '$30'],
    snippet: '분당 제작비 약 $30(1/100 수준), 100회 에피소드 3~7일 완편, 1~3인 소규모 팀 및 레퍼런스 노드 기반 연속성 제어 비교표',
  },
  {
    id: 'doc-1-4',
    sectionId: 'overview',
    anchorId: 'sec-1-4',
    title: '1.4 초보자 사전 준비물 및 체크리스트',
    breadcrumb: '01. 개요 및 로드맵 > 1.4',
    keywords: ['ChatGPT', 'GPT-4o', 'Claude', 'MCP', 'Midjourney', 'Nano Banana', 'Kling', 'Seedance', 'MiniMax', 'ArcLoop', 'Morphic', 'NadouPro', 'Newtake', 'Supertone', 'ElevenLabs', 'Suno', 'CapCut', 'Premiere', '9:16', 'Invariant Detail', 'Key Light Continuity'],
    snippet: 'LLM·이미지·비디오·캔버스·오디오 필수 계정 목록 및 9:16 화면비, 시그니처 앵커, 불변 디테일, 주 조명 방향 사전 자산 체크리스트',
  },
  {
    id: 'doc-2-1',
    sectionId: 'production',
    anchorId: 'sec-2-1',
    title: '2.1 기획 및 시나리오 (Pre-Production)',
    breadcrumb: '02. 실전 제작 가이드 > 2.1',
    keywords: ['3단 서사', 'Hook', 'Conflict', 'Cliffhanger', '60초', '75초', 'In media res', '하드컷', '시각적 지문', '숏 테이블', 'Shot Table', 'Anchor Shot', 'ECU', 'MS', 'WS', '서진', '황동 손목시계'],
    snippet: '0~10초 Hook · 10~55초 Conflict · 55~75초 Cliffhanger 3단 서사 구조, 물리적 동작 위주의 시각적 지문 작성법, 앵커 숏 우선 숏 테이블 예시',
  },
  {
    id: 'doc-2-2',
    sectionId: 'production',
    anchorId: 'sec-2-2',
    title: '2.2 비주얼 에셋 및 캐릭터 일관성 제어',
    breadcrumb: '02. 실전 제작 가이드 > 2.2',
    keywords: ['전신 컷', '얼굴 마스킹', '빗금 처리', '6분할 표정 시트', 'Expression Sheet', '시그니처 앵커', 'Invariant Detail', 'Key Light Continuity', 'cinematic lighting', '@Character1', '프롬프트 공식', 'neon green vest'],
    snippet: '전신 컷 얼굴 빗금 마스킹 분리 기법, 6분할 표정 시트, 시그니처 앵커 2~3개, 공간 불변 디테일 및 복사 가능한 프롬프트 표준 공식',
  },
  {
    id: 'doc-2-3',
    sectionId: 'production',
    anchorId: 'sec-2-3',
    title: '2.3 비디오 생성 및 모션 연출 (Video Generation & Motion)',
    breadcrumb: '02. 실전 제작 가이드 > 2.3',
    keywords: ['I2V', 'T2V', '1장면 1행동', '카메라 워킹', 'Pan left', 'Slow zoom-in', 'Static shot', 'Tracking shot', 'First/Last Frame', '프레임 연동', '네이티브 립싱크', 'Seedance 2.0'],
    snippet: '메인 씬 I2V 100% vs 배경 T2V 선택 기준, 1장면 1행동 원칙, 1축 카메라 무빙 명령어, First/Last Frame 연동 및 네이티브 립싱크',
  },
  {
    id: 'doc-2-4',
    sectionId: 'production',
    anchorId: 'sec-2-4',
    title: '2.4 오디오 합성 및 후반 작업 (Audio & Post-Production)',
    breadcrumb: '02. 실전 제작 가이드 > 2.4',
    keywords: ['TTS', 'Supertone', '오디오 레퍼런스', 'Audio Reference', '레이어링', 'Voice', 'SFX', 'BGM', 'Beeble AI', 'Suno', '3~6dB', '480p', '1080p', 'Topaz AI', '업스케일링'],
    snippet: 'Supertone 오디오 레퍼런스 일관성 유지, 센터 채널 +3~6dB 대사·Beeble AI SFX·Suno BGM 레이어링, 480p 드래프트 검증 후 1080p 업스케일링',
  },
  {
    id: 'doc-3-1',
    sectionId: 'tools',
    anchorId: 'sec-3-1',
    title: '3. 필수 AI 제작 툴 디렉토리 (18종 툴 스택)',
    breadcrumb: '03. AI 툴 디렉토리 > 3.1',
    keywords: ['ChatGPT', 'Claude', 'MCP', 'Midjourney', 'Nano Banana', 'Higgsfield', 'Kling', 'Seedance 2.0', 'MiniMax H3', 'Runway', 'Gen-3', 'Vidu Q4', 'Grok', 'Supertone', 'Suno', 'Beeble AI', 'ArcLoop', 'Morphic', 'NadouPro', 'Newtake', '3D 디렉터', 'Silent Reaction'],
    snippet: '기획(ChatGPT·Claude), 이미지(Midjourney·Nano Banana), 비디오(Kling·Seedance 2.0·MiniMax H3·Runway·Vidu Q4), 오디오(Supertone·Suno·Beeble AI), 캔버스(ArcLoop·Morphic·NadouPro·Newtake) 디렉토리',
  },
  {
    id: 'doc-4-1',
    sectionId: 'legal',
    anchorId: 'sec-4-1',
    title: '4.1 AI 저작물 저작권 인정 기준 (인간의 창작적 기여)',
    breadcrumb: '04. 저작권 및 법령 > 4.1',
    keywords: ['저작권', 'USCO', '미국 저작권청', '문체부', 'Human Authorship', 'Disclaim', '프롬프트 불인정', '수정 보완', '선택 및 배치'],
    snippet: '단순 프롬프트 입력물 저작권 불인정 원칙, 인간의 직접 수정·선택 및 배치 요건, 저작권 등록 시 순수 AI 부분 Disclaim 수칙',
  },
  {
    id: 'doc-4-2',
    sectionId: 'legal',
    anchorId: 'sec-4-2',
    title: '4.2 AI 생성물 라벨링 및 표시 의무',
    breadcrumb: '04. 저작권 및 법령 > 4.2',
    keywords: ['AI 기본법', '제31조', '워터마크', '공정거래위원회', '가상인물', '유튜브', 'YouTube', '합성 콘텐츠', '라벨링'],
    snippet: '대한민국 AI 기본법 제31조 가시적 라벨·메타데이터 워터마크, 공정위 가상인물 상시 자막, 유튜브 합성 콘텐츠 공개 의무',
  },
  {
    id: 'doc-4-3',
    sectionId: 'legal',
    anchorId: 'sec-4-3',
    title: '4.3 초상권·퍼블리시티권 및 Do & Don’t 대비표',
    breadcrumb: '04. 저작권 및 법령 > 4.3~4.4',
    keywords: ['부정경쟁방지법', '초상권', '퍼블리시티권', '동의서', '미발화', 'Suno 무료', 'Do', 'Don’t', '영수증'],
    snippet: '부정경쟁방지법 제2조 제1호 타목 처벌 리스크, 배우·성우 AI 합성 명시적 동의서, 저작권 입증·라벨·초상권·약관 Do & Don’t 대비 카드',
  },
  {
    id: 'doc-5-1',
    sectionId: 'faq',
    anchorId: 'sec-5-1',
    title: '5. 초보자 FAQ 및 트러블슈팅 (Q1~Q5)',
    breadcrumb: '05. FAQ 및 트러블슈팅 > 5.1',
    keywords: ['FAQ', '트러블슈팅', 'Character Drift', '얼굴 뭉개짐', '전신 샷', '손가락', '일그러짐', '1장면 1행동', '배경 세트', '조명 톤', 'Lip-Sync Mismatch', 'Speed Ramp', '0.9x', '1.1x'],
    snippet: '컷마다 캐릭터 변경(Character Drift), 전신 샷 얼굴 뭉개짐, 손가락 왜곡, 배경/조명 변화, 립싱크 어긋남 해결 아코디언',
  },
];
