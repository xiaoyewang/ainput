# Architecture — AINput V0

## System Overview

AINput is a single-page Next.js application that validates one hypothesis: **users will iteratively refine spoken thoughts when given line-numbered structure, AI-powered revision, and clear diff feedback.**

The system has exactly two AI-backed operations:

1. **Transcribe** — Voice audio → numbered text lines (OpenAI Whisper)
2. **Revise** — Natural language instruction → structured line edit (GPT-4o-mini)

Everything else — state, versions, metrics — exists to support and measure these two operations.

```
┌─────────────────────────────────────────────────────────┐
│                     Browser (Client)                     │
│                                                         │
│  ┌──────────┐  ┌───────────────┐  ┌───────────────┐    │
│  │ Recorder  │→│ TranscriptView │←│ RevisionInput  │    │
│  └──────────┘  └───────┬───────┘  └───────────────┘    │
│                        ↓                                │
│                   ┌──────────┐                          │
│                   │ DiffView │                          │
│                   └──────────┘                          │
│                                                         │
│  State: useState in page.tsx (lines, versions, diff)    │
└────────────────┬──────────────────┬─────────────────────┘
                 │                  │
          POST /api/transcribe  POST /api/revise
                 │                  │
┌────────────────┴──────────────────┴─────────────────────┐
│                  Next.js API Routes                      │
│                                                         │
│  transcribe/route.ts          revise/route.ts           │
│  ├─ Whisper API call          ├─ Prompt construction    │
│  └─ segmentText()             └─ GPT-4o-mini (JSON)    │
│                                                         │
│  lib/segmenter.ts   lib/store.ts   lib/metrics.ts      │
└─────────────────────────────────────────────────────────┘
```

---

## Data Flow

### 1. Voice Capture → Transcription

```
User clicks "Start Recording"
  → MediaRecorder captures audio/webm chunks
  → User clicks "Stop"
  → Blob assembled from chunks
  → POST /api/transcribe (multipart/form-data)
  → Route forwards audio to OpenAI Whisper API
  → Raw text returned
  → segmentText() splits by punctuation, enforces ≤25 words/line
  → Response: { text, lines: [{ id: 1, text: "..." }, ...] }
  → Client stores lines + creates version snapshot v1
```

### 2. Revision Cycle

```
User types instruction (e.g. "Shorten line 3")
  → POST /api/revise { lines, instruction }
  → Route constructs prompt with numbered lines + instruction
  → GPT-4o-mini returns JSON: { edit_type, target_line, rewritten_text, reason }
  → Client applies edit:
      - rewrite/shorten/clarify → replace target line text
      - delete → remove line, renumber remaining
  → DiffView renders before/after for the target line
  → New version snapshot appended to history
  → User may revise again (the core loop)
```

### 3. Version Restore

```
User clicks "restore" on a previous version
  → lines state replaced with that version's snapshot
  → Diff and highlight state cleared
  → User can continue revising from restored point
```

---

## Module Responsibilities

### API Routes

| Route | Purpose | AI Model | I/O |
|---|---|---|---|
| `POST /api/transcribe` | Proxy audio to Whisper, segment result | `whisper-1` | `Blob` → `{ text, lines }` |
| `POST /api/revise` | Send lines + instruction to GPT, parse structured edit | `gpt-4o-mini` | `{ lines, instruction }` → `RevisionResponse` |

Both routes are thin proxies. They construct the API call, forward it, and return the result. No business logic beyond segmentation in transcribe.

### Components

| Component | Role |
|---|---|
| `Recorder` | MediaRecorder wrapper. Manages recording state, timer display, audio blob assembly. Calls `onTranscription` on completion. |
| `TranscriptView` | Renders numbered `<ol>` of lines. Highlights the most recently revised line via `highlightedLineId`. |
| `RevisionInput` | Text input + submit form. Provides suggestion chips (Shorten / Clarify / Rewrite / Delete) that populate the input with templates. |
| `DiffView` | Shows before/after for the last revision. Red (removed) / green (added) markers. Collapsible full-transcript view. |

### lib Modules

| Module | Role |
|---|---|
| `types.ts` | Shared TypeScript interfaces: `Line`, `RevisionRequest`, `RevisionResponse`, `VersionEntry`, `SessionMetrics`. Single source of truth for data shapes. |
| `segmenter.ts` | Splits raw transcript text into `Line[]`. Splits on sentence-ending punctuation (`.?!;,`). Lines exceeding 25 words are split at midpoint. |
| `store.ts` | Server-side in-memory session store (`Map`). Tracks version snapshots and metrics per session. Resets on server restart — intentional for V0. |
| `metrics.ts` | Console-logs session metrics: total revision count, average inter-revision time, edit type distribution. For behavior analysis. |

