import { resumeData } from "./resumes/frozen/resume";

// Sources and claim boundaries: output/notes/kyowon-ai-evidence-2026-10-16.md.
// The September journal PDF supersedes the older 'review completed' status.
export const aiApplication = {
  profile: {
    ...resumeData.profile,
    title: "AI 서비스 개발자 · 신입",
    email: resumeData.profile.contacts.email,
    github: resumeData.profile.contacts.github,
  },
  intro: "AI의 답변이 사용자의 작업으로 이어지도록 화면과 데이터 흐름을 만드는 개발자 민사빈입니다. 학교 정보 챗봇의 프론트엔드를 구현하고, 생성형 AI 요약·검증 플랫폼을 연구했습니다. 구현 결과는 테스트와 측정으로 확인하며, AI가 생성한 결과와 코드가 판단해야 할 규칙을 구분합니다.",
  motivation: [
    "교원의 사업별 AI Agent 개발에서 사용자의 요청을 대화 흐름과 실제 기능으로 연결하는 일을 하고 싶습니다. 학교 정보 챗봇을 만들며 답변 생성뿐 아니라 정보를 읽는 화면, 대화 기록, 외부 API 응답 처리까지 연결해야 사용자가 서비스를 활용할 수 있다는 점을 경험했습니다.",
    "생성형 AI 포트폴리오 요약 플랫폼에서는 스트리밍으로 생성 결과를 표시하고 첫 토큰 수신 시간을 측정했습니다. 학교 정보 챗봇에서는 대화 화면과 기록 관리를 맡고, Next.js API Route로 외부 백엔드를 연결했습니다. 입력 누락과 요청 실패를 구분해 처리하며 화면에 오류 안내를 남겼습니다.",
    "입사 후에는 요구사항을 기능과 검증 항목으로 나누고, 대화 화면과 API 연동을 구현하겠습니다. 잘못된 답변이나 도구 호출 실패는 입력·응답·처리 단계를 나눠 재현하고, 담당자와 기대 동작을 맞춘 뒤 회귀 테스트에 반영하겠습니다.",
  ],
  skills: [
    { title: "화면·API", items: ["React", "Next.js", "TypeScript", "REST API", "Supabase"] },
    { title: "AI 연구", items: ["GPT-4o-mini", "Vercel AI SDK", "SSE 스트리밍", "지식 기반 검증"] },
    { title: "개발·검증", items: ["AI 코딩 도구", "Vitest", "Playwright", "GitHub Actions"] },
  ],
  projects: [
    {
      id: "summary-platform",
      title: "생성형 AI 포트폴리오 요약 플랫폼",
      subtitle: "긴 프로젝트 자료를 핵심 정보로 바꾸고, 검증해서 보여주기",
      period: "2026.09 학술지 게재",
      role: "공동 연구 · 제1저자 / AI 스트리밍 결과 표시·성능 평가·요약 및 검증 구조 연구",
      summary: "채용 담당자가 여러 프로젝트의 핵심을 빠르게 확인하도록, 웹 문서를 수집해 AI로 요약하고 기술정보를 검증·저장·시각화하는 플랫폼을 연구했습니다.",
      tech: ["Next.js", "TypeScript", "GPT-4o-mini", "Vercel AI SDK", "Neon PostgreSQL"],
      steps: [
        { title: "AI 응답을 기다리는 화면 개선", body: "Vercel AI SDK와 SSE 스트리밍을 적용해 요약이 완성되기 전부터 결과를 표시했습니다. 생성 완료 시간과 첫 토큰 수신 시간을 구분하고, 논문에 스트리밍 응답 성능을 정리했습니다." },
        { title: "같은 입력으로 성능 평가", body: "GPT-4o-mini에 동일한 약 800자 포트폴리오 텍스트를 입력하고 방식별로 5회 측정했습니다. 스트리밍 평균 TTFT는 607ms였으며, 측정 범위를 첫 토큰 수신까지로 명시했습니다." },
        { title: "요약 결과의 검증 구조 연구", body: "요약의 기술정보를 지식정보와 비교하는 흐름을 연구했습니다. 기술 명칭 표준화와 미확인 정보 처리를 포함하는 요약·검증 방식의 공동 발명자로 특허 출원에 참여했습니다." },
      ],
      result: "스트리밍 평균 TTFT 607ms · 대한전자공학회논문지 제63권 제9호 게재",
      scope: "논문 표 4의 공동 연구 결과. GPT-4o-mini·동일 입력·5회 측정이며 전체 답변 완료 시간이나 실사용자 평균을 뜻하지 않습니다.",
    },
    {
      id: "campus-chatbot",
      title: "AI ChatBot",
      subtitle: "흩어진 학교 정보를 하나의 대화 화면에서 확인하기",
      period: "졸업 프로젝트",
      role: "2인 팀 · 프론트엔드 담당 / 채팅 UI·대화 기록·API 연동",
      summary: "학식·공지·학사 일정을 대화형 화면에서 확인하는 학교 정보 서비스입니다. 외부 백엔드의 응답을 읽기 쉬운 메시지로 표시하고, 로그인 없이 대화 기록을 관리하는 흐름을 구현했습니다.",
      image: "/3_project/aichat_1.png",
      github: "https://github.com/sabin1108/graduation-project",
      tech: ["Next.js", "React", "TypeScript", "ReactMarkdown", "localStorage"],
      steps: [
        { title: "01 · 질문부터 정보 확인까지", body: "채팅 UI와 사이드바·캘린더·가이드 화면을 구현했습니다. 질문 예시와 학교 정보 링크를 함께 제공해 사용자가 어떤 정보를 물을 수 있는지 알 수 있도록 구성했습니다." },
        { title: "02 · 응답과 화면 사이의 경계", body: "Next.js API Route에서 message·userId 누락을 검사하고 외부 /api/chat/intent로 요청을 전달했습니다. 실패 응답을 처리하고 UI에 전송 오류 안내를 표시했습니다. ReactMarkdown으로 문장·목록·링크를 읽기 쉽게 보여줬습니다." },
        { title: "03 · 이어지는 대화 기록", body: "localStorage로 대화를 저장·복원하고 탭 간 변경을 동기화했습니다. Blob API로 txt 내보내기를 제공해 사용자가 필요한 대화를 파일로 보관하도록 했습니다." },
      ],
      result: "채팅 화면·응답 표시·대화 저장과 내보내기 구현 · 관련 학술대회 논문 발표",
      scope: "개인 담당은 프론트엔드와 API 연동입니다. AI 응답 생성과 크롤러는 팀 백엔드 영역입니다.",
    },
  ],
  research: [
    {
      title: "생성형 AI 기반 포트폴리오 요약 플랫폼",
      status: "학술지 게재 · 제1저자 · 2026.09",
      description: "민사빈·이민규·심규성. 대한전자공학회논문지 63(9), 61–73. 생성형 AI 요약, 지식 기반 검증, 저장·시각화와 스트리밍 성능 평가를 다뤘습니다.",
      href: "https://doi.org/10.5573/ieie.2026.63.9.61",
      linkLabel: "논문 DOI",
    },
    {
      title: "생성형 인공지능 기반 포트폴리오 요약 및 검증 시스템 및 그 방법",
      status: "특허 출원 · 공동 발명자 · 2026.09.30",
      description: "출원번호 10-2026-0186451. 요약의 기술정보를 지식정보와 비교하고 명칭을 표준화하거나 확인되지 않은 정보를 제외하는 요약·검증 방식입니다.",
      href: "/files/patents/generative-ai-portfolio-summary-verification.pdf",
      linkLabel: "특허 명세서",
    },
    {
      title: "학교 정보 접근성 향상을 위한 대화형 질의응답 시스템",
      status: "학술대회 포스터·논문 발표 · 2025.06",
      description: "대한전자공학회 하계종합학술대회. 학교 공지·학식·학사 일정의 접근성을 높이는 대화형 서비스 연구에 참여했습니다.",
      href: "/files/thesis/interactive-campus-qa-system.pdf",
      linkLabel: "발표 논문",
    },
  ],
  education: {
    ...resumeData.education,
    certificate: "정보처리기사 · 한국산업인력공단 · 2025.09.12",
  },
};
