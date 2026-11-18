# 민사빈 포트폴리오

현재 공개 페이지는 `/`와 `/GYEOLSOFT` 두 개다. 결소프트의 포트폴리오와 이력서는 같은 페이지에서 탭으로 전환한다. 기존 회사별 URL은 새로 연결하지 않는다.

## 원고와 수정 위치

- 원본: `D:/sabin/note/일단 작성할 포트폴리오.md`
- 이번 원본 사본: `content/manuscript.md` (로컬 보관, Git/배포 제외)
- 선별된 문서 데이터: `content/portfolio.json`
- 개인정보: `content/profile.json`
- PDF 조판: `scripts/build-documents.mjs`
- 웹 문서 뷰어: `src/app/App.tsx`, `src/styles/index.css`

원문 문장은 윤문하지 않는다. 공통 본문은 트러블슈팅 이전 부분, 결소프트는 공통 + 2·14·28·3·5·27번이다. 10번은 사용자가 원고에서 삭제했으므로 제외했다. 번호는 편집용 데이터에서만 사용하며 공개 제목에는 표시하지 않는다.

이력서는 기존 개인 프로필·학력·자격과 원고의 소개·담당 내용·선택된 사례의 문장을 발췌해 구성했다. 새 지원동기나 새 성과 문장은 작성하지 않았다.

## 다시 만들기

1. `node scripts/import-moa-source.mjs` — 현재 D 원고를 다시 가져온다.
2. `node scripts/build-documents.mjs` — 설치된 Codex runtime의 Markdown/PDF 도구와 Chrome으로 PDF 및 웹용 페이지 이미지를 만든다.
3. `npm run build` — 웹 배포 파일을 만든다.
4. `npm run dev -- --host 127.0.0.1 --port 4174` — 로컬 확인.
5. `node scripts/verify-moa-site.mjs http://127.0.0.1:4174` — 문서 표시·탭·확대·다운로드·기존 경로 차단 검사.

PDF는 `public/documents`와 상위 작업 폴더의 `output/pdf/20261118`에 저장된다. 웹은 같은 PDF를 렌더링한 페이지 이미지를 보여주며, 페이지별 텍스트도 화면 읽기 프로그램에서 접근할 수 있다.

## 기존 자료 보관

`archive/legacy-20261118/`에 기존 소스·공개 이미지·회사별 문서·사용자 미커밋 수정이 보관돼 있다. 보관 폴더는 public 밖에 있으며 Git과 Vercel 업로드에서 제외한다. 과거 원고와 기존 사용자 편집을 삭제하지 않는다.

이전 `_workspace` 등 로컬 기록과 기존 프로젝트용 산출물도 보관 폴더 안으로 옮겼다. 기존 원본의 민감한 개인 사진 폴더를 새 사이트에 복사하지 않았고, 사용자가 허용한 프로필 사진만 사용했다.
