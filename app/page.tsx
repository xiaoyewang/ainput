'use client';

import { useState } from 'react';
import Recorder from './components/Recorder';
import TranscriptView from './components/TranscriptView';
import RevisionInput from './components/RevisionInput';
import DiffView from './components/DiffView';
import { Line, RevisionResponse, VersionEntry } from './lib/types';

export default function Home() {
  const [lines, setLines] = useState<Line[]>([]);
  const [rawText, setRawText] = useState('');
  const [versions, setVersions] = useState<VersionEntry[]>([]);
  const [lastRevision, setLastRevision] = useState<RevisionResponse | null>(null);
  const [prevLines, setPrevLines] = useState<Line[]>([]);
  const [highlightedLineId, setHighlightedLineId] = useState<number | null>(null);
  const [revisionError, setRevisionError] = useState<string | null>(null);

  // Called when Recorder delivers a transcription
  function handleTranscription(newLines: Line[], text: string) {
    setLines(newLines);
    setRawText(text);
    setLastRevision(null);
    setPrevLines([]);
    setHighlightedLineId(null);
    setRevisionError(null);
    // Save as version 1
    const v: VersionEntry = {
      version_id: crypto.randomUUID(),
      timestamp: Date.now(),
      lines: JSON.parse(JSON.stringify(newLines)),
    };
    setVersions([v]);
  }

  // Called when RevisionInput submits an instruction
  async function handleRevision(instruction: string) {
    setRevisionError(null);
    const res = await fetch('/api/revise', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lines, instruction }),
    });
    const data: RevisionResponse & { error?: string } = await res.json();

    if (data.error) {
      setRevisionError(data.error);
      return;
    }

    setPrevLines(JSON.parse(JSON.stringify(lines)));
    setLastRevision(data);

    // Apply the revision to lines
    let updatedLines: Line[];
    if (data.edit_type === 'delete') {
      updatedLines = lines.filter(l => l.id !== data.target_line);
      // Re-number
      updatedLines = updatedLines.map((l, i) => ({ ...l, id: i + 1 }));
    } else {
      updatedLines = lines.map(l =>
        l.id === data.target_line ? { ...l, text: data.rewritten_text } : l
      );
    }

    setLines(updatedLines);
    setHighlightedLineId(data.target_line);

    // Save version snapshot
    const v: VersionEntry = {
      version_id: crypto.randomUUID(),
      timestamp: Date.now(),
      lines: JSON.parse(JSON.stringify(updatedLines)),
    };
    setVersions(prev => [...prev, v]);
  }

  return (
    <main className="container">
      <header>
        <h1>AINput</h1>
        <p className="subtitle">AI-native structured voice input with real-time revision</p>
      </header>

      <section className="panel">
        <Recorder onTranscription={handleTranscription} />
      </section>

      {lines.length > 0 && (
        <>
          <section className="panel">
            <TranscriptView lines={lines} highlightedLineId={highlightedLineId} />
          </section>

          <section className="panel">
            <RevisionInput disabled={lines.length === 0} onApply={handleRevision} />
            {revisionError && <p className="error">{revisionError}</p>}
          </section>

          {lastRevision && (
            <section className="panel">
              <DiffView
                originalLines={prevLines}
                revision={lastRevision}
                updatedLines={lines}
              />
            </section>
          )}

          <section className="panel versions">
            <h2>🕓 Version History ({versions.length})</h2>
            <ul>
              {versions.map((v, i) => (
                <li key={v.version_id}>
                  v{i + 1} — {new Date(v.timestamp).toLocaleTimeString()} — {v.lines.length} lines
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      {rawText && (
        <section className="panel raw-text">
          <details>
            <summary>Raw transcript text</summary>
            <p>{rawText}</p>
          </details>
        </section>
      )}
    </main>
  );
}
