import { Line, VersionEntry, SessionMetrics } from './types';
import { randomUUID } from 'crypto';

const sessions = new Map<string, { versions: VersionEntry[]; metrics: SessionMetrics }>();

export function getOrCreateSession(sessionId: string) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, {
      versions: [],
      metrics: { totalRevisions: 0, revisionTimestamps: [], editTypes: {} },
    });
  }
  return sessions.get(sessionId)!;
}

export function addVersion(sessionId: string, lines: Line[]): VersionEntry {
  const session = getOrCreateSession(sessionId);
  const entry: VersionEntry = {
    version_id: randomUUID(),
    timestamp: Date.now(),
    lines: JSON.parse(JSON.stringify(lines)),
  };
  session.versions.push(entry);
  return entry;
}

export function getVersions(sessionId: string): VersionEntry[] {
  return getOrCreateSession(sessionId).versions;
}

export function recordRevision(sessionId: string, editType: string) {
  const session = getOrCreateSession(sessionId);
  session.metrics.totalRevisions++;
  session.metrics.revisionTimestamps.push(Date.now());
  session.metrics.editTypes[editType] = (session.metrics.editTypes[editType] || 0) + 1;
  console.log('[Metrics]', JSON.stringify(session.metrics));
}
