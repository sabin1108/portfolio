# Design

## Source of truth
- Status: Active
- Last refreshed: 2026-10-09
- Primary product surfaces: `/portfolio_bin`; the resume at `/resume/bin_resume` keeps its separate reading and print layout.
- Evidence reviewed: user-supplied presentation-scroll-animation.zip, live https://toss.im/ (2026-09-08), projectNotes in BinTossPortfolio.tsx, architecture/candidates/photomap-ko.architecture.json and gameinfo-ko-v2.architecture.json.
- Latest user correction supersedes the interim diagram redesign: retain dark coral/blue and the earlier fixed TOC slide layout; use ORIGINAL architecture PNG assets, not newly drawn diagrams. Show project main image first, original architecture with side explanations second, and detailed implementation/case pages afterward. Scroll drives horizontal page transitions. Opening cover uses typography/project index instead of PhotoMap screenshot.

## Brand
- Latest copy refinement (2026-10-07): explain virtualization's DOM/card-count effect immediately after its action. Keep synthetic-list/mobile-size-PC scope next to the result and detailed viewport/DPR/repetition conditions on the evidence page. Use “목록용 썸네일 / 상세용 큰 이미지” instead of internal image-variant names. Expand the default resume introduction to roughly three desktop lines covering frontend work, validation, and AI/research/patent participation.
- Personality: calm, precise, personal.
- Trust signals: actual project screens, explained decisions, reproducible measurement conditions, acknowledged limitations.
- Avoid: generic claims, decorative statistics, identical left-image/right-text slides, tiny diagrams and obligatory external viewers.

## Product goals
- Goals: a first-time reader understands what was built, what the developer owned, why code changed and what was checked.
- Non-goals: copying the resume verbatim or reproducing Toss branding.
- Success signals: architecture readable without clicking; complete narratives available through scrolling; no clipped content.

## Personas and jobs
- Primary personas: recruiters and frontend engineers reviewing a candidate.
- User jobs: scan the service first; understand decisions; inspect supporting details and source links.
- Contexts: desktop review, mobile link opening, keyboard navigation, reduced motion.

## Information architecture
- Navigation: global project/profile/resume links and compact sticky project chapter navigation.
- Project order: PhotoMap, GameInfo.
- Nine pages per project: service introduction, original architecture, two implementation pages, two pages per case study (diagnosis and changes/results), evidence and remaining work.
- Core content stays inline; only external project/source links open new tabs.

## Design principles
- A slide has one primary idea. Preserve the earlier image-plus-TOC layout for detailed pages, with a large centered original image and side explanations on the architecture page.
- Explain the task in plain Korean before naming the implementation technique.
- Split detailed narratives into enough slides to fit the viewport; smaller screens use normal document flow with all content available.

## Visual language
- Color: dark #0c1010, warm white #f2f0ea, PhotoMap coral #e39a80, GameInfo blue #87c5dc.
- Typography: existing Korean font stack; display headings 34-54px, body 14-16px, diagram node titles at least 20px.
- Spacing/layout: generous scene margins, full-width diagrams, large central product media with short side explanations, alternating case composition.
- Shape: restrained borders and 12px corners for media and meaningful diagram nodes.
- Motion: native scrolling controls a sticky page stage; incoming/outgoing pages translate horizontally with opacity. No wheel capture, timers or forced snap.
- Imagery: actual project screens. Architecture uses existing public/architecture/photomap-dark-preview.png and gameinfo-dark-preview.png unchanged, with plain-language side explanations. No replacement architecture drawings or required external viewer.

## Components
- Same-title search evidence (2026-10-09, latest correction): lead with the specific achievement: reusing the fetched game list avoids repeated title lookups when filters change. Explain what is stored and how it is reused. Feature zero additional title lookups in the cached-result reuse test, with same-title, cache-validity and mock scope visible. Keep the separate four-concurrent-searches/one-lookup test on the evidence slide, not as three competing headline numbers. Do not claim a measured four-to-one baseline, speed/cost gain, or total HTTP reduction. Evidence: GameInfo `tests/search-behavior.test.ts` and `src/lib/search.ts`. Use the existing result card; retain nine slides.
- Reuse: frontendPortfolio, projectNotes, global navigation, existing color tokens and Lucide icons.
- Changed: ProjectPresentation, original architecture image page, existing TOC sidebar, editorial cover, project-presentation.css.
- States: active/inert slide, horizontal transition, static responsive reading, reduced-motion reading.
- Ownership: portfolio-specific tokens remain in bin-portfolio.css, scene rules in project-presentation.css.

