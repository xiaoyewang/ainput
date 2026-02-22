# Architecture

## Data Flow
Voice → /api/transcribe (Whisper) → Segmenter → Numbered Lines → User Revision → /api/revise (GPT-4o-mini) → Updated Lines → Diff View

## Components
```
[Recorder] → [TranscriptView] ← [RevisionInput]
                    ↓
              [DiffView]
```

### Recorder
- Uses the browser `MediaRecorder` API to capture audio as `audio/webm`
- On stop, POSTs the blob to `/api/transcribe`
- Calls `onTranscription(lines, rawText)` with the result

### TranscriptView
- Renders numbered lines
- Highlights the most recently revised line

### RevisionInput
- Single text input + submit button
- Calls `onApply(instruction)` which POSTs to `/api/revise`

### DiffView
- Shows before/after for the revised line in red/green
- Includes a collapsible full-transcript view

## API Routes

### POST /api/transcribe
- **Input:** `multipart/form-data` with `audio` field (Blob)
- **Output:** `{ text: string, lines: Line[] }`
- **Pipeline:** audio → Whisper API → `segmentText()` → numbered lines

### POST /api/revise
- **Input:** `{ lines: Line[], instruction: string }`
- **Output:** `{ edit_type, target_line, constraints, rewritten_text, reason }`
- **Pipeline:** lines + instruction → GPT-4o-mini (JSON mode) → RevisionResponse

## State Management
All state is React `useState` in `page.tsx`. No external state library.
Version history is an array of snapshots stored in component state.

## Server-side Modules

### app/lib/segmenter.ts
Splits raw transcript text into `Line[]` using punctuation boundaries,
with a hard cap of 25 words per segment.

### app/lib/store.ts
In-memory server-side session store (Map). Tracks versions and metrics per session.
Note: resets on server restart — for dev/demo use only.

### app/lib/metrics.ts
Utility to log session metrics (revision count, edit type distribution, timing).

## Directory Structure
```
ainput/
├── app/
│   ├── api/
│   │   ├── transcribe/route.ts   # Whisper proxy
│   │   └── revise/route.ts       # GPT-4o-mini revision
│   ├── components/
│   │   ├── Recorder.tsx
│   │   ├── TranscriptView.tsx
│   │   ├── RevisionInput.tsx
│   │   └── DiffView.tsx
│   ├── lib/
│   │   ├── types.ts
│   │   ├── segmenter.ts
│   │   ├── store.ts
│   │   └── metrics.ts
│   └── page.tsx
├── docs/
├── .env.example
└── README.md
```
