# Changelog

All notable changes to this project are documented here.

---

## [1.0.0] — 2026-06-03

### Added

- Initial release
- 80+ UK theory test questions across all 14 DVSA categories, written to match official DVSA style
- MVVM architecture: Models (`Question`, `Progress`), ViewModels (`useQuiz`, `useProgress`), Views (screens + components)
- `useQuiz` hook — manages question shuffling, answer selection, score, elapsed timer, flagging, and completion
- `useProgress` hook — loads and refreshes AsyncStorage-backed progress data
- `storageService` — AsyncStorage persistence for test results, category stats, and flagged question IDs
- `questionService` — shuffle, filter by category, filter flagged-only
- `HomeScreen` — quick-start mixed test, category grid with live accuracy %, flagged review shortcut
- `QuizScreen` — question display, answer options with instant feedback, explanation panel, flag toggle, progress bar, timer, results screen with pass/fail
- `ProgressScreen` — per-category accuracy bars, last 20 results history, progress reset
- DVSA GOV.UK colour palette (blue `#1D70B8`, green `#00703C`, red `#D4351C`, yellow `#FFDD00`)
- NativeWind 4 + Tailwind CSS 3 styling
- expo-router file-based routing (`/`, `/quiz`, `/progress`)
- `vercel.json` — SPA config for Vercel deployment
- `metro.config.js` — NativeWind Metro integration
- `babel.config.js` — NativeWind + Reanimated Babel plugins
