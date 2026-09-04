# Design

## Source of truth
- Status: Active
- Last refreshed: 2026-09-04
- Primary product surfaces: `/portfolio_bin`, `/resume/bin_resume`
- Evidence reviewed: Toss homepage interaction patterns, local CSS Stats export, existing portfolio and resume data.

## Brand
- Personality: measured, clear, human, evidence-led.
- Trust signals: real project screens, metrics, architecture, papers, certification, and source links.
- Avoid: decorative gradients, generic AI copy, unexplained technical claims, and resume content hidden behind motion.

## Product goals
- Goals: make the portfolio immersive and scannable; make the resume printable and evidence-dense from page one.
- Non-goals: make the resume behave like a long-form animated portfolio.

## Information architecture
- Portfolio: introduction -> strengths -> project -> metrics -> architecture -> decisions -> activities/papers -> profile.
- Resume: profile/contact -> summary and skills -> projects -> activities/papers -> education and certificates.

## Visual language
- Color: Toss-inspired blue, ink, neutral gray, and white bands.
- Typography: Korean-capable system stack with Toss Product Sans OTF when available; zero tracking on display copy.
- Motion: viewport reveals, progress bar, and restrained parallax on portfolio only.
- Shape: compact rounded controls, large framed project media, no nested page cards.

## Accessibility
- Preserve semantic headings, links, details/summary, visible focus states, and reduced-motion behavior.
- Keep all critical resume content in normal document flow and print media.

## Responsive behavior
- Support mobile and desktop; portfolio bands collapse to one column and resume print rules remove navigation and shadows.

## Implementation constraints
- Reuse the existing React, Motion, Tailwind, Lucide, and portfolio data models.
- Do not add a Three.js dependency for decorative effects; use existing project evidence and CSS visuals unless a real 3D artifact is required.
- Verify with `npm run build` and route smoke tests for both surfaces.

## Open questions
- [ ] Replace placeholder narrative copy with final candidate-approved wording.