## Accessibility
- Target: readable contrast, keyboard navigation and reflow; no claim of full conformance audit.
- Preserve native anchor and heading semantics, visible focus states, complete DOM content.
- Hide browser scrollbar only on the portfolio route; preserve wheel/touch/PageDown/Space scrolling.
- Reduced motion: no fade or transforms; all text remains visible. Print keeps content in flow.

## Responsive behavior
- Desktop slide enhancement requires width >=1100, height >=760 and no reduced motion. All nine panels verified at 1100x760,1366x768 and1440x1000.
- Smaller screens: images, diagrams and case columns stack or reflow. No fixed-height text containers.
- Touch: chapter anchors and native scrolling remain available.

## Interaction states
- Loading: image dimensions reserve space; content is independent of images.
- Empty/error: existing project limitations are explained, not presented as proven service guarantees.
- Success: active chapter and inline results provide location/context.
- Disabled: no hidden required navigation.
- Offline/slow network: textual case studies remain readable while images load.

## Content voice
- Default resume headings state the concrete contribution before the supporting number: smaller list images, only nearby photo cards, skipping unchanged-card work, and reusing a fetched game list. Describe what changed and its effect in plain Korean. The search-reuse achievement now leads with zero additional title lookups while saved results are valid; the separate four-request/one-lookup test remains portfolio evidence. Keep the mock/synthetic conditions in nearby prose and retain two A4 pages.
- `localStorage` may be named directly where the implementation uses it, such as AI ChatBot conversation history. Keep the surrounding action in plain Korean; do not substitute it for React local state or session-only scroll restoration.
- Latest wording direction (2026-10-09): recruiters should understand each action without frontend jargon. Keep technology names such as Zustand, React.lazy, Suspense and D3, but explain behavior in everyday Korean. Replace debounce with waiting 0.4 seconds after typing stops; explain the D3 role once, then say ongoing work stops when data changes or the user leaves. This supersedes earlier requirements to retain jargon verbatim. Preserve measurement scope, the two-character search condition, nine slides per project and the two-page default resume.
- Natural factual Korean; explain observable behavior before API/library names.
- No invented performance gains, visitor counts or production reliability claims.
- PhotoMap leads with same-photo image response body reduction and synthetic-list card counts. Historical timing measurements retain their original conditions in supporting records. GameInfo demo fallback, memory cache and free-price limitation remain visible.

## Implementation constraints
- Existing React/Vite/CSS only; no new dependencies.
- Desktop active pages are calculated from absolute scroll position and marker spacing; CSS owns horizontal transitions. Inactive slides are inert; responsive/reduced-motion views expose every page. Listeners, animation frames and observers clean up on unmount.
- Verify mobile/tablet/desktop/short viewport, reduced motion, scene order, inline facts, scrolling/fade, keyboard anchors, image loading, resume isolation and production build.

## Open questions
- None blocking. Current user direction authorizes content-aware composition within verified project facts.

## Amjin application resume (2026-10-09)
- Use `/resume/amgine_frontend` for JobKorea posting 50109520, with a tailored introduction and three motivation paragraphs. Preserve `/resume/amjin_frontend` as an alias for previously shared links. Reuse the readable default project evidence and existing `/portfolio_bin` link.
- Confirmed posting scope: Amjin, information security, web frontend; the official company website describes network threat and anomaly analysis solutions. Detailed job requirements were inaccessible; do not claim a required framework, specific product duties or prior security work.
- Keep existing resume variants and portfolio unchanged. Use the existing application layout; verify mobile/desktop, direct access, print pages and default-resume isolation.

