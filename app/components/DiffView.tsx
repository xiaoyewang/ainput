'use client';

import { Line, RevisionResponse } from '../lib/types';

interface DiffViewProps {
  originalLines: Line[];
  revision: RevisionResponse | null;
  updatedLines: Line[];
}

// TODO: Add character-level diff highlighting within the changed line
// TODO: Support multi-line diffs
// TODO: Add accept/reject buttons per change
export default function DiffView({ originalLines, revision, updatedLines }: DiffViewProps) {
  if (!revision) return null;

  const targetId = revision.target_line;
  const originalLine = originalLines.find(l => l.id === targetId);

  return (
    <div className="diff-view">
      <h2>🔍 Diff</h2>
      <p className="revision-reason">
        <strong>Edit type:</strong> {revision.edit_type} — {revision.reason}
      </p>

      {revision.edit_type === 'delete' ? (
        <div className="diff-block">
          <div className="diff-removed">
            <span className="diff-marker">−</span>
            <span className="line-number">{targetId}.</span>
            <span className="line-text">{originalLine?.text}</span>
          </div>
          <div className="diff-note">(line deleted)</div>
        </div>
      ) : (
        <div className="diff-block">
          <div className="diff-removed">
            <span className="diff-marker">−</span>
            <span className="line-number">{targetId}.</span>
            <span className="line-text">{originalLine?.text}</span>
          </div>
          <div className="diff-added">
            <span className="diff-marker">+</span>
            <span className="line-number">{targetId}.</span>
            <span className="line-text">{revision.rewritten_text}</span>
          </div>
        </div>
      )}

      <details className="diff-full">
        <summary>Full updated transcript ({updatedLines.length} lines)</summary>
        <ol>
          {updatedLines.map(line => (
            <li
              key={line.id}
              className={line.id === targetId ? 'diff-changed-line' : ''}
            >
              <span className="line-number">{line.id}.</span> {line.text}
            </li>
          ))}
        </ol>
      </details>
    </div>
  );
}
