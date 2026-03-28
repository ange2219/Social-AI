import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { suggestHashtags } from '@/lib/claude'
import type { Platform } from '@/types'

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { content, platform } = await req.json()
  if (!content || !platform) {
    return NextResponse.json({ error: 'content et platform requis' }, { status: 400 })
  }

  try {
    const hashtags = await suggestHashtags(content, platform as Platform)
    return NextResponse.json({ hashtags })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Hashtag suggestion failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
