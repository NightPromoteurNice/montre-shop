import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { name, brand } = await req.json()

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 150,
      messages: [
        {
          role: 'user',
          content: `Write a 40-word product description for: ${brand} ${name}. Include: movement, water resistance, dial, bracelet. Luxury tone. English only. No words: replica, fake, clone.`
        }
      ]
    })
  })

  const data = await response.json()
  const description = data.content?.[0]?.text || ''

  return NextResponse.json({ description })
}