# Design

## Source of truth
- Status: Active
- Last refreshed: 2026-11-18
- Latest direction: one wheel gesture advances one page and then locks. Use page-specific editorial compositions, following the structure of the user's Haejun PDF without copying its design. Large windows show comparisons side by side; smaller desktop windows read top to bottom. Never crop execution images. Preserve the slim contents rail, classic resume hierarchy and file-tree geometry.
- Visual references: archive/legacy-20261118/_workspace/presentation-reference/new-page-4.jpg and new-page-5.jpg; archived ProjectPresentation.tsx, project-presentation.css, BinClassicResume.tsx and bin-resume.css.
- Current composition reference: `C:/Users/sabin/Desktop/임시 c드라이브 파일/포트폴리오/학습용/해준이 포폴.pdf`, all12 pages rendered; especially flow/page3, technology/page4, features/page5 and troubleshooting/pages6–9. Evidence and plan: `docs/portfolio-wheel-layout-plan.md`.
- Primary surfaces: `/` and `/GYEOLSOFT` only. The latter has portfolio/resume tabs on the same pathname.
- User manuscript: `D:/sabin/note/일단 작성할 포트폴리오.md`. Preserve prose verbatim, including the user's edits. Remove only troubleshooting heading numbers and editorial fence/section markers outside the selected text.
- Common portfolio: manuscript before `# 모아 트러블슈팅`. Gyeolsoft: common + cases 2,14,28,3,5,27 in that order. Case10 was intentionally removed and must remain excluded.
- Existing `src`, `public` and prior design guidance are preserved under `archive/legacy-20261118/`. Old projects/company pages must not be bundled or published.

## Brand
- Reuse the existing dark portfolio palette. Introduction uses prose/metrics, flow uses steps, technology uses comparisons, features use screens above explanations, troubleshooting separates problem/choice from solution/verification/result. Do not repeat an unrelated app screenshot on every page. Resume stays classic white paper.
- Trust signals: actual manuscript, existing personal profile/photo, actual diagrams, unaltered measurements.
- Avoid gradients, decorative dashboards, animated counters, generic marketing slogans, invented achievements, new editorial copy.

## Product goals
- Deliver three PDFs first: common portfolio, Gyeolsoft portfolio, Gyeolsoft resume.
- Web presents those documents with a readable document viewer and direct downloads.
- Only `/` and `/GYEOLSOFT` are active HTML routes; old routes return 404.
- Preserve every selected manuscript paragraph/cell; do not compress or rewrite prose to make it fit.

## Personas and jobs
- Frontend hiring reviewers scanning the project, then reading decisions and troubleshooting.
- Desktop document review; download/open PDF for larger reading. Mobile review is excluded by user request.

## Information architecture
- `/`: common portfolio, profile name, contact, common PDF download.
- `/GYEOLSOFT`: same URL with portfolio/resume tabs, relevant PDF download, page index.
- Public assets: only new documents, manuscript images and portrait. Archive stays outside public and is excluded from Vercel upload.

## Design principles
- Existing PhotoMap/GameInfo composition owns the visual identity; preserve readable18px body and native web text.
- Use complete scenes. Each troubleshooting case keeps its problem/choice and solution/verification/result together on one page, reducing company portfolio23 to17 pages without removing prose. Never leave a trailing result alone on an automatic continuation page.
- Keep current manuscript content; split by meaning rather than shrinking type or clipping.
- Reduce reviewer effort: wheel input is the main sequential navigation. Keep direct contents, buttons and keyboard as alternatives. Reading long current-page content takes priority over changing pages.

## Visual language
- Portfolio: background#0c1010, panel#131a1a, warm text#f2f0ea, muted#b5beb8, coral#e39a80, blue#87c5dc, rules#2c3533. Resume: white, ink#20262e, muted#4e5968 and blue#245f95.
- System Korean sans-serif with an available local Korean font embedded/used in PDF generation. No remote font dependency.
- Portfolio uses authored fixed A4 landscape scenes; resume uses two A4 portrait pages. Both retain18px/13.5pt body. Each authored scene maps to one PDF page and one web slide. Only the current portfolio slide is mounted; text reflows without shrinking and zoom shows the authored page.
- Resume restores introduction/contact with photo on the right, project/role, two featured achievements side by side followed by full-width achievements, then skill rows and education. Preserve current text units and personal facts.
- Architecture reuses the exact original SVG topology/labels with the dark palette and genuine brand marks. File-tree HTML, names, indentation and connector geometry are retained with coral/blue recoloring. Actual Moa sample-data screenshots are framed consistently; do not manufacture before/after images or service screens.
- Borders and small radii only on controls; no floating decorative cards.
- No entrance animation or autoplay. User-requested wheel paging uses44px accumulated intent,650ms transition lock and180ms input silence; long inertia cannot repeatedly advance pages.

## Components
- Reuse existing React/Vite installation and installed lucide icons. No new project dependencies.
- New viewer, document tabs, download link, page navigation, accessible zoom dialog and 404 state.
- Content import and PDF generation are local authoring tools; shipped client consumes the generated document manifest.

## Accessibility
- Semantic navigation, headings, buttons; visible keyboard focus.
- Selected tabs follow URL hash and browser history; keyboard arrow navigation. Escape closes zoom, restores focus and reading position; background scrolling is locked. Native visible text supports selection and browser Find.
- Portfolio has one visible slide. Wheel paging is restricted to its content area and leaves Ctrl/Meta zoom, horizontal input, contents and dialogs alone. On a long page, native scrolling reads its content first; only a fresh gesture at the boundary changes page. Previous/next and Left/Right remain available. Resume retains native vertical scrolling.

## Responsive behavior
- Desktop portfolio:64px far-left rail expands to264px without shifting content. Page content is centered with a1480px maximum. Body is18–21px. At1100px and below, explanation columns stack. Screens on feature pages precede explanation and use contain with their full original image. One logical page is visible; smaller windows may scroll inside it before advancing.
- In desktop windows no taller than950px, shorten viewer bars and margins, tighten line spacing to1.6 and reduce screenshot height while retaining whole-image contain. Keep body size at least18px. This uses the screen height instead of clipping the image or shrinking prose.
- PDF: preserve18px/13.5pt prose, page-specific compositions and uncut screenshots. Resume keeps the original white structure with photo right and normal vertical web reading.
- Current review scope: desktop only. Check every slide at960/1280/1440/1920/2560px, including a960×700 window, DPR2, wheel bursts/inertia/reading boundaries, keyboard, old routes and PDF downloads. Mobile is excluded.

## Interaction states
- Loading: short document-loading status.
- Error: visible retry, no legacy content fallback.
- Disabled: page navigation at document bounds.
- Unknown paths: explicit 404 with home link.

## Content voice
- User manuscript wording unchanged. Interface labels only may be authored.
- No case numbers in published troubleshooting headings.
- Resume uses existing personal facts and verbatim manuscript extracts; no invented job motivation or old project claims.

## Implementation constraints
- React18 + Vite6 existing toolchain. No dependency upgrades or new framework.
- Generated content must record source hashes and selected/excluded case IDs.
- Old files with uncommitted user edits stay intact in archive.
- Build and route checks, PDF text-preservation checks, raster inspection and desktop viewer checks before deployment.

## Open questions
- None blocking. User will revise prose after viewing; editable manuscript snapshot and source mapping remain local.
