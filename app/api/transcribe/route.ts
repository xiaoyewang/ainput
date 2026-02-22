import { NextRequest, NextResponse } from 'next/server';
import { segmentText } from '../../lib/segmenter';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audio = formData.get('audio') as Blob;
    if (!audio) return NextResponse.json({ error: 'No audio provided' }, { status: 400 });

    const openaiForm = new FormData();
    openaiForm.append('file', audio, 'audio.webm');
    openaiForm.append('model', 'whisper-1');

    const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: openaiForm,
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: 'Whisper API error', detail: err }, { status: 502 });
    }

    const { text } = await res.json();
    const lines = segmentText(text);
    return NextResponse.json({ text, lines });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
