# AI Native Structured Input – V0

## Project Status

Phase: Behavior Validation
Version: V0 (Software Only)
Scope: Strictly Limited

---

## 1. What This Project Is

This is a behavior validation experiment. We are testing whether users are willing to:

1. Speak their thoughts
2. See them structured into numbered lines
3. Revise specific lines using natural language
4. Perform multiple iterative refinements

This is NOT:
- A note-taking app
- A transcription tool
- A productivity suite
- A writing assistant
- A chat interface

This is a structured thought refinement experiment.

---

## 2. Core Hypothesis

Users will repeatedly refine their spoken thoughts if the system provides:

- Line-numbered structure
- Line-referenced revision
- Clear diff feedback
- Simple version control

If users do not naturally revise multiple times, the concept must be reconsidered.

---

## 3. Scope (Locked for V0)

### Included
- Voice recording
- Speech-to-text transcription
- Automatic line segmentation
- Line numbering
- Line-referenced revision
- Diff display
- Session-based version history
- Basic metrics logging

### Excluded
- Authentication
- Database
- Cloud sync
- Long-term memory
- Personalization
- AI agent orchestration
- Mobile optimization
- Hardware integration
- UI polishing

No feature additions without explicit approval.

---

## 4. Tech Stack

Frontend:
- Next.js (App Router)
- React
- TypeScript

Backend:
- Next.js API routes

AI:
- OpenAI API
- Whisper for transcription

Storage:
- In-memory session only

Deployment:
- Localhost → Vercel

---

## 5. Architecture Overview

User Voice → Whisper Transcription → Segmentation Engine → Numbered Lines → Revision Instruction → Revision Parser → AI Rewrite → Diff Display → Version Snapshot

All edits are line-level only.

---

## 6. Development Principles

1. Simplicity over abstraction
2. No premature optimization
3. No feature expansion
4. Preserve line ID stability
5. Do not modify non-target lines during revision
6. Log behavior metrics for analysis

This project prioritizes behavioral insight over scalability.

---

## 7. Folder Structure

```
/app
  /api
    /transcribe
    /revise
  /components
    Recorder.tsx
    TranscriptView.tsx
    RevisionInput.tsx
    DiffView.tsx
  page.tsx
```

Keep structure minimal.

---

## 8. Coding Rules

- No additional dependencies unless necessary
- No UI frameworks beyond basic styling
- No database introduction
- No state management libraries
- Keep logic readable and explicit
- Avoid complex abstractions

If unsure, choose the simpler implementation.

---

## 9. Success Criteria

The experiment succeeds if:

- Users perform ≥ 3 revisions in one session
- Users understand diff without explanation
- Users voluntarily initiate revision
- System remains stable

If users only perform one revision or none, the hypothesis is invalid.

---

## 10. Contribution Rules

Before implementing any new feature:

1. Confirm it supports the core hypothesis.
2. Ensure it does not expand scope.
3. Open an issue describing rationale.
4. Await approval.

This repository is intentionally constrained.

---

## 11. Vision (Not For Implementation Yet)

Future possibilities (NOT part of V0):

- AI-native input method system
- Hardware integration
- Cross-app structured memory
- Persistent revision history

These are directional ideas only. Do not implement.

---

## 12. Primary Mission

Validate structured AI-assisted refinement behavior. Everything else is secondary.
