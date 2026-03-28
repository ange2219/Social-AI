import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { createBillingPortalSession } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const { data: userProfile } = await admin
    .from('users')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single()

  if (!userProfile?.stripe_customer_id) {
    return NextResponse.json({ error: 'Aucun abonnement actif' }, { status: 400 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL!
  const session = await createBillingPortalSession(
    userProfile.stripe_customer_id,
    `${appUrl}/settings`
  )

  return NextResponse.json({ url: session.url })
}
