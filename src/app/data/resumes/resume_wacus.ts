import type { BinCaseNarrative } from "../binCaseNarratives";
import { resumeVariantData as latestResumeData } from "./resume_frontend_bin";

export const resumeWacusData = {
  ...latestResumeData,
  summary: "React·Next.js로 사진 탐색 서비스와 게임 가격 비교 서비스를 개발한 프론트엔드 개발자 민사빈입니다. 공통 UI와 화면별 로직의 경계를 설계하고 상태 관리·API 연동·반응형 화면을 구현했습니다. 구현 후에는 사용자 조작과 이미지 로딩을 테스트와 측정으로 확인합니다.",
  projectHighlights: latestResumeData.projectHighlights.map((project) =>
    project.title === "PhotoMap"
      ? { ...project, keyRoles: "3인 팀에서 프론트엔드를 담당해 사진 목록·앨범·타임라인 UI와 Mapbox 지도를 구현했습니다. 백엔드 사진 데이터와 Unity WebGL 지도의 선택 상태를 연결하고, D3 관계 그래프와 모바일 반응형 화면을 구성했습니다." }
      : project,
  ),
  motivation: "방문자가 필요한 정보를 찾고 문의나 예약으로 이어지는 웹사이트를 만들고 싶어 와커스에 지원했습니다. PhotoMap에서는 검색·사진 상세 UI를 재사용하도록 설계하고 지도·앨범·타임라인과 모바일 화면을 구현했습니다. 게임 가격 비교 서비스에서는 Next.js로 검색·상세·관심 목록을 구성하고 요청 상태에 맞는 안내를 제공했습니다.\n\n와커스에서도 디자인 의도를 다양한 화면 크기에 맞게 구현하고 반복되는 UI는 수정하기 쉬운 컴포넌트로 구성하겠습니다. 디자인팀·마케팅팀과 요구사항을 구체화하고 화면 조작과 로딩 성능까지 확인하겠습니다.",
} as const;

export const wacusPhotoMapStories: BinCaseNarrative[] = [
  {
    "title": "검색·상세 UI 공통화",
    "situation": "지도·앨범의 검색창과 좋아요 화면의 목록·모달이 각각 구현돼 같은 동작을 여러 곳에서 수정해야 했습니다.",
    "check": "",
    "goal": "입력·상세 UI는 공유하되, 화면별 필터와 액션은 독립적으로 구성하는 것을 목표로 했습니다.",
    "action": "검색창은 value/onChange 기반 제어 컴포넌트로 만들고 필터링은 각 화면에서 처리했습니다. 모달은 Context로 사진을 공유하고 이미지·메타데이터·액션을 조합하도록 구성했습니다.",
    "result": "지도·피드·관계 그래프에서 상세 UI를 재사용하고, 좋아요 화면도 공통 피드·모달로 통합했습니다.",
    "emphasis": [
      "value/onChange 기반 제어 컴포넌트",
      "이미지·메타데이터·액션을 조합"
    ],
    "kind": "tech",
    "lesson": ""
  },
  {
    "title": "상태의 공유 범위·수명 분리",
    "situation": "화면을 이동하면 검색 조건과 목록 위치를 잃었고, 사진·좋아요처럼 공유할 데이터와 모달·입력 상태의 수명도 달랐습니다.",
    "check": "",
    "goal": "공유 범위와 복원 시점을 기준으로 상태를 나눠 이전 탐색을 이어가도록 했습니다.",
    "action": "사진·좋아요는 Zustand selector, 검색·필터는 URL, 모달·편집 입력은 local state로 관리했습니다. 검색은 history replace, 화면 전환은 push로 처리했습니다.",
    "result": "뒤로가기로 탐색 조건을 복원하고, 별도 hook으로 현재 페이지 세션의 스크롤 위치를 유지했습니다.",
    "emphasis": [
      "Zustand selector",
      "검색·필터는 URL",
      "모달·편집 입력은 local state"
    ],
    "kind": "tech",
    "lesson": ""
  },
  {
    "title": "반응형·키보드 접근성",
    "situation": "모바일 상세 화면에서 좋아요 버튼이 화면 아래로 밀리고, 클릭 이벤트 중심의 카드는 키보드로 조작하기 어려웠습니다.",
    "check": "",
    "goal": "작은 화면에서도 주요 버튼을 사용할 수 있고 키보드만으로 사진 열기·닫기를 완료하도록 개선했습니다.",
    "action": "모달을 세로 배치하고 메타데이터만 스크롤하도록 조정했습니다. native button과 Radix Dialog로 포커스 유지·Escape 닫기·포커스 복귀를 처리했습니다.",
    "result": "390px·1280px 배치와 키보드로 사진 열기·닫기·원래 카드로 포커스 복귀를 검증했습니다.",
    "emphasis": [
      "메타데이터만 스크롤",
      "포커스 유지·Escape 닫기·포커스 복귀"
    ],
    "kind": "ux",
    "lesson": ""
  },
  {
    "title": "이미지 크기·요청 우선순위 분리",
    "situation": "모바일 첫 화면에서 여러 이미지 요청이 몰리면서 화면이 열린 뒤에도 첫 사진을 기다려야 했습니다.",
    "check": "",
    "goal": "목록과 상세에 필요한 이미지 크기·요청 시점을 나눠 첫 사진을 우선 표시하도록 했습니다.",
    "action": "목록은 썸네일, 상세는 큰 이미지로 분리했습니다. 첫 줄은 즉시 로딩하되 높은 우선순위는 첫 사진에만 지정하고 후속 사진은 지연 로딩했습니다.",
    "result": "모바일 4G 합성 실험·캐시 없는 100회 측정에서 첫 사진 표시 p95 약 2.6초를 기록했습니다.",
    "emphasis": [
      "목록은 썸네일, 상세는 큰 이미지",
      "첫 사진 표시 p95 약 2.6초"
    ],
    "kind": "ux",
    "lesson": ""
  }
];

