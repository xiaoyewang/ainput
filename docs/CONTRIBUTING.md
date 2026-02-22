# Contributing to AINput

Thank you for your interest in contributing! This document outlines how to get started.

## Development Setup

```bash
git clone <repo>
cd ainput
npm install
cp .env.example .env.local
# Add your OPENAI_API_KEY to .env.local
npm run dev
```

## Project Structure

```
app/
├── api/           # Next.js API routes (server)
├── components/    # React client components
├── lib/           # Shared types and utilities
└── page.tsx       # Main entry point
docs/              # Project documentation
```

## Code Style

- **TypeScript** everywhere (strict mode)
- **Functional React** components only — no class components
- `'use client'` directive required on all interactive components
- No external state libraries — use React `useState` / `useReducer`
- Prefer `async/await` over `.then()` chains
- Add `// TODO:` comments for known gaps rather than leaving them silent

## Submitting Changes

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Make your changes with clear commit messages
4. Ensure `npm run build` passes with no errors
5. Open a Pull Request with a description of what changed and why

## Commit Message Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix   | When to use                        |
|----------|------------------------------------|
| feat:    | New feature                        |
| fix:     | Bug fix                            |
| docs:    | Documentation only                 |
| refactor:| Code change that isn't feat or fix |
| chore:   | Build / tooling changes            |

Example: `feat: add character-level diff highlighting`

## Good First Issues

- [ ] Add unit tests for `segmentText()` in `lib/segmenter.ts`
- [ ] Add character-level diff highlighting in `DiffView`
- [ ] Add suggestion chips in `RevisionInput` for common edit types
- [ ] Add CSS styling for a polished UI
- [ ] Add version rollback (click a version to restore it)

## Code of Conduct

Be kind, constructive, and assume good intent. Contributions of all experience levels are welcome.
