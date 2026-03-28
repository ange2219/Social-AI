import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { schedulePost } from '@/lib/n8n'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const { data: userProfile } = await admin
    .from('users')
    .select('plan')
    .eq('id', user.id)
    .single()

  if (userProfile?.plan === 'free') {
    return NextResponse.json({ error: 'Le scheduling nécessite un plan payant' }, { status: 403 })
  }

  const { scheduledAt } = await req.json()
  if (!scheduledAt) return NextResponse.json({ error: 'scheduledAt requis' }, { status: 400 })

  const scheduledDate = new Date(scheduledAt)
  if (scheduledDate <= new Date()) {
    return NextResponse.json({ error: 'La date doit être dans le futur' }, { status: 400 })
  }

  const { data: post, error } = await supabase
    .from('posts')
    .update({ status: 'scheduled', scheduled_at: scheduledDate.toISOString() })
    .eq('id', params.id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error || !post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

  // Notifie n8n pour exécuter la publication à l'heure prévue
  await schedulePost({ postId: post.id, userId: user.id, scheduledAt: scheduledDate.toISOString() })

  return NextResponse.json({ success: true, scheduled_at: post.scheduled_at })
}
