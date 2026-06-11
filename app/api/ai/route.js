
import { NextResponse } from 'next/server';

export async function POST(req) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return NextResponse.json({ error:'ANTHROPIC_API_KEY not configured. Add it in Vercel environment variables.' }, { status:503 });

  const { action, text, targetLang } = await req.json();
  if (!text) return NextResponse.json({ error:'No text provided' }, { status:400 });

  const prompts = {
    summarize: `You are a document analyst. Provide a clear, structured summary of the following PDF content. Use headers and bullet points. Be concise but comprehensive.\n\n${text.slice(0,12000)}`,
    translate: `Translate the following document text into ${targetLang||'Spanish'}. Preserve paragraph structure and formatting as much as possible.\n\n${text.slice(0,12000)}`,
    chat: text,
  };
  const prompt = prompts[action] || prompts.summarize;

  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type':'application/json', 'x-api-key':key, 'anthropic-version':'2023-06-01' },
      body: JSON.stringify({ model:'claude-sonnet-4-5', max_tokens:2048, messages:[{ role:'user', content:prompt }] }),
    });
    const data = await resp.json();
    if (!resp.ok) return NextResponse.json({ error: data.error?.message || 'API error' }, { status:resp.status });
    const result = data.content?.[0]?.text || '';
    return NextResponse.json({ result });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status:500 });
  }
}
