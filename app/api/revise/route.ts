import { NextRequest, NextResponse } from 'next/server';
import { RevisionRequest, RevisionResponse } from '../../lib/types';

export async function POST(req: NextRequest) {
  try {
    const body: RevisionRequest = await req.json();
    const { lines, instruction } = body;

    const prompt = `You are a text revision assistant. Given numbered lines and a revision instruction, return a JSON object.

Lines:
${lines.map(l => `${l.id}: ${l.text}`).join('\n')}

Instruction: ${instruction}

Return ONLY valid JSON:
{"edit_type":"rewrite|shorten|clarify|delete","target_line":<number>,"constraints":[],"rewritten_text":"<new text>","reason":"<why>"}

If no valid line number is specified, return: {"error":"Please specify a valid line number."}`;

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.3,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: 'OpenAI API error', detail: err }, { status: 502 });
    }

    const data = await res.json();
    const result: RevisionResponse = JSON.parse(data.choices[0].message.content);
    return NextResponse.json(result);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
