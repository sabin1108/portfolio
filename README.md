# 민사빈 포트폴리오

현재 공개 페이지는 `/`와 `/GYEOLSOFT` 두 개다. 결소프트의 포트폴리오와 이력서는 같은 페이지에서 탭으로 전환한다. 기존 회사별 URL은 새로 연결하지 않는다.

## 원고와 수정 위치

- 원본: `D:/sabin/note/일단 작성할 포트폴리오.md`
- 이번 원본 사본: `content/manuscript.md` (로컬 보관, Git/배포 제외)
- 선별된 문서 데이터: `content/portfolio.json`
- 개인정보: `content/profile.json`
- 모아 저장소·데모 주소: `content/profile.json`의 `project.github` / `project.demo` (개인 GitHub와 구분)
- PDF 조판: `scripts/build-documents.mjs`
- 기존 포토맵·게임인포 디자인을 모아에 적용한 페이지 구성: `scripts/moa-legacy-layout.mjs`
- 기존 BinClassicResume 구성의 흰색 이력서 양식: `scripts/moa-resume-theme.mjs`
- 웹 문서 뷰어: `src/app/App.tsx`, `src/styles/index.css`
- 페이지별 웹 배치: `src/styles/portfolio-reader.css`
- 기록 기반 도식·성과 카드: `scripts/moa-portfolio-visuals.mjs`, 근거는 `docs/portfolio-visual-evidence.md`
- 휠 제스처 판단과 검사: `src/app/wheel-navigation.ts`, `node --experimental-strip-types scripts/check-wheel-navigation.mjs`

원문 문장은 윤문하지 않는다. 공통 본문은 트러블슈팅 이전 부분, 결소프트는 공통 + 2·14·28·3·5·27번이다. 10번은 사용자가 원고에서 삭제했으므로 제외했다. 번호는 편집용 데이터에서만 사용하며 공개 제목에는 표시하지 않는다.

이력서는 기존 개인 프로필·학력·자격과 원고의 소개·담당 내용·선택된 사례의 문장을 발췌해 구성했다. 이전 `/resume/bin_resume`의 소개·연락처·오른쪽 사진 → 프로젝트·담당 → 주요 성과 → 기술·학력 순서를 복원했다. 새 지원동기나 새 성과 문장은 작성하지 않았다.

## 다시 만들기

1. `node scripts/import-moa-source.mjs` — 현재 D 원고를 다시 가져온다.
2. `node scripts/build-documents.mjs` — PDF와 동일한 웹용 HTML·문서 전용 CSS를 만든다. 페이지 이미지는 PDF 조판 검토용으로만 보관한다.
3. `npm run build` — 웹 배포 파일을 만든다.
4. `npm run dev -- --host 127.0.0.1 --port 4174` — 로컬 확인.
5. `ego-browser skill`을 읽고 현재 작업의 TaskSpace에서 `scripts/verify-desktop.mjs?space=작업ID&base=http://127.0.0.1:4174`를 import한다. 한 페이지 표시·목차·원문·잘리지 않은 이미지·휠 이동/관성/본문 경계·찾기·탭 히스토리·확대·다운로드·기존 경로 차단을 검사한다. 960/1280/1440/1920/2560px 전체 페이지와960×700 작은 창을 검사한다. 모바일은 제외한다.
6. 같은 TaskSpace에서 `scripts/verify-visuals.mjs?space=작업ID&base=http://127.0.0.1:4174`를 import해10개 페이지를4개 데스크톱 크기에서 확인하고, 대비·잘림·성과 카드·생략 표시·프로젝트 링크를 검사한다. 변경 전 manifest 경로를 `baseline`으로 전달하면 새 시각 주석과 링크를 제외한 전체 문장도 비교한다.

PDF는 `public/documents`와 상위 작업 폴더의 `output/pdf/20261118`에 저장된다. 따뜻한 회백색 배경·회녹색 글자·차분한 청록/갈색 강조를 사용한다. 메인은10장, 결소프트는공통10장+사례6장+파일구조1장, 이력서는2장이다. 원문은 유지하고 기록 기반 그림을 추가했다. 수치만 있는 성과는 카드로 표시하며, 설정56.2%는 반복 설정 준비의 비교로 한정한다. 본문은18px(13.5pt)이며 반복 목차는 숨긴다.

웹 포트폴리오는 한 페이지만 표시하고 마우스 휠 한 동작에 한 장씩 넘긴다. 44px 입력을 모아 판단하고, 이동 후650ms 고정과180ms 입력 종료를 확인한다. 관성이 이어지는 동안 다음 장으로 연속 이동하지 않는다. 작은 창에서 현재 본문이 길면 먼저 끝까지 읽고, 새 휠 동작으로 다음 페이지로 넘어간다. 이전·다음과 방향키도 유지한다. 왼쪽 끝64px 목차는 펼칠 때만264px 제목 메뉴가 본문 위에 열린다. 본문 위치는 밀리지 않는다.

해준이 PDF의 페이지별 구성을 참고해 소개·지표, 사용자 단계, 기술 비교, 기능 화면, 문제·선택, 해결·검증·결과를 나눴다. 기능 화면은 설명 위에 두며, 원본 비율을 유지한다. 같은 앱 이미지를 모든 사례에 반복하지 않는다. 창 폭1100px 이하에서는 설명을 한 열로 이어 읽는다. 이력서는 두 장의 일반 세로 읽기를 유지한다. 아키텍처 SVG와 파일 구조 모양은 보존한다. 화면 사진은 실제 모아 샘플 자료이며 출처는 `content/media-sources.json`에 기록했다.

`scripts/review-pdfs.py`는 실제 PDF의 원문 누락, 글자 수 감소, 본문13.5pt, 용지 밖 잘림을 검사하고 검토용 전체 이미지를 만든다.

## 기존 자료 보관

`archive/legacy-20261118/`에 기존 소스·공개 이미지·회사별 문서·사용자 미커밋 수정이 보관돼 있다. 보관 폴더는 public 밖에 있으며 Git과 Vercel 업로드에서 제외한다. 과거 원고와 기존 사용자 편집을 삭제하지 않는다.

이전 `_workspace` 등 로컬 기록과 기존 프로젝트용 산출물도 보관 폴더 안으로 옮겼다. 기존 원본의 민감한 개인 사진 폴더를 새 사이트에 복사하지 않았고, 사용자가 허용한 프로필 사진만 사용했다.
