# 민사빈 포트폴리오

현재 공개 페이지는 `/`와 `/GYEOLSOFT` 두 개다. 결소프트의 포트폴리오와 이력서는 같은 페이지에서 탭으로 전환한다. 기존 회사별 URL은 새로 연결하지 않는다.

## 원고와 수정 위치

- 원본: `D:/sabin/note/일단 작성할 포트폴리오.md`
- 이번 원본 사본: `content/manuscript.md` (로컬 보관, Git/배포 제외)
- 선별된 문서 데이터: `content/portfolio.json`
- 개인정보: `content/profile.json`
- PDF 조판: `scripts/build-documents.mjs`
- 기존 포토맵·게임인포 디자인을 모아에 적용한 페이지 구성: `scripts/moa-legacy-layout.mjs`
- 기존 흰색 이력서 양식: `scripts/moa-resume-theme.mjs`
- 웹 문서 뷰어: `src/app/App.tsx`, `src/styles/index.css`

원문 문장은 윤문하지 않는다. 공통 본문은 트러블슈팅 이전 부분, 결소프트는 공통 + 2·14·28·3·5·27번이다. 10번은 사용자가 원고에서 삭제했으므로 제외했다. 번호는 편집용 데이터에서만 사용하며 공개 제목에는 표시하지 않는다.

이력서는 기존 개인 프로필·학력·자격과 원고의 소개·담당 내용·선택된 사례의 문장을 발췌해 구성했다. 새 지원동기나 새 성과 문장은 작성하지 않았다.

## 다시 만들기

1. `node scripts/import-moa-source.mjs` — 현재 D 원고를 다시 가져온다.
2. `node scripts/build-documents.mjs` — PDF와 동일한 웹용 HTML·문서 전용 CSS를 만든다. 페이지 이미지는 PDF 조판 검토용으로만 보관한다.
3. `npm run build` — 웹 배포 파일을 만든다.
4. `npm run dev -- --host 127.0.0.1 --port 4174` — 로컬 확인.
5. `ego-browser skill`을 읽고 현재 작업의 TaskSpace에서 `scripts/verify-desktop.mjs?space=작업ID&base=http://127.0.0.1:4174`를 import한다. 선택·찾기·탭 히스토리·목차·확대·다운로드·기존 경로 차단을 검사한다. 이번 검토에서 모바일은 제외했다.

PDF는 `public/documents`와 상위 작업 폴더의 `output/pdf/20261118`에 저장된다. 기존 포토맵·게임인포의 검은 배경·코랄/블루·왼쪽 화면/목차·오른쪽 설명 구성을 재사용한다. 메인은10장, 결소프트는공통10장+사례12장+파일구조1장, 이력서는2장이다. 원문은 그대로 두고 의미 단위로 페이지를 구성한다. 본문은18px(13.5pt)이며 자동 분할로 설명이 고아 페이지에 남지 않도록 조판한다. 웹도 같은 HTML을 사용하되 읽기 화면은 자동 높이와18px 글씨를 유지한다. 실제 PDF 페이지 수는 `pdfPageCount`, 검토용 이미지는 `pdfPages`로 기록한다. 아키텍처는 원본 SVG의 연결·문구를 보존한 색상 변경본이며, 파일 구조는 기존 HTML 모양을 유지하고 색상만 바꾼다. 화면 사진은 실제 모아 샘플 자료 화면이며, 출처는 `content/media-sources.json`에 기록했다.

`scripts/review-pdfs.py`는 실제 PDF의 원문 누락, 글자 수 감소, 본문13.5pt, 용지 밖 잘림을 검사하고 검토용 전체 이미지를 만든다.

## 기존 자료 보관

`archive/legacy-20261118/`에 기존 소스·공개 이미지·회사별 문서·사용자 미커밋 수정이 보관돼 있다. 보관 폴더는 public 밖에 있으며 Git과 Vercel 업로드에서 제외한다. 과거 원고와 기존 사용자 편집을 삭제하지 않는다.

이전 `_workspace` 등 로컬 기록과 기존 프로젝트용 산출물도 보관 폴더 안으로 옮겼다. 기존 원본의 민감한 개인 사진 폴더를 새 사이트에 복사하지 않았고, 사용자가 허용한 프로필 사진만 사용했다.
