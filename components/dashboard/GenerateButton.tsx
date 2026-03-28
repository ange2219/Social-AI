'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const STEPS = [
  'Analyse du profil de marque',
  'Tendances du secteur',
  'Génération des sujets',
  'Rédaction captions & hashtags',
  'Sélection des images',
  'Programmation automatique',
]

export function GenerateButton() {
  const [open, setOpen] = useState(false)
  const [stepStates, setStepStates] = useState<string[]>(STEPS.map(() => ''))
  const router = useRouter()

  async function startGen() {
    setStepStates(STEPS.map(() => ''))
    setOpen(true)

    // Appel API en parallèle
    fetch('/api/ai/generate-week', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tone: 'professionnel', platforms: ['instagram', 'facebook'] }),
    }).catch(() => {})

    // Animer — 680ms entre chaque étape, identique au mockup
    for (let i = 0; i < STEPS.length; i++) {
      setStepStates(prev => prev.map((s, idx) =>
        idx === i ? 'on' : idx < i ? 'done' : ''
      ))
      await new Promise(r => setTimeout(r, 680))
    }
    setStepStates(STEPS.map(() => 'done'))
    await new Promise(r => setTimeout(r, 500))
    setOpen(false)
    router.push('/create')
  }

  return (
    <>
      <button className="btn-gen" onClick={startGen}>
        <div className="btn-gen-dot" />
        Générer maintenant
      </button>

      {/* gen-ov — structure identique au mockup */}
      {open && (
        <div className="gen-ov on">
          <div className="spin" />
          <div className="gen-label">Génération en cours…</div>
          <div className="gen-steps">
            {STEPS.map((label, i) => (
              <div key={i} className={`gs${stepStates[i] ? ' ' + stepStates[i] : ''}`}>
                <div className="gs-d" />
                {label}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
