import { resumeWacusData } from "./resume_wacus";

export const manualResumePathKeyword = "SysMasterDB_frontend";// 링크 바꾸는곳

// 지원동기 작성부분
const manualMotivation = `티맥스티베로 공고에서 눈에 띈 건 협업 구조보다 이 부분이었습니다. "글로벌 모니터링 트렌드와 현업 요구사항을 분석해 기능을 기획하고 개발한다"는 업무, 그리고 "주도적으로 문제를 발견하고 해결책을 고민할 수 있는 분"을 찾는다는 문구요. 신입에게 정해진 화면을 구현하는 역할이 아니라, Datadog·Grafana 같은 해외 모니터링 제품이 어떻게 데이터를 보여주는지 직접 살펴보고 SysMasterDB에 맞게 제안하는 역할까지 맡긴다는 뜻으로 읽혔습니다. 또 티베로가 탈오라클 전략의 중심에 있는 국산 DBMS라, Oracle·Tibero·PostgreSQL을 함께 다루는 모니터링 도메인 지식을 처음부터 폭넓게 쌓을 수 있다는 점도 흥미로웠습니다.

이 지점에서 PhotoMap과 Game Information Platform의 경험이 맞닿아 있다고 판단했습니다. PhotoMap의 NodeView에서는 D3 force simulation이 초당 여러 번 갱신하는 좌표를 React state로 관리하다 SVG 전체가 반복 계산되는 문제를 겪었고, 시뮬레이션을 custom hook으로 분리해 좌표 갱신을 ref와 DOM 속성으로 직접 처리하도록 바꾸면서 React Profiler 기준 렌더링 횟수를 370회에서 25회로 줄였습니다. 같은 프로젝트에서 모바일 첫 사진 지연 문제를 풀 때는 AI로 기존 코드 경로를 조사하고 실패를 재현하는 테스트를 먼저 작성한 뒤, 고정된 4G 조건에서 100회씩 반복 측정해 가설을 검증했습니다. Game Information Platform에서는 Steam·Epic·ITAD 세 외부 API를 Adapter/Normalizer로 정규화해 API 연동과 상태 관리를 단순화했고, AI를 활용해 issue를 분해하고 domain rule과 테스트를 통과한 제안만 반영했으며, Vitest와 Playwright로 25개 파일 69개 케이스의 테스트 자산을 구성했습니다.

입사 후에는 AI를 조사와 반복 작업의 속도를 높이는 도구로 쓰되, 판단과 검증은 직접 책임지는 방식으로 개발하고 싶습니다. 대용량 시계열 데이터를 다루는 화면일수록 렌더링 범위를 좁히고 근거를 남기는 태도가 필요하다고 생각하며, 이 감각을 여러 RDBMS를 아우르는 모니터링 도메인 지식과 함께 키워나가겠습니다.`;


export const resumeManualData = {
  ...resumeWacusData,
  motivation: manualMotivation,
} as const;
