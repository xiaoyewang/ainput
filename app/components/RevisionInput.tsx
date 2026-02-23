'use client';

import { useState } from 'react';

interface RevisionInputProps {
  disabled?: boolean;
  onApply: (instruction: string) => Promise<void>;
  lineCount?: number;
}

const SUGGESTIONS = [
  { label: '✂️ Shorten', template: 'Shorten line {n}' },
  { label: '🔍 Clarify', template: 'Clarify line {n}' },
  { label: '✏️ Rewrite', template: 'Rewrite line {n} to be more formal' },
  { label: '🗑 Delete', template: 'Delete line {n}' },
];

export default function RevisionInput({ disabled, onApply, lineCount }: RevisionInputProps) {
  const [instruction, setInstruction] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!instruction.trim()) return;
    setLoading(true);
    try {
      await onApply(instruction.trim());
      setInstruction('');
    } finally {
      setLoading(false);
    }
  }

  function applySuggestion(template: string) {
    // Default to line 1, user can change
    const text = template.replace('{n}', '1');
    setInstruction(text);
  }

  return (
    <div className="revision-input">
      <h2>✏️ Revision</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={instruction}
          onChange={e => setInstruction(e.target.value)}
          placeholder={lineCount ? `e.g. "Rewrite line 2 to be shorter" (${lineCount} lines)` : 'e.g. "Rewrite line 2 to be shorter"'}
          disabled={disabled || loading}
        />
        <button type="submit" disabled={disabled || loading || !instruction.trim()}>
          {loading ? 'Applying…' : 'Apply'}
        </button>
      </form>
      <div className="suggestion-chips">
        {SUGGESTIONS.map(s => (
          <button
            key={s.label}
            className="chip"
            type="button"
            onClick={() => applySuggestion(s.template)}
            disabled={disabled || loading}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
