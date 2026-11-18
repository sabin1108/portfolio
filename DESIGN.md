# Design

## Source of truth
- Status: Active
- Last refreshed: 2026-11-18
- Latest direction: reuse the archived PhotoMap/GameInfo design and replace its content with Moa. The user rejected the generic light layout and fragmented PDF4/5. Folder-tree geometry must stay intact; recolor only. Update resume using the existing classic resume design.
- Visual references: archive/legacy-20261118/_workspace/presentation-reference/new-page-4.jpg and new-page-5.jpg; archived ProjectPresentation.tsx, project-presentation.css, BinClassicResume.tsx and bin-resume.css.
- Primary surfaces: `/` and `/GYEOLSOFT` only. The latter has portfolio/resume tabs on the same pathname.
- User manuscript: `D:/sabin/note/일단 작성할 포트폴리오.md`. Preserve prose verbatim, including the user's edits. Remove only troubleshooting heading numbers and editorial fence/section markers outside the selected text.
- Common portfolio: manuscript before `# 모아 트러블슈팅`. Gyeolsoft: common + cases 2,14,28,3,5,27 in that order. Case10 was intentionally removed and must remain excluded.
- Existing `src`, `public` and prior design guidance are preserved under `archive/legacy-20261118/`. Old projects/company pages must not be bundled or published.

## Brand
- Reuse the existing personal portfolio identity: dark editorial pages, a project screenshot and chapter list on the left, narrative on the right. Resume stays classic white paper.
- Trust signals: actual manuscript, existing personal profile/photo, actual diagrams, unaltered measurements.
- Avoid gradients, decorative dashboards, animated counters, generic marketing slogans, invented achievements, new editorial copy.

## Product goals
- Deliver three PDFs first: common portfolio, Gyeolsoft portfolio, Gyeolsoft resume.
- Web presents those documents with a readable document viewer and direct downloads.
- Only `/` and `/GYEOLSOFT` are active HTML routes; old routes return 404.
- Preserve every selected manuscript paragraph/cell; do not compress or rewrite prose to make it fit.

## Personas and jobs
- Frontend hiring reviewers scanning the project, then reading decisions and troubleshooting.
- Desktop document review and mobile link opening; download/open PDF for larger reading.

## Information architecture
- `/`: common portfolio, profile name, contact, common PDF download.
- `/GYEOLSOFT`: same URL with portfolio/resume tabs, relevant PDF download, page index.
- Public assets: only new documents, manuscript images and portrait. Archive stays outside public and is excluded from Vercel upload.

## Design principles
- Existing PhotoMap/GameInfo composition owns the visual identity; preserve readable18px body and native web text.
- Use deliberate complete scenes. Troubleshooting uses a problem/choice page followed by a solution/verification/result page. Never leave a trailing result alone on an automatic continuation page.
- Keep current manuscript content; split by meaning rather than shrinking type or clipping.

## Visual language
- Portfolio: background#0c1010, panel#131a1a, warm text#f2f0ea, muted#b5beb8, coral#e39a80, blue#87c5dc, rules#2c3533. Resume: white, ink#20262e, muted#4e5968 and blue#245f95.
- System Korean sans-serif with an available local Korean font embedded/used in PDF generation. No remote font dependency.
- Portfolio uses authored fixed A4 landscape scenes; resume uses two A4 portrait pages. Both retain18px/13.5pt body. Each authored scene maps to one PDF page and one web section. Web text reflows without shrinking; explicit zoom shows the authored page.
- Architecture reuses the exact original SVG topology/labels with the dark palette and genuine brand marks. File-tree HTML, names, indentation and connector geometry are retained with coral/blue recoloring. Actual Moa sample-data screenshots are framed consistently; do not manufacture before/after images or service screens.
- Borders and small radii only on controls; no floating decorative cards.
- No entrance animation, forced scroll, wheel interception, or carousel autoplay.

## Components
- Reuse existing React/Vite installation and installed lucide icons. No new project dependencies.
- New viewer, document tabs, download link, page navigation, accessible zoom dialog and 404 state.
- Content import and PDF generation are local authoring tools; shipped client consumes the generated document manifest.

## Accessibility
- Semantic navigation, headings, buttons; visible keyboard focus.
- Selected tabs follow URL hash and browser history; keyboard arrow navigation. Escape closes zoom, restores focus and reading position; background scrolling is locked. Native visible text supports selection and browser Find.
- Normal native scrolling. Reduced-motion preference respected by having no essential motion.

## Responsive behavior
- Desktop portfolio: large actual screenshot and interactive page index on the left, reading content on the right. The PDF's static left index is hidden only in web reading mode to avoid duplicate sidebars. Resume uses its own white paper with photo right. All body stays18px; narrow desktop work areas reflow instead of shrinking.
- Mobile: compact controls, single-column pages, tap page to inspect at readable zoom.
- Current review scope: desktop only, per user. Check 1280/1440/1920px, DPR2, browser zoom, keyboard use, old-route rejection and PDF downloads. Mobile behavior is preserved but excluded from this review.

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
- Build and route checks, PDF text-preservation checks, raster inspection and desktop/mobile viewer checks before deployment.

## Open questions
- None blocking. User will revise prose after viewing; editable manuscript snapshot and source mapping remain local.
