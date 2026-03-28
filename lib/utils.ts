import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Plan, PlanLimits } from '@/types'
import { PLAN_LIMITS } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return n.toString()
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getPlanLimits(plan: Plan): PlanLimits {
  return PLAN_LIMITS[plan]
}

export function encryptToken(token: string): string {
  return Buffer.from(token).toString('base64')
}

export function decryptToken(encrypted: string): string {
  return Buffer.from(encrypted, 'base64').toString('utf-8')
}
