# Changelog

All notable changes to this project are documented here.

---

## [1.6.0] — 2026-06-04

### Added
- **Test review screen** (`/review`) — every completed test is saved in full; tap "Review answers" in the History tab to see every question from that test with your answer, the correct answer, and the explanation
- Filter pills on the review screen: **All / Wrong / Correct** with counts, so you can focus on mistakes immediately
- `SavedTest` type — stores `resultId` and the full `AnswerLog` per completed test
- `savedTests: Record<string, SavedTest>` added to `UserProgress` — parallel to `recentResults`, pruned to the same 20-test limit
- `loadSavedTest(resultId)` exported from `storageService`
- `AnswerLog` now includes `selectedOptionId` — the option label the user actually chose (after runtime shuffle)
- `ReviewScreen` and `app/review.tsx` route
- "Review answers →" button on each History entry (only shown when saved data exists, so tests from before this update show score only)

### Changed
- `storageService.saveResult` persists the full answer log alongside stats updates
- `useQuiz` records `selectedOptionId` in each `AnswerLog` entry

---

## [1.5.0] — 2026-06-04

### Added
- **Per-category unseen breakdown** in the Questions tab — each of the 14 categories shows a progress bar (seen/total), unseen count, and a "Practise unseen →" link that launches a quiz capped at the number of unseen questions in that category
- `CATEGORY_TOTALS` pre-computed at module level in `ProgressScreen` to avoid recalculating on every render
- `unseenByCategory` derived stat — per-category seen/unseen breakdown used for the new rows

---

## [1.4.0] — 2026-06-04

### Added
- **Per-question stats tracking** — `QuestionRecord` type (`timesAnswered`, `timesCorrect`, `lastAnswered`) stored per question ID in `UserProgress.questionStats`
- `AnswerLog` type — one entry per answered question per test, carrying `questionId`, `category`, and `correct`
- `SavedTest` model stub (later expanded in 1.6.0)
- **Questions tab** in `ProgressScreen` with three cards:
  - *Never seen* — total count + progress bar of unseen questions
  - *Need work* — questions answered but <60% correct, listed worst-first
  - *Mastered* — answered ≥2× and always correct
  - *All answered* — full sorted list (worst first), capped at 30
- **Three-tab layout** in `ProgressScreen` — Categories / Questions / History
- Overall "Questions seen" stat in the top strip (answered / total)
- Mixed tests now correctly feed into per-category stats (previously Mixed tests were excluded from category breakdowns)

### Changed
- `storageService.saveResult` now takes a second `AnswerLog[]` argument and updates both category stats and `questionStats`
- `useQuiz` accumulates an `answerLogRef` throughout the session and passes it to `saveResult` on completion (including timeout)
- `clearProgress` uses two separate `removeItem` calls (replaced `multiRemove` which is not available on this AsyncStorage version)

---

## [1.3.0] — 2026-06-03

### Added
- **Randomised answer order** — `questionService` shuffles options for every question at runtime and remaps `correct_answer` to the new position
- **Question count picker** — HomeScreen 10 / 20 / 50 toggle; selected count applies to Mixed test and category tests
- **Countdown timer** — replaces count-up; time allowances: 10q = 10 min, 20q = 20 min, 50q = 57 min (DVSA standard)
- Timer warning states: yellow at ≤60s, red at ≤30s
- Auto-submit on timeout with "Time up ⏱" results screen
- `getTimeLimitSeconds()` in `questionService`
- `timedOut` flag on `QuizViewModel`

### Changed
- `useQuiz`: `elapsedSeconds` → `remainingSeconds` + `totalSeconds`; `timedOut` added
- `QuizScreen` top bar shows countdown with colour-coded warning
- `HomeScreen` quick-start subtitle shows count and time dynamically
- Vercel build command uses `npm run vercel-build`
- `global.compiled.css` committed to repo (removed from `.gitignore`)

---

## [1.2.0] — 2026-06-03

### Added
- **754 questions** across all 14 DVSA categories (up from 118)
- Section headers in `questions.ts` standardised to 14 canonical category names
- All compact single-line question objects expanded to full multi-line format

### Fixed
- `babel-preset-expo` added as devDependency
- `react-dom`, `react-native-web`, `@expo/metro-runtime` added for web export
- `metro.config.js` switched from `withNativeWind` to plain `getDefaultConfig`
- `app.json` adaptive icon corrected
- Tailwind compiled via CLI pre-build; `global.compiled.css` imported by `_layout.tsx`

---

## [1.1.0] — 2026-06-03

### Added
- Question count on each category card
- Total question count in hero subtitle
- GOV.UK branding removed — `GovHeader` → `AppHeader`

---

## [1.0.0] — 2026-06-03

### Added
- Initial release — 118 questions, MVVM architecture, `useQuiz`, `useProgress`, `storageService`, `questionService`
- `HomeScreen`, `QuizScreen`, `ProgressScreen`
- NativeWind 4 + Tailwind CSS 3, expo-router, Vercel SPA deployment
