# Getting Started

## Prerequisites
- Node.js 18+
- OpenAI API key

## Setup
```bash
git clone <repo>
cd ainput
npm install
cp .env.example .env.local   # Add your OpenAI key
npm run dev
```

## Environment Variables

| Variable         | Required | Description                    |
|------------------|----------|--------------------------------|
| OPENAI_API_KEY   | Yes      | Your OpenAI secret key         |

## Usage
1. Open http://localhost:3000
2. Click **Start Recording** and speak
3. Click **Stop Recording** to see numbered lines
4. Type a revision like `Rewrite line 2 to be shorter`
5. Click **Apply Revision** to see the diff

## Example Revision Instructions
- `"Rewrite line 3 to be more formal"`
- `"Shorten line 1"`
- `"Clarify line 4 — it's too technical"`
- `"Delete line 2"`
- `"Rewrite line 5 to avoid passive voice"`

## Building for Production
```bash
npm run build
npm start
```

## Running Tests
```bash
npm test
```
(Tests not yet implemented — contributions welcome!)
