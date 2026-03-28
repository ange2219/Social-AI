import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rewritePost } from '@/lib/claude'
import type { Platform } from '@/types'

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { content, platform, instruction } = await req.json()
  if (!content || !platform || !instruction) {
    return NextResponse.json({ error: 'content, platform et instruction requis' }, { status: 400 })
  }

  try {
    const result = await rewritePost(content, platform as Platform, instruction)
    return NextResponse.json({ content: result })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Rewrite failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
