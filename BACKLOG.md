# Backlog

Items are roughly prioritised top-to-bottom within each section.

---

## High Priority

- [ ] **Hazard Perception section** — video clips with tap-to-score mechanic; 14 clips (1 with 2 hazards), scoring windows per clip
- [ ] **Road signs reference** — standalone browsable sign library with images and explanations, searchable by category
- [ ] **Image questions** — fetch sign/scenario images from a CDN and render in the quiz card (`image_url` field already wired up in the Question type)
- [ ] **Missed questions review** — after a test, show all incorrectly answered questions with the correct answer and explanation highlighted

---

## Medium Priority

- [ ] **Practice mode vs. mock mode** — Practice shows explanation after each answer; Mock hides all feedback until the end (matching the real DVSA test experience)
- [ ] **Dark mode** — NativeWind `dark:` classes; follow system preference
- [ ] **Streak tracking** — daily study streak counter with a visual indicator on the home screen
- [ ] **Search questions** — full-text search across the question bank for targeted revision
- [ ] **Push notifications** — daily reminder to practise (Expo Notifications)
- [ ] **Share results** — generate a shareable card image (score, pass/fail, category breakdown)

---

## Lower Priority

- [ ] **Accessibility** — screen reader labels (`accessibilityLabel`, `accessibilityRole`) on all interactive elements; minimum tap target sizes
- [ ] **Tablet layout** — wider two-column grid for category cards on iPad/desktop screens
- [ ] **Achievements / badges** — unlock badges for streaks, perfect scores, category mastery
- [ ] **Other test types** — motorcycle (Module 1/2), lorry, bus (different question pools and pass marks)
- [ ] **Supabase backend** — sync progress across devices if multi-device use becomes a priority

---

## Technical Debt

- [ ] Add `babel-plugin-module-resolver` so `@models/*`, `@services/*` etc. path aliases resolve at runtime (currently TypeScript-only)
- [ ] Unit tests for `useQuiz` and `questionService` with Jest + React Testing Library
- [ ] E2E smoke test with Playwright (web) for the core quiz flow
- [ ] GitHub Actions CI: type-check + export on every PR; Vercel preview deploy on merge
