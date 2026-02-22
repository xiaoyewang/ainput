# AINput

**AI-native structured voice input with real-time revision.**

AINput lets you record your voice, automatically transcribes it into numbered lines using OpenAI Whisper, and lets you revise individual lines with plain-English instructions powered by GPT-4o-mini.

## Features

- 🎙 **Voice recording** — one click to capture audio in the browser
- 📄 **Structured output** — transcript is split into numbered, addressable lines
- ✏️ **AI revision** — type instructions like *"Rewrite line 3 to be shorter"*
- 🔍 **Diff view** — red/green before-after for every change
- 🕓 **Version history** — every revision creates a snapshot

## Quick Start

```bash
git clone <repo>
cd ainput
npm install
cp .env.example .env.local   # Add your OPENAI_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

| Layer      | Technology              |
|------------|-------------------------|
| Framework  | Next.js 15 (App Router) |
| Language   | TypeScript              |
| UI         | React (client components) |
| Transcription | OpenAI Whisper (`whisper-1`) |
| Revision   | OpenAI GPT-4o-mini (JSON mode) |
| Styling    | Tailwind CSS            |

## Documentation

- [Getting Started](docs/GETTING_STARTED.md)
- [Architecture](docs/ARCHITECTURE.md)
- [API Specification](docs/API_SPEC.md)
- [V0 Spec](docs/SPEC_V0.md)
- [Contributing](docs/CONTRIBUTING.md)

## Environment Variables

```env
OPENAI_API_KEY=sk-your-key-here
```

## License

MIT