---

## State Management

All client state lives in `useState` hooks in `page.tsx`. No state library, no context, no reducer.

| State | Type | Purpose |
|---|---|---|
| `lines` | `Line[]` | Current transcript (mutable on each revision) |
| `rawText` | `string` | Original Whisper output (display only) |
| `versions` | `VersionEntry[]` | Immutable snapshots after each operation |
| `lastRevision` | `RevisionResponse \| null` | Most recent revision result (drives DiffView) |
| `prevLines` | `Line[]` | Lines before last revision (diff comparison) |
| `highlightedLineId` | `number \| null` | Which line to highlight in TranscriptView |
| `revisionError` | `string \| null` | Error message from failed revision |

**Why no state library?** V0 has a single page with a linear flow. `useState` is sufficient and avoids unnecessary abstraction. If multi-page or cross-component state sharing becomes necessary (V1+), this decision should be revisited.

**Server-side store** (`lib/store.ts`) exists but is not currently wired into the client flow — version history is managed entirely client-side. The server store is available for future metrics collection endpoints.

---

## AI Integration

### Whisper Transcription

- Model: `whisper-1`
- Input: `audio/webm` blob from MediaRecorder
- Output: plain text string
- Called via OpenAI REST API (`/v1/audio/transcriptions`)
- No language hint — Whisper auto-detects

### GPT Revision

- Model: `gpt-4o-mini`
- Temperature: `0.3` (low creativity, high consistency)
- Response format: `json_object` (enforced structured output)
- Prompt structure: numbered lines + free-form instruction → single JSON edit object
- Edit types: `rewrite`, `shorten`, `clarify`, `delete`

The prompt asks the model to return exactly one `RevisionResponse` object. If the instruction doesn't reference a valid line number, the model returns `{ "error": "..." }`.

**Why gpt-4o-mini?** V0 prioritizes speed and cost over capability. Line-level text edits are well within mini's ability. Upgrade path to gpt-4o exists if edit quality proves insufficient.

---

## Design Decisions and Constraints

### Intentionally Excluded from V0

| Feature | Reason |
|---|---|
| Authentication | Behavior validation doesn't require identity |
| Database | In-memory state avoids infrastructure complexity |
| Real-time streaming | Whisper works on complete audio; streaming adds complexity with minimal behavior insight |
| Multi-line edits | Single-line targeting keeps the revision model simple and predictable |
| UI framework | Plain CSS avoids dependency overhead for a validation prototype |

### Key Constraints

1. **Line ID stability** — Non-target lines must not change during revision. The prompt and client logic enforce this: only `target_line` is modified.
2. **Single-line atomic edits** — Each revision targets exactly one line. This is a deliberate constraint to keep the interaction model legible.
3. **No persistent storage** — All state resets on page reload (client) or server restart (metrics). This is acceptable for V0's goal of measuring within-session behavior.
4. **25-word segment cap** — Segmenter splits long sentences at midpoint. This keeps lines short enough for targeted revision without over-fragmenting.
5. **JSON mode** — `response_format: { type: "json_object" }` eliminates parsing failures from markdown or prose in GPT output.

### Trade-offs

- **Client-side version history** means no cross-session persistence, but eliminates the need for a session management API.
- **Server-side store exists but is unused by the client** — this is scaffolding for metrics collection, not dead code.
- **No error retry** — API failures surface to the user immediately. Acceptable for localhost/demo use.

---

## Directory Structure

```
ainput/
├── app/
│   ├── api/
│   │   ├── transcribe/route.ts   # Whisper proxy + segmentation
│   │   └── revise/route.ts       # GPT revision proxy
│   ├── components/
│   │   ├── Recorder.tsx          # Audio capture
│   │   ├── TranscriptView.tsx    # Line display
│   │   ├── RevisionInput.tsx     # Instruction input + chips
│   │   └── DiffView.tsx          # Before/after comparison
│   ├── lib/
│   │   ├── types.ts              # Shared interfaces
│   │   ├── segmenter.ts          # Text → Line[] splitting
│   │   ├── store.ts              # In-memory session store
│   │   └── metrics.ts            # Console metrics logger
│   ├── page.tsx                  # Root page, all state lives here
│   ├── layout.tsx                # App shell
│   └── globals.css               # Styles
├── docs/
│   ├── ARCHITECTURE.md           # This file
│   ├── SPEC_V0.md                # Feature spec
│   ├── API_SPEC.md               # API contract
│   ├── GETTING_STARTED.md        # Setup guide
│   └── CONTRIBUTING.md           # Contribution rules
├── .env.example                  # OPENAI_API_KEY placeholder
├── README.md                     # Project overview + hypothesis
└── package.json
```
