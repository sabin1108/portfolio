# Design

## Source of truth
- Status: Active
- Last refreshed: 2026-11-18
- Primary surfaces: `/` and `/GYEOLSOFT` only. The latter has portfolio/resume tabs on the same pathname.
- User manuscript: `D:/sabin/note/일단 작성할 포트폴리오.md`. Preserve prose verbatim, including the user's edits. Remove only troubleshooting heading numbers and editorial fence/section markers outside the selected text.
- Common portfolio: manuscript before `# 모아 트러블슈팅`. Gyeolsoft: common + cases 2,14,28,3,5,27 in that order. Case10 was intentionally removed and must remain excluded.
- Existing `src`, `public` and prior design guidance are preserved under `archive/legacy-20261118/`. Old projects/company pages must not be bundled or published.

## Brand
- Personal, restrained, document-first. The work and source wording lead.
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
- PDF typography/layout owns the visual identity; web defaults prioritize reading without zoom. Viewer chrome remains quiet.
- Large headings, short rules, generous margins, restrained blue accent and readable Korean body.
- Preserve document content rather than forcing a fixed page count.

## Visual language
- Paper #fffefa, ink #172335, muted #667085, blue #2d4e91, fine rules #d9dfe7. Web background #f3f4f6.
- System Korean sans-serif with an available local Korean font embedded/used in PDF generation. No remote font dependency.
- Landscape A4 portfolio pages; portrait A4 resume. Web reuses authoring HTML with an auto-height reading layout:18px main text,1.85 line height,17px minimum primary text,38px inner margins and two-column sections. Document text does not shrink to fit a fixed page. Downloaded PDFs use18px/13.5pt body,1.7 line height,10mm margins and native page breaks that keep headings with their text. Physical PDF pages are counted separately from web sections. Explicit zoom retains the fixed authoring preview. Diagram originals stay at full resolution; file structure uses a native HTML tree with vector icons.
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
- Desktop:200px page index and28px outer margins; auto-height reading pages, narrower paragraphs and visible body text at actual18px. At smaller desktop work areas sections use one column.
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
