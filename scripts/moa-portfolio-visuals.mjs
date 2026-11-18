import assert from 'node:assert/strict';

const escape = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
const node = (label, kind = '') => `<div class="diagram-node ${kind}">${escape(label)}</div>`;
const arrow = '<span class="diagram-arrow" aria-hidden="true">→</span>';
const flow = labels => `<div class="diagram-flow">${labels.map(label => node(label)).join(arrow)}</div>`;
const figure = (id, title, content, variant) => `<figure class="portfolio-visual ${variant}" data-visual="${id}"><figcaption class="diagram-caption">${escape(title)}</figcaption><div class="diagram-canvas">${content}</div></figure>`;

// Labels summarize only the source records mapped in docs/portfolio-visual-evidence.md.
export function caseVisual(entry) {
  switch (entry.id) {
    case 'case-2':
      return {side:'left', markup:figure(entry.id, '폴더 이동 시 조작하던 화면 유지', `<div class="window-comparison"><div class="mini-window before-window"><b>기존</b><div class="wire-input">경로 변경</div><div class="wire-list is-empty">기존 목록 제거</div></div><div class="mini-window after-window"><b>개선</b><div class="wire-input">입력창 유지</div><div class="wire-list"><i aria-hidden="true"></i><span>기존 목록 유지</span></div></div></div><div class="diagram-note">읽는 중 표시 → 새 목록 준비 후 내용 교체</div>`, 'visual-flicker')};
    case 'case-14':
      return {side:'left', markup:figure(entry.id, '취소 뒤 도착한 결과의 반영 차단', `<div class="request-timeline"><svg viewBox="0 0 440 24" aria-hidden="true"><path d="M24 12H220"/><path d="M220 12H416" stroke-dasharray="5 5"/><circle cx="24" cy="12" r="5"/><circle cx="220" cy="12" r="5"/><circle cx="416" cy="12" r="5"/></svg><div class="timeline-labels"><span>요청 시작</span><span>취소 요청</span><span>늦은 결과</span></div></div><div class="request-check">${node('취소 여부 · 현재 요청 확인')}${arrow}${node('화면·저장 반영 차단', 'is-stop')}</div><div class="diagram-note">비동기 대기 뒤 · 저장 직전에도 재확인</div>`, 'visual-request')};
    case 'case-28':
      return {side:'right', markup:figure(entry.id, '기능별 코드와 공통 부품의 책임 분리', `<div class="module-map">${node('app · 페이지 구성과 기능 연결', 'module-app')}<span class="diagram-down" aria-hidden="true">↓</span><div class="module-features">${node('폴더 연결')}${node('검색')}${node('복구')}</div><div class="module-parts"><div><span>공통으로 조합</span>${node('탐색창 · 입력 폼')}</div><div><span>각 작업에서 관리</span>${node('충돌 처리 · 원본 보존')}</div></div></div>`, 'visual-modules')};
    case 'case-3':
      return {side:'right', markup:figure(entry.id, '같은 경로라도 폼의 역할을 구분', `<div class="role-fork">${node('현재 경로', 'role-origin')}<div class="role-branches"><div class="role-branch"><b>경로 입력</b><span>경로 + 입력 역할</span></div><div class="role-branch"><b>새 항목 생성</b><span>경로 + 생성 역할</span></div></div></div>`, 'visual-roles')};
    case 'case-5': {
      const match = entry.markdown.match(/(\d+\.\d+)초\s*→\s*(\d+\.\d+)초/);
      assert(match, 'Setting cache chart requires the recorded before/after medians');
      const before = Number(match[1]);
      const after = Number(match[2]);
      assert(before > 0 && after > 0 && after <= before, 'Unexpected setting cache measurement');
      return {side:'verification', metric:true};
    }
    case 'case-27':
      return {side:'left', markup:figure(entry.id, '길게 누르기와 파일 열기를 분리', `<div class="press-flow"><div><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 13V5a2 2 0 0 1 4 0v7l2-1 4 3-1 6H9l-5-6 2-2 3 3"/></svg><span>길게 누르기</span></div>${arrow}<div><span class="press-symbol" aria-hidden="true">✓</span><span>선택 모드</span></div>${arrow}<div><span class="press-symbol" aria-hidden="true">×</span><span>후속 클릭 차단</span></div></div><div class="stable-rows"><span>전환 전</span><i></i><span>전환 후</span><i></i><b>행 높이 유지</b></div><div class="diagram-note">이동·스크롤하면 누르기 취소</div>`, 'visual-press')};
    default:
      throw Error(`Missing evidence visual for ${entry.id}`);
  }
}

