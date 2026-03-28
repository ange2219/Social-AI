import type { Platform } from '@/types'

const AYRSHARE_BASE = 'https://app.ayrshare.com/api'
const API_KEY = process.env.AYRSHARE_API_KEY!

async function ayrshareRequest(path: string, options: RequestInit = {}) {
  const res = await fetch(`${AYRSHARE_BASE}${path}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(err.message || `Ayrshare error ${res.status}`)
  }

  return res.json()
}

/** Crée un profil Ayrshare pour un utilisateur */
export async function createProfile(userId: string, title: string): Promise<string> {
  const data = await ayrshareRequest('/profiles/user', {
    method: 'POST',
    body: JSON.stringify({ title, internalRef: userId }),
  })
  return data.profileKey as string
}

/** Génère un lien de connexion JWT pour qu'un utilisateur connecte ses réseaux */
export async function getConnectUrl(profileKey: string): Promise<string> {
  const data = await ayrshareRequest(`/profiles/generateJWT?profileKey=${profileKey}`)
  return data.url as string
}

/** Publie un post via Ayrshare */
export async function publishPost(params: {
  profileKey: string
  content: string
  platforms: Platform[]
  mediaUrls?: string[]
  scheduleDate?: string
}) {
  const body: Record<string, unknown> = {
    post: params.content,
    platforms: params.platforms,
    profileKey: params.profileKey,
  }

  if (params.mediaUrls?.length) body.mediaUrls = params.mediaUrls
  if (params.scheduleDate) body.scheduleDate = params.scheduleDate

  return ayrshareRequest('/post', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

/** Récupère les analytics d'un post Ayrshare */
export async function getPostAnalytics(ayrsharePostId: string, profileKey: string) {
  return ayrshareRequest(`/analytics/post?id=${ayrsharePostId}&profileKey=${profileKey}`)
}

/** Supprime un post Ayrshare programmé */
export async function deleteScheduledPost(ayrsharePostId: string, profileKey: string) {
  return ayrshareRequest('/post', {
    method: 'DELETE',
    body: JSON.stringify({ id: ayrsharePostId, profileKey }),
  })
}
