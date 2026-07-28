# Nimbus — AI Productivity Workspace

A modern, responsive AI productivity workspace with a Notion-like feel. Plan
your day with AI, run research, chat with an AI assistant, and track everything
from a single dashboard.

## Features

- **Dashboard** — productivity stats, charts, and recent activity at a glance.
- **AI Task Planner** — manage tasks and generate daily/weekly schedules.
- **AI Research Assistant** — summarize, explain, research, or compare topics.
- **AI Chatbot** — conversational workplace assistant with suggested prompts.
- **History** — searchable archive of every AI generation and chat.
- **Settings** — dark mode, language, notifications, response length.
- **Responsible AI Disclaimer** shown across the app.

## Tech stack

- TanStack Start (React 19 + Vite 7)
- TypeScript
- Tailwind CSS v4
- Recharts, Lucide icons

State is persisted in `localStorage`. AI responses come from `src/lib/ai-service.ts`
as mock functions that you can swap for real API calls (OpenAI, Lovable AI Gateway, etc.).

## Getting started

Requires Node.js 20+.

```sh
npm install
npm run dev
```

Then open http://localhost:8080.

## Project structure

```
src/
  components/     Reusable UI + layout (AppShell, Disclaimer, AiOutputCard)
  lib/            Store (localStorage) and mock AI service
  routes/         File-based routes (dashboard, planner, research, chat, history, settings)
  styles.css      Tailwind v4 theme and design tokens
```

## Replacing mock AI with a real provider

Edit `src/lib/ai-service.ts` and replace each function body with a `fetch` call
to your provider. Keep the same return shapes so the UI works unchanged.

## License

MIT
