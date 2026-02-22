'use client';

import { useState } from 'react';

interface RevisionInputProps {
  disabled?: boolean;
  onApply: (instruction: string) => Promise<void>;
}

// TODO: Add suggestion chips for common revision types (shorten, clarify, rewrite)
// TODO: Add history of past instructions
// TODO: Support natural language shortcuts like "make line 3 shorter"
export default function RevisionInput({ disabled, onApply }: RevisionInputProps) {
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

  return (
    <div className="revision-input">
      <h2>✏️ Revision</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={instruction}
          onChange={e => setInstruction(e.target.value)}
          placeholder='e.g. "Rewrite line 2 to be shorter"'
          disabled={disabled || loading}
        />
        <button type="submit" disabled={disabled || loading || !instruction.trim()}>
          {loading ? 'Applying…' : 'Apply Revision'}
        </button>
      </form>
    </div>
  );
}
