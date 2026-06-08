export type SkillGroup = {
  title: string;
  items: string[];
};

export type Project = {
  title: string;
  summary: string;
  role: string;
  period: string;
  tech: string[];
  metrics: { label: string; value: string }[];
  workflowTerms?: {
    label: string;
    purpose: string;
    used: string[];
    result: string;
  }[];
  links: {
    live?: string;
    github?: string;
  };
  image?: string;
  imageAlt: string;
  achievements: {
    summary: string;
    details: string;
    before: string;
    after: string;
  }[];
  details: {
    context: string;
    role: string;
    architecture: string;
    keyFeatures: string[];
    challenges: string[];
    solutions: string[];
    validation: string[];
    result: string;
    process?: string;
    codeHighlight?: {
      title: string;
      code: string;
    };
  };
};

export const portfolio = {
  profile: {
    name: "민사빈",
    title: "Front-End Developer",
    headline: "사용자 흐름을 구현하고, 배포와 검증까지 책임지는 프론트엔드 개발자",
    intro:
      "Next.js, React, TypeScript를 중심으로 웹 서비스를 만들고, 테스트와 배포 과정을 함께 설계합니다. AI 스킬 기반 워크플로우를 활용해 반복 작업을 구조화하고 개발 과정을 문서화합니다.",
    highlights: [
      "프론트엔드 중심의 제품형 웹 서비스 구현 경험",
      "API, 인증, 캐시, 테스트, 배포까지 고려한 프로젝트 설계",
      "AI 스킬과 하네스 기반 워크플로우를 활용한 문서화, 이슈화, 핸드오프 경험",
    ],
    contacts: {
      email: "minsabin1108@gmail.com",
      github: "https://github.com/sabin1108",
    },
    resume: {
      enabled: false,
      label: "Resume PDF 준비 중",
      href: "/files/minsabin-resume.pdf",
    },
  },
  techStack: ["JavaScript", "React", "TypeScript", "GitHub", "Slack", "Notion"],
  projects: [
    {
      title: "Game-information-platform",
      summary:
        "AI Skill, Harness, Fallow를 개발 운영 체계로 사용해 기획-이슈분할-구현-검증-정적분석-배포 증거화를 연결한 Next.js 게임 할인 플랫폼",
      role: "프론트엔드 구현, AI-assisted workflow 설계, 정적 분석 기반 품질 개선, 배포/검증 증거 정리",
      period: "2026",
      tech: ["Next.js", "React", "TypeScript", "Supabase", "Vitest", "Playwright"],
      metrics: [
        { label: "Dead-code", value: "15 -> 1" },
        { label: "Duplication", value: "9.23 -> 7.07%" },
        { label: "Tests", value: "60 passed" },
      ],
      workflowTerms: [
        {
          label: "AI Skill",
          purpose:
            "AI를 코드 작성 보조가 아니라 PRD, 이슈 분해, 핸드오프, 리뷰, 문서화로 나눈 작업 운영 도구로 사용했습니다.",
          used: ["to-prd", "to-issues", "handoff", "grill-me", "portfolio-evidence-review"],
          result:
            "큰 로드맵을 #15-#25 실행 단위로 분할하고, 테스트/CI/문서/포트폴리오 evidence까지 남겼습니다.",
        },
        {
          label: "Harness",
          purpose:
            "기능 구현 중 product, data contract, frontend UX, QA, portfolio evidence 관점이 빠지지 않게 역할을 분리했습니다.",
          used: [
            "5 project agents",
            "5 guardrail skills",
            "game-deal-harness-orchestrator",
          ],
          result:
            "프로젝트 전용 agent/skill 체계를 구성해 긴 세션에서도 같은 품질 기준을 유지했습니다.",
        },
        {
          label: "Fallow",
          purpose:
            "유지보수 품질을 감으로 판단하지 않고 dead code, duplication, complexity hotspot을 수치로 확인했습니다.",
          used: ["dead-code", "dupes", "score", "churn"],
          result:
            "dead-code 15건 -> 1건, duplication 9.23% -> 7.07%, unused file/export/type 0건까지 정리했습니다.",
        },
        {
          label: "Caveman",
          purpose:
            "긴 개발 세션에서 보고와 핸드오프를 짧게 압축해 반복 설명과 토큰 낭비를 줄였습니다.",
          used: ["caveman", "caveman-commit", "caveman-review"],
          result:
            "진행 상황, commit message, review 관점을 짧은 한국어 요약으로 유지했습니다.",
        },
      ],
      links: {
        live: "https://www.gamesaleinfo.site",
        github: "https://github.com/sabin1108/Game-information-platform",
      },
      imageAlt: "Game-information-platform 프로젝트 화면",
      achievements: [
        {
          summary: "AI Skill로 PRD-이슈-구현-검증 흐름 구조화",
          details:
            "to-prd, to-issues, handoff를 사용해 큰 요구사항을 실행 가능한 GitHub issue와 검증 기준으로 나눴습니다.",
          before: "큰 로드맵",
          after: "#15-#25 분할",
        },
        {
          summary: "Harness로 프로젝트 전용 agent/skill 체계 구성",
          details:
            "product, data contract, frontend UX, QA/observability, portfolio evidence 관점을 분리해 작업 누락을 줄였습니다.",
          before: "범용 AI 사용",
          after: "전용 체계",
        },
        {
          summary: "Fallow 분석으로 dead-code와 duplication 정리",
          details:
            "Fallow 지표를 기준으로 unused file/export/type, duplicate clone group, refactoring target을 정리했습니다.",
          before: "15 dead-code",
          after: "1 dead-code",
        },
        {
          summary: "검증과 배포 evidence를 포트폴리오 증거로 연결",
          details:
            "Vitest 60 tests, Playwright smoke, CI, bundle report, demo guide를 남겨 구현 결과를 재현 가능하게 정리했습니다.",
          before: "구현 설명",
          after: "증거 기반",
        },
      ],
      details: {
        context:
          "Game Sale Info는 Steam/Epic 할인 탐색, 검색, 관심 목록, 목표 가격 조건, AI 할인 인사이트를 제공하는 Next.js 서비스입니다. 이 프로젝트의 핵심은 기능 구현뿐 아니라 AI skill과 하네스를 이용해 긴 개발 작업을 운영 가능한 프로세스로 만든 점입니다.",
        role:
          "프론트엔드 구현과 함께 AI-assisted workflow를 설계했습니다. PRD, issue slicing, handoff, 정적 분석, 테스트/CI, bundle/demo evidence를 작업 흐름에 연결했습니다.",
        architecture:
          "Next.js App Router와 Supabase 기반 서비스 위에 Codex/Harness 작업 체계를 붙였습니다. Harness는 product, data contract, frontend UX, QA/observability, portfolio evidence 관점을 agent/skill로 분리했고, Fallow는 코드 품질 측정과 리팩터링 target 선정에 사용했습니다.",
        keyFeatures: [
          "Codex Harness 기반 project-specific agent 5개와 guardrail skill 5개 구성",
          "to-issues로 parent issue를 #15-#25 vertical slice로 분할",
          "handoff로 issue 상태, 검증 결과, secret 처리 규칙을 세션 간 유지",
          "Fallow로 dead code, duplication, maintainability, hotspot 측정",
          "caveman으로 긴 보고/커밋/리뷰 요약 압축",
        ],
        challenges: [
          "auth, Supabase, 외부 API, webview, analytics, AI insight, CI가 섞여 매 세션마다 맥락 손실 위험이 있었습니다.",
          "AI가 기능 구현만 보고 테스트, 문서, 포트폴리오 증거, 데이터 계약을 놓칠 수 있었습니다.",
          "기능 추가 후 unused code와 duplication이 쌓여 유지보수 품질을 수치로 확인할 필요가 있었습니다.",
        ],
        solutions: [
          "Harness로 역할별 agent/skill을 만들어 product, data, frontend, QA, portfolio 관점을 분리했습니다.",
          "to-prd/to-issues로 큰 요구사항을 GitHub issue 단위로 나누고, handoff로 다음 세션 기준을 남겼습니다.",
          "Fallow 분석 결과를 기준으로 dead-code와 duplicate clone group을 줄이고 남은 hotspot을 문서화했습니다.",
        ],
        validation: [
          "Vitest: 21 files / 60 tests passed",
          "Playwright smoke: 2 tests passed",
          "typecheck / lint / production build 통과",
          "Fallow: dead-code 15 -> 1, duplication 9.23% -> 7.07%",
          "Bundle evidence: home first load JS 108 kB, deals 109 kB, search 107 kB",
        ],
        result:
          "AI를 단순 코드 생성 도구가 아니라 프로젝트 운영 체계로 사용했습니다. 결과를 issue, commit, test, CI, Fallow 지표, bundle report, demo guide로 남겨 포트폴리오에서 설명 가능한 증거로 만들었습니다.",
        process:
          "아이디어/로드맵 -> PRD/docs -> to-issues issue slicing -> Harness agent/skill 운영 -> handoff 맥락 유지 -> fallow 품질 측정 -> 구현/테스트/CI/배포 smoke -> 포트폴리오 evidence 정리 흐름으로 진행했습니다.",
        codeHighlight: {
          title: "Fallow 품질 측정 명령",
          code: `npx fallow --format json --quiet --score
npx fallow dead-code --format json --quiet
npx fallow dupes --format json --quiet`,
        },
      },
    },
    {
      title: "PhotoMap",
      summary:
        "사용자의 여행 사진을 지도와 시각화 기반으로 기록할 수 있게 만든 사진 기록 웹 서비스",
      role: "프론트엔드 구현, 렌더링 최적화, 시각화 UX 개선",
      period: "2025",
      tech: ["React", "JavaScript", "TypeScript"],
      metrics: [
        { label: "Rendering", value: "Windowing" },
        { label: "State", value: "Global" },
        { label: "Speed", value: "Lazy Load" },
      ],
      links: {
        live: "https://photomap-nine.vercel.app/",
        github: "https://github.com/sabin1108/Photomap",
      },
      imageAlt: "PhotoMap 프로젝트 화면",
      achievements: [
        {
          summary: "가상화 기술을 이용한 렌더링 최적화",
          details:
            "대량 이미지 리스트 렌더링 시 발생하는 성능 저하를 해결하기 위해 windowing 방식을 적용했습니다.",
          before: "렌더링 지연",
          after: "성능 개선",
        },
        {
          summary: "전역 상태 관리 구조 개선",
          details:
            "복잡한 컴포넌트 간 데이터 전달 문제를 전역 상태 관리 방식으로 구조화했습니다.",
          before: "복잡한 전달",
          after: "상태 구조화",
        },
        {
          summary: "이미지 지연 로딩 기반 초기 진입 속도 개선",
          details:
            "초기 화면에 필요한 리소스를 우선하고 이미지 로딩을 분산해 사용자 대기 시간을 줄였습니다.",
          before: "초기 지연",
          after: "속도 개선",
        },
      ],
      details: {
        context:
          "사진을 단순 저장하는 대신 지도와 시각화를 통해 여행 기록의 맥락을 보여주는 서비스를 목표로 했습니다.",
        role:
          "프론트엔드 화면 구현, 대량 이미지 렌더링 최적화, 사용자 기록을 시각적으로 표현하는 UI 구조를 담당했습니다.",
        architecture:
          "React 기반 화면 구조에 이미지 리스트, 지도 기반 정보, 전역 상태를 연결했습니다. 대량 이미지 처리 구간은 windowing과 lazy loading을 적용할 수 있도록 분리했습니다.",
        keyFeatures: ["사진 기록 관리", "지도 기반 탐색", "연결망 형태의 데이터 시각화"],
        challenges: [
          "이미지가 많아질수록 렌더링 지연이 발생했습니다.",
          "여러 화면에서 같은 사진/위치 데이터를 공유해야 했습니다.",
        ],
        solutions: [
          "화면에 보이는 항목만 렌더링하는 windowing 방식을 적용했습니다.",
          "공유 데이터는 전역 상태로 관리해 컴포넌트 간 전달 부담을 줄였습니다.",
        ],
        validation: ["배포 URL 기반 화면 확인", "주요 사용자 흐름 수동 QA"],
        result:
          "사용자의 사진 기록을 단순 목록이 아니라 지도와 시각화 흐름으로 탐색할 수 있게 개선했습니다.",
        codeHighlight: {
          title: "Windowing 적용 예시",
          code: `const renderRow = ({ index, style }) => (
  <div style={style}>
    <Image src={photos[index].url} loading="lazy" />
  </div>
);`,
        },
      },
    },
    {
      title: "AIChatBot",
      summary:
        "Next.js와 전역 상태 최적화를 활용한 AI 채팅 인터페이스 및 접근성 중심 UX 프로젝트",
      role: "채팅 UI 구현, 응답 파서, 상태 동기화, 프록시 통신 구조 설계",
      period: "2025",
      tech: ["Next.js", "Proxy API", "Blob API", "Regex"],
      metrics: [
        { label: "Parse", value: "Regex" },
        { label: "Sync", value: "Tab-Sync" },
        { label: "Storage", value: "Blob" },
      ],
      links: {
        github: "https://github.com/sabin1108/graduation-project",
      },
      imageAlt: "AIChatBot 프로젝트 화면",
      achievements: [
        {
          summary: "Regex 기반 응답 파서 구현",
          details:
            "AI 응답 텍스트에서 코드 블록, 링크, 강조 표현을 감지해 읽기 쉬운 메시지로 변환했습니다.",
          before: "일반 텍스트",
          after: "구조화 응답",
        },
        {
          summary: "Tab-Sync 기반 상태 유지",
          details:
            "여러 탭 간 채팅 상태를 동기화하고 브라우저 종료 후에도 대화 내역이 유지되도록 설계했습니다.",
          before: "비동기화",
          after: "상태 동기화",
        },
        {
          summary: "Proxy API 기반 외부 통신 구조",
          details:
            "CORS와 보안 이슈를 줄이기 위해 클라이언트 요청을 프록시 서버 구조로 정리했습니다.",
          before: "직접 호출",
          after: "프록시 통신",
        },
      ],
      details: {
        context:
          "AI 응답을 단순 텍스트로 보여주는 데서 그치지 않고, 코드와 링크를 읽기 쉬운 형태로 표현하는 채팅 UX를 목표로 했습니다.",
        role:
          "채팅 인터페이스, 응답 파싱 로직, 상태 유지 방식, 외부 API 프록시 통신 구조를 설계하고 구현했습니다.",
        architecture:
          "Next.js 기반 UI와 프록시 API 구조를 사용했습니다. 클라이언트는 메시지 렌더링과 상태 관리를 담당하고, 외부 통신은 서버 측 프록시를 통해 처리했습니다.",
        keyFeatures: ["AI 채팅 UI", "응답 텍스트 파싱", "탭 간 상태 동기화", "대화 내역 저장"],
        challenges: [
          "AI 응답 형식이 일정하지 않아 메시지 렌더링 품질이 흔들렸습니다.",
          "여러 탭에서 같은 대화 상태를 유지해야 했습니다.",
        ],
        solutions: [
          "Regex 기반 파서를 만들어 코드 블록과 링크를 구분했습니다.",
          "탭 동기화와 영속 저장 구조를 함께 사용해 대화 상태를 유지했습니다.",
        ],
        validation: ["주요 메시지 패턴 수동 테스트", "탭 동기화 흐름 확인"],
        result:
          "AI 응답을 사용자가 읽고 다시 활용하기 쉬운 채팅 인터페이스로 개선했습니다.",
        codeHighlight: {
          title: "응답 파서 예시",
          code: `const parseMessage = (text) => {
  const codeBlockRegex = /\`\`\`([\\s\\S]*?)\`\`\`/g;
  return text.replace(codeBlockRegex, (match, code) => {
    return highlight(code);
  });
};`,
        },
      },
    },
  ] satisfies Project[],
  activities: [
    {
      date: "2026",
      title: "AI 스킬 기반 개발 워크플로우 구성",
      description:
        "PRD 작성, 이슈 분해, 핸드오프, 압축 커뮤니케이션 스킬을 프로젝트 작업 흐름에 적용했습니다.",
    },
    {
      date: "2026",
      title: "Game-information-platform 배포/검증 구조 설계",
      description:
        "Next.js, Supabase, Playwright, Vitest, GitHub Actions 기반의 제품 검증 흐름을 구성했습니다.",
    },
    {
      date: "2026",
      title: "BRIGHT MAKERS EXPO 우수상",
      description:
        "증빙 자료 기준으로 수상 사실만 공개하고, 상세 개인정보는 웹에 노출하지 않습니다.",
    },
  ],
  education: {
    school: "한경국립대학교",
    degree: "학부 과정",
    description:
      "성적과 상세 개인정보는 공개 웹사이트에 노출하지 않고, 학력과 프로젝트 중심의 정보만 요약합니다.",
    certificates: ["국가기술자격 취득사항 보유"],
  },
} as const;
