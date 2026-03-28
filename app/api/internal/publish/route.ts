import { NextRequest, NextResponse } from 'next/server'
import { verifyInternalSecret } from '@/lib/n8n'

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-internal-secret') || ''
  if (!verifyInternalSecret(secret)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { postId } = await req.json()
  if (!postId) return NextResponse.json({ error: 'postId requis' }, { status: 400 })

  // Appel interne à la route de publication
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!
  const res = await fetch(`${appUrl}/api/posts/${postId}/publish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-internal-secret': secret,
    },
  })

  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
