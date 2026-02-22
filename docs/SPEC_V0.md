# AINput — V0 Spec: AI-Native Structured Input

## Overview

AINput is an AI-native voice input system that transforms spoken audio into structured, numbered text segments and enables iterative, instruction-driven revision via large language models.

## Goals

1. **Low-friction capture** — Record voice and get a numbered transcript instantly.
2. **Structured output** — Text is segmented into discrete, addressable lines (not a wall of prose).
3. **AI-assisted revision** — Users give plain-English instructions ("Rewrite line 3 to be more formal") and the model returns a structured JSON edit.
4. **Version history** — Every revision creates a new snapshot; users can audit changes over time.

## Core Concepts

### Lines
A `Line` is the atomic unit of the transcript:
```json
{ "id": 1, "text": "Hello, this is my first sentence." }
```
Lines are 1-indexed. Each line contains at most ~25 words (long segments are split at midpoint).

### Revisions
A revision instruction targets one or more lines by number. The AI returns:
```json
{
  "edit_type": "shorten",
  "target_line": 2,
  "constraints": ["keep formal tone"],
  "rewritten_text": "The system processes audio in real time.",
  "reason": "Reduced verbosity while preserving meaning."
}
```

### Edit Types
| Type      | Meaning                          |
|-----------|----------------------------------|
| rewrite   | Full replacement of the line     |
| shorten   | Shorter version of the same idea |
| clarify   | Improve clarity / reduce jargon  |
| delete    | Remove the line entirely         |

### Version Snapshots
After each accepted revision, the full line array is frozen into a `VersionEntry`:
```json
{
  "version_id": "uuid",
  "timestamp": 1700000000000,
  "lines": [ ... ]
}
```

## Non-Goals (V0)
- Multi-speaker diarization
- Real-time streaming transcription
- Persistent storage (all state is in-memory / client state)
- Authentication

## Future (V1+)
- Paragraph / section hierarchy
- Collaborative editing
- Export to Markdown / DOCX
- Persistent sessions with database backend
