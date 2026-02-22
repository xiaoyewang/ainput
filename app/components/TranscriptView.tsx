'use client';

import { Line } from '../lib/types';

interface TranscriptViewProps {
  lines: Line[];
  highlightedLineId?: number | null;
}

// TODO: Add inline editing by clicking on a line
// TODO: Add line selection for targeted revisions
// TODO: Animate line changes
export default function TranscriptView({ lines, highlightedLineId }: TranscriptViewProps) {
  if (lines.length === 0) {
    return (
      <div className="transcript-empty">
        <p>No transcript yet. Start recording to see numbered lines here.</p>
      </div>
    );
  }

  return (
    <div className="transcript-view">
      <h2>📄 Transcript</h2>
      <ol>
        {lines.map(line => (
          <li
            key={line.id}
            className={`transcript-line${line.id === highlightedLineId ? ' highlighted' : ''}`}
          >
            <span className="line-number">{line.id}.</span>
            <span className="line-text">{line.text}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
