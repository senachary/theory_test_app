# UK Theory Test App

A UK driving theory test practice app built with **React Native + Expo + NativeWind**, deployable to both mobile (iOS/Android via Expo Go) and the web via **Vercel**.

---

## Features

- **754 questions** across all 14 official DVSA categories
- **Randomised answer order** — options are shuffled on every attempt so the correct answer is never in a predictable position
- **Question count picker** — choose 10, 20, or 50 questions before each test
- **Countdown timer** — DVSA-style time allowances (10 min / 20 min / 57 min); turns yellow at ≤60s, red at ≤30s, auto-submits at zero
- **DVSA-style UI** — GOV.UK colour palette (blue, green, red, yellow)
- **MVVM architecture** — clean separation of Models, ViewModels (hooks), and Views (screens)
- **Flag system** — bookmark tricky questions mid-quiz and review them in a dedicated flagged session
- **Instant feedback** — correct answer highlighted in green with an explanation after every answer
- **Pass/fail indicator** — 86% pass mark (matching the DVSA standard)
- **Progress tracking** — per-category accuracy bars, last 20 test results, best score — stored locally via AsyncStorage
- **Web + mobile** — one codebase, runs in Expo Go on your phone and in any browser via Vercel

---

## DVSA Categories Covered

| # | Category | Questions |
|---|----------|-----------|
| 1 | Alertness | ~48 |
| 2 | Attitude | ~40 |
| 3 | Safety and Your Vehicle | ~51 |
| 4 | Safety Margins | ~43 |
| 5 | Hazard Awareness | ~50 |
| 6 | Vulnerable Road Users | ~45 |
| 7 | Other Types of Vehicle | ~32 |
| 8 | Vehicle Handling | ~40 |
| 9 | Motorway Rules | ~42 |
| 10 | Rules of the Road | ~52 |
| 11 | Road and Traffic Signs | ~57 |
| 12 | Documents | ~35 |
| 13 | Accidents | ~37 |
| 14 | Vehicle Loading | ~32 |

---

## Architecture — MVVM

```
src/
├── models/          # TypeScript types (Question, Progress)
├── data/            # Static question bank (questions.ts — 754 questions)
├── services/        # questionService (shuffle, filter, time limits)
│                    # storageService (AsyncStorage persistence)
├── viewmodels/      # useQuiz, useProgress — all business logic as hooks
└── views/
    ├── components/  # ProgressBar, AnswerOption, CategoryBadge, AppHeader
    └── screens/     # HomeScreen, QuizScreen, ProgressScreen

app/                 # expo-router file-based routing
├── _layout.tsx
├── index.tsx        → HomeScreen
├── quiz.tsx         → QuizScreen  (params: category, count, flaggedOnly)
└── progress.tsx     → ProgressScreen
```

---

## Quiz Config — Time Limits

| Questions | Time allowed |
|-----------|-------------|
| 10 | 10 minutes |
| 20 | 20 minutes |
| 50 | 57 minutes (official DVSA allowance) |

---

## Getting Started

### Prerequisites

- Node 18+
- Expo Go app on your phone (optional, for mobile preview)

### Install

```bash
git clone <repo-url>
cd theory_test_app
npm install
```

### Run locally

```bash
# Web (browser)
npm run web

# iOS simulator
npm run ios

# Android emulator
npm run android

# Expo Go — scan QR code
npm start
```

Each script compiles the Tailwind CSS before launching.

### Deploy to Vercel

```bash
# One-time setup
npm install -g vercel
vercel login

# Deploy
vercel --prod
```

`vercel.json` runs `npm run vercel-build` which compiles Tailwind then runs `expo export --platform web`. The compiled CSS (`global.compiled.css`) is committed to the repo so Vercel has it available at build time.

---

## Adding More Questions

Add entries to [src/data/questions.ts](src/data/questions.ts) under the appropriate category comment block. Follow the existing format:

```ts
{
  id: 'XX001',               // unique ID (category prefix + number)
  category: 'Alertness',    // must be one of the 14 Category values
  question: 'Question text',
  options: [
    { id: 'A', text: '...' },
    { id: 'B', text: '...' },
    { id: 'C', text: '...' },
    { id: 'D', text: '...' },
  ],
  correct_answer: 'B',      // A | B | C | D (in your source order)
  explanation: 'Reason...',
  image_url: null,           // optional — URL to a sign/scenario image
}
```

> **Note:** `correct_answer` refers to the option ID in your source. At runtime, `questionService` shuffles the options into a random order and remaps `correct_answer` automatically.

---

## Licence

MIT. Question content based on publicly available Highway Code and DVSA guidance material.
