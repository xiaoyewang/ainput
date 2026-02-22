import { SessionMetrics } from './types';

export function logMetrics(metrics: SessionMetrics) {
  console.log('=== Session Metrics ===');
  console.log('Total revisions:', metrics.totalRevisions);
  if (metrics.revisionTimestamps.length > 1) {
    const gaps = [];
    for (let i = 1; i < metrics.revisionTimestamps.length; i++) {
      gaps.push(metrics.revisionTimestamps[i] - metrics.revisionTimestamps[i - 1]);
    }
    console.log(
      'Avg time between revisions:',
      Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length),
      'ms'
    );
  }
  console.log('Edit types:', metrics.editTypes);
}
