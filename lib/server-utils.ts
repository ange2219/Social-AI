import { createAdminClient } from './supabase/server'
import type { Plan } from '@/types'
import { PLAN_LIMITS } from '@/types'

/** Vérifie si un user a atteint sa limite de générations journalières — SERVER ONLY */
export async function checkGenerationLimit(userId: string, plan: Plan): Promise<{
  allowed: boolean
  used: number
  limit: number | 'unlimited'
}> {
  const limits = PLAN_LIMITS[plan]

  if (limits.generationsPerDay === 'unlimited') {
    return { allowed: true, used: 0, limit: 'unlimited' }
  }

  const supabase = createAdminClient()
  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)

  const { count } = await supabase
    .from('posts')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('ai_generated', true)
    .gte('created_at', startOfDay.toISOString())

  const used = count ?? 0
  return {
    allowed: used < (limits.generationsPerDay as number),
    used,
    limit: limits.generationsPerDay,
  }
}