export function technicalVisual(type) {
  if (type === 'next') return figure('technical-next', '화면·라우팅·API·인증의 구성 범위 비교', `<div class="technical-comparison"><section class="tool-group"><b>React SPA</b><div class="tool-pieces">${node('화면')}${node('라우팅')}${node('별도 API 서버')}${node('인증 흐름')}</div><div class="diagram-note">도구를 따로 구성하고 연결</div></section><section class="tool-group is-integrated"><b>Next.js</b><div class="tool-pieces">${node('화면 · 공통 레이아웃')}${node('파일 기반 라우팅')}${node('서버 API')}${node('Better Auth · Prisma')}</div><div class="diagram-note">같은 앱에서 구성과 연결</div></section></div>`, 'technical-visual visual-tech-next');
  if (type === 'auth') return figure('technical-auth', '인증 확인과 작업 단계의 역할 구분', `<div class="technical-comparison"><section class="auth-lane"><b>Better Auth</b>${flow(['로그인·계정 연결','서버 사용자 확인','인증된 화면'])}</section><section class="workflow-lane"><b>Stepper</b>${flow(['목적지','충돌 확인','실행','결과'])}<div class="state-lanes">${node('URL · 단계와 초안 참조')}${node('별도 초안 · 입력과 계획')}</div><div class="diagram-note">복원 뒤 현재 파일·권한 재확인</div></section></div>`, 'technical-visual visual-tech-auth');
  if (type === 'components') return figure('technical-components', '부품 조합과 재사용하는 데이터의 범위', `<div class="technical-comparison"><section><b>공통 부품 조합</b><div class="component-pieces">${node('목적지 탐색')}${node('경로 입력')}${node('새 항목 생성')}</div><span class="diagram-down" aria-hidden="true">↓</span>${node('필요한 부품을 조합한 작업 화면','component-result')}<div class="diagram-note">충돌·원본 보존 규칙은 각 작업에 유지</div></section><section class="cache-lanes"><b>데이터 재사용과 갱신</b>${flow(['설정 표시 정보','반복 진입 재사용','변경 시 갱신'])}${flow(['PDF 원본 확인','동일하면 본문 재사용','변경되면 재추출'])}<div class="diagram-note">현재 인증·권한은 캐시와 분리해 확인</div></section></div>`, 'technical-visual visual-tech-components');
  throw Error(`Missing technical visual for ${type}`);
}

