'use client';

import { useState, useRef } from 'react';
import { Line } from '../lib/types';

interface RecorderProps {
  onTranscription: (lines: Line[], rawText: string) => void;
}

// TODO: Add visual waveform feedback during recording
// TODO: Support pause/resume recording
// TODO: Add audio level meter
export default function Recorder({ onTranscription }: RecorderProps) {
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  async function startRecording() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      chunksRef.current = [];

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mr.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await sendToTranscribe(blob);
      };

      mr.start();
      setRecording(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Could not access microphone');
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    setLoading(true);
  }

  async function sendToTranscribe(blob: Blob) {
    try {
      const form = new FormData();
      form.append('audio', blob, 'audio.webm');
      const res = await fetch('/api/transcribe', { method: 'POST', body: form });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      onTranscription(data.lines, data.text);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Transcription failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="recorder">
      <h2>🎙 Voice Input</h2>
      {error && <p className="error">{error}</p>}
      {loading && <p className="loading">Transcribing…</p>}
      {!recording ? (
        <button onClick={startRecording} disabled={loading}>
          Start Recording
        </button>
      ) : (
        <button onClick={stopRecording} className="stop">
          Stop Recording
        </button>
      )}
    </div>
  );
}
