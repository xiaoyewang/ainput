import { Line } from './types';

export function segmentText(text: string): Line[] {
  const raw = text
    .split(/(?<=[.?!;,])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  const segments: string[] = [];
  for (const sentence of raw) {
    const words = sentence.split(/\s+/);
    if (words.length > 25) {
      const mid = Math.ceil(words.length / 2);
      segments.push(words.slice(0, mid).join(' '));
      segments.push(words.slice(mid).join(' '));
    } else {
      segments.push(sentence);
    }
  }

  return segments.map((text, i) => ({ id: i + 1, text }));
}
