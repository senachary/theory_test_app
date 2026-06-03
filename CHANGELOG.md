# Changelog

All notable changes to this project are documented here.

---

## [1.3.0] — 2026-06-03

### Added
- **Randomised answer order** — `questionService` now shuffles options for every question at runtime and remaps `correct_answer` to the new position, so the correct answer is never in a predictable slot
- **Question count picker** — HomeScreen now shows a 10 / 20 / 50 toggle; selected count applies to both the Mixed test and category tests
- **Countdown timer** — replaced count-up timer with a countdown; time allowances: 10 questions = 10 min, 20 = 20 min, 50 = 57 min (DVSA standard)
- Timer warning states: turns yellow at ≤60s, red at ≤30s
- Auto-submit on timeout — quiz completes automatically when the timer reaches zero; results screen shows "Time up ⏱"
- `getTimeLimitSeconds()` exported from `questionService` and used by both `useQuiz` and `HomeScreen`
- `timedOut` flag on `QuizViewModel` and `useQuiz` so the results screen can distinguish timeout from normal completion

### Changed
- `useQuiz` ViewModel: `elapsedSeconds` replaced by `remainingSeconds` and `totalSeconds`; `timedOut` added
- `QuizScreen` top bar shows countdown with colour-coded warning instead of a count-up timer
- `HomeScreen` quick-start button subtitle now shows question count and time allowance dynamically
- Vercel build command updated to `npm run vercel-build` (runs Tailwind compile before export)
- `global.compiled.css` removed from `.gitignore` and committed so Vercel has it at build time

---

## [1.2.0] — 2026-06-03

### Added
- **754 questions** across all 14 DVSA categories (up from 118 at launch)
- All section header comments in `questions.ts` standardised to 14 canonical category headers — "BATCH N", "EXPANSION", "FINAL" etc. removed
- All compact single-line question objects expanded to full multi-line format for consistency

### Fixed
- `babel-preset-expo` added as devDependency (was missing, causing silent Metro transformer failure)
- `react-dom`, `react-native-web`, `@expo/metro-runtime` added (required for web export)
- `metro.config.js` switched from `withNativeWind` (incompatible with Expo 56 / Metro 0.84) to plain `getDefaultConfig` — NativeWind className transforms handled by Babel `jsxImportSource` alone
- `app.json` adaptive icon corrected to reference existing asset file
- Tailwind CSS now compiled via CLI pre-build (`npm run css`) rather than the Metro plugin; `global.compiled.css` is the committed output imported by `_layout.tsx`

---

## [1.1.0] — 2026-06-03

### Added
- Question count shown on each category card (`getTotalByCategory` wired into HomeScreen)
- Total question count shown dynamically in hero subtitle
- GOV.UK branding removed — `GovHeader` renamed to `AppHeader`, "GOV.UK" label removed from header bar

### Changed
- `ProgressScreen` uses `AppHeader` instead of `GovHeader`

---

## [1.0.0] — 2026-06-03

### Added
- Initial release
- 118 UK theory test questions across all 14 DVSA categories
- MVVM architecture: Models (`Question`, `Progress`), ViewModels (`useQuiz`, `useProgress`), Views (screens + components)
- `useQuiz` hook — question shuffling, answer selection, score, timer, flagging, completion
- `useProgress` hook — AsyncStorage-backed progress data
- `storageService` — persistence for test results, category stats, and flagged question IDs
- `questionService` — shuffle, filter by category, filter flagged-only
- `HomeScreen` — mixed test quick-start, category grid with accuracy %, flagged review shortcut
- `QuizScreen` — question display, answer options with instant feedback, explanation panel, flag toggle, progress bar, timer, results screen with pass/fail
- `ProgressScreen` — per-category accuracy bars, last 20 results, progress reset
- NativeWind 4 + Tailwind CSS 3 styling with DVSA colour palette
- expo-router file-based routing (`/`, `/quiz`, `/progress`)
- Vercel SPA deployment config
