export interface Line {
  id: number;
  text: string;
}

export interface TranscriptState {
  lines: Line[];
  versions: VersionEntry[];
  currentVersionId: string;
}

export interface RevisionRequest {
  lines: Line[];
  instruction: string;
}

export interface RevisionResponse {
  edit_type: string;
  target_line: number;
  constraints: string[];
  rewritten_text: string;
  reason: string;
}

export interface VersionEntry {
  version_id: string;
  timestamp: number;
  lines: Line[];
}

export interface SessionMetrics {
  totalRevisions: number;
  revisionTimestamps: number[];
  editTypes: Record<string, number>;
}
