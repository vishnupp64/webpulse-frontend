# WebPulse Analytics — Frontend

The React SPA dashboard for **WebPulse Analytics**. Deploys to **Vercel**.

> The API and tracking SDK live in the sibling project `webpulse-backend`.

## Stack
- React 18, TypeScript
- Vite (build + dev server), Tailwind CSS
- Recharts (charts), lucide-react (icons)
- Axios (typed API client), React Router
- Vitest + Testing Library (tests)

## Local development

```bash
npm install
npm run dev          # http://localhost:5173 (proxies /api → localhost:4000)
```

The dev server proxies `/api` to `http://localhost:4000` — run the backend first (see `webpulse-backend`).

## Scripts
| Command          | Description               |
| ---------------- | ------------------------- |
| `npm run dev`    | Vite dev server (:5173)   |
| `npm run build`  | `tsc -b && vite build` → `dist/` |
| `npm run preview`| Serve the production build|
| `npm test`       | Vitest unit/component tests|
| `npm run lint`   | Type-check                |

## Environment variables (build-time)

| Variable           | Purpose                                              | Default        |
| ------------------ | ---------------------------------------------------- | -------------- |
| `VITE_API_URL`     | Base URL of the backend API (e.g. `https://api.onrender.com`) | same-origin / dev proxy |
| `VITE_TRACKER_URL` | Base URL where `tracker.js` is served                | same-origin    |

Create a `.env` file at the repo root with values if the API is not same-origin:

```env
VITE_API_URL=https://your-api.onrender.com
VITE_TRACKER_URL=https://your-api.onrender.com
```

## Tests

```bash
npm test
```

## Deploy to Vercel

This repo root is the app root — no workspace prefix needed.

- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Env vars:** set `VITE_API_URL` (and `VITE_TRACKER_URL`) to your deployed backend.

SPA routing is handled by Vercel automatically (see `vercel.json` for the rewrite to `index.html`).

## Folder structure

```
webpulse-frontend/
├── src/
│   ├── components/    # reusable UI (Card, StatCard, Charts, DataTable, ...)
│   ├── layouts/       # AppLayout (+ sidebar/topbar selectors)
│   ├── pages/         # Dashboard, Realtime, Pages, Visitors, Events, ...
│   ├── hooks/         # useQuery, useQueryParams
│   ├── services/      # typed API client (axios)
│   ├── context/       # Auth, Toast, Website, DateRange
│   ├── types/         # shared types
│   ├── utils/         # formatters
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── vite.config.ts
├── postcss.config.js
├── tailwind.config.js
└── package.json
```