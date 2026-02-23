# AINput — Onboarding Guide

## Project Location

```
/home/ubuntu/.openclaw/workspace-archon/ainput/
```

## Prerequisites

- **Node.js** ≥ 20 (current environment: v24.13.1)
- **npm** (bundled with Node.js)

## Quick Start

```bash
cd /home/ubuntu/.openclaw/workspace-archon/ainput

# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your OpenAI API key:
#   OPENAI_API_KEY=sk-...

# 3. Start development server
npm run dev
# → http://localhost:3000
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `OPENAI_API_KEY` | ✅ | OpenAI API key for Whisper (transcription) and GPT-4o-mini (revision) |

Create `.env.local` in the project root (it's gitignored). See `.env.example` for the template.

## Project Structure

```
ainput/
├── app/
│   ├── api/
│   │   ├── transcribe/route.ts   # POST: audio → Whisper → segmented lines
│   │   └── revise/route.ts       # POST: lines + instruction → GPT revision
│   ├── components/
│   │   ├── Recorder.tsx           # Mic recording via MediaRecorder API
│   │   ├── TranscriptView.tsx     # Numbered transcript display
│   │   ├── RevisionInput.tsx      # Text input for revision instructions
│   │   └── DiffView.tsx           # Before/after diff display
│   ├── lib/
│   │   ├── types.ts               # TypeScript interfaces (Line, VersionEntry, etc.)
│   │   ├── store.ts               # In-memory session/version store (server-side)
│   │   ├── segmenter.ts           # Text → numbered Line[] segmentation
│   │   └── metrics.ts             # Session metrics logging
│   ├── globals.css                # Global styles
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Main page (client component, orchestrates all)
├── docs/
│   ├── SPEC_V0.md                 # Product specification
│   ├── ARCHITECTURE.md            # Architecture overview
│   ├── API_SPEC.md                # API endpoint documentation
│   ├── CONTRIBUTING.md            # Contribution guidelines
│   └── GETTING_STARTED.md         # Getting started guide
├── .env.example                   # Env var template
├── package.json                   # Next.js 16 + React 19 + Tailwind 4
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
└── eslint.config.mjs
```

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5.9 |
| Styling | Tailwind CSS 4 |
| AI — Transcription | OpenAI Whisper API |
| AI — Revision | OpenAI GPT-4o-mini |
| State | Client-side React state (no DB in V0) |

## Current Status

- ✅ Project scaffold complete (Next.js + TypeScript + Tailwind)
- ✅ Build passes (`npm run build`)
- ✅ 2 commits on main branch
- ✅ Core types, segmenter, API routes, 4 components implemented
- 🔲 UI styling (currently minimal/unstyled)
- 🔲 Full end-to-end flow testing with real audio
- 🔲 Version history restore (view-only currently)

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server (hot reload) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Next Steps (Development Roadmap)

1. **UI/UX Polish** — Proper styling, responsive layout, dark mode
2. **Recording UX** — Visual feedback (waveform/level meter), timer
3. **Version History** — Restore to previous versions, side-by-side comparison
4. **Inline Editing** — Click-to-edit lines directly
5. **Suggestion Chips** — Quick-action buttons (shorten, clarify, rewrite)
6. **Error Handling** — Better error states, retry logic
7. **Testing** — Unit tests for segmenter, integration tests for API routes

## Collaboration Guidelines

### Git Workflow

- Branch from `main` for features: `feat/<name>`
- Branch from `main` for fixes: `fix/<name>`
- Commit messages: `type: description` (e.g., `feat: add waveform visualizer`)
- Keep commits atomic and focused

### Code Style

- TypeScript strict mode
- Use `'use client'` directive only where needed
- Prefer named exports for components
- Keep components focused — one responsibility per file
- Use Tailwind utility classes for styling (avoid custom CSS where possible)

### PR Checklist

- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] New components have proper TypeScript interfaces
- [ ] API changes are reflected in `docs/API_SPEC.md`
