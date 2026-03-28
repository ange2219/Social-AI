'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Mail } from 'lucide-react'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/api/auth/confirm?type=recovery`,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSent(true)
    }
  }

  if (sent) {
    return (
      <div className="text-center">
        <div className="w-14 h-14 rounded-full bg-green/10 flex items-center justify-center mx-auto mb-4">
          <Mail size={24} className="text-green" />
        </div>
        <h1 className="font-display text-2xl font-bold text-t1 mb-2">Email envoyé</h1>
        <p className="text-t3 text-sm mb-6">
          Un lien de réinitialisation a été envoyé à <strong className="text-t2">{email}</strong>.
          Vérifiez vos spams si vous ne le voyez pas.
        </p>
        <Link href="/login" className="text-accent text-sm hover:underline">
          Retour à la connexion
        </Link>
      </div>
    )
  }

  return (
    <>
      <Link href="/login" className="flex items-center gap-1.5 text-t3 text-sm hover:text-t2 mb-6 transition-colors">
        <ArrowLeft size={14} /> Retour
      </Link>

      <h1 className="font-display text-2xl font-bold text-t1 mb-1">Mot de passe oublié</h1>
      <p className="text-t3 text-sm mb-8">On vous envoie un lien de réinitialisation</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Email</label>
          <input
            type="email"
            className="input"
            placeholder="vous@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        {error && (
          <div className="bg-red/5 border border-red/20 text-red text-sm rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
          {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
        </button>
      </form>
    </>
  )
}
