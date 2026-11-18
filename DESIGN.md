# Design

## Source of truth
- Status: Active
- Last refreshed: 2026-11-18
- Latest direction: reuse the archived PhotoMap/GameInfo design with Moa content. Show one portfolio page at a time, with a slim far-left contents rail and large upper-left execution image. Restore the actual BinClassicResume hierarchy. Folder-tree geometry stays intact; recolor only.
- Visual references: archive/legacy-20261118/_workspace/presentation-reference/new-page-4.jpg and new-page-5.jpg; archived ProjectPresentation.tsx, project-presentation.css, BinClassicResume.tsx and bin-resume.css.
- Primary surfaces: `/` and `/GYEOLSOFT` only. The latter has portfolio/resume tabs on the same pathname.
- User manuscript: `D:/sabin/note/일단 작성할 포트폴리오.md`. Preserve prose verbatim, including the user's edits. Remove only troubleshooting heading numbers and editorial fence/section markers outside the selected text.
- Common portfolio: manuscript before `# 모아 트러블슈팅`. Gyeolsoft: common + cases 2,14,28,3,5,27 in that order. Case10 was intentionally removed and must remain excluded.
- Existing `src`, `public` and prior design guidance are preserved under `archive/legacy-20261118/`. Old projects/company pages must not be bundled or published.

## Brand
- Reuse the existing personal portfolio identity: dark editorial pages, a large project screenshot on the left, narrative on the right. Contents is a separate slim web rail; hide the repeated chapter list in PDF. Resume stays classic white paper.
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
- Use deliberate complete scenes. Troubleshooting uses a problem/choice page followed by a solution/verification/result page. Never leave a trailing result alone on an automatic continuation page.
- Keep current manuscript content; split by meaning rather than shrinking type or clipping.

## Visual language
- Portfolio: background#0c1010, panel#131a1a, warm text#f2f0ea, muted#b5beb8, coral#e39a80, blue#87c5dc, rules#2c3533. Resume: white, ink#20262e, muted#4e5968 and blue#245f95.
- System Korean sans-serif with an available local Korean font embedded/used in PDF generation. No remote font dependency.
- Portfolio uses authored fixed A4 landscape scenes; resume uses two A4 portrait pages. Both retain18px/13.5pt body. Each authored scene maps to one PDF page and one web slide. Only the current portfolio slide is mounted; text reflows without shrinking and zoom shows the authored page.
- Resume restores introduction/contact with photo on the right, project/role, two featured achievements side by side followed by full-width achievements, then skill rows and education. Preserve current text units and personal facts.
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
- Portfolio uses explicit previous/next buttons and Left/Right keys, with one visible slide. Do not intercept the mouse wheel. Resume retains native vertical scrolling. Reduced-motion preference is respected by having no essential motion.

## Responsive behavior
- Desktop portfolio:64px button rail at the far left. Menu expands to264px as an overlay without shifting the slide. Actual execution screenshot is large in the active slide's upper-left; the app's own menu in the image is not hidden. Body remains18px. One page occupies the viewer between header and page controls; neighboring pages never show together.
- PDF: hide the repeated chapter list while retaining the screenshot/narrative composition. Resume uses its original white paper structure with photo right and normal vertical reading on web.
- Current review scope: desktop only, per user. Check every slide at1280/1440/1920px, DPR2, keyboard use, old-route rejection and PDF downloads. Mobile behavior is excluded from review.

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