export const wacusGameInfoStories: BinCaseNarrative[] = [
  {
    "title": "비동기 요청 상태별 UI 분기",
    "kind": "ux",
    "situation": "외부 API가 늦거나 실패하면 로딩만 남거나 빈 화면이 표시돼, 사용자가 대기 중인지 결과가 없는지 구분하기 어려웠습니다.",
    "check": "",
    "goal": "응답 상태에 맞는 안내와 재시도를 제공해 다음 행동을 알 수 있도록 했습니다.",
    "action": "로딩·빈 결과·오류·이전 데이터 표시를 조건부 렌더링하고 안내 컴포넌트를 분리했습니다. 요청 시간 제한과 캐시를 연결해 기존 정보 또는 재시도 안내를 제공했습니다.",
    "result": "응답 상태에 맞는 안내와 재시도로 빈 화면에서 탐색이 끊기지 않도록 구성했습니다.",
    "emphasis": [
      "로딩·빈 결과·오류·이전 데이터 표시",
      "안내 컴포넌트를 분리"
    ],
    "lesson": ""
  },
  {
    "title": "API·화면 컴포넌트 경계 분리",
    "kind": "tech",
    "situation": "Steam·Epic·ITAD의 가격·상품 응답 형식이 달라 검색·상세·관심 목록마다 상점별 예외 처리가 필요했습니다.",
    "check": "",
    "goal": "외부 응답 차이는 한곳에서 처리하고 화면은 같은 데이터 모델을 사용하도록 분리했습니다.",
    "action": "Steam·Epic·ITAD 응답을 서버에서 공통 TypeScript 모델로 정규화했습니다. 검색·상세·관심 목록에는 정리된 데이터만 전달했습니다.",
    "result": "상점별 예외 처리를 정규화 계층에 모으고, 화면은 공통 모델을 기준으로 가격·상품 정보를 표시하도록 구성했습니다.",
    "emphasis": [
      "공통 TypeScript 모델",
      "검색·상세·관심 목록"
    ],
    "lesson": ""
  }
];