## Portfolio and resume evidence update (2026-10-06)
- Preserve portfolio slide count, architecture images, colors, scrolling and navigation. Update copy within that format. The default resume may change its hierarchy and spacing; keep readable mobile text and two A4 pages. Company-specific and frozen resumes remain unchanged.
- Lead PhotoMap with image response body 4.22MB to 237KB (94.4%, same 16 photos, recreated large-image condition, five runs each) and maximum rendered cards 3,000 to 57 (synthetic items, one SVG URL, mobile-sized PC 390x844/DPR2). These are distinct experiments, not service-wide traffic or speed improvement percentages.
- The previous 2.62s and 59.6ms/13.2ms studies remain historical evidence. Do not combine their baselines with October measurements. Do not promote text LCP 170ms or local modal DOM readiness 27.2ms as new speed gains.
- Prefer specific decisions and observed outcomes to slogans, repeated contrast pairs or lists of abstract competencies. Resume headings carry the result; nearby prose explains implementation and material test conditions without repeating the heading.
- Both resume projects use the same hierarchy: two measured results side by side on desktop, then two full-width implementation entries. GameInfo leads with mock card calls and shared candidate lookup; narrow screens stack the results.
- Omit the separate AI development-process section. The final GameInfo slide links directly to project activities; implementation and validation explanations stay in their project pages.
- Evidence: PhotoMap docs/performance/image-comparison-2026-10-03.md, portfolio-validation-2026-10-04.md and their verification JSON/summary CSV. This update supersedes earlier instructions to feature the old PhotoMap timing metrics.

## Screen loading and place search detail (2026-10-07)
- Add React.lazy/Suspense screen splitting and upload-place-search 400ms debounce to the editable default resume and PhotoMap implementation pages. Preserve nine slides per project, existing measured results, architecture assets and two-page A4 output.
- PhotoMap may use a fifth achievement entry for these implementation details; retain the first two measured results and existing navigation/D3 explanations. Company-specific and frozen resumes stay unchanged.
- Distinguish immediate local input from delayed parent-state synchronization and place lookup. Queries shorter than two characters skip lookup and synchronize immediately. Do not claim request cancellation, stale-response protection, measured request reduction or loading-time gains from this debounce/code-splitting implementation.
- Source evidence: PhotoMap Frontend/src/App.tsx and Frontend/src/components/UploadScreen.tsx. These details supplement the current portfolio; they are not explanations for the separate 94.4% image-body or 57-card measurements.

## Readability trial (2026-10-07)
- User requested a reversible visual/copy trial. Snapshot of the pre-trial portfolio files and this document: `_workspace/readability-before-20261007-162636/`. Restoring that snapshot preserves the earlier React.lazy/debounce addition; the resume is outside this trial.
- Preserve nine slides per project, architecture PNGs, colors, scrolling, links and visible measurement limits. Do not hide essential content behind a modal or accordion.
- Implementation pages use a short introduction and two or three labeled points. Remove repetitive concluding paragraphs. Result pages show the scoped metric before the two implementation steps; evidence pages use short, scannable lists.
- Shorten prose rather than shrinking text. Keep React.lazy/Suspense, 0.4 seconds after typing stops, image/sample conditions and synthetic/mock distinctions explicit.

## Personal introduction and image-case clarification (2026-10-07)
- Portfolio introduction describes finding and resolving user friction; the resume introduction describes verification through measurement and tests. Mention AI service work, paper presentation and joint patent application in supporting portfolio copy without implying model research or patent registration.
- Enlarge the editable resume portrait to 112x140px on desktop, 80x100px on mobile and 96x120px in print. Preserve company-specific resume styles.
- The PhotoMap 94.4% case concerns smaller thumbnail files, not lazy loading. Loading policy and request priority were held constant. Keep the scoped metric label visible and detailed deployment/sample conditions on the evidence slide without repeating them below the result metric.
- Validation completed: production build, six resume viewport checks (320–1366px), aliases/company-specific styles, and overflow checks passed. The latest A4 export remains two pages; both rendered pages were visually inspected with the enlarged portrait and revised introduction.
## Border and scroll consistency correction (2026-10-07)
- Remove the bounded hero gradient that produced a visible rectangular background edge. The selected-project list uses one separator between projects, with no redundant top/bottom rules; the full-width section guide keeps its boundary.
- Desktop slide selection uses the nearest marker to the sticky anchor offset, calculated from actual DOM spacing. The same scroll position selects the same page in both directions. Keep native wheel/touch/keyboard scrolling and 100svh spacing; do not cancel wheel events or force one page per arbitrary gesture.
- Use one 450ms horizontal page transition; remove staggered text animations that delayed individual blocks after navigation.
- Regression: `scripts/verify-portfolio-scroll-position.cjs` reproduced a direction-dependent selection at the same offset before the fix and checks bidirectional position, anchors and repeated equal wheel distances at three desktop viewports. Existing layout/wheel/reduced-motion checks remain required.
- Pre-fix snapshot: `_workspace/scroll-border-before-20261007-205350/`.

