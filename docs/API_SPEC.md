# API Specification

## Base URL
`http://localhost:3000` (development)

---

## POST /api/transcribe

Transcribes an audio recording and returns numbered lines.

### Request
- **Content-Type:** `multipart/form-data`
- **Body fields:**

| Field | Type | Required | Description              |
|-------|------|----------|--------------------------|
| audio | Blob | Yes      | Audio file (audio/webm)  |

### Response 200
```json
{
  "text": "Hello world. This is a test recording.",
  "lines": [
    { "id": 1, "text": "Hello world." },
    { "id": 2, "text": "This is a test recording." }
  ]
}
```

### Response 400
```json
{ "error": "No audio provided" }
```

### Response 502
```json
{ "error": "Whisper API error", "detail": "<upstream error text>" }
```

---

## POST /api/revise

Applies an AI-driven revision to a specific line.

### Request
- **Content-Type:** `application/json`
- **Body:**

```json
{
  "lines": [
    { "id": 1, "text": "Hello world." },
    { "id": 2, "text": "This is a test recording." }
  ],
  "instruction": "Rewrite line 2 to be more formal"
}
```

| Field       | Type     | Required | Description                        |
|-------------|----------|----------|------------------------------------|
| lines       | Line[]   | Yes      | Current full transcript            |
| instruction | string   | Yes      | Plain-English revision instruction |

### Response 200
```json
{
  "edit_type": "rewrite",
  "target_line": 2,
  "constraints": ["formal tone"],
  "rewritten_text": "This constitutes a sample audio recording.",
  "reason": "Replaced casual phrasing with formal register."
}
```

### Edit Types
| Value   | Meaning                       |
|---------|-------------------------------|
| rewrite | Full replacement               |
| shorten | Condensed version              |
| clarify | Improved clarity               |
| delete  | Line should be removed        |

### Error Response (invalid instruction)
```json
{ "error": "Please specify a valid line number." }
```

### Response 502
```json
{ "error": "OpenAI API error", "detail": "<upstream error text>" }
```

---

## Data Types

### Line
```typescript
interface Line {
  id: number;    // 1-indexed line number
  text: string;  // Line content
}
```

### RevisionResponse
```typescript
interface RevisionResponse {
  edit_type: string;     // "rewrite" | "shorten" | "clarify" | "delete"
  target_line: number;   // Which line to modify
  constraints: string[]; // Any constraints the model noted
  rewritten_text: string;// New text (empty for delete)
  reason: string;        // Explanation of the change
}
```
