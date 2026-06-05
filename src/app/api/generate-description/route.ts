import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export async function POST(req: NextRequest) {
  const { name, brand } = await req.json()

  const message = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 200,
    messages: [
      {
        role: 'user',
        content: `Write a short professional product description for this watch: ${brand} ${name}. Include movement type, water resistance, dial, bracelet, crystal, key features. Max 60 words. English only. Write like a luxury watch site. No words like replica, fake, clone.`
      }
    ]
  })

  const description = (message.content[0] as { text: string }).text

  return NextResponse.json({ description })
}