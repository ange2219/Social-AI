'use client'

import { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/Toast'
import { PLATFORM_NAMES, PLATFORM_COLORS, FREE_PLATFORMS, PLAN_LIMITS } from '@/types'
import type { Platform, SocialAccount } from '@/types'
import { Link2, Unlink, CreditCard, User, Sparkles, ExternalLink } from 'lucide-react'

const PAID_PLATFORMS: Platform[] = ['tiktok', 'twitter', 'linkedin', 'youtube', 'pinterest']

export default function SettingsPage() {
  const { toast } = useToast()
  const [accounts, setAccounts] = useState<SocialAccount[]>([])
  const [userPlan, setUserPlan] = useState<'free' | 'premium' | 'business'>('free')
  const [brandName, setBrandName] = useState('')
  const [brandDesc, setBrandDesc] = useState('')
  const [savingBrand, setSavingBrand] = useState(false)

  useEffect(() => {
    fetch('/api/social/accounts').then(r => r.json()).then(setAccounts)
    fetch('/api/auth/me').then(r => r.json()).then((u: { plan?: 'free' | 'premium' | 'business' }) => {
      if (u?.plan) setUserPlan(u.plan)
    })
  }, [])

  async function connectMeta() {
    window.location.href = '/api/auth/meta/start'
  }

  async function connectAyrshare() {
    const res = await fetch('/api/social/connect', { method: 'POST' })
    const data = await res.json()
    if (!res.ok) { toast(data.error, 'error'); return }
    window.open(data.url, '_blank')
  }

  async function disconnect(id: string) {
    const res = await fetch(`/api/social/accounts?id=${id}`, { method: 'DELETE' })
    if (res.ok) {
      setAccounts(prev => prev.filter(a => a.id !== id))
      toast('Compte déconnecté', 'success')
    }
  }

  async function handleUpgrade(plan: 'premium' | 'business') {
    const res = await fetch('/api/billing/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    })
    const data = await res.json()
    if (data.url) window.location.href = data.url
  }

  async function handlePortal() {
    const res = await fetch('/api/billing/portal', { method: 'POST' })
    const data = await res.json()
    if (data.url) window.location.href = data.url
    else toast(data.error, 'error')
  }

  async function saveBrandProfile() {
    setSavingBrand(true)
    const res = await fetch('/api/brand', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brand_name: brandName, description: brandDesc }),
    })
    setSavingBrand(false)
    toast(res.ok ? 'Profil de marque sauvegardé' : 'Erreur', res.ok ? 'success' : 'error')
  }

  const connectedPlatforms = new Set(accounts.map(a => a.platform))
  const limits = PLAN_LIMITS[userPlan]

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-t1">Paramètres</h1>
        <p className="text-t3 text-sm mt-0.5">Gérez vos comptes et préférences</p>
      </div>

      {/* Social accounts */}
      <section className="card p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <Link2 size={18} className="text-accent" />
          <h2 className="font-medium text-t1">Réseaux sociaux connectés</h2>
        </div>

        <div className="space-y-3 mb-4">
          {/* Free platforms */}
          {FREE_PLATFORMS.map(p => {
            const connected = accounts.find(a => a.platform === p)
            return (
              <div key={p} className="flex items-center justify-between p-3 bg-s2 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: PLATFORM_COLORS[p] }} />
                  <div>
                    <div className="text-t1 text-sm font-medium">{PLATFORM_NAMES[p]}</div>
                    {connected && <div className="text-t3 text-xs">@{connected.platform_username}</div>}
                  </div>
                </div>
                {connected ? (
                  <button onClick={() => disconnect(connected.id)} className="btn-ghost text-xs flex items-center gap-1.5 text-red hover:text-red">
                    <Unlink size={13} /> Déconnecter
                  </button>
                ) : (
                  <button onClick={connectMeta} className="btn-outline text-xs flex items-center gap-1.5">
                    <Link2 size={13} /> Connecter
                  </button>
                )}
              </div>
            )
          })}

          {/* Paid platforms */}
          {PAID_PLATFORMS.map(p => {
            const connected = accounts.find(a => a.platform === p)
            const isPaid = userPlan !== 'free'
            return (
              <div key={p} className="flex items-center justify-between p-3 bg-s2 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: isPaid ? PLATFORM_COLORS[p] : '#3f3f46' }} />
                  <div>
                    <div className={`text-sm font-medium ${isPaid ? 'text-t1' : 'text-t3'}`}>{PLATFORM_NAMES[p]}</div>
                    {connected && <div className="text-t3 text-xs">@{connected.platform_username}</div>}
                  </div>
                  {!isPaid && <span className="badge badge-gray text-xs ml-1">Premium</span>}
                </div>
                {isPaid ? (
                  connected ? (
                    <button onClick={() => disconnect(connected.id)} className="btn-ghost text-xs flex items-center gap-1.5 text-red hover:text-red">
                      <Unlink size={13} /> Déconnecter
                    </button>
                  ) : (
                    <button onClick={connectAyrshare} className="btn-outline text-xs flex items-center gap-1.5">
                      <Link2 size={13} /> Connecter
                    </button>
                  )
                ) : (
                  <span className="text-t3 text-xs">Non disponible</span>
                )}
              </div>
            )
          })}
        </div>

        <p className="text-t3 text-xs">
          {userPlan === 'free'
            ? `Plan gratuit : ${limits.platforms} plateformes (Instagram + Facebook)`
            : `Plan ${userPlan} : jusqu'à ${limits.platforms === 999 ? 'toutes les' : limits.platforms} plateformes`}
        </p>
      </section>

      {/* Brand profile */}
      <section className="card p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <Sparkles size={18} className="text-accent" />
          <h2 className="font-medium text-t1">Profil de marque</h2>
        </div>
        <p className="text-t3 text-sm mb-4">Ces informations enrichissent la génération IA pour que les posts correspondent parfaitement à votre marque.</p>
        <div className="space-y-4">
          <div>
            <label className="label">Nom de la marque</label>
            <input className="input" placeholder="Ex: Pixel Agency" value={brandName} onChange={e => setBrandName(e.target.value)} />
          </div>
          <div>
            <label className="label">Description de la marque</label>
            <textarea className="input resize-none" rows={3} placeholder="Ce que vous faites, vos valeurs, votre audience cible..." value={brandDesc} onChange={e => setBrandDesc(e.target.value)} />
          </div>
          <button onClick={saveBrandProfile} disabled={savingBrand} className="btn-primary flex items-center gap-2">
            <User size={15} />
            {savingBrand ? 'Sauvegarde...' : 'Sauvegarder le profil'}
          </button>
        </div>
      </section>

      {/* Billing */}
      <section className="card p-6">
        <div className="flex items-center gap-2 mb-5">
          <CreditCard size={18} className="text-accent" />
          <h2 className="font-medium text-t1">Abonnement</h2>
        </div>

        <div className="flex items-center gap-3 mb-5 p-3 bg-s2 rounded-lg">
          <div className={`badge ${userPlan === 'free' ? 'badge-gray' : userPlan === 'premium' ? 'badge-blue' : 'badge-yellow'}`}>
            {userPlan === 'free' ? 'Gratuit' : userPlan === 'premium' ? 'Premium' : 'Business'}
          </div>
          <div className="text-t2 text-sm">
            {userPlan === 'free' ? '3 posts/semaine · 2 plateformes' :
             userPlan === 'premium' ? '30 posts/semaine · 5 plateformes · Scheduling' :
             'Illimité · Toutes plateformes · 3 workspaces'}
          </div>
        </div>

        {userPlan === 'free' ? (
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => handleUpgrade('premium')} className="btn-primary flex items-center justify-center gap-2">
              <ExternalLink size={15} /> Premium — 29€/mois
            </button>
            <button onClick={() => handleUpgrade('business')} className="btn-outline flex items-center justify-center gap-2">
              <ExternalLink size={15} /> Business — 79€/mois
            </button>
          </div>
        ) : (
          <button onClick={handlePortal} className="btn-outline flex items-center gap-2">
            <CreditCard size={15} /> Gérer mon abonnement
          </button>
        )}
      </section>
    </div>
  )
}
