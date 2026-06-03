# UK Theory Test App

A DVSA-style UK driving theory test practice app built with **React Native + Expo + NativeWind**, deployable to both mobile (iOS/Android via Expo Go) and the web via **Vercel**.

---

## Features

- **80+ hand-written questions** across all 14 official DVSA categories
- **DVSA-style UI** — GOV.UK colour palette and design system
- **MVVM architecture** — clean separation of Models, ViewModels (hooks), and Views (screens)
- **Flag system** — bookmark tricky questions and review them in a dedicated session
- **Instant feedback** — correct answer highlighted in green with an explanation after every answer
- **Timer** — tracks how long each test session takes
- **Progress tracking** — per-category accuracy charts, test history (last 20 results), best score — all stored locally via AsyncStorage
- **Pass/fail indicator** — DVSA pass mark is 43/50 (86%)
- **Web + mobile** — one codebase, works in Expo Go on your phone and in any browser via Vercel

---

## DVSA Categories Covered

| # | Category |
|---|----------|
| 1 | Alertness |
| 2 | Attitude |
| 3 | Safety and Your Vehicle |
| 4 | Safety Margins |
| 5 | Hazard Awareness |
| 6 | Vulnerable Road Users |
| 7 | Other Types of Vehicle |
| 8 | Vehicle Handling |
| 9 | Motorway Rules |
| 10 | Rules of the Road |
| 11 | Road and Traffic Signs |
| 12 | Documents |
| 13 | Accidents |
| 14 | Vehicle Loading |

---

## Architecture — MVVM

```
src/
├── models/          # TypeScript types (Question, Progress, etc.)
├── data/            # Static question bank (questions.ts)
├── services/        # storageService (AsyncStorage), questionService (filtering/shuffle)
├── viewmodels/      # useQuiz, useProgress — all business logic as React hooks
└── views/
    ├── components/  # GovButton, ProgressBar, AnswerOption, CategoryBadge, GovHeader
    └── screens/     # HomeScreen, QuizScreen, ProgressScreen

app/                 # expo-router file-based routing
├── _layout.tsx
├── index.tsx        → HomeScreen
├── quiz.tsx         → QuizScreen (params: category, count, flaggedOnly)
└── progress.tsx     → ProgressScreen
```

---

## Getting Started

### Prerequisites

- Node 18+
- Expo CLI: `npm install -g expo-cli`
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

# Or scan QR with Expo Go
npm start
```

### Deploy to Vercel

```bash
# One-time setup
npm install -g vercel
vercel login

# Deploy
vercel --prod
```

Vercel uses `vercel.json` which runs `expo export --platform web` and serves the `dist/` folder as a SPA.

---

## Adding More Questions

Add entries to [src/data/questions.ts](src/data/questions.ts) following the `Question` type:

```ts
{
  id: 'XX001',               // unique ID
  category: 'Alertness',    // must be one of the 14 Category values
  question: 'Question text',
  options: [
    { id: 'A', text: '...' },
    { id: 'B', text: '...' },
    { id: 'C', text: '...' },
    { id: 'D', text: '...' },
  ],
  correct_answer: 'B',      // A | B | C | D
  explanation: 'Reason...',
  image_url: null,           // optional URL string
}
```

---

## Expanding to the Full DVSA Bank (~750 questions)

The official DVSA question bank is proprietary, but you can supplement this starter set by:

1. **GitHub JSON repos** — search GitHub for `driving theory questions JSON` and import into `questions.ts`
2. **RapidAPI** — several endpoints expose UK theory questions in the same JSON schema used here
3. **DVSA Safe Driving for Life** — the official practice tool at `www.safedrivingforlife.info`

---

## Licence

MIT. Question content based on publicly available Highway Code and DVSA guidance material.