## Reading pace refinement (2026-09-09)
- Historical 66svh experiment was superseded by the 100svh interval below. The October scroll correction uses a single page transition without staggered text entrances. Reduced motion remains static.
- Describe concrete failed requests, pending map selection and verification outcomes; omit test-count boasting and generic coverage disclaimers from portfolio copy.

- Narratives explain implemented user-facing behavior, triggering situations, decisions and observed outcomes. Do not use source filenames as the substance of portfolio explanations; keep source links for optional technical inspection.

## Scroll interval verification (2026-09-09)
- Desktop slide markers are one viewport height apart (100svh). The previous 66svh interval skipped from page 3 to page 5 with a 900px wheel input at 1366x768.
- Native scrolling remains enabled; very large or sustained gestures can still traverse multiple pages.
- Regression: node scripts/verify-portfolio-wheel.cjs checks both directions, both projects, 1366x768 and 1440x1000, anchor navigation, reduced motion and mobile fallback.

## Frontend evidence completion (2026-09-13)
- Keep nine slides per project. PhotoMap implementation pages explain shared UI and state ownership; GameInfo explains card composition and infinite loading. Preserve the existing architecture images and both measured PhotoMap cases.
- Result cards show before/after values and reduction rates, with sample sizes and synthetic experiment conditions nearby. Do not attribute the image or virtualization results to the later shared-UI changes.
- At desktop widths 1100-1250px, give story text more width and reduce the image/text gap to 40px. Keep body font sizes, content, and navigation available without overlap. For desktop heights up to 850px, cap architecture image height at 100svh minus 320px to keep the heading inside the slide.
- Regression: `node scripts/verify-portfolio-layout.cjs` owns a temporary local server, checks all 18 slide boundaries at three desktop sizes, static mobile/tablet/short-screen layouts, result cards, runtime errors, and existing wheel/reduced-motion checks. Screenshots go to local `test-results/`.

## Content clarity refinement (2026-10-02)
- Preserve the nine-slide composition, architecture PNGs, colors, typography, navigation and resume print layout. Clarify the existing copy rather than adding sections or copying the reference PDF's layout.
- Connect user journeys with frontend ownership, and explain the decision behind shared UI, state lifetime and the React/D3 update boundary.
- Name the first-photo measurement as load completion. Treat mocked card processing counts and shared same-title lookups as scoped behavior evidence, not browser speed or total HTTP request reductions.
- Keep the default resume concise, with the existing achievement layout and supporting portfolio links. Company-specific and frozen resume content remains unchanged.
- The final general resume has four evidence-backed entries per project: PhotoMap loading, selection, navigation state/shared UI and D3; GameInfo normalization, repeated card processing, shared title lookup and CI. Keep A4 output at two pages without shrinking typography.
- The default resume describes image sizing and request priority without highlighting the 2.62s load-completion measurement. Portfolio evidence may retain the synthetic measurement while replacement tests are evaluated. Omit the 17.55s baseline and derived percentage; do not invent a replacement baseline.
- Omit the UI/state and data/verification skill groups from the default resume. Preserve company variants. Explain image load checks in plain Korean rather than DOM property names.
- The default resume and frontend portfolio link the 2026-09-30 patent application to a public specification excerpt that excludes private administrative pages. Label it as an application, preserve the original paper for historical/company-specific variants, and retain the two-page resume layout.