export const portfolioVisualCss = `
.portfolio-visual{height:180px;margin:18px 0 0;padding:12px;border:1px solid var(--legacy-line);border-radius:7px;background:#ebece6;display:flex;flex-direction:column;gap:8px;break-inside:avoid;color:#465b59;min-width:0}
.portfolio-visual .diagram-caption{font-size:13px;line-height:1.35;font-weight:700;color:#365a5d;margin:0}
.portfolio-visual .diagram-canvas{min-height:0;flex:1;display:flex;flex-direction:column;justify-content:space-evenly;gap:6px}
.portfolio-visual .diagram-node{min-width:0;border:1px solid #baccc4;border-radius:5px;background:#f8f7f2;padding:6px 9px;color:#365a5d;font-size:13px;line-height:1.4;text-align:center;word-break:keep-all;overflow-wrap:anywhere}
.portfolio-visual .diagram-arrow,.portfolio-visual .diagram-down{font-size:17px;color:#62847d;line-height:1;text-align:center;flex-shrink:0}
.portfolio-visual .diagram-note{font-size:11px;line-height:1.5;color:#596e67;text-align:center}
.portfolio-visual .diagram-flow{display:flex;align-items:center;justify-content:center;gap:6px}
.portfolio-visual .diagram-flow .diagram-node{flex:1;padding:6px 5px}
.portfolio-visual .window-comparison{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.portfolio-visual .mini-window{padding:8px;border:1px solid #c3cec7;border-radius:5px;background:#f8f7f2;min-width:0}
.portfolio-visual .mini-window>b{font-size:12px;line-height:1.4;display:block;margin-bottom:5px;color:#586e67}
.portfolio-visual .wire-input{border:1px solid #ccd4cd;padding:4px 6px;font-size:12px;line-height:1.3;background:#f1f0e9}
.portfolio-visual .wire-list{height:36px;margin-top:5px;display:flex;align-items:center;justify-content:center;gap:8px;border:1px solid #c4d1c8;background:#e5ece5;font-size:12px;color:#44625b}
.portfolio-visual .wire-list.is-empty{border-style:dashed;background:transparent;color:#866e5b}
.portfolio-visual .wire-list i{display:block;width:22px;height:17px;border-top:2px solid #91aaa0;border-bottom:2px solid #91aaa0;position:relative}
.portfolio-visual .wire-list i:before{content:'';position:absolute;top:6px;left:0;right:0;border-top:2px solid #91aaa0}
.portfolio-visual.visual-flicker{height:184px}
.portfolio-visual .request-timeline{padding:2px 8px 0}
.portfolio-visual .request-timeline svg{width:100%;height:24px;overflow:visible;fill:#e9efe7;stroke:#78968a;stroke-width:2}
.portfolio-visual .timeline-labels{display:flex;justify-content:space-between;font-size:12px;color:#4d655d}
.portfolio-visual .request-check{display:flex;align-items:center;gap:8px}
.portfolio-visual .request-check .diagram-node{flex:1}
.portfolio-visual.visual-request{height:168px}
.portfolio-visual .is-stop{border-color:#c4a69a;background:#f1e9e2;color:#805c4c}
.portfolio-visual.visual-modules{height:158px}
.portfolio-visual .module-map{display:flex;flex-direction:column;align-items:stretch;gap:5px}
.portfolio-visual .module-app{align-self:center;min-width:65%}
.portfolio-visual .module-features{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.portfolio-visual .module-parts{display:grid;grid-template-columns:1fr 1fr;gap:10px;border-top:1px solid #b8c9c0;margin-top:5px;padding-top:5px}
.portfolio-visual .module-parts>div>span{display:block;font-size:10px;line-height:1.4;color:#61756b;margin-bottom:3px}
.portfolio-visual.visual-modules{padding:10px;gap:6px}
.portfolio-visual.visual-modules .diagram-caption{font-size:12px}
.portfolio-visual.visual-modules .diagram-node{font-size:12px;padding:3px 6px}
.portfolio-visual.visual-modules .module-map{gap:3px}
.portfolio-visual.visual-modules .diagram-down{display:none}
.portfolio-visual.visual-modules .module-app{position:relative;margin-bottom:5px}
.portfolio-visual.visual-modules .module-app:after{content:'↓';position:absolute;bottom:-10px;left:50%;font-size:10px;line-height:10px;color:#62847d}
.portfolio-visual.visual-modules .module-parts{margin-top:3px;padding-top:3px}
.portfolio-visual.visual-roles{height:88px;padding:8px;gap:4px}
.portfolio-visual.visual-roles .diagram-caption{font-size:12px;line-height:1.2}
.portfolio-visual .role-fork{display:grid;grid-template-columns:90px 1fr;gap:18px;align-items:center;min-height:0}
.portfolio-visual .role-origin{padding:7px 3px}
.portfolio-visual .role-branches{border-left:1px solid #98b2a5;padding-left:14px;display:flex;flex-direction:column;gap:4px}
.portfolio-visual .role-branch{display:flex;align-items:center;justify-content:space-between;gap:5px;position:relative;font-size:11px;line-height:1.4;color:#435f55}
.portfolio-visual .role-branch:before{content:'';position:absolute;left:-15px;width:10px;border-top:1px solid #98b2a5}
.portfolio-visual .role-branch>b{font-weight:600}
.portfolio-visual .role-branch>span{border:1px solid #b7c9bd;background:#f8f7f2;border-radius:3px;padding:3px 6px;color:#365e53}
.portfolio-visual .press-flow{display:flex;align-items:center;justify-content:space-between;gap:6px}
.portfolio-visual .press-flow>div{display:flex;flex-direction:column;align-items:center;gap:4px;flex:1;font-size:12px;line-height:1.4;text-align:center}
.portfolio-visual .press-flow svg{width:24px;height:24px;stroke:#557e6b;stroke-width:1.6;fill:none;stroke-linecap:round;stroke-linejoin:round}
.portfolio-visual .press-symbol{font-size:22px;line-height:24px;color:#557e6b}
.portfolio-visual .stable-rows{display:grid;grid-template-columns:42px 1fr 42px 1fr;align-items:center;gap:8px;font-size:11px;color:#596f63}
.portfolio-visual .stable-rows i{height:12px;border-top:1px solid #93ac9d;border-bottom:1px solid #93ac9d;background:#e0e8df}
.portfolio-visual .stable-rows>b{grid-column:1/-1;text-align:center;font-size:11px;font-weight:500}
.portfolio-visual.technical-visual{height:200px;margin-top:24px;padding:16px;gap:12px}
.portfolio-visual .technical-comparison{display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:stretch;height:100%}
.portfolio-visual .technical-comparison>section{min-width:0;display:flex;flex-direction:column;justify-content:space-evenly;gap:8px}
.portfolio-visual .technical-comparison>section>b{font-size:14px;line-height:1.4;color:#365c56}
.portfolio-visual .technical-comparison>section+section{border-left:1px solid #bdccc1;padding-left:24px}
.portfolio-visual .tool-group .tool-pieces{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.portfolio-visual .is-integrated .tool-pieces{padding:8px;border:1px solid #97b4a2;border-radius:5px;background:#dfe8dc}
.portfolio-visual .state-lanes{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.portfolio-visual .component-pieces{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.portfolio-visual .component-result{border-color:#97b4a2;background:#e1eade}
.portfolio-visual.visual-tech-next,.portfolio-visual.visual-tech-components{height:220px}
.legacy-sheet .decision-note{margin-top:20px;border-left:2px solid var(--legacy-accent);padding-left:16px}
.legacy-sheet .decision-note p:last-child{margin-bottom:0}
.legacy-sheet .proof-card{position:relative;border-top-color:#8bab98}
.legacy-sheet .proof-card:not(.metric-proof):before{content:'';position:absolute;inset:-6px -9px -7px;background:#f8f8f0;border:1px solid #c6d4c5;border-radius:6px;z-index:-1}
.legacy-sheet .proof-card:not(.metric-proof){isolation:isolate}
.legacy-sheet .proof-card h3{display:flex;align-items:center;justify-content:space-between;gap:12px}
.legacy-sheet .proof-badge{font-size:11px;line-height:1.35;color:#3d6855;border:1px solid #afc9b3;background:#e7efdf;border-radius:4px;padding:2px 7px;font-weight:600;white-space:nowrap}
.legacy-sheet .metric-proof{height:auto;min-height:0;padding:12px;gap:6px;border:1px solid #afc6b1;border-top:3px solid #6b9578;background:#f4f7eb;border-radius:7px}
.legacy-sheet .metric-proof h3{font-size:15px;line-height:1.5;margin:0}
.legacy-sheet .metric-proof .metric-range{display:flex;align-items:baseline;gap:8px;margin:6px 0;font-size:26px;line-height:1.2;white-space:nowrap}
.legacy-sheet .metric-proof .metric-before{color:#586e65}
.legacy-sheet .metric-proof .metric-after{font-weight:700;color:#2e6651}
.legacy-sheet .metric-proof .metric-arrow{color:#6a8572;font-size:23px}
.legacy-sheet .metric-proof .metric-comma{font-size:18px;margin-left:-6px}
.legacy-sheet .metric-proof .metric-change{font-size:18px;line-height:1.4}
.legacy-sheet .metric-proof .metric-change strong{font-size:28px;line-height:1.15;color:#2e6651;font-weight:700}
.legacy-sheet .proof-card>.evidence-condition{font-size:11px;line-height:1.4;color:#576e61;padding-top:6px;border-top:1px solid #cedbc8}
.legacy-sheet[data-page-id="case-2"] .legacy-case-column:last-child .proof-card strong{display:inline-block;font-size:24px;color:#2e6651;background:#e4eddd;padding:2px 6px;margin:4px 0;border:1px solid #bed0b9;border-radius:4px}
`;
