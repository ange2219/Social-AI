import { NextRequest, NextResponse } from 'next/server'
import { verifyInternalSecret } from '@/lib/n8n'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-internal-secret') || ''
  if (!verifyInternalSecret(secret)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { analytics } = await req.json()
  if (!Array.isArray(analytics)) {
    return NextResponse.json({ error: 'analytics array requis' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { error } = await admin.from('analytics').insert(
    analytics.map((a: {
      post_id: string
      platform: string
      likes?: number
      comments?: number
      shares?: number
      reach?: number
      impressions?: number
    }) => ({
      post_id: a.post_id,
      platform: a.platform,
      likes: a.likes || 0,
      comments: a.comments || 0,
      shares: a.shares || 0,
      reach: a.reach || 0,
      impressions: a.impressions || 0,
    }))
  )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, count: analytics.length })
}
