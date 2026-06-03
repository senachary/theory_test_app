# Backlog

Items are roughly prioritised top-to-bottom within each section.

---

## High Priority

- [ ] **Expand question bank to 750 questions** — source additional questions from GitHub JSON repos and RapidAPI to cover the full official DVSA set
- [ ] **Hazard Perception section** — video clips with tap-to-score mechanic; 14 clips (1 with 2 hazards), scoring windows per clip
- [ ] **Road signs reference** — standalone browsable sign library with images and explanations
- [ ] **Image questions** — fetch sign/scenario images from a CDN and render them in the quiz card (field already wired up as `image_url`)

---

## Medium Priority

- [ ] **Dark mode** — NativeWind `dark:` classes; follow system preference
- [ ] **Question count picker** — let user choose 10 / 20 / 50 questions before starting
- [ ] **Practice mode vs. mock mode** — Practice shows explanation after each answer; Mock only shows results at the end (like the real test)
- [ ] **Missed questions review** — after a test, show all incorrectly answered questions with explanations
- [ ] **Search questions** — full-text search across the question bank
- [ ] **Streak tracking** — daily study streak with a visual indicator on the home screen
- [ ] **Push notifications** — daily reminder to practise (Expo Notifications)

---

## Lower Priority

- [ ] **Supabase backend** — sync progress across devices; leaderboard; user accounts
- [ ] **Offline asset caching** — pre-cache sign images and hazard clips with Expo's asset system
- [ ] **Accessibility** — screen reader labels (`accessibilityLabel`, `accessibilityRole`) on all interactive elements
- [ ] **Tablet layout** — two-column grid for the category picker on wide screens
- [ ] **Share results** — generate a shareable card (score, pass/fail, category breakdown)
- [ ] **Achievements / badges** — unlock badges for streaks, perfect scores, category mastery
- [ ] **Other test types** — motorcycle, lorry, bus (different question pools and pass marks)

---

## Technical Debt

- [ ] Add `babel-plugin-module-resolver` to resolve the `@models/*` path aliases at runtime (currently only TypeScript-level)
- [ ] Unit tests for `useQuiz` and `questionService` with Jest + React Testing Library
- [ ] E2E test with Detox for the core quiz flow
- [ ] CI/CD pipeline: GitHub Actions → Vercel preview deploy on PR, production on merge to main
